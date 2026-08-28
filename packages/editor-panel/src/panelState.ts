export type PanelPosition = 'left' | 'right' | 'bottom';

export interface PanelDefinition {
  readonly id: string;
  title: string;
  position: PanelPosition;
  visible: boolean;
  collapsed: boolean;
  width: number;
  height: number;
}

export interface PanelState {
  readonly panels: PanelDefinition[];
  version: number;
}

export function createPanelState(): PanelState {
  return { panels: [], version: 0 };
}

export function addPanel(state: PanelState, panel: Readonly<PanelDefinition>): void {
  const next = clonePanel(panel);
  const index = state.panels.findIndex((entry) => entry.id === panel.id);
  if (index === -1) {
    state.panels.push(next);
  } else {
    const current = state.panels[index]!;
    if (panelsEqual(current, next)) return;
    state.panels[index] = next;
  }
  state.version++;
}

export function removePanel(state: PanelState, panelId: string): void {
  const index = state.panels.findIndex((panel) => panel.id === panelId);
  if (index === -1) return;
  state.panels.splice(index, 1);
  state.version++;
}

export function getPanels(state: Readonly<PanelState>): readonly PanelDefinition[] {
  return state.panels.map(clonePanel);
}

export function getPanel(state: Readonly<PanelState>, panelId: string): PanelDefinition | null {
  const panel = state.panels.find((entry) => entry.id === panelId);
  return panel ? clonePanel(panel) : null;
}

export function setPanelVisible(state: PanelState, panelId: string, visible: boolean): void {
  const panel = findStoredPanel(state, panelId);
  if (!panel || panel.visible === visible) return;
  panel.visible = visible;
  state.version++;
}

export function isPanelVisible(state: Readonly<PanelState>, panelId: string): boolean {
  return state.panels.find((panel) => panel.id === panelId)?.visible ?? false;
}

export function setPanelCollapsed(state: PanelState, panelId: string, collapsed: boolean): void {
  const panel = findStoredPanel(state, panelId);
  if (!panel || panel.collapsed === collapsed) return;
  panel.collapsed = collapsed;
  state.version++;
}

export function isPanelCollapsed(state: Readonly<PanelState>, panelId: string): boolean {
  return state.panels.find((panel) => panel.id === panelId)?.collapsed ?? false;
}

export function setPanelSize(state: PanelState, panelId: string, width: number, height: number): void {
  const panel = findStoredPanel(state, panelId);
  if (!panel || (panel.width === width && panel.height === height)) return;
  panel.width = width;
  panel.height = height;
  state.version++;
}

export function setPanelPosition(state: PanelState, panelId: string, position: PanelPosition): void {
  const panel = findStoredPanel(state, panelId);
  if (!panel || panel.position === position) return;
  panel.position = position;
  state.version++;
}

export function getPanelVersion(state: Readonly<PanelState>): number {
  return state.version;
}

function clonePanel(panel: Readonly<PanelDefinition>): PanelDefinition {
  return {
    id: panel.id,
    title: panel.title,
    position: panel.position,
    visible: panel.visible,
    collapsed: panel.collapsed,
    width: panel.width,
    height: panel.height,
  };
}

function findStoredPanel(state: Readonly<PanelState>, panelId: string): PanelDefinition | undefined {
  return state.panels.find((panel) => panel.id === panelId);
}

function panelsEqual(a: Readonly<PanelDefinition>, b: Readonly<PanelDefinition>): boolean {
  return (
    a.id === b.id &&
    a.title === b.title &&
    a.position === b.position &&
    a.visible === b.visible &&
    a.collapsed === b.collapsed &&
    a.width === b.width &&
    a.height === b.height
  );
}
