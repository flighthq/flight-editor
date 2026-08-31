import type { SmartGuide } from './smartGuideState';

export interface SmartGuideBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SmartGuideTarget {
  readonly id: string;
  readonly bounds: SmartGuideBounds;
}

export interface SmartGuideMatch {
  readonly delta: { readonly x: number; readonly y: number };
  readonly guides: readonly SmartGuide[];
}

function assertBounds(bounds: SmartGuideBounds): void {
  if (
    ![bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite) ||
    bounds.width < 0 ||
    bounds.height < 0
  ) {
    throw new RangeError('Smart-guide bounds must be finite with non-negative size');
  }
}

function anchors(bounds: SmartGuideBounds) {
  return {
    x: [bounds.x, bounds.x + bounds.width / 2, bounds.x + bounds.width],
    y: [bounds.y, bounds.y + bounds.height / 2, bounds.y + bounds.height],
  };
}

export function matchSmartGuides(
  moving: SmartGuideBounds,
  targets: readonly SmartGuideTarget[],
  tolerance: number,
): SmartGuideMatch {
  assertBounds(moving);
  if (!Number.isFinite(tolerance) || tolerance < 0)
    throw new RangeError('Smart-guide tolerance must be finite and non-negative');
  const ids = new Set<string>();
  for (const target of targets) {
    if (target.id.trim() === '' || ids.has(target.id))
      throw new Error(`Invalid or duplicate smart-guide target: ${target.id}`);
    ids.add(target.id);
    assertBounds(target.bounds);
  }
  const movingAnchors = anchors(moving);
  const candidates: { axis: 'x' | 'y'; delta: number; guide: SmartGuide; rank: number }[] = [];
  for (const target of targets) {
    const targetAnchors = anchors(target.bounds);
    for (const axis of ['x', 'y'] as const) {
      movingAnchors[axis].forEach((movingPosition, movingIndex) => {
        targetAnchors[axis].forEach((targetPosition, targetIndex) => {
          const delta = targetPosition - movingPosition;
          if (Math.abs(delta) > tolerance) return;
          const vertical = axis === 'x';
          candidates.push({
            axis,
            delta,
            rank: Math.abs(delta) * 100 + Math.abs(movingIndex - targetIndex),
            guide: {
              kind: movingIndex === 1 && targetIndex === 1 ? 'center' : 'edge',
              orientation: vertical ? 'vertical' : 'horizontal',
              position: targetPosition,
              from: vertical ? Math.min(moving.y, target.bounds.y) : Math.min(moving.x, target.bounds.x),
              to: vertical
                ? Math.max(moving.y + moving.height, target.bounds.y + target.bounds.height)
                : Math.max(moving.x + moving.width, target.bounds.x + target.bounds.width),
              label: null,
            },
          });
        });
      });
    }
  }
  const best = (axis: 'x' | 'y') =>
    candidates
      .filter((candidate) => candidate.axis === axis)
      .sort((a, b) => a.rank - b.rank || a.guide.position - b.guide.position)[0];
  const bestX = best('x');
  const bestY = best('y');
  const guides = [bestX?.guide, bestY?.guide]
    .filter((guide): guide is SmartGuide => guide !== undefined)
    .sort((a, b) => a.orientation.localeCompare(b.orientation) || a.position - b.position);
  return { delta: { x: bestX?.delta ?? 0, y: bestY?.delta ?? 0 }, guides };
}

export function validateSmartGuides(guides: readonly SmartGuide[]): readonly string[] {
  const diagnostics: string[] = [];
  const keys = new Set<string>();
  guides.forEach((guide, index) => {
    if (![guide.position, guide.from, guide.to].every(Number.isFinite) || guide.from > guide.to) {
      diagnostics.push(`invalid-guide:${index}`);
    }
    const key = `${guide.kind}\0${guide.orientation}\0${guide.position}\0${guide.from}\0${guide.to}`;
    if (keys.has(key)) diagnostics.push(`duplicate-guide:${index}`);
    keys.add(key);
  });
  return diagnostics.sort();
}
