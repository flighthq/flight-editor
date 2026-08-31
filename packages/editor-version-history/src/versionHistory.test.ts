import { describe, expect, it } from 'vitest';
import type { DocumentRevision, VersionHistoryStorage } from './versionHistory';
import {
  appendDocumentRevision,
  createRevisionComparison,
  createVersionHistoryState,
  duplicateDocumentRevision,
  listDocumentRevisions,
  loadVersionHistory,
  previewDocumentRevision,
  restoreDocumentRevision,
} from './versionHistory';
type Doc = { value: string; migrated?: boolean };
const first: DocumentRevision<Doc> = {
  id: 'r1',
  parentId: null,
  sequence: 1,
  formatVersion: 1,
  timestamp: 1,
  author: 'A',
  label: 'Initial',
  document: { value: 'one' },
};
function storage(initial: readonly DocumentRevision<Doc>[] = []) {
  const values = initial.map((value) => structuredClone(value));
  const adapter: VersionHistoryStorage<Doc> = {
    async list() {
      return values;
    },
    async append(value) {
      values.push(structuredClone(value));
    },
  };
  return { values, adapter };
}
describe('createVersionHistoryState', () => {
  it('starts independently from command undo', () => expect(createVersionHistoryState().version).toBe(0));
});
describe('loadVersionHistory', () => {
  it('loads validated immutable canonical lineage', async () => {
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, storage([first]).adapter);
    expect(listDocumentRevisions(state)[0]).toEqual(first);
  });
  it('preserves state on service failure', async () => {
    const state = createVersionHistoryState<Doc>();
    await expect(
      loadVersionHistory(state, {
        list: async () => {
          throw new Error('offline');
        },
        append: async () => {},
      }),
    ).rejects.toThrow('offline');
    expect(state.revisions.size).toBe(0);
  });
});
describe('appendDocumentRevision', () => {
  it('persists before exposing a monotonically linked revision', async () => {
    const store = storage();
    const state = createVersionHistoryState<Doc>();
    await appendDocumentRevision(state, store.adapter, first);
    expect(state.order).toEqual(['r1']);
    expect(store.values).toHaveLength(1);
  });
});
describe('listDocumentRevisions', () => {
  it('returns detached chronological records', async () => {
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, storage([first]).adapter);
    const list = listDocumentRevisions(state);
    list[0]!.document.value = 'changed';
    expect(state.revisions.get('r1')?.document.value).toBe('one');
  });
});
describe('previewDocumentRevision', () => {
  it('migrates into a frozen read-only preview', async () => {
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, storage([first]).adapter);
    const preview = previewDocumentRevision(state, 'r1', 2, (document) => ({ ...document, migrated: true }));
    expect(preview.document).toEqual({ value: 'one', migrated: true });
    expect(Object.isFrozen(preview.document)).toBe(true);
  });
});
describe('duplicateDocumentRevision', () => {
  it('creates editable detached document input', async () => {
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, storage([first]).adapter);
    const copy = duplicateDocumentRevision(state, 'r1');
    copy.value = 'copy';
    expect(state.revisions.get('r1')?.document.value).toBe('one');
  });
});
describe('restoreDocumentRevision', () => {
  it('appends restoration without destroying later history and can stash dirty work', async () => {
    const store = storage([first]);
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, store.adapter);
    const result = await restoreDocumentRevision(
      state,
      store.adapter,
      'r1',
      { value: 'dirty' },
      true,
      'stash',
      { id: 'r2', timestamp: 2, label: 'Restore' },
      1,
      (document) => ({ ...document }),
    );
    expect(result).toMatchObject({
      status: 'restored',
      stashedDocument: { value: 'dirty' },
      revision: { id: 'r2', parentId: 'r1' },
    });
    expect(state.order).toEqual(['r1', 'r2']);
  });
  it('cancels without mutation when dirty work is unresolved', async () => {
    const store = storage([first]);
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, store.adapter);
    expect(
      await restoreDocumentRevision(
        state,
        store.adapter,
        'r1',
        { value: 'dirty' },
        true,
        'cancel',
        { id: 'r2', timestamp: 2 },
        1,
        (document) => ({ ...document }),
      ),
    ).toEqual({ status: 'cancelled' });
    expect(state.order).toEqual(['r1']);
  });
});
describe('createRevisionComparison', () => {
  it('returns frozen semantic comparison inputs and resource diagnostics', async () => {
    const second = {
      ...first,
      id: 'r2',
      parentId: 'r1',
      sequence: 2,
      document: { value: 'two' },
      diagnostics: ['missing plugin'],
    };
    const state = createVersionHistoryState<Doc>();
    await loadVersionHistory(state, storage([first, second]).adapter);
    const comparison = createRevisionComparison(state, 'r1', 'r2');
    expect(comparison).toMatchObject({
      left: { value: 'one' },
      right: { value: 'two' },
      diagnostics: ['missing plugin'],
    });
    expect(Object.isFrozen(comparison.left)).toBe(true);
  });
});
