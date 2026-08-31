export interface TextSelection {
  readonly start: number;
  readonly end: number;
}

export interface TextEditCommit {
  readonly targetId: string;
  readonly before: string;
  readonly after: string;
  readonly baseRevision: number;
}

export type TextExternalReconciliation = 'unchanged' | 'updated' | 'conflict' | 'stale';

export interface TextEditingState {
  active: boolean;
  targetId: string | null;
  caretPosition: number;
  selection: TextSelection | null;
  composing: boolean;
  originalText: string;
  draftText: string;
  baseRevision: number;
  externalConflict: boolean;
  contentKnown: boolean;
  version: number;
}

export function createTextEditingState(): TextEditingState {
  return {
    active: false,
    targetId: null,
    caretPosition: 0,
    selection: null,
    composing: false,
    originalText: '',
    draftText: '',
    baseRevision: 0,
    externalConflict: false,
    contentKnown: false,
    version: 0,
  };
}

export function isTextEditingActive(state: Readonly<TextEditingState>): boolean {
  return state.active;
}

export function getTextEditingTargetId(state: Readonly<TextEditingState>): string | null {
  return state.targetId;
}

export function beginTextEditing(
  state: TextEditingState,
  targetId: string,
  caretPosition: number,
  text?: string,
  revision = 0,
): void {
  if (targetId.trim() === '') throw new TypeError('Text editing target identity must not be empty');
  if (!Number.isSafeInteger(revision) || revision < 0)
    throw new TypeError('Text revision must be a non-negative integer');
  state.active = true;
  state.targetId = targetId;
  state.contentKnown = text !== undefined;
  state.originalText = text ?? '';
  state.draftText = text ?? '';
  state.baseRevision = revision;
  state.caretPosition =
    text === undefined ? normalizeUnknownOffset(caretPosition) : clampTextOffset(text, caretPosition);
  state.selection = null;
  state.composing = false;
  state.externalConflict = false;
  state.contentKnown = false;
  state.version++;
}

function resetTextEditing(state: TextEditingState): void {
  state.active = false;
  state.targetId = null;
  state.caretPosition = 0;
  state.selection = null;
  state.composing = false;
  state.originalText = '';
  state.draftText = '';
  state.baseRevision = 0;
  state.externalConflict = false;
  state.version++;
}

export function endTextEditing(state: TextEditingState): void {
  if (!state.active) return;
  resetTextEditing(state);
}

export function getCaretPosition(state: Readonly<TextEditingState>): number {
  return state.caretPosition;
}

export function setCaretPosition(state: TextEditingState, position: number): void {
  const next = state.contentKnown ? clampTextOffset(state.draftText, position) : normalizeUnknownOffset(position);
  if (state.caretPosition === next && state.selection === null) return;
  state.caretPosition = next;
  state.selection = null;
  state.version++;
}

export function getTextSelection(state: Readonly<TextEditingState>): TextSelection | null {
  return state.selection;
}

export function setTextSelection(state: TextEditingState, start: number, end: number): void {
  const anchor = state.contentKnown ? clampTextOffset(state.draftText, start) : normalizeUnknownOffset(start);
  const focus = state.contentKnown ? clampTextOffset(state.draftText, end) : normalizeUnknownOffset(end);
  const selection = { start: Math.min(anchor, focus), end: Math.max(anchor, focus) };
  if (
    state.selection?.start === selection.start &&
    state.selection.end === selection.end &&
    state.caretPosition === focus
  )
    return;
  state.selection = selection;
  state.caretPosition = focus;
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
  if (composing && !state.active) throw new Error('IME composition requires an active text edit');
  state.composing = composing;
  state.version++;
}

export function getTextEditingVersion(state: Readonly<TextEditingState>): number {
  return state.version;
}

export function getTextDraft(state: Readonly<TextEditingState>): string {
  return state.draftText;
}

export function isTextDraftDirty(state: Readonly<TextEditingState>): boolean {
  return state.draftText !== state.originalText;
}

export function replaceTextSelection(state: TextEditingState, replacement: string): void {
  if (!state.active) throw new Error('Text replacement requires an active edit');
  const start = state.selection?.start ?? state.caretPosition;
  const end = state.selection?.end ?? state.caretPosition;
  state.draftText = state.draftText.slice(0, start) + replacement + state.draftText.slice(end);
  state.caretPosition = start + replacement.length;
  state.selection = null;
  state.version++;
}

export function reconcileExternalText(
  state: TextEditingState,
  text: string,
  revision: number,
): TextExternalReconciliation {
  if (!state.active) throw new Error('External reconciliation requires an active text edit');
  if (!Number.isSafeInteger(revision) || revision < 0)
    throw new TypeError('Text revision must be a non-negative integer');
  if (revision <= state.baseRevision)
    return revision === state.baseRevision && text === state.originalText ? 'unchanged' : 'stale';
  if (!isTextDraftDirty(state)) {
    state.originalText = text;
    state.draftText = text;
    state.baseRevision = revision;
    state.caretPosition = clampTextOffset(text, state.caretPosition);
    state.selection = null;
    state.version++;
    return 'updated';
  }
  if (text === state.originalText) {
    state.baseRevision = revision;
    return 'unchanged';
  }
  state.externalConflict = true;
  state.version++;
  return 'conflict';
}

export function hasTextExternalConflict(state: Readonly<TextEditingState>): boolean {
  return state.externalConflict;
}

export function commitTextEditing(state: TextEditingState): TextEditCommit | null {
  if (!state.active) return null;
  if (state.composing) throw new Error('Cannot commit text during IME composition');
  if (state.externalConflict) throw new Error('Cannot commit text with an unresolved external conflict');
  const commit =
    state.targetId !== null && isTextDraftDirty(state)
      ? {
          targetId: state.targetId,
          before: state.originalText,
          after: state.draftText,
          baseRevision: state.baseRevision,
        }
      : null;
  resetTextEditing(state);
  return commit;
}

export function cancelTextEditing(state: TextEditingState): boolean {
  if (!state.active) return false;
  resetTextEditing(state);
  return true;
}

export function clampTextOffset(text: string, offset: number): number {
  if (!Number.isFinite(offset)) throw new TypeError('Text offset must be finite');
  const bounded = Math.max(0, Math.min(text.length, Math.floor(offset)));
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let previous = 0;
  for (const segment of segmenter.segment(text)) {
    if (segment.index >= bounded) {
      return bounded - previous <= segment.index - bounded ? previous : segment.index;
    }
    previous = segment.index;
  }
  return text.length;
}

function normalizeUnknownOffset(offset: number): number {
  if (!Number.isFinite(offset)) throw new TypeError('Text offset must be finite');
  return Math.max(0, Math.floor(offset));
}
