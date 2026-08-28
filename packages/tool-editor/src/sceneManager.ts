import type { EditorState } from './editorState';

import { clearCommandHistory } from '@flighthq/editor-command';
import { resetDocument, setDocumentLifecycle, setDocumentTitle } from '@flighthq/editor-document';
import { markFileClean, newFile } from '@flighthq/editor-file';
import { setSceneDimensions, setSceneName } from '@flighthq/editor-scene-state';
import { clearSelection } from '@flighthq/editor-selection';
import { createScene2D } from '@flighthq/scene2d';

import { setEditorScene } from './editorState';

export function createNewScene(editor: EditorState, width = 800, height = 600, name = 'Untitled'): void {
  const scene = createScene2D({ scene2dWidth: width, scene2dHeight: height });
  setEditorScene(editor, scene);
  setSceneName(editor.sceneState, name);
  setSceneDimensions(editor.sceneState, width, height);
  clearSelection(editor.selection);
  clearCommandHistory(editor.commandHistory);
  resetDocument(editor.document);
  setDocumentTitle(editor.document, name);
  setDocumentLifecycle(editor.document, 'ready');
  newFile(editor.file);
  markFileClean(editor.file);
}

export function closeScene(editor: EditorState): void {
  setEditorScene(editor, null);
  clearSelection(editor.selection);
  clearCommandHistory(editor.commandHistory);
  resetDocument(editor.document);
  newFile(editor.file);
}

export function hasScene(editor: Readonly<EditorState>): boolean {
  return editor.scene !== null;
}

export function getSceneName(editor: Readonly<EditorState>): string {
  return editor.sceneState.name;
}

export function getSceneSize(editor: Readonly<EditorState>): { width: number; height: number } {
  return { width: editor.sceneState.width, height: editor.sceneState.height };
}
