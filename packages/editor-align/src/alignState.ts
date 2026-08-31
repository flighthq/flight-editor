export type AlignAxis = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export type DistributeAxis = 'horizontal' | 'vertical';

export type AlignTarget = 'selection' | 'artboard' | 'key-object';

export type DistributeMode = 'equal-spacing' | 'equal-size';

export interface AlignState {
  target: AlignTarget;
  distributeMode: DistributeMode;
  lastAlignAxis: AlignAxis | null;
  lastDistributeAxis: DistributeAxis | null;
  keyObjectId: string | null;
  version: number;
}

export function createAlignState(): AlignState {
  return {
    target: 'selection',
    distributeMode: 'equal-spacing',
    lastAlignAxis: null,
    lastDistributeAxis: null,
    keyObjectId: null,
    version: 0,
  };
}

export function getAlignTarget(state: Readonly<AlignState>): AlignTarget {
  return state.target;
}

export function setAlignTarget(state: AlignState, target: AlignTarget): void {
  if (state.target === target) return;
  state.target = target;
  state.version++;
}

export function getDistributeMode(state: Readonly<AlignState>): DistributeMode {
  return state.distributeMode;
}

export function setDistributeMode(state: AlignState, mode: DistributeMode): void {
  if (state.distributeMode === mode) return;
  state.distributeMode = mode;
  state.version++;
}

export function getLastAlignAxis(state: Readonly<AlignState>): AlignAxis | null {
  return state.lastAlignAxis;
}

export function setLastAlignAxis(state: AlignState, axis: AlignAxis): void {
  if (state.lastAlignAxis === axis) return;
  state.lastAlignAxis = axis;
  state.version++;
}

export function getLastDistributeAxis(state: Readonly<AlignState>): DistributeAxis | null {
  return state.lastDistributeAxis;
}

export function setLastDistributeAxis(state: AlignState, axis: DistributeAxis): void {
  if (state.lastDistributeAxis === axis) return;
  state.lastDistributeAxis = axis;
  state.version++;
}

export function getKeyObjectId(state: Readonly<AlignState>): string | null {
  return state.keyObjectId;
}

export function setKeyObjectId(state: AlignState, id: string | null): void {
  if (id !== null && id.trim() === '') throw new TypeError('Key object identity must not be empty');
  if (state.keyObjectId === id) return;
  state.keyObjectId = id;
  if (id !== null) {
    state.target = 'key-object';
  }
  state.version++;
}

export function clearKeyObject(state: AlignState): void {
  if (state.keyObjectId === null) return;
  state.keyObjectId = null;
  if (state.target === 'key-object') {
    state.target = 'selection';
  }
  state.version++;
}

export function getAlignVersion(state: Readonly<AlignState>): number {
  return state.version;
}
