import * as vscode from 'vscode';

const viewType = 'flight.visualEditor';

interface WebviewMessage {
  readonly type?: unknown;
}

function documentMessage(document: vscode.TextDocument): object {
  return { type: 'document', text: document.getText(), version: document.version };
}

function webviewHtml(webview: vscode.Webview): string {
  const nonce = Math.random().toString(36).slice(2);
  return `<!doctype html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'">
<style>
body{padding:0;margin:0;color:var(--vscode-foreground);background:var(--vscode-editor-background);font:var(--vscode-font-size) var(--vscode-font-family)}
header{height:34px;display:flex;align-items:center;gap:8px;padding:0 10px;border-bottom:1px solid var(--vscode-panel-border)}
button{color:var(--vscode-button-foreground);background:var(--vscode-button-background);border:0;padding:4px 10px;cursor:pointer}
main{display:grid;grid-template-columns:240px 1fr;height:calc(100vh - 35px)}
aside{border-right:1px solid var(--vscode-panel-border);overflow:auto;padding:8px} canvas{width:100%;height:100%;display:block}
.node{padding:3px 5px;white-space:nowrap;cursor:pointer}.node:hover{background:var(--vscode-list-hoverBackground)}
.error{color:var(--vscode-errorForeground);padding:12px}
</style></head><body><header><strong>Flight</strong><span id="status">Loading…</span><button id="source">Open Source</button></header>
<main><aside id="tree"></aside><canvas id="canvas"></canvas></main>
<script nonce="${nonce}">
const vscode=acquireVsCodeApi(),tree=document.getElementById('tree'),status=document.getElementById('status'),canvas=document.getElementById('canvas');
document.getElementById('source').onclick=()=>vscode.postMessage({type:'openSource'});
function label(node){return node.name||node.id||node.type||node.kind||'Node'}
function children(node){return Array.isArray(node?.children)?node.children:Array.isArray(node?.nodes)?node.nodes:[]}
function row(node,depth){const el=document.createElement('div');el.className='node';el.style.paddingLeft=(5+depth*14)+'px';el.textContent=label(node);tree.appendChild(el);for(const child of children(node))row(child,depth+1)}
function render(text,version){tree.textContent='';const ctx=canvas.getContext('2d');canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=canvas.clientHeight*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio);ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
try{const scene=JSON.parse(text);row(scene,0);status.textContent='Synced · revision '+version;ctx.fillStyle=getComputedStyle(document.body).color;ctx.globalAlpha=.55;ctx.font='14px '+getComputedStyle(document.body).fontFamily;ctx.fillText(scene.name||'Flight scene',24,36)}catch(error){tree.innerHTML='<div class="error"></div>';tree.firstChild.textContent=error instanceof Error?error.message:String(error);status.textContent='Invalid source'}}
window.addEventListener('message',event=>{if(event.data?.type==='document')render(event.data.text,event.data.version)});vscode.postMessage({type:'ready'});
</script></body></html>`;
}

class FlightEditorProvider implements vscode.CustomTextEditorProvider {
  async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel): Promise<void> {
    panel.webview.html = webviewHtml(panel.webview);
    const changes = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString())
        void panel.webview.postMessage(documentMessage(event.document));
    });
    const messages = panel.webview.onDidReceiveMessage((value: unknown) => {
      const message = value as WebviewMessage;
      if (message.type === 'ready') void panel.webview.postMessage(documentMessage(document));
      if (message.type === 'openSource') void openSource(document.uri);
    });
    panel.onDidDispose(() => {
      changes.dispose();
      messages.dispose();
    });
  }
}

async function activeFlightUri(candidate?: unknown): Promise<vscode.Uri | undefined> {
  if (candidate && typeof candidate === 'object' && 'toString' in candidate) return candidate as vscode.Uri;
  return vscode.window.activeTextEditor?.document.uri;
}

async function openSource(candidate?: unknown): Promise<void> {
  const uri = await activeFlightUri(candidate);
  if (!uri) return;
  const document = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(document, { preview: false });
}

async function openVisual(candidate?: unknown): Promise<void> {
  const uri = await activeFlightUri(candidate);
  if (uri) await vscode.commands.executeCommand('vscode.openWith', uri, viewType, vscode.ViewColumn.Active);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(viewType, new FlightEditorProvider(), {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: true,
    }),
    vscode.commands.registerCommand('flight.openSource', openSource),
    vscode.commands.registerCommand('flight.openVisual', openVisual),
  );
}

export function deactivate(): void {}
