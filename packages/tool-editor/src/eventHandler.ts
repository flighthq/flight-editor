import type { EditorPointerEvent } from '@flighthq/editor-tool';

import type { EditorState } from './editorState';
import type { KeyEventLike } from './commandDispatch';

import { setCursorPosition } from '@flighthq/editor-status';
import { activateTool, getActiveTool, getActiveToolId } from '@flighthq/editor-tool';
import { setActiveToolName } from '@flighthq/editor-status';

import { dispatchKeyEvent } from './commandDispatch';
import { screenToScene } from './coordinateUtils';

export function handlePointerDown(editor: EditorState, event: Readonly<EditorPointerEvent>): void {
  const tool = getActiveTool(editor.toolRegistry);
  tool?.pointerDown?.(event);
}

export function handlePointerMove(editor: EditorState, event: Readonly<EditorPointerEvent>): void {
  const tool = getActiveTool(editor.toolRegistry);
  tool?.pointerMove?.(event);
  const scenePos = screenToScene(editor.viewport, event.x, event.y);
  setCursorPosition(editor.statusBar, scenePos.x, scenePos.y);
}

export function handlePointerUp(editor: EditorState, event: Readonly<EditorPointerEvent>): void {
  const tool = getActiveTool(editor.toolRegistry);
  tool?.pointerUp?.(event);
}

export function handleKeyDown(editor: EditorState, event: Readonly<KeyEventLike>): boolean {
  return dispatchKeyEvent(editor, event);
}

export function switchTool(editor: EditorState, toolId: string): boolean {
  const activated = activateTool(editor.toolRegistry, toolId);
  if (activated) {
    setActiveToolName(editor.statusBar, toolId);
  }
  return activated;
}

export function getActiveEditorToolId(editor: Readonly<EditorState>): string | null {
  return getActiveToolId(editor.toolRegistry);
}
