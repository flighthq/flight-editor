export interface SnapGuide {
  readonly axis: 'x' | 'y';
  readonly position: number;
}

export interface SnapConfig {
  gridEnabled: boolean;
  gridSizeX: number;
  gridSizeY: number;
  guidesEnabled: boolean;
  guides: SnapGuide[];
  objectSnapEnabled: boolean;
  version: number;
}

export interface SnapResult {
  readonly x: number;
  readonly y: number;
  readonly snappedX: boolean;
  readonly snappedY: boolean;
}

export function createSnapConfig(): SnapConfig {
  return {
    gridEnabled: false,
    gridSizeX: 10,
    gridSizeY: 10,
    guidesEnabled: false,
    guides: [],
    objectSnapEnabled: false,
    version: 0,
  };
}

export function setSnapGrid(config: SnapConfig, gridSizeX: number, gridSizeY: number): void {
  if (config.gridSizeX === gridSizeX && config.gridSizeY === gridSizeY) return;
  config.gridSizeX = gridSizeX;
  config.gridSizeY = gridSizeY;
  config.version++;
}

export function enableSnapGrid(config: SnapConfig, enabled: boolean): void {
  if (config.gridEnabled === enabled) return;
  config.gridEnabled = enabled;
  config.version++;
}

export function addSnapGuide(config: SnapConfig, guide: Readonly<SnapGuide>): void {
  config.guides.push({ ...guide });
  config.version++;
}

export function removeSnapGuide(config: SnapConfig, index: number): void {
  if (index < 0 || index >= config.guides.length) return;
  config.guides.splice(index, 1);
  config.version++;
}

export function clearSnapGuides(config: SnapConfig): void {
  if (config.guides.length === 0) return;
  config.guides.length = 0;
  config.version++;
}

function nearestGuide(
  guides: readonly SnapGuide[],
  axis: SnapGuide['axis'],
  value: number,
  threshold: number,
): number | null {
  let nearest: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const guide of guides) {
    if (guide.axis !== axis) continue;
    const distance = Math.abs(guide.position - value);
    if (distance <= threshold && distance < nearestDistance) {
      nearest = guide.position;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function snapPosition(config: Readonly<SnapConfig>, x: number, y: number, threshold = 5): SnapResult {
  let snappedX = false;
  let snappedY = false;
  let resultX = x;
  let resultY = y;

  if (config.gridEnabled) {
    if (config.gridSizeX > 0) {
      resultX = Math.round(resultX / config.gridSizeX) * config.gridSizeX;
      snappedX = true;
    }
    if (config.gridSizeY > 0) {
      resultY = Math.round(resultY / config.gridSizeY) * config.gridSizeY;
      snappedY = true;
    }
  }

  if (config.guidesEnabled) {
    const guideX = nearestGuide(config.guides, 'x', resultX, threshold);
    const guideY = nearestGuide(config.guides, 'y', resultY, threshold);
    if (guideX !== null) {
      resultX = guideX;
      snappedX = true;
    }
    if (guideY !== null) {
      resultY = guideY;
      snappedY = true;
    }
  }

  return { x: resultX, y: resultY, snappedX, snappedY };
}
