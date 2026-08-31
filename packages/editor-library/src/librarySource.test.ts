import { describe, expect, it } from 'vitest';

import {
  addLibraryItem,
  createLibraryState,
  getFilteredLibraryItems,
  getLibraryItems,
  getLibrarySessionVersion,
  getLibraryVersion,
  markLibrarySourceMissing,
  reconcileLibrarySource,
  setLibrarySearchFilter,
  validateLibraryState,
} from './libraryState';

const button = {
  id: 'button',
  name: 'Button',
  category: 'Components',
  kind: 'component',
  tags: ['control', 'action'],
};

describe('addLibraryItem', () => {
  it('rejects duplicate or malformed identities', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    expect(() => addLibraryItem(state, button)).toThrow('already exists');
    expect(() => addLibraryItem(state, { ...button, id: '' })).toThrow('must not be empty');
  });
});

describe('getLibrarySessionVersion', () => {
  it('tracks search UI independently from authored library content', () => {
    const state = createLibraryState();
    setLibrarySearchFilter(state, ' action ');
    expect(getLibrarySessionVersion(state)).toBe(1);
    expect(getLibraryVersion(state)).toBe(0);
  });
});

describe('getFilteredLibraryItems', () => {
  it('searches metadata and tags case-insensitively', () => {
    const state = createLibraryState();
    addLibraryItem(state, button);
    setLibrarySearchFilter(state, 'ACTION');
    expect(getFilteredLibraryItems(state).map(({ id }) => id)).toEqual(['button']);
  });
});

describe('reconcileLibrarySource', () => {
  it('atomically replaces one source while preserving other sources', () => {
    const state = createLibraryState();
    reconcileLibrarySource(state, 'local', [button]);
    reconcileLibrarySource(state, 'remote', [{ ...button, id: 'card', name: 'Card' }]);
    reconcileLibrarySource(state, 'local', [{ ...button, id: 'field', name: 'Field' }]);
    expect(getLibraryItems(state).map(({ id }) => id)).toEqual(['card', 'field']);
    expect(() => reconcileLibrarySource(state, 'local', [{ ...button, id: 'card' }])).toThrow('another source');
  });
});

describe('markLibrarySourceMissing', () => {
  it('preserves cached entries and marks their availability', () => {
    const state = createLibraryState();
    reconcileLibrarySource(state, 'remote', [button]);
    expect(markLibrarySourceMissing(state, 'remote')).toBe(1);
    expect(getLibraryItems(state)[0]?.availability).toBe('missing');
    expect(markLibrarySourceMissing(state, 'remote')).toBe(0);
  });
});

describe('validateLibraryState', () => {
  it('diagnoses malformed hydrated data in deterministic order', () => {
    const state = createLibraryState();
    state.items.push(button, button, { ...button, id: '', name: '' });
    expect(validateLibraryState(state)).toEqual(['duplicate-id:button', 'invalid-item:']);
  });
});
