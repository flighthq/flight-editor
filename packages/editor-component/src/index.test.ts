import * as component from './index';

describe('@flighthq/editor-component exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(component).sort()).toEqual([
      'addComponentInstance',
      'clearInstanceOverrides',
      'createComponentState',
      'getComponentDefinition',
      'getComponentDefinitionCount',
      'getComponentDefinitions',
      'getComponentInstance',
      'getComponentVersion',
      'getInstancesOfDefinition',
      'registerComponent',
      'removeComponentInstance',
      'setInstanceOverrides',
      'unregisterComponent',
    ]);
  });
});
