import type { DocumentSnapshot, UpdateNodeMessage } from './protocol';
import type { EditorRuntime } from '@flighthq/tool-editor';

import * as vscode from 'vscode';
import { createEditorRuntime } from '@flighthq/tool-editor';

import { isWebviewMessage } from './protocol';

const viewType = 'flight.visualEditor';

function documentMessage(runtime: EditorRuntime, document: vscode.TextDocument): DocumentSnapshot {
  const text = document.getText();
  try {
    runtime.load(encodeText(text));
    return { type: 'document', text: decodeData(runtime.serialize()), version: document.version };
  } catch {
    return { type: 'document', text, version: document.version };
  }
}

function webviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'editor.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'editor.css'));
  const nonce = Math.random().toString(36).slice(2);
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'">
<link rel="stylesheet" href="${styleUri}"><title>Flight Visual Editor</title></head>
<body><header><strong>Flight</strong><span id="status" role="status">Loading…</span><span class="spacer"></span>
<button id="fit" title="Fit scene to viewport">Fit</button><button id="source">Open Source</button></header>
<main><aside class="hierarchy"><h2>Hierarchy</h2><div id="tree" role="tree"></div></aside>
<section class="viewport"><canvas id="canvas" tabindex="0" aria-label="Flight scene viewport"></canvas><div id="empty"></div></section>
<aside class="inspector"><h2>Inspector</h2><form id="inspector"><p>Select a node to inspect it.</p></form></aside></main>
<script nonce="${nonce}" src="${scriptUri}"></script></body></html>`;
}

class FlightEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel): Promise<void> {
    const runtime = createEditorRuntime({ autoCreateScene: false });
    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
    };
    panel.webview.html = webviewHtml(panel.webview, this.extensionUri);

    const sendDocument = (current: vscode.TextDocument): void => {
      void panel.webview.postMessage(documentMessage(runtime, current));
    };
    const changes = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) sendDocument(event.document);
    });
    const messages = panel.webview.onDidReceiveMessage(async (value: unknown) => {
      if (!isWebviewMessage(value)) return;
      if (value.type === 'ready') sendDocument(document);
      if (value.type === 'openSource') await openSource(document.uri);
      if (value.type === 'selectNode') runtime.selectNode(value.path);
      if (value.type === 'updateNode') await this.applyNodeUpdate(runtime, document, value, panel.webview);
    });
    panel.onDidDispose(() => {
      changes.dispose();
      messages.dispose();
      runtime.dispose();
    });
  }

  private async applyNodeUpdate(
    runtime: EditorRuntime,
    document: vscode.TextDocument,
    message: UpdateNodeMessage,
    webview: vscode.Webview,
  ): Promise<void> {
    if (document.version !== message.baseVersion) {
      await webview.postMessage({ type: 'rejected', reason: 'The file changed. Your view has been refreshed.' });
      await webview.postMessage(documentMessage(runtime, document));
      return;
    }
    try {
      runtime.load(encodeText(document.getText()));
    } catch {
      await webview.postMessage({ type: 'rejected', reason: 'The Flight document is invalid.' });
      return;
    }
    if (!runtime.updateNode(message.path, message.property, message.value)) {
      await webview.postMessage({ type: 'rejected', reason: 'The shared editor rejected this edit.' });
      return;
    }
    const updatedText = `${decodeData(runtime.serialize())}\n`;
    const range = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, updatedText);
    if (!(await vscode.workspace.applyEdit(edit))) {
      await webview.postMessage({ type: 'rejected', reason: 'VS Code rejected the document edit.' });
    }
  }
}

function activeFlightUri(candidate?: unknown): vscode.Uri | undefined {
  if (candidate && typeof candidate === 'object' && 'toString' in candidate) return candidate as vscode.Uri;
  return vscode.window.activeTextEditor?.document.uri;
}

async function openSource(candidate?: unknown): Promise<void> {
  const uri = activeFlightUri(candidate);
  if (!uri) return;
  const document = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(document, { preview: false });
}

async function openVisual(candidate?: unknown): Promise<void> {
  const uri = activeFlightUri(candidate);
  if (uri) await vscode.commands.executeCommand('vscode.openWith', uri, viewType, vscode.ViewColumn.Active);
}

async function validateActiveDocument(): Promise<void> {
  const document = vscode.window.activeTextEditor?.document;
  if (!document || document.languageId !== 'flight') return;
  const runtime = createEditorRuntime({ autoCreateScene: false });
  try {
    runtime.load(encodeText(document.getText()));
    await vscode.window.showInformationMessage('Flight scene is valid.');
  } catch {
    await vscode.window.showErrorMessage('Flight: Invalid or unsupported scene document.');
  } finally {
    runtime.dispose();
  }
}

function encodeText(text: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(text);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function decodeData(data: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(data));
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(viewType, new FlightEditorProvider(context.extensionUri), {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: true,
    }),
    vscode.commands.registerCommand('flight.openSource', openSource),
    vscode.commands.registerCommand('flight.openVisual', openVisual),
    vscode.commands.registerCommand('flight.validate', validateActiveDocument),
  );
}

export function deactivate(): void {}
