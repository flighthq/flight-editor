export interface GridState {
  sizeX: number;
  sizeY: number;
  subdivisions: number;
  visible: boolean;
  opacity: number;
  version: number;
}

export function createGridState(): GridState {
  return {
    sizeX: 10,
    sizeY: 10,
    subdivisions: 1,
    visible: true,
    opacity: 1,
    version: 0,
  };
}

export function getGridSize(state: Readonly<GridState>): { x: number; y: number } {
  return { x: state.sizeX, y: state.sizeY };
}

export function setGridSize(state: GridState, x: number, y: number): void {
  if (state.sizeX === x && state.sizeY === y) return;
  state.sizeX = x;
  state.sizeY = y;
  state.version++;
}

export function getGridSubdivisions(state: Readonly<GridState>): number {
  return state.subdivisions;
}

export function setGridSubdivisions(state: GridState, subdivisions: number): void {
  const clamped = Math.max(1, Math.floor(subdivisions));
  if (state.subdivisions === clamped) return;
  state.subdivisions = clamped;
  state.version++;
}

export function isGridVisible(state: Readonly<GridState>): boolean {
  return state.visible;
}

export function setGridVisible(state: GridState, visible: boolean): void {
  if (state.visible === visible) return;
  state.visible = visible;
  state.version++;
}

export function toggleGridVisible(state: GridState): void {
  state.visible = !state.visible;
  state.version++;
}

export function getGridOpacity(state: Readonly<GridState>): number {
  return state.opacity;
}

export function setGridOpacity(state: GridState, opacity: number): void {
  const clamped = Math.max(0, Math.min(1, opacity));
  if (state.opacity === clamped) return;
  state.opacity = clamped;
  state.version++;
}

export function getEffectiveCellSize(state: Readonly<GridState>): { x: number; y: number } {
  return {
    x: state.sizeX / state.subdivisions,
    y: state.sizeY / state.subdivisions,
  };
}

export function getGridVersion(state: Readonly<GridState>): number {
  return state.version;
}
