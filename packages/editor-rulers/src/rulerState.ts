export type RulerUnit = 'pixels' | 'inches' | 'centimeters';

export interface RulerState {
  visible: boolean;
  unit: RulerUnit;
  originX: number;
  originY: number;
  tickSpacing: number;
  subdivisions: number;
  version: number;
}

export function createRulerState(): RulerState {
  return {
    visible: true,
    unit: 'pixels',
    originX: 0,
    originY: 0,
    tickSpacing: 100,
    subdivisions: 10,
    version: 0,
  };
}

export function showRulers(state: RulerState): void {
  if (state.visible) return;
  state.visible = true;
  state.version++;
}

export function hideRulers(state: RulerState): void {
  if (!state.visible) return;
  state.visible = false;
  state.version++;
}

export function toggleRulers(state: RulerState): void {
  state.visible = !state.visible;
  state.version++;
}

export function setRulerUnit(state: RulerState, unit: RulerUnit): void {
  if (state.unit === unit) return;
  state.unit = unit;
  state.version++;
}

export function setRulerOrigin(state: RulerState, x: number, y: number): void {
  if (state.originX === x && state.originY === y) return;
  state.originX = x;
  state.originY = y;
  state.version++;
}

export function resetRulerOrigin(state: RulerState): void {
  setRulerOrigin(state, 0, 0);
}

export function setRulerTickSpacing(state: RulerState, spacing: number): void {
  if (spacing <= 0 || state.tickSpacing === spacing) return;
  state.tickSpacing = spacing;
  state.version++;
}

export function setRulerSubdivisions(state: RulerState, subdivisions: number): void {
  if (subdivisions < 1 || state.subdivisions === subdivisions) return;
  state.subdivisions = Math.floor(subdivisions);
  state.version++;
}

export function isRulerVisible(state: Readonly<RulerState>): boolean {
  return state.visible;
}

export function getRulerUnit(state: Readonly<RulerState>): RulerUnit {
  return state.unit;
}

export function getRulerOrigin(state: Readonly<RulerState>): Readonly<{ x: number; y: number }> {
  return { x: state.originX, y: state.originY };
}

export function getRulerTickSpacing(state: Readonly<RulerState>): number {
  return state.tickSpacing;
}

export function getRulerSubdivisions(state: Readonly<RulerState>): number {
  return state.subdivisions;
}

export function getRulerVersion(state: Readonly<RulerState>): number {
  return state.version;
}

export function getSubdivisionSpacing(state: Readonly<RulerState>): number {
  return state.tickSpacing / state.subdivisions;
}
