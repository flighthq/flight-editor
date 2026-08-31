import * as textEditing from './index';

describe('@flighthq/editor-text-editing exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(textEditing).sort()).toEqual([
      'beginTextEditing',
      'cancelTextEditing',
      'clampTextOffset',
      'clearTextSelection',
      'commitTextEditing',
      'createTextEditCommand',
      'createTextEditingState',
      'endTextEditing',
      'getCaretPosition',
      'getTextDraft',
      'getTextEditingTargetId',
      'getTextEditingVersion',
      'getTextSelection',
      'hasTextExternalConflict',
      'hasTextSelection',
      'isComposing',
      'isTextDraftDirty',
      'isTextEditingActive',
      'reconcileExternalText',
      'replaceTextSelection',
      'setCaretPosition',
      'setComposing',
      'setTextSelection',
    ]);
  });
});
