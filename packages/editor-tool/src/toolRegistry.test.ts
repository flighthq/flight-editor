import { describe, expect, it, vi } from 'vitest';

import type { EditorTool } from './toolRegistry';

import {
  activateTool,
  createToolRegistry,
  deactivateTool,
  getActiveTool,
  getActiveToolId,
  getRegisteredToolIds,
  isToolActive,
  registerTool,
  unregisterTool,
} from './toolRegistry';

function createMockTool(id: string) {
  return {
    id,
    activate: vi.fn() as () => void,
    deactivate: vi.fn() as () => void,
  };
}

describe('getActiveTool', () => {
  it('is exported', () => expect(getActiveTool).toBeTypeOf('function'));
});

describe('getActiveToolId', () => {
  it('is exported', () => expect(getActiveToolId).toBeTypeOf('function'));
});

describe('activateTool', () => {
  it('returns false for unregistered tool', () => {
    const registry = createToolRegistry();
    expect(activateTool(registry, 'select')).toBe(false);
  });

  it('calls activate on the tool', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    expect(activateTool(registry, 'select')).toBe(true);
    expect(tool.activate).toHaveBeenCalledOnce();
  });

  it('deactivates previous tool first', () => {
    const registry = createToolRegistry();
    const a = createMockTool('a');
    const b = createMockTool('b');
    registerTool(registry, a);
    registerTool(registry, b);
    activateTool(registry, 'a');
    activateTool(registry, 'b');
    expect(a.deactivate).toHaveBeenCalledOnce();
    expect(b.activate).toHaveBeenCalledOnce();
  });
});

describe('createToolRegistry', () => {
  it('starts with no active tool', () => {
    const registry = createToolRegistry();
    expect(getActiveToolId(registry)).toBeNull();
    expect(getActiveTool(registry)).toBeNull();
  });
});

describe('deactivateTool', () => {
  it('returns false when nothing is active', () => {
    expect(deactivateTool(createToolRegistry())).toBe(false);
  });

  it('calls deactivate and clears active', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    activateTool(registry, 'select');
    expect(deactivateTool(registry)).toBe(true);
    expect(tool.deactivate).toHaveBeenCalledOnce();
    expect(getActiveToolId(registry)).toBeNull();
  });
});

describe('getRegisteredToolIds', () => {
  it('returns all registered ids', () => {
    const registry = createToolRegistry();
    registerTool(registry, createMockTool('a'));
    registerTool(registry, createMockTool('b'));
    expect(getRegisteredToolIds(registry)).toEqual(['a', 'b']);
  });
});

describe('isToolActive', () => {
  it('returns false when no tool is active', () => {
    expect(isToolActive(createToolRegistry(), 'select')).toBe(false);
  });

  it('returns true for the active tool', () => {
    const registry = createToolRegistry();
    registerTool(registry, createMockTool('select'));
    activateTool(registry, 'select');
    expect(isToolActive(registry, 'select')).toBe(true);
  });
});

describe('registerTool', () => {
  it('makes tool available for activation', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    expect(getRegisteredToolIds(registry)).toContain('select');
  });

  it('replaces an existing tool with the same id', () => {
    const registry = createToolRegistry();
    const first = createMockTool('select');
    const second = createMockTool('select');
    registerTool(registry, first);
    registerTool(registry, second);
    expect(getRegisteredToolIds(registry)).toHaveLength(1);
    activateTool(registry, 'select');
    expect(getActiveTool(registry)).toBe(second);
  });
});

describe('unregisterTool', () => {
  it('returns false for unknown tool', () => {
    expect(unregisterTool(createToolRegistry(), 'select')).toBe(false);
  });

  it('deactivates and removes', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    activateTool(registry, 'select');
    expect(unregisterTool(registry, 'select')).toBe(true);
    expect(tool.deactivate).toHaveBeenCalledOnce();
    expect(getActiveToolId(registry)).toBeNull();
    expect(getRegisteredToolIds(registry)).not.toContain('select');
  });

  it('removes inactive tool without calling deactivate', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    expect(unregisterTool(registry, 'select')).toBe(true);
    expect(tool.deactivate).not.toHaveBeenCalled();
  });
});

describe('activateTool — lifecycle', () => {
  it('getActiveTool returns the tool instance', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    activateTool(registry, 'select');
    expect(getActiveTool(registry)).toBe(tool);
  });

  it('isToolActive returns false for inactive after deactivation', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    activateTool(registry, 'select');
    deactivateTool(registry);
    expect(isToolActive(registry, 'select')).toBe(false);
  });

  it('activating same tool twice calls deactivate then activate', () => {
    const registry = createToolRegistry();
    const tool = createMockTool('select');
    registerTool(registry, tool);
    activateTool(registry, 'select');
    activateTool(registry, 'select');
    expect(tool.deactivate).toHaveBeenCalledOnce();
    expect(tool.activate).toHaveBeenCalledTimes(2);
  });

  it('handles tool without activate/deactivate callbacks', () => {
    const registry = createToolRegistry();
    const tool: EditorTool = { id: 'bare' };
    registerTool(registry, tool);
    expect(() => activateTool(registry, 'bare')).not.toThrow();
    expect(() => deactivateTool(registry)).not.toThrow();
    expect(getActiveToolId(registry)).toBeNull();
  });
});
