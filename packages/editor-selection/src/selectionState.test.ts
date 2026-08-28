import { describe, expect, it } from 'vitest';

import type { SelectionFilter } from './selectionState';

import {
  addToSelection,
  clearSelection,
  createSelectionState,
  getPrimarySelection,
  getSelectedNodes,
  getSelectionCount,
  isSelected,
  removeFromSelection,
  setSelection,
  toggleSelection,
} from './selectionState';

function createMockNode(kind: string = 'DisplayObject', name: string | null = null) {
  return { kind, name, data: null, enabled: true, [Symbol.for('flight.entity.runtime')]: undefined } as any;
}

describe('addToSelection', () => {
  it('adds a node and increments version', () => {
    const state = createSelectionState();
    const node = createMockNode();
    const v = state.version;
    expect(addToSelection(state, node)).toBe(true);
    expect(getSelectionCount(state)).toBe(1);
    expect(state.version).toBe(v + 1);
  });

  it('rejects duplicates', () => {
    const state = createSelectionState();
    const node = createMockNode();
    addToSelection(state, node);
    expect(addToSelection(state, node)).toBe(false);
    expect(getSelectionCount(state)).toBe(1);
  });

  it('respects filter', () => {
    const state = createSelectionState();
    const node = createMockNode('Sprite');
    const filter: SelectionFilter = (n) => n.kind === 'DisplayObject';
    expect(addToSelection(state, node, filter)).toBe(false);
    expect(getSelectionCount(state)).toBe(0);
  });
});

describe('clearSelection', () => {
  it('returns false when already empty', () => {
    expect(clearSelection(createSelectionState())).toBe(false);
  });

  it('clears and increments version', () => {
    const state = createSelectionState();
    addToSelection(state, createMockNode());
    const v = state.version;
    expect(clearSelection(state)).toBe(true);
    expect(getSelectionCount(state)).toBe(0);
    expect(state.version).toBe(v + 1);
  });
});

describe('createSelectionState', () => {
  it('starts empty at version 0', () => {
    const state = createSelectionState();
    expect(getSelectionCount(state)).toBe(0);
    expect(state.version).toBe(0);
  });
});

describe('getPrimarySelection', () => {
  it('returns null when empty', () => {
    expect(getPrimarySelection(createSelectionState())).toBeNull();
  });

  it('returns the first added node', () => {
    const state = createSelectionState();
    const a = createMockNode();
    const b = createMockNode();
    addToSelection(state, a);
    addToSelection(state, b);
    expect(getPrimarySelection(state)).toBe(a);
  });
});

describe('isSelected', () => {
  it('returns false for unselected node', () => {
    expect(isSelected(createSelectionState(), createMockNode())).toBe(false);
  });

  it('returns true for selected node', () => {
    const state = createSelectionState();
    const node = createMockNode();
    addToSelection(state, node);
    expect(isSelected(state, node)).toBe(true);
  });
});

describe('removeFromSelection', () => {
  it('returns false for absent node', () => {
    expect(removeFromSelection(createSelectionState(), createMockNode())).toBe(false);
  });

  it('removes and increments version', () => {
    const state = createSelectionState();
    const node = createMockNode();
    addToSelection(state, node);
    const v = state.version;
    expect(removeFromSelection(state, node)).toBe(true);
    expect(getSelectionCount(state)).toBe(0);
    expect(state.version).toBe(v + 1);
  });
});

describe('setSelection', () => {
  it('replaces entire selection', () => {
    const state = createSelectionState();
    const a = createMockNode();
    const b = createMockNode();
    addToSelection(state, a);
    setSelection(state, [b]);
    expect(getSelectionCount(state)).toBe(1);
    expect(isSelected(state, b)).toBe(true);
    expect(isSelected(state, a)).toBe(false);
  });

  it('deduplicates', () => {
    const state = createSelectionState();
    const a = createMockNode();
    setSelection(state, [a, a, a]);
    expect(getSelectionCount(state)).toBe(1);
  });

  it('applies filter', () => {
    const state = createSelectionState();
    const a = createMockNode('Sprite');
    const b = createMockNode('DisplayObject');
    setSelection(state, [a, b], (n) => n.kind === 'DisplayObject');
    expect(getSelectionCount(state)).toBe(1);
    expect(isSelected(state, b)).toBe(true);
  });
});

describe('toggleSelection', () => {
  it('adds when absent', () => {
    const state = createSelectionState();
    const node = createMockNode();
    expect(toggleSelection(state, node)).toBe(true);
    expect(isSelected(state, node)).toBe(true);
  });

  it('removes when present', () => {
    const state = createSelectionState();
    const node = createMockNode();
    addToSelection(state, node);
    expect(toggleSelection(state, node)).toBe(false);
    expect(isSelected(state, node)).toBe(false);
  });
});

describe('getSelectedNodes', () => {
  it('returns the internal array as readonly', () => {
    const state = createSelectionState();
    const a = createMockNode();
    addToSelection(state, a);
    const nodes = getSelectedNodes(state);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBe(a);
  });
});
