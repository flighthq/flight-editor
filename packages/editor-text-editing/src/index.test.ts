import * as textEditing from './index';

describe('@flighthq/editor-text-editing exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(textEditing).sort()).toEqual([
      'beginTextEditing',
      'clearTextSelection',
      'createTextEditingState',
      'endTextEditing',
      'getCaretPosition',
      'getTextEditingTargetId',
      'getTextEditingVersion',
      'getTextSelection',
      'hasTextSelection',
      'isComposing',
      'isTextEditingActive',
      'setCaretPosition',
      'setComposing',
      'setTextSelection',
    ]);
  });
});
