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
});
