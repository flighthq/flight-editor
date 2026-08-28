import type { Node2D, Transform2DLike } from '@flighthq/types';

import {
  addNodeChild,
  getNodeChildAt,
  getNodeChildCount,
  getNodeTransform2D,
  setNodeTransform2D,
} from '@flighthq/node';
import { cloneSprite, createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind, SpriteKind } from '@flighthq/types';

import type { Sprite } from '@flighthq/types';

export function cloneNode(source: Readonly<Node2D>): Node2D {
  if (source.kind === SpriteKind) {
    const clone = cloneSprite(source as Sprite);
    if (source.name) clone.name = source.name;
    return clone;
  }
  return createContainer(source);
}

export function deepCloneNode(source: Readonly<Node2D>): Node2D {
  const clone = cloneNode(source);
  const childCount = getNodeChildCount(source);
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(source, i) as Node2D | null;
    if (child) {
      addNodeChild(clone, deepCloneNode(child));
    }
  }
  return clone;
}

export function cloneNodeWithOffset(source: Readonly<Node2D>, offsetX: number, offsetY: number): Node2D {
  const clone = deepCloneNode(source);
  const t = readTransform(clone);
  t.x += offsetX;
  t.y += offsetY;
  setNodeTransform2D(clone, t);
  return clone;
}

export function cloneNodes(sources: readonly Node2D[]): Node2D[] {
  return sources.map((s) => deepCloneNode(s));
}

function createContainer(source: Readonly<Node2D>): Node2D {
  const node = createNode2D(DisplayObjectKind);
  if (source.name) {
    node.name = source.name;
  }
  node.alpha = source.alpha;
  node.visible = source.visible;
  copyTransform(source, node);
  return node;
}

function copyTransform(source: Readonly<Node2D>, target: Node2D): void {
  const t = readTransform(source);
  setNodeTransform2D(target, t);
}

function readTransform(node: Readonly<Node2D>): Transform2DLike {
  const t: Transform2DLike = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
  };
  getNodeTransform2D(t, node);
  return t;
}
