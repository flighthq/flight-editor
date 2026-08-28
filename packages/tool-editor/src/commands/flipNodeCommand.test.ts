import { createDisplayObject } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createFlipNodeCommand } from './flipNodeCommand';

describe('createFlipNodeCommand', () => {
  it('flips multiple horizontal scales from captured transforms and restores them', () => {
    const first = createDisplayObject({ x: 3, scaleX: 2, scaleY: 4 });
    const second = createDisplayObject({ rotation: 0.5, scaleX: -3, scaleY: 5 });
    const command = createFlipNodeCommand([first, second], 'horizontal');
    first.scaleX = 100;
    command.execute();
    expect([first.scaleX, second.scaleX]).toEqual([-2, 3]);
    expect([first.scaleY, second.scaleY]).toEqual([4, 5]);
    expect(first.x).toBe(3);
    expect(second.rotation).toBe(0.5);
    command.undo();
    expect([first.scaleX, second.scaleX]).toEqual([2, -3]);
    expect(command.label).toBe('Flip Horizontally');
  });

  it('flips vertical scale and supports empty input', () => {
    const node = createDisplayObject({ scaleX: 2, scaleY: -4 });
    const command = createFlipNodeCommand([node], 'vertical');
    command.execute();
    expect(node.scaleX).toBe(2);
    expect(node.scaleY).toBe(4);
    command.undo();
    expect(node.scaleY).toBe(-4);
    expect(() => createFlipNodeCommand([], 'vertical').execute()).not.toThrow();
    expect(command.label).toBe('Flip Vertically');
  });
});
