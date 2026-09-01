import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createRepeatGridState', () => {
  it('is exported', () => expect(api.createRepeatGridState).toBeTypeOf('function'));
});
describe('addRepeatGrid', () => {
  it('is exported', () => expect(api.addRepeatGrid).toBeTypeOf('function'));
});
describe('resizeRepeatGrid', () => {
  it('is exported', () => expect(api.resizeRepeatGrid).toBeTypeOf('function'));
});
describe('setRepeatGridGap', () => {
  it('is exported', () => expect(api.setRepeatGridGap).toBeTypeOf('function'));
});
describe('setRepeatGridOverride', () => {
  it('is exported', () => expect(api.setRepeatGridOverride).toBeTypeOf('function'));
});
describe('expandRepeatGrid', () => {
  it('is exported', () => expect(api.expandRepeatGrid).toBeTypeOf('function'));
});
describe('detachRepeatGrid', () => {
  it('is exported', () => expect(api.detachRepeatGrid).toBeTypeOf('function'));
});

describe('repeat-grid behavior', () => {
  it('expands deterministically and prunes invalid overrides on resize', () => {
    const state = api.createRepeatGridState();
    api.addRepeatGrid(state, { id: 'g', sourceId: 's', columns: 2, rows: 2, gapX: 5, gapY: 10, overrides: new Map() });
    api.setRepeatGridOverride(state, 'g', 3, { text: 'last' });
    expect(api.expandRepeatGrid(state.grids.get('g')!, 20, 30)[3]).toMatchObject({
      x: 25,
      y: 40,
      values: { text: 'last' },
    });
    api.resizeRepeatGrid(state, 'g', 1, 1);
    expect(state.grids.get('g')?.overrides.size).toBe(0);
  });
});
