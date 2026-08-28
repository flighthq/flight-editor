import { executeCommand } from '@flighthq/editor-command';
import { getSelectedNodes } from '@flighthq/editor-selection';
import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Node2D, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

import { createBatchTransformCommand } from './commands/batchTransformCommand';

export interface RotateTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export interface RotateToolConfig {
  readonly centerX: number;
  readonly centerY: number;
}

interface RotateDragState {
  centerX: number;
  centerY: number;
  startAngle: number;
  snapshots: Array<{ node: Node2D; transform: Transform2DLike }>;
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

function angleFromCenter(cx: number, cy: number, px: number, py: number): number {
  return Math.atan2(py - cy, px - cx);
}

export function createRotateTool(editor: EditorState, config: RotateToolConfig): RotateTool {
  let drag: RotateDragState | null = null;

  return {
    id: 'rotate',

    activate() {},

    deactivate() {
      drag = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
      if (nodes.length === 0) return;

      drag = {
        centerX: config.centerX,
        centerY: config.centerY,
        startAngle: angleFromCenter(config.centerX, config.centerY, event.x, event.y),
        snapshots: nodes.map((node) => ({ node, transform: snapshotTransform(node) })),
      };
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const currentAngle = angleFromCenter(drag.centerX, drag.centerY, event.x, event.y);
      const deltaAngle = currentAngle - drag.startAngle;

      for (const { node, transform } of drag.snapshots) {
        setNodeTransform2D(node, { ...transform, rotation: transform.rotation + deltaAngle });
      }
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      if (!drag) return;

      const currentAngle = angleFromCenter(drag.centerX, drag.centerY, event.x, event.y);
      const deltaAngle = currentAngle - drag.startAngle;

      if (deltaAngle !== 0) {
        for (const { node, transform } of drag.snapshots) {
          setNodeTransform2D(node, transform);
        }
        const entries = drag.snapshots.map(({ node, transform }) => ({
          node,
          transform: { ...transform, rotation: transform.rotation + deltaAngle },
        }));
        const cmd = createBatchTransformCommand(entries);
        executeCommand(editor.commandHistory, cmd);
      }

      drag = null;
    },
  };
}
