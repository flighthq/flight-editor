import type { DocumentFormat } from '@flighthq/editor-document';
import type { Node2D, Scene2D } from '@flighthq/types';

import type { EditorState } from './editorState';

import { clearCommandHistory } from '@flighthq/editor-command';
import { collapseHierarchyAll } from '@flighthq/editor-hierarchy';
import { clearLocks } from '@flighthq/editor-lock';
import {
  markSceneClean,
  setSceneBackgroundColor,
  setSceneDimensions,
  setSceneName,
} from '@flighthq/editor-scene-state';
import { clearSelection } from '@flighthq/editor-selection';
import { addNodeChild, getNodeChildAt, getNodeChildCount } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';

import { setEditorScene } from './editorState';

interface SerializedNode {
  readonly kind: string;
  readonly traits: Readonly<Record<string, unknown>>;
  readonly children: readonly SerializedNode[];
}

interface SerializedScene {
  readonly align: Scene2D['align'];
  readonly color: number | null;
  readonly scaleMode: Scene2D['scaleMode'];
  readonly width: number;
  readonly height: number;
  readonly root: SerializedNode;
}

interface SerializedSceneDocument {
  readonly format: 'flight-scene';
  readonly version: 1;
  readonly name: string;
  readonly backgroundColor: number;
  readonly scene: SerializedScene;
}

const SerializerFormats: readonly DocumentFormat[] = Object.freeze<DocumentFormat[]>(['flight', 'json']);

export function serializeScene(editor: Readonly<EditorState>): ArrayBuffer {
  const scene = editor.scene;
  if (scene === null) throw new Error('Cannot serialize an editor without a scene');

  const document: SerializedSceneDocument = {
    format: 'flight-scene',
    version: 1,
    name: editor.sceneState.name,
    backgroundColor: editor.sceneState.backgroundColor,
    scene: {
      align: scene.align,
      color: scene.color,
      scaleMode: scene.scaleMode,
      width: scene.scene2dWidth,
      height: scene.scene2dHeight,
      root: serializeNode(scene.root),
    },
  };
  const bytes = new TextEncoder().encode(JSON.stringify(document));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function deserializeScene(editor: EditorState, data: ArrayBuffer): void {
  const document = parseDocument(data);
  const serialized = document.scene;
  const scene = createScene2D({
    align: serialized.align,
    color: serialized.color,
    scaleMode: serialized.scaleMode,
    scene2dWidth: serialized.width,
    scene2dHeight: serialized.height,
  });
  applyNodeTraits(scene.root, serialized.root.traits);
  restoreNodeChildren(scene.root, serialized.root.children);

  clearSelection(editor.selection);
  clearCommandHistory(editor.commandHistory);
  collapseHierarchyAll(editor.hierarchy);
  clearLocks(editor.locks);
  setEditorScene(editor, scene);
  setSceneName(editor.sceneState, document.name);
  setSceneDimensions(editor.sceneState, serialized.width, serialized.height);
  setSceneBackgroundColor(editor.sceneState, document.backgroundColor);
  markSceneClean(editor.sceneState);
}

export function getSerializerFormats(): readonly DocumentFormat[] {
  return SerializerFormats;
}

function serializeNode(node: Readonly<Node2D>): SerializedNode {
  const traits: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'kind') traits[key] = value;
  }

  const children: SerializedNode[] = [];
  const childCount = getNodeChildCount(node);
  for (let index = 0; index < childCount; index++) {
    const child = getNodeChildAt(node, index);
    if (child !== null) children.push(serializeNode(child));
  }
  return { kind: node.kind, traits, children };
}

function restoreNode(serialized: SerializedNode): Node2D {
  const node = createNode2D(serialized.kind);
  applyNodeTraits(node, serialized.traits);
  restoreNodeChildren(node, serialized.children);
  return node;
}

function restoreNodeChildren(parent: Node2D, children: readonly SerializedNode[]): void {
  for (const child of children) addNodeChild(parent, restoreNode(child));
}

function applyNodeTraits(node: Node2D, traits: Readonly<Record<string, unknown>>): void {
  const target = node as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(traits)) {
    if (key === '__proto__' || key === 'constructor' || key === 'kind' || key === 'prototype') continue;
    target[key] = value;
  }
}

function parseDocument(data: ArrayBuffer): SerializedSceneDocument {
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
  } catch {
    throw new Error('Invalid Flight scene data');
  }
  if (!isSerializedSceneDocument(value)) throw new Error('Invalid Flight scene data');
  return value;
}

function isSerializedSceneDocument(value: unknown): value is SerializedSceneDocument {
  if (!isRecord(value) || value.format !== 'flight-scene' || value.version !== 1) return false;
  if (typeof value.name !== 'string' || !isFiniteNumber(value.backgroundColor)) return false;

  const scene = value.scene;
  if (!isRecord(scene)) return false;
  if (typeof scene.align !== 'string' || typeof scene.scaleMode !== 'string') return false;
  if (scene.color !== null && !isFiniteNumber(scene.color)) return false;
  if (!isFiniteNumber(scene.width) || !isFiniteNumber(scene.height)) return false;
  return isSerializedNode(scene.root);
}

function isSerializedNode(value: unknown): value is SerializedNode {
  if (!isRecord(value) || typeof value.kind !== 'string' || !isRecord(value.traits)) return false;
  return Array.isArray(value.children) && value.children.every(isSerializedNode);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
