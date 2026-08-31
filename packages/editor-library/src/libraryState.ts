export interface LibraryItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly kind: string;
}

export interface LibraryState {
  items: LibraryItem[];
  searchFilter: string;
  activeCategory: string | null;
  version: number;
}

export function createLibraryState(): LibraryState {
  return { items: [], searchFilter: '', activeCategory: null, version: 0 };
}

export function getLibraryItems(state: Readonly<LibraryState>): readonly LibraryItem[] {
  return state.items;
}

export function getLibraryItemCount(state: Readonly<LibraryState>): number {
  return state.items.length;
}

export function addLibraryItem(state: LibraryState, item: LibraryItem): void {
  state.items.push(item);
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
  if (state.searchFilter === filter) return;
  state.searchFilter = filter;
  state.version++;
}

export function getFilteredLibraryItems(state: Readonly<LibraryState>): readonly LibraryItem[] {
  let items: readonly LibraryItem[] = state.items;
  if (state.activeCategory !== null) {
    items = items.filter((item) => item.category === state.activeCategory);
  }
  if (state.searchFilter !== '') {
    const lower = state.searchFilter.toLowerCase();
    items = items.filter((item) => item.name.toLowerCase().includes(lower));
  }
  return items;
}

export function getActiveCategory(state: Readonly<LibraryState>): string | null {
  return state.activeCategory;
}

export function setActiveCategory(state: LibraryState, category: string | null): void {
  if (state.activeCategory === category) return;
  state.activeCategory = category;
  state.version++;
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
