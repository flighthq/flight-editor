import { describe, expect, it } from 'vitest';

import * as assets from './index';

describe('@flighthq/editor-assets exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(assets).sort()).toEqual([
      'beginAssetImport',
      'cancelAssetImport',
      'completeAssetImport',
      'createAssetState',
      'duplicateAsset',
      'failAssetImport',
      'getAssetReferences',
      'markAssetMissing',
      'registerAsset',
      'relinkAssetReferences',
      'removeAsset',
      'setAssetUsage',
      'transferAssets',
      'updateAsset',
      'validateAssetState',
    ]);
  });
});
