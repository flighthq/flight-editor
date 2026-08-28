import { addGuide, createGuidesState } from '@flighthq/editor-guides';
import { createSnapConfig, enableSnapGrid, setSnapGrid } from '@flighthq/editor-snap';
import { describe, expect, it } from 'vitest';

import { snapDimension, snapPosition, snapToGrid, snapToGuides } from './snapUtils';

describe('snapToGrid', () => {
  it('snaps independently to enabled positive grid axes', () => {
    const snap = createSnapConfig();
    expect(snapToGrid(snap, 14, 27)).toEqual({ x: 14, y: 27 });
    enableSnapGrid(snap, true);
    setSnapGrid(snap, 10, 8);
    expect(snapToGrid(snap, 14, 27)).toEqual({ x: 10, y: 24 });
    setSnapGrid(snap, 0, 8);
    expect(snapToGrid(snap, 14, 27)).toEqual({ x: 14, y: 24 });
  });
});

describe('snapToGuides', () => {
  it('selects the nearest guide on each axis within an inclusive threshold', () => {
    const guides = createGuidesState();
    addGuide(guides, 'horizontal', 20);
    addGuide(guides, 'horizontal', 24);
    addGuide(guides, 'vertical', 10);
    expect(snapToGuides(guides, 13, 22.5, 3)).toEqual({
      x: 10,
      y: 24,
      snappedH: true,
      snappedV: true,
    });
    expect(snapToGuides(guides, 100, 100, 3)).toEqual({
      x: 100,
      y: 100,
      snappedH: false,
      snappedV: false,
    });
  });

  it('returns unsnapped result when no guides exist', () => {
    const guides = createGuidesState();
    expect(snapToGuides(guides, 50, 50, 10)).toEqual({
      x: 50,
      y: 50,
      snappedH: false,
      snappedV: false,
    });
  });
});

describe('snapPosition', () => {
  it('combines grid and guides with guides winning per axis from the original point', () => {
    const snap = createSnapConfig();
    enableSnapGrid(snap, true);
    setSnapGrid(snap, 10, 10);
    snap.guidesEnabled = true;
    const guides = createGuidesState();
    addGuide(guides, 'vertical', 14);
    addGuide(guides, 'horizontal', 50);
    expect(snapPosition(snap, guides, 13, 26, 2)).toEqual({
      x: 14,
      y: 30,
      snappedH: false,
      snappedV: true,
    });
  });
});

describe('snapDimension', () => {
  it('uses the horizontal grid size when grid snapping is enabled', () => {
    const snap = createSnapConfig();
    expect(snapDimension(snap, 27)).toBe(27);
    enableSnapGrid(snap, true);
    setSnapGrid(snap, 8, 12);
    expect(snapDimension(snap, 27)).toBe(24);
    setSnapGrid(snap, 0, 12);
    expect(snapDimension(snap, 27)).toBe(27);
  });
});
