import { describe, expect, it } from 'vitest';
import {
  compareDevModeSnapshots,
  createDevModeSnapshot,
  createDevModeState,
  registerDevCodeGenerator,
  runDevCodeGenerator,
  unregisterDevCodeGenerator,
} from './devMode';
const identity = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
describe('createDevModeState', () => {
  it('starts without presentation coupling', () => expect(createDevModeState().version).toBe(0));
});
describe('createDevModeSnapshot', () => {
  it('projects nested transforms, measurements, and resolved metadata', () => {
    const snapshot = createDevModeSnapshot(2, [
      { id: 'parent', transform: { ...identity, tx: 10, ty: 20 }, width: 100, height: 100 },
      {
        id: 'child',
        parentId: 'parent',
        transform: { ...identity, tx: 5, ty: 6 },
        width: 10,
        height: 20,
        tokens: { mode: 'dark' },
      },
    ]);
    expect(snapshot.nodes[0]).toMatchObject({
      id: 'child',
      bounds: { x: 15, y: 26, width: 10, height: 20 },
      spacing: { parentX: 5, parentY: 6 },
      tokens: { mode: 'dark' },
    });
  });
});
describe('registerDevCodeGenerator', () => {
  it('registers versioned target/language/MIME contributions', () => {
    const state = createDevModeState();
    registerDevCodeGenerator(state, {
      id: 'css',
      version: '1',
      target: 'web',
      language: 'css',
      mediaType: 'text/css',
      generate: () => '',
    });
    expect(state.generators.get('css')?.target).toBe('web');
  });
});
describe('unregisterDevCodeGenerator', () => {
  it('disposes generator contributions', () => {
    const state = createDevModeState();
    registerDevCodeGenerator(state, {
      id: 'css',
      version: '1',
      target: 'web',
      language: 'css',
      mediaType: 'text/css',
      generate: () => '',
    });
    expect(unregisterDevCodeGenerator(state, 'css')).toBe(true);
  });
});
describe('runDevCodeGenerator', () => {
  it('produces deterministic read-only inputs', async () => {
    const state = createDevModeState();
    registerDevCodeGenerator(state, {
      id: 'json',
      version: '1',
      target: 'data',
      language: 'json',
      mediaType: 'application/json',
      generate(input) {
        expect(Object.isFrozen(input)).toBe(true);
        return JSON.stringify(input);
      },
    });
    const result = await runDevCodeGenerator(state, 'json', createDevModeSnapshot(1, []));
    expect(result).toMatchObject({ mediaType: 'application/json', diagnostics: [] });
  });
  it('reports unsupported targets and missing resource diagnostics', async () => {
    const state = createDevModeState();
    expect((await runDevCodeGenerator(state, 'none', createDevModeSnapshot(1, []))).diagnostics).toEqual([
      'Unsupported generator: none',
    ]);
  });
});
describe('compareDevModeSnapshots', () => {
  it('compares semantic resolved revisions', () => {
    const before = createDevModeSnapshot(1, [{ id: 'a', transform: identity, width: 10, height: 10 }]);
    const after = createDevModeSnapshot(2, [{ id: 'a', transform: identity, width: 20, height: 10 }]);
    expect(compareDevModeSnapshots(before, after)).toEqual([{ nodeId: 'a', changed: ['bounds'] }]);
  });
});
