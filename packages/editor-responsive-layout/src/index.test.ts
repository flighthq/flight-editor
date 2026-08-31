import { describe, expect, it } from 'vitest';

import * as layout from './index';

describe('@flighthq/editor-responsive-layout exports', () => {
  it('exposes its authoring surface', () => {
    expect(Object.keys(layout).sort()).toEqual([
      'createResponsiveLayoutCommand',
      'createResponsiveLayoutState',
      'getLayoutControlledFields',
      'getLayoutGestureIntent',
      'inferLayoutPins',
      'removeLayoutRule',
      'reorderLayoutChild',
      'restoreResponsiveLayout',
      'serializeResponsiveLayout',
      'setLayoutChild',
      'setLayoutContainer',
      'validateResponsiveLayout',
    ]);
  });
});
