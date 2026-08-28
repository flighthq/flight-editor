import { addNodeChild, getNodeHeight, getNodeWidth, setNodeHeight, setNodeWidth } from '@flighthq/node';
import { createDisplayObject, createHtmlView } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetNodeSizeCommand } from './setNodeSizeCommand';

describe('createSetNodeSizeCommand', () => {
  it('sets rendered width and height and restores both captured dimensions', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 100, height: 50 } });
    addNodeChild(parent, node);
    const command = createSetNodeSizeCommand(node, 240, 90);
    command.execute();
    expect(getNodeWidth(node)).toBeCloseTo(240);
    expect(getNodeHeight(node)).toBeCloseTo(90);
    command.undo();
    expect(getNodeWidth(node)).toBeCloseTo(100);
    expect(getNodeHeight(node)).toBeCloseTo(50);
    expect(command.label).toBe('Set Node Size');
  });

  it('captures dimensions at command creation', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 20, height: 30 } });
    addNodeChild(parent, node);
    const command = createSetNodeSizeCommand(node, 40, 60);
    setNodeWidth(node, 100);
    setNodeHeight(node, 180);
    command.execute();
    command.undo();
    expect(getNodeWidth(node)).toBeCloseTo(20);
    expect(getNodeHeight(node)).toBeCloseTo(30);
  });

  it('multiple undo/redo cycles are stable', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 10, height: 20 } });
    addNodeChild(parent, node);
    const command = createSetNodeSizeCommand(node, 50, 60);

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(getNodeWidth(node)).toBeCloseTo(50);
      expect(getNodeHeight(node)).toBeCloseTo(60);
      command.undo();
      expect(getNodeWidth(node)).toBeCloseTo(10);
      expect(getNodeHeight(node)).toBeCloseTo(20);
    }
  });

  it('same size is a valid identity operation', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 80, height: 40 } });
    addNodeChild(parent, node);
    const command = createSetNodeSizeCommand(node, 80, 40);
    command.execute();
    expect(getNodeWidth(node)).toBeCloseTo(80);
    expect(getNodeHeight(node)).toBeCloseTo(40);
    command.undo();
    expect(getNodeWidth(node)).toBeCloseTo(80);
    expect(getNodeHeight(node)).toBeCloseTo(40);
  });

  it('supports zero width and height', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 80, height: 40 } });
    addNodeChild(parent, node);
    const command = createSetNodeSizeCommand(node, 0, 0);

    command.execute();
    expect(getNodeWidth(node)).toBeCloseTo(0);
    expect(getNodeHeight(node)).toBeCloseTo(0);
    command.undo();
    expect(getNodeWidth(node)).toBeCloseTo(80);
    expect(getNodeHeight(node)).toBeCloseTo(40);
  });

  it('does not mutate dimensions before execution', () => {
    const parent = createDisplayObject();
    const node = createHtmlView({ data: { width: 25, height: 35 } });
    addNodeChild(parent, node);

    createSetNodeSizeCommand(node, 50, 70);

    expect(getNodeWidth(node)).toBeCloseTo(25);
    expect(getNodeHeight(node)).toBeCloseTo(35);
  });
});
