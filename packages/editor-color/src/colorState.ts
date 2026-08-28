const DEFAULT_ACTIVE_COLOR = 0x000000ff;
const DEFAULT_MAX_RECENT = 10;

export interface ColorState {
  activeColor: number;
  swatches: number[];
  recentColors: number[];
  maxRecent: number;
  version: number;
}

function packColor(color: number): number {
  return color >>> 0;
}

export function createColorState(): ColorState {
  return {
    activeColor: DEFAULT_ACTIVE_COLOR,
    swatches: [],
    recentColors: [],
    maxRecent: DEFAULT_MAX_RECENT,
    version: 0,
  };
}

export function setActiveColor(state: ColorState, color: number): void {
  const packed = packColor(color);
  if (state.activeColor === packed) return;
  state.activeColor = packed;
  state.version++;
}

export function getActiveColor(state: Readonly<ColorState>): number {
  return state.activeColor;
}

export function addSwatch(state: ColorState, color: number): void {
  state.swatches.push(packColor(color));
  state.version++;
}

export function removeSwatch(state: ColorState, index: number): boolean {
  if (index < 0 || index >= state.swatches.length) return false;
  state.swatches.splice(index, 1);
  state.version++;
  return true;
}

export function getSwatches(state: Readonly<ColorState>): readonly number[] {
  return state.swatches;
}

export function clearSwatches(state: ColorState): void {
  if (state.swatches.length === 0) return;
  state.swatches.length = 0;
  state.version++;
}

export function addRecentColor(state: ColorState, color: number): void {
  state.recentColors.push(packColor(color));
  while (state.recentColors.length > state.maxRecent) {
    state.recentColors.shift();
  }
  state.version++;
}

export function getRecentColors(state: Readonly<ColorState>): readonly number[] {
  return state.recentColors;
}

export function getColorVersion(state: Readonly<ColorState>): number {
  return state.version;
}
