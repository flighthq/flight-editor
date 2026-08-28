import { addToSelection, setSelection } from '@flighthq/editor-selection';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { NodeAny } from '@flighthq/types';
import type { EditorState } from './editorState';

export interface MarqueeRect {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export type MarqueeHitTestFn = (x1: number, y1: number, x2: number, y2: number) => NodeAny[];

export interface MarqueeTool {
  readonly id: string;
  regionHitTest: MarqueeHitTestFn;
  currentRect: MarqueeRect | null;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

function makeRect(startX: number, startY: number, endX: number, endY: number): MarqueeRect {
  return {
    x1: Math.min(startX, endX),
    y1: Math.min(startY, endY),
    x2: Math.max(startX, endX),
    y2: Math.max(startY, endY),
  };
}

export function createMarqueeTool(editor: EditorState, regionHitTest: MarqueeHitTestFn): MarqueeTool {
  let start: { x: number; y: number } | null = null;

  return {
    id: 'marquee',
    regionHitTest,
    currentRect: null,

    activate() {},

    deactivate() {
      start = null;
      this.currentRect = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      start = { x: event.x, y: event.y };
      this.currentRect = makeRect(event.x, event.y, event.x, event.y);
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      this.currentRect = makeRect(start.x, start.y, event.x, event.y);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (start === null) return;
      const rect = makeRect(start.x, start.y, event.x, event.y);
      const nodes = this.regionHitTest(rect.x1, rect.y1, rect.x2, rect.y2);

      if (event.shiftKey) {
        for (const node of nodes) addToSelection(editor.selection, node);
      } else {
        setSelection(editor.selection, nodes);
      }

      start = null;
      this.currentRect = null;
    },
  };
}
