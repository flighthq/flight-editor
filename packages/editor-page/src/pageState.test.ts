import { describe, expect, it } from 'vitest';

import type { Page } from './pageState';

import {
  addPage,
  createPageState,
  getActivePage,
  getActivePageId,
  getPage,
  getPageCount,
  getPages,
  getPageVersion,
  removePage,
  reorderPage,
  setActivePage,
  setPageColor,
  setPageName,
  setPageSize,
} from './pageState';

const page = { id: 'page-a', name: 'Page A', width: 800, height: 600, color: null } as const;

describe('createPageState', () => {
  it('starts empty without an active page', () => {
    const state = createPageState();
    expect(getPages(state)).toEqual([]);
    expect(getActivePageId(state)).toBeNull();
    expect(getPageVersion(state)).toBe(0);
  });
});

describe('addPage', () => {
  it('copies pages, activates the first, replaces ids in place, and guards equality', () => {
    const state = createPageState();
    const source: Page = { ...page };
    addPage(state, source);
    source.name = 'mutated';
    addPage(state, page);
    expect(getActivePageId(state)).toBe('page-a');
    expect(getPageVersion(state)).toBe(1);
    addPage(state, { ...page, name: 'Replacement' });
    expect(getPage(state, 'page-a')?.name).toBe('Replacement');
    expect(getPageCount(state)).toBe(1);
  });
});

describe('removePage', () => {
  it('selects the nearest remaining page when removing the active page', () => {
    const state = createPageState();
    addPage(state, page);
    addPage(state, { ...page, id: 'page-b' });
    addPage(state, { ...page, id: 'page-c' });
    setActivePage(state, 'page-b');
    expect(removePage(state, 'page-b')).toBe(true);
    expect(getActivePageId(state)).toBe('page-c');
    expect(removePage(state, 'missing')).toBe(false);
  });
});

describe('getPage', () => {
  it('returns an isolated page or undefined', () => {
    const state = createPageState();
    addPage(state, page);
    const result = getPage(state, 'page-a')!;
    result.name = 'changed';
    expect(getPage(state, 'page-a')?.name).toBe('Page A');
    expect(getPage(state, 'missing')).toBeUndefined();
  });
});

describe('getPages', () => {
  it('returns isolated pages in their current order', () => {
    const state = createPageState();
    addPage(state, page);
    addPage(state, { ...page, id: 'page-b' });
    expect(getPages(state).map(({ id }) => id)).toEqual(['page-a', 'page-b']);
  });
});

describe('getPageCount', () => {
  it('returns the number of pages', () => {
    const state = createPageState();
    addPage(state, page);
    expect(getPageCount(state)).toBe(1);
  });
});

describe('setActivePage', () => {
  it('sets known pages and guards unchanged or unknown ids', () => {
    const state = createPageState();
    addPage(state, page);
    addPage(state, { ...page, id: 'page-b' });
    expect(setActivePage(state, 'page-b')).toBe(true);
    expect(setActivePage(state, 'page-b')).toBe(false);
    expect(setActivePage(state, 'missing')).toBe(false);
  });
});

describe('getActivePage', () => {
  it('returns the active page or null', () => {
    const state = createPageState();
    expect(getActivePage(state)).toBeNull();
    addPage(state, page);
    expect(getActivePage(state)?.id).toBe('page-a');
  });
});

describe('getActivePageId', () => {
  it('returns the active id', () => {
    const state = createPageState();
    addPage(state, page);
    expect(getActivePageId(state)).toBe('page-a');
  });
});

describe('setPageName', () => {
  it('sets name with missing and redundant guards', () => {
    const state = createPageState();
    addPage(state, page);
    expect(setPageName(state, 'page-a', 'Home')).toBe(true);
    expect(setPageName(state, 'page-a', 'Home')).toBe(false);
    expect(setPageName(state, 'missing', 'Home')).toBe(false);
  });
});

describe('setPageSize', () => {
  it('sets both dimensions atomically', () => {
    const state = createPageState();
    addPage(state, page);
    expect(setPageSize(state, 'page-a', 1920, 1080)).toBe(true);
    expect(getPage(state, 'page-a')).toMatchObject({ width: 1920, height: 1080 });
    expect(setPageSize(state, 'page-a', 1920, 1080)).toBe(false);
  });
});

describe('setPageColor', () => {
  it('sets packed color and accepts null', () => {
    const state = createPageState();
    addPage(state, page);
    expect(setPageColor(state, 'page-a', -1)).toBe(true);
    expect(getPage(state, 'page-a')?.color).toBe(0xffff_ffff);
    expect(setPageColor(state, 'page-a', null)).toBe(true);
  });
});

describe('reorderPage', () => {
  it('moves pages to clamped integer indices', () => {
    const state = createPageState();
    addPage(state, page);
    addPage(state, { ...page, id: 'page-b' });
    addPage(state, { ...page, id: 'page-c' });
    expect(reorderPage(state, 'page-a', 99)).toBe(true);
    expect(getPages(state).map(({ id }) => id)).toEqual(['page-b', 'page-c', 'page-a']);
    expect(reorderPage(state, 'page-a', 2.9)).toBe(false);
    expect(reorderPage(state, 'missing', 0)).toBe(false);
  });
});

describe('getPageVersion', () => {
  it('tracks observable changes', () => {
    const state = createPageState();
    addPage(state, page);
    setPageName(state, 'page-a', 'Home');
    expect(getPageVersion(state)).toBe(2);
  });
});
