export type PhysicsDimension = '2d' | '3d';
export type PhysicsBodyMode = 'static' | 'dynamic' | 'kinematic';
export interface PhysicsBody {
  readonly nodeId: string;
  readonly dimension: PhysicsDimension;
  readonly mode: PhysicsBodyMode;
  readonly mass: number;
  readonly layer: number;
}
export interface PhysicsCollider {
  readonly id: string;
  readonly nodeId: string;
  readonly shape: 'box' | 'circle' | 'sphere' | 'capsule' | 'mesh';
  readonly size: readonly number[];
  readonly trigger: boolean;
}
export interface PhysicsJoint {
  readonly id: string;
  readonly nodeId: string;
  readonly targetNodeId: string;
  readonly kind: 'fixed' | 'hinge' | 'spring' | 'slider';
}
export interface PhysicsAuthoringState {
  bodies: Map<string, PhysicsBody>;
  colliders: Map<string, PhysicsCollider>;
  joints: Map<string, PhysicsJoint>;
  debugVisible: boolean;
  playMode: boolean;
  runtimeValues: Map<string, unknown>;
  version: number;
}
export function createPhysicsAuthoringState(): PhysicsAuthoringState {
  return {
    bodies: new Map(),
    colliders: new Map(),
    joints: new Map(),
    debugVisible: false,
    playMode: false,
    runtimeValues: new Map(),
    version: 0,
  };
}
export function setPhysicsBody(s: PhysicsAuthoringState, b: PhysicsBody): void {
  if (
    !b.nodeId.trim() ||
    !Number.isFinite(b.mass) ||
    b.mass < 0 ||
    !Number.isInteger(b.layer) ||
    b.layer < 0 ||
    b.layer > 31
  )
    throw new Error('Invalid physics body');
  s.bodies.set(b.nodeId, { ...b });
  s.version++;
}
export function setPhysicsCollider(s: PhysicsAuthoringState, c: PhysicsCollider): void {
  if (!c.id.trim() || !c.nodeId.trim() || !c.size.length || c.size.some((v) => !Number.isFinite(v) || v <= 0))
    throw new Error('Invalid collider');
  s.colliders.set(c.id, { ...c, size: [...c.size] });
  s.version++;
}
export function setPhysicsJoint(s: PhysicsAuthoringState, j: PhysicsJoint): void {
  if (j.nodeId === j.targetNodeId) throw new Error('Joint cannot target itself');
  s.joints.set(j.id, { ...j });
  s.version++;
}
export function removePhysicsNode(s: PhysicsAuthoringState, nodeId: string): readonly string[] {
  s.bodies.delete(nodeId);
  for (const [id, c] of s.colliders) if (c.nodeId === nodeId) s.colliders.delete(id);
  const removed: string[] = [];
  for (const [id, j] of s.joints)
    if (j.nodeId === nodeId || j.targetNodeId === nodeId) {
      s.joints.delete(id);
      removed.push(id);
    }
  s.version++;
  return removed.sort();
}
export function validatePhysicsAuthoring(
  s: Readonly<PhysicsAuthoringState>,
  nodes: ReadonlySet<string>,
): readonly string[] {
  const d: string[] = [];
  for (const b of s.bodies.values()) if (!nodes.has(b.nodeId)) d.push('missing-body-node:' + b.nodeId);
  for (const c of s.colliders.values()) if (!nodes.has(c.nodeId)) d.push('missing-collider-node:' + c.id);
  for (const j of s.joints.values())
    if (!nodes.has(j.nodeId) || !nodes.has(j.targetNodeId)) d.push('missing-joint-target:' + j.id);
  return d.sort();
}
export function enterPhysicsPlayMode(s: PhysicsAuthoringState): void {
  if (s.playMode) return;
  s.playMode = true;
  s.runtimeValues.clear();
  s.version++;
}
export function setPhysicsRuntimeValue(s: PhysicsAuthoringState, key: string, value: unknown): void {
  if (!s.playMode) throw new Error('Runtime values require play mode');
  s.runtimeValues.set(key, value);
}
export function exitPhysicsPlayMode(s: PhysicsAuthoringState): void {
  s.playMode = false;
  s.runtimeValues.clear();
  s.version++;
}
