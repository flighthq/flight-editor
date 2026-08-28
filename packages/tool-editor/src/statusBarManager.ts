import type { MessageSeverity } from '@flighthq/editor-status';
import type { CursorPosition } from '@flighthq/editor-status';
import type { EditorState } from './editorState';

import {
  clearCursorPosition,
  clearStatusMessage,
  getActiveToolName,
  getCursorPosition,
  getSelectionCount,
  getSelectionLabel,
  getStatusBarVersion,
  getStatusMessage,
  getZoomPercent,
  setActiveToolName,
  setCursorPosition,
  setSelectionInfo,
  setStatusMessage,
  setZoomPercent,
} from '@flighthq/editor-status';

export function getEditorStatusMessage(editor: Readonly<EditorState>): string | null {
  const msg = getStatusMessage(editor.statusBar);
  return msg ? msg.text : null;
}

export function setEditorStatusMessage(
  editor: EditorState,
  text: string,
  severity: MessageSeverity = 'info',
  timestamp: number = 0,
): void {
  setStatusMessage(editor.statusBar, text, severity, timestamp);
}

export function clearEditorStatusMessage(editor: EditorState): void {
  clearStatusMessage(editor.statusBar);
}

export function getEditorStatusZoomPercent(editor: Readonly<EditorState>): number {
  return getZoomPercent(editor.statusBar);
}

export function setEditorStatusZoomPercent(editor: EditorState, percent: number): void {
  setZoomPercent(editor.statusBar, percent);
}

export function getEditorStatusSelectionCount(editor: Readonly<EditorState>): number {
  return getSelectionCount(editor.statusBar);
}

export function getEditorStatusSelectionLabel(editor: Readonly<EditorState>): string {
  return getSelectionLabel(editor.statusBar);
}

export function setEditorStatusSelectionInfo(editor: EditorState, count: number, label: string): void {
  setSelectionInfo(editor.statusBar, count, label);
}

export function getEditorStatusActiveToolName(editor: Readonly<EditorState>): string {
  return getActiveToolName(editor.statusBar);
}

export function setEditorStatusActiveToolName(editor: EditorState, name: string): void {
  setActiveToolName(editor.statusBar, name);
}

export function getEditorCursorPosition(editor: Readonly<EditorState>): CursorPosition | null {
  return getCursorPosition(editor.statusBar);
}

export function setEditorCursorPosition(editor: EditorState, x: number, y: number): void {
  setCursorPosition(editor.statusBar, x, y);
}

export function clearEditorCursorPosition(editor: EditorState): void {
  clearCursorPosition(editor.statusBar);
}

export function getEditorStatusBarVersion(editor: Readonly<EditorState>): number {
  return getStatusBarVersion(editor.statusBar);
}
