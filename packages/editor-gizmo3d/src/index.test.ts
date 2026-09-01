import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createGizmo3DState', () => {
  it('is exported', () => expect(api.createGizmo3DState).toBeTypeOf('function'));
});
describe('configureGizmo3D', () => {
  it('is exported', () => expect(api.configureGizmo3D).toBeTypeOf('function'));
});
describe('setGizmo3DSnap', () => {
  it('is exported', () => expect(api.setGizmo3DSnap).toBeTypeOf('function'));
});
describe('beginGizmo3DGesture', () => {
  it('is exported', () => expect(api.beginGizmo3DGesture).toBeTypeOf('function'));
});
describe('previewGizmo3DTranslation', () => {
  it('is exported', () => expect(api.previewGizmo3DTranslation).toBeTypeOf('function'));
});
describe('commitGizmo3DGesture', () => {
  it('is exported', () => expect(api.commitGizmo3DGesture).toBeTypeOf('function'));
});
describe('cancelGizmo3DGesture', () => {
  it('is exported', () => expect(api.cancelGizmo3DGesture).toBeTypeOf('function'));
});
describe('getGizmo3DHandleScale', () => {
  it('is exported', () => expect(api.getGizmo3DHandleScale).toBeTypeOf('function'));
});

describe('gizmo3d behavior', () => {
  it('cancellation restores exact pre-gesture transforms', () => {
    const state = api.createGizmo3DState();
    const before = new Map([['a', { position: [1, 2, 3], rotation: [0, 0, 0], scale: [1, 1, 1] } as const]]);
    api.beginGizmo3DGesture(state, 'x', before);
    api.previewGizmo3DTranslation(state, [3, 0, 0]);
    expect(api.cancelGizmo3DGesture(state)).toEqual(before);
  });
});
