export interface Checkpoint {
  readonly id: number;
  readonly label: string;
  readonly data: unknown;
}

export interface HistoryState {
  checkpoints: Checkpoint[];
  nextId: number;
  version: number;
}

export function createHistoryState(): HistoryState {
  return { checkpoints: [], nextId: 1, version: 0 };
}

export function addCheckpoint(state: HistoryState, label: string, data: unknown): number {
  const id = state.nextId++;
  state.checkpoints.push({ id, label, data });
  state.version++;
  return id;
}

export function removeCheckpoint(state: HistoryState, id: number): boolean {
  const index = state.checkpoints.findIndex((checkpoint) => checkpoint.id === id);
  if (index === -1) return false;
  state.checkpoints.splice(index, 1);
  state.version++;
  return true;
}

export function getCheckpoint(state: Readonly<HistoryState>, id: number): Checkpoint | undefined {
  return state.checkpoints.find((checkpoint) => checkpoint.id === id);
}

export function getCheckpoints(state: Readonly<HistoryState>): readonly Checkpoint[] {
  return state.checkpoints;
}

export function clearCheckpoints(state: HistoryState): void {
  if (state.checkpoints.length === 0) return;
  state.checkpoints.length = 0;
  state.version++;
}

export function getCheckpointCount(state: Readonly<HistoryState>): number {
  return state.checkpoints.length;
}

export function getHistoryVersion(state: Readonly<HistoryState>): number {
  return state.version;
}
