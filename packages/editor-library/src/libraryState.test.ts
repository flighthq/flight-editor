import { describe, expect, it } from 'vitest';

import {
  addLibraryItem,
  clearLibrary,
  createLibraryState,
  getActiveCategory,
  getFilteredLibraryItems,
  getLibraryCategories,
  getLibraryItem,
  getLibraryItemCount,
  getLibraryItems,
  getLibrarySearchFilter,
  getLibrarySessionVersion,
  getLibraryVersion,
  markLibrarySourceMissing,
  reconcileLibrarySource,
  removeLibraryItem,
  setActiveCategory,
  setLibrarySearchFilter,
  validateLibraryState,
} from './libraryState';

import type { LibraryItem } from './libraryState';

const button: LibraryItem = { id: 'btn-1', name: 'Button', category: 'UI', kind: 'component' };
const card: LibraryItem = { id: 'card-1', name: 'Card', category: 'UI', kind: 'component' };
const icon: LibraryItem = { id: 'icon-1', name: 'Star Icon', category: 'Icons', kind: 'symbol' };

describe('createLibraryState', () => {
  it('starts empty', () => {
    const state = createLibraryState();
    expect(getLibraryItemCount(state)).toBe(0);
    expect(getLibrarySearchFilter(state)).toBe('');
    expect(getActiveCategory(state)).toBeNull();
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getLibraryItems', () => {
  it('returns empty array for fresh state', () => {
    const state = createLibraryState();
    expect(getLibraryItems(state)).toEqual([]);
  });
});

describe('getLibraryItemCount', () => {
  it('is exported', () => expect(getLibraryItemCount).toBeTypeOf('function'));
});

describe('addLibraryItem', () => {
  it('adds an item', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    expect(getLibraryItemCount(state)).toBe(1);
    expect(getLibraryItems(state)).toEqual([button]);
    expect(getLibraryVersion(state)).toBe(1);
  });
});

describe('removeLibraryItem', () => {
  it('removes an item by id', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    const removed = removeLibraryItem(state, 'btn-1');
    expect(removed).toBe(true);
    expect(getLibraryItemCount(state)).toBe(1);
    expect(getLibraryItems(state)).toEqual([card]);
  });

  it('returns false when id not found', () => {
    const state = createLibraryState();
    const removed = removeLibraryItem(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getLibraryItem', () => {
  it('finds an item by id', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    expect(getLibraryItem(state, 'card-1')).toEqual(card);
  });

  it('returns undefined for unknown id', () => {
    const state = createLibraryState();
    expect(getLibraryItem(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getLibrarySearchFilter', () => {
  it('is exported', () => expect(getLibrarySearchFilter).toBeTypeOf('function'));
});

describe('setLibrarySearchFilter', () => {
  it('sets the search filter', () => {
    const state = createLibraryState();
    setLibrarySearchFilter(state, 'button');
    expect(getLibrarySearchFilter(state)).toBe('button');
    expect(getLibraryVersion(state)).toBe(0);
    expect(getLibrarySessionVersion(state)).toBe(1);
  });

  it('does not bump version when filter unchanged', () => {
    const state = createLibraryState();
    setLibrarySearchFilter(state, '');
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getFilteredLibraryItems', () => {
  it('filters by search string (case-insensitive)', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    addLibraryItem(state, icon);
    setLibrarySearchFilter(state, 'card');
    expect(getFilteredLibraryItems(state)).toEqual([card]);
  });

  it('filters by active category', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    addLibraryItem(state, icon);
    setActiveCategory(state, 'Icons');
    expect(getFilteredLibraryItems(state)).toEqual([icon]);
  });

  it('combines category and search filters', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    addLibraryItem(state, icon);
    setActiveCategory(state, 'UI');
    setLibrarySearchFilter(state, 'but');
    expect(getFilteredLibraryItems(state)).toEqual([button]);
  });

  it('returns all items with no filters', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    expect(getFilteredLibraryItems(state)).toEqual([button, card]);
  });
});

describe('getActiveCategory', () => {
  it('is exported', () => expect(getActiveCategory).toBeTypeOf('function'));
});

describe('setActiveCategory', () => {
  it('sets the active category', () => {
    const state = createLibraryState();
    setActiveCategory(state, 'UI');
    expect(getActiveCategory(state)).toBe('UI');
    expect(getLibraryVersion(state)).toBe(0);
    expect(getLibrarySessionVersion(state)).toBe(1);
  });

  it('does not bump version when value unchanged', () => {
    const state = createLibraryState();
    setActiveCategory(state, null);
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getLibraryCategories', () => {
  it('returns sorted unique categories', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    addLibraryItem(state, icon);
    expect(getLibraryCategories(state)).toEqual(['Icons', 'UI']);
  });

  it('returns empty array for empty library', () => {
    const state = createLibraryState();
    expect(getLibraryCategories(state)).toEqual([]);
  });
});

describe('clearLibrary', () => {
  it('removes all items', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    addLibraryItem(state, card);
    clearLibrary(state);
    expect(getLibraryItemCount(state)).toBe(0);
  });

  it('does not bump version when already empty', () => {
    const state = createLibraryState();
    clearLibrary(state);
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getLibraryVersion', () => {
  it('is exported', () => expect(getLibraryVersion).toBeTypeOf('function'));
});

describe('getLibrarySessionVersion', () => {
  it('is exported', () => expect(getLibrarySessionVersion).toBeTypeOf('function'));
});

describe('markLibrarySourceMissing', () => {
  it('is exported', () => expect(markLibrarySourceMissing).toBeTypeOf('function'));
});

describe('reconcileLibrarySource', () => {
  it('is exported', () => expect(reconcileLibrarySource).toBeTypeOf('function'));
});

describe('validateLibraryState', () => {
  it('is exported', () => expect(validateLibraryState).toBeTypeOf('function'));
});
