import { createGrayscaleAdjustment, createInvertAdjustment } from '@flighthq/adjustments';
import { getNodeAppearanceRevision, getNodeColorAdjustments, setNodeColorAdjustments } from '@flighthq/node';
import { createDisplayObject } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetColorAdjustmentCommand } from './setColorAdjustmentCommand';

describe('createSetColorAdjustmentCommand', () => {
  it('snapshots new and old stacks, applies them, invalidates appearance, and restores', () => {
    const node = createDisplayObject();
    const previous = createInvertAdjustment();
    const next = createGrayscaleAdjustment();
    setNodeColorAdjustments(node, [previous]);
    const adjustments = [next];
    const command = createSetColorAdjustmentCommand(node, adjustments);
    adjustments.length = 0;
    const before = getNodeAppearanceRevision(node);

    command.execute();
    expect(getNodeColorAdjustments(node)).toEqual([next]);
    expect(getNodeAppearanceRevision(node)).toBeGreaterThan(before);
    command.undo();
    expect(getNodeColorAdjustments(node)).toEqual([previous]);
    expect(command.label).toBe('Set Color Adjustments');
  });

  it('restores the null default adjustment stack', () => {
    const node = createDisplayObject();
    const command = createSetColorAdjustmentCommand(node, [createInvertAdjustment()]);
    command.execute();
    expect(getNodeColorAdjustments(node)).toHaveLength(1);
    command.undo();
    expect(getNodeColorAdjustments(node)).toBeNull();
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createDisplayObject();
    const adj = createGrayscaleAdjustment();
    const command = createSetColorAdjustmentCommand(node, [adj]);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(getNodeColorAdjustments(node)).toEqual([adj]);
      command.undo();
      expect(getNodeColorAdjustments(node)).toBeNull();
    }
  });

  it('replaces a multi-adjustment stack', () => {
    const node = createDisplayObject();
    const inv = createInvertAdjustment();
    const gray = createGrayscaleAdjustment();
    setNodeColorAdjustments(node, [inv, gray]);

    const replacement = createInvertAdjustment();
    const command = createSetColorAdjustmentCommand(node, [replacement]);
    command.execute();
    expect(getNodeColorAdjustments(node)).toEqual([replacement]);
    command.undo();
    expect(getNodeColorAdjustments(node)).toEqual([inv, gray]);
  });
});
