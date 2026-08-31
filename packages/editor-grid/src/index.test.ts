import * as grid from './index';

describe('@flighthq/editor-grid exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(grid).sort()).toEqual([
      'createGridState',
      'getEffectiveCellSize',
      'getGridOpacity',
      'getGridSize',
      'getGridSubdivisions',
      'getGridVersion',
      'isGridVisible',
      'setGridOpacity',
      'setGridSize',
      'setGridSubdivisions',
      'setGridVisible',
      'snapPointToGrid',
      'toggleGridVisible',
      'validateGridState',
    ]);
  });
});
