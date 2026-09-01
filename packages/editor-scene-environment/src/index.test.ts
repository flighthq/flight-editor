import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createSceneEnvironmentState', () => {
  it('is exported', () => expect(api.createSceneEnvironmentState).toBeTypeOf('function'));
});
describe('registerEnvironmentContribution', () => {
  it('is exported', () => expect(api.registerEnvironmentContribution).toBeTypeOf('function'));
});
describe('setEnvironmentValue', () => {
  it('is exported', () => expect(api.setEnvironmentValue).toBeTypeOf('function'));
});
describe('resetEnvironmentContribution', () => {
  it('is exported', () => expect(api.resetEnvironmentContribution).toBeTypeOf('function'));
});
describe('setViewportEnvironmentValue', () => {
  it('is exported', () => expect(api.setViewportEnvironmentValue).toBeTypeOf('function'));
});
describe('validateSceneEnvironment', () => {
  it('is exported', () => expect(api.validateSceneEnvironment).toBeTypeOf('function'));
});
describe('snapshotSceneEnvironment', () => {
  it('is exported', () => expect(api.snapshotSceneEnvironment).toBeTypeOf('function'));
});

describe('scene-environment behavior', () => {
  it('separates authored and viewport-only settings', () => {
    const state = api.createSceneEnvironmentState();
    api.registerEnvironmentContribution(state, { id: 'fog', defaults: { density: 0 } });
    api.setEnvironmentValue(state, 'fog', 'density', 1);
    api.setViewportEnvironmentValue(state, 'grid', true);
    expect(api.snapshotSceneEnvironment(state)).toEqual({ fog: { density: 1 } });
  });
});
