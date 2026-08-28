export type DocumentFormat = 'flight' | 'json' | 'binary';
export type DocumentLifecycle = 'empty' | 'loading' | 'ready' | 'saving' | 'error';

export interface DocumentMetadata {
  readonly title: string;
  readonly author: string;
  readonly created: number;
  readonly modified: number;
  readonly format: DocumentFormat;
}

export interface DocumentState {
  lifecycle: DocumentLifecycle;
  metadata: DocumentMetadata;
  errorMessage: string | null;
  undoCheckpoint: number;
  version: number;
}

export function createDocumentState(): DocumentState {
  return {
    lifecycle: 'empty',
    metadata: {
      title: 'Untitled',
      author: '',
      created: 0,
      modified: 0,
      format: 'flight',
    },
    errorMessage: null,
    undoCheckpoint: 0,
    version: 0,
  };
}

export function getDocumentLifecycle(state: Readonly<DocumentState>): DocumentLifecycle {
  return state.lifecycle;
}

export function setDocumentLifecycle(state: DocumentState, lifecycle: DocumentLifecycle): void {
  if (state.lifecycle === lifecycle) return;
  state.lifecycle = lifecycle;
  if (lifecycle !== 'error') {
    state.errorMessage = null;
  }
  state.version++;
}

export function setDocumentError(state: DocumentState, message: string): void {
  state.lifecycle = 'error';
  state.errorMessage = message;
  state.version++;
}

export function getDocumentError(state: Readonly<DocumentState>): string | null {
  return state.errorMessage;
}

export function getDocumentMetadata(state: Readonly<DocumentState>): DocumentMetadata {
  return state.metadata;
}

export function setDocumentTitle(state: DocumentState, title: string): void {
  if (state.metadata.title === title) return;
  state.metadata = { ...state.metadata, title };
  state.version++;
}

export function getDocumentTitle(state: Readonly<DocumentState>): string {
  return state.metadata.title;
}

export function setDocumentAuthor(state: DocumentState, author: string): void {
  if (state.metadata.author === author) return;
  state.metadata = { ...state.metadata, author };
  state.version++;
}

export function getDocumentAuthor(state: Readonly<DocumentState>): string {
  return state.metadata.author;
}

export function setDocumentFormat(state: DocumentState, format: DocumentFormat): void {
  if (state.metadata.format === format) return;
  state.metadata = { ...state.metadata, format };
  state.version++;
}

export function getDocumentFormat(state: Readonly<DocumentState>): DocumentFormat {
  return state.metadata.format;
}

export function setDocumentTimestamps(state: DocumentState, created: number, modified: number): void {
  if (state.metadata.created === created && state.metadata.modified === modified) return;
  state.metadata = { ...state.metadata, created, modified };
  state.version++;
}

export function touchDocumentModified(state: DocumentState, timestamp: number): void {
  if (state.metadata.modified === timestamp) return;
  state.metadata = { ...state.metadata, modified: timestamp };
  state.version++;
}

export function getUndoCheckpoint(state: Readonly<DocumentState>): number {
  return state.undoCheckpoint;
}

export function setUndoCheckpoint(state: DocumentState, checkpoint: number): void {
  if (state.undoCheckpoint === checkpoint) return;
  state.undoCheckpoint = checkpoint;
  state.version++;
}

export function isDocumentReady(state: Readonly<DocumentState>): boolean {
  return state.lifecycle === 'ready';
}

export function isDocumentLoading(state: Readonly<DocumentState>): boolean {
  return state.lifecycle === 'loading';
}

export function isDocumentSaving(state: Readonly<DocumentState>): boolean {
  return state.lifecycle === 'saving';
}

export function hasDocumentError(state: Readonly<DocumentState>): boolean {
  return state.lifecycle === 'error';
}

export function resetDocument(state: DocumentState): void {
  state.lifecycle = 'empty';
  state.metadata = {
    title: 'Untitled',
    author: '',
    created: 0,
    modified: 0,
    format: 'flight',
  };
  state.errorMessage = null;
  state.undoCheckpoint = 0;
  state.version++;
}

export function getDocumentVersion(state: Readonly<DocumentState>): number {
  return state.version;
}
