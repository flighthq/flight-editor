export type TransformOriginMode = 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'custom';

export interface TransformOriginState {
  mode: TransformOriginMode;
  customX: number;
  customY: number;
  version: number;
}

export interface TransformOriginBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TransformOriginPoint {
  readonly x: number;
  readonly y: number;
}

export function createTransformOriginState(): TransformOriginState {
  return { mode: 'center', customX: 0, customY: 0, version: 0 };
}

export function setTransformOriginMode(state: TransformOriginState, mode: TransformOriginMode): void {
  if (state.mode === mode) return;
  state.mode = mode;
  state.version++;
}

export function setCustomTransformOrigin(state: TransformOriginState, x: number, y: number): void {
  if (state.mode === 'custom' && state.customX === x && state.customY === y) return;
  state.mode = 'custom';
  state.customX = x;
  state.customY = y;
  state.version++;
}

export function getTransformOriginMode(state: Readonly<TransformOriginState>): TransformOriginMode {
  return state.mode;
}

export function getCustomTransformOrigin(state: Readonly<TransformOriginState>): TransformOriginPoint {
  return { x: state.customX, y: state.customY };
}

export function getTransformOriginVersion(state: Readonly<TransformOriginState>): number {
  return state.version;
}

export function computeTransformOriginPoint(
  state: Readonly<TransformOriginState>,
  bounds: TransformOriginBounds,
): TransformOriginPoint {
  switch (state.mode) {
    case 'topLeft':
      return { x: bounds.x, y: bounds.y };
    case 'topRight':
      return { x: bounds.x + bounds.width, y: bounds.y };
    case 'bottomLeft':
      return { x: bounds.x, y: bounds.y + bounds.height };
    case 'bottomRight':
      return { x: bounds.x + bounds.width, y: bounds.y + bounds.height };
    case 'custom':
      return getCustomTransformOrigin(state);
    case 'center':
      return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  }
}
