import { describe, expect, it } from 'vitest';
import { createCommandHistory, executeCommand, undo } from '@flighthq/editor-command';
import {
  bindDesignToken,
  createDesignTokenCommand,
  createDesignTokenState,
  detachDesignTokenBinding,
  registerDesignToken,
  registerDesignTokenCollection,
  relinkDesignToken,
  removeDesignToken,
  resolveDesignToken,
  restoreDesignTokens,
  serializeDesignTokens,
  setDesignTokenScope,
  setDesignTokenValue,
} from './designTokens';

function fixture() {
  const state = createDesignTokenState();
  registerDesignTokenCollection(state, {
    id: 'theme',
    name: 'Theme',
    defaultModeId: 'light',
    modes: [
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark', parentModeId: 'light' },
    ],
  });
  registerDesignToken(state, {
    id: 'surface',
    collectionId: 'theme',
    name: 'Surface',
    group: 'Color',
    kind: 'color',
    values: { light: '#fff', dark: '#000' },
  });
  return state;
}

describe('createDesignTokenState', () => {
  it('starts with detached authoring registries', () => expect(createDesignTokenState()).toMatchObject({ version: 0 }));
});
describe('registerDesignTokenCollection', () => {
  it('validates modes and inheritance', () => {
    const state = createDesignTokenState();
    expect(() =>
      registerDesignTokenCollection(state, { id: 'x', name: 'X', defaultModeId: 'none', modes: [] }),
    ).toThrow('invalid');
  });
});
describe('registerDesignToken', () => {
  it('preserves stable identity, grouping, provenance collection, and typed values', () => {
    expect(fixture().tokens.get('surface')).toMatchObject({ group: 'Color', kind: 'color' });
  });
});
describe('setDesignTokenValue', () => {
  it('validates literal types while accepting aliases', () => {
    const state = fixture();
    expect(() => setDesignTokenValue(state, 'surface', 'light', 4)).toThrow('kind');
    setDesignTokenValue(state, 'surface', 'light', { alias: 'other' });
    expect(state.tokens.get('surface')?.values.light).toEqual({ alias: 'other' });
  });
});
describe('setDesignTokenScope', () => {
  it('supports nested scope mode inheritance', () => {
    const state = fixture();
    setDesignTokenScope(state, { id: 'root', modes: { theme: 'dark' } });
    setDesignTokenScope(state, { id: 'child', parentId: 'root', modes: {} });
    expect(resolveDesignToken(state, 'surface', 'child').value).toBe('#000');
  });
});
describe('resolveDesignToken', () => {
  it('resolves aliases, inherited modes, and dependency provenance', () => {
    const state = fixture();
    registerDesignToken(state, {
      id: 'panel',
      collectionId: 'theme',
      name: 'Panel',
      group: 'Color',
      kind: 'color',
      values: { light: { alias: 'surface' } },
    });
    setDesignTokenScope(state, { id: 'dark', modes: { theme: 'dark' } });
    expect(resolveDesignToken(state, 'panel', 'dark')).toMatchObject({
      value: '#000',
      dependencies: ['panel', 'surface'],
    });
  });
  it('reports alias cycles and missing bindings without producing a value', () => {
    const state = fixture();
    registerDesignToken(state, {
      id: 'other',
      collectionId: 'theme',
      name: 'Other',
      group: '',
      kind: 'color',
      values: { light: { alias: 'surface' } },
    });
    setDesignTokenValue(state, 'surface', 'light', { alias: 'other' });
    expect(resolveDesignToken(state, 'surface').diagnostics[0]).toContain('Alias cycle');
  });
});
describe('bindDesignToken', () => {
  it('tracks bindings separately from copied literals', () => {
    const state = fixture();
    bindDesignToken(state, { targetId: 'node', property: 'fill', tokenId: 'surface' });
    expect(state.bindings.size).toBe(1);
  });
});
describe('detachDesignTokenBinding', () => {
  it('returns the resolved literal and removes only the binding', () => {
    const state = fixture();
    bindDesignToken(state, { targetId: 'node', property: 'fill', tokenId: 'surface' });
    expect(detachDesignTokenBinding(state, 'node', 'fill')).toBe('#fff');
    expect(state.tokens.has('surface')).toBe(true);
  });
});
describe('relinkDesignToken', () => {
  it('updates bindings and aliases with type safety', () => {
    const state = fixture();
    registerDesignToken(state, {
      id: 'next',
      collectionId: 'theme',
      name: 'Next',
      group: '',
      kind: 'color',
      values: { light: '#eee' },
    });
    bindDesignToken(state, { targetId: 'node', property: 'fill', tokenId: 'surface' });
    expect(relinkDesignToken(state, 'surface', 'next')).toBe(1);
    expect(state.bindings.values().next().value?.tokenId).toBe('next');
  });
});
describe('removeDesignToken', () => {
  it('reports usage blockers and supports explicit forced deletion', () => {
    const state = fixture();
    bindDesignToken(state, { targetId: 'node', property: 'fill', tokenId: 'surface' });
    expect(removeDesignToken(state, 'surface')).toEqual(['node.fill']);
    expect(removeDesignToken(state, 'surface', true)).toEqual([]);
  });
});
describe('serializeDesignTokens', () => {
  it('serializes stable sorted detached authoring data', () => {
    const state = fixture();
    const value = serializeDesignTokens(state);
    value.tokens[0]!.name = 'Changed';
    expect(state.tokens.get('surface')?.name).toBe('Surface');
  });
});
describe('restoreDesignTokens', () => {
  it('round-trips collections, modes, scopes, tokens, and bindings', () => {
    const source = fixture();
    setDesignTokenScope(source, { id: 'dark', modes: { theme: 'dark' } });
    bindDesignToken(source, { targetId: 'node', property: 'fill', tokenId: 'surface', scopeId: 'dark' });
    const target = createDesignTokenState();
    restoreDesignTokens(target, serializeDesignTokens(source));
    expect(serializeDesignTokens(target)).toEqual(serializeDesignTokens(source));
  });
});
describe('createDesignTokenCommand', () => {
  it('undoes propagation edits through shared command history', () => {
    const state = fixture();
    const history = createCommandHistory();
    executeCommand(
      history,
      createDesignTokenCommand(state, 'Change surface', () => setDesignTokenValue(state, 'surface', 'light', '#eee')),
    );
    expect(resolveDesignToken(state, 'surface').value).toBe('#eee');
    undo(history);
    expect(resolveDesignToken(state, 'surface').value).toBe('#fff');
  });
});
