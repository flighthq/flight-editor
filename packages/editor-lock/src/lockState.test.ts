import { describe, expect, it } from 'vitest';

import {
  clearLocks,
  createLockState,
  getLockVersion,
  getLockedCount,
  isLocked,
  lockNode,
  toggleLock,
  unlockNode,
} from './lockState';

describe('clearLocks', () => {
  it('is exported', () => expect(clearLocks).toBeTypeOf('function'));
});

describe('getLockVersion', () => {
  it('is exported', () => expect(getLockVersion).toBeTypeOf('function'));
});

describe('getLockedCount', () => {
  it('is exported', () => expect(getLockedCount).toBeTypeOf('function'));
});

describe('isLocked', () => {
  it('is exported', () => expect(isLocked).toBeTypeOf('function'));
});

describe('lockNode', () => {
  it('is exported', () => expect(lockNode).toBeTypeOf('function'));
});

describe('toggleLock', () => {
  it('is exported', () => expect(toggleLock).toBeTypeOf('function'));
});

describe('unlockNode', () => {
  it('is exported', () => expect(unlockNode).toBeTypeOf('function'));
});

describe('createLockState', () => {
  it('starts empty', () => {
    const state = createLockState();
    expect(getLockedCount(state)).toBe(0);
    expect(getLockVersion(state)).toBe(0);
  });

  it('locks and checks a node', () => {
    const state = createLockState();
    const node = { id: 1 };
    lockNode(state, node);
    expect(isLocked(state, node)).toBe(true);
    expect(getLockedCount(state)).toBe(1);
  });

  it('unlocks a node', () => {
    const state = createLockState();
    const node = { id: 1 };
    lockNode(state, node);
    unlockNode(state, node);
    expect(isLocked(state, node)).toBe(false);
    expect(getLockedCount(state)).toBe(0);
  });

  it('no-ops on redundant lock', () => {
    const state = createLockState();
    const node = { id: 1 };
    lockNode(state, node);
    const v = getLockVersion(state);
    lockNode(state, node);
    expect(getLockVersion(state)).toBe(v);
  });

  it('no-ops on redundant unlock', () => {
    const state = createLockState();
    const v = getLockVersion(state);
    unlockNode(state, { id: 999 });
    expect(getLockVersion(state)).toBe(v);
  });

  it('toggles lock', () => {
    const state = createLockState();
    const node = { id: 1 };
    toggleLock(state, node);
    expect(isLocked(state, node)).toBe(true);
    toggleLock(state, node);
    expect(isLocked(state, node)).toBe(false);
  });

  it('clears all locks', () => {
    const state = createLockState();
    lockNode(state, { id: 1 });
    lockNode(state, { id: 2 });
    clearLocks(state);
    expect(getLockedCount(state)).toBe(0);
  });

  it('clear on empty does not bump version', () => {
    const state = createLockState();
    const v = getLockVersion(state);
    clearLocks(state);
    expect(getLockVersion(state)).toBe(v);
  });

  it('handles multiple locks and selective unlock', () => {
    const state = createLockState();
    const a = { id: 1 };
    const b = { id: 2 };
    const c = { id: 3 };
    lockNode(state, a);
    lockNode(state, b);
    lockNode(state, c);
    expect(getLockedCount(state)).toBe(3);

    unlockNode(state, b);
    expect(getLockedCount(state)).toBe(2);
    expect(isLocked(state, a)).toBe(true);
    expect(isLocked(state, b)).toBe(false);
    expect(isLocked(state, c)).toBe(true);
  });

  it('toggle always bumps version', () => {
    const state = createLockState();
    const node = { id: 1 };
    toggleLock(state, node);
    expect(getLockVersion(state)).toBe(1);
    toggleLock(state, node);
    expect(getLockVersion(state)).toBe(2);
  });

  it('bumps version on each meaningful change', () => {
    const state = createLockState();
    const a = { id: 1 };
    const b = { id: 2 };

    lockNode(state, a);
    expect(getLockVersion(state)).toBe(1);

    lockNode(state, b);
    expect(getLockVersion(state)).toBe(2);

    unlockNode(state, a);
    expect(getLockVersion(state)).toBe(3);

    toggleLock(state, b);
    expect(getLockVersion(state)).toBe(4);
  });
});
