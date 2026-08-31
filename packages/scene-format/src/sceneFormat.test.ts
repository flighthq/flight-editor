import { describe, expect, it } from 'vitest';

import {
  inspectFlightScene,
  migrateFlightSceneIdentities,
  parseFlightScene,
  stringifyFlightScene,
  validateFlightScene,
} from './sceneFormat';

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

  it('orders known and unknown fields deterministically', () => {
    const document = parseFlightScene(source);
    const reordered = {
      pluginZ: { enabled: true },
      ...document,
      scene: { pluginB: 2, ...document.scene, pluginA: 1 },
    };
    const output = stringifyFlightScene(reordered);
    expect(output.indexOf('pluginA:')).toBeLessThan(output.indexOf('pluginB:'));
    expect(parseFlightScene(output)).toMatchObject({ pluginZ: { enabled: true } });
  });
});

describe('inspectFlightScene', () => {
  it('returns syntax locations without throwing', () => {
    const result = inspectFlightScene('format: flight-scene\nscene: [');
    expect(result.document).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({ code: 'yaml-syntax', severity: 'error', line: 2 });
  });

  it('returns semantic identity warnings alongside a usable legacy document', () => {
    const result = inspectFlightScene(source);
    expect(result.document?.name).toBe('YAML Scene');
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: 'missing-node-identity', path: 'scene.root', severity: 'warning' }),
    ]);
  });
});

describe('validateFlightScene', () => {
  it('detects duplicate identities and invalid dimensions deterministically', () => {
    const document = parseFlightScene(source);
    const invalid = {
      ...document,
      scene: {
        ...document.scene,
        width: 0,
        root: {
          ...document.scene.root,
          id: 'same',
          children: [{ id: 'same', kind: 'DisplayObject', traits: {}, children: [] }],
        },
      },
    };
    expect(validateFlightScene(invalid).map(({ code }) => code)).toEqual([
      'invalid-dimension',
      'duplicate-node-identity',
    ]);
  });
});

describe('migrateFlightSceneIdentities', () => {
  it('immutably mints stable identities and reports every change', () => {
    const document = parseFlightScene(source);
    const result = migrateFlightSceneIdentities(document, (path) => `id:${path}`);
    expect(result.document.scene.root.id).toBe('id:scene.root');
    expect(result.changes).toEqual([{ code: 'minted-node-identity', path: 'scene.root', identity: 'id:scene.root' }]);
    expect(document.scene.root.id).toBeUndefined();
    expect(validateFlightScene(result.document)).toEqual([]);
  });

  it('rejects duplicate identities instead of silently repairing references', () => {
    const document = parseFlightScene(source);
    const duplicate = {
      ...document,
      scene: {
        ...document.scene,
        root: {
          ...document.scene.root,
          id: 'same',
          children: [{ id: 'same', kind: 'DisplayObject', traits: {}, children: [] }],
        },
      },
    };
    expect(() => migrateFlightSceneIdentities(duplicate, () => 'unused')).toThrow('duplicate');
  });
});
