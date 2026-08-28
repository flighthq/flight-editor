interface ToolbarButtonBase {
  readonly id: string;
  label: string;
  icon: string;
  enabled: boolean;
  active: boolean;
}

export type ToolbarButton =
  | (ToolbarButtonBase & { readonly toolId: string; readonly commandId?: never })
  | (ToolbarButtonBase & { readonly commandId: string; readonly toolId?: never });

export interface ToolbarGroup {
  readonly id: string;
  label: string;
  buttons: ToolbarButton[];
}

export interface ToolbarState {
  readonly groups: ToolbarGroup[];
  version: number;
}

export function createToolbarState(): ToolbarState {
  return { groups: [], version: 0 };
}

export function addToolbarGroup(state: ToolbarState, groupId: string, label: string): void {
  const current = state.groups.find((group) => group.id === groupId);
  if (current) {
    if (current.label === label) return;
    current.label = label;
  } else {
    state.groups.push({ id: groupId, label, buttons: [] });
  }
  state.version++;
}

export function addToolbarButton(state: ToolbarState, groupId: string, button: Readonly<ToolbarButton>): void {
  const target = state.groups.find((group) => group.id === groupId);
  if (!target) return;

  const next = cloneToolbarButton(button);
  const currentLocation = findStoredToolbarButton(state, button.id);
  if (currentLocation?.group === target && toolbarButtonsEqual(currentLocation.button, next)) return;

  if (currentLocation) currentLocation.group.buttons.splice(currentLocation.index, 1);
  if (next.active) deactivateToolbarButtons(state);
  target.buttons.push(next);
  state.version++;
}

export function removeToolbarButton(state: ToolbarState, groupId: string, buttonId: string): void {
  const group = state.groups.find((entry) => entry.id === groupId);
  const index = group?.buttons.findIndex((button) => button.id === buttonId) ?? -1;
  if (!group || index === -1) return;
  group.buttons.splice(index, 1);
  state.version++;
}

export function getToolbarGroups(state: Readonly<ToolbarState>): readonly ToolbarGroup[] {
  return state.groups.map(cloneToolbarGroup);
}

export function getToolbarButtons(state: Readonly<ToolbarState>, groupId: string): readonly ToolbarButton[] {
  const group = state.groups.find((entry) => entry.id === groupId);
  return group ? group.buttons.map(cloneToolbarButton) : [];
}

export function setToolbarButtonEnabled(state: ToolbarState, buttonId: string, enabled: boolean): void {
  const location = findStoredToolbarButton(state, buttonId);
  if (!location || location.button.enabled === enabled) return;
  location.button.enabled = enabled;
  state.version++;
}

export function setToolbarButtonActive(state: ToolbarState, buttonId: string, active: boolean): void {
  const location = findStoredToolbarButton(state, buttonId);
  if (!location) return;

  let changed = false;
  for (const group of state.groups) {
    for (const button of group.buttons) {
      const next = button.id === buttonId ? active : active ? false : button.active;
      if (button.active === next) continue;
      button.active = next;
      changed = true;
    }
  }
  if (changed) state.version++;
}

export function getActiveToolbarButton(state: Readonly<ToolbarState>): ToolbarButton | null {
  for (const group of state.groups) {
    const button = group.buttons.find((entry) => entry.active);
    if (button) return cloneToolbarButton(button);
  }
  return null;
}

export function getToolbarVersion(state: Readonly<ToolbarState>): number {
  return state.version;
}

function cloneToolbarButton(button: Readonly<ToolbarButton>): ToolbarButton {
  const common = {
    id: button.id,
    label: button.label,
    icon: button.icon,
    enabled: button.enabled,
    active: button.active,
  };
  return 'toolId' in button && button.toolId !== undefined
    ? { ...common, toolId: button.toolId }
    : { ...common, commandId: button.commandId };
}

function cloneToolbarGroup(group: Readonly<ToolbarGroup>): ToolbarGroup {
  return { id: group.id, label: group.label, buttons: group.buttons.map(cloneToolbarButton) };
}

function findStoredToolbarButton(
  state: Readonly<ToolbarState>,
  buttonId: string,
): { group: ToolbarGroup; button: ToolbarButton; index: number } | undefined {
  for (const group of state.groups) {
    const index = group.buttons.findIndex((button) => button.id === buttonId);
    if (index !== -1) return { group, button: group.buttons[index]!, index };
  }
  return undefined;
}

function deactivateToolbarButtons(state: ToolbarState): void {
  for (const group of state.groups) {
    for (const button of group.buttons) button.active = false;
  }
}

function toolbarButtonsEqual(a: Readonly<ToolbarButton>, b: Readonly<ToolbarButton>): boolean {
  return (
    a.id === b.id &&
    a.label === b.label &&
    a.icon === b.icon &&
    a.toolId === b.toolId &&
    a.commandId === b.commandId &&
    a.enabled === b.enabled &&
    a.active === b.active
  );
}
