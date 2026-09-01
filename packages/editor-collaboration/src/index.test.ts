import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createCollaborationState', () => {
  it('is exported', () => expect(api.createCollaborationState).toBeTypeOf('function'));
});
describe('setCollaborationConnection', () => {
  it('is exported', () => expect(api.setCollaborationConnection).toBeTypeOf('function'));
});
describe('setCollaborationPermission', () => {
  it('is exported', () => expect(api.setCollaborationPermission).toBeTypeOf('function'));
});
describe('enqueueCollaborationOperation', () => {
  it('is exported', () => expect(api.enqueueCollaborationOperation).toBeTypeOf('function'));
});
describe('acknowledgeCollaborationOperation', () => {
  it('is exported', () => expect(api.acknowledgeCollaborationOperation).toBeTypeOf('function'));
});
describe('rejectCollaborationOperation', () => {
  it('is exported', () => expect(api.rejectCollaborationOperation).toBeTypeOf('function'));
});
describe('updateCollaborationPresence', () => {
  it('is exported', () => expect(api.updateCollaborationPresence).toBeTypeOf('function'));
});
describe('expireCollaborationPresence', () => {
  it('is exported', () => expect(api.expireCollaborationPresence).toBeTypeOf('function'));
});
describe('rebaseCollaborationOperations', () => {
  it('is exported', () => expect(api.rebaseCollaborationOperations).toBeTypeOf('function'));
});

describe('collaboration behavior', () => {
  it('rebases and acknowledges optimistic operations', () => {
    const state = api.createCollaborationState(2);
    api.enqueueCollaborationOperation(state, { id: 'a', actorId: 'me', baseRevision: 2, payload: null });
    api.rebaseCollaborationOperations(state, 4);
    expect(state.pending[0]?.baseRevision).toBe(4);
    expect(api.acknowledgeCollaborationOperation(state, 'a', 5)).toBe(true);
    api.setCollaborationPermission(state, 'view');
    expect(() =>
      api.enqueueCollaborationOperation(state, { id: 'b', actorId: 'me', baseRevision: 5, payload: null }),
    ).toThrow('permitted');
  });
});
