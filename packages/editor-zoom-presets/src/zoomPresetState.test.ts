import {
  addZoomPreset,
  computeFitWidthZoom,
  computeFitZoom,
  createZoomPresetState,
  findNearestPreset,
  getNextZoomIn,
  getNextZoomOut,
  getZoomPreset,
  getZoomPresets,
  getZoomPresetVersion,
  removeZoomPreset,
} from './zoomPresetState';

describe('addZoomPreset', () => {
  it('adds and replaces presets with meaningful version bumps', () => {
    const state = createZoomPresetState();
    addZoomPreset(state, '300%', '300%', 3);
    expect(getZoomPreset(state, '300%')).toEqual({ id: '300%', label: '300%', zoom: 3 });
    addZoomPreset(state, '300%', 'Three hundred percent', 3);
    addZoomPreset(state, '300%', 'Three hundred percent', 3);
    expect(getZoomPreset(state, '300%')?.label).toBe('Three hundred percent');
    expect(state.version).toBe(2);
  });
});

describe('computeFitWidthZoom', () => {
  it('fits scene width and guards invalid dimensions', () => {
    expect(computeFitWidthZoom(1000, 500)).toBe(0.5);
    expect(computeFitWidthZoom(0, 500)).toBe(1);
    expect(computeFitWidthZoom(1000, 0)).toBe(1);
  });
});

describe('computeFitZoom', () => {
  it('uses the limiting viewport dimension', () => {
    expect(computeFitZoom(1000, 500, 500, 500)).toBe(0.5);
    expect(computeFitZoom(500, 1000, 500, 500)).toBe(0.5);
  });

  it('guards invalid dimensions', () => {
    expect(computeFitZoom(0, 500, 500, 500)).toBe(1);
    expect(computeFitZoom(500, 500, -1, 500)).toBe(1);
  });
});

describe('createZoomPresetState', () => {
  it('creates independent state with the built-in presets', () => {
    const first = createZoomPresetState();
    const second = createZoomPresetState();
    expect(first.presets).toEqual([
      { id: 'fit', label: 'Fit', zoom: 0 },
      { id: '50%', label: '50%', zoom: 0.5 },
      { id: '100%', label: '100%', zoom: 1 },
      { id: '200%', label: '200%', zoom: 2 },
      { id: '400%', label: '400%', zoom: 4 },
    ]);
    first.presets[0].label = 'Changed';
    expect(second.presets[0].label).toBe('Fit');
    expect(first.version).toBe(0);
  });
});

describe('findNearestPreset', () => {
  it('finds the closest real zoom and ignores the fit sentinel', () => {
    const state = createZoomPresetState();
    expect(findNearestPreset(state, 1.4)?.id).toBe('100%');
    expect(findNearestPreset(state, 1.6)?.id).toBe('200%');
    expect(findNearestPreset(state, 0.1)?.id).toBe('50%');
  });

  it('returns null when no positive presets remain', () => {
    const state = { presets: [{ id: 'fit', label: 'Fit', zoom: 0 }], version: 0 };
    expect(findNearestPreset(state, 1)).toBeNull();
  });
});

describe('getNextZoomIn', () => {
  it('returns the next higher distinct preset or null', () => {
    const state = createZoomPresetState();
    expect(getNextZoomIn(state, 0.5)).toBe(1);
    expect(getNextZoomIn(state, 1.2)).toBe(2);
    expect(getNextZoomIn(state, 4)).toBeNull();
  });
});

describe('getNextZoomOut', () => {
  it('returns the next lower distinct preset or null', () => {
    const state = createZoomPresetState();
    expect(getNextZoomOut(state, 2)).toBe(1);
    expect(getNextZoomOut(state, 1.2)).toBe(1);
    expect(getNextZoomOut(state, 0.5)).toBeNull();
  });
});

describe('getZoomPreset', () => {
  it('finds a preset by id or returns null', () => {
    const state = createZoomPresetState();
    expect(getZoomPreset(state, '100%')?.zoom).toBe(1);
    expect(getZoomPreset(state, 'missing')).toBeNull();
  });
});

describe('getZoomPresets', () => {
  it('returns presets in display order', () => {
    expect(getZoomPresets(createZoomPresetState()).map((preset) => preset.id)).toEqual([
      'fit',
      '50%',
      '100%',
      '200%',
      '400%',
    ]);
  });
});

describe('getZoomPresetVersion', () => {
  it('returns the current version', () => {
    const state = createZoomPresetState();
    addZoomPreset(state, '300%', '300%', 3);
    expect(getZoomPresetVersion(state)).toBe(1);
  });
});

describe('removeZoomPreset', () => {
  it('removes an existing preset and no-ops for missing ids', () => {
    const state = createZoomPresetState();
    expect(removeZoomPreset(state, '200%')).toBe(true);
    expect(removeZoomPreset(state, '200%')).toBe(false);
    expect(getZoomPreset(state, '200%')).toBeNull();
    expect(state.version).toBe(1);
  });
});
