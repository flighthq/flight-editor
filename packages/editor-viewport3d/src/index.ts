export type Vec3 = readonly [number, number, number];
export type ViewProjection = 'perspective' | 'orthographic';
export interface Viewport3DBookmark {
  readonly id: string;
  readonly name: string;
  readonly position: Vec3;
  readonly target: Vec3;
  readonly projection: ViewProjection;
  readonly zoom: number;
}
export interface Viewport3DState {
  position: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  projection: ViewProjection;
  zoom: number;
  speed: number;
  bookmarks: Map<string, Viewport3DBookmark>;
  version: number;
}
const finite = (v: Vec3) => v.every(Number.isFinite);
const copy = (v: Vec3): [number, number, number] => [...v];
export function createViewport3DState(): Viewport3DState {
  return {
    position: [0, 0, 10],
    target: [0, 0, 0],
    up: [0, 1, 0],
    projection: 'perspective',
    zoom: 1,
    speed: 1,
    bookmarks: new Map(),
    version: 0,
  };
}
export function setViewport3DCamera(s: Viewport3DState, position: Vec3, target: Vec3): void {
  if (!finite(position) || !finite(target) || position.every((v, i) => v === target[i]))
    throw new Error('Camera position and target must be finite and distinct');
  s.position = copy(position);
  s.target = copy(target);
  s.version++;
}
export function orbitViewport3D(s: Viewport3DState, yaw: number, pitch: number): void {
  if (!Number.isFinite(yaw) || !Number.isFinite(pitch)) throw new RangeError('Orbit delta must be finite');
  const d = s.position.map((v, i) => v - s.target[i]) as [number, number, number],
    r = Math.hypot(...d),
    a = Math.atan2(d[0], d[2]) + yaw,
    e = Math.max(-Math.PI / 2 + 1e-4, Math.min(Math.PI / 2 - 1e-4, Math.asin(d[1] / r) + pitch));
  s.position = [
    s.target[0] + r * Math.cos(e) * Math.sin(a),
    s.target[1] + r * Math.sin(e),
    s.target[2] + r * Math.cos(e) * Math.cos(a),
  ];
  s.version++;
}
export function panViewport3D(s: Viewport3DState, delta: Vec3): void {
  if (!finite(delta)) throw new RangeError('Pan delta must be finite');
  s.position = s.position.map((v, i) => v + delta[i]) as [number, number, number];
  s.target = s.target.map((v, i) => v + delta[i]) as [number, number, number];
  s.version++;
}
export function dollyViewport3D(s: Viewport3DState, amount: number): void {
  if (!Number.isFinite(amount)) throw new RangeError('Dolly must be finite');
  const d = s.position.map((v, i) => v - s.target[i]) as [number, number, number],
    r = Math.hypot(...d),
    next = Math.max(1e-6, r * Math.exp(-amount));
  s.position = s.target.map((v, i) => v + (d[i] * next) / r) as [number, number, number];
  s.version++;
}
export function frameViewport3D(s: Viewport3DState, min: Vec3, max: Vec3, fov = Math.PI / 3): void {
  if (!finite(min) || !finite(max) || min.some((v, i) => v > max[i])) throw new Error('Invalid bounds');
  const c = min.map((v, i) => (v + max[i]) / 2) as [number, number, number],
    radius = Math.max(1e-6, Math.hypot(...max.map((v, i) => (v - min[i]) / 2)));
  s.target = c;
  s.position = [c[0], c[1], c[2] + radius / Math.tan(fov / 2)];
  s.version++;
}
export function saveViewport3DBookmark(s: Viewport3DState, id: string, name: string): void {
  if (!id.trim() || !name.trim()) throw new TypeError('Bookmark identity and name are required');
  s.bookmarks.set(id, {
    id,
    name,
    position: copy(s.position),
    target: copy(s.target),
    projection: s.projection,
    zoom: s.zoom,
  });
  s.version++;
}
export function restoreViewport3DBookmark(s: Viewport3DState, id: string): boolean {
  const b = s.bookmarks.get(id);
  if (!b) return false;
  s.position = copy(b.position);
  s.target = copy(b.target);
  s.projection = b.projection;
  s.zoom = b.zoom;
  s.version++;
  return true;
}
