import { getSelectedNodes, getSelectionCount, getPrimarySelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';

import type { Node2D, NodeAny, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

export interface InspectorSnapshot {
  readonly count: number;
  readonly name: string | null;
  readonly transform: Transform2DLike | null;
  readonly node: NodeAny | null;
}

function readTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

export function getInspectorSnapshot(editor: Readonly<EditorState>): InspectorSnapshot {
  const count = getSelectionCount(editor.selection);

  if (count === 0) {
    return { count: 0, name: null, transform: null, node: null };
  }

  const primary = getPrimarySelection(editor.selection) as Node2D | null;

  if (primary === null) {
    return { count, name: null, transform: null, node: null };
  }

  return {
    count,
    name: primary.name ?? null,
    transform: readTransform(primary),
    node: primary,
  };
}

export function getInspectorSelectedNames(editor: Readonly<EditorState>): readonly string[] {
  return getSelectedNodes(editor.selection).map((node) => (node as Node2D).name ?? '');
}
