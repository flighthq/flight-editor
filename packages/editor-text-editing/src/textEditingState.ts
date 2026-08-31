export interface TextSelection {
  readonly start: number;
  readonly end: number;
}

export interface TextEditingState {
  active: boolean;
  targetId: string | null;
  caretPosition: number;
  selection: TextSelection | null;
  composing: boolean;
  version: number;
}

export function createTextEditingState(): TextEditingState {
  return {
    active: false,
    targetId: null,
    caretPosition: 0,
    selection: null,
    composing: false,
    version: 0,
  };
}

export function isTextEditingActive(state: Readonly<TextEditingState>): boolean {
  return state.active;
}

export function getTextEditingTargetId(state: Readonly<TextEditingState>): string | null {
  return state.targetId;
}

export function beginTextEditing(state: TextEditingState, targetId: string, caretPosition: number): void {
  state.active = true;
  state.targetId = targetId;
  state.caretPosition = caretPosition;
  state.selection = null;
  state.composing = false;
  state.version++;
}

export function endTextEditing(state: TextEditingState): void {
  if (!state.active) return;
  state.active = false;
  state.targetId = null;
  state.caretPosition = 0;
  state.selection = null;
  state.composing = false;
  state.version++;
}

export function getCaretPosition(state: Readonly<TextEditingState>): number {
  return state.caretPosition;
}

export function setCaretPosition(state: TextEditingState, position: number): void {
  if (state.caretPosition === position && state.selection === null) return;
  state.caretPosition = position;
  state.selection = null;
  state.version++;
}

export function getTextSelection(state: Readonly<TextEditingState>): TextSelection | null {
  return state.selection;
}

export function setTextSelection(state: TextEditingState, start: number, end: number): void {
  state.selection = { start: Math.min(start, end), end: Math.max(start, end) };
  state.caretPosition = end;
  state.version++;
}

export function clearTextSelection(state: TextEditingState): void {
  if (state.selection === null) return;
  state.selection = null;
  state.version++;
}

export function hasTextSelection(state: Readonly<TextEditingState>): boolean {
  return state.selection !== null && state.selection.start !== state.selection.end;
}

export function isComposing(state: Readonly<TextEditingState>): boolean {
  return state.composing;
}

export function setComposing(state: TextEditingState, composing: boolean): void {
  if (state.composing === composing) return;
  state.composing = composing;
  state.version++;
}

export function getTextEditingVersion(state: Readonly<TextEditingState>): number {
  return state.version;
}
