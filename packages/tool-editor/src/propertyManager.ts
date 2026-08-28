import type { PropertyDefinition, PropertyValue } from '@flighthq/editor-properties';
import type { EditorState } from './editorState';

import {
  clearPropertyValues,
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
} from '@flighthq/editor-properties';

export function registerEditorProperty(editor: EditorState, definition: PropertyDefinition): void {
  registerProperty(editor.properties, definition);
}

export function unregisterEditorProperty(editor: EditorState, id: string): boolean {
  return unregisterProperty(editor.properties, id);
}

export function getEditorPropertyDefinition(editor: Readonly<EditorState>, id: string): PropertyDefinition | null {
  return getPropertyDefinition(editor.properties, id);
}

export function getEditorPropertyDefinitions(editor: Readonly<EditorState>): readonly PropertyDefinition[] {
  return getPropertyDefinitions(editor.properties);
}

export function getEditorPropertyDefinitionsByCategory(
  editor: Readonly<EditorState>,
  category: string,
): readonly PropertyDefinition[] {
  return getPropertyDefinitionsByCategory(editor.properties, category);
}

export function getEditorPropertyCount(editor: Readonly<EditorState>): number {
  return getPropertyCount(editor.properties);
}

export function getEditorPropertyCategories(editor: Readonly<EditorState>): readonly string[] {
  return getCategories(editor.properties);
}

export function isEditorCategoryExpanded(editor: Readonly<EditorState>, category: string): boolean {
  return isCategoryExpanded(editor.properties, category);
}

export function setEditorCategoryExpanded(editor: EditorState, category: string, expanded: boolean): void {
  setCategoryExpanded(editor.properties, category, expanded);
}

export function getEditorPropertyValue(editor: Readonly<EditorState>, id: string): PropertyValue | null {
  return getPropertyValue(editor.properties, id);
}

export function setEditorPropertyValue(editor: EditorState, id: string, value: unknown, mixed?: boolean): void {
  setPropertyValue(editor.properties, id, value, mixed);
}

export function isEditorPropertyMixed(editor: Readonly<EditorState>, id: string): boolean {
  return isPropertyMixed(editor.properties, id);
}

export function clearEditorPropertyValues(editor: EditorState): void {
  clearPropertyValues(editor.properties);
}

export function getEditorEditingPropertyId(editor: Readonly<EditorState>): string | null {
  return getEditingPropertyId(editor.properties);
}

export function setEditorEditingPropertyId(editor: EditorState, id: string | null): void {
  setEditingPropertyId(editor.properties, id);
}

export function getEditorPropertyPanelVersion(editor: Readonly<EditorState>): number {
  return getPropertyPanelVersion(editor.properties);
}
