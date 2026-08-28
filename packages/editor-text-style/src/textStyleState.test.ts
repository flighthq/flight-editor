import type { TextFormat } from '@flighthq/types';

import {
  applyTextStyleToFormat,
  createTextStyleState,
  getTextAlign,
  getTextColor,
  getTextFontFamily,
  getTextFontSize,
  getTextFontStyle,
  getTextFontWeight,
  getTextLetterSpacing,
  getTextLineHeight,
  getTextStyleVersion,
  isTextStrikethrough,
  isTextUnderline,
  readTextStyleFromFormat,
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
} from './textStyleState';

describe('applyTextStyleToFormat', () => {
  it('writes every text style property to a Flight format', () => {
    const state = createTextStyleState();
    setTextFontFamily(state, 'Inter');
    setTextFontSize(state, 24);
    setTextFontWeight(state, 'bold');
    setTextFontStyle(state, 'italic');
    setTextAlign(state, 'center');
    setTextLineHeight(state, 1.5);
    setTextLetterSpacing(state, 2);
    setTextColor(state, 0x12345678);
    setTextUnderline(state, true);
    setTextStrikethrough(state, true);
    const format: TextFormat = {};

    applyTextStyleToFormat(state, format);

    expect(format).toEqual({
      align: 'center',
      bold: true,
      color: 0x12345678,
      font: 'Inter',
      italic: true,
      leading: 1.5,
      letterSpacing: 2,
      size: 24,
      strikethrough: true,
      underline: true,
    });
  });

  it('removes optional values represented by null', () => {
    const format: TextFormat = { color: 0xffffffff, font: 'Inter' };
    applyTextStyleToFormat(createTextStyleState(), format);
    expect(format.font).toBeUndefined();
    expect(format.color).toBeUndefined();
  });
});

describe('createTextStyleState', () => {
  it('creates the documented default format', () => {
    expect(createTextStyleState()).toEqual({
      color: null,
      fontFamily: null,
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: 0,
      lineHeight: 1.2,
      strikethrough: false,
      textAlign: 'left',
      underline: false,
      version: 0,
    });
  });
});

describe('getTextAlign', () => {
  it('returns the active alignment', () => {
    const state = createTextStyleState();
    setTextAlign(state, 'justify');
    expect(getTextAlign(state)).toBe('justify');
  });
});

describe('getTextColor', () => {
  it('returns the packed active color', () => {
    const state = createTextStyleState();
    setTextColor(state, 0x12345678);
    expect(getTextColor(state)).toBe(0x12345678);
  });
});

describe('getTextFontFamily', () => {
  it('returns the active font family', () => {
    const state = createTextStyleState();
    setTextFontFamily(state, 'Inter');
    expect(getTextFontFamily(state)).toBe('Inter');
  });
});

describe('getTextFontSize', () => {
  it('returns the active font size', () => {
    const state = createTextStyleState();
    setTextFontSize(state, 20);
    expect(getTextFontSize(state)).toBe(20);
  });
});

describe('getTextFontStyle', () => {
  it('returns the active font style', () => {
    const state = createTextStyleState();
    setTextFontStyle(state, 'italic');
    expect(getTextFontStyle(state)).toBe('italic');
  });
});

describe('getTextFontWeight', () => {
  it('returns the active font weight', () => {
    const state = createTextStyleState();
    setTextFontWeight(state, 'bold');
    expect(getTextFontWeight(state)).toBe('bold');
  });
});

describe('getTextLetterSpacing', () => {
  it('returns the active letter spacing', () => {
    const state = createTextStyleState();
    setTextLetterSpacing(state, 2.5);
    expect(getTextLetterSpacing(state)).toBe(2.5);
  });
});

describe('getTextLineHeight', () => {
  it('returns the active line height', () => {
    const state = createTextStyleState();
    setTextLineHeight(state, 1.4);
    expect(getTextLineHeight(state)).toBe(1.4);
  });
});

describe('getTextStyleVersion', () => {
  it('counts meaningful changes', () => {
    const state = createTextStyleState();
    setTextFontSize(state, 20);
    setTextFontSize(state, 20);
    expect(getTextStyleVersion(state)).toBe(1);
  });
});

describe('isTextStrikethrough', () => {
  it('returns whether strikethrough is active', () => {
    const state = createTextStyleState();
    setTextStrikethrough(state, true);
    expect(isTextStrikethrough(state)).toBe(true);
  });
});

describe('isTextUnderline', () => {
  it('returns whether underline is active', () => {
    const state = createTextStyleState();
    setTextUnderline(state, true);
    expect(isTextUnderline(state)).toBe(true);
  });
});

describe('readTextStyleFromFormat', () => {
  it('reads a Flight format as one state change', () => {
    const state = createTextStyleState();
    readTextStyleFromFormat(state, {
      align: 'right',
      bold: true,
      color: -1,
      font: 'Roboto',
      italic: true,
      leading: 1.75,
      letterSpacing: 3,
      size: 30,
      strikethrough: true,
      underline: true,
    });

    expect(state).toEqual({
      color: 0xffffffff,
      fontFamily: 'Roboto',
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 'bold',
      letterSpacing: 3,
      lineHeight: 1.75,
      strikethrough: true,
      textAlign: 'right',
      underline: true,
      version: 1,
    });
  });

  it('uses defaults for absent properties and no-ops when unchanged', () => {
    const state = createTextStyleState();
    readTextStyleFromFormat(state, {});
    expect(state.version).toBe(0);
  });

  it('normalizes logical Flight alignment values', () => {
    const state = createTextStyleState();
    readTextStyleFromFormat(state, { align: 'end' });
    expect(state.textAlign).toBe('right');
    readTextStyleFromFormat(state, { align: 'start' });
    expect(state.textAlign).toBe('left');
  });
});

describe('setTextAlign', () => {
  it('updates alignment once', () => {
    const state = createTextStyleState();
    setTextAlign(state, 'center');
    setTextAlign(state, 'center');
    expect(state.textAlign).toBe('center');
    expect(state.version).toBe(1);
  });
});

describe('setTextColor', () => {
  it('packs colors and supports the mixed-state null sentinel', () => {
    const state = createTextStyleState();
    setTextColor(state, -1);
    expect(state.color).toBe(0xffffffff);
    setTextColor(state, null);
    expect(state.color).toBeNull();
    expect(state.version).toBe(2);
  });
});

describe('setTextFontFamily', () => {
  it('updates the family and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextFontFamily(state, 'Inter');
    setTextFontFamily(state, 'Inter');
    expect(state.fontFamily).toBe('Inter');
    expect(state.version).toBe(1);
  });
});

describe('setTextFontSize', () => {
  it('updates the size and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextFontSize(state, 18);
    setTextFontSize(state, 18);
    expect(state.fontSize).toBe(18);
    expect(state.version).toBe(1);
  });
});

describe('setTextFontStyle', () => {
  it('updates the font style and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextFontStyle(state, 'italic');
    setTextFontStyle(state, 'italic');
    expect(state.fontStyle).toBe('italic');
    expect(state.version).toBe(1);
  });
});

describe('setTextFontWeight', () => {
  it('updates the weight and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextFontWeight(state, 'bold');
    setTextFontWeight(state, 'bold');
    expect(state.fontWeight).toBe('bold');
    expect(state.version).toBe(1);
  });
});

describe('setTextLetterSpacing', () => {
  it('updates letter spacing and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextLetterSpacing(state, 1.5);
    setTextLetterSpacing(state, 1.5);
    expect(state.letterSpacing).toBe(1.5);
    expect(state.version).toBe(1);
  });
});

describe('setTextLineHeight', () => {
  it('updates line height and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextLineHeight(state, 1.6);
    setTextLineHeight(state, 1.6);
    expect(state.lineHeight).toBe(1.6);
    expect(state.version).toBe(1);
  });
});

describe('setTextStrikethrough', () => {
  it('updates strikethrough and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextStrikethrough(state, true);
    setTextStrikethrough(state, true);
    expect(state.strikethrough).toBe(true);
    expect(state.version).toBe(1);
  });
});

describe('setTextUnderline', () => {
  it('updates underline and guards redundant sets', () => {
    const state = createTextStyleState();
    setTextUnderline(state, true);
    setTextUnderline(state, true);
    expect(state.underline).toBe(true);
    expect(state.version).toBe(1);
  });
});
