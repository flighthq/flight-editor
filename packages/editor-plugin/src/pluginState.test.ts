import { describe, expect, it, vi } from 'vitest';
import type { EditorPlugin, PluginCapability } from './pluginState';
import {
  createPluginState,
  getPluginContributions,
  loadPlugin,
  migratePluginDocumentData,
  runReadonlyPluginGenerator,
  setPluginDocumentData,
  unloadPlugin,
  validatePluginWidget,
} from './pluginState';
const caps = new Set<PluginCapability>(['document', 'panels', 'tools', 'widgets']);
const sample = (activate: EditorPlugin['activate'] = () => undefined): EditorPlugin => ({
  manifest: { id: 'sample', version: '1', apiVersion: 1, capabilities: ['panels', 'document'] },
  activate,
  migrateDocumentData: (data) => ({ ...(data as object), migrated: true }),
});
describe('createPluginState', () => {
  it('captures API and host capabilities', () => expect(createPluginState(1, caps).apiVersion).toBe(1));
});
describe('loadPlugin', () => {
  it('loads declared contributions and rejects duplicates', () => {
    const state = createPluginState(1, caps);
    loadPlugin(
      state,
      sample((context) => context.register({ id: 'main', kind: 'panels', value: {} })),
    );
    expect(getPluginContributions(state, 'panels')).toHaveLength(1);
    expect(() => loadPlugin(state, sample())).toThrow('already loaded');
  });
  it('rolls back failed activation', () => {
    const state = createPluginState(1, caps);
    const dispose = vi.fn();
    expect(() =>
      loadPlugin(
        state,
        sample((context) => {
          context.subscribe(dispose);
          context.register({ id: 'main', kind: 'panels', value: {} });
          throw new Error('fail');
        }),
      ),
    ).toThrow();
    expect(dispose).toHaveBeenCalled();
    expect(state.contributions.size).toBe(0);
  });
  it('enforces host capabilities', () =>
    expect(() => loadPlugin(createPluginState(1, new Set()), sample())).toThrow('unavailable'));
});
describe('unloadPlugin', () => {
  it('disposes contributions but preserves document data', () => {
    const state = createPluginState(1, caps);
    const dispose = vi.fn();
    loadPlugin(
      state,
      sample((context) => context.subscribe(dispose)),
    );
    setPluginDocumentData(state, 'sample', 1, {});
    expect(unloadPlugin(state, 'sample')).toBe(true);
    expect(dispose).toHaveBeenCalled();
    expect(state.documentData.has('sample')).toBe(true);
  });
});
describe('getPluginContributions', () => {
  it('returns deterministic filtered contributions', () => {
    const state = createPluginState(1, caps);
    loadPlugin(
      state,
      sample((context) => {
        context.register({ id: 'z', kind: 'panels', value: 1 });
        context.register({ id: 'a', kind: 'panels', value: 2 });
      }),
    );
    expect(getPluginContributions(state, 'panels').map(({ id }) => id)).toEqual(['a', 'z']);
  });
});
describe('setPluginDocumentData', () => {
  it('preserves namespaced missing-plugin data', () => {
    const state = createPluginState(1, caps);
    setPluginDocumentData(state, 'missing', 2, { opaque: true });
    expect(state.documentData.get('missing')?.version).toBe(2);
  });
});
describe('migratePluginDocumentData', () => {
  it('migrates loaded plugin data', () => {
    const state = createPluginState(1, caps);
    loadPlugin(state, sample());
    setPluginDocumentData(state, 'sample', 1, {});
    expect(migratePluginDocumentData(state, 'sample', 2)).toBe(true);
    expect(state.documentData.get('sample')?.data).toEqual({ migrated: true });
  });
});
describe('runReadonlyPluginGenerator', () => {
  it('prevents generator input mutation', () => {
    const input = { nested: { x: 1 } };
    expect(() =>
      runReadonlyPluginGenerator((value) => {
        (value.nested as { x: number }).x = 2;
      }, input),
    ).toThrow();
    expect(input.nested.x).toBe(1);
  });
});
describe('validatePluginWidget', () => {
  it('validates declarative schemas', () =>
    expect(
      validatePluginWidget({ type: 'object', properties: { label: 'string' }, required: ['label'] }, { extra: 1 }),
    ).toEqual(['Missing required widget property: label', 'Unknown widget property: extra']));
});
