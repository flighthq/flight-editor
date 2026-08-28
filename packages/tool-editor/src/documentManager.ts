import type { DocumentFormat, DocumentLifecycle, DocumentMetadata } from '@flighthq/editor-document';
import type { EditorState } from './editorState';

import {
  getDocumentAuthor,
  getDocumentError,
  getDocumentFormat,
  getDocumentLifecycle,
  getDocumentMetadata,
  getDocumentTitle,
  getDocumentVersion,
  getUndoCheckpoint,
  hasDocumentError,
  isDocumentLoading,
  isDocumentReady,
  isDocumentSaving,
  resetDocument,
  setDocumentAuthor,
  setDocumentError,
  setDocumentFormat,
  setDocumentLifecycle,
  setDocumentTimestamps,
  setDocumentTitle,
  setUndoCheckpoint,
  touchDocumentModified,
} from '@flighthq/editor-document';

export function getEditorDocumentTitle(editor: Readonly<EditorState>): string {
  return getDocumentTitle(editor.document);
}

export function setEditorDocumentTitle(editor: EditorState, title: string): void {
  setDocumentTitle(editor.document, title);
}

export function getEditorDocumentAuthor(editor: Readonly<EditorState>): string {
  return getDocumentAuthor(editor.document);
}

export function setEditorDocumentAuthor(editor: EditorState, author: string): void {
  setDocumentAuthor(editor.document, author);
}

export function getEditorDocumentFormat(editor: Readonly<EditorState>): DocumentFormat {
  return getDocumentFormat(editor.document);
}

export function setEditorDocumentFormat(editor: EditorState, format: DocumentFormat): void {
  setDocumentFormat(editor.document, format);
}

export function getEditorDocumentLifecycle(editor: Readonly<EditorState>): DocumentLifecycle {
  return getDocumentLifecycle(editor.document);
}

export function setEditorDocumentLifecycle(editor: EditorState, lifecycle: DocumentLifecycle): void {
  setDocumentLifecycle(editor.document, lifecycle);
}

export function isEditorDocumentLoading(editor: Readonly<EditorState>): boolean {
  return isDocumentLoading(editor.document);
}

export function isEditorDocumentReady(editor: Readonly<EditorState>): boolean {
  return isDocumentReady(editor.document);
}

export function isEditorDocumentSaving(editor: Readonly<EditorState>): boolean {
  return isDocumentSaving(editor.document);
}

export function hasEditorDocumentError(editor: Readonly<EditorState>): boolean {
  return hasDocumentError(editor.document);
}

export function getEditorDocumentError(editor: Readonly<EditorState>): string | null {
  return getDocumentError(editor.document);
}

export function setEditorDocumentError(editor: EditorState, error: string): void {
  setDocumentError(editor.document, error);
}

export function getEditorDocumentMetadata(editor: Readonly<EditorState>): DocumentMetadata {
  return getDocumentMetadata(editor.document);
}

export function getEditorDocumentVersion(editor: Readonly<EditorState>): number {
  return getDocumentVersion(editor.document);
}

export function resetEditorDocument(editor: EditorState): void {
  resetDocument(editor.document);
}

export function setEditorDocumentTimestamps(editor: EditorState, created: number, modified: number): void {
  setDocumentTimestamps(editor.document, created, modified);
}

export function touchEditorDocumentModified(editor: EditorState, timestamp: number): void {
  touchDocumentModified(editor.document, timestamp);
}

export function getEditorUndoCheckpoint(editor: Readonly<EditorState>): number {
  return getUndoCheckpoint(editor.document);
}

export function setEditorUndoCheckpoint(editor: EditorState, checkpoint: number): void {
  setUndoCheckpoint(editor.document, checkpoint);
}
