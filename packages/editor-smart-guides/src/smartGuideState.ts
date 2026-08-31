export type SmartGuideKind = 'edge' | 'center' | 'spacing' | 'dimension' | 'parent-bounds';

export type SmartGuideOrientation = 'horizontal' | 'vertical';

export interface SmartGuide {
  readonly kind: SmartGuideKind;
  readonly orientation: SmartGuideOrientation;
  readonly position: number;
  readonly from: number;
  readonly to: number;
  readonly label: string | null;
}

export interface SmartGuideState {
  guides: SmartGuide[];
  enabled: boolean;
  spacingGuidesEnabled: boolean;
  version: number;
}

export function createSmartGuideState(): SmartGuideState {
  return { guides: [], enabled: true, spacingGuidesEnabled: true, version: 0 };
}

export function getActiveSmartGuides(state: Readonly<SmartGuideState>): readonly SmartGuide[] {
  return state.guides;
}

export function getActiveSmartGuideCount(state: Readonly<SmartGuideState>): number {
  return state.guides.length;
}

export function setActiveSmartGuides(state: SmartGuideState, guides: readonly SmartGuide[]): void {
  state.guides = guides.slice();
  state.version++;
}

export function clearActiveSmartGuides(state: SmartGuideState): void {
  if (state.guides.length === 0) return;
  state.guides.length = 0;
  state.version++;
}

export function isSmartGuidesEnabled(state: Readonly<SmartGuideState>): boolean {
  return state.enabled;
}

export function setSmartGuidesEnabled(state: SmartGuideState, enabled: boolean): void {
  if (state.enabled === enabled) return;
  state.enabled = enabled;
  if (!enabled) {
    state.guides.length = 0;
  }
  state.version++;
}

export function isSpacingGuidesEnabled(state: Readonly<SmartGuideState>): boolean {
  return state.spacingGuidesEnabled;
}

export function setSpacingGuidesEnabled(state: SmartGuideState, enabled: boolean): void {
  if (state.spacingGuidesEnabled === enabled) return;
  state.spacingGuidesEnabled = enabled;
  state.version++;
}

export function getSmartGuideVersion(state: Readonly<SmartGuideState>): number {
  return state.version;
}
