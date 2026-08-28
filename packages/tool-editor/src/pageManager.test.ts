import { describe, expect, it } from 'vitest';

import {
  createPage,
  deleteCurrentPage,
  getCurrentPage,
  getPageList,
  getTotalPageCount,
  movePageToIndex,
  navigateToNextPage,
  navigateToPage,
  navigateToPreviousPage,
  renameCurrentPage,
  resizeCurrentPage,
} from './pageManager';
import { createEditorState } from './editorState';

describe('createPage', () => {
  it('creates a page with defaults', () => {
    const editor = createEditorState();
    const page = createPage(editor);
    expect(page.name).toBe('Page 1');
    expect(page.width).toBe(800);
    expect(page.height).toBe(600);
    expect(getTotalPageCount(editor)).toBe(1);
  });

  it('creates page with custom name and size', () => {
    const editor = createEditorState();
    const page = createPage(editor, 'Hero', 1920, 1080);
    expect(page.name).toBe('Hero');
    expect(page.width).toBe(1920);
    expect(page.height).toBe(1080);
  });

  it('auto-increments page names', () => {
    const editor = createEditorState();
    createPage(editor);
    const second = createPage(editor);
    expect(second.name).toBe('Page 2');
  });

  it('sets first page as active', () => {
    const editor = createEditorState();
    const page = createPage(editor);
    expect(getCurrentPage(editor)!.id).toBe(page.id);
  });
});

describe('deleteCurrentPage', () => {
  it('deletes the current page', () => {
    const editor = createEditorState();
    createPage(editor);
    createPage(editor);
    expect(getTotalPageCount(editor)).toBe(2);
    deleteCurrentPage(editor);
    expect(getTotalPageCount(editor)).toBe(1);
  });

  it('returns false when only one page', () => {
    const editor = createEditorState();
    createPage(editor);
    expect(deleteCurrentPage(editor)).toBe(false);
  });

  it('returns false when no pages', () => {
    const editor = createEditorState();
    expect(deleteCurrentPage(editor)).toBe(false);
  });
});

describe('navigateToPage', () => {
  it('switches to specified page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    navigateToPage(editor, p2.id);
    expect(getCurrentPage(editor)!.id).toBe(p2.id);
  });

  it('returns false for unknown page', () => {
    const editor = createEditorState();
    createPage(editor);
    expect(navigateToPage(editor, 'nonexistent')).toBe(false);
  });

  it('syncs scene dimensions', () => {
    const editor = createEditorState();
    createPage(editor, 'Small', 400, 300);
    const big = createPage(editor, 'Big', 1600, 1200);
    navigateToPage(editor, big.id);
    expect(editor.sceneState.width).toBe(1600);
    expect(editor.sceneState.height).toBe(1200);
  });
});

describe('navigateToNextPage', () => {
  it('moves to next page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    navigateToNextPage(editor);
    expect(getCurrentPage(editor)!.id).toBe(p2.id);
  });

  it('wraps around to first page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    navigateToPage(editor, p2.id);
    navigateToNextPage(editor);
    expect(getCurrentPage(editor)!.id).toBe(p1.id);
  });

  it('returns false with single page', () => {
    const editor = createEditorState();
    createPage(editor);
    expect(navigateToNextPage(editor)).toBe(false);
  });
});

describe('navigateToPreviousPage', () => {
  it('moves to previous page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    navigateToPage(editor, p2.id);
    navigateToPreviousPage(editor);
    expect(getCurrentPage(editor)!.id).toBe(p1.id);
  });

  it('wraps around to last page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    navigateToPreviousPage(editor);
    expect(getCurrentPage(editor)!.id).toBe(p2.id);
  });
});

describe('renameCurrentPage', () => {
  it('renames the active page', () => {
    const editor = createEditorState();
    createPage(editor, 'Old');
    renameCurrentPage(editor, 'New');
    expect(getCurrentPage(editor)!.name).toBe('New');
  });

  it('returns false when no active page', () => {
    const editor = createEditorState();
    expect(renameCurrentPage(editor, 'test')).toBe(false);
  });
});

describe('resizeCurrentPage', () => {
  it('resizes the active page', () => {
    const editor = createEditorState();
    createPage(editor, 'A', 800, 600);
    resizeCurrentPage(editor, 1200, 900);
    expect(getCurrentPage(editor)!.width).toBe(1200);
    expect(getCurrentPage(editor)!.height).toBe(900);
  });

  it('syncs scene dimensions', () => {
    const editor = createEditorState();
    createPage(editor, 'A', 800, 600);
    resizeCurrentPage(editor, 1920, 1080);
    expect(editor.sceneState.width).toBe(1920);
    expect(editor.sceneState.height).toBe(1080);
  });

  it('returns false when no active page', () => {
    const editor = createEditorState();
    expect(resizeCurrentPage(editor, 100, 100)).toBe(false);
  });
});

describe('movePageToIndex', () => {
  it('reorders a page', () => {
    const editor = createEditorState();
    const p1 = createPage(editor, 'A');
    const p2 = createPage(editor, 'B');
    movePageToIndex(editor, p2.id, 0);
    const pages = getPageList(editor);
    expect(pages[0]!.id).toBe(p2.id);
  });
});

describe('getCurrentPage', () => {
  it('returns null when no pages', () => {
    const editor = createEditorState();
    expect(getCurrentPage(editor)).toBeNull();
  });
});

describe('getPageList', () => {
  it('returns all pages', () => {
    const editor = createEditorState();
    createPage(editor);
    createPage(editor);
    createPage(editor);
    expect(getPageList(editor)).toHaveLength(3);
  });
});

describe('getTotalPageCount', () => {
  it('returns 0 initially', () => {
    const editor = createEditorState();
    expect(getTotalPageCount(editor)).toBe(0);
  });
});
