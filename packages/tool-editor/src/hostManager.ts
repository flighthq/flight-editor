import type { HostAdapter, HostCallbacks, HostCapabilities } from '@flighthq/editor-host';
import type { EditorState } from './editorState';

import {
  getHostAdapter,
  getHostAdapterVersion,
  getHostCallbacks,
  getHostCapabilities,
  hasCapability,
  setHostAdapter,
  setHostCallbacks,
} from '@flighthq/editor-host';

export function getEditorHostAdapter(editor: Readonly<EditorState>): HostAdapter {
  return getHostAdapter(editor.host);
}

export function setEditorHostAdapter(editor: EditorState, adapter: HostAdapter): void {
  setHostAdapter(editor.host, adapter);
}

export function getEditorHostCapabilities(editor: Readonly<EditorState>): HostCapabilities {
  return getHostCapabilities(editor.host);
}

export function hasEditorCapability(editor: Readonly<EditorState>, capability: keyof HostCapabilities): boolean {
  return hasCapability(editor.host, capability);
}

export function getEditorHostCallbacks(editor: Readonly<EditorState>): HostCallbacks {
  return getHostCallbacks(editor.host);
}

export function setEditorHostCallbacks(editor: EditorState, callbacks: HostCallbacks): void {
  setHostCallbacks(editor.host, callbacks);
}

export function getEditorHostAdapterVersion(editor: Readonly<EditorState>): number {
  return getHostAdapterVersion(editor.host);
}
