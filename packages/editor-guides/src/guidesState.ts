export type GuideAxis = 'horizontal' | 'vertical';

export interface Guide {
  readonly id: number;
  readonly axis: GuideAxis;
  position: number;
  locked: boolean;
}

export interface GuidesState {
  readonly guides: Guide[];
  nextId: number;
  version: number;
}

export function createGuidesState(): GuidesState {
  return { guides: [], nextId: 1, version: 0 };
}

export function addGuide(state: GuidesState, axis: GuideAxis, position: number): Guide {
  const guide: Guide = { id: state.nextId++, axis, position, locked: false };
  state.guides.push(guide);
  state.version++;
  return guide;
}

export function removeGuide(state: GuidesState, id: number): boolean {
  const idx = state.guides.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  state.guides.splice(idx, 1);
  state.version++;
  return true;
}

export function moveGuide(state: GuidesState, id: number, position: number): boolean {
  const guide = state.guides.find((g) => g.id === id);
  if (!guide || guide.locked) return false;
  guide.position = position;
  state.version++;
  return true;
}

export function lockGuide(state: GuidesState, id: number): boolean {
  const guide = state.guides.find((g) => g.id === id);
  if (!guide || guide.locked) return false;
  guide.locked = true;
  state.version++;
  return true;
}

export function unlockGuide(state: GuidesState, id: number): boolean {
  const guide = state.guides.find((g) => g.id === id);
  if (!guide || !guide.locked) return false;
  guide.locked = false;
  state.version++;
  return true;
}

export function clearGuides(state: GuidesState): void {
  if (state.guides.length === 0) return;
  state.guides.length = 0;
  state.version++;
}

export function getGuidesByAxis(state: Readonly<GuidesState>, axis: GuideAxis): readonly Guide[] {
  return state.guides.filter((g) => g.axis === axis);
}

export function getGuideById(state: Readonly<GuidesState>, id: number): Guide | undefined {
  return state.guides.find((g) => g.id === id);
}

export function getGuidesVersion(state: Readonly<GuidesState>): number {
  return state.version;
}

export function getGuideCount(state: Readonly<GuidesState>): number {
  return state.guides.length;
}

export function getGuideSnapPositions(state: Readonly<GuidesState>, axis: GuideAxis): readonly number[] {
  return state.guides.filter((g) => g.axis === axis).map((g) => g.position);
}
