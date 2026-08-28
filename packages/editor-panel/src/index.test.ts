import * as panel from './index';

describe('@flighthq/editor-panel exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(panel).sort()).toEqual([
      'addPanel',
      'createPanelState',
      'getPanel',
      'getPanelVersion',
      'getPanels',
      'isPanelCollapsed',
      'isPanelVisible',
      'removePanel',
      'setPanelCollapsed',
      'setPanelPosition',
      'setPanelSize',
      'setPanelVisible',
    ]);
  });
});
