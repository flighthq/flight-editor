import * as layout from './index';

describe('@flighthq/editor-layout exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(layout).sort()).toEqual([
      'createLayoutState',
      'getLayoutPanelVisible',
      'getLayoutPanels',
      'resetLayout',
      'setLayoutPanelPosition',
      'setLayoutPanelSize',
      'setLayoutPanelVisible',
    ]);
  });
});
