export type MessageSeverity = 'info' | 'warning' | 'error';

export interface StatusMessage {
  readonly text: string;
  readonly severity: MessageSeverity;
  readonly timestamp: number;
}

export interface CursorPosition {
  readonly x: number;
  readonly y: number;
}

export interface StatusBarState {
  message: StatusMessage | null;
  zoomPercent: number;
  selectionCount: number;
  selectionLabel: string;
  cursorPosition: CursorPosition | null;
  activeToolName: string;
  version: number;
}

export function createStatusBarState(): StatusBarState {
  return {
    message: null,
    zoomPercent: 100,
    selectionCount: 0,
    selectionLabel: '',
    cursorPosition: null,
    activeToolName: '',
    version: 0,
  };
}

export function getStatusMessage(state: Readonly<StatusBarState>): StatusMessage | null {
  return state.message;
}

export function setStatusMessage(
  state: StatusBarState,
  text: string,
  severity: MessageSeverity,
  timestamp: number,
): void {
  state.message = { text, severity, timestamp };
  state.version++;
}

export function clearStatusMessage(state: StatusBarState): void {
  if (state.message === null) return;
  state.message = null;
  state.version++;
}

export function getZoomPercent(state: Readonly<StatusBarState>): number {
  return state.zoomPercent;
}

export function setZoomPercent(state: StatusBarState, percent: number): void {
  if (state.zoomPercent === percent) return;
  state.zoomPercent = percent;
  state.version++;
}

export function getSelectionCount(state: Readonly<StatusBarState>): number {
  return state.selectionCount;
}

export function getSelectionLabel(state: Readonly<StatusBarState>): string {
  return state.selectionLabel;
}

export function setSelectionInfo(state: StatusBarState, count: number, label: string): void {
  if (state.selectionCount === count && state.selectionLabel === label) return;
  state.selectionCount = count;
  state.selectionLabel = label;
  state.version++;
}

export function getCursorPosition(state: Readonly<StatusBarState>): CursorPosition | null {
  return state.cursorPosition;
}

export function setCursorPosition(state: StatusBarState, x: number, y: number): void {
  if (state.cursorPosition && state.cursorPosition.x === x && state.cursorPosition.y === y) return;
  state.cursorPosition = { x, y };
  state.version++;
}

export function clearCursorPosition(state: StatusBarState): void {
  if (state.cursorPosition === null) return;
  state.cursorPosition = null;
  state.version++;
}

export function getActiveToolName(state: Readonly<StatusBarState>): string {
  return state.activeToolName;
}

export function setActiveToolName(state: StatusBarState, name: string): void {
  if (state.activeToolName === name) return;
  state.activeToolName = name;
  state.version++;
}

export function getStatusBarVersion(state: Readonly<StatusBarState>): number {
  return state.version;
}
