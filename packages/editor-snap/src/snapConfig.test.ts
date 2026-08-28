import { describe, expect, it } from 'vitest';

import {
  addSnapGuide,
  clearSnapGuides,
  createSnapConfig,
  enableSnapGrid,
  removeSnapGuide,
  setSnapGrid,
  snapPosition,
} from './snapConfig';

describe('snapConfig', () => {
  it('returns raw coordinates while snapping is disabled', () => {
    const config = createSnapConfig();

    expect(snapPosition(config, 13, 27)).toEqual({ x: 13, y: 27, snappedX: false, snappedY: false });
  });

  it('snaps to the configured grid', () => {
    const config = createSnapConfig();
    setSnapGrid(config, 10, 20);
    enableSnapGrid(config, true);

    expect(snapPosition(config, 13, 27)).toEqual({ x: 10, y: 20, snappedX: true, snappedY: true });
  });

  it('snaps each axis to the nearest guide within the threshold', () => {
    const config = createSnapConfig();
    config.guidesEnabled = true;
    addSnapGuide(config, { axis: 'x', position: 12 });
    addSnapGuide(config, { axis: 'x', position: 14 });
    addSnapGuide(config, { axis: 'y', position: 30 });

    expect(snapPosition(config, 13.5, 26, 5)).toEqual({ x: 14, y: 30, snappedX: true, snappedY: true });
    expect(snapPosition(config, 20, 24, 5)).toEqual({ x: 20, y: 24, snappedX: false, snappedY: false });
  });

  it('applies guide snapping after grid snapping', () => {
    const config = createSnapConfig();
    setSnapGrid(config, 10, 10);
    enableSnapGrid(config, true);
    config.guidesEnabled = true;
    addSnapGuide(config, { axis: 'x', position: 12 });

    expect(snapPosition(config, 8, 13, 3)).toEqual({ x: 12, y: 10, snappedX: true, snappedY: true });
  });

  it('removes and clears guides with version tracking', () => {
    const config = createSnapConfig();
    addSnapGuide(config, { axis: 'x', position: 10 });
    addSnapGuide(config, { axis: 'y', position: 20 });
    removeSnapGuide(config, 0);
    removeSnapGuide(config, 10);

    expect(config.guides).toEqual([{ axis: 'y', position: 20 }]);
    expect(config.version).toBe(3);

    clearSnapGuides(config);
    clearSnapGuides(config);

    expect(config.guides).toEqual([]);
    expect(config.version).toBe(4);
  });
});
