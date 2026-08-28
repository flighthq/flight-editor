export interface ZoomPreset {
  id: string;
  label: string;
  zoom: number;
}

export interface ZoomPresetState {
  presets: ZoomPreset[];
  version: number;
}

const BUILT_IN_PRESETS: readonly ZoomPreset[] = [
  { id: 'fit', label: 'Fit', zoom: 0 },
  { id: '50%', label: '50%', zoom: 0.5 },
  { id: '100%', label: '100%', zoom: 1 },
  { id: '200%', label: '200%', zoom: 2 },
  { id: '400%', label: '400%', zoom: 4 },
];

export function createZoomPresetState(): ZoomPresetState {
  return { presets: BUILT_IN_PRESETS.map((preset) => ({ ...preset })), version: 0 };
}

export function addZoomPreset(state: ZoomPresetState, id: string, label: string, zoom: number): void {
  const existing = state.presets.find((preset) => preset.id === id);
  if (existing !== undefined) {
    if (existing.label === label && existing.zoom === zoom) return;
    existing.label = label;
    existing.zoom = zoom;
  } else {
    state.presets.push({ id, label, zoom });
  }
  state.version++;
}

export function removeZoomPreset(state: ZoomPresetState, id: string): boolean {
  const index = state.presets.findIndex((preset) => preset.id === id);
  if (index === -1) return false;
  state.presets.splice(index, 1);
  state.version++;
  return true;
}

export function getZoomPresets(state: Readonly<ZoomPresetState>): readonly ZoomPreset[] {
  return state.presets;
}

export function getZoomPreset(state: Readonly<ZoomPresetState>, id: string): ZoomPreset | null {
  return state.presets.find((preset) => preset.id === id) ?? null;
}

export function getZoomPresetVersion(state: Readonly<ZoomPresetState>): number {
  return state.version;
}

export function computeFitZoom(
  sceneWidth: number,
  sceneHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): number {
  if (sceneWidth <= 0 || sceneHeight <= 0 || viewportWidth <= 0 || viewportHeight <= 0) return 1;
  return Math.min(viewportWidth / sceneWidth, viewportHeight / sceneHeight);
}

export function computeFitWidthZoom(sceneWidth: number, viewportWidth: number): number {
  if (sceneWidth <= 0 || viewportWidth <= 0) return 1;
  return viewportWidth / sceneWidth;
}

export function findNearestPreset(state: Readonly<ZoomPresetState>, currentZoom: number): ZoomPreset | null {
  const presets = getOrderedZoomPresets(state);
  let nearest: ZoomPreset | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const preset of presets) {
    const distance = Math.abs(preset.zoom - currentZoom);
    if (distance >= nearestDistance) continue;
    nearest = preset;
    nearestDistance = distance;
  }
  return nearest;
}

export function getNextZoomIn(state: Readonly<ZoomPresetState>, currentZoom: number): number | null {
  return getOrderedZoomPresets(state).find((preset) => preset.zoom > currentZoom)?.zoom ?? null;
}

export function getNextZoomOut(state: Readonly<ZoomPresetState>, currentZoom: number): number | null {
  const presets = getOrderedZoomPresets(state);
  for (let index = presets.length - 1; index >= 0; index--) {
    if (presets[index].zoom < currentZoom) return presets[index].zoom;
  }
  return null;
}

function getOrderedZoomPresets(state: Readonly<ZoomPresetState>): ZoomPreset[] {
  return state.presets.filter((preset) => preset.zoom > 0).sort((left, right) => left.zoom - right.zoom);
}
