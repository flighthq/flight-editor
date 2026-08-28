import { getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
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
});
