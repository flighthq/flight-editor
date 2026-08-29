import type { PropertyDefinition } from '@flighthq/editor-properties';

import type { EditorState } from './editorState';

import { registerEditorProperty } from './propertyManager';

const definitions: readonly PropertyDefinition[] = [
  { id: 'name', label: 'Name', type: 'string', category: 'General' },
  { id: 'visible', label: 'Visible', type: 'boolean', category: 'Appearance' },
  { id: 'alpha', label: 'Opacity', type: 'number', category: 'Appearance', min: 0, max: 1, step: 0.05 },
  { id: 'x', label: 'X', type: 'number', category: 'Transform', step: 0.1 },
  { id: 'y', label: 'Y', type: 'number', category: 'Transform', step: 0.1 },
  { id: 'rotation', label: 'Rotation', type: 'number', category: 'Transform', step: 0.01 },
  { id: 'scaleX', label: 'Scale X', type: 'number', category: 'Transform', step: 0.01 },
  { id: 'scaleY', label: 'Scale Y', type: 'number', category: 'Transform', step: 0.01 },
];

export function registerDefaultProperties(editor: EditorState): void {
  for (const definition of definitions) registerEditorProperty(editor, definition);
}
