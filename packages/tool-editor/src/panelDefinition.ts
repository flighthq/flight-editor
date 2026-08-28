import type { LayoutRegion } from './editorLayout';

export interface PanelDefinition {
  readonly id: string;
  readonly title: string;
  readonly region: LayoutRegion;
  readonly resizable: boolean;
  readonly closable: boolean;
  readonly minWidth?: number;
  readonly minHeight?: number;
}

export interface PanelRegistry {
  readonly panels: Map<string, PanelDefinition>;
}

export function createPanelRegistry(): PanelRegistry {
  return { panels: new Map() };
}

export function registerPanel(registry: PanelRegistry, panel: Readonly<PanelDefinition>): void {
  registry.panels.set(panel.id, panel);
}

export function unregisterPanel(registry: PanelRegistry, id: string): boolean {
  return registry.panels.delete(id);
}

export function getPanel(registry: Readonly<PanelRegistry>, id: string): PanelDefinition | undefined {
  return registry.panels.get(id);
}

export function getPanelsByRegion(registry: Readonly<PanelRegistry>, region: LayoutRegion): PanelDefinition[] {
  const result: PanelDefinition[] = [];
  for (const panel of registry.panels.values()) {
    if (panel.region === region) {
      result.push(panel);
    }
  }
  return result;
}

export function getPanelCount(registry: Readonly<PanelRegistry>): number {
  return registry.panels.size;
}

export function getAllPanelIds(registry: Readonly<PanelRegistry>): string[] {
  return [...registry.panels.keys()];
}

export function registerDefaultPanels(registry: PanelRegistry): void {
  registerPanel(registry, {
    id: 'hierarchy',
    title: 'Hierarchy',
    region: 'leftPanel',
    resizable: true,
    closable: true,
    minWidth: 150,
  });
  registerPanel(registry, {
    id: 'inspector',
    title: 'Inspector',
    region: 'rightPanel',
    resizable: true,
    closable: true,
    minWidth: 200,
  });
  registerPanel(registry, {
    id: 'toolbar',
    title: 'Toolbar',
    region: 'toolbar',
    resizable: false,
    closable: false,
  });
  registerPanel(registry, {
    id: 'statusBar',
    title: 'Status Bar',
    region: 'statusBar',
    resizable: false,
    closable: false,
  });
}
