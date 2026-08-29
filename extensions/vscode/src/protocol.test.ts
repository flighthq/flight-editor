import { describe, expect, it } from 'vitest';

import { isWebviewMessage } from './protocol';

describe('isWebviewMessage', () => {
  it('accepts lifecycle and valid node update messages', () => {
    expect(isWebviewMessage({ type: 'ready' })).toBe(true);
    expect(isWebviewMessage({ type: 'openSource' })).toBe(true);
    expect(isWebviewMessage({ type: 'selectNode', path: [0, 1] })).toBe(true);
    expect(isWebviewMessage({ type: 'updateNode', baseVersion: 2, path: [0, 1], property: 'x', value: 42 })).toBe(true);
  });

  it('rejects malformed and unsafe updates', () => {
    expect(isWebviewMessage({ type: 'updateNode', baseVersion: 2, path: [-1], property: '__proto__', value: 1 })).toBe(
      false,
    );
    expect(isWebviewMessage(null)).toBe(false);
    expect(isWebviewMessage({ type: 'selectNode', path: [-1] })).toBe(false);
  });
});
