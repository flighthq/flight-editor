export type ExportFormat = 'png' | 'svg' | 'jpeg' | 'webp';

export interface ExportSlice {
  readonly nodeId: string;
  format: ExportFormat;
  scale: number;
  suffix: string;
  enabled: boolean;
}

export interface ExportSettingsState {
  readonly slices: Map<string, ExportSlice>;
  version: number;
}

export function createExportSettingsState(): ExportSettingsState {
  return { slices: new Map(), version: 0 };
}

export function addExportSlice(state: ExportSettingsState, slice: Readonly<ExportSlice>): void {
  const current = state.slices.get(slice.nodeId);
  if (current && exportSlicesEqual(current, slice)) return;
  state.slices.set(slice.nodeId, { ...slice });
  state.version++;
}

export function removeExportSlice(state: ExportSettingsState, nodeId: string): boolean {
  if (!state.slices.delete(nodeId)) return false;
  state.version++;
  return true;
}

export function getExportSlice(state: Readonly<ExportSettingsState>, nodeId: string): ExportSlice | undefined {
  const slice = state.slices.get(nodeId);
  return slice ? { ...slice } : undefined;
}

export function getExportSlices(state: Readonly<ExportSettingsState>): readonly ExportSlice[] {
  return [...state.slices.values()].map((slice) => ({ ...slice }));
}

export function getEnabledExportSlices(state: Readonly<ExportSettingsState>): readonly ExportSlice[] {
  return getExportSlices(state).filter((slice) => slice.enabled);
}

export function setExportFormat(state: ExportSettingsState, nodeId: string, format: ExportFormat): boolean {
  return setSliceValue(state, nodeId, 'format', format);
}

export function setExportScale(state: ExportSettingsState, nodeId: string, scale: number): boolean {
  return setSliceValue(state, nodeId, 'scale', scale);
}

export function setExportSuffix(state: ExportSettingsState, nodeId: string, suffix: string): boolean {
  return setSliceValue(state, nodeId, 'suffix', suffix);
}

export function setExportEnabled(state: ExportSettingsState, nodeId: string, enabled: boolean): boolean {
  return setSliceValue(state, nodeId, 'enabled', enabled);
}

export function clearExportSettings(state: ExportSettingsState): void {
  if (state.slices.size === 0) return;
  state.slices.clear();
  state.version++;
}

export function getExportSettingsVersion(state: Readonly<ExportSettingsState>): number {
  return state.version;
}

function exportSlicesEqual(a: Readonly<ExportSlice>, b: Readonly<ExportSlice>): boolean {
  return (
    a.nodeId === b.nodeId &&
    a.format === b.format &&
    a.scale === b.scale &&
    a.suffix === b.suffix &&
    a.enabled === b.enabled
  );
}

function setSliceValue<Key extends keyof Omit<ExportSlice, 'nodeId'>>(
  state: ExportSettingsState,
  nodeId: string,
  key: Key,
  value: ExportSlice[Key],
): boolean {
  const slice = state.slices.get(nodeId);
  if (!slice || slice[key] === value) return false;
  slice[key] = value;
  state.version++;
  return true;
}
