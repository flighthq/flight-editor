import * as hierarchy from './index';

describe('@flighthq/editor-hierarchy exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(hierarchy).sort()).toEqual([
      'collapseHierarchyAll',
      'collapseHierarchyNode',
      'createHierarchyState',
      'expandHierarchyAll',
      'expandHierarchyNode',
      'expandHierarchyToNode',
      'getHierarchyRows',
      'getHierarchyVersion',
      'isHierarchyNodeExpanded',
      'toggleHierarchyNode',
    ]);
  });
});
