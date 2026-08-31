import { describe, expect, it } from 'vitest';

import { planAlignment, planDistribution } from './alignGeometry';

const items = [
  { id: 'a', bounds: { x: 0, y: 0, width: 10, height: 10 } },
  { id: 'b', bounds: { x: 30, y: 20, width: 20, height: 20 } },
  { id: 'c', bounds: { x: 80, y: 40, width: 10, height: 30 } },
];

describe('planAlignment', () => {
  it('plans selection, artboard, and key-object alignment without mutating input', () => {
    expect(planAlignment(items, 'center', 'selection')).toEqual([
      { id: 'a', x: 40 },
      { id: 'b', x: 35 },
      { id: 'c', x: 40 },
    ]);
    expect(planAlignment(items, 'bottom', 'artboard', { artboard: { x: 0, y: 0, width: 100, height: 100 } })).toEqual([
      { id: 'a', y: 90 },
      { id: 'b', y: 80 },
      { id: 'c', y: 70 },
    ]);
    expect(planAlignment(items, 'left', 'key-object', { keyObjectId: 'b' })).toEqual([
      { id: 'a', x: 30 },
      { id: 'c', x: 30 },
    ]);
    expect(items[0]!.bounds.x).toBe(0);
  });

  it('rejects missing references and poisoned geometry', () => {
    expect(() => planAlignment(items, 'left', 'key-object', { keyObjectId: 'missing' })).toThrow('part');
    expect(() =>
      planAlignment([{ id: 'bad', bounds: { x: 0, y: 0, width: -1, height: 1 } }], 'left', 'selection'),
    ).toThrow('Invalid bounds');
  });
});

describe('planDistribution', () => {
  it('distributes interior objects using equal edge gaps', () => {
    expect(planDistribution(items, 'horizontal', 'equal-spacing')).toEqual([{ id: 'b', x: 35 }]);
  });

  it('plans average equal sizes while preserving positions', () => {
    expect(planDistribution(items, 'horizontal', 'equal-size')).toEqual([
      { id: 'a', width: 40 / 3 },
      { id: 'b', width: 40 / 3 },
      { id: 'c', width: 40 / 3 },
    ]);
  });
});
