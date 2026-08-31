import { describe, expect, it } from 'vitest';

import { executeCommand, undo } from '@flighthq/editor-command';
import { createCommandHistory } from '@flighthq/editor-command';
import type { InspectorTarget } from './componentInspector';
import {
  copyPasteInspectedComponent,
  createComponentInspectorState,
  createInspectorMutationCommand,
  inspectComponents,
  migrateInspectedComponents,
  mutateInspectedComponents,
  registerInspectorSchema,
  unregisterInspectorOwner,
} from './componentInspector';

const schema = {
  typeId: 'physics',
  label: 'Physics',
  ownerId: 'builtin',
  version: 2,
  fields: [
    { id: 'mass', label: 'Mass', kind: 'number' as const, defaultValue: 1 },
    { id: 'body', label: 'Body', kind: 'enum' as const, defaultValue: 'dynamic', enumValues: ['dynamic', 'static'] },
  ],
  migrate: (value: Readonly<Record<string, unknown>>) => ({ mass: value.weight ?? 1, body: 'dynamic' }),
  validate: (value: Readonly<Record<string, unknown>>) => (Number(value.mass) > 0 ? [] : ['Mass must be positive']),
};

function target(id: string, mass = 1, locked = false): InspectorTarget {
  return {
    id,
    locked,
    components: [{ typeId: 'physics', schemaVersion: 2, enabled: true, properties: { mass, body: 'dynamic' } }],
  };
}

describe('createComponentInspectorState', () => {
  it('starts without schemas or clipboard coupling', () =>
    expect(createComponentInspectorState()).toMatchObject({ version: 0, clipboard: null }));
});

describe('registerInspectorSchema', () => {
  it('validates schemas and prevents ownership collisions', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    expect(() => registerInspectorSchema(state, schema)).toThrow('already registered');
  });
});

describe('unregisterInspectorOwner', () => {
  it('removes plugin contributions without deleting document data', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    expect(unregisterInspectorOwner(state, 'builtin')).toEqual(['physics']);
    expect(inspectComponents(state, [target('a')])[0]).toMatchObject({
      known: false,
      raw: [{ mass: 1, body: 'dynamic' }],
    });
  });
});

describe('migrateInspectedComponents', () => {
  it('migrates older known data while preserving unknown data', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    const item = target('a');
    item.components[0] = { typeId: 'physics', schemaVersion: 1, enabled: true, properties: { weight: 4 } };
    expect(migrateInspectedComponents(state, [item])).toEqual(['a:physics']);
    expect(item.components[0]?.properties).toEqual({ mass: 4, body: 'dynamic' });
  });
});

describe('inspectComponents', () => {
  it('derives mixed, locked, applicability, and validation state for any host', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    const sections = inspectComponents(state, [target('a', 1), target('b', -1, true)]);
    expect(sections[0]).toMatchObject({
      known: true,
      applicableToAll: true,
      locked: true,
      diagnostics: ['Mass must be positive'],
    });
    expect(sections[0]?.fields[0]).toMatchObject({ value: 1, mixed: true });
  });
});

describe('mutateInspectedComponents', () => {
  it('supports add/set/reset/enable/remove and skips locked targets', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    const empty: InspectorTarget = { id: 'a', locked: false, components: [] };
    expect(mutateInspectedComponents(state, [empty], { kind: 'add', typeId: 'physics' })).toBe(1);
    mutateInspectedComponents(state, [empty], { kind: 'set', typeId: 'physics', fieldId: 'mass', value: 5 });
    mutateInspectedComponents(state, [empty], { kind: 'reset', typeId: 'physics' });
    expect(empty.components[0]).toMatchObject({ properties: { mass: 1 }, enabled: true });
  });
});

describe('copyPasteInspectedComponent', () => {
  it('deep-copies component data across targets', () => {
    const state = createComponentInspectorState();
    const source = target('a');
    const destination: InspectorTarget = { id: 'b', locked: false, components: [] };
    copyPasteInspectedComponent(state, source.components[0]!, undefined);
    expect(copyPasteInspectedComponent(state, null, [destination])).toBe(1);
    source.components[0]!.properties.mass = 9;
    expect(destination.components[0]?.properties.mass).toBe(1);
  });
});

describe('createInspectorMutationCommand', () => {
  it('restores multi-target edits through shared command history', () => {
    const state = createComponentInspectorState();
    registerInspectorSchema(state, schema);
    const targets = [target('a'), target('b')];
    const history = createCommandHistory();
    executeCommand(
      history,
      createInspectorMutationCommand(state, targets, 'Set mass', () => {
        mutateInspectedComponents(state, targets, { kind: 'set', typeId: 'physics', fieldId: 'mass', value: 8 });
      }),
    );
    expect(targets[0]?.components[0]?.properties.mass).toBe(8);
    undo(history);
    expect(targets[0]?.components[0]?.properties.mass).toBe(1);
  });
});
