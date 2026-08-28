import type { GuidesState } from '@flighthq/editor-guides';
import type { SnapConfig } from '@flighthq/editor-snap';

export interface SnapPoint {
  readonly x: number;
  readonly y: number;
}

export interface GuideSnapResult extends SnapPoint {
  readonly snappedH: boolean;
  readonly snappedV: boolean;
}

export function snapToGrid(snap: Readonly<SnapConfig>, x: number, y: number): SnapPoint {
  return {
    x: snap.gridEnabled && snap.gridSizeX > 0 ? Math.round(x / snap.gridSizeX) * snap.gridSizeX : x,
    y: snap.gridEnabled && snap.gridSizeY > 0 ? Math.round(y / snap.gridSizeY) * snap.gridSizeY : y,
  };
}

export function snapToGuides(guides: Readonly<GuidesState>, x: number, y: number, threshold: number): GuideSnapResult {
  const horizontal = findNearestGuide(guides, 'horizontal', y, threshold);
  const vertical = findNearestGuide(guides, 'vertical', x, threshold);
  return {
    x: vertical ?? x,
    y: horizontal ?? y,
    snappedH: horizontal !== null,
    snappedV: vertical !== null,
  };
}

export function snapPosition(
  snap: Readonly<SnapConfig>,
  guides: Readonly<GuidesState>,
  x: number,
  y: number,
  threshold: number,
): GuideSnapResult {
  const grid = snapToGrid(snap, x, y);
  const guide = snap.guidesEnabled ? snapToGuides(guides, x, y, threshold) : { x, y, snappedH: false, snappedV: false };
  return {
    x: guide.snappedV ? guide.x : grid.x,
    y: guide.snappedH ? guide.y : grid.y,
    snappedH: guide.snappedH,
    snappedV: guide.snappedV,
  };
}

export function snapDimension(snap: Readonly<SnapConfig>, value: number): number {
  if (!snap.gridEnabled || snap.gridSizeX <= 0) return value;
  return Math.round(value / snap.gridSizeX) * snap.gridSizeX;
}

function findNearestGuide(
  guides: Readonly<GuidesState>,
  axis: 'horizontal' | 'vertical',
  value: number,
  threshold: number,
): number | null {
  let nearest: number | null = null;
  let nearestDistance = Infinity;
  for (const guide of guides.guides) {
    if (guide.axis !== axis) continue;
    const distance = Math.abs(guide.position - value);
    if (distance <= threshold && distance < nearestDistance) {
      nearest = guide.position;
      nearestDistance = distance;
    }
  }
  return nearest;
}
