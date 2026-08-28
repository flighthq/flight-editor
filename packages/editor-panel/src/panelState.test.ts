import { describe, expect, it } from 'vitest';

import type { PanelDefinition } from './panelState';

import {
  addPanel,
  createPanelState,
  getPanel,
  getPanels,
  getPanelVersion,
  isPanelCollapsed,
  isPanelVisible,
  removePanel,
  setPanelCollapsed,
  setPanelPosition,
  setPanelSize,
  setPanelVisible,
} from './panelState';

function panel(id: string): PanelDefinition {
  return {
    id,
    title: id.toUpperCase(),
    position: 'left',
    visible: true,
    collapsed: false,
    width: 240,
    height: 480,
  };
}

describe('createPanelState', () => {
  it('creates an empty, unversioned panel registry', () => {
    const state = createPanelState();
    expect(getPanels(state)).toEqual([]);
    expect(getPanelVersion(state)).toBe(0);
  });
});

describe('addPanel', () => {
  it('copies, inserts, and replaces panels while guarding equivalent definitions', () => {
    const state = createPanelState();
    const source = panel('layers');
    addPanel(state, source);
    source.title = 'Changed outside';
    addPanel(state, panel('layers'));
    addPanel(state, { ...panel('layers'), title: 'Layer stack' });
    expect(getPanel(state, 'layers')?.title).toBe('Layer stack');
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('removePanel', () => {
  it('removes known panels and ignores unknown ids', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    removePanel(state, 'missing');
    removePanel(state, 'layers');
    expect(getPanels(state)).toEqual([]);
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('getPanels', () => {
  it('returns isolated panel copies in insertion order', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    addPanel(state, panel('properties'));
    const panels = getPanels(state);
    panels[0]!.title = 'Changed';
    expect(getPanels(state).map(({ id }) => id)).toEqual(['layers', 'properties']);
    expect(getPanels(state)[0]?.title).toBe('LAYERS');
  });
});

describe('getPanel', () => {
  it('returns an isolated panel copy or null for an unknown id', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    const result = getPanel(state, 'layers');
    result!.visible = false;
    expect(getPanel(state, 'layers')?.visible).toBe(true);
    expect(getPanel(state, 'missing')).toBeNull();
  });
});

describe('setPanelVisible', () => {
  it('updates known panels and guards missing or unchanged values', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    setPanelVisible(state, 'layers', false);
    setPanelVisible(state, 'layers', false);
    setPanelVisible(state, 'missing', true);
    expect(isPanelVisible(state, 'layers')).toBe(false);
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('isPanelVisible', () => {
  it('reports panel visibility and returns false for an unknown panel', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    expect(isPanelVisible(state, 'layers')).toBe(true);
    expect(isPanelVisible(state, 'missing')).toBe(false);
  });
});

describe('setPanelCollapsed', () => {
  it('updates known panels and guards missing or unchanged values', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    setPanelCollapsed(state, 'layers', true);
    setPanelCollapsed(state, 'layers', true);
    setPanelCollapsed(state, 'missing', true);
    expect(isPanelCollapsed(state, 'layers')).toBe(true);
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('isPanelCollapsed', () => {
  it('reports collapsed state and returns false for an unknown panel', () => {
    const state = createPanelState();
    addPanel(state, { ...panel('library'), collapsed: true });
    expect(isPanelCollapsed(state, 'library')).toBe(true);
    expect(isPanelCollapsed(state, 'missing')).toBe(false);
  });
});

describe('setPanelSize', () => {
  it('sets width and height together and guards missing or unchanged sizes', () => {
    const state = createPanelState();
    addPanel(state, panel('properties'));
    setPanelSize(state, 'properties', 320, 640);
    setPanelSize(state, 'properties', 320, 640);
    setPanelSize(state, 'missing', 10, 20);
    expect(getPanel(state, 'properties')).toMatchObject({ width: 320, height: 640 });
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('setPanelPosition', () => {
  it('moves known panels and guards missing or unchanged positions', () => {
    const state = createPanelState();
    addPanel(state, panel('timeline'));
    setPanelPosition(state, 'timeline', 'bottom');
    setPanelPosition(state, 'timeline', 'bottom');
    setPanelPosition(state, 'missing', 'right');
    expect(getPanel(state, 'timeline')?.position).toBe('bottom');
    expect(getPanelVersion(state)).toBe(2);
  });
});

describe('getPanelVersion', () => {
  it('tracks add, visibility, collapsed, size, position, and removal changes', () => {
    const state = createPanelState();
    addPanel(state, panel('layers'));
    setPanelVisible(state, 'layers', false);
    setPanelCollapsed(state, 'layers', true);
    setPanelSize(state, 'layers', 300, 500);
    setPanelPosition(state, 'layers', 'right');
    removePanel(state, 'layers');
    expect(getPanelVersion(state)).toBe(6);
  });
});
