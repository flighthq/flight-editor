export function encodeDocumentText(text: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(text);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function decodeDocumentData(data: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(data));
}

export function formatSerializedDocument(source: string, serialized: string): string {
  const normalized = serialized.endsWith('\n') ? serialized.slice(0, -1) : serialized;
  return source.endsWith('\n') ? `${normalized}\n` : normalized;
}
