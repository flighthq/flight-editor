import { describe, expect, it } from 'vitest';

import { parseFlightScene, stringifyFlightScene } from './sceneFormat';

const source = `format: flight-scene
version: 1
name: YAML Scene
backgroundColor: 4294967295
scene:
  align: center
  color: null
  scaleMode: showAll
  width: 800
  height: 600
  root:
    kind: DisplayObject
    traits:
      name: Scene
    children: []
`;

describe('parseFlightScene', () => {
  it('parses and validates a canonical YAML document', () => {
    expect(parseFlightScene(source)).toMatchObject({ name: 'YAML Scene', scene: { width: 800, height: 600 } });
  });

  it('rejects malformed YAML and incompatible documents', () => {
    expect(() => parseFlightScene('scene: [')).toThrow('Invalid Flight scene YAML');
    expect(() => parseFlightScene('format: something-else\n')).toThrow('Invalid Flight scene document');
  });
});

describe('stringifyFlightScene', () => {
  it('stringifies as YAML and round-trips', () => {
    const output = stringifyFlightScene(parseFlightScene(source));
    expect(output).toContain('format: flight-scene\n');
    expect(output.trimStart()).not.toMatch(/^\{/);
    expect(parseFlightScene(output)).toEqual(parseFlightScene(source));
  });
});
