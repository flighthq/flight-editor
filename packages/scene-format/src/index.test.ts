import * as sceneFormat from './index';

describe('@flighthq/scene-format exports', () => {
  it('exposes the canonical YAML codec', () => {
    expect(Object.keys(sceneFormat).sort()).toEqual([
      'inspectFlightScene',
      'migrateFlightSceneIdentities',
      'parseFlightScene',
      'stringifyFlightScene',
      'validateFlightScene',
    ]);
  });
});
