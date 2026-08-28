import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

import { createShape, appendShapeLineStyle, appendShapeLineTo, appendShapeMoveTo } from '@flighthq/shape';

import { createAddNodeCommand } from './commands/addNodeCommand';
import { screenToScene } from './coordinateUtils';
import { executeCommand } from './historyUtils';

export interface LineToolOptions {
  readonly strokeColor?: number;
  readonly strokeWidth?: number;
}

export interface LinePreview {
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface LineTool {
  readonly id: string;
  currentLine: LinePreview | null;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export function createLineTool(editor: EditorState, options: Readonly<LineToolOptions> = {}): LineTool {
  let start: { x: number; y: number } | null = null;
  const strokeColor = options.strokeColor ?? 0x000000;
  const strokeWidth = options.strokeWidth ?? 1;

  function getLine(event: Readonly<EditorPointerEvent>): LinePreview {
    const end = screenToScene(editor.viewport, event.x, event.y);
    let endX = end.x;
    let endY = end.y;
    if (event.shiftKey) {
      const deltaX = endX - start!.x;
      const deltaY = endY - start!.y;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.round(Math.atan2(deltaY, deltaX) / (Math.PI / 4)) * (Math.PI / 4);
      endX = start!.x + Math.cos(angle) * distance;
      endY = start!.y + Math.sin(angle) * distance;
    }
    return { startX: start!.x, startY: start!.y, endX, endY };
  }

  return {
    id: 'line',
    currentLine: null,

    activate() {},

    deactivate() {
      start = null;
      this.currentLine = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      start = screenToScene(editor.viewport, event.x, event.y);
      this.currentLine = { startX: start.x, startY: start.y, endX: start.x, endY: start.y };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      this.currentLine = getLine(event);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      const line = getLine(event);
      start = null;
      this.currentLine = null;
      if (editor.scene === null || (line.startX === line.endX && line.startY === line.endY)) return;

      const shape = createShape({ name: 'Line', x: line.startX, y: line.startY });
      appendShapeLineStyle(shape, strokeWidth, strokeColor);
      appendShapeMoveTo(shape, 0, 0);
      appendShapeLineTo(shape, line.endX - line.startX, line.endY - line.startY);
      executeCommand(editor, createAddNodeCommand(editor.scene.root, shape));
    },
  };
}
