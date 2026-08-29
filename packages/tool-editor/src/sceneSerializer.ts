import type { DocumentFormat } from '@flighthq/editor-document';
import type { FlightSceneDocument, FlightSceneNode, FlightSceneValue } from '@flighthq/scene-format';
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
import { parseFlightScene, stringifyFlightScene } from '@flighthq/scene-format';

import { setEditorScene } from './editorState';

const SerializerFormats: readonly DocumentFormat[] = Object.freeze<DocumentFormat[]>(['flight']);
const serializationExtras = new WeakMap<
  EditorState,
  Readonly<{ document: Record<string, unknown>; scene: Record<string, unknown> }>
>();

export function serializeScene(editor: Readonly<EditorState>): ArrayBuffer {
  const scene = editor.scene;
  if (scene === null) throw new Error('Cannot serialize an editor without a scene');

  const extras = serializationExtras.get(editor);
  const document: FlightSceneDocument = {
    ...extras?.document,
    format: 'flight-scene',
    version: 1,
    name: editor.sceneState.name,
    backgroundColor: editor.sceneState.backgroundColor,
    scene: {
      ...extras?.scene,
      align: scene.align,
      color: scene.color,
      scaleMode: scene.scaleMode,
      width: scene.scene2dWidth,
      height: scene.scene2dHeight,
      root: serializeNode(scene.root),
    },
  };
  const bytes = new TextEncoder().encode(stringifyFlightScene(document));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function deserializeScene(editor: EditorState, data: ArrayBuffer): void {
  const document = parseDocument(data);
  const serialized = document.scene;
  serializationExtras.set(editor, {
    document: omitKeys(document, ['format', 'version', 'name', 'backgroundColor', 'scene']),
    scene: omitKeys(serialized, ['align', 'color', 'scaleMode', 'width', 'height', 'root']),
  });
  const scene = createScene2D({
    align: serialized.align as Scene2D['align'],
    color: serialized.color,
    scaleMode: serialized.scaleMode as Scene2D['scaleMode'],
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

function serializeNode(node: Readonly<Node2D>): FlightSceneNode {
  const traits: Record<string, FlightSceneValue> = {};
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'kind' && isFlightSceneValue(value)) traits[key] = value;
  }

  const children: FlightSceneNode[] = [];
  const childCount = getNodeChildCount(node);
  for (let index = 0; index < childCount; index++) {
    const child = getNodeChildAt(node, index);
    if (child !== null) children.push(serializeNode(child));
  }
  return { kind: node.kind, traits, children };
}

function restoreNode(serialized: FlightSceneNode): Node2D {
  const node = createNode2D(serialized.kind);
  applyNodeTraits(node, serialized.traits);
  restoreNodeChildren(node, serialized.children);
  return node;
}

function restoreNodeChildren(parent: Node2D, children: readonly FlightSceneNode[]): void {
  for (const child of children) addNodeChild(parent, restoreNode(child));
}

function applyNodeTraits(node: Node2D, traits: Readonly<Record<string, FlightSceneValue>>): void {
  const target = node as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(traits)) {
    if (key === '__proto__' || key === 'constructor' || key === 'kind' || key === 'prototype') continue;
    target[key] = value;
  }
}

function parseDocument(data: ArrayBuffer): FlightSceneDocument {
  return parseFlightScene(new TextDecoder().decode(new Uint8Array(data)));
}

function omitKeys(value: object, keys: readonly string[]): Record<string, unknown> {
  const omitted = new Set(keys);
  return Object.fromEntries(
    Object.entries(value).filter(([key, value]) => !omitted.has(key) && isFlightSceneValue(value)),
  );
}

function isFlightSceneValue(value: unknown): value is FlightSceneValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isFlightSceneValue);
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value as Record<string, unknown>).every(isFlightSceneValue)
  );
}
