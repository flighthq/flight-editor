export type PropertyType = 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'vector2';

export interface PropertyDefinition {
  readonly id: string;
  readonly label: string;
  readonly type: PropertyType;
  readonly category: string;
  readonly enumValues?: readonly string[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface PropertyValue {
  readonly value: unknown;
  readonly mixed: boolean;
}

export interface PropertyPanelState {
  definitions: Map<string, PropertyDefinition>;
  categories: string[];
  values: Map<string, PropertyValue>;
  expandedCategories: Set<string>;
  editingPropertyId: string | null;
  version: number;
}

export function createPropertyPanelState(): PropertyPanelState {
  return {
    definitions: new Map(),
    categories: [],
    values: new Map(),
    expandedCategories: new Set(),
    editingPropertyId: null,
    version: 0,
  };
}

export function registerProperty(state: PropertyPanelState, definition: PropertyDefinition): void {
  state.definitions.set(definition.id, definition);
  if (!state.categories.includes(definition.category)) {
    state.categories.push(definition.category);
  }
  state.version++;
}

export function unregisterProperty(state: PropertyPanelState, propertyId: string): boolean {
  if (!state.definitions.has(propertyId)) return false;
  state.definitions.delete(propertyId);
  state.values.delete(propertyId);
  state.version++;
  return true;
}

export function getPropertyDefinition(
  state: Readonly<PropertyPanelState>,
  propertyId: string,
): PropertyDefinition | null {
  return state.definitions.get(propertyId) ?? null;
}

export function getPropertyDefinitions(state: Readonly<PropertyPanelState>): readonly PropertyDefinition[] {
  return Array.from(state.definitions.values());
}

export function getPropertyDefinitionsByCategory(
  state: Readonly<PropertyPanelState>,
  category: string,
): readonly PropertyDefinition[] {
  return Array.from(state.definitions.values()).filter((d) => d.category === category);
}

export function getCategories(state: Readonly<PropertyPanelState>): readonly string[] {
  return state.categories;
}

export function setPropertyValue(state: PropertyPanelState, propertyId: string, value: unknown, mixed = false): void {
  state.values.set(propertyId, { value, mixed });
  state.version++;
}

export function getPropertyValue(state: Readonly<PropertyPanelState>, propertyId: string): PropertyValue | null {
  return state.values.get(propertyId) ?? null;
}

export function clearPropertyValues(state: PropertyPanelState): void {
  if (state.values.size === 0) return;
  state.values.clear();
  state.version++;
}

export function isPropertyMixed(state: Readonly<PropertyPanelState>, propertyId: string): boolean {
  return state.values.get(propertyId)?.mixed ?? false;
}

export function setCategoryExpanded(state: PropertyPanelState, category: string, expanded: boolean): void {
  const has = state.expandedCategories.has(category);
  if (expanded === has) return;
  if (expanded) {
    state.expandedCategories.add(category);
  } else {
    state.expandedCategories.delete(category);
  }
  state.version++;
}

export function isCategoryExpanded(state: Readonly<PropertyPanelState>, category: string): boolean {
  return state.expandedCategories.has(category);
}

export function getEditingPropertyId(state: Readonly<PropertyPanelState>): string | null {
  return state.editingPropertyId;
}

export function setEditingPropertyId(state: PropertyPanelState, propertyId: string | null): void {
  if (state.editingPropertyId === propertyId) return;
  state.editingPropertyId = propertyId;
  state.version++;
}

export function getPropertyPanelVersion(state: Readonly<PropertyPanelState>): number {
  return state.version;
}

export function getPropertyCount(state: Readonly<PropertyPanelState>): number {
  return state.definitions.size;
}
