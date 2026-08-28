import * as preferences from './index';

describe('@flighthq/editor-preferences exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(preferences).sort()).toEqual([
      'createPreferencesState',
      'getAutosaveInterval',
      'getGridSize',
      'getGridSubdivisions',
      'getMaxRecentFiles',
      'getPreferencesVersion',
      'getTheme',
      'isAutosaveEnabled',
      'isSnapToGrid',
      'isSnapToGuides',
      'isSnapToObjects',
      'setAutosaveEnabled',
      'setAutosaveInterval',
      'setGridSize',
      'setGridSubdivisions',
      'setMaxRecentFiles',
      'setSnapToGrid',
      'setSnapToGuides',
      'setSnapToObjects',
      'setTheme',
    ]);
  });
});
