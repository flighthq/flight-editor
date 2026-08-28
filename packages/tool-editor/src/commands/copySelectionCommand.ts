import type { ClipboardOperation } from '@flighthq/editor-clipboard';
import type { Command } from '@flighthq/editor-command';
import type { EditorState } from '@flighthq/tool-editor';

import { clearClipboard, setClipboardEntries } from '@flighthq/editor-clipboard';
import { getSelectedNodes } from '@flighthq/editor-selection';

export function createCopySelectionCommand(editor: EditorState, operation: ClipboardOperation): Command {
  return {
    label: operation === 'copy' ? 'Copy' : 'Cut',
    execute() {
      setClipboardEntries(editor.clipboard, getSelectedNodes(editor.selection), operation);
    },
    undo() {
      clearClipboard(editor.clipboard);
    },
  };
}
