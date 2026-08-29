import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import { registerDefaultProperties } from './defaultProperties';
import { getEditorPropertyDefinition, getEditorPropertyDefinitions } from './propertyManager';

describe('registerDefaultProperties', () => {
  it('registers presentation-neutral metadata for editable node properties', () => {
    const editor = createEditorState();
    registerDefaultProperties(editor);

    expect(getEditorPropertyDefinitions(editor).map(({ id }) => id)).toEqual([
      'name',
      'visible',
      'alpha',
      'x',
      'y',
      'rotation',
      'scaleX',
      'scaleY',
    ]);
    expect(getEditorPropertyDefinition(editor, 'alpha')).toMatchObject({ min: 0, max: 1, step: 0.05 });
  });
});
