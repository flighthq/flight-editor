import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createDisplayObject } from '@flighthq/scene2d';
import type { Shape, ShapeCommandToken } from '@flighthq/types';
import { ShapeKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createFromShapeCommand } from './createFromShapeCommand';

describe('createFromShapeCommand', () => {
  it('creates a named shape from a snapshot of the supplied command stream', () => {
    const parent = createDisplayObject();
    const coordinates = [1, 2];
    const shapeCommands: ShapeCommandToken[] = ['moveTo', 2, ...coordinates, 'lineTo', 2, 5, 6];
    const command = createFromShapeCommand(parent, shapeCommands, 'Diagonal');
    coordinates[0] = 100;
    shapeCommands.length = 0;

    command.execute();
    const shape = getNodeChildAt(parent, 0) as Shape;
    expect(shape.kind).toBe(ShapeKind);
    expect(shape.name).toBe('Diagonal');
    expect(shape.data.commands).toEqual(['moveTo', 2, 1, 2, 'lineTo', 2, 5, 6]);
    expect(command.label).toBe('Create Shape');

    command.undo();
    expect(getNodeChildCount(parent)).toBe(0);
    expect(getNodeParent(shape)).toBeNull();

    command.execute();
    expect(getNodeChildAt(parent, 0)).toBe(shape);
  });

  it('uses the Flight default name when none is supplied', () => {
    const parent = createDisplayObject();
    const command = createFromShapeCommand(parent, []);
    command.execute();
    expect(getNodeChildAt(parent, 0)?.name).toBeNull();
  });

  it('preserves existing siblings in the parent', () => {
    const parent = createDisplayObject();
    const sibling = createDisplayObject();
    addNodeChild(parent, sibling);
    const command = createFromShapeCommand(parent, ['moveTo', 2, 0, 0], 'Test');
    command.execute();
    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(sibling);
    command.undo();
    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(sibling);
  });

  it('multiple undo/redo cycles reuse the same shape instance', () => {
    const parent = createDisplayObject();
    const command = createFromShapeCommand(parent, ['moveTo', 2, 5, 5], 'Stable');
    command.execute();
    const shape = getNodeChildAt(parent, 0);
    command.undo();

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(getNodeChildAt(parent, 0)).toBe(shape);
      command.undo();
      expect(getNodeChildCount(parent)).toBe(0);
    }
  });

  it('creates a valid shape from an empty command stream', () => {
    const parent = createDisplayObject();
    const command = createFromShapeCommand(parent, [], 'Empty');

    command.execute();

    const shape = getNodeChildAt(parent, 0) as Shape;
    expect(shape.kind).toBe(ShapeKind);
    expect(shape.data.commands).toEqual([]);
  });

  it('clones array tokens independently from the caller', () => {
    const parent = createDisplayObject();
    const matrixToken: number[] = [1, 0, 0, 1, 10, 20];
    const command = createFromShapeCommand(parent, ['beginBitmapFill', 3, matrixToken]);
    matrixToken[4] = 999;

    command.execute();

    const shape = getNodeChildAt(parent, 0) as Shape;
    expect(shape.data.commands[2]).toEqual([1, 0, 0, 1, 10, 20]);
    expect(shape.data.commands[2]).not.toBe(matrixToken);
  });
});
