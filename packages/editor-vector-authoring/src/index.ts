export type VectorPoint = { readonly x: number; readonly y: number };
export interface VectorVertex extends VectorPoint {
  readonly id: string;
  readonly in?: VectorPoint;
  readonly out?: VectorPoint;
}
export interface VectorSubpath {
  readonly id: string;
  readonly closed: boolean;
  readonly vertices: readonly VectorVertex[];
}
export interface VectorShape {
  readonly id: string;
  readonly subpaths: readonly VectorSubpath[];
  readonly fill: string | null;
  readonly stroke: string | null;
  readonly strokeWidth: number;
}
export interface VectorAuthoringState {
  shapes: Map<string, VectorShape>;
  selectedVertices: Set<string>;
  activeShapeId: string | null;
  version: number;
}
const point = (p: VectorPoint) => Number.isFinite(p.x) && Number.isFinite(p.y);
export function createVectorAuthoringState(): VectorAuthoringState {
  return { shapes: new Map(), selectedVertices: new Set(), activeShapeId: null, version: 0 };
}
export function addVectorShape(s: VectorAuthoringState, shape: VectorShape): void {
  if (!shape.id.trim() || s.shapes.has(shape.id)) throw new Error('Invalid or duplicate shape');
  if (!Number.isFinite(shape.strokeWidth) || shape.strokeWidth < 0)
    throw new RangeError('Stroke width must be non-negative');
  s.shapes.set(shape.id, clone(shape));
  s.version++;
}
export function appendVectorVertex(s: VectorAuthoringState, shapeId: string, subpathId: string, v: VectorVertex): void {
  if (!point(v)) throw new Error('Vertex must be finite');
  const shape = s.shapes.get(shapeId);
  if (!shape) throw new Error('Unknown shape');
  const sub = shape.subpaths.find((x) => x.id === subpathId);
  if (!sub) throw new Error('Unknown subpath');
  if (shape.subpaths.some((x) => x.vertices.some((p) => p.id === v.id))) throw new Error('Duplicate vertex');
  replace(s, {
    ...shape,
    subpaths: shape.subpaths.map((x) => (x.id === subpathId ? { ...x, vertices: [...x.vertices, { ...v }] } : x)),
  });
}
export function moveVectorVertices(
  s: VectorAuthoringState,
  shapeId: string,
  ids: ReadonlySet<string>,
  dx: number,
  dy: number,
): void {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) throw new RangeError('Vector delta must be finite');
  const shape = s.shapes.get(shapeId);
  if (!shape) throw new Error('Unknown shape');
  replace(s, {
    ...shape,
    subpaths: shape.subpaths.map((p) => ({
      ...p,
      vertices: p.vertices.map((v) => (ids.has(v.id) ? { ...v, x: v.x + dx, y: v.y + dy } : v)),
    })),
  });
}
export function setVectorPaint(
  s: VectorAuthoringState,
  id: string,
  fill: string | null,
  stroke: string | null,
  width: number,
): void {
  const shape = s.shapes.get(id);
  if (!shape) throw new Error('Unknown shape');
  if (!Number.isFinite(width) || width < 0) throw new RangeError('Stroke width must be non-negative');
  replace(s, { ...shape, fill, stroke, strokeWidth: width });
}
export function closeVectorSubpath(s: VectorAuthoringState, shapeId: string, subpathId: string, closed = true): void {
  const shape = s.shapes.get(shapeId);
  if (!shape) throw new Error('Unknown shape');
  replace(s, { ...shape, subpaths: shape.subpaths.map((p) => (p.id === subpathId ? { ...p, closed } : p)) });
}
export function selectVectorVertices(s: VectorAuthoringState, ids: Iterable<string>): void {
  s.selectedVertices = new Set(ids);
  s.version++;
}
export function validateVectorShape(shape: Readonly<VectorShape>): readonly string[] {
  const d: string[] = [];
  const ids = new Set<string>();
  for (const p of shape.subpaths) {
    if (p.closed && p.vertices.length < 3) d.push('closed-subpath-too-short:' + p.id);
    for (const v of p.vertices) {
      if (ids.has(v.id)) d.push('duplicate-vertex:' + v.id);
      ids.add(v.id);
      if (!point(v)) d.push('invalid-vertex:' + v.id);
    }
  }
  return d.sort();
}
const clone = (s: VectorShape): VectorShape => ({
  ...s,
  subpaths: s.subpaths.map((p) => ({
    ...p,
    vertices: p.vertices.map((v) => ({ ...v, in: v.in && { ...v.in }, out: v.out && { ...v.out } })),
  })),
});
function replace(s: VectorAuthoringState, v: VectorShape): void {
  s.shapes.set(v.id, clone(v));
  s.version++;
}
