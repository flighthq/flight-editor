import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createViewport3DState', () => {
  it('is exported', () => expect(api.createViewport3DState).toBeTypeOf('function'));
});
describe('setViewport3DCamera', () => {
  it('is exported', () => expect(api.setViewport3DCamera).toBeTypeOf('function'));
});
describe('orbitViewport3D', () => {
  it('is exported', () => expect(api.orbitViewport3D).toBeTypeOf('function'));
});
describe('panViewport3D', () => {
  it('is exported', () => expect(api.panViewport3D).toBeTypeOf('function'));
});
describe('dollyViewport3D', () => {
  it('is exported', () => expect(api.dollyViewport3D).toBeTypeOf('function'));
});
describe('frameViewport3D', () => {
  it('is exported', () => expect(api.frameViewport3D).toBeTypeOf('function'));
});
describe('saveViewport3DBookmark', () => {
  it('is exported', () => expect(api.saveViewport3DBookmark).toBeTypeOf('function'));
});
describe('restoreViewport3DBookmark', () => {
  it('is exported', () => expect(api.restoreViewport3DBookmark).toBeTypeOf('function'));
});

describe('viewport3d behavior', () => {
  it('restores saved camera bookmarks after navigation', () => {
    const state = api.createViewport3DState();
    api.frameViewport3D(state, [-1, -2, -3], [1, 2, 3]);
    api.saveViewport3DBookmark(state, 'front', 'Front');
    const saved = [...state.position];
    api.panViewport3D(state, [2, 0, 0]);
    expect(api.restoreViewport3DBookmark(state, 'front')).toBe(true);
    expect(state.position).toEqual(saved);
  });
});
