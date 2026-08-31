export type CursorShape =
  | 'default'
  | 'pointer'
  | 'crosshair'
  | 'move'
  | 'grab'
  | 'grabbing'
  | 'text'
  | 'not-allowed'
  | 'resize-n'
  | 'resize-ne'
  | 'resize-e'
  | 'resize-se'
  | 'resize-s'
  | 'resize-sw'
  | 'resize-w'
  | 'resize-nw'
  | 'rotate'
  | 'eyedropper'
  | 'pen'
  | 'pen-add'
  | 'pen-remove'
  | 'pen-close'
  | 'zoom-in'
  | 'zoom-out'
  | 'none';

export interface CursorOverride {
  readonly shape: CursorShape;
  readonly source: string;
}

export interface CursorState {
  toolDefault: CursorShape;
  overrides: CursorOverride[];
  version: number;
}

export function createCursorState(): CursorState {
  return { toolDefault: 'default', overrides: [], version: 0 };
}

export function getActiveCursor(state: Readonly<CursorState>): CursorShape {
  if (state.overrides.length > 0) {
    return state.overrides[state.overrides.length - 1].shape;
  }
  return state.toolDefault;
}

export function getToolDefaultCursor(state: Readonly<CursorState>): CursorShape {
  return state.toolDefault;
}

export function setToolDefaultCursor(state: CursorState, shape: CursorShape): void {
  if (state.toolDefault === shape) return;
  state.toolDefault = shape;
  state.version++;
}

export function pushCursorOverride(state: CursorState, shape: CursorShape, source: string): void {
  state.overrides.push({ shape, source });
  state.version++;
}

export function popCursorOverride(state: CursorState, source: string): boolean {
  for (let i = state.overrides.length - 1; i >= 0; i--) {
    if (state.overrides[i].source === source) {
      state.overrides.splice(i, 1);
      state.version++;
      return true;
    }
  }
  return false;
}

export function clearCursorOverrides(state: CursorState): void {
  if (state.overrides.length === 0) return;
  state.overrides.length = 0;
  state.version++;
}

export function getCursorOverrideCount(state: Readonly<CursorState>): number {
  return state.overrides.length;
}

export function getCursorVersion(state: Readonly<CursorState>): number {
  return state.version;
}
