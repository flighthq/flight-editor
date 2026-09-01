import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createPhysicsAuthoringState', () => {
  it('is exported', () => expect(api.createPhysicsAuthoringState).toBeTypeOf('function'));
});
describe('setPhysicsBody', () => {
  it('is exported', () => expect(api.setPhysicsBody).toBeTypeOf('function'));
});
describe('setPhysicsCollider', () => {
  it('is exported', () => expect(api.setPhysicsCollider).toBeTypeOf('function'));
});
describe('setPhysicsJoint', () => {
  it('is exported', () => expect(api.setPhysicsJoint).toBeTypeOf('function'));
});
describe('removePhysicsNode', () => {
  it('is exported', () => expect(api.removePhysicsNode).toBeTypeOf('function'));
});
describe('validatePhysicsAuthoring', () => {
  it('is exported', () => expect(api.validatePhysicsAuthoring).toBeTypeOf('function'));
});
describe('enterPhysicsPlayMode', () => {
  it('is exported', () => expect(api.enterPhysicsPlayMode).toBeTypeOf('function'));
});
describe('setPhysicsRuntimeValue', () => {
  it('is exported', () => expect(api.setPhysicsRuntimeValue).toBeTypeOf('function'));
});
describe('exitPhysicsPlayMode', () => {
  it('is exported', () => expect(api.exitPhysicsPlayMode).toBeTypeOf('function'));
});

describe('physics-authoring behavior', () => {
  it('isolates runtime values and diagnoses missing joint targets', () => {
    const state = api.createPhysicsAuthoringState();
    api.setPhysicsJoint(state, { id: 'j', nodeId: 'a', targetNodeId: 'b', kind: 'hinge' });
    expect(api.validatePhysicsAuthoring(state, new Set(['a']))).toEqual(['missing-joint-target:j']);
    api.enterPhysicsPlayMode(state);
    api.setPhysicsRuntimeValue(state, 'a.position', [1, 2, 3]);
    api.exitPhysicsPlayMode(state);
    expect(state.runtimeValues.size).toBe(0);
  });
});
