import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';
import type { Node2D, NodeAny, Transform2DLike } from '@flighthq/types';

import { getSelectedNodes } from '@flighthq/editor-selection';
import {
  addNodeChildAt,
  getNodeChildIndex,
  getNodeParent,
  getNodeTransform2D,
  removeNodeChild,
  setNodeTransform2D,
} from '@flighthq/node';
import { createNode2D, isNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';

interface DuplicateEntry {
  readonly clone: Node2D;
  readonly parent: NodeAny;
  readonly source: Node2D;
}

function snapshotTransform(node: Node2D): Transform2DLike {
  const transform = {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  };
  getNodeTransform2D(transform, node);
  return transform;
}

export function createDuplicateSelectionCommand(editor: EditorState): Command {
  const entries: DuplicateEntry[] = [];
  for (const source of getSelectedNodes(editor.selection)) {
    if (!isNode2D(source)) continue;
    const parent = getNodeParent(source) as NodeAny | null;
    if (parent === null) continue;
    const clone = createNode2D(DisplayObjectKind);
    clone.name = source.name === null ? 'Copy' : `${source.name} Copy`;
    setNodeTransform2D(clone, snapshotTransform(source));
    entries.push({ clone, parent, source });
  }

  return {
    label: 'Duplicate Selection',
    execute() {
      for (const { clone, parent, source } of entries) {
        addNodeChildAt(parent, clone, getNodeChildIndex(parent, source) + 1);
      }
    },
    undo() {
      for (let index = entries.length - 1; index >= 0; index--) {
        const { clone, parent } = entries[index];
        removeNodeChild(parent, clone);
      }
    },
  };
}
