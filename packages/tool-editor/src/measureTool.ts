import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

import { screenToScene } from './coordinateUtils';

export interface MeasureResult {
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
  readonly distance: number;
  readonly angle: number;
  readonly deltaX: number;
  readonly deltaY: number;
}

export interface MeasureTool {
  readonly id: string;
  currentMeasurement: MeasureResult | null;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export function createMeasureTool(editor: EditorState, onMeasure: (result: MeasureResult | null) => void): MeasureTool {
  let start: { x: number; y: number } | null = null;

  function measure(endX: number, endY: number): MeasureResult {
    const deltaX = endX - start!.x;
    const deltaY = endY - start!.y;
    return {
      startX: start!.x,
      startY: start!.y,
      endX,
      endY,
      distance: Math.hypot(deltaX, deltaY),
      angle: (Math.atan2(deltaY, deltaX) * 180) / Math.PI,
      deltaX,
      deltaY,
    };
  }

  const tool: MeasureTool = {
    id: 'measure',
    currentMeasurement: null,

    activate() {},

    deactivate() {
      start = null;
      this.currentMeasurement = null;
      onMeasure(null);
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      start = screenToScene(editor.viewport, event.x, event.y);
      this.currentMeasurement = null;
      onMeasure(null);
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      const end = screenToScene(editor.viewport, event.x, event.y);
      this.currentMeasurement = measure(end.x, end.y);
      onMeasure(this.currentMeasurement);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      const end = screenToScene(editor.viewport, event.x, event.y);
      this.currentMeasurement = measure(end.x, end.y);
      start = null;
      onMeasure(this.currentMeasurement);
    },
  };
  return tool;
}
