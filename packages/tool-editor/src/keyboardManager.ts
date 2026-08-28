import type { KeyBinding, KeyboardEventLike } from '@flighthq/editor-keyboard';
import type { EditorState } from './editorState';

import {
  getKeyBinding,
  getRegisteredActions,
  matchKeyEvent,
  registerKeyBinding,
  unregisterKeyBinding,
} from '@flighthq/editor-keyboard';

export function registerEditorKeyBinding(editor: EditorState, actionId: string, binding: Readonly<KeyBinding>): void {
  registerKeyBinding(editor.keyboard, actionId, binding);
}

export function unregisterEditorKeyBinding(editor: EditorState, actionId: string): void {
  unregisterKeyBinding(editor.keyboard, actionId);
}

export function getEditorKeyBinding(editor: Readonly<EditorState>, actionId: string): KeyBinding | null {
  return getKeyBinding(editor.keyboard, actionId);
}

export function matchEditorKeyEvent(editor: Readonly<EditorState>, event: Readonly<KeyboardEventLike>): string | null {
  return matchKeyEvent(editor.keyboard, event);
}

export function getEditorRegisteredActions(editor: Readonly<EditorState>): readonly string[] {
  return getRegisteredActions(editor.keyboard);
}
