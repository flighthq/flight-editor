import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';
import type { NodeAny } from '@flighthq/types';

import { getClipboardEntries } from '@flighthq/editor-clipboard';

import { createAddNodeCommand } from './addNodeCommand';

export function createPasteNodesCommand(editor: EditorState, parent: NodeAny): Command {
  const commands = getClipboardEntries(editor.clipboard).map((entry) => createAddNodeCommand(parent, entry));

  return {
    label: 'Paste',
    execute() {
      for (const command of commands) command.execute();
    },
    undo() {
      for (let index = commands.length - 1; index >= 0; index--) commands[index].undo();
    },
  };
}
