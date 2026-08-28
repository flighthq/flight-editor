import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  clearClipboard,
  createClipboardState,
  getClipboardEntries,
  getClipboardEntryCount,
  getClipboardOperation,
  getClipboardVersion,
  isClipboardEmpty,
  setClipboardEntries,
} from './clipboardState';

describe('getClipboardEntries', () => {
  it('is exported', () => expect(getClipboardEntries).toBeTypeOf('function'));
});

describe('getClipboardEntryCount', () => {
  it('is exported', () => expect(getClipboardEntryCount).toBeTypeOf('function'));
});

describe('getClipboardOperation', () => {
  it('is exported', () => expect(getClipboardOperation).toBeTypeOf('function'));
});

describe('getClipboardVersion', () => {
  it('is exported', () => expect(getClipboardVersion).toBeTypeOf('function'));
});

describe('isClipboardEmpty', () => {
  it('is exported', () => expect(isClipboardEmpty).toBeTypeOf('function'));
});

describe('createClipboardState', () => {
  it('starts empty', () => {
    const state = createClipboardState();
    expect(isClipboardEmpty(state)).toBe(true);
    expect(getClipboardEntryCount(state)).toBe(0);
    expect(getClipboardOperation(state)).toBeNull();
    expect(getClipboardVersion(state)).toBe(0);
  });
});

describe('setClipboardEntries', () => {
  it('stores nodes and operation', () => {
    const state = createClipboardState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    setClipboardEntries(state, [a, b], 'copy');

    expect(isClipboardEmpty(state)).toBe(false);
    expect(getClipboardEntryCount(state)).toBe(2);
    expect(getClipboardEntries(state)).toEqual([a, b]);
    expect(getClipboardOperation(state)).toBe('copy');
    expect(getClipboardVersion(state)).toBe(1);
  });

  it('replaces previous entries', () => {
    const state = createClipboardState();
    const a = createNode2D(DisplayObjectKind);
    const b = createNode2D(DisplayObjectKind);

    setClipboardEntries(state, [a], 'copy');
    setClipboardEntries(state, [b], 'cut');

    expect(getClipboardEntries(state)).toEqual([b]);
    expect(getClipboardOperation(state)).toBe('cut');
    expect(getClipboardVersion(state)).toBe(2);
  });

  it('does not alias the input array', () => {
    const state = createClipboardState();
    const a = createNode2D(DisplayObjectKind);
    const input = [a];

    setClipboardEntries(state, input, 'copy');
    input.length = 0;

    expect(getClipboardEntryCount(state)).toBe(1);
  });
});

describe('clearClipboard', () => {
  it('empties the clipboard', () => {
    const state = createClipboardState();
    const a = createNode2D(DisplayObjectKind);
    setClipboardEntries(state, [a], 'copy');

    clearClipboard(state);

    expect(isClipboardEmpty(state)).toBe(true);
    expect(getClipboardOperation(state)).toBeNull();
    expect(getClipboardVersion(state)).toBe(2);
  });

  it('does not bump version if already empty', () => {
    const state = createClipboardState();
    clearClipboard(state);
    expect(getClipboardVersion(state)).toBe(0);
  });
});
