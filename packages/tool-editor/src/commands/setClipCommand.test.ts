import { createClipRegionFromRectangle, equalsClipRegion, setClipRegionToRectangle } from '@flighthq/clip';
import { createDisplayObject, setNode2DClip } from '@flighthq/scene2d';
import { describe, expect, it } from 'vitest';

import { createSetClipCommand } from './setClipCommand';

describe('createSetClipCommand', () => {
  it('snapshots new and previous clip geometry for execute and undo', () => {
    const node = createDisplayObject();
    const previous = createClipRegionFromRectangle({ x: 1, y: 2, width: 3, height: 4 });
    const next = createClipRegionFromRectangle({ x: 10, y: 20, width: 30, height: 40 });
    setNode2DClip(node, previous);
    const command = createSetClipCommand(node, next);
    setClipRegionToRectangle(previous, { x: 100, y: 100, width: 1, height: 1 });
    setClipRegionToRectangle(next, { x: 200, y: 200, width: 1, height: 1 });

    command.execute();
    expect(node.clip).not.toBe(next);
    expect(equalsClipRegion(node.clip!, createClipRegionFromRectangle({ x: 10, y: 20, width: 30, height: 40 }))).toBe(
      true,
    );

    command.undo();
    expect(equalsClipRegion(node.clip!, createClipRegionFromRectangle({ x: 1, y: 2, width: 3, height: 4 }))).toBe(true);
  });

  it('supports clearing and restoring a clip', () => {
    const node = createDisplayObject();
    const previous = createClipRegionFromRectangle({ x: 0, y: 0, width: 10, height: 10 });
    setNode2DClip(node, previous);
    const command = createSetClipCommand(node, null);
    command.execute();
    expect(node.clip).toBeNull();
    command.undo();
    expect(node.clip).not.toBeNull();
    expect(command.label).toBe('Set Clip');
  });
});
