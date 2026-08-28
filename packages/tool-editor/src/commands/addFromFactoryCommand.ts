import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';
import type { NodeAny } from '@flighthq/types';

import { createNodeFromKind, getNodeKindEntry } from '@flighthq/editor-node-factory';

import { createAddNodeCommand } from './addNodeCommand';

export function createAddFromFactoryCommand(editor: EditorState, kindId: string, parent: NodeAny): Command | null {
  const entry = getNodeKindEntry(editor.nodeFactory, kindId);
  const node = createNodeFromKind(editor.nodeFactory, kindId);
  if (entry === undefined || node === null) return null;

  const addCommand = createAddNodeCommand(parent, node);
  return {
    label: `Add ${entry.label}`,
    execute() {
      addCommand.execute();
    },
    undo() {
      addCommand.undo();
    },
  };
}
