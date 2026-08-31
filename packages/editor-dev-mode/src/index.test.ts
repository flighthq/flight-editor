import { describe, expect, it } from 'vitest';
import * as api from './index';
describe('@flighthq/editor-dev-mode exports', () => {
  it('exposes read-only projection contracts', () =>
    expect(Object.keys(api).sort()).toEqual([
      'compareDevModeSnapshots',
      'createDevModeSnapshot',
      'createDevModeState',
      'registerDevCodeGenerator',
      'runDevCodeGenerator',
      'unregisterDevCodeGenerator',
    ]));
});
