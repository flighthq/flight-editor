export interface LibraryItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly kind: string;
  readonly sourceId?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly availability?: 'available' | 'missing' | 'loading';
}

export interface LibraryState {
  items: LibraryItem[];
  searchFilter: string;
  activeCategory: string | null;
  version: number;
  sessionVersion: number;
}

export function createLibraryState(): LibraryState {
  return { items: [], searchFilter: '', activeCategory: null, version: 0, sessionVersion: 0 };
}

export function getLibraryItems(state: Readonly<LibraryState>): readonly LibraryItem[] {
  return state.items;
}

export function getLibraryItemCount(state: Readonly<LibraryState>): number {
  return state.items.length;
}

export function addLibraryItem(state: LibraryState, item: LibraryItem): void {
  assertLibraryItem(item);
  if (state.items.some(({ id }) => id === item.id)) throw new Error(`Library item already exists: ${item.id}`);
  state.items.push(copyLibraryItem(item));
  state.version++;
}

export function removeLibraryItem(state: LibraryState, id: string): boolean {
  const idx = state.items.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  state.items.splice(idx, 1);
  state.version++;
  return true;
}

export function getLibraryItem(state: Readonly<LibraryState>, id: string): LibraryItem | undefined {
  return state.items.find((item) => item.id === id);
}

export function getLibrarySearchFilter(state: Readonly<LibraryState>): string {
  return state.searchFilter;
}

export function setLibrarySearchFilter(state: LibraryState, filter: string): void {
  const normalized = filter.trim();
  if (state.searchFilter === normalized) return;
  state.searchFilter = normalized;
  state.sessionVersion++;
}

export function getFilteredLibraryItems(state: Readonly<LibraryState>): readonly LibraryItem[] {
  let items: readonly LibraryItem[] = state.items;
  if (state.activeCategory !== null) {
    items = items.filter((item) => item.category === state.activeCategory);
  }
  if (state.searchFilter !== '') {
    const lower = state.searchFilter.toLowerCase();
    items = items.filter((item) =>
      [item.name, item.category, item.kind, item.description ?? '', ...(item.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(lower),
    );
  }
  return items;
}

export function getActiveCategory(state: Readonly<LibraryState>): string | null {
  return state.activeCategory;
}

export function setActiveCategory(state: LibraryState, category: string | null): void {
  if (state.activeCategory === category) return;
  state.activeCategory = category;
  state.sessionVersion++;
}

export function getLibraryCategories(state: Readonly<LibraryState>): readonly string[] {
  const categories = new Set<string>();
  for (const item of state.items) {
    categories.add(item.category);
  }
  return Array.from(categories).sort();
}

export function clearLibrary(state: LibraryState): void {
  if (state.items.length === 0) return;
  state.items.length = 0;
  state.version++;
}

export function getLibraryVersion(state: Readonly<LibraryState>): number {
  return state.version;
}

function assertLibraryItem(item: LibraryItem): void {
  if (item.id.trim() === '' || item.name.trim() === '' || item.category.trim() === '' || item.kind.trim() === '') {
    throw new TypeError('Library item identity, name, category, and kind must not be empty');
  }
}

function copyLibraryItem(item: LibraryItem): LibraryItem {
  return { ...item, tags: item.tags?.slice() };
}

export function getLibrarySessionVersion(state: Readonly<LibraryState>): number {
  return state.sessionVersion;
}

export function reconcileLibrarySource(state: LibraryState, sourceId: string, items: readonly LibraryItem[]): void {
  if (sourceId.trim() === '') throw new TypeError('Library source id must not be empty');
  const incomingIds = new Set<string>();
  const incoming = items.map((item) => {
    assertLibraryItem(item);
    if (incomingIds.has(item.id)) throw new Error(`Duplicate library item from source: ${item.id}`);
    if (item.sourceId !== undefined && item.sourceId !== sourceId)
      throw new Error(`Library item source mismatch: ${item.id}`);
    incomingIds.add(item.id);
    return copyLibraryItem({ ...item, sourceId });
  });
  const foreignIds = new Set(state.items.filter((item) => item.sourceId !== sourceId).map(({ id }) => id));
  const collision = incoming.find(({ id }) => foreignIds.has(id));
  if (collision !== undefined) throw new Error(`Library item id belongs to another source: ${collision.id}`);
  const next = [...state.items.filter((item) => item.sourceId !== sourceId), ...incoming];
  const unchanged =
    next.length === state.items.length &&
    next.every((item, index) => JSON.stringify(item) === JSON.stringify(state.items[index]));
  if (unchanged) return;
  state.items = next;
  state.version++;
}

export function markLibrarySourceMissing(state: LibraryState, sourceId: string): number {
  let changed = 0;
  state.items = state.items.map((item) => {
    if (item.sourceId !== sourceId || item.availability === 'missing') return item;
    changed++;
    return { ...item, availability: 'missing' };
  });
  if (changed > 0) state.version++;
  return changed;
}

export function validateLibraryState(state: Readonly<LibraryState>): readonly string[] {
  const diagnostics: string[] = [];
  const ids = new Set<string>();
  for (const item of state.items) {
    if (ids.has(item.id)) diagnostics.push(`duplicate-id:${item.id}`);
    ids.add(item.id);
    if (item.id.trim() === '' || item.name.trim() === '' || item.category.trim() === '' || item.kind.trim() === '') {
      diagnostics.push(`invalid-item:${item.id}`);
    }
  }
  return diagnostics.sort();
}
