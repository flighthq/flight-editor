import type { TextAlign, TextFontStyle, TextFontWeight } from '@flighthq/editor-text-style';
import type { EditorState } from './editorState';

import {
  getTextAlign,
  getTextColor,
  getTextFontFamily,
  getTextFontSize,
  getTextFontStyle,
  getTextFontWeight,
  getTextLetterSpacing,
  getTextLineHeight,
  isTextStrikethrough,
  isTextUnderline,
  setTextAlign,
  setTextColor,
  setTextFontFamily,
  setTextFontSize,
  setTextFontStyle,
  setTextFontWeight,
  setTextLetterSpacing,
  setTextLineHeight,
  setTextStrikethrough,
  setTextUnderline,
} from '@flighthq/editor-text-style';

export function setEditorTextFontFamily(editor: EditorState, fontFamily: string | null): void {
  setTextFontFamily(editor.textStyle, fontFamily);
}

export function getEditorTextFontFamily(editor: Readonly<EditorState>): string | null {
  return getTextFontFamily(editor.textStyle);
}

export function setEditorTextFontSize(editor: EditorState, fontSize: number): void {
  setTextFontSize(editor.textStyle, fontSize);
}

export function getEditorTextFontSize(editor: Readonly<EditorState>): number {
  return getTextFontSize(editor.textStyle);
}

export function setEditorTextFontWeight(editor: EditorState, weight: TextFontWeight): void {
  setTextFontWeight(editor.textStyle, weight);
}

export function getEditorTextFontWeight(editor: Readonly<EditorState>): TextFontWeight {
  return getTextFontWeight(editor.textStyle);
}

export function setEditorTextFontStyle(editor: EditorState, style: TextFontStyle): void {
  setTextFontStyle(editor.textStyle, style);
}

export function getEditorTextFontStyle(editor: Readonly<EditorState>): TextFontStyle {
  return getTextFontStyle(editor.textStyle);
}

export function setEditorTextAlign(editor: EditorState, align: TextAlign): void {
  setTextAlign(editor.textStyle, align);
}

export function getEditorTextAlign(editor: Readonly<EditorState>): TextAlign {
  return getTextAlign(editor.textStyle);
}

export function setEditorTextLineHeight(editor: EditorState, lineHeight: number): void {
  setTextLineHeight(editor.textStyle, lineHeight);
}

export function getEditorTextLineHeight(editor: Readonly<EditorState>): number {
  return getTextLineHeight(editor.textStyle);
}

export function setEditorTextLetterSpacing(editor: EditorState, letterSpacing: number): void {
  setTextLetterSpacing(editor.textStyle, letterSpacing);
}

export function getEditorTextLetterSpacing(editor: Readonly<EditorState>): number {
  return getTextLetterSpacing(editor.textStyle);
}

export function setEditorTextColor(editor: EditorState, color: number | null): void {
  setTextColor(editor.textStyle, color);
}

export function getEditorTextColor(editor: Readonly<EditorState>): number | null {
  return getTextColor(editor.textStyle);
}

export function setEditorTextUnderline(editor: EditorState, underline: boolean): void {
  setTextUnderline(editor.textStyle, underline);
}

export function isEditorTextUnderline(editor: Readonly<EditorState>): boolean {
  return isTextUnderline(editor.textStyle);
}

export function setEditorTextStrikethrough(editor: EditorState, strikethrough: boolean): void {
  setTextStrikethrough(editor.textStyle, strikethrough);
}

export function isEditorTextStrikethrough(editor: Readonly<EditorState>): boolean {
  return isTextStrikethrough(editor.textStyle);
}

export function toggleEditorTextBold(editor: EditorState): void {
  setTextFontWeight(editor.textStyle, getTextFontWeight(editor.textStyle) === 'bold' ? 'normal' : 'bold');
}

export function toggleEditorTextItalic(editor: EditorState): void {
  setTextFontStyle(editor.textStyle, getTextFontStyle(editor.textStyle) === 'italic' ? 'normal' : 'italic');
}

export function toggleEditorTextUnderline(editor: EditorState): void {
  setTextUnderline(editor.textStyle, !isTextUnderline(editor.textStyle));
}
