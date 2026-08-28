import { describe, expect, it } from 'vitest';

import * as contextMenu from './index';

describe('editor-context-menu package surface', () => {
  it('exports context menu state operations', () => {
    expect(contextMenu.createContextMenuState).toBeTypeOf('function');
    expect(contextMenu.registerMenuItem).toBeTypeOf('function');
    expect(contextMenu.openContextMenu).toBeTypeOf('function');
  });
});
