import { describe, expect, it } from 'vitest';

import {
  beginAssetImport,
  cancelAssetImport,
  completeAssetImport,
  createAssetState,
  duplicateAsset,
  failAssetImport,
  getAssetReferences,
  markAssetMissing,
  registerAsset,
  relinkAssetReferences,
  removeAsset,
  setAssetUsage,
  transferAssets,
  updateAsset,
  validateAssetState,
} from './assetState';

function stateWithImage() {
  const state = createAssetState();
  registerAsset(state, { id: 'image', name: 'Logo', kind: 'image', sourceUri: 'file:///logo.png' });
  return state;
}

describe('createAssetState', () => {
  it('creates an empty revisioned registry', () => {
    expect(createAssetState()).toMatchObject({ nextOperationId: 1, version: 0 });
  });
});

describe('registerAsset', () => {
  it('normalizes authoring metadata and rejects invalid identity', () => {
    const state = createAssetState();
    const asset = registerAsset(state, {
      id: 'logo',
      name: 'Logo',
      kind: 'image',
      sourceUri: 'file:///logo.png',
      tags: [' ui ', 'ui', 'brand'],
    });
    expect(asset).toMatchObject({ status: 'stale', tags: ['brand', 'ui'] });
    expect(() => registerAsset(state, { ...asset })).toThrow('already exists');
  });
});

describe('updateAsset', () => {
  it('preserves identity across rename/move and invalidates changed source data', () => {
    const state = stateWithImage();
    updateAsset(state, 'image', { name: 'Wordmark', folder: 'Brand' });
    const result = updateAsset(state, 'image', { sourceUri: 'file:///wordmark.png' });
    expect(result).toMatchObject({ id: 'image', name: 'Wordmark', folder: 'Brand', status: 'stale', revision: 1 });
  });
});

describe('duplicateAsset', () => {
  it('duplicates imported metadata without copying usage identity', () => {
    const state = stateWithImage();
    const operation = beginAssetImport(state, 'image');
    completeAssetImport(state, operation.id, { derivedUri: 'cache:///logo.texture', metadata: { width: 20 } });
    setAssetUsage(state, 'image', 'node', true);
    expect(duplicateAsset(state, 'image', 'copy')).toMatchObject({ id: 'copy', status: 'ready' });
    expect(getAssetReferences(state, 'copy').usages).toEqual([]);
  });
});

describe('beginAssetImport', () => {
  it('supersedes an older operation for the same asset', () => {
    const state = stateWithImage();
    const first = beginAssetImport(state, 'image');
    const second = beginAssetImport(state, 'image');
    expect(second.id).toBeGreaterThan(first.id);
    expect(completeAssetImport(state, first.id, { derivedUri: 'stale' })).toBe(false);
  });
});

describe('completeAssetImport', () => {
  it('accepts only the current source revision and commits derived metadata', () => {
    const state = stateWithImage();
    const operation = beginAssetImport(state, 'image');
    expect(completeAssetImport(state, operation.id, { derivedUri: 'cache:///logo', metadata: { width: 64 } })).toBe(
      true,
    );
    expect(state.assets.get('image')).toMatchObject({ status: 'ready', derivedUri: 'cache:///logo', revision: 1 });
  });

  it('rejects completion after relinking the source', () => {
    const state = stateWithImage();
    const operation = beginAssetImport(state, 'image');
    updateAsset(state, 'image', { sourceUri: 'file:///new.png' });
    expect(completeAssetImport(state, operation.id, { derivedUri: 'stale' })).toBe(false);
  });
});

describe('failAssetImport', () => {
  it('records a current failure and ignores stale acknowledgements', () => {
    const state = stateWithImage();
    const operation = beginAssetImport(state, 'image');
    expect(failAssetImport(state, operation.id + 1, 'old')).toBe(false);
    expect(failAssetImport(state, operation.id, 'decode failed')).toBe(true);
    expect(state.assets.get('image')).toMatchObject({ status: 'failed', error: 'decode failed' });
  });
});

describe('cancelAssetImport', () => {
  it('restores readiness when an earlier derived asset remains available', () => {
    const state = stateWithImage();
    completeAssetImport(state, beginAssetImport(state, 'image').id, { derivedUri: 'cache:///logo' });
    beginAssetImport(state, 'image');
    expect(cancelAssetImport(state, 'image')).toBe(true);
    expect(state.assets.get('image')?.status).toBe('ready');
  });
});

describe('markAssetMissing', () => {
  it('preserves identity and derived information for later relinking', () => {
    const state = stateWithImage();
    markAssetMissing(state, 'image');
    expect(state.assets.get('image')).toMatchObject({ status: 'missing', sourceUri: 'file:///logo.png' });
  });
});

describe('setAssetUsage', () => {
  it('adds and removes stable scene owner references', () => {
    const state = stateWithImage();
    setAssetUsage(state, 'image', 'node-b', true);
    setAssetUsage(state, 'image', 'node-a', true);
    setAssetUsage(state, 'image', 'node-b', false);
    expect(getAssetReferences(state, 'image').usages).toEqual(['node-a']);
  });
});

describe('getAssetReferences', () => {
  it('reports usage and dependency blockers deterministically', () => {
    const state = stateWithImage();
    registerAsset(state, {
      id: 'scene',
      name: 'Scene',
      kind: 'scene',
      sourceUri: 'scene.flight',
      dependencies: ['image'],
    });
    setAssetUsage(state, 'image', 'sprite', true);
    expect(getAssetReferences(state, 'image')).toEqual({ usages: ['sprite'], dependents: ['scene'] });
  });
});

describe('removeAsset', () => {
  it('protects references by default and cleans dependency edges when forced', () => {
    const state = stateWithImage();
    registerAsset(state, {
      id: 'scene',
      name: 'Scene',
      kind: 'scene',
      sourceUri: 'scene.flight',
      dependencies: ['image'],
    });
    expect(removeAsset(state, 'image').removed).toBe(false);
    expect(removeAsset(state, 'image', true).removed).toBe(true);
    expect(state.assets.get('scene')?.dependencies).toEqual([]);
  });
});

describe('relinkAssetReferences', () => {
  it('moves usage and dependency edges to a replacement asset', () => {
    const state = stateWithImage();
    registerAsset(state, { id: 'next', name: 'Next', kind: 'image', sourceUri: 'next.png' });
    registerAsset(state, {
      id: 'scene',
      name: 'Scene',
      kind: 'scene',
      sourceUri: 'scene.flight',
      dependencies: ['image'],
    });
    setAssetUsage(state, 'image', 'sprite', true);
    relinkAssetReferences(state, 'image', 'next');
    expect(getAssetReferences(state, 'next')).toEqual({ usages: ['sprite'], dependents: ['scene'] });
  });
});

describe('transferAssets', () => {
  it('copies a dependency closure and remaps collisions without mutating either document', () => {
    const source = stateWithImage();
    registerAsset(source, {
      id: 'scene',
      name: 'Scene',
      kind: 'scene',
      sourceUri: 'scene.flight',
      dependencies: ['image'],
    });
    const target = stateWithImage();
    const result = transferAssets(source, target, ['scene'], (id) => `copy-${id}`);
    expect(result.assets.map(({ id }) => id)).toEqual(['copy-image', 'copy-scene']);
    expect(result.assets[1]?.dependencies).toEqual(['copy-image']);
    expect(target.assets.size).toBe(1);
  });
});

describe('validateAssetState', () => {
  it('detects malformed reload state without throwing', () => {
    const state = stateWithImage();
    state.assets.get('image')!.dependencies = ['gone'];
    state.assets.get('image')!.status = 'loading';
    expect(validateAssetState(state)).toEqual([
      'Asset image has missing dependency gone',
      'Asset image is loading without an operation',
    ]);
  });
});
