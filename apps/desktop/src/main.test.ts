import { describe, expect, it } from 'vitest';

import { createTauriApp } from './main';

describe('createTauriApp', () => {
  it('is a function', () => {
    expect(createTauriApp).toBeTypeOf('function');
  });
});
