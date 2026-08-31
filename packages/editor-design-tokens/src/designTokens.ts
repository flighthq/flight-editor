import type { Command } from '@flighthq/editor-command';

import { createSnapshotCommand } from '@flighthq/editor-command';

export type DesignTokenKind = 'boolean' | 'color' | 'number' | 'string' | 'style';
export type DesignTokenLiteral = boolean | number | string | Readonly<Record<string, unknown>>;

export interface DesignTokenAlias {
  readonly alias: string;
}

export type DesignTokenValue = DesignTokenLiteral | DesignTokenAlias;

export interface DesignTokenMode {
  readonly id: string;
  readonly name: string;
  readonly parentModeId?: string;
}

export interface DesignTokenCollection {
  readonly id: string;
  name: string;
  readonly defaultModeId: string;
  modes: DesignTokenMode[];
  provenance?: string;
}

export interface DesignToken {
  readonly id: string;
  readonly collectionId: string;
  name: string;
  group: string;
  kind: DesignTokenKind;
  values: Record<string, DesignTokenValue>;
}

export interface DesignTokenScope {
  readonly id: string;
  readonly parentId?: string;
  modes: Record<string, string>;
}

export interface DesignTokenBinding {
  readonly targetId: string;
  readonly property: string;
  tokenId: string;
  scopeId?: string;
}

export interface DesignTokenState {
  collections: Map<string, DesignTokenCollection>;
  tokens: Map<string, DesignToken>;
  scopes: Map<string, DesignTokenScope>;
  bindings: Map<string, DesignTokenBinding>;
  version: number;
}

export interface DesignTokenResolution {
  readonly value: DesignTokenLiteral | null;
  readonly tokenId: string;
  readonly modeId: string | null;
  readonly dependencies: readonly string[];
  readonly diagnostics: readonly string[];
}

export interface SerializedDesignTokens {
  readonly collections: readonly DesignTokenCollection[];
  readonly tokens: readonly DesignToken[];
  readonly scopes: readonly DesignTokenScope[];
  readonly bindings: readonly DesignTokenBinding[];
}

function required(value: string, label: string): string {
  const result = value.trim();
  if (result === '') throw new TypeError(`${label} must not be empty`);
  return result;
}

function bindingKey(targetId: string, property: string): string {
  return `${targetId}\0${property}`;
}

function cloneValue(value: DesignTokenValue): DesignTokenValue {
  return typeof value === 'object' && value !== null ? structuredClone(value) : value;
}

function cloneCollection(value: Readonly<DesignTokenCollection>): DesignTokenCollection {
  return { ...value, modes: value.modes.map((mode) => ({ ...mode })) };
}

function cloneToken(value: Readonly<DesignToken>): DesignToken {
  return {
    ...value,
    values: Object.fromEntries(Object.entries(value.values).map(([id, item]) => [id, cloneValue(item)])),
  };
}

function isAlias(value: DesignTokenValue): value is DesignTokenAlias {
  return typeof value === 'object' && value !== null && 'alias' in value && typeof value.alias === 'string';
}

function valueMatchesKind(kind: DesignTokenKind, value: DesignTokenLiteral): boolean {
  if (kind === 'style') return typeof value === 'object' && value !== null;
  return typeof value === (kind === 'color' ? 'string' : kind);
}

function selectedMode(
  state: Readonly<DesignTokenState>,
  collection: Readonly<DesignTokenCollection>,
  scopeId?: string,
): string {
  const visited = new Set<string>();
  let current = scopeId;
  while (current !== undefined && !visited.has(current)) {
    visited.add(current);
    const scope = state.scopes.get(current);
    if (scope === undefined) break;
    if (scope.modes[collection.id] !== undefined) return scope.modes[collection.id]!;
    current = scope.parentId;
  }
  return collection.defaultModeId;
}

function valueForMode(
  token: Readonly<DesignToken>,
  collection: Readonly<DesignTokenCollection>,
  modeId: string,
): DesignTokenValue | undefined {
  const modes = new Map(collection.modes.map((mode) => [mode.id, mode]));
  const visited = new Set<string>();
  let current: string | undefined = modeId;
  while (current !== undefined && !visited.has(current)) {
    visited.add(current);
    if (token.values[current] !== undefined) return token.values[current];
    current = modes.get(current)?.parentModeId;
  }
  return undefined;
}

export function createDesignTokenState(): DesignTokenState {
  return { collections: new Map(), tokens: new Map(), scopes: new Map(), bindings: new Map(), version: 0 };
}

export function registerDesignTokenCollection(
  state: DesignTokenState,
  collection: Readonly<DesignTokenCollection>,
): void {
  required(collection.id, 'Collection id');
  required(collection.name, 'Collection name');
  if (state.collections.has(collection.id)) throw new Error(`Collection already exists: ${collection.id}`);
  const ids = new Set(collection.modes.map(({ id }) => required(id, 'Mode id')));
  if (ids.size !== collection.modes.length || !ids.has(collection.defaultModeId))
    throw new Error('Collection modes or default are invalid');
  for (const mode of collection.modes) {
    if (mode.parentModeId !== undefined && !ids.has(mode.parentModeId))
      throw new Error(`Unknown parent mode: ${mode.parentModeId}`);
  }
  state.collections.set(collection.id, cloneCollection(collection));
  state.version++;
}

export function registerDesignToken(state: DesignTokenState, token: Readonly<DesignToken>): void {
  required(token.id, 'Token id');
  required(token.name, 'Token name');
  const collection = state.collections.get(token.collectionId);
  if (collection === undefined) throw new Error(`Unknown token collection: ${token.collectionId}`);
  if (state.tokens.has(token.id)) throw new Error(`Token already exists: ${token.id}`);
  for (const modeId of Object.keys(token.values)) {
    if (!collection.modes.some(({ id }) => id === modeId)) throw new Error(`Unknown token mode: ${modeId}`);
  }
  state.tokens.set(token.id, cloneToken(token));
  state.version++;
}

export function setDesignTokenValue(
  state: DesignTokenState,
  tokenId: string,
  modeId: string,
  value: DesignTokenValue,
): void {
  const token = state.tokens.get(tokenId);
  if (token === undefined) throw new Error(`Unknown token: ${tokenId}`);
  const collection = state.collections.get(token.collectionId)!;
  if (!collection.modes.some(({ id }) => id === modeId)) throw new Error(`Unknown token mode: ${modeId}`);
  if (!isAlias(value) && !valueMatchesKind(token.kind, value))
    throw new TypeError(`Value does not match token kind: ${token.kind}`);
  token.values[modeId] = cloneValue(value);
  state.version++;
}

export function setDesignTokenScope(state: DesignTokenState, scope: Readonly<DesignTokenScope>): void {
  required(scope.id, 'Scope id');
  if (scope.parentId === scope.id) throw new Error('Token scope cannot parent itself');
  for (const [collectionId, modeId] of Object.entries(scope.modes)) {
    const collection = state.collections.get(collectionId);
    if (collection === undefined || !collection.modes.some(({ id }) => id === modeId))
      throw new Error(`Invalid scope mode: ${collectionId}/${modeId}`);
  }
  state.scopes.set(scope.id, { ...scope, modes: { ...scope.modes } });
  state.version++;
}

export function resolveDesignToken(
  state: Readonly<DesignTokenState>,
  tokenId: string,
  scopeId?: string,
): DesignTokenResolution {
  const dependencies: string[] = [];
  const diagnostics: string[] = [];
  const visiting = new Set<string>();
  let modeId: string | null = null;
  const resolve = (id: string): DesignTokenLiteral | null => {
    if (visiting.has(id)) {
      diagnostics.push(`Alias cycle: ${[...visiting, id].join(' -> ')}`);
      return null;
    }
    const token = state.tokens.get(id);
    if (token === undefined) {
      diagnostics.push(`Missing token: ${id}`);
      return null;
    }
    const collection = state.collections.get(token.collectionId);
    if (collection === undefined) {
      diagnostics.push(`Missing collection: ${token.collectionId}`);
      return null;
    }
    const selected = selectedMode(state, collection, scopeId);
    if (id === tokenId) modeId = selected;
    const value = valueForMode(token, collection, selected);
    if (value === undefined) {
      diagnostics.push(`Missing value for ${id} in mode ${selected}`);
      return null;
    }
    dependencies.push(id);
    if (!isAlias(value)) {
      if (!valueMatchesKind(token.kind, value)) diagnostics.push(`Type mismatch for token ${id}`);
      return cloneValue(value) as DesignTokenLiteral;
    }
    visiting.add(id);
    const resolved = resolve(value.alias);
    visiting.delete(id);
    const alias = state.tokens.get(value.alias);
    if (alias !== undefined && alias.kind !== token.kind)
      diagnostics.push(`Alias type mismatch: ${id} -> ${value.alias}`);
    return resolved;
  };
  const value = resolve(tokenId);
  return { value: diagnostics.length === 0 ? value : null, tokenId, modeId, dependencies, diagnostics };
}

export function bindDesignToken(state: DesignTokenState, binding: Readonly<DesignTokenBinding>): void {
  required(binding.targetId, 'Binding target');
  required(binding.property, 'Binding property');
  if (!state.tokens.has(binding.tokenId)) throw new Error(`Unknown token: ${binding.tokenId}`);
  if (binding.scopeId !== undefined && !state.scopes.has(binding.scopeId))
    throw new Error(`Unknown token scope: ${binding.scopeId}`);
  state.bindings.set(bindingKey(binding.targetId, binding.property), { ...binding });
  state.version++;
}

export function detachDesignTokenBinding(
  state: DesignTokenState,
  targetId: string,
  property: string,
): DesignTokenLiteral | null {
  const key = bindingKey(targetId, property);
  const binding = state.bindings.get(key);
  if (binding === undefined) return null;
  const resolution = resolveDesignToken(state, binding.tokenId, binding.scopeId);
  if (resolution.value === null) return null;
  state.bindings.delete(key);
  state.version++;
  return resolution.value;
}

export function relinkDesignToken(state: DesignTokenState, fromTokenId: string, toTokenId: string): number {
  const target = state.tokens.get(toTokenId);
  if (target === undefined) throw new Error(`Unknown replacement token: ${toTokenId}`);
  let changed = 0;
  for (const token of state.tokens.values()) {
    for (const [modeId, value] of Object.entries(token.values)) {
      if (isAlias(value) && value.alias === fromTokenId) {
        if (token.kind !== target.kind) throw new Error('Replacement token kind does not match alias');
        token.values[modeId] = { alias: toTokenId };
        changed++;
      }
    }
  }
  for (const binding of state.bindings.values()) {
    if (binding.tokenId === fromTokenId) {
      binding.tokenId = toTokenId;
      changed++;
    }
  }
  if (changed > 0) state.version++;
  return changed;
}

export function removeDesignToken(state: DesignTokenState, tokenId: string, force = false): readonly string[] {
  const usages = Array.from(state.bindings.values())
    .filter(({ tokenId: id }) => id === tokenId)
    .map(({ targetId, property }) => `${targetId}.${property}`);
  const aliases = Array.from(state.tokens.values())
    .filter(({ values }) => Object.values(values).some((value) => isAlias(value) && value.alias === tokenId))
    .map(({ id }) => id);
  const blockers = [...usages, ...aliases].sort();
  if (blockers.length > 0 && !force) return blockers;
  if (!state.tokens.delete(tokenId)) return [];
  if (force) {
    for (const [key, binding] of state.bindings) if (binding.tokenId === tokenId) state.bindings.delete(key);
  }
  state.version++;
  return [];
}

export function serializeDesignTokens(state: Readonly<DesignTokenState>): SerializedDesignTokens {
  return {
    collections: Array.from(state.collections.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(cloneCollection),
    tokens: Array.from(state.tokens.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(cloneToken),
    scopes: Array.from(state.scopes.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((scope) => ({ ...scope, modes: { ...scope.modes } })),
    bindings: Array.from(state.bindings.values())
      .sort((a, b) => a.targetId.localeCompare(b.targetId) || a.property.localeCompare(b.property))
      .map((binding) => ({ ...binding })),
  };
}

export function restoreDesignTokens(state: DesignTokenState, value: Readonly<SerializedDesignTokens>): void {
  const next = createDesignTokenState();
  for (const collection of value.collections) registerDesignTokenCollection(next, collection);
  for (const token of value.tokens) registerDesignToken(next, token);
  for (const scope of value.scopes) setDesignTokenScope(next, scope);
  for (const binding of value.bindings) bindDesignToken(next, binding);
  state.collections = next.collections;
  state.tokens = next.tokens;
  state.scopes = next.scopes;
  state.bindings = next.bindings;
  state.version++;
}

export function createDesignTokenCommand(state: DesignTokenState, label: string, mutate: () => void): Command {
  return createSnapshotCommand(
    label,
    { capture: () => serializeDesignTokens(state), restore: (value) => restoreDesignTokens(state, value) },
    mutate,
  );
}
