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
});
