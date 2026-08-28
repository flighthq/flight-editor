import { describe, expect, it } from 'vitest';

import type { ExportSlice } from './exportSettingsState';

import {
  addExportSlice,
  clearExportSettings,
  createExportSettingsState,
  getEnabledExportSlices,
  getExportSettingsVersion,
  getExportSlice,
  getExportSlices,
  removeExportSlice,
  setExportEnabled,
  setExportFormat,
  setExportScale,
  setExportSuffix,
} from './exportSettingsState';

const slice = { nodeId: 'node-a', format: 'png', scale: 1, suffix: '', enabled: true } as const;

describe('createExportSettingsState', () => {
  it('starts empty and unmodified', () => {
    const state = createExportSettingsState();
    expect(getExportSlices(state)).toEqual([]);
    expect(getExportSettingsVersion(state)).toBe(0);
  });
});

describe('addExportSlice', () => {
  it('copies, replaces, and guards equivalent slices', () => {
    const state = createExportSettingsState();
    const source: ExportSlice = { ...slice };
    addExportSlice(state, source);
    source.suffix = '@mutated';
    addExportSlice(state, slice);
    expect(getExportSlice(state, 'node-a')?.suffix).toBe('');
    expect(getExportSettingsVersion(state)).toBe(1);
    addExportSlice(state, { ...slice, format: 'svg' });
    expect(getExportSlice(state, 'node-a')?.format).toBe('svg');
  });
});

describe('removeExportSlice', () => {
  it('removes known slices and rejects missing ids', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    expect(removeExportSlice(state, 'node-a')).toBe(true);
    expect(removeExportSlice(state, 'node-a')).toBe(false);
  });
});

describe('getExportSlice', () => {
  it('returns an isolated slice or undefined', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    const result = getExportSlice(state, 'node-a')!;
    result.suffix = '@2x';
    expect(getExportSlice(state, 'node-a')?.suffix).toBe('');
    expect(getExportSlice(state, 'missing')).toBeUndefined();
  });
});

describe('getExportSlices', () => {
  it('returns slices in insertion order', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    addExportSlice(state, { ...slice, nodeId: 'node-b' });
    expect(getExportSlices(state).map(({ nodeId }) => nodeId)).toEqual(['node-a', 'node-b']);
  });
});

describe('getEnabledExportSlices', () => {
  it('filters disabled slices', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    addExportSlice(state, { ...slice, nodeId: 'node-b', enabled: false });
    expect(getEnabledExportSlices(state).map(({ nodeId }) => nodeId)).toEqual(['node-a']);
  });
});

describe('setExportFormat', () => {
  it('sets a known format once', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    expect(setExportFormat(state, 'node-a', 'webp')).toBe(true);
    expect(setExportFormat(state, 'node-a', 'webp')).toBe(false);
    expect(getExportSlice(state, 'node-a')?.format).toBe('webp');
  });
});

describe('setExportScale', () => {
  it('sets scale and rejects unknown ids', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    expect(setExportScale(state, 'node-a', 2)).toBe(true);
    expect(setExportScale(state, 'missing', 2)).toBe(false);
    expect(getExportSlice(state, 'node-a')?.scale).toBe(2);
  });
});

describe('setExportSuffix', () => {
  it('sets the filename suffix', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    expect(setExportSuffix(state, 'node-a', '@2x')).toBe(true);
    expect(getExportSlice(state, 'node-a')?.suffix).toBe('@2x');
  });
});

describe('setExportEnabled', () => {
  it('sets enabled state', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    expect(setExportEnabled(state, 'node-a', false)).toBe(true);
    expect(getEnabledExportSlices(state)).toEqual([]);
  });
});

describe('clearExportSettings', () => {
  it('clears non-empty state and guards empty state', () => {
    const state = createExportSettingsState();
    clearExportSettings(state);
    expect(getExportSettingsVersion(state)).toBe(0);
    addExportSlice(state, slice);
    clearExportSettings(state);
    expect(getExportSlices(state)).toEqual([]);
    expect(getExportSettingsVersion(state)).toBe(2);
  });
});

describe('getExportSettingsVersion', () => {
  it('tracks observable changes', () => {
    const state = createExportSettingsState();
    addExportSlice(state, slice);
    setExportScale(state, 'node-a', 3);
    expect(getExportSettingsVersion(state)).toBe(2);
  });
});
