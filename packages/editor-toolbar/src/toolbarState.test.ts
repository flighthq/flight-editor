import { describe, expect, it } from 'vitest';

import type { ToolbarButton } from './toolbarState';

import {
  addToolbarButton,
  addToolbarGroup,
  createToolbarState,
  getActiveToolbarButton,
  getToolbarButtons,
  getToolbarGroups,
  getToolbarVersion,
  removeToolbarButton,
  setToolbarButtonActive,
  setToolbarButtonEnabled,
} from './toolbarState';

function toolButton(id: string, active = false): ToolbarButton {
  return { id, label: id.toUpperCase(), icon: `${id}-icon`, toolId: id, enabled: true, active };
}

function commandButton(id: string): ToolbarButton {
  return { id, label: id.toUpperCase(), icon: `${id}-icon`, commandId: id, enabled: true, active: false };
}

describe('createToolbarState', () => {
  it('creates an empty, unversioned toolbar', () => {
    const state = createToolbarState();
    expect(getToolbarGroups(state)).toEqual([]);
    expect(getActiveToolbarButton(state)).toBeNull();
    expect(getToolbarVersion(state)).toBe(0);
  });
});

describe('addToolbarGroup', () => {
  it('adds groups and updates labels without duplicating ids or counting no-ops', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarGroup(state, 'tools', 'Drawing tools');
    expect(getToolbarGroups(state)).toEqual([{ id: 'tools', label: 'Drawing tools', buttons: [] }]);
    expect(getToolbarVersion(state)).toBe(2);
  });
});

describe('addToolbarButton', () => {
  it('copies buttons, replaces matching ids, moves them between groups, and ignores missing groups', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarGroup(state, 'commands', 'Commands');
    const source = toolButton('select');
    addToolbarButton(state, 'tools', source);
    source.label = 'Changed outside';
    addToolbarButton(state, 'missing', commandButton('save'));
    addToolbarButton(state, 'commands', { ...toolButton('select'), label: 'Select tool' });
    expect(getToolbarButtons(state, 'tools')).toEqual([]);
    expect(getToolbarButtons(state, 'commands')[0]?.label).toBe('Select tool');
    expect(getToolbarVersion(state)).toBe(4);
  });
});

describe('removeToolbarButton', () => {
  it('removes a button only from the named group and ignores unknown ids', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarButton(state, 'tools', toolButton('select'));
    removeToolbarButton(state, 'missing', 'select');
    removeToolbarButton(state, 'tools', 'missing');
    removeToolbarButton(state, 'tools', 'select');
    expect(getToolbarButtons(state, 'tools')).toEqual([]);
    expect(getToolbarVersion(state)).toBe(3);
  });
});

describe('getToolbarGroups', () => {
  it('returns isolated group and button copies in insertion order', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarButton(state, 'tools', toolButton('select'));
    const groups = getToolbarGroups(state);
    groups[0]!.label = 'Changed';
    groups[0]!.buttons[0]!.label = 'Changed';
    expect(getToolbarGroups(state)[0]).toMatchObject({ label: 'Tools', buttons: [{ label: 'SELECT' }] });
  });
});

describe('getToolbarButtons', () => {
  it('returns isolated button copies and an empty list for an unknown group', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'commands', 'Commands');
    addToolbarButton(state, 'commands', commandButton('save'));
    const buttons = getToolbarButtons(state, 'commands');
    buttons[0]!.enabled = false;
    expect(getToolbarButtons(state, 'commands')[0]?.enabled).toBe(true);
    expect(getToolbarButtons(state, 'missing')).toEqual([]);
  });
});

describe('setToolbarButtonEnabled', () => {
  it('updates known buttons and guards missing or unchanged values', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'commands', 'Commands');
    addToolbarButton(state, 'commands', commandButton('save'));
    const version = getToolbarVersion(state);
    setToolbarButtonEnabled(state, 'save', false);
    setToolbarButtonEnabled(state, 'save', false);
    setToolbarButtonEnabled(state, 'missing', false);
    expect(getToolbarButtons(state, 'commands')[0]?.enabled).toBe(false);
    expect(getToolbarVersion(state)).toBe(version + 1);
  });
});

describe('setToolbarButtonActive', () => {
  it('makes activation exclusive and guards missing or unchanged updates', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarButton(state, 'tools', toolButton('select', true));
    addToolbarButton(state, 'tools', toolButton('pen'));
    const version = getToolbarVersion(state);
    setToolbarButtonActive(state, 'pen', true);
    setToolbarButtonActive(state, 'pen', true);
    setToolbarButtonActive(state, 'missing', true);
    expect(getToolbarButtons(state, 'tools').map(({ active }) => active)).toEqual([false, true]);
    expect(getToolbarVersion(state)).toBe(version + 1);
  });
});

describe('getActiveToolbarButton', () => {
  it('returns an isolated active button or null when activation is cleared', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarButton(state, 'tools', toolButton('select', true));
    const active = getActiveToolbarButton(state);
    active!.label = 'Changed';
    expect(getActiveToolbarButton(state)?.label).toBe('SELECT');
    setToolbarButtonActive(state, 'select', false);
    expect(getActiveToolbarButton(state)).toBeNull();
  });
});

describe('getToolbarVersion', () => {
  it('tracks group, button, enabled, active, and removal changes', () => {
    const state = createToolbarState();
    addToolbarGroup(state, 'tools', 'Tools');
    addToolbarButton(state, 'tools', toolButton('select'));
    setToolbarButtonEnabled(state, 'select', false);
    setToolbarButtonActive(state, 'select', true);
    removeToolbarButton(state, 'tools', 'select');
    expect(getToolbarVersion(state)).toBe(5);
  });
});
