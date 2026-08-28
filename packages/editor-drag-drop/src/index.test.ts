import * as dragDrop from './index';

describe('@flighthq/editor-drag-drop exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(dragDrop).sort()).toEqual([
      'beginDrag',
      'cancelDrag',
      'createDragDropState',
      'endDrag',
      'getDragDropVersion',
      'getDragPayload',
      'getDragPosition',
      'getDropTarget',
      'isDragging',
      'setDropTarget',
      'updateDragPosition',
    ]);
  });
});
