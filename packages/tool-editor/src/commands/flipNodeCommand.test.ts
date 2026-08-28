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

  it('double flip restores original scale', () => {
    const node = createDisplayObject({ scaleX: 3, scaleY: 5 });
    const flip1 = createFlipNodeCommand([node], 'horizontal');
    flip1.execute();
    expect(node.scaleX).toBe(-3);
    const flip2 = createFlipNodeCommand([node], 'horizontal');
    flip2.execute();
    expect(node.scaleX).toBe(3);
    expect(node.scaleY).toBe(5);
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createDisplayObject({ scaleX: 2, scaleY: -3 });
    const command = createFlipNodeCommand([node], 'vertical');

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(node.scaleY).toBe(3);
      command.undo();
      expect(node.scaleY).toBe(-3);
    }
  });

  it('preserves position, rotation, skew, and pivot during a vertical flip', () => {
    const node = createDisplayObject({
      x: 11,
      y: 12,
      rotation: 0.75,
      scaleX: 2,
      scaleY: 3,
      skewX: 0.1,
      skewY: 0.2,
      pivotX: 4,
      pivotY: 5,
    });

    createFlipNodeCommand([node], 'vertical').execute();

    expect(node).toMatchObject({
      x: 11,
      y: 12,
      rotation: 0.75,
      scaleX: 2,
      scaleY: -3,
      skewX: 0.1,
      skewY: 0.2,
      pivotX: 4,
      pivotY: 5,
    });
  });

  it('horizontal and vertical commands compose and undo independently', () => {
    const node = createDisplayObject({ scaleX: 2, scaleY: 3 });
    const horizontal = createFlipNodeCommand([node], 'horizontal');
    horizontal.execute();
    const vertical = createFlipNodeCommand([node], 'vertical');
    vertical.execute();
    expect([node.scaleX, node.scaleY]).toEqual([-2, -3]);

    vertical.undo();
    expect([node.scaleX, node.scaleY]).toEqual([-2, 3]);
    horizontal.undo();
    expect([node.scaleX, node.scaleY]).toEqual([2, 3]);
  });
});
