import { describe, expect, it } from 'vitest';

import {
  createPreferencesState,
  getAutosaveInterval,
  getGridSize,
  getGridSubdivisions,
  getMaxRecentFiles,
  getPreferencesVersion,
  getTheme,
  isAutosaveEnabled,
  isSnapToGrid,
  isSnapToGuides,
  isSnapToObjects,
  setAutosaveEnabled,
  setAutosaveInterval,
  setGridSize,
  setGridSubdivisions,
  setMaxRecentFiles,
  setSnapToGrid,
  setSnapToGuides,
  setSnapToObjects,
  setTheme,
} from './preferencesState';

describe('createPreferencesState', () => {
  it('creates preferences with stable workspace defaults', () => {
    expect(createPreferencesState()).toEqual({
      gridSize: 10,
      gridSubdivisions: 10,
      snapToGrid: true,
      snapToGuides: true,
      snapToObjects: true,
      autosaveEnabled: true,
      autosaveIntervalMs: 30_000,
      maxRecentFiles: 10,
      theme: 'system',
      version: 0,
    });
  });
});

describe('setGridSize', () => {
  it('sets the grid size and guards redundant updates', () => {
    const state = createPreferencesState();
    setGridSize(state, 16);
    setGridSize(state, 16);
    expect(getGridSize(state)).toBe(16);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('getGridSize', () => {
  it('reports the current grid size', () => {
    const state = createPreferencesState();
    expect(getGridSize(state)).toBe(10);
    setGridSize(state, 8);
    expect(getGridSize(state)).toBe(8);
  });
});

describe('setGridSubdivisions', () => {
  it('sets grid subdivisions and guards redundant updates', () => {
    const state = createPreferencesState();
    setGridSubdivisions(state, 4);
    setGridSubdivisions(state, 4);
    expect(getGridSubdivisions(state)).toBe(4);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('getGridSubdivisions', () => {
  it('reports the current grid subdivision count', () => {
    const state = createPreferencesState();
    expect(getGridSubdivisions(state)).toBe(10);
    setGridSubdivisions(state, 5);
    expect(getGridSubdivisions(state)).toBe(5);
  });
});

describe('setSnapToGrid', () => {
  it('sets grid snapping and guards redundant updates', () => {
    const state = createPreferencesState();
    setSnapToGrid(state, false);
    setSnapToGrid(state, false);
    expect(isSnapToGrid(state)).toBe(false);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('isSnapToGrid', () => {
  it('reports whether grid snapping is enabled', () => {
    const state = createPreferencesState();
    expect(isSnapToGrid(state)).toBe(true);
    setSnapToGrid(state, false);
    expect(isSnapToGrid(state)).toBe(false);
  });
});

describe('setSnapToGuides', () => {
  it('sets guide snapping and guards redundant updates', () => {
    const state = createPreferencesState();
    setSnapToGuides(state, false);
    setSnapToGuides(state, false);
    expect(isSnapToGuides(state)).toBe(false);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('isSnapToGuides', () => {
  it('reports whether guide snapping is enabled', () => {
    const state = createPreferencesState();
    expect(isSnapToGuides(state)).toBe(true);
    setSnapToGuides(state, false);
    expect(isSnapToGuides(state)).toBe(false);
  });
});

describe('setSnapToObjects', () => {
  it('sets object snapping and guards redundant updates', () => {
    const state = createPreferencesState();
    setSnapToObjects(state, false);
    setSnapToObjects(state, false);
    expect(isSnapToObjects(state)).toBe(false);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('isSnapToObjects', () => {
  it('reports whether object snapping is enabled', () => {
    const state = createPreferencesState();
    expect(isSnapToObjects(state)).toBe(true);
    setSnapToObjects(state, false);
    expect(isSnapToObjects(state)).toBe(false);
  });
});

describe('setAutosaveEnabled', () => {
  it('sets autosave availability and guards redundant updates', () => {
    const state = createPreferencesState();
    setAutosaveEnabled(state, false);
    setAutosaveEnabled(state, false);
    expect(isAutosaveEnabled(state)).toBe(false);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('isAutosaveEnabled', () => {
  it('reports whether autosave is enabled', () => {
    const state = createPreferencesState();
    expect(isAutosaveEnabled(state)).toBe(true);
    setAutosaveEnabled(state, false);
    expect(isAutosaveEnabled(state)).toBe(false);
  });
});

describe('setAutosaveInterval', () => {
  it('sets the autosave interval and guards redundant updates', () => {
    const state = createPreferencesState();
    setAutosaveInterval(state, 60_000);
    setAutosaveInterval(state, 60_000);
    expect(getAutosaveInterval(state)).toBe(60_000);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('getAutosaveInterval', () => {
  it('reports the current autosave interval in milliseconds', () => {
    const state = createPreferencesState();
    expect(getAutosaveInterval(state)).toBe(30_000);
    setAutosaveInterval(state, 5_000);
    expect(getAutosaveInterval(state)).toBe(5_000);
  });
});

describe('setMaxRecentFiles', () => {
  it('sets the recent-file limit and guards redundant updates', () => {
    const state = createPreferencesState();
    setMaxRecentFiles(state, 20);
    setMaxRecentFiles(state, 20);
    expect(getMaxRecentFiles(state)).toBe(20);
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('getMaxRecentFiles', () => {
  it('reports the current recent-file limit', () => {
    const state = createPreferencesState();
    expect(getMaxRecentFiles(state)).toBe(10);
    setMaxRecentFiles(state, 5);
    expect(getMaxRecentFiles(state)).toBe(5);
  });
});

describe('setTheme', () => {
  it('sets the preferred theme and guards redundant updates', () => {
    const state = createPreferencesState();
    setTheme(state, 'dark');
    setTheme(state, 'dark');
    expect(getTheme(state)).toBe('dark');
    expect(getPreferencesVersion(state)).toBe(1);
  });
});

describe('getTheme', () => {
  it('reports the current theme preference', () => {
    const state = createPreferencesState();
    expect(getTheme(state)).toBe('system');
    setTheme(state, 'light');
    expect(getTheme(state)).toBe('light');
  });
});

describe('getPreferencesVersion', () => {
  it('tracks changes to every preference', () => {
    const state = createPreferencesState();
    setGridSize(state, 16);
    setGridSubdivisions(state, 4);
    setSnapToGrid(state, false);
    setSnapToGuides(state, false);
    setSnapToObjects(state, false);
    setAutosaveEnabled(state, false);
    setAutosaveInterval(state, 60_000);
    setMaxRecentFiles(state, 20);
    setTheme(state, 'dark');
    expect(getPreferencesVersion(state)).toBe(9);
  });
});
