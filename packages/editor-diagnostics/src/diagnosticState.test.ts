import { describe, expect, it } from 'vitest';

import {
  clearDiagnostics,
  createDiagnosticState,
  getDiagnosticRevision,
  getDiagnostics,
  publishDiagnostics,
  summarizeDiagnostics,
} from './diagnosticState';

const parseError = { code: 'yaml.parse', message: 'Invalid mapping', severity: 'error' as const, blocksMutation: true };

describe('createDiagnosticState', () => {
  it('creates an empty revision-aware store', () => expect(createDiagnosticState()).toMatchObject({ version: 0 }));
});

describe('publishDiagnostics', () => {
  it('publishes immutable batches and rejects stale revisions', () => {
    const state = createDiagnosticState();
    const input = [parseError];
    expect(publishDiagnostics(state, 'yaml', 2, input)).toBe(true);
    input.length = 0;
    expect(getDiagnostics(state, 'yaml')).toEqual([parseError]);
    expect(publishDiagnostics(state, 'yaml', 1, [])).toBe(false);
    expect(getDiagnosticRevision(state, 'yaml')).toBe(2);
  });

  it('validates diagnostic identity and ranges', () => {
    const state = createDiagnosticState();
    expect(() => publishDiagnostics(state, 'yaml', 1, [{ ...parseError, code: '' }])).toThrow();
    expect(() => publishDiagnostics(state, 'yaml', 1, [{ ...parseError, range: { start: 4, end: 2 } }])).toThrow();
  });

  it('does not bump the version for an identical same-revision batch', () => {
    const state = createDiagnosticState();
    publishDiagnostics(state, 'yaml', 1, [parseError]);
    publishDiagnostics(state, 'yaml', 1, [parseError]);
    expect(state.version).toBe(1);
  });
});

describe('clearDiagnostics', () => {
  it('clears one source or the complete store without spurious versions', () => {
    const state = createDiagnosticState();
    publishDiagnostics(state, 'yaml', 1, [parseError]);
    publishDiagnostics(state, 'assets', 1, [{ code: 'asset.missing', message: 'Missing', severity: 'warning' }]);
    expect(clearDiagnostics(state, 'yaml')).toBe(true);
    expect(clearDiagnostics(state, 'yaml')).toBe(false);
    expect(clearDiagnostics(state)).toBe(true);
    expect(getDiagnostics(state)).toEqual([]);
  });
});

describe('getDiagnostics', () => {
  it('orders aggregate diagnostics by source', () => {
    const state = createDiagnosticState();
    publishDiagnostics(state, 'z', 1, [parseError]);
    publishDiagnostics(state, 'a', 1, [{ code: 'first', message: 'First', severity: 'hint' }]);
    expect(getDiagnostics(state).map((item) => item.code)).toEqual(['first', 'yaml.parse']);
  });
});

describe('getDiagnosticRevision', () => {
  it('returns null for an unknown source', () =>
    expect(getDiagnosticRevision(createDiagnosticState(), 'none')).toBeNull());
});

describe('summarizeDiagnostics', () => {
  it('summarizes severity and blocking behavior', () => {
    const state = createDiagnosticState();
    publishDiagnostics(state, 'yaml', 1, [parseError]);
    publishDiagnostics(state, 'render', 1, [
      { code: 'render.unsupported', message: 'Unsupported', severity: 'warning', blocksVisualization: true },
    ]);
    expect(summarizeDiagnostics(state)).toEqual({
      total: 2,
      errors: 1,
      warnings: 1,
      blocksMutation: true,
      blocksVisualization: true,
    });
  });
});
