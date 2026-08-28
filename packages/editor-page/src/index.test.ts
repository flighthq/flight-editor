import { describe, expect, it } from 'vitest';

import * as pages from './index';

describe('editor-page package surface', () => {
  it('exports ordered page state operations', () => {
    expect(pages.createPageState).toBeTypeOf('function');
    expect(pages.addPage).toBeTypeOf('function');
    expect(pages.reorderPage).toBeTypeOf('function');
  });
});
