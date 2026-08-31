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
  if (!Number.isFinite(x) || !Number.isFinite(y) || x <= 0 || y <= 0) {
    throw new RangeError('Grid size must be finite and greater than zero');
  }
  if (state.sizeX === x && state.sizeY === y) return;
  state.sizeX = x;
  state.sizeY = y;
  state.version++;
}

export function getGridSubdivisions(state: Readonly<GridState>): number {
  return state.subdivisions;
}

export function setGridSubdivisions(state: GridState, subdivisions: number): void {
  if (!Number.isFinite(subdivisions)) throw new TypeError('Grid subdivisions must be finite');
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
  if (!Number.isFinite(opacity)) throw new TypeError('Grid opacity must be finite');
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

export function snapPointToGrid(
  state: Readonly<GridState>,
  point: Readonly<{ x: number; y: number }>,
): { x: number; y: number } {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new TypeError('Grid point must be finite');
  const cell = getEffectiveCellSize(state);
  if (!Number.isFinite(cell.x) || !Number.isFinite(cell.y) || cell.x <= 0 || cell.y <= 0) {
    throw new Error('Grid state cannot produce a valid cell size');
  }
  return { x: Math.round(point.x / cell.x) * cell.x, y: Math.round(point.y / cell.y) * cell.y };
}

export function validateGridState(state: Readonly<GridState>): readonly string[] {
  const diagnostics: string[] = [];
  if (!Number.isFinite(state.sizeX) || state.sizeX <= 0) diagnostics.push('invalid-size-x');
  if (!Number.isFinite(state.sizeY) || state.sizeY <= 0) diagnostics.push('invalid-size-y');
  if (!Number.isSafeInteger(state.subdivisions) || state.subdivisions < 1) diagnostics.push('invalid-subdivisions');
  if (!Number.isFinite(state.opacity) || state.opacity < 0 || state.opacity > 1) diagnostics.push('invalid-opacity');
  return diagnostics;
}
