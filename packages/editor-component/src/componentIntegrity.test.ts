import { describe, expect, it } from 'vitest';

import {
  addComponentInstance,
  createComponentState,
  detachComponentInstance,
  getBrokenComponentInstances,
  getComponentInstance,
  getComponentVersion,
  registerComponent,
  relinkComponentDefinition,
  setInstanceOverrides,
  swapComponentInstance,
  unregisterComponent,
  validateComponentState,
} from './componentState';

const button = { id: 'button', name: 'Button', sourceNodeId: 'button-source' };
const card = { id: 'card', name: 'Card', sourceNodeId: 'card-source' };

describe('registerComponent', () => {
  it('rejects invalid and duplicate stable identities', () => {
    const state = createComponentState();
    registerComponent(state, button);
    expect(() => registerComponent(state, button)).toThrow('already exists');
    expect(() => registerComponent(state, { ...card, id: '' })).toThrow('must not be empty');
  });
});

describe('addComponentInstance', () => {
  it('rejects duplicate identities and override slots', () => {
    const state = createComponentState();
    addComponentInstance(state, { instanceId: 'one', definitionId: 'button', overrides: [] });
    expect(() => addComponentInstance(state, { instanceId: 'one', definitionId: 'button', overrides: [] })).toThrow(
      'already exists',
    );
    expect(() =>
      addComponentInstance(state, {
        instanceId: 'two',
        definitionId: 'button',
        overrides: [
          { descendantId: 'label', propertyPath: 'text', value: 'A' },
          { descendantId: 'label', propertyPath: 'text', value: 'B' },
        ],
      }),
    ).toThrow('Duplicate');
  });
});

describe('getBrokenComponentInstances', () => {
  it('retains and deterministically reports instances after source deletion', () => {
    const state = createComponentState();
    registerComponent(state, button);
    addComponentInstance(state, { instanceId: 'z', definitionId: 'button', overrides: [] });
    addComponentInstance(state, { instanceId: 'a', definitionId: 'missing', overrides: [] });
    unregisterComponent(state, 'button');
    expect(getBrokenComponentInstances(state).map(({ instanceId }) => instanceId)).toEqual(['a', 'z']);
  });
});

describe('relinkComponentDefinition', () => {
  it('atomically relinks every broken instance to an existing source', () => {
    const state = createComponentState();
    registerComponent(state, card);
    addComponentInstance(state, { instanceId: 'one', definitionId: 'gone', overrides: [] });
    addComponentInstance(state, { instanceId: 'two', definitionId: 'gone', overrides: [] });
    const version = getComponentVersion(state);
    expect(relinkComponentDefinition(state, 'gone', 'card')).toBe(2);
    expect(getComponentInstance(state, 'one')?.definitionId).toBe('card');
    expect(getComponentVersion(state)).toBe(version + 1);
    expect(() => relinkComponentDefinition(state, 'card', 'missing')).toThrow('does not exist');
  });
});

describe('swapComponentInstance', () => {
  it('can preserve or reset stable overrides during a source swap', () => {
    const state = createComponentState();
    addComponentInstance(state, {
      instanceId: 'one',
      definitionId: 'button',
      overrides: [{ descendantId: 'label', propertyPath: 'text', value: 'Buy' }],
    });
    expect(swapComponentInstance(state, 'one', 'card')).toBe(true);
    expect(getComponentInstance(state, 'one')?.overrides).toHaveLength(1);
    expect(swapComponentInstance(state, 'one', 'button', false)).toBe(true);
    expect(getComponentInstance(state, 'one')?.overrides).toEqual([]);
  });
});

describe('detachComponentInstance', () => {
  it('returns the data needed to materialize a detached source and removes the instance', () => {
    const state = createComponentState();
    addComponentInstance(state, {
      instanceId: 'one',
      definitionId: 'button',
      overrides: [{ propertyPath: 'opacity', value: 0.5 }],
    });
    expect(detachComponentInstance(state, 'one')).toEqual({
      instanceId: 'one',
      formerDefinitionId: 'button',
      overrides: [{ propertyPath: 'opacity', value: 0.5 }],
    });
    expect(getComponentInstance(state, 'one')).toBeUndefined();
    expect(detachComponentInstance(state, 'missing')).toBeUndefined();
  });
});

describe('setInstanceOverrides', () => {
  it('does not dirty the document for an identical override set', () => {
    const state = createComponentState();
    addComponentInstance(state, {
      instanceId: 'one',
      definitionId: 'button',
      overrides: [{ propertyPath: 'opacity', value: 0.5 }],
    });
    const version = getComponentVersion(state);
    expect(setInstanceOverrides(state, 'one', [{ propertyPath: 'opacity', value: 0.5 }])).toBe(false);
    expect(getComponentVersion(state)).toBe(version);
  });
});

describe('validateComponentState', () => {
  it('detects broken sources and recursive component nesting without traversal failure', () => {
    const state = createComponentState();
    registerComponent(state, { ...button, nestedDefinitionIds: ['card'] });
    registerComponent(state, { ...card, nestedDefinitionIds: ['button'] });
    addComponentInstance(state, { instanceId: 'broken', definitionId: 'gone', overrides: [] });
    expect(validateComponentState(state).map(({ code }) => code)).toEqual([
      'definition-cycle',
      'definition-cycle',
      'broken-source',
    ]);
  });
});
