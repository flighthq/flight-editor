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
  sessionVersion: number;
}

export function createBooleanState(): BooleanState {
  return { entries: new Map(), activeOperation: 'union', version: 0, sessionVersion: 0 };
}

export function getActiveOperation(state: Readonly<BooleanState>): BooleanOperation {
  return state.activeOperation;
}

export function setActiveOperation(state: BooleanState, operation: BooleanOperation): void {
  if (state.activeOperation === operation) return;
  state.activeOperation = operation;
  state.sessionVersion++;
}

export function addBooleanEntry(state: BooleanState, entry: BooleanEntry): void {
  const normalized = normalizeBooleanEntry(entry);
  if (state.entries.has(entry.resultNodeId)) throw new Error(`Boolean result already exists: ${entry.resultNodeId}`);
  state.entries.set(entry.resultNodeId, normalized);
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
  return Array.from(state.entries.values()).sort((a, b) => a.resultNodeId.localeCompare(b.resultNodeId));
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

function normalizeBooleanEntry(entry: BooleanEntry): BooleanEntry {
  if (entry.resultNodeId.trim() === '') throw new TypeError('Boolean result identity must not be empty');
  if (entry.operands.length < 2) throw new Error('A boolean operation requires at least two operands');
  const nodeIds = new Set<string>();
  const operands = [...entry.operands].sort((a, b) => a.order - b.order || a.nodeId.localeCompare(b.nodeId));
  for (const operand of operands) {
    if (operand.nodeId.trim() === '') throw new TypeError('Boolean operand identity must not be empty');
    if (!Number.isSafeInteger(operand.order) || operand.order < 0)
      throw new TypeError('Boolean operand order must be a non-negative integer');
    if (operand.nodeId === entry.resultNodeId) throw new Error('Boolean result cannot be its own operand');
    if (nodeIds.has(operand.nodeId)) throw new Error(`Duplicate boolean operand: ${operand.nodeId}`);
    nodeIds.add(operand.nodeId);
  }
  return { ...entry, operands: operands.map((operand, order) => ({ ...operand, order })) };
}

export function replaceBooleanEntry(state: BooleanState, entry: BooleanEntry): boolean {
  const current = state.entries.get(entry.resultNodeId);
  if (current === undefined) return false;
  state.entries.set(entry.resultNodeId, normalizeBooleanEntry(entry));
  state.version++;
  return true;
}

export function getBooleanSessionVersion(state: Readonly<BooleanState>): number {
  return state.sessionVersion;
}

export function validateBooleanState(state: Readonly<BooleanState>): readonly string[] {
  const diagnostics: string[] = [];
  for (const entry of getBooleanEntries(state)) {
    try {
      normalizeBooleanEntry(entry);
    } catch (error) {
      diagnostics.push(`${entry.resultNodeId}:${error instanceof Error ? error.message : 'invalid'}`);
    }
  }
  return diagnostics;
}
