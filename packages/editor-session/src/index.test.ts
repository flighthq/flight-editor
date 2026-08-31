import { describe, expect, it } from 'vitest';

import * as api from './index';

describe('editor-session package surface', () => {
  it('exports document lifecycle operations', () => {
    expect(api.openSessionDocument).toBeTypeOf('function');
    expect(api.updateSessionDocument).toBeTypeOf('function');
    expect(api.closeSessionDocument).toBeTypeOf('function');
  });
});
