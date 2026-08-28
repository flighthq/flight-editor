import { executeCommand } from '@flighthq/editor-command';
import { getSelectedNodes } from '@flighthq/editor-selection';
import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

import { createBatchTransformCommand } from './commands/batchTransformCommand';

export interface MoveTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

interface DragState {
  startX: number;
  startY: number;
  snapshots: Array<{ node: Node2D; transform: Transform2DLike }>;
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

export function createMoveTool(editor: EditorState): MoveTool {
  let drag: DragState | null = null;

  return {
    id: 'move',

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
      const zoom = editor.viewport.camera.zoom;

      for (const { node, transform } of drag.snapshots) {
        setNodeTransform2D(node, {
          ...transform,
          x: transform.x + dx / zoom,
          y: transform.y + dy / zoom,
        });
      }
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const dx = event.x - drag.startX;
      const dy = event.y - drag.startY;

      if (dx !== 0 || dy !== 0) {
        const zoom = editor.viewport.camera.zoom;
        for (const { node, transform } of drag.snapshots) {
          setNodeTransform2D(node, transform);
        }
        const entries = drag.snapshots.map(({ node, transform }) => ({
          node,
          transform: { ...transform, x: transform.x + dx / zoom, y: transform.y + dy / zoom },
        }));
        const cmd = createBatchTransformCommand(entries);
        executeCommand(editor.commandHistory, cmd);
      }

      drag = null;
    },
  };
}
