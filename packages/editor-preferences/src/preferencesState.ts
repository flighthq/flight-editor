export type Theme = 'light' | 'dark' | 'system';

export interface PreferencesState {
  gridSize: number;
  gridSubdivisions: number;
  snapToGrid: boolean;
  snapToGuides: boolean;
  snapToObjects: boolean;
  autosaveEnabled: boolean;
  autosaveIntervalMs: number;
  maxRecentFiles: number;
  theme: Theme;
  version: number;
}

export function createPreferencesState(): PreferencesState {
  return {
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
  };
}

export function setGridSize(state: PreferencesState, size: number): void {
  setPreferenceValue(state, 'gridSize', size);
}

export function getGridSize(state: Readonly<PreferencesState>): number {
  return state.gridSize;
}

export function setGridSubdivisions(state: PreferencesState, subdivisions: number): void {
  setPreferenceValue(state, 'gridSubdivisions', subdivisions);
}

export function getGridSubdivisions(state: Readonly<PreferencesState>): number {
  return state.gridSubdivisions;
}

export function setSnapToGrid(state: PreferencesState, enabled: boolean): void {
  setPreferenceValue(state, 'snapToGrid', enabled);
}

export function isSnapToGrid(state: Readonly<PreferencesState>): boolean {
  return state.snapToGrid;
}

export function setSnapToGuides(state: PreferencesState, enabled: boolean): void {
  setPreferenceValue(state, 'snapToGuides', enabled);
}

export function isSnapToGuides(state: Readonly<PreferencesState>): boolean {
  return state.snapToGuides;
}

export function setSnapToObjects(state: PreferencesState, enabled: boolean): void {
  setPreferenceValue(state, 'snapToObjects', enabled);
}

export function isSnapToObjects(state: Readonly<PreferencesState>): boolean {
  return state.snapToObjects;
}

export function setAutosaveEnabled(state: PreferencesState, enabled: boolean): void {
  setPreferenceValue(state, 'autosaveEnabled', enabled);
}

export function isAutosaveEnabled(state: Readonly<PreferencesState>): boolean {
  return state.autosaveEnabled;
}

export function setAutosaveInterval(state: PreferencesState, ms: number): void {
  setPreferenceValue(state, 'autosaveIntervalMs', ms);
}

export function getAutosaveInterval(state: Readonly<PreferencesState>): number {
  return state.autosaveIntervalMs;
}

export function setMaxRecentFiles(state: PreferencesState, count: number): void {
  setPreferenceValue(state, 'maxRecentFiles', count);
}

export function getMaxRecentFiles(state: Readonly<PreferencesState>): number {
  return state.maxRecentFiles;
}

export function setTheme(state: PreferencesState, theme: Theme): void {
  setPreferenceValue(state, 'theme', theme);
}

export function getTheme(state: Readonly<PreferencesState>): Theme {
  return state.theme;
}

export function getPreferencesVersion(state: Readonly<PreferencesState>): number {
  return state.version;
}

type PreferenceValueKey = Exclude<keyof PreferencesState, 'version'>;

function setPreferenceValue<Key extends PreferenceValueKey>(
  state: PreferencesState,
  key: Key,
  value: PreferencesState[Key],
): void {
  if (state[key] === value) return;
  state[key] = value;
  state.version++;
}
