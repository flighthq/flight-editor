import { describe, expect, it } from 'vitest';

import {
  createLayoutState,
  getLayoutPanels,
  getLayoutPanelVisible,
  resetLayout,
  setLayoutPanelPosition,
  setLayoutPanelSize,
  setLayoutPanelVisible,
} from './layoutState';

describe('createLayoutState', () => {
  it('creates the standard visible desktop arrangement', () => {
    const state = createLayoutState();
    expect(getLayoutPanels(state)).toEqual([
      { id: 'hierarchy', visible: true, position: 'left', width: 280, height: 600 },
      { id: 'properties', visible: true, position: 'right', width: 320, height: 600 },
      { id: 'toolbar', visible: true, position: 'top', width: 800, height: 48 },
      { id: 'status', visible: true, position: 'bottom', width: 800, height: 28 },
    ]);
    expect(state.version).toBe(0);
  });
});

describe('setLayoutPanelVisible', () => {
  it('changes known visibility and increments the layout version', () => {
    const state = createLayoutState();
    setLayoutPanelVisible(state, 'hierarchy', false);
    expect(getLayoutPanelVisible(state, 'hierarchy')).toBe(false);
    expect(state.version).toBe(1);
  });

  it('guards missing panels and unchanged visibility', () => {
    const state = createLayoutState();
    setLayoutPanelVisible(state, 'toolbar', true);
    setLayoutPanelVisible(state, 'missing', false);
    expect(state.version).toBe(0);
  });
});

describe('getLayoutPanelVisible', () => {
  it('reports configured visibility and returns false for unknown panels', () => {
    const state = createLayoutState();
    expect(getLayoutPanelVisible(state, 'status')).toBe(true);
    expect(getLayoutPanelVisible(state, 'missing')).toBe(false);
  });
});

describe('setLayoutPanelPosition', () => {
  it('supports every dock edge and floating panels', () => {
    const state = createLayoutState();
    for (const position of ['right', 'top', 'bottom', 'float', 'left'] as const) {
      setLayoutPanelPosition(state, 'hierarchy', position);
      expect(getLayoutPanels(state)[0]?.position).toBe(position);
    }
    expect(state.version).toBe(5);
  });

  it('guards missing panels and unchanged positions', () => {
    const state = createLayoutState();
    setLayoutPanelPosition(state, 'properties', 'right');
    setLayoutPanelPosition(state, 'missing', 'float');
    expect(state.version).toBe(0);
  });
});

describe('setLayoutPanelSize', () => {
  it('updates both dimensions together', () => {
    const state = createLayoutState();
    setLayoutPanelSize(state, 'properties', 400, 720);
    expect(getLayoutPanels(state)[1]).toMatchObject({ width: 400, height: 720 });
    expect(state.version).toBe(1);
  });

  it('guards missing panels and unchanged dimensions', () => {
    const state = createLayoutState();
    setLayoutPanelSize(state, 'toolbar', 800, 48);
    setLayoutPanelSize(state, 'missing', 10, 20);
    expect(state.version).toBe(0);
  });
});

describe('getLayoutPanels', () => {
  it('returns isolated copies in stable display order', () => {
    const state = createLayoutState();
    const panels = getLayoutPanels(state);
    panels[0]!.visible = false;
    panels[1]!.width = 1;
    expect(getLayoutPanelVisible(state, 'hierarchy')).toBe(true);
    expect(getLayoutPanels(state).map(({ id }) => id)).toEqual(['hierarchy', 'properties', 'toolbar', 'status']);
    expect(getLayoutPanels(state)[1]?.width).toBe(320);
  });
});

describe('resetLayout', () => {
  it('restores every panel after multiple layout changes', () => {
    const state = createLayoutState();
    setLayoutPanelVisible(state, 'hierarchy', false);
    setLayoutPanelPosition(state, 'properties', 'float');
    setLayoutPanelSize(state, 'toolbar', 900, 60);
    resetLayout(state);
    expect(getLayoutPanels(state)).toEqual(getLayoutPanels(createLayoutState()));
    expect(state.version).toBe(4);
  });

  it('does not change version when the layout is already at defaults', () => {
    const state = createLayoutState();
    resetLayout(state);
    expect(state.version).toBe(0);
  });
});
