import type { EditorState } from './editorState';
import type { Guide, GuideAxis } from '@flighthq/editor-guides';

import {
  addGuide,
  clearGuides,
  getGuideById,
  getGuideCount,
  getGuideSnapPositions,
  getGuidesByAxis,
  lockGuide,
  moveGuide,
  removeGuide,
  unlockGuide,
} from '@flighthq/editor-guides';

export function addEditorGuide(editor: EditorState, axis: GuideAxis, position: number): Guide {
  return addGuide(editor.guides, axis, position);
}

export function removeEditorGuide(editor: EditorState, guideId: number): boolean {
  return removeGuide(editor.guides, guideId);
}

export function moveEditorGuide(editor: EditorState, guideId: number, position: number): boolean {
  return moveGuide(editor.guides, guideId, position);
}

export function lockEditorGuide(editor: EditorState, guideId: number): boolean {
  return lockGuide(editor.guides, guideId);
}

export function unlockEditorGuide(editor: EditorState, guideId: number): boolean {
  return unlockGuide(editor.guides, guideId);
}

export function clearAllGuides(editor: EditorState): void {
  clearGuides(editor.guides);
}

export function getEditorGuide(editor: Readonly<EditorState>, guideId: number): Guide | undefined {
  return getGuideById(editor.guides, guideId);
}

export function getHorizontalGuides(editor: Readonly<EditorState>): readonly Guide[] {
  return getGuidesByAxis(editor.guides, 'horizontal');
}

export function getVerticalGuides(editor: Readonly<EditorState>): readonly Guide[] {
  return getGuidesByAxis(editor.guides, 'vertical');
}

export function getEditorGuideCount(editor: Readonly<EditorState>): number {
  return getGuideCount(editor.guides);
}

export function getEditorSnapPositions(editor: Readonly<EditorState>, axis: GuideAxis): readonly number[] {
  return getGuideSnapPositions(editor.guides, axis);
}
