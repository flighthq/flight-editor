import { describe, expect, it } from 'vitest';

import { decodeDocumentData, encodeDocumentText, formatSerializedDocument } from './documentText';

describe('encodeDocumentText', () => {
  it('encodes UTF-8 into an exact ArrayBuffer', () => {
    expect(decodeDocumentData(encodeDocumentText('Flight ✈'))).toBe('Flight ✈');
  });
});

describe('decodeDocumentData', () => {
  it('decodes UTF-8 bytes', () => {
    expect(decodeDocumentData(new Uint8Array([70, 108, 105, 103, 104, 116]).buffer)).toBe('Flight');
  });
});

describe('formatSerializedDocument', () => {
  it('retains pretty indentation and trailing-newline style', () => {
    const result = formatSerializedDocument('{\n    "old": true\n}\n', '{"new":{"value":1}}');
    expect(result).toBe('{\n    "new": {\n        "value": 1\n    }\n}\n');
  });

  it('keeps compact documents compact', () => {
    expect(formatSerializedDocument('{"old":true}', '{"new":1}')).toBe('{"new":1}');
  });
});
