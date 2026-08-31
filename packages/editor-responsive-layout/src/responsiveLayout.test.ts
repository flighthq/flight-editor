import { describe, expect, it } from 'vitest';

import { createCommandHistory, executeCommand, undo } from '@flighthq/editor-command';
import type { LayoutChildRule, LayoutContainerRule } from './responsiveLayout';
import {
  createResponsiveLayoutCommand,
  createResponsiveLayoutState,
  getLayoutControlledFields,
  getLayoutGestureIntent,
  inferLayoutPins,
  removeLayoutRule,
  reorderLayoutChild,
  restoreResponsiveLayout,
  serializeResponsiveLayout,
  setLayoutChild,
  setLayoutContainer,
  validateResponsiveLayout,
} from './responsiveLayout';

const container: LayoutContainerRule = {
  nodeId: 'frame',
  direction: 'horizontal',
  wrap: true,
  rowGap: 8,
  columnGap: 12,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  primaryAlignment: 'start',
  crossAlignment: 'baseline',
  widthSizing: 'fixed',
  heightSizing: 'hug',
  childOrder: [],
};
const child: LayoutChildRule = {
  nodeId: 'a',
  parentId: 'frame',
  widthSizing: 'fill',
  heightSizing: 'hug',
  absolute: false,
  pins: [],
  minWidth: 20,
  maxWidth: 200,
};

function fixture() {
  const state = createResponsiveLayoutState();
  setLayoutContainer(state, container);
  setLayoutChild(state, child);
  return state;
}

describe('createResponsiveLayoutState', () => {
  it('starts without authored declarations', () => expect(createResponsiveLayoutState()).toMatchObject({ version: 0 }));
});

describe('setLayoutContainer', () => {
  it('owns nested, wrapping, gap, padding, alignment, and sizing declarations', () => {
    const state = fixture();
    expect(state.containers.get('frame')).toMatchObject({
      wrap: true,
      rowGap: 8,
      crossAlignment: 'baseline',
      heightSizing: 'hug',
    });
  });
});

describe('setLayoutChild', () => {
  it('adds children to flow order and supports absolute children', () => {
    const state = fixture();
    setLayoutChild(state, { ...child, nodeId: 'overlay', absolute: true, widthSizing: 'fixed' });
    expect(state.containers.get('frame')?.childOrder).toEqual(['a', 'overlay']);
    expect(getLayoutGestureIntent(state, 'overlay', 'drag')).toBe('move');
  });
});

describe('removeLayoutRule', () => {
  it('removes child order references with the declaration', () => {
    const state = fixture();
    expect(removeLayoutRule(state, 'a')).toBe(true);
    expect(state.containers.get('frame')?.childOrder).toEqual([]);
  });
});

describe('reorderLayoutChild', () => {
  it('supports deterministic drag reordering', () => {
    const state = fixture();
    setLayoutChild(state, { ...child, nodeId: 'b' });
    expect(reorderLayoutChild(state, 'frame', 'b', 0)).toBe(true);
    expect(state.containers.get('frame')?.childOrder).toEqual(['b', 'a']);
  });
});

describe('inferLayoutPins', () => {
  it('proposes explicit constraints from geometry within tolerance', () => {
    expect(inferLayoutPins({ width: 100, height: 100 }, { x: 0, y: 40, width: 100, height: 20 })).toEqual([
      'left',
      'right',
      'center-x',
      'center-y',
    ]);
  });
});

describe('getLayoutControlledFields', () => {
  it('explains flow and fill/hug controlled properties', () => {
    const fields = getLayoutControlledFields(fixture(), 'a');
    expect(fields).toEqual([
      { field: 'x', controlled: true, reason: 'Position is controlled by parent flow' },
      { field: 'y', controlled: true, reason: 'Position is controlled by parent flow' },
      { field: 'width', controlled: true, reason: 'Width uses fill sizing' },
      { field: 'height', controlled: true, reason: 'Height uses hug sizing' },
    ]);
  });
});

describe('getLayoutGestureIntent', () => {
  it('distinguishes move/reorder and resize/scale gestures', () => {
    const state = fixture();
    expect(getLayoutGestureIntent(state, 'a', 'drag')).toBe('reorder');
    expect(getLayoutGestureIntent(state, 'a', 'resize')).toBe('resize');
    expect(getLayoutGestureIntent(state, 'a', 'resize', true)).toBe('scale');
  });
});

describe('validateResponsiveLayout', () => {
  it('reports contradictory ranges and fill/pin over-constraints', () => {
    const state = fixture();
    setLayoutChild(state, { ...child, minWidth: 100, maxWidth: 20, pins: ['left', 'right'] });
    expect(validateResponsiveLayout(state).map(({ code }) => code)).toEqual(['invalid-range', 'over-constrained']);
  });
});

describe('serializeResponsiveLayout', () => {
  it('creates stable identity-sorted data detached from live state', () => {
    const state = fixture();
    const value = serializeResponsiveLayout(state);
    value.containers[0]!.childOrder.push('mutated');
    expect(state.containers.get('frame')?.childOrder).toEqual(['a']);
  });
});

describe('restoreResponsiveLayout', () => {
  it('round-trips nested authored declarations and rejects broken parents', () => {
    const source = fixture();
    const target = createResponsiveLayoutState();
    restoreResponsiveLayout(target, serializeResponsiveLayout(source));
    expect(serializeResponsiveLayout(target)).toEqual(serializeResponsiveLayout(source));
    expect(() => restoreResponsiveLayout(target, { containers: [], children: [child] })).toThrow('Parent not found');
  });
});

describe('createResponsiveLayoutCommand', () => {
  it('undoes property and canvas authoring through shared history', () => {
    const state = fixture();
    const history = createCommandHistory();
    executeCommand(
      history,
      createResponsiveLayoutCommand(state, 'Make absolute', () => {
        setLayoutChild(state, { ...child, absolute: true });
      }),
    );
    expect(state.children.get('a')?.absolute).toBe(true);
    undo(history);
    expect(state.children.get('a')?.absolute).toBe(false);
  });
});
