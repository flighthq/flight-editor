import type { AlignAxis, AlignTarget, DistributeAxis, DistributeMode } from './alignState';

export interface AlignBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface AlignItem {
  readonly id: string;
  readonly bounds: AlignBounds;
}

export interface AlignMutation {
  readonly id: string;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

function assertItems(items: readonly AlignItem[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (item.id.trim() === '' || ids.has(item.id)) throw new Error(`Invalid or duplicate align item: ${item.id}`);
    ids.add(item.id);
    const { x, y, width, height } = item.bounds;
    if (![x, y, width, height].every(Number.isFinite) || width < 0 || height < 0) {
      throw new RangeError(`Invalid bounds for align item: ${item.id}`);
    }
  }
}

function unionBounds(items: readonly AlignItem[]): AlignBounds {
  const left = Math.min(...items.map(({ bounds }) => bounds.x));
  const top = Math.min(...items.map(({ bounds }) => bounds.y));
  const right = Math.max(...items.map(({ bounds }) => bounds.x + bounds.width));
  const bottom = Math.max(...items.map(({ bounds }) => bounds.y + bounds.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function resolveReference(
  items: readonly AlignItem[],
  target: AlignTarget,
  artboard: AlignBounds | undefined,
  keyObjectId: string | null | undefined,
): AlignBounds {
  if (target === 'selection') return unionBounds(items);
  if (target === 'artboard') {
    if (artboard === undefined) throw new Error('Artboard bounds are required for artboard alignment');
    assertItems([{ id: 'artboard', bounds: artboard }]);
    return artboard;
  }
  const key = items.find(({ id }) => id === keyObjectId);
  if (key === undefined) throw new Error('Key object must be part of the aligned selection');
  return key.bounds;
}

export function planAlignment(
  items: readonly AlignItem[],
  axis: AlignAxis,
  target: AlignTarget,
  options: { readonly artboard?: AlignBounds; readonly keyObjectId?: string | null } = {},
): readonly AlignMutation[] {
  if (items.length === 0) return [];
  assertItems(items);
  const reference = resolveReference(items, target, options.artboard, options.keyObjectId);
  return items
    .filter(({ id }) => target !== 'key-object' || id !== options.keyObjectId)
    .map(({ id, bounds }) => {
      switch (axis) {
        case 'left':
          return { id, x: reference.x };
        case 'center':
          return { id, x: reference.x + (reference.width - bounds.width) / 2 };
        case 'right':
          return { id, x: reference.x + reference.width - bounds.width };
        case 'top':
          return { id, y: reference.y };
        case 'middle':
          return { id, y: reference.y + (reference.height - bounds.height) / 2 };
        case 'bottom':
          return { id, y: reference.y + reference.height - bounds.height };
      }
    })
    .filter((mutation, index) => {
      const bounds = items.filter(({ id }) => target !== 'key-object' || id !== options.keyObjectId)[index]!.bounds;
      return mutation.x === undefined ? mutation.y !== bounds.y : mutation.x !== bounds.x;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function planDistribution(
  items: readonly AlignItem[],
  axis: DistributeAxis,
  mode: DistributeMode,
): readonly AlignMutation[] {
  if (items.length < 2) return [];
  assertItems(items);
  const horizontal = axis === 'horizontal';
  const sorted = [...items].sort((a, b) => {
    const av = horizontal ? a.bounds.x : a.bounds.y;
    const bv = horizontal ? b.bounds.x : b.bounds.y;
    return av - bv || a.id.localeCompare(b.id);
  });
  if (mode === 'equal-size') {
    const average =
      sorted.reduce((sum, item) => sum + (horizontal ? item.bounds.width : item.bounds.height), 0) / sorted.length;
    return sorted
      .map(({ id }) => (horizontal ? { id, width: average } : { id, height: average }))
      .filter((mutation, index) =>
        horizontal ? mutation.width !== sorted[index]!.bounds.width : mutation.height !== sorted[index]!.bounds.height,
      );
  }
  if (sorted.length < 3) return [];
  const first = sorted[0]!.bounds;
  const last = sorted[sorted.length - 1]!.bounds;
  const start = horizontal ? first.x : first.y;
  const end = horizontal ? last.x + last.width : last.y + last.height;
  const totalSize = sorted.reduce((sum, item) => sum + (horizontal ? item.bounds.width : item.bounds.height), 0);
  const gap = (end - start - totalSize) / (sorted.length - 1);
  let cursor = start + (horizontal ? first.width : first.height) + gap;
  return sorted.slice(1, -1).map(({ id, bounds }) => {
    const mutation = horizontal ? { id, x: cursor } : { id, y: cursor };
    cursor += (horizontal ? bounds.width : bounds.height) + gap;
    return mutation;
  });
}
