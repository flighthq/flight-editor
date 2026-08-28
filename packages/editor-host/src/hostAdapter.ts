export interface FileDialogResult {
  readonly path: string;
  readonly name: string;
}

export interface HostCapabilities {
  readonly hasFileSystem: boolean;
  readonly hasClipboard: boolean;
  readonly hasNativeMenus: boolean;
  readonly hasNativeDialogs: boolean;
  readonly hasDragDrop: boolean;
}

export interface HostCallbacks {
  onDirtyChange?: (dirty: boolean) => void;
  onTitleChange?: (title: string) => void;
  onSelectionChange?: (count: number) => void;
  onToolChange?: (toolId: string) => void;
  onZoomChange?: (zoom: number) => void;
}

export interface HostAdapter {
  readonly capabilities: HostCapabilities;
  showOpenDialog(): Promise<FileDialogResult | null>;
  showSaveDialog(defaultName: string): Promise<FileDialogResult | null>;
  readFile(path: string): Promise<ArrayBuffer>;
  writeFile(path: string, data: ArrayBuffer): Promise<void>;
  readClipboardText(): Promise<string>;
  writeClipboardText(text: string): Promise<void>;
  setWindowTitle(title: string): void;
  showMessage(text: string, severity: 'info' | 'warning' | 'error'): void;
}

export function createHeadlessCapabilities(): HostCapabilities {
  return {
    hasFileSystem: false,
    hasClipboard: false,
    hasNativeMenus: false,
    hasNativeDialogs: false,
    hasDragDrop: false,
  };
}

export function createDesktopCapabilities(): HostCapabilities {
  return {
    hasFileSystem: true,
    hasClipboard: true,
    hasNativeMenus: true,
    hasNativeDialogs: true,
    hasDragDrop: true,
  };
}

export function createHeadlessAdapter(): HostAdapter {
  return {
    capabilities: createHeadlessCapabilities(),
    showOpenDialog: () => Promise.resolve(null),
    showSaveDialog: () => Promise.resolve(null),
    readFile: () => Promise.reject(new Error('File system not available in headless mode')),
    writeFile: () => Promise.reject(new Error('File system not available in headless mode')),
    readClipboardText: () => Promise.resolve(''),
    writeClipboardText: () => Promise.resolve(),
    setWindowTitle: () => {},
    showMessage: () => {},
  };
}

export interface HostAdapterState {
  adapter: HostAdapter;
  callbacks: HostCallbacks;
  version: number;
}

export function createHostAdapterState(adapter?: HostAdapter): HostAdapterState {
  return {
    adapter: adapter ?? createHeadlessAdapter(),
    callbacks: {},
    version: 0,
  };
}

export function getHostAdapter(state: Readonly<HostAdapterState>): HostAdapter {
  return state.adapter;
}

export function setHostAdapter(state: HostAdapterState, adapter: HostAdapter): void {
  state.adapter = adapter;
  state.version++;
}

export function getHostCapabilities(state: Readonly<HostAdapterState>): HostCapabilities {
  return state.adapter.capabilities;
}

export function getHostCallbacks(state: Readonly<HostAdapterState>): HostCallbacks {
  return state.callbacks;
}

export function setHostCallbacks(state: HostAdapterState, callbacks: HostCallbacks): void {
  state.callbacks = callbacks;
  state.version++;
}

export function hasCapability(state: Readonly<HostAdapterState>, capability: keyof HostCapabilities): boolean {
  return state.adapter.capabilities[capability];
}

export function getHostAdapterVersion(state: Readonly<HostAdapterState>): number {
  return state.version;
}
