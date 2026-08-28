import * as textStyle from './index';

describe('@flighthq/editor-text-style exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(textStyle).sort()).toEqual(
      [
        'applyTextStyleToFormat',
        'createTextStyleState',
        'getTextAlign',
        'getTextColor',
        'getTextFontFamily',
        'getTextFontSize',
        'getTextFontStyle',
        'getTextFontWeight',
        'getTextLetterSpacing',
        'getTextLineHeight',
        'getTextStyleVersion',
        'isTextStrikethrough',
        'isTextUnderline',
        'readTextStyleFromFormat',
        'setTextAlign',
        'setTextColor',
        'setTextFontFamily',
        'setTextFontSize',
        'setTextFontStyle',
        'setTextFontWeight',
        'setTextLetterSpacing',
        'setTextLineHeight',
        'setTextStrikethrough',
        'setTextUnderline',
      ].sort(),
    );
  });
});
