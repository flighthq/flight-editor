import * as sceneState from './index';

describe('@flighthq/editor-scene-state exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(sceneState).sort()).toEqual([
      'createSceneState',
      'getSceneVersion',
      'isSceneDirty',
      'markSceneClean',
      'markSceneDirty',
      'setSceneBackgroundColor',
      'setSceneDimensions',
      'setSceneName',
    ]);
  });
});
