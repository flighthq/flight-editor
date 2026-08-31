export interface ComponentDefinition {
  readonly id: string;
  readonly name: string;
  readonly sourceNodeId: string;
  /** Stable definition identities directly nested by the source. */
  readonly nestedDefinitionIds?: readonly string[];
  readonly descendantIds?: readonly string[];
  readonly variantDimensions?: readonly ComponentVariantDimension[];
}

export interface ComponentVariantDimension {
  readonly id: string;
  readonly values: readonly string[];
  readonly defaultValue: string;
}

export type ComponentOverrideKind = 'property' | 'added-descendant' | 'removed-descendant' | 'component';

export interface ComponentOverride {
  readonly propertyPath: string;
  readonly value: unknown;
  readonly descendantId?: string;
  readonly kind?: ComponentOverrideKind;
}

export interface ComponentInstance {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly overrides: ComponentOverride[];
  readonly variants?: Readonly<Record<string, string>>;
}

export interface ComponentState {
  definitions: Map<string, ComponentDefinition>;
  instances: Map<string, ComponentInstance>;
  version: number;
}

export interface ComponentDiagnostic {
  readonly code:
    | 'broken-source'
    | 'definition-cycle'
    | 'duplicate-override'
    | 'invalid-definition'
    | 'invalid-instance';
  readonly definitionId?: string;
  readonly instanceId?: string;
  readonly message: string;
}

export interface DetachedComponentInstance {
  readonly instanceId: string;
  readonly formerDefinitionId: string;
  readonly overrides: readonly ComponentOverride[];
}

export interface ComponentPropagationReport {
  readonly definitionId: string;
  readonly migratedInstances: readonly string[];
  readonly orphanedOverrides: readonly { readonly instanceId: string; readonly propertyPath: string }[];
}

function assertIdentity(value: string, label: string): void {
  if (value.trim() === '') throw new TypeError(`${label} must not be empty`);
}

function overrideKey(override: ComponentOverride): string {
  return `${override.kind ?? 'property'}\0${override.descendantId ?? ''}\0${override.propertyPath}`;
}

function copyOverrides(overrides: readonly ComponentOverride[]): ComponentOverride[] {
  const keys = new Set<string>();
  return overrides.map((override) => {
    if (override.propertyPath.trim() === '') throw new TypeError('Override property path must not be empty');
    const key = overrideKey(override);
    if (keys.has(key)) throw new Error(`Duplicate component override target: ${override.propertyPath}`);
    keys.add(key);
    return { ...override };
  });
}

function validateVariantDimensions(dimensions: readonly ComponentVariantDimension[] | undefined): void {
  const ids = new Set<string>();
  for (const dimension of dimensions ?? []) {
    if (dimension.id.trim() === '' || ids.has(dimension.id)) {
      throw new Error(`Invalid or duplicate variant dimension: ${dimension.id}`);
    }
    if (dimension.values.length === 0 || new Set(dimension.values).size !== dimension.values.length) {
      throw new Error(`Variant dimension values must be non-empty and unique: ${dimension.id}`);
    }
    if (!dimension.values.includes(dimension.defaultValue)) {
      throw new Error(`Variant default is not a declared value: ${dimension.id}`);
    }
    ids.add(dimension.id);
  }
}

export function createComponentState(): ComponentState {
  return { definitions: new Map(), instances: new Map(), version: 0 };
}

export function registerComponent(state: ComponentState, definition: ComponentDefinition): void {
  assertIdentity(definition.id, 'Component definition id');
  assertIdentity(definition.name, 'Component definition name');
  assertIdentity(definition.sourceNodeId, 'Component source node id');
  validateVariantDimensions(definition.variantDimensions);
  if (state.definitions.has(definition.id)) throw new Error(`Component definition already exists: ${definition.id}`);
  state.definitions.set(definition.id, {
    ...definition,
    nestedDefinitionIds: definition.nestedDefinitionIds?.slice(),
    descendantIds: definition.descendantIds?.slice(),
    variantDimensions: definition.variantDimensions?.map((dimension) => ({
      ...dimension,
      values: dimension.values.slice(),
    })),
  });
  state.version++;
}

export function unregisterComponent(state: ComponentState, definitionId: string): boolean {
  if (!state.definitions.delete(definitionId)) return false;
  state.version++;
  return true;
}

export function getComponentDefinition(
  state: Readonly<ComponentState>,
  definitionId: string,
): ComponentDefinition | undefined {
  return state.definitions.get(definitionId);
}

export function getComponentDefinitions(state: Readonly<ComponentState>): readonly ComponentDefinition[] {
  return Array.from(state.definitions.values()).sort(
    (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  );
}

export function getComponentDefinitionCount(state: Readonly<ComponentState>): number {
  return state.definitions.size;
}

export function addComponentInstance(state: ComponentState, instance: ComponentInstance): void {
  assertIdentity(instance.instanceId, 'Component instance id');
  assertIdentity(instance.definitionId, 'Component definition id');
  if (state.instances.has(instance.instanceId))
    throw new Error(`Component instance already exists: ${instance.instanceId}`);
  state.instances.set(instance.instanceId, {
    ...instance,
    overrides: copyOverrides(instance.overrides),
    variants: instance.variants === undefined ? undefined : { ...instance.variants },
  });
  state.version++;
}

export function removeComponentInstance(state: ComponentState, instanceId: string): boolean {
  if (!state.instances.delete(instanceId)) return false;
  state.version++;
  return true;
}

export function getComponentInstance(
  state: Readonly<ComponentState>,
  instanceId: string,
): ComponentInstance | undefined {
  return state.instances.get(instanceId);
}

export function getInstancesOfDefinition(
  state: Readonly<ComponentState>,
  definitionId: string,
): readonly ComponentInstance[] {
  const result: ComponentInstance[] = [];
  for (const instance of state.instances.values()) {
    if (instance.definitionId === definitionId) {
      result.push(instance);
    }
  }
  return result.sort((a, b) => a.instanceId.localeCompare(b.instanceId));
}

export function setInstanceOverrides(
  state: ComponentState,
  instanceId: string,
  overrides: readonly ComponentOverride[],
): boolean {
  const instance = state.instances.get(instanceId);
  if (!instance) return false;
  const next = copyOverrides(overrides);
  if (
    next.length === instance.overrides.length &&
    next.every(
      (override, index) =>
        overrideKey(override) === overrideKey(instance.overrides[index]!) &&
        override.value === instance.overrides[index]!.value,
    )
  ) {
    return false;
  }
  state.instances.set(instanceId, { ...instance, overrides: next });
  state.version++;
  return true;
}

export function clearInstanceOverrides(state: ComponentState, instanceId: string): boolean {
  const instance = state.instances.get(instanceId);
  if (!instance || instance.overrides.length === 0) return false;
  state.instances.set(instanceId, { ...instance, overrides: [] });
  state.version++;
  return true;
}

export function getComponentVersion(state: Readonly<ComponentState>): number {
  return state.version;
}

export function swapComponentInstance(
  state: ComponentState,
  instanceId: string,
  definitionId: string,
  preserveOverrides = true,
): boolean {
  assertIdentity(definitionId, 'Component definition id');
  const instance = state.instances.get(instanceId);
  if (instance === undefined || instance.definitionId === definitionId) return false;
  state.instances.set(instanceId, {
    ...instance,
    definitionId,
    overrides: preserveOverrides ? instance.overrides.slice() : [],
  });
  state.version++;
  return true;
}

export function relinkComponentDefinition(
  state: ComponentState,
  missingDefinitionId: string,
  replacementDefinitionId: string,
): number {
  if (!state.definitions.has(replacementDefinitionId)) {
    throw new Error(`Replacement component definition does not exist: ${replacementDefinitionId}`);
  }
  let changed = 0;
  for (const [id, instance] of state.instances) {
    if (instance.definitionId === missingDefinitionId) {
      state.instances.set(id, { ...instance, definitionId: replacementDefinitionId });
      changed++;
    }
  }
  if (changed > 0) state.version++;
  return changed;
}

export function detachComponentInstance(
  state: ComponentState,
  instanceId: string,
): DetachedComponentInstance | undefined {
  const instance = state.instances.get(instanceId);
  if (instance === undefined) return undefined;
  state.instances.delete(instanceId);
  state.version++;
  return {
    instanceId,
    formerDefinitionId: instance.definitionId,
    overrides: instance.overrides.map((override) => ({ ...override })),
  };
}

export function getBrokenComponentInstances(state: Readonly<ComponentState>): readonly ComponentInstance[] {
  return Array.from(state.instances.values())
    .filter((instance) => !state.definitions.has(instance.definitionId))
    .sort((a, b) => a.instanceId.localeCompare(b.instanceId));
}

function definitionParticipatesInCycle(
  state: Readonly<ComponentState>,
  definitionId: string,
  visiting: Set<string>,
  visited: Set<string>,
): boolean {
  if (visiting.has(definitionId)) return true;
  if (visited.has(definitionId)) return false;
  visiting.add(definitionId);
  const definition = state.definitions.get(definitionId);
  for (const nestedId of definition?.nestedDefinitionIds ?? []) {
    if (definitionParticipatesInCycle(state, nestedId, visiting, visited)) return true;
  }
  visiting.delete(definitionId);
  visited.add(definitionId);
  return false;
}

export function validateComponentState(state: Readonly<ComponentState>): readonly ComponentDiagnostic[] {
  const diagnostics: ComponentDiagnostic[] = [];
  for (const definition of Array.from(state.definitions.values()).sort((a, b) => a.id.localeCompare(b.id))) {
    if (definition.id.trim() === '' || definition.name.trim() === '' || definition.sourceNodeId.trim() === '') {
      diagnostics.push({
        code: 'invalid-definition',
        definitionId: definition.id,
        message: 'Definition identity is invalid',
      });
    }
    if (definitionParticipatesInCycle(state, definition.id, new Set(), new Set())) {
      diagnostics.push({
        code: 'definition-cycle',
        definitionId: definition.id,
        message: 'Definition nesting contains a cycle',
      });
    }
  }
  for (const instance of Array.from(state.instances.values()).sort((a, b) =>
    a.instanceId.localeCompare(b.instanceId),
  )) {
    if (instance.instanceId.trim() === '' || instance.definitionId.trim() === '') {
      diagnostics.push({
        code: 'invalid-instance',
        instanceId: instance.instanceId,
        message: 'Instance identity is invalid',
      });
    } else if (!state.definitions.has(instance.definitionId)) {
      diagnostics.push({
        code: 'broken-source',
        instanceId: instance.instanceId,
        message: `Definition not found: ${instance.definitionId}`,
      });
    }
    const keys = new Set<string>();
    for (const override of instance.overrides) {
      const key = overrideKey(override);
      if (keys.has(key)) {
        diagnostics.push({
          code: 'duplicate-override',
          instanceId: instance.instanceId,
          message: `Duplicate override target: ${override.propertyPath}`,
        });
      }
      keys.add(key);
    }
  }
  return diagnostics;
}

export function setInstanceVariant(
  state: ComponentState,
  instanceId: string,
  dimensionId: string,
  value: string,
): boolean {
  const instance = state.instances.get(instanceId);
  if (instance === undefined) return false;
  const dimension = state.definitions
    .get(instance.definitionId)
    ?.variantDimensions?.find(({ id }) => id === dimensionId);
  if (dimension === undefined) throw new Error(`Variant dimension does not exist: ${dimensionId}`);
  if (!dimension.values.includes(value)) throw new Error(`Variant value does not exist: ${value}`);
  if (instance.variants?.[dimensionId] === value) return false;
  state.instances.set(instanceId, {
    ...instance,
    variants: { ...instance.variants, [dimensionId]: value },
  });
  state.version++;
  return true;
}

export function updateComponentDefinition(
  state: ComponentState,
  definition: ComponentDefinition,
): ComponentPropagationReport {
  const previous = state.definitions.get(definition.id);
  if (previous === undefined) throw new Error(`Component definition does not exist: ${definition.id}`);
  assertIdentity(definition.name, 'Component definition name');
  assertIdentity(definition.sourceNodeId, 'Component source node id');
  validateVariantDimensions(definition.variantDimensions);
  const next = {
    ...definition,
    nestedDefinitionIds: definition.nestedDefinitionIds?.slice(),
    descendantIds: definition.descendantIds?.slice(),
    variantDimensions: definition.variantDimensions?.map((dimension) => ({
      ...dimension,
      values: dimension.values.slice(),
    })),
  };
  state.definitions.set(definition.id, next);
  if (validateComponentState(state).some(({ code }) => code === 'definition-cycle')) {
    state.definitions.set(definition.id, previous);
    throw new Error('Component definition update would introduce a nesting cycle');
  }
  const migratedInstances: string[] = [];
  const orphanedOverrides: { instanceId: string; propertyPath: string }[] = [];
  const descendants = new Set(definition.descendantIds ?? []);
  const dimensions = new Map((definition.variantDimensions ?? []).map((dimension) => [dimension.id, dimension]));
  for (const [instanceId, instance] of state.instances) {
    if (instance.definitionId !== definition.id) continue;
    const variants: Record<string, string> = {};
    for (const [dimensionId, dimension] of dimensions) {
      const selected = instance.variants?.[dimensionId];
      variants[dimensionId] =
        selected !== undefined && dimension.values.includes(selected) ? selected : dimension.defaultValue;
    }
    if (JSON.stringify(variants) !== JSON.stringify(instance.variants ?? {})) {
      state.instances.set(instanceId, { ...instance, variants });
      migratedInstances.push(instanceId);
    }
    for (const override of instance.overrides) {
      if (
        override.descendantId !== undefined &&
        override.kind !== 'added-descendant' &&
        !descendants.has(override.descendantId)
      ) {
        orphanedOverrides.push({ instanceId, propertyPath: override.propertyPath });
      }
    }
  }
  state.version++;
  return {
    definitionId: definition.id,
    migratedInstances: migratedInstances.sort(),
    orphanedOverrides: orphanedOverrides.sort(
      (a, b) => a.instanceId.localeCompare(b.instanceId) || a.propertyPath.localeCompare(b.propertyPath),
    ),
  };
}
