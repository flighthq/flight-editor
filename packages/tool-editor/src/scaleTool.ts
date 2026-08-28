import { executeCommand } from '@flighthq/editor-command';
import { getSelectedNodes } from '@flighthq/editor-selection';
import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

import { createBatchTransformCommand } from './commands/batchTransformCommand';

export interface ScaleTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

interface ScaleDragState {
  startX: number;
  startY: number;
  snapshots: Array<{ node: Node2D; transform: Transform2DLike }>;
}

const SCALE_SENSITIVITY = 0.01;

function snapshotTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

function computeScale(
  transform: Readonly<Transform2DLike>,
  dx: number,
  dy: number,
  uniform: boolean,
): { scaleX: number; scaleY: number } {
  const rawX = transform.scaleX + dx * SCALE_SENSITIVITY;
  const rawY = transform.scaleY + dy * SCALE_SENSITIVITY;

  if (uniform) {
    const avg = ((dx + dy) / 2) * SCALE_SENSITIVITY;
    return {
      scaleX: transform.scaleX + avg,
      scaleY: transform.scaleY + avg,
    };
  }

  return { scaleX: rawX, scaleY: rawY };
}

export function createScaleTool(editor: EditorState): ScaleTool {
  let drag: ScaleDragState | null = null;

  return {
    id: 'scale',

    activate() {},

    deactivate() {
      drag = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
      if (nodes.length === 0) return;

      drag = {
        startX: event.x,
        startY: event.y,
        snapshots: nodes.map((node) => ({ node, transform: snapshotTransform(node) })),
      };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dx = event.x - drag.startX;
      const dy = event.y - drag.startY;

      for (const { node, transform } of drag.snapshots) {
        const { scaleX, scaleY } = computeScale(transform, dx, dy, event.shiftKey);
        setNodeTransform2D(node, { ...transform, scaleX, scaleY });
      }
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dx = event.x - drag.startX;
      const dy = event.y - drag.startY;

      if (dx !== 0 || dy !== 0) {
        for (const { node, transform } of drag.snapshots) {
          setNodeTransform2D(node, transform);
        }
        const entries = drag.snapshots.map(({ node, transform }) => {
          const { scaleX, scaleY } = computeScale(transform, dx, dy, event.shiftKey);
          return { node, transform: { ...transform, scaleX, scaleY } };
        });
        const cmd = createBatchTransformCommand(entries);
        executeCommand(editor.commandHistory, cmd);
      }

      drag = null;
    },
  };
}
