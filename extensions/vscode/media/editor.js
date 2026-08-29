const vscode = acquireVsCodeApi();
const tree = document.getElementById('tree'),
  status = document.getElementById('status'),
  canvas = document.getElementById('canvas'),
  empty = document.getElementById('empty'),
  form = document.getElementById('inspector');
let model = null,
  version = 0,
  selected = [],
  zoom = 1,
  panX = 0,
  panY = 0,
  drag = null,
  hitAreas = [];
const fields = [
  ['name', 'text'],
  ['x', 'number'],
  ['y', 'number'],
  ['scaleX', 'number'],
  ['scaleY', 'number'],
  ['rotation', 'number'],
  ['alpha', 'number'],
  ['visible', 'checkbox'],
];
document.getElementById('source').onclick = () => vscode.postMessage({ type: 'openSource' });
document.getElementById('fit').onclick = fit;
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
    el.className = 'node' + (same(path, selected) ? ' selected' : '');
    el.style.paddingLeft = 6 + depth * 14 + 'px';
    el.setAttribute('role', 'treeitem');
    el.tabIndex = 0;
    const name = document.createElement('span');
    name.textContent = nodeLabel(node);
    const kind = document.createElement('span');
    kind.className = 'kind';
    kind.textContent = node.kind;
    el.append(name, kind);
    el.onclick = () => select(path);
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(path);
      }
    };
    tree.appendChild(el);
    node.children.forEach((child, i) => add(child, [...path, i], depth + 1));
  }
  add(model.scene.root, [], 0);
}
function select(path) {
  selected = path;
  vscode.postMessage({ type: 'selectNode', path });
  renderTree();
  renderInspector();
  draw();
}
function renderInspector() {
  form.textContent = '';
  const node = nodeAt(selected);
  if (!node) return;
  if (selected.length === 0) {
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
  for (const [property, type] of fields) {
    const label = document.createElement('label'),
      caption = document.createElement('span'),
      input = document.createElement('input');
    caption.textContent = property;
    input.type = type;
    const fallback =
      property === 'scaleX' || property === 'scaleY' || property === 'alpha'
        ? 1
        : property === 'visible'
          ? true
          : property === 'name'
            ? node.kind
            : 0;
    const value = node.traits[property] ?? fallback;
    if (type === 'checkbox') input.checked = Boolean(value);
    else input.value = String(value);
    if (type === 'number') input.step = property === 'rotation' ? '0.05' : '0.1';
    input.onchange = () => {
      const value = type === 'checkbox' ? input.checked : type === 'number' ? Number(input.value) : input.value;
      if (type === 'number' && !Number.isFinite(value)) return;
      vscode.postMessage({ type: 'updateNode', baseVersion: version, path: selected, property, value });
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
function multiply(p, l) {
  return {
    a: p.a * l.a + p.c * l.b,
    b: p.b * l.a + p.d * l.b,
    c: p.a * l.c + p.c * l.d,
    d: p.b * l.c + p.d * l.d,
    e: p.a * l.e + p.c * l.f + p.e,
    f: p.b * l.e + p.d * l.f + p.f,
  };
}
function transform(node, parent) {
  const t = node.traits,
    rotation = Number(t.rotation) || 0,
    sx = Number.isFinite(t.scaleX) ? t.scaleX : 1,
    sy = Number.isFinite(t.scaleY) ? t.scaleY : 1,
    x = Number(t.x) || 0,
    y = Number(t.y) || 0,
    c = Math.cos(rotation),
    s = Math.sin(rotation);
  return multiply(parent, { a: c * sx, b: s * sx, c: -s * sy, d: c * sy, e: x, f: y });
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
  function walk(node, path, matrix) {
    if (node.traits.visible === false) return;
    const world = transform(node, matrix),
      width = Number(node.traits.width) || 80,
      height = Number(node.traits.height) || 50;
    hitAreas.push({ path, matrix: world, width, height });
    ctx.save();
    ctx.transform(world.a, world.b, world.c, world.d, world.e, world.f);
    ctx.globalAlpha = Number.isFinite(node.traits.alpha) ? node.traits.alpha : 1;
    ctx.fillStyle = packedColor(node.traits.color, 'rgba(80,150,230,.22)');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = same(path, selected) ? '#3794ff' : 'rgba(80,150,230,.8)';
    ctx.lineWidth = (same(path, selected) ? 2 : 1) / zoom;
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
    node.children.forEach((child, i) => walk(child, [...path, i], world));
  }
  const identity = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  model.scene.root.children.forEach((node, i) => walk(node, [i], identity));
  ctx.restore();
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
function pick(viewportX, viewportY) {
  const sceneX = (viewportX - panX) / zoom,
    sceneY = (viewportY - panY) / zoom;
  for (let index = hitAreas.length - 1; index >= 0; index--) {
    const hit = hitAreas[index],
      local = invertPoint(hit.matrix, sceneX, sceneY);
    if (local && local.x >= 0 && local.y >= 0 && local.x <= hit.width && local.y <= hit.height) {
      select(hit.path);
      return;
    }
  }
  select([]);
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
  drag = { x: e.clientX, y: e.clientY, panX, panY, moved: false };
  canvas.setPointerCapture(e.pointerId);
  canvas.parentElement.classList.add('grabbing');
};
canvas.onpointermove = (e) => {
  if (!drag) return;
  if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 3) drag.moved = true;
  if (!drag.moved) return;
  panX = drag.panX + e.clientX - drag.x;
  panY = drag.panY + e.clientY - drag.y;
  draw();
};
canvas.onpointerup = (e) => {
  if (drag && !drag.moved) pick(e.offsetX, e.offsetY);
  drag = null;
  canvas.parentElement.classList.remove('grabbing');
};
function same(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
function load(snapshot) {
  version = snapshot.version;
  try {
    const value = JSON.parse(snapshot.text);
    if (value.format !== 'flight-scene' || value.version !== 1 || !value.scene?.root)
      throw new Error('Expected a Flight scene document (format flight-scene, version 1).');
    model = value;
    empty.style.display = 'none';
    status.textContent = 'Synced · revision ' + version;
    if (!nodeAt(selected)) selected = [];
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
vscode.postMessage({ type: 'ready' });
