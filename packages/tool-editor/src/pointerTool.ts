import { executeCommand } from '@flighthq/editor-command';
import { clearSelection, isSelected, setSelection, toggleSelection } from '@flighthq/editor-selection';
import { getSelectedNodes } from '@flighthq/editor-selection';
import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { Node2D, NodeAny, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

import { createSetTransform2DCommand } from './commands/setTransform2DCommand';

export type PointerHitTestFn = (x: number, y: number) => NodeAny | null;

export type ScaleHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ScaleHandleHit {
  readonly node: NodeAny;
  readonly handle: ScaleHandle;
}

export type HandleHitTestFn = (x: number, y: number) => ScaleHandleHit | null;

export interface RotationHandleHit {
  readonly node: NodeAny;
  readonly centerX: number;
  readonly centerY: number;
}

export type RotationHitTestFn = (x: number, y: number) => RotationHandleHit | null;

export interface PointerToolConfig {
  hitTest: PointerHitTestFn;
  handleHitTest: HandleHitTestFn;
  rotationHitTest?: RotationHitTestFn;
}

export interface PointerTool {
  readonly id: string;
  hitTest: PointerHitTestFn;
  handleHitTest: HandleHitTestFn;
  rotationHitTest: RotationHitTestFn;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

type DragMode = 'move' | 'scale' | 'rotate';

interface DragState {
  mode: DragMode;
  startX: number;
  startY: number;
  snapshots: Array<{ node: Node2D; transform: Transform2DLike }>;
  scaleHandle: ScaleHandle | null;
  rotationCenter: { x: number; y: number } | null;
  startAngle: number;
}

const SCALE_SENSITIVITY = 0.01;

function snapshotTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

function scaleMultiplier(handle: ScaleHandle): { mx: number; my: number } {
  switch (handle) {
    case 'bottom-right':
      return { mx: 1, my: 1 };
    case 'bottom-left':
      return { mx: -1, my: 1 };
    case 'top-right':
      return { mx: 1, my: -1 };
    case 'top-left':
      return { mx: -1, my: -1 };
  }
}

function computeScaleFromHandle(
  transform: Readonly<Transform2DLike>,
  dx: number,
  dy: number,
  handle: ScaleHandle,
  uniform: boolean,
): { scaleX: number; scaleY: number } {
  const { mx, my } = scaleMultiplier(handle);
  const rawX = transform.scaleX + dx * mx * SCALE_SENSITIVITY;
  const rawY = transform.scaleY + dy * my * SCALE_SENSITIVITY;

  if (uniform) {
    const avg = ((dx * mx + dy * my) / 2) * SCALE_SENSITIVITY;
    return { scaleX: transform.scaleX + avg, scaleY: transform.scaleY + avg };
  }

  return { scaleX: rawX, scaleY: rawY };
}

function angleFromCenter(cx: number, cy: number, px: number, py: number): number {
  return Math.atan2(py - cy, px - cx);
}

function computeNewTransform(drag: DragState, event: Readonly<EditorPointerEvent>, zoom: number): Transform2DLike[] {
  const dx = event.x - drag.startX;
  const dy = event.y - drag.startY;

  return drag.snapshots.map(({ transform }) => {
    if (drag.mode === 'move') {
      return { ...transform, x: transform.x + dx / zoom, y: transform.y + dy / zoom };
    }
    if (drag.mode === 'scale' && drag.scaleHandle) {
      const { scaleX, scaleY } = computeScaleFromHandle(transform, dx, dy, drag.scaleHandle, event.shiftKey);
      return { ...transform, scaleX, scaleY };
    }
    if (drag.mode === 'rotate' && drag.rotationCenter) {
      const currentAngle = angleFromCenter(drag.rotationCenter.x, drag.rotationCenter.y, event.x, event.y);
      const deltaAngle = currentAngle - drag.startAngle;
      return { ...transform, rotation: transform.rotation + deltaAngle };
    }
    return transform;
  });
}

const noRotationHit: RotationHitTestFn = () => null;

export function createPointerTool(
  editor: EditorState,
  hitTest: PointerHitTestFn,
  handleHitTest: HandleHitTestFn,
  rotationHitTest?: RotationHitTestFn,
): PointerTool {
  let drag: DragState | null = null;

  function applyDrag(event: Readonly<EditorPointerEvent>): void {
    if (!drag) return;
    const transforms = computeNewTransform(drag, event, editor.viewport.camera.zoom);
    for (let i = 0; i < drag.snapshots.length; i++) {
      setNodeTransform2D(drag.snapshots[i].node, transforms[i]);
    }
  }

  function commitDrag(event: Readonly<EditorPointerEvent>): void {
    if (!drag) return;

    const dx = event.x - drag.startX;
    const dy = event.y - drag.startY;
    const hasRotationDelta = drag.mode === 'rotate' && drag.rotationCenter !== null && (dx !== 0 || dy !== 0);

    if (dx === 0 && dy === 0 && !hasRotationDelta) {
      drag = null;
      return;
    }

    const transforms = computeNewTransform(drag, event, editor.viewport.camera.zoom);
    for (let i = 0; i < drag.snapshots.length; i++) {
      const { node, transform } = drag.snapshots[i];
      setNodeTransform2D(node, transform);
      const cmd = createSetTransform2DCommand(node, transforms[i]);
      executeCommand(editor.commandHistory, cmd);
    }

    drag = null;
  }

  return {
    id: 'pointer',
    hitTest,
    handleHitTest,
    rotationHitTest: rotationHitTest ?? noRotationHit,

    activate() {},

    deactivate() {
      drag = null;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      const rotHit = this.rotationHitTest(event.x, event.y);
      if (rotHit && isSelected(editor.selection, rotHit.node)) {
        const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
        drag = {
          mode: 'rotate',
          startX: event.x,
          startY: event.y,
          snapshots: nodes.map((node) => ({ node, transform: snapshotTransform(node) })),
          scaleHandle: null,
          rotationCenter: { x: rotHit.centerX, y: rotHit.centerY },
          startAngle: angleFromCenter(rotHit.centerX, rotHit.centerY, event.x, event.y),
        };
        return;
      }

      const handleHit = this.handleHitTest(event.x, event.y);
      if (handleHit && isSelected(editor.selection, handleHit.node)) {
        const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
        drag = {
          mode: 'scale',
          startX: event.x,
          startY: event.y,
          snapshots: nodes.map((node) => ({ node, transform: snapshotTransform(node) })),
          scaleHandle: handleHit.handle,
          rotationCenter: null,
          startAngle: 0,
        };
        return;
      }

      const hit = this.hitTest(event.x, event.y);

      if (hit === null) {
        if (!event.shiftKey) {
          clearSelection(editor.selection);
        }
        return;
      }

      if (event.shiftKey) {
        toggleSelection(editor.selection, hit);
      } else if (!isSelected(editor.selection, hit)) {
        setSelection(editor.selection, [hit]);
      }

      const nodes = getSelectedNodes(editor.selection) as readonly Node2D[];
      if (nodes.length > 0) {
        drag = {
          mode: 'move',
          startX: event.x,
          startY: event.y,
          snapshots: nodes.map((node) => ({ node, transform: snapshotTransform(node) })),
          scaleHandle: null,
          rotationCenter: null,
          startAngle: 0,
        };
      }
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      applyDrag(event);
    },

    pointerUp(event: Readonly<EditorPointerEvent>) {
      commitDrag(event);
    },
  };
}
