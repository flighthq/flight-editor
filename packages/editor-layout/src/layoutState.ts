export type LayoutPanelId = 'hierarchy' | 'properties' | 'toolbar' | 'status';
export type LayoutPanelPosition = 'left' | 'right' | 'top' | 'bottom' | 'float';

export interface LayoutPanelConfig {
  readonly id: LayoutPanelId;
  visible: boolean;
  position: LayoutPanelPosition;
  width: number;
  height: number;
}

export interface LayoutState {
  readonly panels: LayoutPanelConfig[];
  version: number;
}

export function createLayoutState(): LayoutState {
  return { panels: createDefaultPanels(), version: 0 };
}

export function setLayoutPanelVisible(state: LayoutState, panelId: string, visible: boolean): void {
  const panel = findPanel(state, panelId);
  if (panel === undefined || panel.visible === visible) return;
  panel.visible = visible;
  state.version++;
}

export function getLayoutPanelVisible(state: Readonly<LayoutState>, panelId: string): boolean {
  return findPanel(state, panelId)?.visible ?? false;
}

export function setLayoutPanelPosition(state: LayoutState, panelId: string, position: LayoutPanelPosition): void {
  const panel = findPanel(state, panelId);
  if (panel === undefined || panel.position === position) return;
  panel.position = position;
  state.version++;
}

export function setLayoutPanelSize(state: LayoutState, panelId: string, width: number, height: number): void {
  const panel = findPanel(state, panelId);
  if (panel === undefined || (panel.width === width && panel.height === height)) return;
  panel.width = width;
  panel.height = height;
  state.version++;
}

export function getLayoutPanels(state: Readonly<LayoutState>): readonly LayoutPanelConfig[] {
  return state.panels.map(clonePanel);
}

export function resetLayout(state: LayoutState): void {
  const defaults = createDefaultPanels();
  if (panelsEqual(state.panels, defaults)) return;
  state.panels.splice(0, state.panels.length, ...defaults);
  state.version++;
}

function createDefaultPanels(): LayoutPanelConfig[] {
  return [
    { id: 'hierarchy', visible: true, position: 'left', width: 280, height: 600 },
    { id: 'properties', visible: true, position: 'right', width: 320, height: 600 },
    { id: 'toolbar', visible: true, position: 'top', width: 800, height: 48 },
    { id: 'status', visible: true, position: 'bottom', width: 800, height: 28 },
  ];
}

function clonePanel(panel: Readonly<LayoutPanelConfig>): LayoutPanelConfig {
  return {
    id: panel.id,
    visible: panel.visible,
    position: panel.position,
    width: panel.width,
    height: panel.height,
  };
}

function findPanel(state: Readonly<LayoutState>, panelId: string): LayoutPanelConfig | undefined {
  return state.panels.find((panel) => panel.id === panelId);
}

function panelsEqual(a: readonly LayoutPanelConfig[], b: readonly LayoutPanelConfig[]): boolean {
  return (
    a.length === b.length &&
    a.every((panel, index) => {
      const other = b[index];
      return (
        other !== undefined &&
        panel.id === other.id &&
        panel.visible === other.visible &&
        panel.position === other.position &&
        panel.width === other.width &&
        panel.height === other.height
      );
    })
  );
}
