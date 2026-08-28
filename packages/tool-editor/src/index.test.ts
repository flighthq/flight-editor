import { describe, expect, it } from 'vitest';

import {
  createAddFromFactoryCommand,
  createAlignNodesCommand,
  createBringForwardCommand,
  createBringToFrontCommand,
  createCopySelectionCommand,
  createDeleteSelectionCommand,
  createDuplicateSelectionCommand,
  createDistributeNodesCommand,
  createPasteNodesCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './index';

describe('tool-editor', () => {
  it('exports editor command creators', () => {
    expect(createAddFromFactoryCommand).toBeTypeOf('function');
    expect(createAlignNodesCommand).toBeTypeOf('function');
    expect(createBringForwardCommand).toBeTypeOf('function');
    expect(createBringToFrontCommand).toBeTypeOf('function');
    expect(createCopySelectionCommand).toBeTypeOf('function');
    expect(createDeleteSelectionCommand).toBeTypeOf('function');
    expect(createDuplicateSelectionCommand).toBeTypeOf('function');
    expect(createDistributeNodesCommand).toBeTypeOf('function');
    expect(createPasteNodesCommand).toBeTypeOf('function');
    expect(createSendBackwardCommand).toBeTypeOf('function');
    expect(createSendToBackCommand).toBeTypeOf('function');
  });
});
