import { describe, expect, it } from 'vitest';

import {
  addComponentInstance,
  clearInstanceOverrides,
  createComponentState,
  detachComponentInstance,
  getBrokenComponentInstances,
  getComponentDefinition,
  getComponentDefinitionCount,
  getComponentDefinitions,
  getComponentInstance,
  getComponentVersion,
  getInstancesOfDefinition,
  registerComponent,
  relinkComponentDefinition,
  removeComponentInstance,
  setInstanceOverrides,
  setInstanceVariant,
  swapComponentInstance,
  unregisterComponent,
  updateComponentDefinition,
  validateComponentState,
} from './componentState';

import type { ComponentDefinition, ComponentInstance, ComponentOverride } from './componentState';

const defA: ComponentDefinition = { id: 'def-a', name: 'Button', sourceNodeId: 'node-1' };
const defB: ComponentDefinition = { id: 'def-b', name: 'Card', sourceNodeId: 'node-2' };

const inst1: ComponentInstance = { instanceId: 'inst-1', definitionId: 'def-a', overrides: [] };
const inst2: ComponentInstance = { instanceId: 'inst-2', definitionId: 'def-a', overrides: [] };
const inst3: ComponentInstance = { instanceId: 'inst-3', definitionId: 'def-b', overrides: [] };

describe('createComponentState', () => {
  it('starts empty', () => {
    const state = createComponentState();
    expect(getComponentDefinitionCount(state)).toBe(0);
    expect(getComponentDefinitions(state)).toEqual([]);
    expect(getComponentVersion(state)).toBe(0);
  });
});

describe('registerComponent', () => {
  it('adds a definition', () => {
    const state = createComponentState();
    registerComponent(state, defA);
    expect(getComponentDefinitionCount(state)).toBe(1);
    expect(getComponentDefinition(state, 'def-a')).toEqual(defA);
    expect(getComponentVersion(state)).toBe(1);
  });
});

describe('unregisterComponent', () => {
  it('removes a definition', () => {
    const state = createComponentState();
    registerComponent(state, defA);
    const removed = unregisterComponent(state, 'def-a');
    expect(removed).toBe(true);
    expect(getComponentDefinitionCount(state)).toBe(0);
  });

  it('returns false when not found', () => {
    const state = createComponentState();
    const removed = unregisterComponent(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getComponentVersion(state)).toBe(0);
  });
});

describe('getComponentDefinition', () => {
  it('returns undefined for unknown id', () => {
    const state = createComponentState();
    expect(getComponentDefinition(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getComponentDefinitions', () => {
  it('returns all definitions', () => {
    const state = createComponentState();
    registerComponent(state, defA);
    registerComponent(state, defB);
    expect(getComponentDefinitions(state)).toEqual([defA, defB]);
  });
});

describe('getComponentDefinitionCount', () => {
  it('is exported', () => expect(getComponentDefinitionCount).toBeTypeOf('function'));
});

describe('addComponentInstance', () => {
  it('adds an instance', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    expect(getComponentInstance(state, 'inst-1')).toEqual(inst1);
    expect(getComponentVersion(state)).toBe(1);
  });
});

describe('removeComponentInstance', () => {
  it('removes an instance', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    const removed = removeComponentInstance(state, 'inst-1');
    expect(removed).toBe(true);
    expect(getComponentInstance(state, 'inst-1')).toBeUndefined();
  });

  it('returns false when not found', () => {
    const state = createComponentState();
    const removed = removeComponentInstance(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getComponentVersion(state)).toBe(0);
  });
});

describe('getComponentInstance', () => {
  it('returns undefined for unknown id', () => {
    const state = createComponentState();
    expect(getComponentInstance(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getInstancesOfDefinition', () => {
  it('filters instances by definition id', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    addComponentInstance(state, inst2);
    addComponentInstance(state, inst3);
    expect(getInstancesOfDefinition(state, 'def-a')).toEqual([inst1, inst2]);
    expect(getInstancesOfDefinition(state, 'def-b')).toEqual([inst3]);
  });

  it('returns empty for unknown definition', () => {
    const state = createComponentState();
    expect(getInstancesOfDefinition(state, 'nonexistent')).toEqual([]);
  });
});

describe('setInstanceOverrides', () => {
  it('sets overrides on an instance', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    const overrides: ComponentOverride[] = [{ propertyPath: 'text', value: 'Hello' }];
    const result = setInstanceOverrides(state, 'inst-1', overrides);
    expect(result).toBe(true);
    expect(getComponentInstance(state, 'inst-1')!.overrides).toEqual(overrides);
  });

  it('returns false when instance not found', () => {
    const state = createComponentState();
    const result = setInstanceOverrides(state, 'nonexistent', []);
    expect(result).toBe(false);
    expect(getComponentVersion(state)).toBe(0);
  });

  it('does not share the input array', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    const overrides: ComponentOverride[] = [{ propertyPath: 'a', value: 1 }];
    setInstanceOverrides(state, 'inst-1', overrides);
    overrides.push({ propertyPath: 'b', value: 2 });
    expect(getComponentInstance(state, 'inst-1')!.overrides).toHaveLength(1);
  });
});

describe('clearInstanceOverrides', () => {
  it('clears overrides', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    setInstanceOverrides(state, 'inst-1', [{ propertyPath: 'x', value: 1 }]);
    const v = getComponentVersion(state);
    const cleared = clearInstanceOverrides(state, 'inst-1');
    expect(cleared).toBe(true);
    expect(getComponentInstance(state, 'inst-1')!.overrides).toEqual([]);
    expect(getComponentVersion(state)).toBe(v + 1);
  });

  it('returns false when already empty', () => {
    const state = createComponentState();
    addComponentInstance(state, inst1);
    const v = getComponentVersion(state);
    const cleared = clearInstanceOverrides(state, 'inst-1');
    expect(cleared).toBe(false);
    expect(getComponentVersion(state)).toBe(v);
  });

  it('returns false when instance not found', () => {
    const state = createComponentState();
    const cleared = clearInstanceOverrides(state, 'nonexistent');
    expect(cleared).toBe(false);
  });
});

describe('getComponentVersion', () => {
  it('is exported', () => expect(getComponentVersion).toBeTypeOf('function'));
});

describe('detachComponentInstance', () => {
  it('is exported', () => expect(detachComponentInstance).toBeTypeOf('function'));
});

describe('getBrokenComponentInstances', () => {
  it('is exported', () => expect(getBrokenComponentInstances).toBeTypeOf('function'));
});

describe('relinkComponentDefinition', () => {
  it('is exported', () => expect(relinkComponentDefinition).toBeTypeOf('function'));
});

describe('swapComponentInstance', () => {
  it('is exported', () => expect(swapComponentInstance).toBeTypeOf('function'));
});

describe('validateComponentState', () => {
  it('is exported', () => expect(validateComponentState).toBeTypeOf('function'));
});

describe('setInstanceVariant', () => {
  it('sets only declared dimension values', () => {
    const state = createComponentState();
    registerComponent(state, {
      ...defA,
      variantDimensions: [{ id: 'size', values: ['small', 'large'], defaultValue: 'small' }],
    });
    addComponentInstance(state, inst1);
    expect(setInstanceVariant(state, 'inst-1', 'size', 'large')).toBe(true);
    expect(getComponentInstance(state, 'inst-1')?.variants).toEqual({ size: 'large' });
    expect(() => setInstanceVariant(state, 'inst-1', 'size', 'missing')).toThrow('does not exist');
  });
});

describe('updateComponentDefinition', () => {
  it('migrates variants and reports preserved orphan overrides after source changes', () => {
    const state = createComponentState();
    registerComponent(state, {
      ...defA,
      descendantIds: ['label', 'icon'],
      variantDimensions: [{ id: 'size', values: ['small', 'large'], defaultValue: 'small' }],
    });
    addComponentInstance(state, {
      instanceId: 'inst-1',
      definitionId: 'def-a',
      variants: { size: 'large', removed: 'x' },
      overrides: [{ descendantId: 'icon', propertyPath: 'visible', value: false }],
    });
    const report = updateComponentDefinition(state, {
      ...defA,
      descendantIds: ['label'],
      variantDimensions: [{ id: 'size', values: ['small'], defaultValue: 'small' }],
    });
    expect(report).toEqual({
      definitionId: 'def-a',
      migratedInstances: ['inst-1'],
      orphanedOverrides: [{ instanceId: 'inst-1', propertyPath: 'visible' }],
    });
    expect(getComponentInstance(state, 'inst-1')?.variants).toEqual({ size: 'small' });
    expect(getComponentInstance(state, 'inst-1')?.overrides).toHaveLength(1);
  });

  it('rejects a source update that introduces a nesting cycle', () => {
    const state = createComponentState();
    registerComponent(state, defA);
    registerComponent(state, { ...defB, nestedDefinitionIds: ['def-a'] });
    expect(() => updateComponentDefinition(state, { ...defA, nestedDefinitionIds: ['def-b'] })).toThrow('cycle');
    expect(getComponentDefinition(state, 'def-a')?.nestedDefinitionIds).toBeUndefined();
  });
});
