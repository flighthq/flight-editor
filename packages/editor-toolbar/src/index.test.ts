import * as toolbar from './index';

describe('@flighthq/editor-toolbar exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(toolbar).sort()).toEqual([
      'addToolbarButton',
      'addToolbarGroup',
      'createToolbarState',
      'getActiveToolbarButton',
      'getToolbarButtons',
      'getToolbarGroups',
      'getToolbarVersion',
      'removeToolbarButton',
      'setToolbarButtonActive',
      'setToolbarButtonEnabled',
    ]);
  });
});
