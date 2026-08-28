import type { EditorState } from './editorState';
import type { ExportFormat, ExportSlice } from '@flighthq/editor-export-settings';

import {
  addExportSlice,
  clearExportSettings,
  getEnabledExportSlices,
  getExportSlice,
  getExportSlices,
  removeExportSlice,
  setExportEnabled,
  setExportFormat,
  setExportScale,
  setExportSuffix,
} from '@flighthq/editor-export-settings';
import { getSelectedNodes } from '@flighthq/editor-selection';

export function addExportForNode(
  editor: EditorState,
  nodeId: string,
  format: ExportFormat = 'png',
  scale = 1,
  suffix = '',
): void {
  addExportSlice(editor.exportSettings, { nodeId, format, scale, suffix, enabled: true });
}

export function addExportForSelection(editor: EditorState, format: ExportFormat = 'png', scale = 1): number {
  const nodes = getSelectedNodes(editor.selection);
  for (const node of nodes) {
    addExportSlice(editor.exportSettings, {
      nodeId: node.kind + '-' + nodes.indexOf(node),
      format,
      scale,
      suffix: '',
      enabled: true,
    });
  }
  return nodes.length;
}

export function removeExportForNode(editor: EditorState, nodeId: string): boolean {
  return removeExportSlice(editor.exportSettings, nodeId);
}

export function getExportForNode(editor: Readonly<EditorState>, nodeId: string): ExportSlice | undefined {
  return getExportSlice(editor.exportSettings, nodeId);
}

export function getAllExports(editor: Readonly<EditorState>): readonly ExportSlice[] {
  return getExportSlices(editor.exportSettings);
}

export function getEnabledExports(editor: Readonly<EditorState>): readonly ExportSlice[] {
  return getEnabledExportSlices(editor.exportSettings);
}

export function setExportNodeFormat(editor: EditorState, nodeId: string, format: ExportFormat): boolean {
  return setExportFormat(editor.exportSettings, nodeId, format);
}

export function setExportNodeScale(editor: EditorState, nodeId: string, scale: number): boolean {
  return setExportScale(editor.exportSettings, nodeId, scale);
}

export function setExportNodeSuffix(editor: EditorState, nodeId: string, suffix: string): boolean {
  return setExportSuffix(editor.exportSettings, nodeId, suffix);
}

export function setExportNodeEnabled(editor: EditorState, nodeId: string, enabled: boolean): boolean {
  return setExportEnabled(editor.exportSettings, nodeId, enabled);
}

export function clearAllExports(editor: EditorState): void {
  clearExportSettings(editor.exportSettings);
}

export function getExportCount(editor: Readonly<EditorState>): number {
  return getExportSlices(editor.exportSettings).length;
}

export function getEnabledExportCount(editor: Readonly<EditorState>): number {
  return getEnabledExportSlices(editor.exportSettings).length;
}
