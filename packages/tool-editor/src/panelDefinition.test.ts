import { describe, expect, it } from 'vitest';

import {
  createPanelRegistry,
  getAllPanelIds,
  getPanel,
  getPanelCount,
  getPanelsByRegion,
  registerDefaultPanels,
  registerPanel,
  unregisterPanel,
} from './panelDefinition';

import type { PanelDefinition } from './panelDefinition';

const testPanel: PanelDefinition = {
  id: 'test',
  title: 'Test Panel',
  region: 'leftPanel',
  resizable: true,
  closable: false,
};

describe('createPanelRegistry', () => {
  it('creates an empty registry', () => {
    const registry = createPanelRegistry();
    expect(getPanelCount(registry)).toBe(0);
  });
});

describe('registerPanel', () => {
  it('adds a panel to the registry', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    expect(getPanelCount(registry)).toBe(1);
  });

  it('overwrites a panel with the same id', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    registerPanel(registry, { ...testPanel, title: 'Updated' });
    expect(getPanelCount(registry)).toBe(1);
    expect(getPanel(registry, 'test')!.title).toBe('Updated');
  });
});

describe('unregisterPanel', () => {
  it('removes a panel by id', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    expect(unregisterPanel(registry, 'test')).toBe(true);
    expect(getPanelCount(registry)).toBe(0);
  });

  it('returns false for missing panel', () => {
    const registry = createPanelRegistry();
    expect(unregisterPanel(registry, 'missing')).toBe(false);
  });
});

describe('getPanel', () => {
  it('returns a registered panel', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    const panel = getPanel(registry, 'test');
    expect(panel).toBeDefined();
    expect(panel!.title).toBe('Test Panel');
  });

  it('returns undefined for missing panel', () => {
    const registry = createPanelRegistry();
    expect(getPanel(registry, 'nope')).toBeUndefined();
  });
});

describe('getPanelsByRegion', () => {
  it('returns panels matching a region', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    registerPanel(registry, { ...testPanel, id: 'other', region: 'rightPanel' });
    const left = getPanelsByRegion(registry, 'leftPanel');
    expect(left).toHaveLength(1);
    expect(left[0].id).toBe('test');
  });

  it('returns empty array when no match', () => {
    const registry = createPanelRegistry();
    expect(getPanelsByRegion(registry, 'canvas')).toHaveLength(0);
  });
});

describe('getPanelCount', () => {
  it('reflects panel count', () => {
    const registry = createPanelRegistry();
    expect(getPanelCount(registry)).toBe(0);
    registerPanel(registry, testPanel);
    expect(getPanelCount(registry)).toBe(1);
  });
});

describe('getAllPanelIds', () => {
  it('returns all registered panel ids', () => {
    const registry = createPanelRegistry();
    registerPanel(registry, testPanel);
    registerPanel(registry, { ...testPanel, id: 'second' });
    const ids = getAllPanelIds(registry);
    expect(ids).toHaveLength(2);
    expect(ids).toContain('test');
    expect(ids).toContain('second');
  });
});

describe('registerDefaultPanels', () => {
  it('registers four default panels', () => {
    const registry = createPanelRegistry();
    registerDefaultPanels(registry);
    expect(getPanelCount(registry)).toBe(4);
  });

  it('registers hierarchy in leftPanel', () => {
    const registry = createPanelRegistry();
    registerDefaultPanels(registry);
    const panel = getPanel(registry, 'hierarchy');
    expect(panel).toBeDefined();
    expect(panel!.region).toBe('leftPanel');
  });

  it('registers inspector in rightPanel', () => {
    const registry = createPanelRegistry();
    registerDefaultPanels(registry);
    const panel = getPanel(registry, 'inspector');
    expect(panel).toBeDefined();
    expect(panel!.region).toBe('rightPanel');
  });

  it('registers toolbar as non-closable', () => {
    const registry = createPanelRegistry();
    registerDefaultPanels(registry);
    const panel = getPanel(registry, 'toolbar');
    expect(panel!.closable).toBe(false);
  });
});
