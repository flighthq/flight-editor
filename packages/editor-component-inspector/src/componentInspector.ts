import type { Command } from '@flighthq/editor-command';

import { createSnapshotCommand } from '@flighthq/editor-command';

export type InspectorFieldKind = 'boolean' | 'color' | 'enum' | 'number' | 'reference' | 'string' | 'vector2';

export interface InspectorFieldSchema {
  readonly id: string;
  readonly label: string;
  readonly kind: InspectorFieldKind;
  readonly defaultValue: unknown;
  readonly enumValues?: readonly string[];
  readonly referenceKind?: string;
  readonly required?: boolean;
}

export interface InspectorComponentSchema {
  readonly typeId: string;
  readonly label: string;
  readonly ownerId: string;
  readonly version: number;
  readonly fields: readonly InspectorFieldSchema[];
  readonly migrate?: (properties: Readonly<Record<string, unknown>>, fromVersion: number) => Record<string, unknown>;
  readonly validate?: (properties: Readonly<Record<string, unknown>>) => readonly string[];
}

export interface InspectedComponent {
  readonly typeId: string;
  schemaVersion: number;
  enabled: boolean;
  properties: Record<string, unknown>;
}

export interface InspectorTarget {
  readonly id: string;
  locked: boolean;
  components: InspectedComponent[];
}

export interface ComponentInspectorState {
  schemas: Map<string, InspectorComponentSchema>;
  clipboard: InspectedComponent | null;
  version: number;
}

export interface InspectorFieldValue {
  readonly field: InspectorFieldSchema;
  readonly value: unknown;
  readonly mixed: boolean;
}

export interface InspectorSection {
  readonly typeId: string;
  readonly label: string;
  readonly known: boolean;
  readonly applicableToAll: boolean;
  readonly enabled: boolean | 'mixed';
  readonly locked: boolean;
  readonly fields: readonly InspectorFieldValue[];
  readonly raw: readonly Readonly<Record<string, unknown>>[];
  readonly diagnostics: readonly string[];
}

function copyComponent(component: Readonly<InspectedComponent>): InspectedComponent {
  return { ...component, properties: structuredClone(component.properties) };
}

function assertSchema(schema: Readonly<InspectorComponentSchema>): void {
  if (schema.typeId.trim() === '' || schema.label.trim() === '' || schema.ownerId.trim() === '') {
    throw new TypeError('Component schema identity must not be empty');
  }
  if (!Number.isSafeInteger(schema.version) || schema.version < 1)
    throw new TypeError('Schema version must be positive');
  const ids = new Set<string>();
  for (const field of schema.fields) {
    if (field.id.trim() === '' || ids.has(field.id)) throw new Error(`Invalid or duplicate field: ${field.id}`);
    if (field.kind === 'enum' && (field.enumValues === undefined || field.enumValues.length === 0)) {
      throw new Error(`Enum field requires values: ${field.id}`);
    }
    ids.add(field.id);
  }
}

function valueEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createComponentInspectorState(): ComponentInspectorState {
  return { schemas: new Map(), clipboard: null, version: 0 };
}

export function registerInspectorSchema(state: ComponentInspectorState, schema: InspectorComponentSchema): void {
  assertSchema(schema);
  if (state.schemas.has(schema.typeId)) throw new Error(`Component schema already registered: ${schema.typeId}`);
  state.schemas.set(schema.typeId, schema);
  state.version++;
}

export function unregisterInspectorOwner(state: ComponentInspectorState, ownerId: string): readonly string[] {
  const removed: string[] = [];
  for (const [typeId, schema] of state.schemas) {
    if (schema.ownerId === ownerId) {
      state.schemas.delete(typeId);
      removed.push(typeId);
    }
  }
  if (removed.length > 0) state.version++;
  return removed.sort();
}

export function migrateInspectedComponents(
  state: Readonly<ComponentInspectorState>,
  targets: readonly InspectorTarget[],
): readonly string[] {
  const migrated: string[] = [];
  for (const target of targets) {
    for (const component of target.components) {
      const schema = state.schemas.get(component.typeId);
      if (schema === undefined || component.schemaVersion >= schema.version) continue;
      if (schema.migrate === undefined) continue;
      component.properties = schema.migrate(structuredClone(component.properties), component.schemaVersion);
      component.schemaVersion = schema.version;
      migrated.push(`${target.id}:${component.typeId}`);
    }
  }
  return migrated.sort();
}

export function inspectComponents(
  state: Readonly<ComponentInspectorState>,
  targets: readonly Readonly<InspectorTarget>[],
): readonly InspectorSection[] {
  if (targets.length === 0) return [];
  const typeIds = new Set(targets.flatMap(({ components }) => components.map(({ typeId }) => typeId)));
  return Array.from(typeIds)
    .sort()
    .map((typeId) => {
      const schema = state.schemas.get(typeId);
      const components = targets.map((target) => target.components.find((item) => item.typeId === typeId));
      const present = components.filter((item): item is InspectedComponent => item !== undefined);
      const enabled = present.every((item) => item.enabled === present[0]!.enabled) ? present[0]!.enabled : 'mixed';
      const diagnostics = present.flatMap((component) => schema?.validate?.(component.properties) ?? []);
      return {
        typeId,
        label: schema?.label ?? typeId,
        known: schema !== undefined,
        applicableToAll: present.length === targets.length,
        enabled,
        locked: targets.some(({ locked }) => locked),
        fields: (schema?.fields ?? []).map((field) => {
          const values = present.map(({ properties }) => properties[field.id]);
          return { field, value: values[0], mixed: values.some((value) => !valueEqual(value, values[0])) };
        }),
        raw: present.map(({ properties }) => structuredClone(properties)),
        diagnostics: Array.from(new Set(diagnostics)).sort(),
      };
    });
}

export function mutateInspectedComponents(
  state: ComponentInspectorState,
  targets: readonly InspectorTarget[],
  mutation:
    | { readonly kind: 'add'; readonly typeId: string }
    | { readonly kind: 'remove' | 'reset'; readonly typeId: string }
    | { readonly kind: 'enable'; readonly typeId: string; readonly enabled: boolean }
    | { readonly kind: 'set'; readonly typeId: string; readonly fieldId: string; readonly value: unknown },
): number {
  const schema = state.schemas.get(mutation.typeId);
  if (mutation.kind === 'add' && schema === undefined) throw new Error(`Unknown component schema: ${mutation.typeId}`);
  let changed = 0;
  for (const target of targets) {
    if (target.locked) continue;
    const index = target.components.findIndex(({ typeId }) => typeId === mutation.typeId);
    const component = target.components[index];
    if (mutation.kind === 'add') {
      if (component !== undefined) continue;
      target.components.push({
        typeId: mutation.typeId,
        schemaVersion: schema!.version,
        enabled: true,
        properties: Object.fromEntries(schema!.fields.map((field) => [field.id, structuredClone(field.defaultValue)])),
      });
      changed++;
    } else if (mutation.kind === 'remove') {
      if (component === undefined) continue;
      target.components.splice(index, 1);
      changed++;
    } else if (component !== undefined && mutation.kind === 'enable' && component.enabled !== mutation.enabled) {
      component.enabled = mutation.enabled;
      changed++;
    } else if (component !== undefined && mutation.kind === 'reset' && schema !== undefined) {
      component.properties = Object.fromEntries(
        schema.fields.map((field) => [field.id, structuredClone(field.defaultValue)]),
      );
      component.schemaVersion = schema.version;
      changed++;
    } else if (component !== undefined && mutation.kind === 'set') {
      const field = schema?.fields.find(({ id }) => id === mutation.fieldId);
      if (field === undefined) throw new Error(`Unknown component field: ${mutation.fieldId}`);
      if (!valueEqual(component.properties[mutation.fieldId], mutation.value)) {
        component.properties[mutation.fieldId] = structuredClone(mutation.value);
        changed++;
      }
    }
  }
  if (changed > 0) state.version++;
  return changed;
}

export function copyPasteInspectedComponent(
  state: ComponentInspectorState,
  source: Readonly<InspectedComponent> | null,
  targets?: readonly InspectorTarget[],
): number {
  if (source !== null) {
    state.clipboard = copyComponent(source);
    state.version++;
    return 0;
  }
  if (state.clipboard === null || targets === undefined) return 0;
  let changed = 0;
  for (const target of targets) {
    if (target.locked) continue;
    const copy = copyComponent(state.clipboard);
    const index = target.components.findIndex(({ typeId }) => typeId === copy.typeId);
    if (index < 0) target.components.push(copy);
    else target.components[index] = copy;
    changed++;
  }
  if (changed > 0) state.version++;
  return changed;
}

export function createInspectorMutationCommand(
  state: ComponentInspectorState,
  targets: readonly InspectorTarget[],
  label: string,
  mutate: () => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: () => targets.map((target) => target.components.map(copyComponent)),
      restore: (snapshot) => {
        snapshot.forEach((components, index) => {
          targets[index]!.components = components.map(copyComponent);
        });
        state.version++;
      },
    },
    mutate,
  );
}
