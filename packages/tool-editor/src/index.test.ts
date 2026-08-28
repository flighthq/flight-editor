import { describe, expect, it } from 'vitest';

import { createAddFromFactoryCommand, createCopySelectionCommand, createPasteNodesCommand } from './index';

describe('tool-editor', () => {
  it('exports editor command creators', () => {
    expect(createAddFromFactoryCommand).toBeTypeOf('function');
    expect(createCopySelectionCommand).toBeTypeOf('function');
    expect(createPasteNodesCommand).toBeTypeOf('function');
  });
});
