export type EnvironmentValue = null | boolean | number | string | readonly number[];
export interface EnvironmentContribution {
  readonly id: string;
  readonly defaults: Readonly<Record<string, EnvironmentValue>>;
  readonly validate?: (value: Readonly<Record<string, EnvironmentValue>>) => readonly string[];
}
export interface SceneEnvironmentState {
  values: Map<string, Readonly<Record<string, EnvironmentValue>>>;
  viewport: Map<string, EnvironmentValue>;
  contributions: Map<string, EnvironmentContribution>;
  version: number;
}
export function createSceneEnvironmentState(): SceneEnvironmentState {
  return { values: new Map(), viewport: new Map(), contributions: new Map(), version: 0 };
}
export function registerEnvironmentContribution(s: SceneEnvironmentState, c: EnvironmentContribution): void {
  if (!c.id.trim()) throw new TypeError('Contribution id is required');
  if (s.contributions.has(c.id)) throw new Error('Contribution already exists');
  s.contributions.set(c.id, { ...c, defaults: { ...c.defaults } });
  s.values.set(c.id, { ...c.defaults });
  s.version++;
}
export function setEnvironmentValue(s: SceneEnvironmentState, id: string, key: string, value: EnvironmentValue): void {
  if (!s.contributions.has(id)) throw new Error('Unknown environment contribution');
  s.values.set(id, { ...s.values.get(id), [key]: Array.isArray(value) ? [...value] : value });
  s.version++;
}
export function resetEnvironmentContribution(s: SceneEnvironmentState, id: string): void {
  const c = s.contributions.get(id);
  if (!c) throw new Error('Unknown environment contribution');
  s.values.set(id, { ...c.defaults });
  s.version++;
}
export function setViewportEnvironmentValue(s: SceneEnvironmentState, key: string, value: EnvironmentValue): void {
  s.viewport.set(key, Array.isArray(value) ? [...value] : value);
  s.version++;
}
export function validateSceneEnvironment(
  s: Readonly<SceneEnvironmentState>,
  supported: ReadonlySet<string>,
): readonly string[] {
  const d: string[] = [];
  for (const [id, c] of s.contributions) {
    if (!supported.has(id)) d.push('unsupported:' + id);
    for (const message of c.validate?.(s.values.get(id) ?? {}) ?? []) d.push(id + ':' + message);
  }
  return d.sort();
}
export function snapshotSceneEnvironment(
  s: Readonly<SceneEnvironmentState>,
): Readonly<Record<string, Readonly<Record<string, EnvironmentValue>>>> {
  return Object.fromEntries([...s.values].sort(([a], [b]) => a.localeCompare(b)).map(([id, v]) => [id, { ...v }]));
}
