import { getSelectedNodes, getSelectionCount, getPrimarySelection } from '@flighthq/editor-selection';
import { getNodeTransform2D } from '@flighthq/node';

import type { ExportSlice } from '@flighthq/editor-export-settings';
import type { Page } from '@flighthq/editor-page';
import type { TextStyleState } from '@flighthq/editor-text-style';
import type { TransformOriginMode } from '@flighthq/editor-transform-origin';
import type { ZoomPreset } from '@flighthq/editor-zoom-presets';
import type { Node2D, NodeAny, Transform2DLike } from '@flighthq/types';
import type { EditorState } from './editorState';

import { getExportSlice } from '@flighthq/editor-export-settings';
import { getActivePage } from '@flighthq/editor-page';
import { getTransformOriginMode } from '@flighthq/editor-transform-origin';
import { findNearestPreset } from '@flighthq/editor-zoom-presets';
import { BitmapTextKind, NativeTextKind, RichTextKind, TextLabelKind } from '@flighthq/types';

export interface InspectorSnapshot {
  readonly count: number;
  readonly name: string | null;
  readonly transform: Transform2DLike | null;
  readonly node: NodeAny | null;
  readonly textStyle: Readonly<TextStyleState> | null;
  readonly transformOriginMode: TransformOriginMode;
  readonly exportSlices: readonly ExportSlice[];
  readonly activePage: Page | null;
  readonly zoom: number;
  readonly zoomPreset: ZoomPreset | null;
}

function readTransform(node: Node2D): Transform2DLike {
  const t = { pivotX: 0, pivotY: 0, rotation: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
  getNodeTransform2D(t, node);
  return t;
}

export function getInspectorSnapshot(editor: Readonly<EditorState>): InspectorSnapshot {
  const count = getSelectionCount(editor.selection);
  const nodes = getSelectedNodes(editor.selection);
  const textStyle = nodes.some(isTextNode) ? { ...editor.textStyle } : null;
  const exportSlices = nodes.flatMap((node) => {
    if (node.name === null) return [];
    const slice = getExportSlice(editor.exportSettings, node.name);
    return slice === undefined ? [] : [slice];
  });
  const zoomPreset = findNearestPreset(editor.zoomPresets, editor.viewport.camera.zoom);
  const extended = {
    textStyle,
    transformOriginMode: getTransformOriginMode(editor.transformOrigin),
    exportSlices,
    activePage: getActivePage(editor.pages),
    zoom: editor.viewport.camera.zoom,
    zoomPreset: zoomPreset === null ? null : { ...zoomPreset },
  };

  if (count === 0) {
    return { count: 0, name: null, transform: null, node: null, ...extended };
  }

  const primary = getPrimarySelection(editor.selection) as Node2D | null;

  if (primary === null) {
    return { count, name: null, transform: null, node: null, ...extended };
  }

  return {
    count,
    name: primary.name ?? null,
    transform: readTransform(primary),
    node: primary,
    ...extended,
  };
}

export function getInspectorSelectedNames(editor: Readonly<EditorState>): readonly string[] {
  return getSelectedNodes(editor.selection).map((node) => (node as Node2D).name ?? '');
}

function isTextNode(node: Readonly<NodeAny>): boolean {
  return (
    node.kind === NativeTextKind ||
    node.kind === TextLabelKind ||
    node.kind === RichTextKind ||
    node.kind === BitmapTextKind
  );
}
