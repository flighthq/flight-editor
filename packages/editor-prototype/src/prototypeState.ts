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
}

export function createPrototypeState(): PrototypeState {
  return {
    interactions: new Map(),
    flows: new Map(),
    activeFlowId: null,
    previewActive: false,
    version: 0,
  };
}

export function addInteraction(state: PrototypeState, interaction: PrototypeInteraction): void {
  state.interactions.set(interaction.id, interaction);
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
  return result;
}

export function getInteractionCount(state: Readonly<PrototypeState>): number {
  return state.interactions.size;
}

export function addFlow(state: PrototypeState, flow: PrototypeFlow): void {
  state.flows.set(flow.id, flow);
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
  return Array.from(state.flows.values());
}

export function getFlowCount(state: Readonly<PrototypeState>): number {
  return state.flows.size;
}

export function getActiveFlowId(state: Readonly<PrototypeState>): string | null {
  return state.activeFlowId;
}

export function setActiveFlowId(state: PrototypeState, flowId: string | null): void {
  if (state.activeFlowId === flowId) return;
  state.activeFlowId = flowId;
  state.version++;
}

export function isPreviewActive(state: Readonly<PrototypeState>): boolean {
  return state.previewActive;
}

export function setPreviewActive(state: PrototypeState, active: boolean): void {
  if (state.previewActive === active) return;
  state.previewActive = active;
  state.version++;
}

export function getPrototypeVersion(state: Readonly<PrototypeState>): number {
  return state.version;
}
