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
  it('starts with all snapping disabled and a ten-unit grid', () => {
    const config = createSnapConfig();

    expect(config).toEqual({
      gridEnabled: false,
      gridSizeX: 10,
      gridSizeY: 10,
      guidesEnabled: false,
      guides: [],
      objectSnapEnabled: false,
      version: 0,
    });
  });

  it('returns raw coordinates while snapping is disabled', () => {
    const config = createSnapConfig();

    expect(snapPosition(config, 13, 27)).toEqual({ x: 13, y: 27, snappedX: false, snappedY: false });
  });

  it.each([
    [5, 5, 12, 13, 10, 15],
    [10, 20, 13, 27, 10, 20],
    [25, 50, 38, 76, 50, 100],
  ])('snaps to a %i by %i grid', (gridX, gridY, x, y, expectedX, expectedY) => {
    const config = createSnapConfig();
    setSnapGrid(config, gridX, gridY);
    enableSnapGrid(config, true);

    expect(snapPosition(config, x, y)).toEqual({ x: expectedX, y: expectedY, snappedX: true, snappedY: true });
  });

  it('does not apply a configured grid while it is disabled', () => {
    const config = createSnapConfig();
    setSnapGrid(config, 3, 7);

    expect(snapPosition(config, 5, 10)).toEqual({ x: 5, y: 10, snappedX: false, snappedY: false });
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

  it('ignores guides beyond the threshold', () => {
    const config = createSnapConfig();
    config.guidesEnabled = true;
    addSnapGuide(config, { axis: 'x', position: 20 });
    addSnapGuide(config, { axis: 'y', position: 30 });

    expect(snapPosition(config, 14, 24, 5)).toEqual({ x: 14, y: 24, snappedX: false, snappedY: false });
  });

  it('includes guides exactly on the threshold boundary', () => {
    const config = createSnapConfig();
    config.guidesEnabled = true;
    addSnapGuide(config, { axis: 'x', position: 20 });

    expect(snapPosition(config, 15, 10, 5)).toEqual({ x: 20, y: 10, snappedX: true, snappedY: false });
  });

  it('applies guide snapping after grid snapping', () => {
    const config = createSnapConfig();
    setSnapGrid(config, 10, 10);
    enableSnapGrid(config, true);
    config.guidesEnabled = true;
    addSnapGuide(config, { axis: 'x', position: 12 });

    expect(snapPosition(config, 8, 13, 3)).toEqual({ x: 12, y: 10, snappedX: true, snappedY: true });
  });

  it('leaves a zero-sized grid axis unsnapped', () => {
    const config = createSnapConfig();
    setSnapGrid(config, 0, 10);
    enableSnapGrid(config, true);

    expect(snapPosition(config, 7, 7)).toEqual({ x: 7, y: 10, snappedX: false, snappedY: true });
  });

  it('stores the object-snap enabled flag without applying object snapping', () => {
    const config = createSnapConfig();
    config.objectSnapEnabled = true;

    expect(config.objectSnapEnabled).toBe(true);
    expect(snapPosition(config, 3, 4)).toEqual({ x: 3, y: 4, snappedX: false, snappedY: false });
  });

  it('removes a guide by index', () => {
    const config = createSnapConfig();
    addSnapGuide(config, { axis: 'x', position: 10 });
    addSnapGuide(config, { axis: 'y', position: 20 });
    removeSnapGuide(config, 0);

    expect(config.guides).toEqual([{ axis: 'y', position: 20 }]);
    expect(config.version).toBe(3);
  });

  it('does not change state when removing an out-of-bounds guide', () => {
    const config = createSnapConfig();
    addSnapGuide(config, { axis: 'x', position: 10 });

    removeSnapGuide(config, -1);
    removeSnapGuide(config, 1);

    expect(config.guides).toEqual([{ axis: 'x', position: 10 }]);
    expect(config.version).toBe(1);
  });

  it('clears guides and only increments when guides exist', () => {
    const config = createSnapConfig();
    clearSnapGuides(config);
    expect(config.version).toBe(0);

    addSnapGuide(config, { axis: 'y', position: 20 });

    clearSnapGuides(config);
    clearSnapGuides(config);

    expect(config.guides).toEqual([]);
    expect(config.version).toBe(2);
  });
});
