import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';
import type { NodeAny } from '@flighthq/types';

import { clearSelection, getSelectedNodes, setSelection } from '@flighthq/editor-selection';
import { addNodeChildAt, getNodeChildIndex, getNodeParent, removeNodeChild } from '@flighthq/node';

interface DeletedNodeEntry {
  readonly index: number;
  readonly node: NodeAny;
  readonly parent: NodeAny;
}

export function createDeleteSelectionCommand(editor: EditorState): Command {
  const selection = getSelectedNodes(editor.selection).slice();
  const entries: DeletedNodeEntry[] = [];
  for (const node of selection) {
    const parent = getNodeParent(node) as NodeAny | null;
    if (parent === null) continue;
    entries.push({ index: getNodeChildIndex(parent, node), node, parent });
  }
  const restoreOrder = entries.slice().sort((left, right) => left.index - right.index);

  return {
    label: 'Delete Selection',
    execute() {
      for (const { node, parent } of entries) removeNodeChild(parent, node);
      clearSelection(editor.selection);
    },
    undo() {
      for (const { index, node, parent } of restoreOrder) addNodeChildAt(parent, node, index);
      setSelection(editor.selection, selection);
    },
  };
}
