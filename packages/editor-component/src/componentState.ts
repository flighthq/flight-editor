export interface ComponentDefinition {
  readonly id: string;
  readonly name: string;
  readonly sourceNodeId: string;
}

export interface ComponentOverride {
  readonly propertyPath: string;
  readonly value: unknown;
}

export interface ComponentInstance {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly overrides: ComponentOverride[];
}

export interface ComponentState {
  definitions: Map<string, ComponentDefinition>;
  instances: Map<string, ComponentInstance>;
  version: number;
}

export function createComponentState(): ComponentState {
  return { definitions: new Map(), instances: new Map(), version: 0 };
}

export function registerComponent(state: ComponentState, definition: ComponentDefinition): void {
  state.definitions.set(definition.id, definition);
  state.version++;
}

export function unregisterComponent(state: ComponentState, definitionId: string): boolean {
  if (!state.definitions.delete(definitionId)) return false;
  state.version++;
  return true;
}

export function getComponentDefinition(
  state: Readonly<ComponentState>,
  definitionId: string,
): ComponentDefinition | undefined {
  return state.definitions.get(definitionId);
}

export function getComponentDefinitions(state: Readonly<ComponentState>): readonly ComponentDefinition[] {
  return Array.from(state.definitions.values());
}

export function getComponentDefinitionCount(state: Readonly<ComponentState>): number {
  return state.definitions.size;
}

export function addComponentInstance(state: ComponentState, instance: ComponentInstance): void {
  state.instances.set(instance.instanceId, instance);
  state.version++;
}

export function removeComponentInstance(state: ComponentState, instanceId: string): boolean {
  if (!state.instances.delete(instanceId)) return false;
  state.version++;
  return true;
}

export function getComponentInstance(
  state: Readonly<ComponentState>,
  instanceId: string,
): ComponentInstance | undefined {
  return state.instances.get(instanceId);
}

export function getInstancesOfDefinition(
  state: Readonly<ComponentState>,
  definitionId: string,
): readonly ComponentInstance[] {
  const result: ComponentInstance[] = [];
  for (const instance of state.instances.values()) {
    if (instance.definitionId === definitionId) {
      result.push(instance);
    }
  }
  return result;
}

export function setInstanceOverrides(
  state: ComponentState,
  instanceId: string,
  overrides: readonly ComponentOverride[],
): boolean {
  const instance = state.instances.get(instanceId);
  if (!instance) return false;
  state.instances.set(instanceId, { ...instance, overrides: overrides.slice() });
  state.version++;
  return true;
}

export function clearInstanceOverrides(state: ComponentState, instanceId: string): boolean {
  const instance = state.instances.get(instanceId);
  if (!instance || instance.overrides.length === 0) return false;
  state.instances.set(instanceId, { ...instance, overrides: [] });
  state.version++;
  return true;
}

export function getComponentVersion(state: Readonly<ComponentState>): number {
  return state.version;
}
