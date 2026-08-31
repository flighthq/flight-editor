import { describe, expect, it } from 'vitest';

import * as api from './index';

describe('editor-diagnostics package surface', () => {
  it('exports the public diagnostic API', () => {
    expect(api.createDiagnosticState).toBeTypeOf('function');
    expect(api.publishDiagnostics).toBeTypeOf('function');
    expect(api.summarizeDiagnostics).toBeTypeOf('function');
  });
});
