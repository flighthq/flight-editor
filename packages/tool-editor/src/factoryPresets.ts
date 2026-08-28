import type { NodeFactory } from '@flighthq/editor-node-factory';

import { registerNodeKind } from '@flighthq/editor-node-factory';
import { createDisplayObject, createSprite } from '@flighthq/scene2d';
import { createShape } from '@flighthq/shape';
import { createNativeText, createTextLabel } from '@flighthq/text';
import { DisplayObjectKind, NativeTextKind, ShapeKind, SpriteKind, TextLabelKind } from '@flighthq/types';

export function registerDefaultNodeKinds(factory: NodeFactory): void {
  registerNodeKind(factory, DisplayObjectKind, 'Display Object', 'Containers', createDisplayObject);
  registerNodeKind(factory, SpriteKind, 'Sprite', 'Graphics', createSprite);
  registerNodeKind(factory, ShapeKind, 'Shape', 'Graphics', createShape);
  registerNodeKind(factory, NativeTextKind, 'Native Text', 'Text', createNativeText);
  registerNodeKind(factory, TextLabelKind, 'Text Label', 'Text', createTextLabel);
}
