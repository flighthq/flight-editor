import { describe, expect, it } from 'vitest';

import {
  beginDrag,
  cancelDrag,
  createDragDropState,
  endDrag,
  getDragDropVersion,
  getDragPayload,
  getDragPosition,
  getDropTarget,
  isDragging,
  setDropTarget,
  updateDragPosition,
} from './dragDropState';

import type { DragPayload } from './dragDropState';

const libraryPayload: DragPayload = { source: 'library', kind: 'Sprite', data: { assetId: 'abc' } };

describe('beginDrag', () => {
  it('is exported', () => expect(beginDrag).toBeTypeOf('function'));
});

describe('cancelDrag', () => {
  it('is exported', () => expect(cancelDrag).toBeTypeOf('function'));
});

describe('endDrag', () => {
  it('is exported', () => expect(endDrag).toBeTypeOf('function'));
});

describe('getDragDropVersion', () => {
  it('is exported', () => expect(getDragDropVersion).toBeTypeOf('function'));
});

describe('getDragPayload', () => {
  it('is exported', () => expect(getDragPayload).toBeTypeOf('function'));
});

describe('getDragPosition', () => {
  it('is exported', () => expect(getDragPosition).toBeTypeOf('function'));
});

describe('getDropTarget', () => {
  it('is exported', () => expect(getDropTarget).toBeTypeOf('function'));
});

describe('isDragging', () => {
  it('is exported', () => expect(isDragging).toBeTypeOf('function'));
});

describe('setDropTarget', () => {
  it('is exported', () => expect(setDropTarget).toBeTypeOf('function'));
});

describe('updateDragPosition', () => {
  it('is exported', () => expect(updateDragPosition).toBeTypeOf('function'));
});

describe('createDragDropState', () => {
  it('starts inactive', () => {
    const state = createDragDropState();
    expect(isDragging(state)).toBe(false);
    expect(getDragPayload(state)).toBeNull();
    expect(getDragPosition(state)).toBeNull();
    expect(getDragDropVersion(state)).toBe(0);
  });

  it('begins a drag with payload and position', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 10, 20);

    expect(isDragging(state)).toBe(true);
    expect(getDragPayload(state)).toBe(libraryPayload);
    expect(getDragPosition(state)).toEqual({ x: 10, y: 20 });
  });

  it('updates position during drag', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 0, 0);
    updateDragPosition(state, 50, 75);

    expect(getDragPosition(state)).toEqual({ x: 50, y: 75 });
  });

  it('ignores position update when not dragging', () => {
    const state = createDragDropState();
    updateDragPosition(state, 50, 75);
    expect(getDragPosition(state)).toBeNull();
  });

  it('sets and reads drop target', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 0, 0);

    const target = { id: 'container-1' };
    setDropTarget(state, target);
    expect(getDropTarget(state)).toBe(target);
  });

  it('ignores drop target when not dragging', () => {
    const state = createDragDropState();
    setDropTarget(state, { id: 'x' });
    expect(getDropTarget(state)).toBeNull();
  });

  it('endDrag returns payload and resets state', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 10, 20);

    const result = endDrag(state);
    expect(result).toBe(libraryPayload);
    expect(isDragging(state)).toBe(false);
    expect(getDragPayload(state)).toBeNull();
    expect(getDragPosition(state)).toBeNull();
    expect(getDropTarget(state)).toBeNull();
  });

  it('endDrag returns null when not dragging', () => {
    const state = createDragDropState();
    expect(endDrag(state)).toBeNull();
  });

  it('cancelDrag resets without returning payload', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 10, 20);

    cancelDrag(state);
    expect(isDragging(state)).toBe(false);
    expect(getDragPayload(state)).toBeNull();
  });

  it('cancelDrag no-ops when not dragging', () => {
    const state = createDragDropState();
    const v = getDragDropVersion(state);
    cancelDrag(state);
    expect(getDragDropVersion(state)).toBe(v);
  });

  it('supports different drag sources', () => {
    const state = createDragDropState();
    const hierarchyPayload: DragPayload = { source: 'hierarchy', kind: 'Node2D', data: null };
    beginDrag(state, hierarchyPayload, 0, 0);

    expect(getDragPayload(state)?.source).toBe('hierarchy');
    endDrag(state);

    const externalPayload: DragPayload = { source: 'external', kind: 'image', data: { url: 'test.png' } };
    beginDrag(state, externalPayload, 5, 5);

    expect(getDragPayload(state)?.source).toBe('external');
    expect(getDragPayload(state)?.kind).toBe('image');
  });

  it('clears drop target on end', () => {
    const state = createDragDropState();
    beginDrag(state, libraryPayload, 0, 0);
    setDropTarget(state, { id: 'target' });

    endDrag(state);

    expect(getDropTarget(state)).toBeNull();
  });

  it('bumps version on each state change', () => {
    const state = createDragDropState();
    expect(getDragDropVersion(state)).toBe(0);

    beginDrag(state, libraryPayload, 0, 0);
    expect(getDragDropVersion(state)).toBe(1);

    updateDragPosition(state, 10, 10);
    expect(getDragDropVersion(state)).toBe(2);

    setDropTarget(state, {});
    expect(getDragDropVersion(state)).toBe(3);

    endDrag(state);
    expect(getDragDropVersion(state)).toBe(4);
  });
});
