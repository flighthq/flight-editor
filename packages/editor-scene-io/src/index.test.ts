import * as sceneIO from './index';

describe('@flighthq/editor-scene-io exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(sceneIO).sort()).toEqual([
      'completeLoad',
      'completeSave',
      'createSceneIOState',
      'failLoad',
      'failSave',
      'getLoadError',
      'getSaveError',
      'getSceneIOVersion',
      'isLoading',
      'isSaving',
      'startLoad',
      'startSave',
    ]);
  });
});
