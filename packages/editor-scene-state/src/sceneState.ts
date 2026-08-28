export interface SceneState {
  name: string;
  width: number;
  height: number;
  backgroundColor: number;
  dirty: boolean;
  version: number;
}

export function createSceneState(name = 'Untitled', width = 800, height = 600): SceneState {
  return { name, width, height, backgroundColor: 0x000000ff, dirty: false, version: 0 };
}

function recordChange(state: SceneState): void {
  state.dirty = true;
  state.version++;
}

export function setSceneName(state: SceneState, name: string): void {
  if (state.name === name) return;
  state.name = name;
  recordChange(state);
}

export function setSceneDimensions(state: SceneState, width: number, height: number): void {
  if (state.width === width && state.height === height) return;
  state.width = width;
  state.height = height;
  recordChange(state);
}

export function setSceneBackgroundColor(state: SceneState, backgroundColor: number): void {
  const packedColor = backgroundColor >>> 0;
  if (state.backgroundColor === packedColor) return;
  state.backgroundColor = packedColor;
  recordChange(state);
}

export function markSceneDirty(state: SceneState): void {
  if (state.dirty) return;
  recordChange(state);
}

export function markSceneClean(state: SceneState): void {
  if (!state.dirty) return;
  state.dirty = false;
  state.version++;
}

export function isSceneDirty(state: Readonly<SceneState>): boolean {
  return state.dirty;
}

export function getSceneVersion(state: Readonly<SceneState>): number {
  return state.version;
}
