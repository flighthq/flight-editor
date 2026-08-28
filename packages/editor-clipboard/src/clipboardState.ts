import type { NodeAny } from '@flighthq/types';

export type ClipboardOperation = 'copy' | 'cut';

export interface ClipboardState {
  entries: NodeAny[];
  operation: ClipboardOperation | null;
  version: number;
}

export function createClipboardState(): ClipboardState {
  return { entries: [], operation: null, version: 0 };
}

export function setClipboardEntries(
  state: ClipboardState,
  nodes: readonly NodeAny[],
  operation: ClipboardOperation,
): void {
  state.entries = nodes.slice();
  state.operation = operation;
  state.version++;
}

export function getClipboardEntries(state: Readonly<ClipboardState>): readonly NodeAny[] {
  return state.entries;
}

export function getClipboardOperation(state: Readonly<ClipboardState>): ClipboardOperation | null {
  return state.operation;
}

export function getClipboardEntryCount(state: Readonly<ClipboardState>): number {
  return state.entries.length;
}

export function isClipboardEmpty(state: Readonly<ClipboardState>): boolean {
  return state.entries.length === 0;
}

export function clearClipboard(state: ClipboardState): void {
  if (state.entries.length > 0) {
    state.entries = [];
    state.operation = null;
    state.version++;
  }
}

export function getClipboardVersion(state: Readonly<ClipboardState>): number {
  return state.version;
}
