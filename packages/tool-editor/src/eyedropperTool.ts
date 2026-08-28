import type { EditorPointerEvent } from '@flighthq/editor-tool';
import type { EditorState } from './editorState';

import { deactivateTool } from '@flighthq/editor-tool';

export type ColorAtPoint = (x: number, y: number) => number | null;
export type ColorPickCallback = (color: number) => void;

export interface EyedropperToolOptions {
  readonly previewOnMove?: boolean;
  readonly deactivateOnPick?: boolean;
}

export interface EyedropperTool {
  readonly id: string;
  activate(): void;
  deactivate(): void;
  pointerDown(event: Readonly<EditorPointerEvent>): void;
  pointerMove(event: Readonly<EditorPointerEvent>): void;
  pointerUp(event: Readonly<EditorPointerEvent>): void;
}

export function createEyedropperTool(
  editor: EditorState,
  colorAtPoint: ColorAtPoint,
  onColorPick: ColorPickCallback,
  options: Readonly<EyedropperToolOptions> = {},
): EyedropperTool {
  let pressed = false;
  const previewOnMove = options.previewOnMove ?? false;
  const deactivateOnPick = options.deactivateOnPick ?? true;

  function pick(x: number, y: number): void {
    const color = colorAtPoint(x, y);
    if (color !== null) onColorPick(color);
  }

  return {
    id: 'eyedropper',

    activate() {},

    deactivate() {
      pressed = false;
    },

    pointerDown(event: Readonly<EditorPointerEvent>) {
      pressed = true;
      pick(event.x, event.y);
    },

    pointerMove(event: Readonly<EditorPointerEvent>) {
      if (previewOnMove) pick(event.x, event.y);
    },

    pointerUp() {
      if (!pressed) return;
      pressed = false;
      if (deactivateOnPick) deactivateTool(editor.toolRegistry);
    },
  };
}
