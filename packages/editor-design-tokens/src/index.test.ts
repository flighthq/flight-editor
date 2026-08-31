import { describe, expect, it } from 'vitest';
import * as tokens from './index';

describe('@flighthq/editor-design-tokens exports', () => {
  it('exposes its authoring surface', () => {
    expect(Object.keys(tokens).sort()).toEqual([
      'bindDesignToken',
      'createDesignTokenCommand',
      'createDesignTokenState',
      'detachDesignTokenBinding',
      'registerDesignToken',
      'registerDesignTokenCollection',
      'relinkDesignToken',
      'removeDesignToken',
      'resolveDesignToken',
      'restoreDesignTokens',
      'serializeDesignTokens',
      'setDesignTokenScope',
      'setDesignTokenValue',
    ]);
  });
});
