import * as properties from './index';

describe('@flighthq/editor-properties exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(properties).sort()).toEqual([
      'clearPropertyValues',
      'createPropertyPanelState',
      'getCategories',
      'getEditingPropertyId',
      'getPropertyCount',
      'getPropertyDefinition',
      'getPropertyDefinitions',
      'getPropertyDefinitionsByCategory',
      'getPropertyPanelVersion',
      'getPropertyValue',
      'isCategoryExpanded',
      'isPropertyMixed',
      'registerProperty',
      'setCategoryExpanded',
      'setEditingPropertyId',
      'setPropertyValue',
      'unregisterProperty',
    ]);
  });
});
