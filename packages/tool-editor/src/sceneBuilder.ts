import type { Node2D, Scene2D, Transform2DLike } from '@flighthq/types';

import { addNodeChild, getNodeChildAt, getNodeChildCount, setNodeTransform2D } from '@flighthq/node';
import { createNode2D, createScene2D, createSprite } from '@flighthq/scene2d';
import { appendShapeBeginFill, appendShapeEndFill, appendShapeRectangle, createShape } from '@flighthq/shape';
import { DisplayObjectKind } from '@flighthq/types';

export interface SceneNodeDef {
  readonly name?: string;
  readonly kind?: 'container' | 'sprite' | 'shape';
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly rotation?: number;
  readonly alpha?: number;
  readonly visible?: boolean;
  readonly fillColor?: number;
  readonly fillAlpha?: number;
  readonly children?: readonly SceneNodeDef[];
}

export interface SceneDef {
  readonly width?: number;
  readonly height?: number;
  readonly root?: readonly SceneNodeDef[];
}

export function buildScene(def: Readonly<SceneDef>): Scene2D {
  const width = def.width ?? 800;
  const height = def.height ?? 600;
  const scene = createScene2D({ scene2dWidth: width, scene2dHeight: height });

  if (def.root) {
    for (const childDef of def.root) {
      const child = buildNode(childDef);
      addNodeChild(scene.root, child);
    }
  }

  return scene;
}

export function buildNode(def: Readonly<SceneNodeDef>): Node2D {
  const node = createNodeForKind(def);

  if (def.name !== undefined) {
    node.name = def.name;
  }

  if (def.alpha !== undefined) {
    node.alpha = def.alpha;
  }

  if (def.visible !== undefined) {
    node.visible = def.visible;
  }

  applyTransform(node, def);

  if (def.children) {
    for (const childDef of def.children) {
      addNodeChild(node, buildNode(childDef));
    }
  }

  return node;
}

export function countNodes(scene: Readonly<Scene2D>): number {
  return countDescendants(scene.root);
}

function createNodeForKind(def: Readonly<SceneNodeDef>): Node2D {
  if (def.kind === 'shape') {
    return createShapeNode(def);
  }
  if (def.kind === 'sprite') {
    return createSprite();
  }
  return createNode2D(DisplayObjectKind);
}

function createShapeNode(def: Readonly<SceneNodeDef>): Node2D {
  const shape = createShape();
  const w = def.width ?? 0;
  const h = def.height ?? 0;
  const color = def.fillColor ?? 0xffffff;
  const alpha = def.fillAlpha ?? 1;

  if (w > 0 && h > 0) {
    appendShapeBeginFill(shape, color, alpha);
    appendShapeRectangle(shape, 0, 0, w, h);
    appendShapeEndFill(shape);
  }

  return shape;
}

function countDescendants(node: Readonly<Node2D>): number {
  const childCount = getNodeChildCount(node);
  let total = childCount;
  for (let i = 0; i < childCount; i++) {
    const child = getNodeChildAt(node, i);
    if (child) {
      total += countDescendants(child as Node2D);
    }
  }
  return total;
}

function applyTransform(node: Node2D, def: Readonly<SceneNodeDef>): void {
  const hasTransform =
    def.x !== undefined ||
    def.y !== undefined ||
    def.scaleX !== undefined ||
    def.scaleY !== undefined ||
    def.rotation !== undefined;

  if (!hasTransform) return;

  const transform: Transform2DLike = {
    x: def.x ?? 0,
    y: def.y ?? 0,
    scaleX: def.scaleX ?? 1,
    scaleY: def.scaleY ?? 1,
    skewX: 0,
    skewY: 0,
    pivotX: 0,
    pivotY: 0,
    rotation: def.rotation ?? 0,
  };

  setNodeTransform2D(node, transform);
}
