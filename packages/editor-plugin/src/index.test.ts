import { describe, expect, it } from 'vitest';
import * as plugin from './index';
describe('@flighthq/editor-plugin exports', () => {
  it('exposes lifecycle contracts', () =>
    expect(Object.keys(plugin).sort()).toEqual([
      'createPluginState',
      'getPluginContributions',
      'loadPlugin',
      'migratePluginDocumentData',
      'runReadonlyPluginGenerator',
      'setPluginDocumentData',
      'unloadPlugin',
      'validatePluginWidget',
    ]));
});
