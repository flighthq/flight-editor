import type { Node2D, Transform2DLike } from '@flighthq/types';

import { convertNodeVector2GlobalToLocal, getNodeWorldMatrix } from '@flighthq/node';

import { getSelectionBounds } from './boundsUtils';

export interface TransformPoint {
  readonly x: number;
  readonly y: number;
}

export interface DecomposedTransform {
  readonly position: TransformPoint;
  readonly rotation: number;
  readonly scale: TransformPoint;
  readonly skew: TransformPoint;
  readonly pivot: TransformPoint;
}

export function decomposeTransform(node: Readonly<Node2D>): DecomposedTransform {
  return {
    position: { x: node.x, y: node.y },
    rotation: (node.rotation * 180) / Math.PI,
    scale: { x: node.scaleX, y: node.scaleY },
    skew: { x: node.skewX, y: node.skewY },
    pivot: { x: node.pivotX, y: node.pivotY },
  };
}

export function composeTransform(decomposed: Readonly<DecomposedTransform>): Transform2DLike {
  return {
    x: decomposed.position.x,
    y: decomposed.position.y,
    rotation: (decomposed.rotation * Math.PI) / 180,
    scaleX: decomposed.scale.x,
    scaleY: decomposed.scale.y,
    skewX: decomposed.skew.x,
    skewY: decomposed.skew.y,
    pivotX: decomposed.pivot.x,
    pivotY: decomposed.pivot.y,
  };
}

export function getWorldPosition(node: Node2D): TransformPoint {
  const matrix = getNodeWorldMatrix(node);
  return { x: matrix.tx, y: matrix.ty };
}

export function getLocalPosition(node: Node2D, worldX: number, worldY: number): TransformPoint {
  const out = { x: 0, y: 0 };
  convertNodeVector2GlobalToLocal(out, node, { x: worldX, y: worldY });
  return out;
}

export function getNodeCenter(node: Node2D): TransformPoint {
  const bounds = getSelectionBounds([node])!;
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}
