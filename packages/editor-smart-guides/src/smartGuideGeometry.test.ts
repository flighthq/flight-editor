import { describe, expect, it } from 'vitest';

import { matchSmartGuides, validateSmartGuides } from './smartGuideGeometry';

describe('matchSmartGuides', () => {
  it('chooses deterministic nearest horizontal and vertical matches', () => {
    const result = matchSmartGuides(
      { x: 9, y: 21, width: 10, height: 10 },
      [
        { id: 'target', bounds: { x: 20, y: 10, width: 10, height: 10 } },
        { id: 'other', bounds: { x: 100, y: 100, width: 10, height: 10 } },
      ],
      2,
    );
    expect(result.delta).toEqual({ x: 1, y: -1 });
    expect(result.guides.map(({ orientation, position }) => [orientation, position])).toEqual([
      ['horizontal', 20],
      ['vertical', 20],
    ]);
  });

  it('rejects invalid tolerance, geometry, and duplicate target identities', () => {
    expect(() => matchSmartGuides({ x: 0, y: 0, width: 1, height: 1 }, [], -1)).toThrow('tolerance');
    const target = { id: 'same', bounds: { x: 0, y: 0, width: 1, height: 1 } };
    expect(() => matchSmartGuides(target.bounds, [target, target], 1)).toThrow('duplicate');
  });
});

describe('validateSmartGuides', () => {
  it('reports malformed and duplicate hydrated guides', () => {
    const guide = {
      kind: 'edge' as const,
      orientation: 'vertical' as const,
      position: 2,
      from: 5,
      to: 1,
      label: null,
    };
    expect(validateSmartGuides([guide, guide])).toEqual(['duplicate-guide:1', 'invalid-guide:0', 'invalid-guide:1']);
  });
});
