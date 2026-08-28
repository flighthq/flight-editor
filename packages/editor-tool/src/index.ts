export {
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

export type { EditorPointerEvent, EditorTool, ToolRegistry } from './toolRegistry';
