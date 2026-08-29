const vscode = acquireVsCodeApi();
const tree = document.getElementById('tree'),
  status = document.getElementById('status'),
  canvas = document.getElementById('canvas'),
  empty = document.getElementById('empty'),
  form = document.getElementById('inspector');
let model = null,
  version = 0,
  selected = [],
  properties = [],
  renderNodes = [],
  tool = 'select',
  spaceDown = false,
  zoom = 1,
  panX = 0,
  panY = 0,
  drag = null,
  hitAreas = [];
document.getElementById('source').onclick = () => vscode.postMessage({ type: 'openSource' });
document.getElementById('fit').onclick = fit;
document.getElementById('selectTool').onclick = () => setTool('select');
document.getElementById('scaleTool').onclick = () => setTool('scale');
document.getElementById('rotateTool').onclick = () => setTool('rotate');
document.getElementById('handTool').onclick = () => setTool('hand');
document.getElementById('addNode').onclick = () =>
  mutate({ action: 'create', kind: document.getElementById('createKind').value, parentPath: primary() || [] });
document.getElementById('duplicate').onclick = () =>
  selected.length && mutate({ action: 'duplicate', paths: selected });
document.getElementById('delete').onclick = () => selected.length && mutate({ action: 'delete', paths: selected });
function nodeAt(path) {
  let node = model?.scene?.root;
  for (const i of path) node = node?.children?.[i];
  return node;
}
function nodeLabel(node) {
  return node?.traits?.name || node?.kind || 'Node';
}
function renderTree() {
  tree.textContent = '';
  if (!model) return;
  function add(node, path, depth) {
    const el = document.createElement('div');
    el.className = 'node' + (isSelected(path) ? ' selected' : '');
    el.style.paddingLeft = 6 + depth * 14 + 'px';
    el.setAttribute('role', 'treeitem');
    el.tabIndex = 0;
    el.draggable = path.length > 0;
    const name = document.createElement('span');
    name.textContent = nodeLabel(node);
    const kind = document.createElement('span');
    kind.className = 'kind';
    kind.textContent = node.kind;
    el.append(name, kind);
    el.onclick = (event) => select(path, event.shiftKey || event.metaKey || event.ctrlKey);
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(path);
      }
    };
    el.ondragstart = (event) => event.dataTransfer?.setData('application/x-flight-node-path', JSON.stringify(path));
    el.ondragover = (event) => event.preventDefault();
    el.ondrop = (event) => {
      event.preventDefault();
      try {
        const sourcePath = JSON.parse(event.dataTransfer?.getData('application/x-flight-node-path') || 'null');
        if (Array.isArray(sourcePath) && sourcePath.length) {
          mutate({ action: 'reparent', path: sourcePath, parentPath: path });
        }
      } catch {
        status.textContent = 'Invalid hierarchy drag';
      }
    };
    tree.appendChild(el);
    node.children.forEach((child, i) => add(child, [...path, i], depth + 1));
  }
  add(model.scene.root, [], 0);
}
function select(path, additive = false) {
  if (path.length === 0) selected = [];
  else if (additive && isSelected(path)) selected = selected.filter((candidate) => !same(path, candidate));
  else if (additive) selected = [...selected, path];
  else selected = [path];
  vscode.postMessage({ type: 'selectNode', paths: selected });
  renderTree();
  renderInspector();
  draw();
}
function primary() {
  return selected[selected.length - 1];
}
function isSelected(path) {
  return selected.some((candidate) => same(path, candidate));
}
function renderInspector() {
  form.textContent = '';
  const path = primary(),
    node = path ? nodeAt(path) : null;
  if (!node) {
    const title = document.createElement('p');
    title.textContent = model.name || 'Scene';
    form.appendChild(title);
    addDetail('Document', 'Flight scene v' + model.version);
    addDetail('Size', model.scene.width + ' × ' + model.scene.height);
    addDetail('Scale', model.scene.scaleMode);
    addDetail('Align', model.scene.align);
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'The scene root has no position or transform. Select a child node to edit its properties.';
    form.appendChild(hint);
    return;
  }
  const title = document.createElement('p');
  title.textContent = node.kind;
  form.appendChild(title);
  if (selected.length > 1) addDetail('Selection', selected.length + ' nodes');
  for (const field of properties) {
    const property = field.id,
      type = field.type === 'boolean' ? 'checkbox' : field.type === 'number' ? 'number' : 'text';
    const label = document.createElement('label'),
      caption = document.createElement('span'),
      input = document.createElement('input');
    caption.textContent = field.label;
    input.type = type;
    const value = field.value;
    if (type === 'checkbox') input.checked = Boolean(value);
    else input.value = String(value);
    if (type === 'number') {
      if (field.step !== undefined) input.step = String(field.step);
      if (field.min !== undefined) input.min = String(field.min);
      if (field.max !== undefined) input.max = String(field.max);
    }
    input.onchange = () => {
      const value = type === 'checkbox' ? input.checked : type === 'number' ? Number(input.value) : input.value;
      if (type === 'number' && !Number.isFinite(value)) return;
      vscode.postMessage({ type: 'updateNode', baseVersion: version, paths: selected, property, value });
    };
    label.append(caption, input);
    form.appendChild(label);
  }
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Edits use VS Code undo/redo and save normally.';
  form.appendChild(hint);
}
function addDetail(label, value) {
  const row = document.createElement('div'),
    term = document.createElement('span'),
    description = document.createElement('strong');
  row.className = 'detail';
  term.textContent = label;
  description.textContent = value;
  row.append(term, description);
  form.appendChild(row);
}
function packedColor(value, fallback) {
  if (!Number.isFinite(value)) return fallback;
  const rgb = ((value >>> 0) >>> 8) & 0xffffff;
  return '#' + rgb.toString(16).padStart(6, '0');
}
function draw() {
  const dpr = devicePixelRatio || 1,
    w = canvas.clientWidth,
    h = canvas.clientHeight;
  canvas.width = Math.max(1, w * dpr);
  canvas.height = Math.max(1, h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  hitAreas = [];
  if (!model) return;
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);
  ctx.fillStyle = packedColor(model.backgroundColor, '#fff');
  ctx.fillRect(0, 0, model.scene.width, model.scene.height);
  ctx.strokeStyle = 'rgba(127,127,127,.55)';
  ctx.strokeRect(0, 0, model.scene.width, model.scene.height);
  for (const renderNode of renderNodes) {
    const { path, width, height } = renderNode,
      matrix = { ...renderNode.matrix };
    if (drag?.movable && drag.moved && isSelected(path)) {
      matrix.e += (drag.currentX - drag.x) / zoom;
      matrix.f += (drag.currentY - drag.y) / zoom;
    }
    hitAreas.push({ path, matrix, width, height });
    ctx.save();
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    ctx.globalAlpha = renderNode.alpha;
    ctx.fillStyle = packedColor(renderNode.color, 'rgba(80,150,230,.22)');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = isSelected(path) ? '#3794ff' : 'rgba(80,150,230,.8)';
    ctx.lineWidth = (isSelected(path) ? 2 : 1) / zoom;
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
  }
  ctx.restore();
  if (drag?.marquee && drag.moved) {
    const left = Math.min(drag.offsetX, drag.currentOffsetX),
      top = Math.min(drag.offsetY, drag.currentOffsetY),
      width = Math.abs(drag.currentOffsetX - drag.offsetX),
      height = Math.abs(drag.currentOffsetY - drag.offsetY);
    ctx.fillStyle = 'rgba(55,148,255,.12)';
    ctx.strokeStyle = '#3794ff';
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left + 0.5, top + 0.5, width, height);
  }
}
function invertPoint(matrix, x, y) {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (Math.abs(determinant) < 0.000001) return null;
  const dx = x - matrix.e,
    dy = y - matrix.f;
  return {
    x: (matrix.d * dx - matrix.c * dy) / determinant,
    y: (-matrix.b * dx + matrix.a * dy) / determinant,
  };
}
function hitPath(viewportX, viewportY) {
  const sceneX = (viewportX - panX) / zoom,
    sceneY = (viewportY - panY) / zoom;
  for (let index = hitAreas.length - 1; index >= 0; index--) {
    const hit = hitAreas[index],
      local = invertPoint(hit.matrix, sceneX, sceneY);
    if (local && local.x >= 0 && local.y >= 0 && local.x <= hit.width && local.y <= hit.height) {
      return hit.path;
    }
  }
  return null;
}
function fit() {
  if (!model) return;
  const padding = 32;
  zoom = Math.min(
    (canvas.clientWidth - padding * 2) / model.scene.width,
    (canvas.clientHeight - padding * 2) / model.scene.height,
  );
  zoom = Math.max(0.05, Math.min(8, zoom));
  panX = (canvas.clientWidth - model.scene.width * zoom) / 2;
  panY = (canvas.clientHeight - model.scene.height * zoom) / 2;
  draw();
}
canvas.onwheel = (e) => {
  e.preventDefault();
  const old = zoom;
  zoom = Math.max(0.05, Math.min(16, zoom * Math.exp(-e.deltaY * 0.001)));
  panX = e.offsetX - (e.offsetX - panX) * (zoom / old);
  panY = e.offsetY - (e.offsetY - panY) * (zoom / old);
  draw();
};
canvas.onpointerdown = (e) => {
  canvas.focus();
  const path = hitPath(e.offsetX, e.offsetY),
    pan = tool === 'hand' || e.button === 1 || e.altKey || spaceDown,
    marquee = !pan && !path;
  if (!pan && path && !isSelected(path)) select(path, e.shiftKey || e.metaKey || e.ctrlKey);
  const movable = tool === 'select' && !pan && path && isSelected(path),
    transforming = (tool === 'scale' || tool === 'rotate') && !pan && path && isSelected(path);
  drag = {
    x: e.clientX,
    y: e.clientY,
    panX,
    panY,
    moved: false,
    currentX: e.clientX,
    currentY: e.clientY,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
    currentOffsetX: e.offsetX,
    currentOffsetY: e.offsetY,
    pan,
    marquee,
    movable,
    transforming,
  };
  canvas.setPointerCapture(e.pointerId);
  if (pan) canvas.parentElement.classList.add('grabbing');
};
canvas.onpointermove = (e) => {
  if (!drag) return;
  if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 3) drag.moved = true;
  drag.currentX = e.clientX;
  drag.currentY = e.clientY;
  drag.currentOffsetX = e.offsetX;
  drag.currentOffsetY = e.offsetY;
  if (!drag.moved) return;
  if (drag.pan) {
    panX = drag.panX + e.clientX - drag.x;
    panY = drag.panY + e.clientY - drag.y;
  }
  draw();
};
canvas.onpointerup = (e) => {
  if (drag?.movable && drag.moved) {
    mutate({
      action: 'translate',
      paths: selected,
      deltaX: (e.clientX - drag.x) / zoom,
      deltaY: (e.clientY - drag.y) / zoom,
      snap: document.getElementById('snap').checked && !e.shiftKey,
    });
  } else if (drag?.transforming && drag.moved) {
    const delta = e.clientX - drag.x;
    mutate({
      action: 'transform',
      paths: selected,
      scaleFactor: tool === 'scale' ? Math.exp(delta * 0.01) : 1,
      rotationDelta: tool === 'rotate' ? delta * 0.01 : 0,
    });
  } else if (drag?.marquee && drag.moved) {
    const left = Math.min(drag.offsetX, e.offsetX),
      right = Math.max(drag.offsetX, e.offsetX),
      top = Math.min(drag.offsetY, e.offsetY),
      bottom = Math.max(drag.offsetY, e.offsetY);
    selected = renderNodes
      .filter(({ matrix, width, height }) => {
        const x = panX + (matrix.e + width / 2) * zoom,
          y = panY + (matrix.f + height / 2) * zoom;
        return x >= left && x <= right && y >= top && y <= bottom;
      })
      .map(({ path }) => path);
    vscode.postMessage({ type: 'selectNode', paths: selected });
    renderTree();
    renderInspector();
  } else if (drag && !drag.moved && !drag.pan) {
    const path = hitPath(e.offsetX, e.offsetY);
    if (path) select(path, e.shiftKey || e.metaKey || e.ctrlKey);
    else select([]);
  }
  drag = null;
  canvas.parentElement.classList.remove('grabbing');
};
canvas.onpointercancel = () => {
  drag = null;
  canvas.parentElement.classList.remove('grabbing');
};
function same(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
function mutate(operation) {
  vscode.postMessage({ type: 'sceneAction', baseVersion: version, operation });
}
function setTool(next) {
  tool = next;
  document.getElementById('selectTool').classList.toggle('active', tool === 'select');
  document.getElementById('scaleTool').classList.toggle('active', tool === 'scale');
  document.getElementById('rotateTool').classList.toggle('active', tool === 'rotate');
  document.getElementById('handTool').classList.toggle('active', tool === 'hand');
  canvas.style.cursor = tool === 'hand' ? 'grab' : 'default';
}
function load(snapshot) {
  version = snapshot.version;
  try {
    const value = snapshot.scene;
    if (value.format !== 'flight-scene' || value.version !== 1 || !value.scene?.root)
      throw new Error('Expected a Flight scene document (format flight-scene, version 1).');
    model = value;
    empty.style.display = 'none';
    status.textContent = 'Synced · revision ' + version;
    selected = snapshot.selection.filter((path) => nodeAt(path));
    properties = snapshot.properties;
    renderNodes = snapshot.renderNodes;
    const kindSelect = document.getElementById('createKind'),
      previousKind = kindSelect.value;
    kindSelect.textContent = '';
    for (const kind of snapshot.nodeKinds) {
      const option = document.createElement('option');
      option.value = kind;
      option.textContent = kind;
      kindSelect.appendChild(option);
    }
    if (snapshot.nodeKinds.includes(previousKind)) kindSelect.value = previousKind;
    renderTree();
    renderInspector();
    if (!vscode.getState()?.fitted) {
      fit();
      vscode.setState({ fitted: true });
    } else draw();
  } catch (error) {
    model = null;
    tree.textContent = '';
    form.textContent = '';
    empty.style.display = 'grid';
    empty.textContent = error instanceof Error ? error.message : String(error);
    status.textContent = 'Invalid source';
    draw();
  }
}
window.addEventListener('message', (event) => {
  if (event.data?.type === 'document') load(event.data);
  if (event.data?.type === 'rejected') status.textContent = event.data.reason;
});
window.addEventListener('resize', draw);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') spaceDown = true;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (selected.length) mutate({ action: 'delete', paths: selected });
  } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
    event.preventDefault();
    if (selected.length) mutate({ action: 'duplicate', paths: selected });
  } else if (event.key.toLowerCase() === 'f') fit();
  else if (event.key.toLowerCase() === 'v') setTool('select');
  else if (event.key.toLowerCase() === 's' && !(event.metaKey || event.ctrlKey)) setTool('scale');
  else if (event.key.toLowerCase() === 'r') setTool('rotate');
  else if (event.key.toLowerCase() === 'h') setTool('hand');
});
window.addEventListener('keyup', (event) => {
  if (event.code === 'Space') spaceDown = false;
});
vscode.postMessage({ type: 'ready' });
