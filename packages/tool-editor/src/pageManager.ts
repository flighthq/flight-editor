import type { EditorState } from './editorState';
import type { Page } from '@flighthq/editor-page';

import {
  addPage,
  getActivePage,
  getActivePageId,
  getPageCount,
  getPages,
  removePage,
  reorderPage,
  setActivePage,
  setPageName,
  setPageSize,
} from '@flighthq/editor-page';
import { setSceneDimensions } from '@flighthq/editor-scene-state';

let nextPageId = 1;

export function createPage(editor: EditorState, name?: string, width = 800, height = 600): Page {
  const id = `page-${nextPageId++}`;
  const pageName = name ?? `Page ${getPageCount(editor.pages) + 1}`;
  const page: Page = { id, name: pageName, width, height, color: null };
  addPage(editor.pages, page);
  return page;
}

export function deleteCurrentPage(editor: EditorState): boolean {
  const activeId = getActivePageId(editor.pages);
  if (activeId === null) return false;
  if (getPageCount(editor.pages) <= 1) return false;
  return removePage(editor.pages, activeId);
}

export function navigateToPage(editor: EditorState, pageId: string): boolean {
  const changed = setActivePage(editor.pages, pageId);
  if (changed) {
    syncPageToScene(editor);
  }
  return changed;
}

export function navigateToNextPage(editor: EditorState): boolean {
  const pages = getPages(editor.pages);
  const activeId = getActivePageId(editor.pages);
  if (activeId === null || pages.length <= 1) return false;

  const currentIndex = pages.findIndex((p) => p.id === activeId);
  const nextIndex = (currentIndex + 1) % pages.length;
  return navigateToPage(editor, pages[nextIndex]!.id);
}

export function navigateToPreviousPage(editor: EditorState): boolean {
  const pages = getPages(editor.pages);
  const activeId = getActivePageId(editor.pages);
  if (activeId === null || pages.length <= 1) return false;

  const currentIndex = pages.findIndex((p) => p.id === activeId);
  const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
  return navigateToPage(editor, pages[prevIndex]!.id);
}

export function renameCurrentPage(editor: EditorState, name: string): boolean {
  const activeId = getActivePageId(editor.pages);
  if (activeId === null) return false;
  return setPageName(editor.pages, activeId, name);
}

export function resizeCurrentPage(editor: EditorState, width: number, height: number): boolean {
  const activeId = getActivePageId(editor.pages);
  if (activeId === null) return false;
  const changed = setPageSize(editor.pages, activeId, width, height);
  if (changed) {
    setSceneDimensions(editor.sceneState, width, height);
  }
  return changed;
}

export function movePageToIndex(editor: EditorState, pageId: string, index: number): boolean {
  return reorderPage(editor.pages, pageId, index);
}

export function getCurrentPage(editor: Readonly<EditorState>): Page | null {
  return getActivePage(editor.pages);
}

export function getPageList(editor: Readonly<EditorState>): readonly Page[] {
  return getPages(editor.pages);
}

export function getTotalPageCount(editor: Readonly<EditorState>): number {
  return getPageCount(editor.pages);
}

function syncPageToScene(editor: EditorState): void {
  const page = getActivePage(editor.pages);
  if (page !== null) {
    setSceneDimensions(editor.sceneState, page.width, page.height);
  }
}
