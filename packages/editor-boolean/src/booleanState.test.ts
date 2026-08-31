import { describe, expect, it } from 'vitest';

import {
  addBooleanEntry,
  clearBooleanEntries,
  createBooleanState,
  getActiveOperation,
  getBooleanEntries,
  getBooleanEntry,
  getBooleanEntryCount,
  getBooleanSessionVersion,
  getBooleanVersion,
  removeBooleanEntry,
  replaceBooleanEntry,
  setActiveOperation,
  validateBooleanState,
} from './booleanState';

import type { BooleanEntry } from './booleanState';

const entryA: BooleanEntry = {
  resultNodeId: 'result-1',
  operation: 'union',
  operands: [
    { nodeId: 'n1', order: 0 },
    { nodeId: 'n2', order: 1 },
  ],
};

const entryB: BooleanEntry = {
  resultNodeId: 'result-2',
  operation: 'subtract',
  operands: [
    { nodeId: 'n3', order: 0 },
    { nodeId: 'n4', order: 1 },
  ],
};

describe('createBooleanState', () => {
  it('starts with union and no entries', () => {
    const state = createBooleanState();
    expect(getActiveOperation(state)).toBe('union');
    expect(getBooleanEntryCount(state)).toBe(0);
    expect(getBooleanVersion(state)).toBe(0);
  });
});

describe('getActiveOperation', () => {
  it('is exported', () => expect(getActiveOperation).toBeTypeOf('function'));
});

describe('setActiveOperation', () => {
  it('changes the active operation', () => {
    const state = createBooleanState();
    setActiveOperation(state, 'intersect');
    expect(getActiveOperation(state)).toBe('intersect');
    expect(getBooleanVersion(state)).toBe(0);
    expect(getBooleanSessionVersion(state)).toBe(1);
  });

  it('does not bump version when unchanged', () => {
    const state = createBooleanState();
    setActiveOperation(state, 'union');
    expect(getBooleanVersion(state)).toBe(0);
  });
});

describe('addBooleanEntry', () => {
  it('adds an entry', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    expect(getBooleanEntryCount(state)).toBe(1);
    expect(getBooleanEntry(state, 'result-1')).toEqual(entryA);
    expect(getBooleanVersion(state)).toBe(1);
  });
});

describe('removeBooleanEntry', () => {
  it('removes an entry', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    const removed = removeBooleanEntry(state, 'result-1');
    expect(removed).toBe(true);
    expect(getBooleanEntryCount(state)).toBe(0);
  });

  it('returns false when not found', () => {
    const state = createBooleanState();
    const removed = removeBooleanEntry(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getBooleanVersion(state)).toBe(0);
  });
});

describe('getBooleanEntry', () => {
  it('returns undefined for unknown id', () => {
    const state = createBooleanState();
    expect(getBooleanEntry(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getBooleanEntries', () => {
  it('returns all entries', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    addBooleanEntry(state, entryB);
    expect(getBooleanEntries(state)).toEqual([entryA, entryB]);
  });
});

describe('getBooleanEntryCount', () => {
  it('is exported', () => expect(getBooleanEntryCount).toBeTypeOf('function'));
});

describe('clearBooleanEntries', () => {
  it('removes all entries', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    addBooleanEntry(state, entryB);
    clearBooleanEntries(state);
    expect(getBooleanEntryCount(state)).toBe(0);
  });

  it('does not bump version when already empty', () => {
    const state = createBooleanState();
    clearBooleanEntries(state);
    expect(getBooleanVersion(state)).toBe(0);
  });
});

describe('getBooleanVersion', () => {
  it('is exported', () => expect(getBooleanVersion).toBeTypeOf('function'));
});

describe('getBooleanSessionVersion', () => {
  it('separates tool choice from authored operations', () => {
    const state = createBooleanState();
    setActiveOperation(state, 'exclude');
    expect(getBooleanSessionVersion(state)).toBe(1);
    expect(getBooleanVersion(state)).toBe(0);
  });
});

describe('replaceBooleanEntry', () => {
  it('normalizes operand ordering and updates an existing result', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    expect(
      replaceBooleanEntry(state, {
        ...entryA,
        operation: 'subtract',
        operands: [
          { nodeId: 'n2', order: 9 },
          { nodeId: 'n1', order: 2 },
        ],
      }),
    ).toBe(true);
    expect(getBooleanEntry(state, entryA.resultNodeId)?.operands).toEqual([
      { nodeId: 'n1', order: 0 },
      { nodeId: 'n2', order: 1 },
    ]);
  });
});

describe('validateBooleanState', () => {
  it('diagnoses malformed hydrated entries', () => {
    const state = createBooleanState();
    state.entries.set('bad', { resultNodeId: 'bad', operation: 'union', operands: [] });
    expect(validateBooleanState(state)[0]).toContain('at least two');
  });
});

describe('addBooleanEntry', () => {
  it('rejects duplicate results, operands, and self references', () => {
    const state = createBooleanState();
    addBooleanEntry(state, entryA);
    expect(() => addBooleanEntry(state, entryA)).toThrow('already exists');
    expect(() =>
      addBooleanEntry(state, {
        resultNodeId: 'bad',
        operation: 'union',
        operands: [
          { nodeId: 'n1', order: 0 },
          { nodeId: 'n1', order: 1 },
        ],
      }),
    ).toThrow('Duplicate');
  });
});
