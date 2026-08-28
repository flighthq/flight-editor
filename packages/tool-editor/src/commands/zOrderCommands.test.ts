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

describe('createBringForwardCommand', () => {
  it('is exported', () => expect(createBringForwardCommand).toBeTypeOf('function'));
});

describe('createBringToFrontCommand', () => {
  it('is exported', () => expect(createBringToFrontCommand).toBeTypeOf('function'));
});

describe('createSendBackwardCommand', () => {
  it('is exported', () => expect(createSendBackwardCommand).toBeTypeOf('function'));
});

describe('createSendToBackCommand', () => {
  it('is exported', () => expect(createSendToBackCommand).toBeTypeOf('function'));
});

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

  it('supports re-execute after undo for bring forward', () => {
    const { parent, children } = createSiblings();
    const [a, b, c, d] = children;
    const command = createBringForwardCommand(a);

    command.execute();
    command.undo();
    command.execute();

    expect(readChildren(parent)).toEqual([b, a, c, d]);
  });

  it('bring to front is no-op for last child', () => {
    const { parent, children } = createSiblings();
    const command = createBringToFrontCommand(children[3]);

    command.execute();
    expect(readChildren(parent)).toEqual(children);
  });

  it('send to back is no-op for first child', () => {
    const { parent, children } = createSiblings();
    const command = createSendToBackCommand(children[0]);

    command.execute();
    expect(readChildren(parent)).toEqual(children);
  });

  it('handles single child without error', () => {
    const parent = createNode2D(DisplayObjectKind);
    const only = createNode2D(DisplayObjectKind);
    addNodeChild(parent, only);

    const forward = createBringForwardCommand(only);
    const backward = createSendBackwardCommand(only);
    const front = createBringToFrontCommand(only);
    const back = createSendToBackCommand(only);

    for (const cmd of [forward, backward, front, back]) {
      cmd.execute();
      expect(readChildren(parent)).toEqual([only]);
      cmd.undo();
      expect(readChildren(parent)).toEqual([only]);
    }
  });
});
