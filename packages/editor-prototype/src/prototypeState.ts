export type PrototypeTrigger = 'click' | 'hover' | 'drag' | 'key-press' | 'timer' | 'page-load';

export type PrototypeAction = 'navigate' | 'overlay' | 'scroll-to' | 'swap' | 'back' | 'url';

export type PrototypeTransition =
  | 'instant'
  | 'dissolve'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'push'
  | 'move-in';

export interface PrototypeInteraction {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly trigger: PrototypeTrigger;
  readonly action: PrototypeAction;
  readonly targetNodeId: string | null;
  readonly transition: PrototypeTransition;
  readonly durationMs: number;
  readonly condition?: { readonly variableId: string; readonly operator: string; readonly value: unknown };
  readonly parameters?: Readonly<Record<string, unknown>>;
}

export interface PrototypeFlow {
  readonly id: string;
  readonly name: string;
  readonly startNodeId: string;
}

export interface PrototypeState {
  interactions: Map<string, PrototypeInteraction>;
  flows: Map<string, PrototypeFlow>;
  activeFlowId: string | null;
  previewActive: boolean;
  version: number;
  sessionVersion: number;
}

export interface PrototypeDiagnostic {
  readonly code: 'broken-source' | 'broken-target' | 'duplicate-trigger' | 'invalid-flow' | 'invalid-interaction';
  readonly id: string;
  readonly message: string;
}

export interface CompiledPrototype {
  readonly revision: number;
  readonly flows: readonly PrototypeFlow[];
  readonly interactions: readonly PrototypeInteraction[];
}

function assertId(value: string, label: string): void {
  if (value.trim() === '') throw new TypeError(`${label} must not be empty`);
}

function assertInteraction(interaction: PrototypeInteraction): void {
  assertId(interaction.id, 'Interaction id');
  assertId(interaction.sourceNodeId, 'Interaction source');
  if (!Number.isFinite(interaction.durationMs) || interaction.durationMs < 0) {
    throw new RangeError('Interaction duration must be finite and non-negative');
  }
}

export function createPrototypeState(): PrototypeState {
  return {
    interactions: new Map(),
    flows: new Map(),
    activeFlowId: null,
    previewActive: false,
    version: 0,
    sessionVersion: 0,
  };
}

export function addInteraction(state: PrototypeState, interaction: PrototypeInteraction): void {
  assertInteraction(interaction);
  if (state.interactions.has(interaction.id)) throw new Error(`Interaction already exists: ${interaction.id}`);
  state.interactions.set(interaction.id, {
    ...interaction,
    parameters: interaction.parameters ? { ...interaction.parameters } : undefined,
  });
  state.version++;
}

export function removeInteraction(state: PrototypeState, interactionId: string): boolean {
  if (!state.interactions.delete(interactionId)) return false;
  state.version++;
  return true;
}

export function getInteraction(
  state: Readonly<PrototypeState>,
  interactionId: string,
): PrototypeInteraction | undefined {
  return state.interactions.get(interactionId);
}

export function getInteractionsForNode(
  state: Readonly<PrototypeState>,
  sourceNodeId: string,
): readonly PrototypeInteraction[] {
  const result: PrototypeInteraction[] = [];
  for (const interaction of state.interactions.values()) {
    if (interaction.sourceNodeId === sourceNodeId) {
      result.push(interaction);
    }
  }
  return result.sort((a, b) => a.id.localeCompare(b.id));
}

export function getInteractionCount(state: Readonly<PrototypeState>): number {
  return state.interactions.size;
}

export function addFlow(state: PrototypeState, flow: PrototypeFlow): void {
  assertId(flow.id, 'Flow id');
  assertId(flow.name, 'Flow name');
  assertId(flow.startNodeId, 'Flow start node');
  if (state.flows.has(flow.id)) throw new Error(`Flow already exists: ${flow.id}`);
  state.flows.set(flow.id, { ...flow });
  state.version++;
}

export function removeFlow(state: PrototypeState, flowId: string): boolean {
  if (!state.flows.delete(flowId)) return false;
  if (state.activeFlowId === flowId) {
    state.activeFlowId = null;
  }
  state.version++;
  return true;
}

export function getFlow(state: Readonly<PrototypeState>, flowId: string): PrototypeFlow | undefined {
  return state.flows.get(flowId);
}

export function getFlows(state: Readonly<PrototypeState>): readonly PrototypeFlow[] {
  return Array.from(state.flows.values()).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

export function getFlowCount(state: Readonly<PrototypeState>): number {
  return state.flows.size;
}

export function getActiveFlowId(state: Readonly<PrototypeState>): string | null {
  return state.activeFlowId;
}

export function setActiveFlowId(state: PrototypeState, flowId: string | null): void {
  if (flowId !== null && !state.flows.has(flowId)) throw new Error(`Flow does not exist: ${flowId}`);
  if (state.activeFlowId === flowId) return;
  state.activeFlowId = flowId;
  state.sessionVersion++;
}

export function isPreviewActive(state: Readonly<PrototypeState>): boolean {
  return state.previewActive;
}

export function setPreviewActive(state: PrototypeState, active: boolean): void {
  if (state.previewActive === active) return;
  state.previewActive = active;
  state.sessionVersion++;
}

export function getPrototypeVersion(state: Readonly<PrototypeState>): number {
  return state.version;
}

export function getPrototypeSessionVersion(state: Readonly<PrototypeState>): number {
  return state.sessionVersion;
}

export function reconnectInteraction(
  state: PrototypeState,
  interactionId: string,
  targetNodeId: string | null,
): boolean {
  const interaction = state.interactions.get(interactionId);
  if (interaction === undefined || interaction.targetNodeId === targetNodeId) return false;
  state.interactions.set(interactionId, { ...interaction, targetNodeId });
  state.version++;
  return true;
}

export function validatePrototypeState(
  state: Readonly<PrototypeState>,
  existingNodeIds: ReadonlySet<string>,
): readonly PrototypeDiagnostic[] {
  const diagnostics: PrototypeDiagnostic[] = [];
  const triggerSlots = new Set<string>();
  for (const flow of Array.from(state.flows.values()).sort((a, b) => a.id.localeCompare(b.id))) {
    if (flow.id.trim() === '' || flow.name.trim() === '' || !existingNodeIds.has(flow.startNodeId)) {
      diagnostics.push({ code: 'invalid-flow', id: flow.id, message: `Invalid flow start: ${flow.startNodeId}` });
    }
  }
  for (const interaction of Array.from(state.interactions.values()).sort((a, b) => a.id.localeCompare(b.id))) {
    if (!existingNodeIds.has(interaction.sourceNodeId)) {
      diagnostics.push({
        code: 'broken-source',
        id: interaction.id,
        message: `Source not found: ${interaction.sourceNodeId}`,
      });
    }
    if (interaction.targetNodeId !== null && !existingNodeIds.has(interaction.targetNodeId)) {
      diagnostics.push({
        code: 'broken-target',
        id: interaction.id,
        message: `Target not found: ${interaction.targetNodeId}`,
      });
    }
    if (!Number.isFinite(interaction.durationMs) || interaction.durationMs < 0) {
      diagnostics.push({ code: 'invalid-interaction', id: interaction.id, message: 'Interaction duration is invalid' });
    }
    const slot = `${interaction.sourceNodeId}\0${interaction.trigger}`;
    if (triggerSlots.has(slot)) {
      diagnostics.push({
        code: 'duplicate-trigger',
        id: interaction.id,
        message: 'Multiple interactions share a trigger slot',
      });
    }
    triggerSlots.add(slot);
  }
  return diagnostics;
}

export function compilePrototype(state: Readonly<PrototypeState>): CompiledPrototype {
  return {
    revision: state.version,
    flows: Array.from(state.flows.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((flow) => ({ ...flow })),
    interactions: Array.from(state.interactions.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((interaction) => ({
        ...interaction,
        parameters: interaction.parameters ? { ...interaction.parameters } : undefined,
      })),
  };
}
