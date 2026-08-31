import * as component from './index';

describe('@flighthq/editor-component exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(component).sort()).toEqual([
      'addComponentInstance',
      'clearInstanceOverrides',
      'createComponentCommand',
      'createComponentState',
      'detachComponentInstance',
      'getBrokenComponentInstances',
      'getComponentDefinition',
      'getComponentDefinitionCount',
      'getComponentDefinitions',
      'getComponentInstance',
      'getComponentVersion',
      'getInstancesOfDefinition',
      'registerComponent',
      'relinkComponentDefinition',
      'removeComponentInstance',
      'setInstanceOverrides',
      'swapComponentInstance',
      'unregisterComponent',
      'validateComponentState',
    ]);
  });
});
