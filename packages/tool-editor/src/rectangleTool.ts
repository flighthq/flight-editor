import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

import {
  appendShapeBeginFill,
  appendShapeEndFill,
  appendShapeLineStyle,
  appendShapeRectangle,
  createShape,
} from '@flighthq/shape';

import { createAddNodeCommand } from './commands/addNodeCommand';
import { screenToScene } from './coordinateUtils';
import { executeCommand } from './historyUtils';

export interface RectangleToolOptions {
  readonly fillColor?: number;
  readonly strokeColor?: number;
  readonly strokeWidth?: number;
}

export interface RectanglePreview {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface RectangleTool {
  readonly id: string;
  currentRectangle: RectanglePreview | null;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export function createRectangleTool(editor: EditorState, options: Readonly<RectangleToolOptions> = {}): RectangleTool {
  let start: { x: number; y: number } | null = null;
  const fillColor = options.fillColor ?? 0xffffff;
  const strokeColor = options.strokeColor ?? 0x000000;
  const strokeWidth = options.strokeWidth ?? 1;

  function getRectangle(event: Readonly<EditorPointerEvent>): RectanglePreview {
    const end = screenToScene(editor.viewport, event.x, event.y);
    let halfWidth = Math.abs(end.x - start!.x);
    let halfHeight = Math.abs(end.y - start!.y);
    if (event.shiftKey) halfWidth = halfHeight = Math.max(halfWidth, halfHeight);

    if (event.altKey) {
      return { x: start!.x - halfWidth, y: start!.y - halfHeight, width: halfWidth * 2, height: halfHeight * 2 };
    }

    const endX = start!.x + (end.x < start!.x ? -halfWidth : halfWidth);
    const endY = start!.y + (end.y < start!.y ? -halfHeight : halfHeight);
    return {
      x: Math.min(start!.x, endX),
      y: Math.min(start!.y, endY),
      width: halfWidth,
      height: halfHeight,
    };
  }

  return {
    id: 'rectangle',
    currentRectangle: null,

    activate() {},

    deactivate() {
      start = null;
      this.currentRectangle = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      start = screenToScene(editor.viewport, event.x, event.y);
      this.currentRectangle = { x: start.x, y: start.y, width: 0, height: 0 };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      this.currentRectangle = getRectangle(event);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      const rectangle = getRectangle(event);
      start = null;
      this.currentRectangle = null;
      if (editor.scene === null || rectangle.width === 0 || rectangle.height === 0) return;

      const shape = createShape({ name: 'Rectangle', x: rectangle.x, y: rectangle.y });
      appendShapeBeginFill(shape, fillColor);
      appendShapeLineStyle(shape, strokeWidth, strokeColor);
      appendShapeRectangle(shape, 0, 0, rectangle.width, rectangle.height);
      appendShapeEndFill(shape);
      executeCommand(editor, createAddNodeCommand(editor.scene.root, shape));
    },
  };
}
