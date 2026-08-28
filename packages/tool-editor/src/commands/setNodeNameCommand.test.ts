import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createSetNodeNameCommand } from './setNodeNameCommand';

describe('createSetNodeNameCommand', () => {
  it('sets a new name and restores the old name on undo', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'Original';
    const command = createSetNodeNameCommand(node, 'Renamed');

    command.execute();

    expect(node.name).toBe('Renamed');

    command.undo();

    expect(node.name).toBe('Original');
  });

  it('renames from null to a string', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = null;
    const command = createSetNodeNameCommand(node, 'NewName');

    command.execute();

    expect(node.name).toBe('NewName');

    command.undo();

    expect(node.name).toBeNull();
  });

  it('renames from a string to null', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'HasName';
    const command = createSetNodeNameCommand(node, null);

    command.execute();

    expect(node.name).toBeNull();

    command.undo();

    expect(node.name).toBe('HasName');
  });

  it('has the correct label', () => {
    const node = createNode2D(DisplayObjectKind);
    const command = createSetNodeNameCommand(node, 'Test');

    expect(command.label).toBe('Rename Node');
  });

  it('supports re-execute after undo', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'Original';
    const command = createSetNodeNameCommand(node, 'Renamed');

    command.execute();
    command.undo();
    command.execute();

    expect(node.name).toBe('Renamed');
  });

  it('sets an empty string name', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'HasName';
    const command = createSetNodeNameCommand(node, '');

    command.execute();
    expect(node.name).toBe('');

    command.undo();
    expect(node.name).toBe('HasName');
  });

  it('multiple undo/redo cycles are stable', () => {
    const node = createNode2D(DisplayObjectKind);
    node.name = 'A';
    const command = createSetNodeNameCommand(node, 'B');

    for (let i = 0; i < 3; i++) {
      command.execute();
      expect(node.name).toBe('B');
      command.undo();
      expect(node.name).toBe('A');
    }
  });
});
