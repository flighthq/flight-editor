import type { RecentFile, SaveStatus } from '@flighthq/editor-file';
import type { EditorState } from './editorState';

import {
  addRecentFile,
  clearRecentFiles,
  getCurrentFilePath,
  getFileVersion,
  getMaxRecentFiles,
  getRecentFileCount,
  getRecentFiles,
  getSaveStatus,
  isFileDirty,
  markFileClean,
  markFileDirty,
  newFile,
  openFile,
  removeRecentFile,
  setCurrentFilePath,
  setMaxRecentFiles,
  setSaveStatus,
} from '@flighthq/editor-file';

export function getEditorFilePath(editor: Readonly<EditorState>): string | null {
  return getCurrentFilePath(editor.file);
}

export function setEditorFilePath(editor: EditorState, path: string | null): void {
  setCurrentFilePath(editor.file, path);
}

export function isEditorFileDirty(editor: Readonly<EditorState>): boolean {
  return isFileDirty(editor.file);
}

export function markEditorFileDirty(editor: EditorState): void {
  markFileDirty(editor.file);
}

export function markEditorFileClean(editor: EditorState): void {
  markFileClean(editor.file);
}

export function getEditorSaveStatus(editor: Readonly<EditorState>): SaveStatus {
  return getSaveStatus(editor.file);
}

export function setEditorSaveStatus(editor: EditorState, status: SaveStatus): void {
  setSaveStatus(editor.file, status);
}

export function openEditorFile(editor: EditorState, path: string, name: string, timestamp: number): void {
  openFile(editor.file, path, name, timestamp);
}

export function newEditorFile(editor: EditorState): void {
  newFile(editor.file);
}

export function addEditorRecentFile(editor: EditorState, path: string, name: string, timestamp: number): void {
  addRecentFile(editor.file, path, name, timestamp);
}

export function removeEditorRecentFile(editor: EditorState, path: string): void {
  removeRecentFile(editor.file, path);
}

export function clearEditorRecentFiles(editor: EditorState): void {
  clearRecentFiles(editor.file);
}

export function getEditorRecentFiles(editor: Readonly<EditorState>): readonly RecentFile[] {
  return getRecentFiles(editor.file);
}

export function getEditorRecentFileCount(editor: Readonly<EditorState>): number {
  return getRecentFileCount(editor.file);
}

export function getEditorMaxRecentFiles(editor: Readonly<EditorState>): number {
  return getMaxRecentFiles(editor.file);
}

export function setEditorMaxRecentFiles(editor: EditorState, max: number): void {
  setMaxRecentFiles(editor.file, max);
}

export function getEditorFileVersion(editor: Readonly<EditorState>): number {
  return getFileVersion(editor.file);
}
