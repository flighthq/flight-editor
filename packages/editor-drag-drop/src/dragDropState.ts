export type DragSource = 'library' | 'hierarchy' | 'external';

export interface DragPayload {
  readonly source: DragSource;
  readonly kind: string;
  readonly data: unknown;
}

export interface DragPosition {
  x: number;
  y: number;
}

export interface DragDropState {
  active: boolean;
  payload: DragPayload | null;
  position: DragPosition | null;
  dropTarget: unknown | null;
  version: number;
}

export function createDragDropState(): DragDropState {
  return { active: false, payload: null, position: null, dropTarget: null, version: 0 };
}

export function beginDrag(state: DragDropState, payload: DragPayload, x: number, y: number): void {
  state.active = true;
  state.payload = payload;
  state.position = { x, y };
  state.dropTarget = null;
  state.version++;
}

export function updateDragPosition(state: DragDropState, x: number, y: number): void {
  if (!state.active || !state.position) return;
  state.position.x = x;
  state.position.y = y;
  state.version++;
}

export function setDropTarget(state: DragDropState, target: unknown): void {
  if (!state.active) return;
  state.dropTarget = target;
  state.version++;
}

export function endDrag(state: DragDropState): DragPayload | null {
  if (!state.active) return null;
  const payload = state.payload;
  state.active = false;
  state.payload = null;
  state.position = null;
  state.dropTarget = null;
  state.version++;
  return payload;
}

export function cancelDrag(state: DragDropState): void {
  if (!state.active) return;
  state.active = false;
  state.payload = null;
  state.position = null;
  state.dropTarget = null;
  state.version++;
}

export function isDragging(state: Readonly<DragDropState>): boolean {
  return state.active;
}

export function getDragPayload(state: Readonly<DragDropState>): DragPayload | null {
  return state.payload;
}

export function getDragPosition(state: Readonly<DragDropState>): Readonly<DragPosition> | null {
  return state.position;
}

export function getDropTarget(state: Readonly<DragDropState>): unknown | null {
  return state.dropTarget;
}

export function getDragDropVersion(state: Readonly<DragDropState>): number {
  return state.version;
}
