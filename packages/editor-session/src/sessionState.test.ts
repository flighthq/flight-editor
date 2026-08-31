import { describe, expect, it } from 'vitest';

import {
  activateSessionDocument,
  closeSessionDocument,
  createSessionState,
  getActiveSessionDocument,
  getSessionDocument,
  getSessionDocuments,
  openSessionDocument,
  updateSessionDocument,
} from './sessionState';

function document(id: string, dirty = false) {
  return {
    id,
    uri: `file:///${id}.flight`,
    title: id,
    status: 'ready' as const,
    externalStatus: 'current' as const,
    revision: 1,
    lastGoodRevision: 1,
    dirty,
  };
}

describe('createSessionState', () => {
  it('starts with no open document', () => expect(getActiveSessionDocument(createSessionState())).toBeNull());
});

describe('openSessionDocument', () => {
  it('opens and activates unique identities and URIs', () => {
    const state = createSessionState();
    expect(openSessionDocument(state, document('a'))).toBe(true);
    expect(openSessionDocument(state, document('a'))).toBe(false);
    expect(openSessionDocument(state, { ...document('b'), uri: document('a').uri })).toBe(false);
    expect(getActiveSessionDocument(state)?.id).toBe('a');
  });
});

describe('closeSessionDocument', () => {
  it('requires dirty confirmation and chooses a neighboring active document', () => {
    const state = createSessionState();
    openSessionDocument(state, document('a'));
    openSessionDocument(state, document('b', true));
    expect(closeSessionDocument(state, 'b')).toBeNull();
    expect(closeSessionDocument(state, 'b', true)?.status).toBe('closed');
    expect(getActiveSessionDocument(state)?.id).toBe('a');
  });
});

describe('activateSessionDocument', () => {
  it('activates only known inactive documents', () => {
    const state = createSessionState();
    openSessionDocument(state, document('a'));
    openSessionDocument(state, document('b'));
    expect(activateSessionDocument(state, 'a')).toBe(true);
    expect(activateSessionDocument(state, 'a')).toBe(false);
    expect(activateSessionDocument(state, 'missing')).toBe(false);
  });
});

describe('updateSessionDocument', () => {
  it('tracks invalid external changes while retaining last-good revision', () => {
    const state = createSessionState();
    openSessionDocument(state, document('a'));
    expect(updateSessionDocument(state, 'a', { revision: 2, status: 'invalid', externalStatus: 'changed' })).toBe(true);
    expect(getSessionDocument(state, 'a')).toMatchObject({ revision: 2, lastGoodRevision: 1, status: 'invalid' });
    expect(updateSessionDocument(state, 'a', { revision: 0 })).toBe(false);
  });
});

describe('getSessionDocument', () => {
  it('returns null for unknown identity', () => expect(getSessionDocument(createSessionState(), 'missing')).toBeNull());
});

describe('getSessionDocuments', () => {
  it('preserves open order independently of activation', () => {
    const state = createSessionState();
    openSessionDocument(state, document('a'));
    openSessionDocument(state, document('b'));
    activateSessionDocument(state, 'a');
    expect(getSessionDocuments(state).map((item) => item.id)).toEqual(['a', 'b']);
  });
});

describe('getActiveSessionDocument', () => {
  it('returns the active record', () => {
    const state = createSessionState();
    openSessionDocument(state, document('a'));
    expect(getActiveSessionDocument(state)?.title).toBe('a');
  });
});
