import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  getEditorTextAlign,
  getEditorTextColor,
  getEditorTextFontFamily,
  getEditorTextFontSize,
  getEditorTextFontStyle,
  getEditorTextFontWeight,
  getEditorTextLetterSpacing,
  getEditorTextLineHeight,
  isEditorTextStrikethrough,
  isEditorTextUnderline,
  setEditorTextAlign,
  setEditorTextColor,
  setEditorTextFontFamily,
  setEditorTextFontSize,
  setEditorTextFontStyle,
  setEditorTextFontWeight,
  setEditorTextLetterSpacing,
  setEditorTextLineHeight,
  setEditorTextStrikethrough,
  setEditorTextUnderline,
  toggleEditorTextBold,
  toggleEditorTextItalic,
  toggleEditorTextUnderline,
} from './textStyleManager';

describe('setEditorTextFontFamily', () => {
  it('sets the font family', () => {
    const editor = createEditorState();
    setEditorTextFontFamily(editor, 'Arial');
    expect(getEditorTextFontFamily(editor)).toBe('Arial');
  });
});

describe('getEditorTextFontFamily', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorTextFontFamily(editor)).toBeNull();
  });
});

describe('setEditorTextFontSize', () => {
  it('sets the font size', () => {
    const editor = createEditorState();
    setEditorTextFontSize(editor, 24);
    expect(getEditorTextFontSize(editor)).toBe(24);
  });
});

describe('getEditorTextFontSize', () => {
  it('returns the font size', () => {
    const editor = createEditorState();
    expect(typeof getEditorTextFontSize(editor)).toBe('number');
  });
});

describe('setEditorTextFontWeight', () => {
  it('sets bold weight', () => {
    const editor = createEditorState();
    setEditorTextFontWeight(editor, 'bold');
    expect(getEditorTextFontWeight(editor)).toBe('bold');
  });
});

describe('getEditorTextFontWeight', () => {
  it('returns the default weight', () => {
    const editor = createEditorState();
    expect(getEditorTextFontWeight(editor)).toBe('normal');
  });
});

describe('setEditorTextFontStyle', () => {
  it('sets italic style', () => {
    const editor = createEditorState();
    setEditorTextFontStyle(editor, 'italic');
    expect(getEditorTextFontStyle(editor)).toBe('italic');
  });
});

describe('getEditorTextFontStyle', () => {
  it('returns the default style', () => {
    const editor = createEditorState();
    expect(getEditorTextFontStyle(editor)).toBe('normal');
  });
});

describe('setEditorTextAlign', () => {
  it('sets text alignment', () => {
    const editor = createEditorState();
    setEditorTextAlign(editor, 'center');
    expect(getEditorTextAlign(editor)).toBe('center');
  });
});

describe('getEditorTextAlign', () => {
  it('returns the default alignment', () => {
    const editor = createEditorState();
    expect(getEditorTextAlign(editor)).toBe('left');
  });
});

describe('setEditorTextLineHeight', () => {
  it('sets line height', () => {
    const editor = createEditorState();
    setEditorTextLineHeight(editor, 1.5);
    expect(getEditorTextLineHeight(editor)).toBe(1.5);
  });
});

describe('getEditorTextLineHeight', () => {
  it('returns the line height', () => {
    const editor = createEditorState();
    expect(typeof getEditorTextLineHeight(editor)).toBe('number');
  });
});

describe('setEditorTextLetterSpacing', () => {
  it('sets letter spacing', () => {
    const editor = createEditorState();
    setEditorTextLetterSpacing(editor, 2);
    expect(getEditorTextLetterSpacing(editor)).toBe(2);
  });
});

describe('getEditorTextLetterSpacing', () => {
  it('returns the letter spacing', () => {
    const editor = createEditorState();
    expect(typeof getEditorTextLetterSpacing(editor)).toBe('number');
  });
});

describe('setEditorTextColor', () => {
  it('sets text color', () => {
    const editor = createEditorState();
    setEditorTextColor(editor, 0xff0000);
    expect(getEditorTextColor(editor)).toBe(0xff0000);
  });
});

describe('getEditorTextColor', () => {
  it('returns null initially', () => {
    const editor = createEditorState();
    expect(getEditorTextColor(editor)).toBeNull();
  });
});

describe('setEditorTextUnderline', () => {
  it('enables underline', () => {
    const editor = createEditorState();
    setEditorTextUnderline(editor, true);
    expect(isEditorTextUnderline(editor)).toBe(true);
  });
});

describe('isEditorTextUnderline', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isEditorTextUnderline(editor)).toBe(false);
  });
});

describe('setEditorTextStrikethrough', () => {
  it('enables strikethrough', () => {
    const editor = createEditorState();
    setEditorTextStrikethrough(editor, true);
    expect(isEditorTextStrikethrough(editor)).toBe(true);
  });
});

describe('isEditorTextStrikethrough', () => {
  it('returns false initially', () => {
    const editor = createEditorState();
    expect(isEditorTextStrikethrough(editor)).toBe(false);
  });
});

describe('toggleEditorTextBold', () => {
  it('toggles bold state', () => {
    const editor = createEditorState();
    toggleEditorTextBold(editor);
    expect(getEditorTextFontWeight(editor)).toBe('bold');
    toggleEditorTextBold(editor);
    expect(getEditorTextFontWeight(editor)).toBe('normal');
  });
});

describe('toggleEditorTextItalic', () => {
  it('toggles italic state', () => {
    const editor = createEditorState();
    toggleEditorTextItalic(editor);
    expect(getEditorTextFontStyle(editor)).toBe('italic');
    toggleEditorTextItalic(editor);
    expect(getEditorTextFontStyle(editor)).toBe('normal');
  });
});

describe('toggleEditorTextUnderline', () => {
  it('toggles underline state', () => {
    const editor = createEditorState();
    toggleEditorTextUnderline(editor);
    expect(isEditorTextUnderline(editor)).toBe(true);
    toggleEditorTextUnderline(editor);
    expect(isEditorTextUnderline(editor)).toBe(false);
  });
});
