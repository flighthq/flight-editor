import { describe, expect, it } from 'vitest';

import {
  createEditingScopeState,
  enterEditingScope,
  exitEditingScope,
  getActiveEditingScope,
  getEditingScopes,
  navigateToEditingScope,
  reconcileEditingScopes,
} from './editingScopeState';

const root = { identity: 'document', kind: 'document' as const, label: 'Scene' };
const group = { identity: 'group-1', kind: 'group' as const, label: 'Header' };
const component = { identity: 'component-1', kind: 'component' as const, label: 'Button' };

describe('createEditingScopeState', () => {
  it('requires and copies a valid root scope', () => {
    const state = createEditingScopeState(root);
    expect(getEditingScopes(state)).toEqual([root]);
    expect(() => createEditingScopeState({ ...root, identity: '' })).toThrow();
  });
});

describe('enterEditingScope', () => {
  it('pushes nested scopes while preventing identity cycles', () => {
    const state = createEditingScopeState(root);
    expect(enterEditingScope(state, group)).toBe(true);
    expect(enterEditingScope(state, group)).toBe(false);
    expect(getActiveEditingScope(state)).toEqual(group);
  });
});

describe('exitEditingScope', () => {
  it('pops one level but never exits the root', () => {
    const state = createEditingScopeState(root);
    expect(exitEditingScope(state)).toBeNull();
    enterEditingScope(state, group);
    expect(exitEditingScope(state)).toEqual(group);
    expect(getActiveEditingScope(state)).toEqual(root);
  });
});

describe('navigateToEditingScope', () => {
  it('truncates descendants when a breadcrumb is activated', () => {
    const state = createEditingScopeState(root);
    enterEditingScope(state, group);
    enterEditingScope(state, component);
    expect(navigateToEditingScope(state, group.identity)).toBe(true);
    expect(getEditingScopes(state)).toEqual([root, group]);
    expect(navigateToEditingScope(state, 'missing')).toBe(false);
  });
});

describe('reconcileEditingScopes', () => {
  it('drops a missing scope and all descendants after reload', () => {
    const state = createEditingScopeState(root);
    enterEditingScope(state, group);
    enterEditingScope(state, component);
    expect(reconcileEditingScopes(state, new Set([root.identity, component.identity]))).toBe(true);
    expect(getEditingScopes(state)).toEqual([root]);
    expect(reconcileEditingScopes(state, new Set())).toBe(false);
  });
});

describe('getEditingScopes', () => {
  it('returns breadcrumbs in root-to-active order', () => {
    const state = createEditingScopeState(root);
    enterEditingScope(state, group);
    expect(getEditingScopes(state).map((scope) => scope.label)).toEqual(['Scene', 'Header']);
  });
});

describe('getActiveEditingScope', () => {
  it('returns the root for a fresh state', () =>
    expect(getActiveEditingScope(createEditingScopeState(root))).toEqual(root));
});
