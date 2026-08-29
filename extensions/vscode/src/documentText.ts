export function encodeDocumentText(text: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(text);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function decodeDocumentData(data: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(data));
}

export function formatSerializedDocument(source: string, serialized: string): string {
  const trailingNewline = source.endsWith('\n') ? '\n' : '';
  if (!source.includes('\n')) return `${serialized}${trailingNewline}`;
  const indentation = source.match(/\n([\t ]+)"/)?.[1] ?? '  ';
  const value: unknown = JSON.parse(serialized);
  return `${JSON.stringify(value, null, indentation)}${trailingNewline}`;
}
