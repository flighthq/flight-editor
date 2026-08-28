import type { EditorTool } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

import {
  activateTool,
  deactivateTool,
  getActiveTool,
  getActiveToolId,
  getRegisteredToolIds,
  isToolActive,
  registerTool,
  unregisterTool,
} from '@flighthq/editor-tool';

export function registerEditorTool(editor: EditorState, tool: EditorTool): void {
  registerTool(editor.toolRegistry, tool);
}

export function unregisterEditorTool(editor: EditorState, toolId: string): boolean {
  return unregisterTool(editor.toolRegistry, toolId);
}

export function activateEditorTool(editor: EditorState, toolId: string): boolean {
  return activateTool(editor.toolRegistry, toolId);
}

export function deactivateEditorTool(editor: EditorState): boolean {
  return deactivateTool(editor.toolRegistry);
}

export function getActiveEditorTool(editor: Readonly<EditorState>): EditorTool | null {
  return getActiveTool(editor.toolRegistry);
}

export function getActiveEditorToolId(editor: Readonly<EditorState>): string | null {
  return getActiveToolId(editor.toolRegistry);
}

export function getRegisteredEditorToolIds(editor: Readonly<EditorState>): ReadonlyArray<string> {
  return getRegisteredToolIds(editor.toolRegistry);
}

export function isEditorToolActive(editor: Readonly<EditorState>, toolId: string): boolean {
  return isToolActive(editor.toolRegistry, toolId);
}
