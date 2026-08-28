import { zoomEditorViewportAtPoint } from '@flighthq/editor-viewport';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

export interface ZoomTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

const ZOOM_STEP = 2;
const DRAG_ZOOM_SENSITIVITY = 0.005;

interface DragState {
  anchorX: number;
  anchorY: number;
  startY: number;
  baseZoom: number;
}

export function createZoomTool(editor: EditorState): ZoomTool {
  let drag: DragState | null = null;

  return {
    id: 'zoom',

    activate() {},

    deactivate() {
      drag = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      drag = {
        anchorX: event.x,
        anchorY: event.y,
        startY: event.y,
        baseZoom: editor.viewport.camera.zoom,
      };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dy = drag.startY - event.y;
      const factor = 1 + dy * DRAG_ZOOM_SENSITIVITY;
      const newZoom = drag.baseZoom * Math.max(factor, 0.01);
      zoomEditorViewportAtPoint(editor.viewport, drag.anchorX, drag.anchorY, newZoom);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dy = Math.abs(event.y - drag.startY);
      if (dy < 3) {
        const currentZoom = editor.viewport.camera.zoom;
        const newZoom = event.shiftKey ? currentZoom / ZOOM_STEP : currentZoom * ZOOM_STEP;
        zoomEditorViewportAtPoint(editor.viewport, event.x, event.y, newZoom);
      }

      drag = null;
    },
  };
}
