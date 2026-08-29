import { describe, expect, it } from 'vitest';

import { isWebviewMessage } from './protocol';

describe('isWebviewMessage', () => {
  it('accepts lifecycle and valid node update messages', () => {
    expect(isWebviewMessage({ type: 'ready' })).toBe(true);
    expect(isWebviewMessage({ type: 'openSource' })).toBe(true);
    expect(isWebviewMessage({ type: 'selectNode', paths: [[0, 1]] })).toBe(true);
    expect(isWebviewMessage({ type: 'updateNode', baseVersion: 2, paths: [[0, 1]], property: 'x', value: 42 })).toBe(
      true,
    );
  });

  it('rejects malformed and unsafe updates', () => {
    expect(
      isWebviewMessage({ type: 'updateNode', baseVersion: 2, paths: [[-1]], property: '__proto__', value: 1 }),
    ).toBe(false);
    expect(isWebviewMessage(null)).toBe(false);
    expect(isWebviewMessage({ type: 'selectNode', paths: [[-1]] })).toBe(false);
  });

  it('validates scene construction actions', () => {
    expect(
      isWebviewMessage({
        type: 'sceneAction',
        baseVersion: 2,
        operation: { action: 'create', kind: 'display-object', parentPath: [] },
      }),
    ).toBe(true);
    expect(
      isWebviewMessage({
        type: 'sceneAction',
        baseVersion: 2,
        operation: { action: 'reparent', path: [0], parentPath: [1] },
      }),
    ).toBe(true);
    expect(
      isWebviewMessage({
        type: 'sceneAction',
        baseVersion: 2,
        operation: { action: 'delete', paths: 'all' },
      }),
    ).toBe(false);
    expect(
      isWebviewMessage({
        type: 'sceneAction',
        baseVersion: 2,
        operation: { action: 'translate', paths: [[0]], deltaX: 2, deltaY: 3, snap: true },
      }),
    ).toBe(true);
    expect(
      isWebviewMessage({
        type: 'sceneAction',
        baseVersion: 2,
        operation: { action: 'transform', paths: [[0]], scaleFactor: 1.5, rotationDelta: 0.2 },
      }),
    ).toBe(true);
  });
});
