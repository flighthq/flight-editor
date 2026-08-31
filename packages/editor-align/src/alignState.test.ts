import { describe, expect, it } from 'vitest';

import {
  clearKeyObject,
  createAlignState,
  getAlignTarget,
  getAlignVersion,
  getDistributeMode,
  getKeyObjectId,
  getLastAlignAxis,
  getLastDistributeAxis,
  setAlignTarget,
  setDistributeMode,
  setKeyObjectId,
  setLastAlignAxis,
  setLastDistributeAxis,
} from './alignState';

describe('createAlignState', () => {
  it('returns default state', () => {
    const state = createAlignState();
    expect(getAlignTarget(state)).toBe('selection');
    expect(getDistributeMode(state)).toBe('equal-spacing');
    expect(getLastAlignAxis(state)).toBeNull();
    expect(getLastDistributeAxis(state)).toBeNull();
    expect(getKeyObjectId(state)).toBeNull();
    expect(getAlignVersion(state)).toBe(0);
  });
});

describe('getAlignTarget', () => {
  it('is exported', () => expect(getAlignTarget).toBeTypeOf('function'));
});

describe('setAlignTarget', () => {
  it('changes the alignment target', () => {
    const state = createAlignState();
    setAlignTarget(state, 'artboard');
    expect(getAlignTarget(state)).toBe('artboard');
    expect(getAlignVersion(state)).toBe(1);
  });

  it('does not bump version when target unchanged', () => {
    const state = createAlignState();
    setAlignTarget(state, 'selection');
    expect(getAlignVersion(state)).toBe(0);
  });
});

describe('getDistributeMode', () => {
  it('is exported', () => expect(getDistributeMode).toBeTypeOf('function'));
});

describe('setDistributeMode', () => {
  it('changes the distribute mode', () => {
    const state = createAlignState();
    setDistributeMode(state, 'equal-size');
    expect(getDistributeMode(state)).toBe('equal-size');
    expect(getAlignVersion(state)).toBe(1);
  });

  it('does not bump version when mode unchanged', () => {
    const state = createAlignState();
    setDistributeMode(state, 'equal-spacing');
    expect(getAlignVersion(state)).toBe(0);
  });
});

describe('getLastAlignAxis', () => {
  it('is exported', () => expect(getLastAlignAxis).toBeTypeOf('function'));
});

describe('setLastAlignAxis', () => {
  it('records the last used alignment axis', () => {
    const state = createAlignState();
    setLastAlignAxis(state, 'left');
    expect(getLastAlignAxis(state)).toBe('left');
    expect(getAlignVersion(state)).toBe(1);
  });
});

describe('getLastDistributeAxis', () => {
  it('is exported', () => expect(getLastDistributeAxis).toBeTypeOf('function'));
});

describe('setLastDistributeAxis', () => {
  it('records the last used distribute axis', () => {
    const state = createAlignState();
    setLastDistributeAxis(state, 'vertical');
    expect(getLastDistributeAxis(state)).toBe('vertical');
    expect(getAlignVersion(state)).toBe(1);
  });
});

describe('getKeyObjectId', () => {
  it('is exported', () => expect(getKeyObjectId).toBeTypeOf('function'));
});

describe('setKeyObjectId', () => {
  it('sets the key object and switches target to key-object', () => {
    const state = createAlignState();
    setKeyObjectId(state, 'node-42');
    expect(getKeyObjectId(state)).toBe('node-42');
    expect(getAlignTarget(state)).toBe('key-object');
    expect(getAlignVersion(state)).toBe(1);
  });

  it('does not bump version when id unchanged', () => {
    const state = createAlignState();
    setKeyObjectId(state, null);
    expect(getAlignVersion(state)).toBe(0);
  });
});

describe('clearKeyObject', () => {
  it('clears the key object and reverts target to selection', () => {
    const state = createAlignState();
    setKeyObjectId(state, 'node-42');
    clearKeyObject(state);
    expect(getKeyObjectId(state)).toBeNull();
    expect(getAlignTarget(state)).toBe('selection');
    expect(getAlignVersion(state)).toBe(2);
  });

  it('does not bump version when already cleared', () => {
    const state = createAlignState();
    clearKeyObject(state);
    expect(getAlignVersion(state)).toBe(0);
  });

  it('does not change target if target was artboard', () => {
    const state = createAlignState();
    setKeyObjectId(state, 'node-1');
    setAlignTarget(state, 'artboard');
    clearKeyObject(state);
    expect(getAlignTarget(state)).toBe('artboard');
  });
});

describe('getAlignVersion', () => {
  it('is exported', () => expect(getAlignVersion).toBeTypeOf('function'));
});
