import { clearSelection, isSelected, setSelection, toggleSelection } from '@flighthq/editor-selection';

import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { NodeAny } from '@flighthq/types';
import type { EditorState } from './editorState';

export type HitTestFn = (x: number, y: number) => NodeAny | null;

export interface SelectTool {
  readonly id: string;
  hitTest: HitTestFn;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export function createSelectTool(editor: EditorState, hitTest: HitTestFn): SelectTool {
  return {
    id: 'select',
    hitTest,

    activate() {},

    deactivate() {},

    pointerDown(event: Readonly<EditorPointerEvent>) {
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
    },

    pointerMove() {},

    pointerUp() {},
  };
}
