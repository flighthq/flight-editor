export type BackgroundPattern = 'none' | 'checkerboard' | 'solid';

export interface CanvasState {
  showGrid: boolean;
  showGuides: boolean;
  showBounds: boolean;
  showPixelGrid: boolean;
  backgroundPattern: BackgroundPattern;
  pixelRatio: number;
  overlayOpacity: number;
  version: number;
}

export function createCanvasState(): CanvasState {
  return {
    showGrid: false,
    showGuides: true,
    showBounds: true,
    showPixelGrid: false,
    backgroundPattern: 'checkerboard',
    pixelRatio: 1,
    overlayOpacity: 1,
    version: 0,
  };
}

export function setShowGrid(state: CanvasState, show: boolean): void {
  setCanvasValue(state, 'showGrid', show);
}

export function isShowGrid(state: Readonly<CanvasState>): boolean {
  return state.showGrid;
}

export function setShowGuides(state: CanvasState, show: boolean): void {
  setCanvasValue(state, 'showGuides', show);
}

export function isShowGuides(state: Readonly<CanvasState>): boolean {
  return state.showGuides;
}

export function setShowBounds(state: CanvasState, show: boolean): void {
  setCanvasValue(state, 'showBounds', show);
}

export function isShowBounds(state: Readonly<CanvasState>): boolean {
  return state.showBounds;
}

export function setShowPixelGrid(state: CanvasState, show: boolean): void {
  setCanvasValue(state, 'showPixelGrid', show);
}

export function isShowPixelGrid(state: Readonly<CanvasState>): boolean {
  return state.showPixelGrid;
}

export function setBackgroundPattern(state: CanvasState, pattern: BackgroundPattern): void {
  setCanvasValue(state, 'backgroundPattern', pattern);
}

export function getBackgroundPattern(state: Readonly<CanvasState>): BackgroundPattern {
  return state.backgroundPattern;
}

export function setPixelRatio(state: CanvasState, ratio: number): void {
  setCanvasValue(state, 'pixelRatio', ratio);
}

export function getPixelRatio(state: Readonly<CanvasState>): number {
  return state.pixelRatio;
}

export function setOverlayOpacity(state: CanvasState, opacity: number): void {
  setCanvasValue(state, 'overlayOpacity', opacity);
}

export function getOverlayOpacity(state: Readonly<CanvasState>): number {
  return state.overlayOpacity;
}

export function getCanvasVersion(state: Readonly<CanvasState>): number {
  return state.version;
}

type CanvasValueKey = Exclude<keyof CanvasState, 'version'>;

function setCanvasValue<Key extends CanvasValueKey>(state: CanvasState, key: Key, value: CanvasState[Key]): void {
  if (state[key] === value) return;
  state[key] = value;
  state.version++;
}
