import type { HostAdapter } from '@flighthq/editor-host';

import type { DefaultToolsOptions } from './registerDefaultTools';

import { setHostAdapter } from '@flighthq/editor-host';

import { registerDefaultCommands } from './commandRegistry';
import { registerDefaultMenus } from './defaultMenus';
import { registerDefaultShortcuts } from './defaultShortcuts';
import { createEditorState } from './editorState';
import { registerDefaultNodeKinds } from './factoryPresets';
import { registerDefaultTools } from './registerDefaultTools';

import type { EditorState } from './editorState';

export interface InitEditorOptions {
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
  readonly hostAdapter?: HostAdapter;
  readonly tools?: Readonly<DefaultToolsOptions>;
  readonly skipDefaults?: boolean;
}

export function initEditor(options: Readonly<InitEditorOptions> = {}): EditorState {
  const width = options.viewportWidth ?? 800;
  const height = options.viewportHeight ?? 600;
  const editor = createEditorState(width, height);

  if (options.hostAdapter) {
    setHostAdapter(editor.host, options.hostAdapter);
  }

  if (!options.skipDefaults) {
    registerDefaultCommands(editor);
    registerDefaultShortcuts(editor.keyboard);
    registerDefaultMenus(editor.menuBar);
    registerDefaultNodeKinds(editor.nodeFactory);
    registerDefaultTools(editor, options.tools);
  }

  return editor;
}

export function getRegisteredCommandCount(editor: Readonly<EditorState>): number {
  return editor.commandRegistry.size;
}

export function getRegisteredMenuCount(editor: Readonly<EditorState>): number {
  return editor.menuBar.menus.length;
}

export function getRegisteredShortcutCount(editor: Readonly<EditorState>): number {
  return editor.keyboard.bindings.size;
}
