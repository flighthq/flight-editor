import { describe, expect, it } from 'vitest';

import * as api from './index';

describe('editor-editing-scope package surface', () => {
  it('exports navigation and reconciliation operations', () => {
    expect(api.enterEditingScope).toBeTypeOf('function');
    expect(api.navigateToEditingScope).toBeTypeOf('function');
    expect(api.reconcileEditingScopes).toBeTypeOf('function');
  });
});
