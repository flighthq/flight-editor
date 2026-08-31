import * as library from './index';

describe('@flighthq/editor-library exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(library).sort()).toEqual([
      'addLibraryItem',
      'clearLibrary',
      'createLibraryState',
      'getActiveCategory',
      'getFilteredLibraryItems',
      'getLibraryCategories',
      'getLibraryItem',
      'getLibraryItemCount',
      'getLibraryItems',
      'getLibrarySearchFilter',
      'getLibrarySessionVersion',
      'getLibraryVersion',
      'markLibrarySourceMissing',
      'reconcileLibrarySource',
      'removeLibraryItem',
      'setActiveCategory',
      'setLibrarySearchFilter',
      'validateLibraryState',
    ]);
  });
});
