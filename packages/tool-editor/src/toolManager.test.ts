import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  activateEditorTool,
  deactivateEditorTool,
  getActiveEditorTool,
  getActiveEditorToolId,
  getRegisteredEditorToolIds,
  isEditorToolActive,
  registerEditorTool,
  unregisterEditorTool,
} from './toolManager';

function makeTool(id: string) {
  return { id, activate() {}, deactivate() {} } as any;
}

describe('registerEditorTool', () => {
  it('registers a tool', () => {
    const editor = createEditorState();
    registerEditorTool(editor, makeTool('select'));
    expect(getRegisteredEditorToolIds(editor)).toContain('select');
  });
});

describe('unregisterEditorTool', () => {
  it('removes a tool', () => {
    const editor = createEditorState();
    registerEditorTool(editor, makeTool('select'));
    expect(unregisterEditorTool(editor, 'select')).toBe(true);
    expect(getRegisteredEditorToolIds(editor)).not.toContain('select');
  });
});

describe('activateEditorTool', () => {
  it('activates a registered tool', () => {
    const editor = createEditorState();
    registerEditorTool(editor, makeTool('move'));
    expect(activateEditorTool(editor, 'move')).toBe(true);
    expect(getActiveEditorToolId(editor)).toBe('move');
  });

  it('returns false for unregistered tool', () => {
    const editor = createEditorState();
    expect(activateEditorTool(editor, 'missing')).toBe(false);
  });
});

describe('deactivateEditorTool', () => {
  it('deactivates the current tool', () => {
    const editor = createEditorState();
    registerEditorTool(editor, makeTool('move'));
    activateEditorTool(editor, 'move');
    expect(deactivateEditorTool(editor)).toBe(true);
    expect(getActiveEditorToolId(editor)).toBeNull();
  });
});

describe('getActiveEditorTool', () => {
  it('returns null when no tool is active', () => {
    const editor = createEditorState();
    expect(getActiveEditorTool(editor)).toBeNull();
  });
});

describe('getActiveEditorToolId', () => {
  it('returns null when no tool is active', () => {
    const editor = createEditorState();
    expect(getActiveEditorToolId(editor)).toBeNull();
  });
});

describe('getRegisteredEditorToolIds', () => {
  it('returns empty when no tools registered', () => {
    const editor = createEditorState();
    expect(getRegisteredEditorToolIds(editor)).toHaveLength(0);
  });
});

describe('isEditorToolActive', () => {
  it('returns true for the active tool', () => {
    const editor = createEditorState();
    registerEditorTool(editor, makeTool('zoom'));
    activateEditorTool(editor, 'zoom');
    expect(isEditorToolActive(editor, 'zoom')).toBe(true);
  });

  it('returns false for inactive tool', () => {
    const editor = createEditorState();
    expect(isEditorToolActive(editor, 'zoom')).toBe(false);
  });
});
