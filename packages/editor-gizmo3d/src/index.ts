export type GizmoMode = 'move' | 'rotate' | 'scale' | 'combined';
export type GizmoAxis = 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz' | 'screen' | 'free';
export type Transform3D = {
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly scale: readonly [number, number, number];
};
export interface Gizmo3DState {
  mode: GizmoMode;
  orientation: 'local' | 'world';
  pivot: 'pivot' | 'center';
  hovered: GizmoAxis | null;
  drag: null | { axis: GizmoAxis; before: ReadonlyMap<string, Transform3D>; preview: Map<string, Transform3D> };
  snap: { move: number; rotate: number; scale: number };
  version: number;
}
export function createGizmo3DState(): Gizmo3DState {
  return {
    mode: 'move',
    orientation: 'local',
    pivot: 'pivot',
    hovered: null,
    drag: null,
    snap: { move: 0, rotate: 0, scale: 0 },
    version: 0,
  };
}
export function configureGizmo3D(
  s: Gizmo3DState,
  v: Partial<Pick<Gizmo3DState, 'mode' | 'orientation' | 'pivot'>>,
): void {
  Object.assign(s, v);
  s.version++;
}
export function setGizmo3DSnap(s: Gizmo3DState, move: number, rotate: number, scale: number): void {
  if ([move, rotate, scale].some((v) => !Number.isFinite(v) || v < 0))
    throw new RangeError('Snap values must be finite and non-negative');
  s.snap = { move, rotate, scale };
  s.version++;
}
export function beginGizmo3DGesture(s: Gizmo3DState, axis: GizmoAxis, values: ReadonlyMap<string, Transform3D>): void {
  if (s.drag) throw new Error('Gizmo gesture already active');
  if (!values.size) throw new Error('Gizmo gesture requires targets');
  s.drag = { axis, before: new Map(values), preview: new Map(values) };
  s.version++;
}
const snap = (v: number, n: number) => (n ? Math.round(v / n) * n : v);
export function previewGizmo3DTranslation(s: Gizmo3DState, delta: readonly [number, number, number]): void {
  if (!s.drag) throw new Error('No active gizmo gesture');
  for (const [id, t] of s.drag.before)
    s.drag.preview.set(id, {
      ...t,
      position: t.position.map((v, i) => snap(v + delta[i], s.snap.move)) as [number, number, number],
    });
  s.version++;
}
export function commitGizmo3DGesture(s: Gizmo3DState): ReadonlyMap<string, Transform3D> {
  if (!s.drag) throw new Error('No active gizmo gesture');
  const out = new Map(s.drag.preview);
  s.drag = null;
  s.version++;
  return out;
}
export function cancelGizmo3DGesture(s: Gizmo3DState): ReadonlyMap<string, Transform3D> {
  if (!s.drag) throw new Error('No active gizmo gesture');
  const out = new Map(s.drag.before);
  s.drag = null;
  s.version++;
  return out;
}
export function getGizmo3DHandleScale(distance: number, pixels: number, viewportHeight: number, fov: number): number {
  if ([distance, pixels, viewportHeight, fov].some((v) => !Number.isFinite(v) || v <= 0))
    throw new RangeError('Handle scale inputs must be positive');
  return (2 * distance * Math.tan(fov / 2) * pixels) / viewportHeight;
}
