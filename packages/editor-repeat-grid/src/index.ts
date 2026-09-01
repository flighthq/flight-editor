export interface RepeatGridOverride {
  readonly index: number;
  readonly values: Readonly<Record<string, unknown>>;
}
export interface RepeatGrid {
  readonly id: string;
  readonly sourceId: string;
  readonly columns: number;
  readonly rows: number;
  readonly gapX: number;
  readonly gapY: number;
  readonly overrides: ReadonlyMap<number, Readonly<Record<string, unknown>>>;
}
export interface RepeatGridItem {
  readonly index: number;
  readonly row: number;
  readonly column: number;
  readonly x: number;
  readonly y: number;
  readonly values: Readonly<Record<string, unknown>>;
}
export interface RepeatGridState {
  grids: Map<string, RepeatGrid>;
  version: number;
}
const finite = (v: number, l: string) => {
  if (!Number.isFinite(v)) throw new RangeError(l + ' must be finite');
};
export function createRepeatGridState(): RepeatGridState {
  return { grids: new Map(), version: 0 };
}
export function addRepeatGrid(s: RepeatGridState, g: RepeatGrid): void {
  if (!g.id.trim() || !g.sourceId.trim()) throw new TypeError('Grid and source identities are required');
  if (!Number.isInteger(g.columns) || !Number.isInteger(g.rows) || g.columns < 1 || g.rows < 1)
    throw new RangeError('Grid dimensions must be positive integers');
  finite(g.gapX, 'Horizontal gap');
  finite(g.gapY, 'Vertical gap');
  if (s.grids.has(g.id)) throw new Error('Grid already exists');
  s.grids.set(g.id, { ...g, overrides: new Map(g.overrides) });
  s.version++;
}
export function resizeRepeatGrid(s: RepeatGridState, id: string, columns: number, rows: number): void {
  const g = s.grids.get(id);
  if (!g) throw new Error('Unknown grid');
  if (!Number.isInteger(columns) || !Number.isInteger(rows) || columns < 1 || rows < 1)
    throw new RangeError('Grid dimensions must be positive integers');
  const size = columns * rows;
  s.grids.set(id, { ...g, columns, rows, overrides: new Map([...g.overrides].filter(([i]) => i < size)) });
  s.version++;
}
export function setRepeatGridGap(s: RepeatGridState, id: string, x: number, y: number): void {
  finite(x, 'Horizontal gap');
  finite(y, 'Vertical gap');
  const g = s.grids.get(id);
  if (!g) throw new Error('Unknown grid');
  s.grids.set(id, { ...g, gapX: x, gapY: y });
  s.version++;
}
export function setRepeatGridOverride(
  s: RepeatGridState,
  id: string,
  index: number,
  values: Readonly<Record<string, unknown>>,
): void {
  const g = s.grids.get(id);
  if (!g) throw new Error('Unknown grid');
  if (!Number.isInteger(index) || index < 0 || index >= g.columns * g.rows)
    throw new RangeError('Override index is outside grid');
  s.grids.set(id, { ...g, overrides: new Map(g.overrides).set(index, { ...values }) });
  s.version++;
}
export function expandRepeatGrid(g: Readonly<RepeatGrid>, width: number, height: number): readonly RepeatGridItem[] {
  finite(width, 'Item width');
  finite(height, 'Item height');
  return Array.from({ length: g.columns * g.rows }, (_, index) => {
    const column = index % g.columns,
      row = Math.floor(index / g.columns);
    return {
      index,
      row,
      column,
      x: column * (width + g.gapX),
      y: row * (height + g.gapY),
      values: { ...g.overrides.get(index) },
    };
  });
}
export function detachRepeatGrid(
  s: RepeatGridState,
  id: string,
  width: number,
  height: number,
): readonly RepeatGridItem[] {
  const g = s.grids.get(id);
  if (!g) throw new Error('Unknown grid');
  const items = expandRepeatGrid(g, width, height);
  s.grids.delete(id);
  s.version++;
  return items;
}
