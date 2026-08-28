import { describe, expect, it } from 'vitest';

import * as transformOrigin from './index';

describe('editor-transform-origin package surface', () => {
  it('exports state and point computation operations', () => {
    expect(transformOrigin.createTransformOriginState).toBeTypeOf('function');
    expect(transformOrigin.setTransformOriginMode).toBeTypeOf('function');
    expect(transformOrigin.computeTransformOriginPoint).toBeTypeOf('function');
  });
});
