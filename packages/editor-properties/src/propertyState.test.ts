import { describe, expect, it } from 'vitest';

import {
  clearPropertyValues,
  createPropertyPanelState,
  getCategories,
  getEditingPropertyId,
  getPropertyCount,
  getPropertyDefinition,
  getPropertyDefinitions,
  getPropertyDefinitionsByCategory,
  getPropertyPanelVersion,
  getPropertyValue,
  isCategoryExpanded,
  isPropertyMixed,
  registerProperty,
  setCategoryExpanded,
  setEditingPropertyId,
  setPropertyValue,
  unregisterProperty,
} from './propertyState';

import type { PropertyDefinition } from './propertyState';

const xDef: PropertyDefinition = { id: 'x', label: 'X', type: 'number', category: 'Transform' };
const yDef: PropertyDefinition = { id: 'y', label: 'Y', type: 'number', category: 'Transform' };
const nameDef: PropertyDefinition = { id: 'name', label: 'Name', type: 'string', category: 'General' };
const visibleDef: PropertyDefinition = { id: 'visible', label: 'Visible', type: 'boolean', category: 'General' };
const blendDef: PropertyDefinition = {
  id: 'blend',
  label: 'Blend Mode',
  type: 'enum',
  category: 'Appearance',
  enumValues: ['Normal', 'Multiply', 'Screen'],
};

describe('createPropertyPanelState', () => {
  it('starts empty', () => {
    const state = createPropertyPanelState();
    expect(getPropertyCount(state)).toBe(0);
    expect(getCategories(state)).toEqual([]);
    expect(getPropertyPanelVersion(state)).toBe(0);
    expect(getEditingPropertyId(state)).toBeNull();
  });
});

describe('registerProperty', () => {
  it('adds a property definition', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    expect(getPropertyDefinition(state, 'x')).toEqual(xDef);
    expect(getPropertyCount(state)).toBe(1);
    expect(getPropertyPanelVersion(state)).toBe(1);
  });

  it('creates categories in registration order', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, nameDef);
    registerProperty(state, blendDef);
    expect(getCategories(state)).toEqual(['Transform', 'General', 'Appearance']);
  });

  it('does not duplicate categories', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, yDef);
    expect(getCategories(state)).toEqual(['Transform']);
  });

  it('replaces an existing definition with same id', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    const updated = { ...xDef, label: 'Position X' };
    registerProperty(state, updated);
    expect(getPropertyDefinition(state, 'x')?.label).toBe('Position X');
    expect(getPropertyCount(state)).toBe(1);
  });
});

describe('unregisterProperty', () => {
  it('removes a property', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 100);
    expect(unregisterProperty(state, 'x')).toBe(true);
    expect(getPropertyDefinition(state, 'x')).toBeNull();
    expect(getPropertyValue(state, 'x')).toBeNull();
    expect(getPropertyCount(state)).toBe(0);
  });

  it('returns false for non-existent property', () => {
    const state = createPropertyPanelState();
    expect(unregisterProperty(state, 'missing')).toBe(false);
  });

  it('does not bump version when not found', () => {
    const state = createPropertyPanelState();
    const v = getPropertyPanelVersion(state);
    unregisterProperty(state, 'missing');
    expect(getPropertyPanelVersion(state)).toBe(v);
  });
});

describe('getPropertyDefinition', () => {
  it('returns null for unknown id', () => {
    expect(getPropertyDefinition(createPropertyPanelState(), 'missing')).toBeNull();
  });
});

describe('getPropertyDefinitions', () => {
  it('returns all definitions', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, nameDef);
    expect(getPropertyDefinitions(state)).toHaveLength(2);
  });
});

describe('getPropertyDefinitionsByCategory', () => {
  it('filters by category', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, yDef);
    registerProperty(state, nameDef);
    const transform = getPropertyDefinitionsByCategory(state, 'Transform');
    expect(transform).toHaveLength(2);
    expect(transform.every((d) => d.category === 'Transform')).toBe(true);
  });

  it('returns empty for unknown category', () => {
    const state = createPropertyPanelState();
    expect(getPropertyDefinitionsByCategory(state, 'Unknown')).toEqual([]);
  });
});

describe('getCategories', () => {
  it('returns empty array initially', () => {
    expect(getCategories(createPropertyPanelState())).toEqual([]);
  });
});

describe('setPropertyValue', () => {
  it('sets a value', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 42);
    expect(getPropertyValue(state, 'x')).toEqual({ value: 42, mixed: false });
  });

  it('sets a mixed value', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', null, true);
    expect(getPropertyValue(state, 'x')).toEqual({ value: null, mixed: true });
    expect(isPropertyMixed(state, 'x')).toBe(true);
  });

  it('always bumps version', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 1);
    const v = getPropertyPanelVersion(state);
    setPropertyValue(state, 'x', 1);
    expect(getPropertyPanelVersion(state)).toBe(v + 1);
  });

  it('supports different value types', () => {
    const state = createPropertyPanelState();
    registerProperty(state, nameDef);
    setPropertyValue(state, 'name', 'Sprite1');
    expect(getPropertyValue(state, 'name')?.value).toBe('Sprite1');

    registerProperty(state, visibleDef);
    setPropertyValue(state, 'visible', true);
    expect(getPropertyValue(state, 'visible')?.value).toBe(true);
  });
});

describe('getPropertyValue', () => {
  it('returns null for unset property', () => {
    const state = createPropertyPanelState();
    expect(getPropertyValue(state, 'x')).toBeNull();
  });
});

describe('clearPropertyValues', () => {
  it('clears all values', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, yDef);
    setPropertyValue(state, 'x', 10);
    setPropertyValue(state, 'y', 20);
    clearPropertyValues(state);
    expect(getPropertyValue(state, 'x')).toBeNull();
    expect(getPropertyValue(state, 'y')).toBeNull();
  });

  it('preserves definitions', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 10);
    clearPropertyValues(state);
    expect(getPropertyDefinition(state, 'x')).toEqual(xDef);
  });

  it('is idempotent when already empty', () => {
    const state = createPropertyPanelState();
    const v = getPropertyPanelVersion(state);
    clearPropertyValues(state);
    expect(getPropertyPanelVersion(state)).toBe(v);
  });
});

describe('isPropertyMixed', () => {
  it('returns false for non-mixed value', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 10);
    expect(isPropertyMixed(state, 'x')).toBe(false);
  });

  it('returns false for unset property', () => {
    expect(isPropertyMixed(createPropertyPanelState(), 'missing')).toBe(false);
  });
});

describe('setCategoryExpanded', () => {
  it('expands a category', () => {
    const state = createPropertyPanelState();
    setCategoryExpanded(state, 'Transform', true);
    expect(isCategoryExpanded(state, 'Transform')).toBe(true);
    expect(getPropertyPanelVersion(state)).toBe(1);
  });

  it('collapses a category', () => {
    const state = createPropertyPanelState();
    setCategoryExpanded(state, 'Transform', true);
    setCategoryExpanded(state, 'Transform', false);
    expect(isCategoryExpanded(state, 'Transform')).toBe(false);
    expect(getPropertyPanelVersion(state)).toBe(2);
  });

  it('is idempotent for same state', () => {
    const state = createPropertyPanelState();
    setCategoryExpanded(state, 'Transform', true);
    const v = getPropertyPanelVersion(state);
    setCategoryExpanded(state, 'Transform', true);
    expect(getPropertyPanelVersion(state)).toBe(v);
  });

  it('tracks multiple categories independently', () => {
    const state = createPropertyPanelState();
    setCategoryExpanded(state, 'Transform', true);
    setCategoryExpanded(state, 'General', false);
    expect(isCategoryExpanded(state, 'Transform')).toBe(true);
    expect(isCategoryExpanded(state, 'General')).toBe(false);
  });
});

describe('isCategoryExpanded', () => {
  it('returns false by default', () => {
    expect(isCategoryExpanded(createPropertyPanelState(), 'Transform')).toBe(false);
  });
});

describe('getEditingPropertyId', () => {
  it('returns null initially', () => {
    expect(getEditingPropertyId(createPropertyPanelState())).toBeNull();
  });
});

describe('setEditingPropertyId', () => {
  it('sets the editing property', () => {
    const state = createPropertyPanelState();
    setEditingPropertyId(state, 'x');
    expect(getEditingPropertyId(state)).toBe('x');
    expect(getPropertyPanelVersion(state)).toBe(1);
  });

  it('clears with null', () => {
    const state = createPropertyPanelState();
    setEditingPropertyId(state, 'x');
    setEditingPropertyId(state, null);
    expect(getEditingPropertyId(state)).toBeNull();
  });

  it('is idempotent for same value', () => {
    const state = createPropertyPanelState();
    setEditingPropertyId(state, 'x');
    const v = getPropertyPanelVersion(state);
    setEditingPropertyId(state, 'x');
    expect(getPropertyPanelVersion(state)).toBe(v);
  });
});

describe('getPropertyPanelVersion', () => {
  it('starts at 0', () => {
    expect(getPropertyPanelVersion(createPropertyPanelState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    setPropertyValue(state, 'x', 10);
    setCategoryExpanded(state, 'Transform', true);
    expect(getPropertyPanelVersion(state)).toBe(3);
  });
});

describe('getPropertyCount', () => {
  it('counts registered properties', () => {
    const state = createPropertyPanelState();
    registerProperty(state, xDef);
    registerProperty(state, yDef);
    registerProperty(state, nameDef);
    expect(getPropertyCount(state)).toBe(3);
  });
});
