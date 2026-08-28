export {
  clearPropertyValues,
  createPropertyPanelState,
  getCategories,
  getEditingPropertyId,
  getPropertyCount,
  getPropertyDefinition,
  getPropertyDefinitions,
  getPropertyDefinitionsByCategory,
  getPropertyPanelVersion,
  getPropertyValue,
  isCategoryExpanded,
  isPropertyMixed,
  registerProperty,
  setCategoryExpanded,
  setEditingPropertyId,
  setPropertyValue,
  unregisterProperty,
} from './propertyState';

export type { PropertyDefinition, PropertyPanelState, PropertyType, PropertyValue } from './propertyState';
