import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createMaterialAuthoringState', () => {
  it('is exported', () => expect(api.createMaterialAuthoringState).toBeTypeOf('function'));
});
describe('addMaterialAsset', () => {
  it('is exported', () => expect(api.addMaterialAsset).toBeTypeOf('function'));
});
describe('updateMaterialProperty', () => {
  it('is exported', () => expect(api.updateMaterialProperty).toBeTypeOf('function'));
});
describe('assignMaterialSlot', () => {
  it('is exported', () => expect(api.assignMaterialSlot).toBeTypeOf('function'));
});
describe('duplicateMaterialAsset', () => {
  it('is exported', () => expect(api.duplicateMaterialAsset).toBeTypeOf('function'));
});
describe('getMaterialUsage', () => {
  it('is exported', () => expect(api.getMaterialUsage).toBeTypeOf('function'));
});
describe('validateMaterials', () => {
  it('is exported', () => expect(api.validateMaterials).toBeTypeOf('function'));
});

describe('material behavior', () => {
  it('tracks slot usage and missing texture diagnostics', () => {
    const state = api.createMaterialAuthoringState();
    api.addMaterialAsset(state, { id: 'm', name: 'Metal', kind: 'pbr', properties: {}, textures: { base: 'missing' } });
    api.assignMaterialSlot(state, 'node', 2, 'm');
    expect(api.getMaterialUsage(state, 'm')).toEqual([{ nodeId: 'node', slot: 2 }]);
    expect(api.validateMaterials(state, new Set(), new Set())).toMatchObject([{ code: 'missing-texture' }]);
  });
});
