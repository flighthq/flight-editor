import type { HostAdapter, HostCallbacks } from '@flighthq/editor-host';

import type { EditorState } from './editorState';
import type { EditorLoopState } from './editorLoop';
import type { DefaultToolsOptions } from './registerDefaultTools';
import type { SessionCallbacks, ConfirmResult } from './sessionController';
import type { SaveResult } from './fileOperations';

import { setHostCallbacks } from '@flighthq/editor-host';

import { createEditorLoopState, tickEditor } from './editorLoop';
import { initEditor } from './initEditor';
import { registerDefaultContextMenuItems } from './contextMenuManager';
import { createNewScene } from './sceneManager';
import { updateWindowTitle } from './windowTitle';
import { fitToScene, resizeViewport } from './viewportOps';
import {
  closeDocument,
  isDocumentModified,
  newDocument,
  openDocument,
  saveDocument,
  saveDocumentAs,
} from './sessionController';

export interface DesktopEditor {
  readonly state: EditorState;
  readonly loop: EditorLoopState;
  tick(): void;
  newFile(width?: number, height?: number, name?: string): Promise<boolean>;
  open(): Promise<{ opened: boolean; path: string | null }>;
  save(): Promise<SaveResult>;
  saveAs(defaultName?: string): Promise<SaveResult>;
  close(): void;
  resize(width: number, height: number): void;
  updateTitle(): void;
  dispose(): void;
}

export interface DesktopEditorOptions {
  readonly hostAdapter: HostAdapter;
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
  readonly tools?: Readonly<DefaultToolsOptions>;
  readonly autoCreateScene?: boolean;
  readonly sceneWidth?: number;
  readonly sceneHeight?: number;
  readonly sceneName?: string;
  readonly appName?: string;
  readonly callbacks?: HostCallbacks;
  readonly confirmDiscard?: () => Promise<ConfirmResult>;
  readonly serialize?: () => ArrayBuffer;
  readonly deserialize?: (data: ArrayBuffer) => void;
}

export function createDesktopEditor(options: Readonly<DesktopEditorOptions>): DesktopEditor {
  const {
    viewportWidth = 1280,
    viewportHeight = 720,
    autoCreateScene = true,
    sceneWidth = 800,
    sceneHeight = 600,
    sceneName = 'Untitled',
    appName = 'Flight Editor',
  } = options;

  const state = initEditor({
    viewportWidth,
    viewportHeight,
    hostAdapter: options.hostAdapter,
    tools: options.tools,
  });

  if (options.callbacks) {
    setHostCallbacks(state.host, options.callbacks);
  }

  registerDefaultContextMenuItems(state);

  if (autoCreateScene) {
    createNewScene(state, sceneWidth, sceneHeight, sceneName);
    fitToScene(state);
  }

  const loop = createEditorLoopState(state, { appName });

  const sessionCallbacks: SessionCallbacks = {
    confirmDiscard: options.confirmDiscard ?? (() => Promise.resolve('discard' as ConfirmResult)),
    serialize: options.serialize ?? (() => new ArrayBuffer(0)),
    deserialize: options.deserialize ?? (() => {}),
  };

  return {
    state,
    loop,
    tick() {
      tickEditor(state, loop);
    },
    async newFile(width?: number, height?: number, name?: string) {
      return newDocument(state, sessionCallbacks, width, height, name);
    },
    async open() {
      return openDocument(state, sessionCallbacks);
    },
    async save() {
      return saveDocument(state, sessionCallbacks.serialize);
    },
    async saveAs(defaultName?: string) {
      return saveDocumentAs(state, sessionCallbacks.serialize, defaultName);
    },
    close() {
      closeDocument(state);
    },
    resize(width: number, height: number) {
      resizeViewport(state, width, height);
    },
    updateTitle() {
      updateWindowTitle(state, { appName });
    },
    dispose() {
      state.scene = null;
    },
  };
}

export function isDesktopEditorModified(editor: DesktopEditor): boolean {
  return isDocumentModified(editor.state);
}
