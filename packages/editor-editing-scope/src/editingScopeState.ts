export type EditingScopeKind = 'document' | 'scene' | 'group' | 'component' | 'prefab' | 'symbol' | 'custom';

export interface EditingScope {
  readonly identity: string;
  readonly kind: EditingScopeKind;
  readonly label: string;
}

export interface EditingScopeState {
  stack: EditingScope[];
  version: number;
}

export function createEditingScopeState(root: Readonly<EditingScope>): EditingScopeState {
  validateScope(root);
  return { stack: [{ ...root }], version: 0 };
}

export function enterEditingScope(state: EditingScopeState, scope: Readonly<EditingScope>): boolean {
  validateScope(scope);
  if (state.stack.some((entry) => entry.identity === scope.identity)) return false;
  state.stack.push({ ...scope });
  state.version++;
  return true;
}

export function exitEditingScope(state: EditingScopeState): EditingScope | null {
  if (state.stack.length === 1) return null;
  const exited = state.stack.pop() ?? null;
  state.version++;
  return exited;
}

export function navigateToEditingScope(state: EditingScopeState, identity: string): boolean {
  const index = state.stack.findIndex((scope) => scope.identity === identity);
  if (index < 0 || index === state.stack.length - 1) return false;
  state.stack.length = index + 1;
  state.version++;
  return true;
}

export function reconcileEditingScopes(state: EditingScopeState, existingIdentities: ReadonlySet<string>): boolean {
  let keep = 1;
  while (keep < state.stack.length && existingIdentities.has(state.stack[keep]!.identity)) keep++;
  if (keep === state.stack.length) return false;
  state.stack.length = keep;
  state.version++;
  return true;
}

export function getEditingScopes(state: Readonly<EditingScopeState>): readonly EditingScope[] {
  return state.stack;
}

export function getActiveEditingScope(state: Readonly<EditingScopeState>): Readonly<EditingScope> {
  return state.stack[state.stack.length - 1]!;
}

function validateScope(scope: Readonly<EditingScope>): void {
  if (scope.identity.length === 0) throw new Error('Editing scope identity must not be empty');
  if (scope.label.length === 0) throw new Error('Editing scope label must not be empty');
}
