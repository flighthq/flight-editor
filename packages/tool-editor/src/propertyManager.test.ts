import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  clearEditorPropertyValues,
  getEditorEditingPropertyId,
  getEditorPropertyCategories,
  getEditorPropertyCount,
  getEditorPropertyDefinition,
  getEditorPropertyDefinitions,
  getEditorPropertyDefinitionsByCategory,
  getEditorPropertyPanelVersion,
  getEditorPropertyValue,
  isEditorCategoryExpanded,
  isEditorPropertyMixed,
  registerEditorProperty,
  setEditorCategoryExpanded,
  setEditorEditingPropertyId,
  setEditorPropertyValue,
  unregisterEditorProperty,
} from './propertyManager';

function makeDef(id: string, type: string, category: string, label: string) {
  return { id, type, category, label } as any;
}

describe('registerEditorProperty', () => {
  it('registers a property definition', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    expect(getEditorPropertyCount(editor)).toBe(1);
  });
});

describe('unregisterEditorProperty', () => {
  it('removes a property definition', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    expect(unregisterEditorProperty(editor, 'x')).toBe(true);
    expect(getEditorPropertyCount(editor)).toBe(0);
  });
});

describe('getEditorPropertyDefinition', () => {
  it('returns the definition for a registered property', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('width', 'number', 'size', 'Width'));
    const def = getEditorPropertyDefinition(editor, 'width');
    expect(def).not.toBeNull();
    expect(def!.label).toBe('Width');
  });
});

describe('getEditorPropertyDefinitions', () => {
  it('returns all definitions', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('a', 'number', 'cat', 'A'));
    registerEditorProperty(editor, makeDef('b', 'string', 'cat', 'B'));
    expect(getEditorPropertyDefinitions(editor)).toHaveLength(2);
  });
});

describe('getEditorPropertyDefinitionsByCategory', () => {
  it('filters by category', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    registerEditorProperty(editor, makeDef('color', 'color', 'style', 'Color'));
    expect(getEditorPropertyDefinitionsByCategory(editor, 'transform')).toHaveLength(1);
  });
});

describe('getEditorPropertyCount', () => {
  it('returns zero when empty', () => {
    const editor = createEditorState();
    expect(getEditorPropertyCount(editor)).toBe(0);
  });
});

describe('getEditorPropertyCategories', () => {
  it('returns registered categories', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    expect(getEditorPropertyCategories(editor)).toContain('transform');
  });
});

describe('isEditorCategoryExpanded', () => {
  it('returns false by default', () => {
    const editor = createEditorState();
    expect(isEditorCategoryExpanded(editor, 'transform')).toBe(false);
  });
});

describe('setEditorCategoryExpanded', () => {
  it('expands a category', () => {
    const editor = createEditorState();
    setEditorCategoryExpanded(editor, 'transform', true);
    expect(isEditorCategoryExpanded(editor, 'transform')).toBe(true);
  });
});

describe('getEditorPropertyValue', () => {
  it('returns null for unset property', () => {
    const editor = createEditorState();
    expect(getEditorPropertyValue(editor, 'x')).toBeNull();
  });
});

describe('setEditorPropertyValue', () => {
  it('sets and retrieves a property value', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    setEditorPropertyValue(editor, 'x', 42);
    const val = getEditorPropertyValue(editor, 'x');
    expect(val).not.toBeNull();
    expect(val!.value).toBe(42);
  });
});

describe('isEditorPropertyMixed', () => {
  it('returns false by default', () => {
    const editor = createEditorState();
    expect(isEditorPropertyMixed(editor, 'x')).toBe(false);
  });
});

describe('clearEditorPropertyValues', () => {
  it('clears all values', () => {
    const editor = createEditorState();
    registerEditorProperty(editor, makeDef('x', 'number', 'transform', 'X'));
    setEditorPropertyValue(editor, 'x', 42);
    clearEditorPropertyValues(editor);
    expect(getEditorPropertyValue(editor, 'x')).toBeNull();
  });
});

describe('getEditorEditingPropertyId', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorEditingPropertyId(editor)).toBeNull();
  });
});

describe('setEditorEditingPropertyId', () => {
  it('sets the editing property id', () => {
    const editor = createEditorState();
    setEditorEditingPropertyId(editor, 'x');
    expect(getEditorEditingPropertyId(editor)).toBe('x');
  });
});

describe('getEditorPropertyPanelVersion', () => {
  it('returns a number', () => {
    const editor = createEditorState();
    expect(typeof getEditorPropertyPanelVersion(editor)).toBe('number');
  });
});
