import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createCommentsState', () => {
  it('is exported', () => expect(api.createCommentsState).toBeTypeOf('function'));
});
describe('createCommentThread', () => {
  it('is exported', () => expect(api.createCommentThread).toBeTypeOf('function'));
});
describe('replyToCommentThread', () => {
  it('is exported', () => expect(api.replyToCommentThread).toBeTypeOf('function'));
});
describe('setCommentResolved', () => {
  it('is exported', () => expect(api.setCommentResolved).toBeTypeOf('function'));
});
describe('moveCommentAnchor', () => {
  it('is exported', () => expect(api.moveCommentAnchor).toBeTypeOf('function'));
});
describe('reconcileCommentAnchors', () => {
  it('is exported', () => expect(api.reconcileCommentAnchors).toBeTypeOf('function'));
});
describe('setCommentDraft', () => {
  it('is exported', () => expect(api.setCommentDraft).toBeTypeOf('function'));
});
describe('markCommentSync', () => {
  it('is exported', () => expect(api.markCommentSync).toBeTypeOf('function'));
});
describe('getVisibleCommentThreads', () => {
  it('is exported', () => expect(api.getVisibleCommentThreads).toBeTypeOf('function'));
});

describe('comments behavior', () => {
  it('reconciles stale anchors and filters resolved threads', () => {
    const state = api.createCommentsState();
    api.createCommentThread(state, {
      id: 't',
      anchor: { nodeId: 'gone', pageId: null },
      revision: 1,
      messages: [],
      resolved: false,
      sync: 'synced',
    });
    expect(api.reconcileCommentAnchors(state, new Set(), new Set())).toEqual(['t']);
    api.setCommentResolved(state, 't', true);
    expect(api.getVisibleCommentThreads(state)).toEqual([]);
    expect(api.getVisibleCommentThreads(state, true)).toHaveLength(1);
  });
});
