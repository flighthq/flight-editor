import * as selection from './index';

describe('@flighthq/editor-selection exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(selection).sort()).toEqual([
      'addToSelection',
      'clearSelection',
      'createSelectionState',
      'getPrimarySelection',
      'getSelectedNodes',
      'getSelectionCount',
      'isSelected',
      'removeFromSelection',
      'setSelection',
      'toggleSelection',
    ]);
  });
});
