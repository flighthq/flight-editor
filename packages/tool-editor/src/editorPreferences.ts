import type { EditorState } from './editorState';

export interface EditorPreferences {
  showRulers: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  snapToGuides: boolean;
  gridSize: number;
  rulerUnit: string;
  lastToolId: string;
  recentFileCount: number;
  theme: string;
}

export function getDefaultPreferences(): EditorPreferences {
  return {
    showRulers: true,
    showGrid: true,
    snapToGrid: true,
    snapToGuides: true,
    gridSize: 10,
    rulerUnit: 'px',
    lastToolId: 'pointer',
    recentFileCount: 10,
    theme: 'dark',
  };
}

export function serializePreferences(prefs: Readonly<EditorPreferences>): string {
  return JSON.stringify(prefs);
}

export function deserializePreferences(json: string): EditorPreferences | null {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const defaults = getDefaultPreferences();
    return {
      showRulers: typeof parsed.showRulers === 'boolean' ? parsed.showRulers : defaults.showRulers,
      showGrid: typeof parsed.showGrid === 'boolean' ? parsed.showGrid : defaults.showGrid,
      snapToGrid: typeof parsed.snapToGrid === 'boolean' ? parsed.snapToGrid : defaults.snapToGrid,
      snapToGuides: typeof parsed.snapToGuides === 'boolean' ? parsed.snapToGuides : defaults.snapToGuides,
      gridSize: typeof parsed.gridSize === 'number' ? parsed.gridSize : defaults.gridSize,
      rulerUnit: typeof parsed.rulerUnit === 'string' ? parsed.rulerUnit : defaults.rulerUnit,
      lastToolId: typeof parsed.lastToolId === 'string' ? parsed.lastToolId : defaults.lastToolId,
      recentFileCount: typeof parsed.recentFileCount === 'number' ? parsed.recentFileCount : defaults.recentFileCount,
      theme: typeof parsed.theme === 'string' ? parsed.theme : defaults.theme,
    };
  } catch {
    return null;
  }
}

export function applyPreferences(editor: EditorState, prefs: Readonly<EditorPreferences>): void {
  editor.rulers.visible = prefs.showRulers;
  editor.rulers.unit = prefs.rulerUnit as 'pixels' | 'inches' | 'centimeters';
  editor.snap.gridEnabled = prefs.snapToGrid;
  editor.snap.gridSizeX = prefs.gridSize;
  editor.snap.gridSizeY = prefs.gridSize;
}

export function capturePreferences(editor: Readonly<EditorState>): Partial<EditorPreferences> {
  return {
    showRulers: editor.rulers.visible,
    rulerUnit: editor.rulers.unit,
    snapToGrid: editor.snap.gridEnabled,
    gridSize: editor.snap.gridSizeX,
  };
}

export function mergePreferences(
  base: Readonly<EditorPreferences>,
  overrides: Partial<EditorPreferences>,
): EditorPreferences {
  return { ...base, ...overrides };
}
