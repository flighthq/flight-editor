import { describe, expect, it } from 'vitest';

import { registerGlRenderers } from './glRendererSetup';

describe('registerGlRenderers', () => {
  it('is a function', () => {
    expect(registerGlRenderers).toBeTypeOf('function');
  });
});
