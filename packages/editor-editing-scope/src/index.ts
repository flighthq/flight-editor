export {
  createEditingScopeState,
  enterEditingScope,
  exitEditingScope,
  getActiveEditingScope,
  getEditingScopes,
  navigateToEditingScope,
  reconcileEditingScopes,
} from './editingScopeState';

export type { EditingScope, EditingScopeKind, EditingScopeState } from './editingScopeState';
