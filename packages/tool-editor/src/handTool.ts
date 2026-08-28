import { panEditorViewport } from '@flighthq/editor-viewport';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

export interface HandTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

interface DragState {
  lastX: number;
  lastY: number;
}

export function createHandTool(editor: EditorState): HandTool {
  let drag: DragState | null = null;

  return {
    id: 'hand',

    activate() {},

    deactivate() {
      drag = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      drag = { lastX: event.x, lastY: event.y };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dx = event.x - drag.lastX;
      const dy = event.y - drag.lastY;
      panEditorViewport(editor.viewport, -dx, -dy);

      drag.lastX = event.x;
      drag.lastY = event.y;
    },

    pointerUp() {
      drag = null;
    },
  };
}
