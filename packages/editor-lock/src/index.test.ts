import * as lock from './index';

describe('@flighthq/editor-lock exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(lock).sort()).toEqual([
      'clearLocks',
      'createLockState',
      'getLockVersion',
      'getLockedCount',
      'isLocked',
      'lockNode',
      'toggleLock',
      'unlockNode',
    ]);
  });
});
