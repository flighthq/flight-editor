import type { EditorTool } from '@flighthq/editor-tool';
import type { ColorAtPoint, ColorPickCallback, EyedropperToolOptions } from './eyedropperTool';
import type { LineToolOptions } from './lineTool';
import type { MarqueeHitTestFn } from './marqueeTool';
import type { MeasureResult } from './measureTool';
import type { HandleHitTestFn, PointerHitTestFn, RotationHitTestFn } from './pointerTool';
import type { RectangleToolOptions } from './rectangleTool';
import type { RotateToolConfig } from './rotateTool';
import type { EditorState } from './editorState';

import { registerTool } from '@flighthq/editor-tool';

import { createEyedropperTool } from './eyedropperTool';
import { createHandTool } from './handTool';
import { createLineTool } from './lineTool';
import { createMarqueeTool } from './marqueeTool';
import { createMeasureTool } from './measureTool';
import { createMoveTool } from './moveTool';
import { createPointerTool } from './pointerTool';
import { createRectangleTool } from './rectangleTool';
import { createRotateTool } from './rotateTool';
import { createScaleTool } from './scaleTool';
import { createSelectTool } from './selectTool';
import { createZoomTool } from './zoomTool';

export interface DefaultToolsOptions {
  readonly hitTest?: PointerHitTestFn;
  readonly handleHitTest?: HandleHitTestFn;
  readonly rotationHitTest?: RotationHitTestFn;
  readonly marqueeHitTest?: MarqueeHitTestFn;
  readonly rotate?: RotateToolConfig;
  readonly colorAtPoint?: ColorAtPoint;
  readonly onColorPick?: ColorPickCallback;
  readonly eyedropper?: Readonly<EyedropperToolOptions>;
  readonly onMeasure?: (result: MeasureResult | null) => void;
  readonly line?: Readonly<LineToolOptions>;
  readonly rectangle?: Readonly<RectangleToolOptions>;
}

export function registerDefaultTools(editor: EditorState, options: Readonly<DefaultToolsOptions> = {}): void {
  const hitTest = options.hitTest ?? (() => null);
  const handleHitTest = options.handleHitTest ?? (() => null);
  const rotationHitTest = options.rotationHitTest ?? (() => null);
  const marqueeHitTest = options.marqueeHitTest ?? (() => []);
  const rotate = options.rotate ?? {
    centerX: editor.viewport.camera.viewportWidth / 2,
    centerY: editor.viewport.camera.viewportHeight / 2,
  };

  const tools: EditorTool[] = [
    createSelectTool(editor, hitTest),
    createMoveTool(editor),
    createScaleTool(editor),
    createRotateTool(editor, rotate),
    createPointerTool(editor, hitTest, handleHitTest, rotationHitTest),
    createHandTool(editor),
    createZoomTool(editor),
    createMarqueeTool(editor, marqueeHitTest),
    createEyedropperTool(
      editor,
      options.colorAtPoint ?? (() => null),
      options.onColorPick ?? (() => {}),
      options.eyedropper,
    ),
    createMeasureTool(editor, options.onMeasure ?? (() => {})),
    createLineTool(editor, options.line),
    createRectangleTool(editor, options.rectangle),
  ];

  for (const tool of tools) registerTool(editor.toolRegistry, tool);
}
