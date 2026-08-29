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
  it('retains the source trailing-newline style for canonical YAML', () => {
    const result = formatSerializedDocument('old: true\n', 'new:\n  value: 1\n');
    expect(result).toBe('new:\n  value: 1\n');
  });

  it('does not add a trailing newline when the source had none', () => {
    expect(formatSerializedDocument('old: true', 'new: 1\n')).toBe('new: 1');
  });
});
