export type BooleanOperation = 'union' | 'subtract' | 'intersect' | 'exclude';

export interface BooleanOperand {
  readonly nodeId: string;
  readonly order: number;
}

export interface BooleanEntry {
  readonly resultNodeId: string;
  readonly operation: BooleanOperation;
  readonly operands: readonly BooleanOperand[];
}

export interface BooleanState {
  entries: Map<string, BooleanEntry>;
  activeOperation: BooleanOperation;
  version: number;
}

export function createBooleanState(): BooleanState {
  return { entries: new Map(), activeOperation: 'union', version: 0 };
}

export function getActiveOperation(state: Readonly<BooleanState>): BooleanOperation {
  return state.activeOperation;
}

export function setActiveOperation(state: BooleanState, operation: BooleanOperation): void {
  if (state.activeOperation === operation) return;
  state.activeOperation = operation;
  state.version++;
}

export function addBooleanEntry(state: BooleanState, entry: BooleanEntry): void {
  state.entries.set(entry.resultNodeId, entry);
  state.version++;
}

export function removeBooleanEntry(state: BooleanState, resultNodeId: string): boolean {
  if (!state.entries.delete(resultNodeId)) return false;
  state.version++;
  return true;
}

export function getBooleanEntry(state: Readonly<BooleanState>, resultNodeId: string): BooleanEntry | undefined {
  return state.entries.get(resultNodeId);
}

export function getBooleanEntries(state: Readonly<BooleanState>): readonly BooleanEntry[] {
  return Array.from(state.entries.values());
}

export function getBooleanEntryCount(state: Readonly<BooleanState>): number {
  return state.entries.size;
}

export function clearBooleanEntries(state: BooleanState): void {
  if (state.entries.size === 0) return;
  state.entries.clear();
  state.version++;
}

export function getBooleanVersion(state: Readonly<BooleanState>): number {
  return state.version;
}
