declare module 'vscode' {
  export interface Disposable {
    dispose(): unknown;
  }
  export interface Uri {
    readonly fsPath: string;
    toString(): string;
  }
  export namespace Uri {
    function joinPath(base: Uri, ...pathSegments: string[]): Uri;
  }
  export interface Position {
    readonly line: number;
    readonly character: number;
  }
  export class Range {
    constructor(start: Position, end: Position);
  }
  export class WorkspaceEdit {
    replace(uri: Uri, range: Range, newText: string): void;
  }
  export interface TextDocument {
    readonly uri: Uri;
    readonly version: number;
    readonly languageId: string;
    getText(): string;
    positionAt(offset: number): Position;
  }
  export interface TextDocumentChangeEvent {
    readonly document: TextDocument;
  }
  export interface Webview {
    html: string;
    options: { enableScripts?: boolean; localResourceRoots?: readonly Uri[] };
    readonly cspSource: string;
    asWebviewUri(localResource: Uri): Uri;
    postMessage(message: unknown): Thenable<boolean>;
    onDidReceiveMessage(listener: (message: unknown) => unknown): Disposable;
  }
  export interface WebviewPanel {
    readonly webview: Webview;
    onDidDispose(listener: () => unknown): Disposable;
  }
  export interface CustomTextEditorProvider {
    resolveCustomTextEditor(document: TextDocument, panel: WebviewPanel): Promise<void>;
  }
  export interface ExtensionContext {
    readonly subscriptions: Disposable[];
    readonly extensionUri: Uri;
  }
  export interface TextEditor {
    readonly document: TextDocument;
  }
  export const window: {
    readonly activeTextEditor: TextEditor | undefined;
    registerCustomEditorProvider(viewType: string, provider: CustomTextEditorProvider, options: unknown): Disposable;
    showTextDocument(document: TextDocument, options?: unknown): Thenable<TextEditor>;
    showErrorMessage(message: string): Thenable<string | undefined>;
    showInformationMessage(message: string): Thenable<string | undefined>;
  };
  export const workspace: {
    onDidChangeTextDocument(listener: (event: TextDocumentChangeEvent) => unknown): Disposable;
    openTextDocument(uri: Uri): Thenable<TextDocument>;
    applyEdit(edit: WorkspaceEdit): Thenable<boolean>;
  };
  export const commands: {
    registerCommand(command: string, callback: (...args: unknown[]) => unknown): Disposable;
    executeCommand<T>(command: string, ...args: unknown[]): Thenable<T>;
  };
  export const ViewColumn: { readonly Active: number };
}
