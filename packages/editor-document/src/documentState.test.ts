import { describe, expect, it } from 'vitest';

import {
  createDocumentState,
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
} from './documentState';

describe('createDocumentState', () => {
  it('starts empty with default metadata', () => {
    const state = createDocumentState();
    expect(getDocumentLifecycle(state)).toBe('empty');
    expect(getDocumentTitle(state)).toBe('Untitled');
    expect(getDocumentAuthor(state)).toBe('');
    expect(getDocumentFormat(state)).toBe('flight');
    expect(getDocumentError(state)).toBeNull();
    expect(getUndoCheckpoint(state)).toBe(0);
    expect(getDocumentVersion(state)).toBe(0);
  });
});

describe('getDocumentLifecycle', () => {
  it('returns the current lifecycle', () => {
    const state = createDocumentState();
    expect(getDocumentLifecycle(state)).toBe('empty');
  });
});

describe('setDocumentLifecycle', () => {
  it('transitions through lifecycle states', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'loading');
    expect(getDocumentLifecycle(state)).toBe('loading');
    setDocumentLifecycle(state, 'ready');
    expect(getDocumentLifecycle(state)).toBe('ready');
    setDocumentLifecycle(state, 'saving');
    expect(getDocumentLifecycle(state)).toBe('saving');
  });

  it('is idempotent for same state', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'loading');
    const v = getDocumentVersion(state);
    setDocumentLifecycle(state, 'loading');
    expect(getDocumentVersion(state)).toBe(v);
  });

  it('clears error when transitioning away from error', () => {
    const state = createDocumentState();
    setDocumentError(state, 'Failed');
    setDocumentLifecycle(state, 'ready');
    expect(getDocumentError(state)).toBeNull();
  });
});

describe('setDocumentError', () => {
  it('sets error state with message', () => {
    const state = createDocumentState();
    setDocumentError(state, 'File not found');
    expect(getDocumentLifecycle(state)).toBe('error');
    expect(getDocumentError(state)).toBe('File not found');
    expect(hasDocumentError(state)).toBe(true);
  });

  it('replaces previous error', () => {
    const state = createDocumentState();
    setDocumentError(state, 'First error');
    setDocumentError(state, 'Second error');
    expect(getDocumentError(state)).toBe('Second error');
  });
});

describe('getDocumentError', () => {
  it('returns null when no error', () => {
    expect(getDocumentError(createDocumentState())).toBeNull();
  });
});

describe('getDocumentMetadata', () => {
  it('returns the full metadata', () => {
    const state = createDocumentState();
    const meta = getDocumentMetadata(state);
    expect(meta.title).toBe('Untitled');
    expect(meta.format).toBe('flight');
    expect(meta.created).toBe(0);
    expect(meta.modified).toBe(0);
  });
});

describe('setDocumentTitle', () => {
  it('sets the title', () => {
    const state = createDocumentState();
    setDocumentTitle(state, 'My Design');
    expect(getDocumentTitle(state)).toBe('My Design');
    expect(getDocumentVersion(state)).toBe(1);
  });

  it('is idempotent for same title', () => {
    const state = createDocumentState();
    setDocumentTitle(state, 'Untitled');
    expect(getDocumentVersion(state)).toBe(0);
  });
});

describe('getDocumentTitle', () => {
  it('returns Untitled by default', () => {
    expect(getDocumentTitle(createDocumentState())).toBe('Untitled');
  });
});

describe('setDocumentAuthor', () => {
  it('sets the author', () => {
    const state = createDocumentState();
    setDocumentAuthor(state, 'Jane');
    expect(getDocumentAuthor(state)).toBe('Jane');
    expect(getDocumentVersion(state)).toBe(1);
  });

  it('is idempotent for same author', () => {
    const state = createDocumentState();
    const v = getDocumentVersion(state);
    setDocumentAuthor(state, '');
    expect(getDocumentVersion(state)).toBe(v);
  });
});

describe('getDocumentAuthor', () => {
  it('returns empty string by default', () => {
    expect(getDocumentAuthor(createDocumentState())).toBe('');
  });
});

describe('setDocumentFormat', () => {
  it('changes the format', () => {
    const state = createDocumentState();
    setDocumentFormat(state, 'json');
    expect(getDocumentFormat(state)).toBe('json');
    expect(getDocumentVersion(state)).toBe(1);
  });

  it('supports binary format', () => {
    const state = createDocumentState();
    setDocumentFormat(state, 'binary');
    expect(getDocumentFormat(state)).toBe('binary');
  });

  it('is idempotent for same format', () => {
    const state = createDocumentState();
    const v = getDocumentVersion(state);
    setDocumentFormat(state, 'flight');
    expect(getDocumentVersion(state)).toBe(v);
  });
});

describe('getDocumentFormat', () => {
  it('returns flight by default', () => {
    expect(getDocumentFormat(createDocumentState())).toBe('flight');
  });
});

describe('setDocumentTimestamps', () => {
  it('sets created and modified', () => {
    const state = createDocumentState();
    setDocumentTimestamps(state, 1000, 2000);
    const meta = getDocumentMetadata(state);
    expect(meta.created).toBe(1000);
    expect(meta.modified).toBe(2000);
    expect(getDocumentVersion(state)).toBe(1);
  });

  it('is idempotent for same timestamps', () => {
    const state = createDocumentState();
    const v = getDocumentVersion(state);
    setDocumentTimestamps(state, 0, 0);
    expect(getDocumentVersion(state)).toBe(v);
  });
});

describe('touchDocumentModified', () => {
  it('updates only modified timestamp', () => {
    const state = createDocumentState();
    setDocumentTimestamps(state, 1000, 2000);
    touchDocumentModified(state, 3000);
    const meta = getDocumentMetadata(state);
    expect(meta.created).toBe(1000);
    expect(meta.modified).toBe(3000);
  });

  it('is idempotent for same timestamp', () => {
    const state = createDocumentState();
    touchDocumentModified(state, 1000);
    const v = getDocumentVersion(state);
    touchDocumentModified(state, 1000);
    expect(getDocumentVersion(state)).toBe(v);
  });
});

describe('getUndoCheckpoint', () => {
  it('returns 0 by default', () => {
    expect(getUndoCheckpoint(createDocumentState())).toBe(0);
  });
});

describe('setUndoCheckpoint', () => {
  it('sets the checkpoint', () => {
    const state = createDocumentState();
    setUndoCheckpoint(state, 5);
    expect(getUndoCheckpoint(state)).toBe(5);
    expect(getDocumentVersion(state)).toBe(1);
  });

  it('is idempotent for same checkpoint', () => {
    const state = createDocumentState();
    const v = getDocumentVersion(state);
    setUndoCheckpoint(state, 0);
    expect(getDocumentVersion(state)).toBe(v);
  });
});

describe('isDocumentReady', () => {
  it('returns false initially', () => {
    expect(isDocumentReady(createDocumentState())).toBe(false);
  });

  it('returns true when ready', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'ready');
    expect(isDocumentReady(state)).toBe(true);
  });
});

describe('isDocumentLoading', () => {
  it('returns false initially', () => {
    expect(isDocumentLoading(createDocumentState())).toBe(false);
  });

  it('returns true when loading', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'loading');
    expect(isDocumentLoading(state)).toBe(true);
  });
});

describe('isDocumentSaving', () => {
  it('returns false initially', () => {
    expect(isDocumentSaving(createDocumentState())).toBe(false);
  });

  it('returns true when saving', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'saving');
    expect(isDocumentSaving(state)).toBe(true);
  });
});

describe('hasDocumentError', () => {
  it('returns false initially', () => {
    expect(hasDocumentError(createDocumentState())).toBe(false);
  });

  it('returns true after error', () => {
    const state = createDocumentState();
    setDocumentError(state, 'Oops');
    expect(hasDocumentError(state)).toBe(true);
  });
});

describe('resetDocument', () => {
  it('resets to initial state', () => {
    const state = createDocumentState();
    setDocumentLifecycle(state, 'ready');
    setDocumentTitle(state, 'My File');
    setDocumentAuthor(state, 'Author');
    setDocumentFormat(state, 'json');
    setDocumentTimestamps(state, 1000, 2000);
    setUndoCheckpoint(state, 5);

    resetDocument(state);

    expect(getDocumentLifecycle(state)).toBe('empty');
    expect(getDocumentTitle(state)).toBe('Untitled');
    expect(getDocumentAuthor(state)).toBe('');
    expect(getDocumentFormat(state)).toBe('flight');
    expect(getDocumentMetadata(state).created).toBe(0);
    expect(getDocumentError(state)).toBeNull();
    expect(getUndoCheckpoint(state)).toBe(0);
  });

  it('clears error state', () => {
    const state = createDocumentState();
    setDocumentError(state, 'Failed');
    resetDocument(state);
    expect(hasDocumentError(state)).toBe(false);
    expect(getDocumentError(state)).toBeNull();
  });

  it('bumps version', () => {
    const state = createDocumentState();
    const v = getDocumentVersion(state);
    resetDocument(state);
    expect(getDocumentVersion(state)).toBe(v + 1);
  });
});

describe('getDocumentVersion', () => {
  it('starts at 0', () => {
    expect(getDocumentVersion(createDocumentState())).toBe(0);
  });

  it('tracks cumulative changes', () => {
    const state = createDocumentState();
    setDocumentTitle(state, 'New');
    setDocumentAuthor(state, 'Jane');
    setDocumentLifecycle(state, 'ready');
    expect(getDocumentVersion(state)).toBe(3);
  });
});
