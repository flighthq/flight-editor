import type { TextFormat } from '@flighthq/types';

export type TextFontWeight = 'normal' | 'bold';
export type TextFontStyle = 'normal' | 'italic';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextStyleState {
  fontFamily: string | null;
  fontSize: number;
  fontWeight: TextFontWeight;
  fontStyle: TextFontStyle;
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing: number;
  color: number | null;
  underline: boolean;
  strikethrough: boolean;
  version: number;
}

export function createTextStyleState(): TextStyleState {
  return {
    fontFamily: null,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 1.2,
    letterSpacing: 0,
    color: null,
    underline: false,
    strikethrough: false,
    version: 0,
  };
}

export function setTextFontFamily(state: TextStyleState, fontFamily: string | null): void {
  setValue(state, 'fontFamily', fontFamily);
}

export function setTextFontSize(state: TextStyleState, fontSize: number): void {
  setValue(state, 'fontSize', fontSize);
}

export function setTextFontWeight(state: TextStyleState, fontWeight: TextFontWeight): void {
  setValue(state, 'fontWeight', fontWeight);
}

export function setTextFontStyle(state: TextStyleState, fontStyle: TextFontStyle): void {
  setValue(state, 'fontStyle', fontStyle);
}

export function setTextAlign(state: TextStyleState, textAlign: TextAlign): void {
  setValue(state, 'textAlign', textAlign);
}

export function setTextLineHeight(state: TextStyleState, lineHeight: number): void {
  setValue(state, 'lineHeight', lineHeight);
}

export function setTextLetterSpacing(state: TextStyleState, letterSpacing: number): void {
  setValue(state, 'letterSpacing', letterSpacing);
}

export function setTextColor(state: TextStyleState, color: number | null): void {
  setValue(state, 'color', color === null ? null : color >>> 0);
}

export function setTextUnderline(state: TextStyleState, underline: boolean): void {
  setValue(state, 'underline', underline);
}

export function setTextStrikethrough(state: TextStyleState, strikethrough: boolean): void {
  setValue(state, 'strikethrough', strikethrough);
}

export function getTextFontFamily(state: Readonly<TextStyleState>): string | null {
  return state.fontFamily;
}

export function getTextFontSize(state: Readonly<TextStyleState>): number {
  return state.fontSize;
}

export function getTextFontWeight(state: Readonly<TextStyleState>): TextFontWeight {
  return state.fontWeight;
}

export function getTextFontStyle(state: Readonly<TextStyleState>): TextFontStyle {
  return state.fontStyle;
}

export function getTextAlign(state: Readonly<TextStyleState>): TextAlign {
  return state.textAlign;
}

export function getTextLineHeight(state: Readonly<TextStyleState>): number {
  return state.lineHeight;
}

export function getTextLetterSpacing(state: Readonly<TextStyleState>): number {
  return state.letterSpacing;
}

export function getTextColor(state: Readonly<TextStyleState>): number | null {
  return state.color;
}

export function isTextUnderline(state: Readonly<TextStyleState>): boolean {
  return state.underline;
}

export function isTextStrikethrough(state: Readonly<TextStyleState>): boolean {
  return state.strikethrough;
}

export function getTextStyleVersion(state: Readonly<TextStyleState>): number {
  return state.version;
}

export function applyTextStyleToFormat(state: Readonly<TextStyleState>, format: TextFormat): void {
  if (state.fontFamily === null) delete format.font;
  else format.font = state.fontFamily;
  format.size = state.fontSize;
  format.bold = state.fontWeight === 'bold';
  format.italic = state.fontStyle === 'italic';
  format.align = state.textAlign;
  format.leading = state.lineHeight;
  format.letterSpacing = state.letterSpacing;
  if (state.color === null) delete format.color;
  else format.color = state.color;
  format.underline = state.underline;
  format.strikethrough = state.strikethrough;
}

export function readTextStyleFromFormat(state: TextStyleState, format: Readonly<TextFormat>): void {
  const next = {
    fontFamily: format.font ?? null,
    fontSize: format.size ?? 16,
    fontWeight: format.bold === true ? ('bold' as const) : ('normal' as const),
    fontStyle: format.italic === true ? ('italic' as const) : ('normal' as const),
    textAlign: normalizeTextAlign(format.align),
    lineHeight: format.leading ?? 1.2,
    letterSpacing: format.letterSpacing ?? 0,
    color: format.color === undefined ? null : format.color >>> 0,
    underline: format.underline ?? false,
    strikethrough: format.strikethrough ?? false,
  };

  if (
    state.fontFamily === next.fontFamily &&
    state.fontSize === next.fontSize &&
    state.fontWeight === next.fontWeight &&
    state.fontStyle === next.fontStyle &&
    state.textAlign === next.textAlign &&
    state.lineHeight === next.lineHeight &&
    state.letterSpacing === next.letterSpacing &&
    state.color === next.color &&
    state.underline === next.underline &&
    state.strikethrough === next.strikethrough
  ) {
    return;
  }

  Object.assign(state, next);
  state.version++;
}

function normalizeTextAlign(align: TextFormat['align']): TextAlign {
  if (align === 'center' || align === 'right' || align === 'justify') return align;
  if (align === 'end') return 'right';
  return 'left';
}

function setValue<Key extends keyof Omit<TextStyleState, 'version'>>(
  state: TextStyleState,
  key: Key,
  value: TextStyleState[Key],
): void {
  if (state[key] === value) return;
  state[key] = value;
  state.version++;
}
