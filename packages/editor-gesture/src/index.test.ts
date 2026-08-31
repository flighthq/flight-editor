import { describe, expect, it } from 'vitest';

import * as api from './index';

describe('editor-gesture package surface', () => {
  it('exports transaction lifecycle operations', () => {
    expect(api.beginGesture).toBeTypeOf('function');
    expect(api.previewGesture).toBeTypeOf('function');
    expect(api.commitGesture).toBeTypeOf('function');
    expect(api.cancelGesture).toBeTypeOf('function');
  });
});
