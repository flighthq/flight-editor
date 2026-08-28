import type { EditorState } from './editorState';

import { getSelectionCount, getSelectedNodes } from '@flighthq/editor-selection';
import { setSelectionInfo } from '@flighthq/editor-status';

export function syncSelectionToStatusBar(editor: EditorState): void {
  const count = getSelectionCount(editor.selection);
  const label = formatSelectionLabel(count);
  setSelectionInfo(editor.statusBar, count, label);
}

export function formatSelectionLabel(count: number): string {
  if (count === 0) return 'No selection';
  if (count === 1) return '1 object selected';
  return `${count} objects selected`;
}

export function getSelectionSummary(editor: Readonly<EditorState>): {
  count: number;
  label: string;
  names: readonly (string | null)[];
} {
  const nodes = getSelectedNodes(editor.selection);
  const count = nodes.length;
  return {
    count,
    label: formatSelectionLabel(count),
    names: nodes.map((node) => node.name),
  };
}
