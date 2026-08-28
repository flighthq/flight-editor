declare module 'vscode' {
  export interface Disposable {
    dispose(): unknown;
  }
  export interface Uri {
    readonly fsPath: string;
    toString(): string;
  }
  export interface TextDocument {
    readonly uri: Uri;
    readonly version: number;
    getText(): string;
  }
  export interface TextDocumentChangeEvent {
    readonly document: TextDocument;
  }
  export interface Webview {
    html: string;
    readonly cspSource: string;
    postMessage(message: unknown): Thenable<boolean>;
    onDidReceiveMessage(listener: (message: unknown) => unknown): Disposable;
  }
  export interface WebviewPanel {
    readonly webview: Webview;
    readonly active: boolean;
    onDidDispose(listener: () => unknown): Disposable;
  }
  export interface CustomTextEditorProvider {
    resolveCustomTextEditor(document: TextDocument, panel: WebviewPanel): Promise<void>;
  }
  export interface ExtensionContext {
    readonly subscriptions: Disposable[];
  }
  export interface TextEditor {
    readonly document: TextDocument;
  }
  export const window: {
    readonly activeTextEditor: TextEditor | undefined;
    registerCustomEditorProvider(viewType: string, provider: CustomTextEditorProvider, options: unknown): Disposable;
    showTextDocument(document: TextDocument, options?: unknown): Thenable<TextEditor>;
  };
  export const workspace: {
    onDidChangeTextDocument(listener: (event: TextDocumentChangeEvent) => unknown): Disposable;
    openTextDocument(uri: Uri): Thenable<TextDocument>;
  };
  export const commands: {
    registerCommand(command: string, callback: (...args: unknown[]) => unknown): Disposable;
    executeCommand<T>(command: string, ...args: unknown[]): Thenable<T>;
  };
  export const ViewColumn: { readonly Active: number };
}
