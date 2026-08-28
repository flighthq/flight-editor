export interface EditorPointerEvent {
  readonly x: number;
  readonly y: number;
  readonly button: number;
  readonly shiftKey: boolean;
  readonly ctrlKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
}

export interface EditorTool {
  readonly id: string;
  activate?(): void;
  deactivate?(): void;
  pointerDown?(event: Readonly<EditorPointerEvent>): void;
  pointerMove?(event: Readonly<EditorPointerEvent>): void;
  pointerUp?(event: Readonly<EditorPointerEvent>): void;
}

export interface ToolRegistry {
  tools: Map<string, EditorTool>;
  activeToolId: string | null;
}

export function createToolRegistry(): ToolRegistry {
  return { tools: new Map(), activeToolId: null };
}

export function registerTool(registry: ToolRegistry, tool: EditorTool): void {
  registry.tools.set(tool.id, tool);
}

export function unregisterTool(registry: ToolRegistry, toolId: string): boolean {
  if (registry.activeToolId === toolId) {
    deactivateTool(registry);
  }
  return registry.tools.delete(toolId);
}

export function getRegisteredToolIds(registry: Readonly<ToolRegistry>): ReadonlyArray<string> {
  return Array.from(registry.tools.keys());
}

export function activateTool(registry: ToolRegistry, toolId: string): boolean {
  const tool = registry.tools.get(toolId);
  if (tool === undefined) return false;
  if (registry.activeToolId !== null) {
    deactivateTool(registry);
  }
  registry.activeToolId = toolId;
  tool.activate?.();
  return true;
}

export function deactivateTool(registry: ToolRegistry): boolean {
  if (registry.activeToolId === null) return false;
  const tool = registry.tools.get(registry.activeToolId);
  registry.activeToolId = null;
  tool?.deactivate?.();
  return true;
}

export function getActiveTool(registry: Readonly<ToolRegistry>): EditorTool | null {
  if (registry.activeToolId === null) return null;
  return registry.tools.get(registry.activeToolId) ?? null;
}

export function getActiveToolId(registry: Readonly<ToolRegistry>): string | null {
  return registry.activeToolId;
}

export function isToolActive(registry: Readonly<ToolRegistry>, toolId: string): boolean {
  return registry.activeToolId === toolId;
}
