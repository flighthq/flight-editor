import type { HostAdapter } from '@flighthq/editor-host';
import type { EditorState } from './editorState';
import type { EditorLoopState } from './editorLoop';
import type { DefaultToolsOptions } from './registerDefaultTools';

import { createEditorLoopState, tickEditor } from './editorLoop';
import { initEditor } from './initEditor';
import { registerDefaultContextMenuItems } from './contextMenuManager';
import { createNewScene } from './sceneManager';

export interface HeadlessEditor {
  readonly state: EditorState;
  readonly loop: EditorLoopState;
  tick(): void;
  dispose(): void;
}

export interface HeadlessEditorOptions {
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
  readonly hostAdapter?: HostAdapter;
  readonly tools?: Readonly<DefaultToolsOptions>;
  readonly autoCreateScene?: boolean;
  readonly sceneWidth?: number;
  readonly sceneHeight?: number;
  readonly sceneName?: string;
}

export function createHeadlessEditor(options: HeadlessEditorOptions = {}): HeadlessEditor {
  const {
    viewportWidth = 800,
    viewportHeight = 600,
    autoCreateScene = true,
    sceneWidth = 800,
    sceneHeight = 600,
    sceneName = 'Untitled',
  } = options;

  const state = initEditor({
    viewportWidth,
    viewportHeight,
    hostAdapter: options.hostAdapter,
    tools: options.tools,
  });

  registerDefaultContextMenuItems(state);

  if (autoCreateScene) {
    createNewScene(state, sceneWidth, sceneHeight, sceneName);
  }

  const loop = createEditorLoopState(state);

  return {
    state,
    loop,
    tick() {
      tickEditor(state, loop);
    },
    dispose() {
      state.scene = null;
    },
  };
}

export function isHeadlessEditorReady(editor: HeadlessEditor): boolean {
  return editor.state.scene !== null;
}
