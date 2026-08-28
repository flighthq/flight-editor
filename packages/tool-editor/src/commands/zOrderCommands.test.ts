import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import type { Node2D } from '@flighthq/types';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  createBringForwardCommand,
  createBringToFrontCommand,
  createSendBackwardCommand,
  createSendToBackCommand,
} from './zOrderCommands';

function createSiblings(): { parent: Node2D; children: Node2D[] } {
  const parent = createNode2D(DisplayObjectKind);
  const children = Array.from({ length: 4 }, () => createNode2D(DisplayObjectKind));
  for (const child of children) addNodeChild(parent, child);
  return { parent, children };
}

function readChildren(parent: Node2D): Array<Node2D | null> {
  return Array.from({ length: getNodeChildCount(parent) }, (_, index) => getNodeChildAt(parent, index));
}

describe('z-order commands', () => {
  it('brings a node forward one position and restores it on undo', () => {
    const { parent, children } = createSiblings();
    const [a, b, c, d] = children;
    const command = createBringForwardCommand(b);

    expect(command.label).toBe('Bring Forward');
    command.execute();
    expect(readChildren(parent)).toEqual([a, c, b, d]);
    command.undo();
    expect(readChildren(parent)).toEqual(children);
  });

  it('sends a node backward one position and restores it on undo', () => {
    const { parent, children } = createSiblings();
    const [a, b, c, d] = children;
    const command = createSendBackwardCommand(c);

    expect(command.label).toBe('Send Backward');
    command.execute();
    expect(readChildren(parent)).toEqual([a, c, b, d]);
    command.undo();
    expect(readChildren(parent)).toEqual(children);
  });

  it('brings a node to the front and restores it on undo', () => {
    const { parent, children } = createSiblings();
    const [a, b, c, d] = children;
    const command = createBringToFrontCommand(b);

    expect(command.label).toBe('Bring to Front');
    command.execute();
    expect(readChildren(parent)).toEqual([a, c, d, b]);
    command.undo();
    expect(readChildren(parent)).toEqual(children);
  });

  it('sends a node to the back and restores it on undo', () => {
    const { parent, children } = createSiblings();
    const [a, b, c, d] = children;
    const command = createSendToBackCommand(c);

    expect(command.label).toBe('Send to Back');
    command.execute();
    expect(readChildren(parent)).toEqual([c, a, b, d]);
    command.undo();
    expect(readChildren(parent)).toEqual(children);
  });

  it('keeps boundary nodes in place', () => {
    const { parent, children } = createSiblings();
    const firstCommand = createSendBackwardCommand(children[0]);
    const lastCommand = createBringForwardCommand(children[3]);

    firstCommand.execute();
    lastCommand.execute();
    expect(readChildren(parent)).toEqual(children);

    lastCommand.undo();
    firstCommand.undo();
    expect(readChildren(parent)).toEqual(children);
  });
});
