export type MaterialValue = null | boolean | number | string | readonly number[];
export interface MaterialAsset {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly properties: Readonly<Record<string, MaterialValue>>;
  readonly textures: Readonly<Record<string, string>>;
}
export interface MaterialDiagnostic {
  readonly materialId: string;
  readonly code: 'missing-texture' | 'unsupported-property' | 'missing-material';
  readonly property: string | null;
}
export interface MaterialAuthoringState {
  materials: Map<string, MaterialAsset>;
  assignments: Map<string, readonly (string | null)[]>;
  previews: Map<string, string>;
  version: number;
}
export function createMaterialAuthoringState(): MaterialAuthoringState {
  return { materials: new Map(), assignments: new Map(), previews: new Map(), version: 0 };
}
export function addMaterialAsset(s: MaterialAuthoringState, m: MaterialAsset): void {
  if (!m.id.trim() || !m.name.trim()) throw new TypeError('Material identity and name are required');
  if (s.materials.has(m.id)) throw new Error('Material already exists');
  s.materials.set(m.id, { ...m, properties: { ...m.properties }, textures: { ...m.textures } });
  s.version++;
}
export function updateMaterialProperty(s: MaterialAuthoringState, id: string, key: string, value: MaterialValue): void {
  const m = s.materials.get(id);
  if (!m) throw new Error('Unknown material');
  s.materials.set(id, { ...m, properties: { ...m.properties, [key]: Array.isArray(value) ? [...value] : value } });
  s.previews.delete(id);
  s.version++;
}
export function assignMaterialSlot(
  s: MaterialAuthoringState,
  nodeId: string,
  slot: number,
  materialId: string | null,
): void {
  if (!Number.isInteger(slot) || slot < 0) throw new RangeError('Slot must be non-negative');
  if (materialId && !s.materials.has(materialId)) throw new Error('Unknown material');
  const a = [...(s.assignments.get(nodeId) ?? [])];
  while (a.length <= slot) a.push(null);
  a[slot] = materialId;
  s.assignments.set(nodeId, a);
  s.version++;
}
export function duplicateMaterialAsset(
  s: MaterialAuthoringState,
  id: string,
  nextId: string,
  nextName: string,
): MaterialAsset {
  const m = s.materials.get(id);
  if (!m) throw new Error('Unknown material');
  const copy = { ...m, id: nextId, name: nextName, properties: { ...m.properties }, textures: { ...m.textures } };
  addMaterialAsset(s, copy);
  return copy;
}
export function getMaterialUsage(
  s: Readonly<MaterialAuthoringState>,
  id: string,
): readonly { nodeId: string; slot: number }[] {
  const out = [] as { nodeId: string; slot: number }[];
  for (const [nodeId, a] of s.assignments)
    a.forEach((v, slot) => {
      if (v === id) out.push({ nodeId, slot });
    });
  return out.sort((a, b) => a.nodeId.localeCompare(b.nodeId) || a.slot - b.slot);
}
export function validateMaterials(
  s: Readonly<MaterialAuthoringState>,
  textures: ReadonlySet<string>,
  supported: ReadonlySet<string>,
): readonly MaterialDiagnostic[] {
  const d: MaterialDiagnostic[] = [];
  for (const m of s.materials.values()) {
    for (const [k, id] of Object.entries(m.textures))
      if (!textures.has(id)) d.push({ materialId: m.id, code: 'missing-texture', property: k });
    for (const k of Object.keys(m.properties))
      if (!supported.has(k)) d.push({ materialId: m.id, code: 'unsupported-property', property: k });
  }
  for (const a of s.assignments.values())
    for (const id of a)
      if (id && !s.materials.has(id)) d.push({ materialId: id, code: 'missing-material', property: null });
  return d;
}
