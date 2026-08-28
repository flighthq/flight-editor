export interface Page {
  readonly id: string;
  name: string;
  width: number;
  height: number;
  color: number | null;
}

export interface PageState {
  readonly pages: Page[];
  activePageId: string | null;
  version: number;
}

export function createPageState(): PageState {
  return { pages: [], activePageId: null, version: 0 };
}

export function addPage(state: PageState, page: Readonly<Page>): void {
  const index = state.pages.findIndex(({ id }) => id === page.id);
  const next = clonePage(page);
  if (index !== -1) {
    if (pagesEqual(state.pages[index]!, next)) return;
    state.pages[index] = next;
  } else {
    state.pages.push(next);
    if (state.activePageId === null) state.activePageId = page.id;
  }
  state.version++;
}

export function removePage(state: PageState, id: string): boolean {
  const index = state.pages.findIndex((page) => page.id === id);
  if (index === -1) return false;
  state.pages.splice(index, 1);
  if (state.activePageId === id) {
    state.activePageId = state.pages[Math.min(index, state.pages.length - 1)]?.id ?? null;
  }
  state.version++;
  return true;
}

export function getPage(state: Readonly<PageState>, id: string): Page | undefined {
  const page = state.pages.find((candidate) => candidate.id === id);
  return page ? clonePage(page) : undefined;
}

export function getPages(state: Readonly<PageState>): readonly Page[] {
  return state.pages.map(clonePage);
}

export function getPageCount(state: Readonly<PageState>): number {
  return state.pages.length;
}

export function setActivePage(state: PageState, id: string): boolean {
  if (state.activePageId === id || !state.pages.some((page) => page.id === id)) return false;
  state.activePageId = id;
  state.version++;
  return true;
}

export function getActivePage(state: Readonly<PageState>): Page | null {
  if (state.activePageId === null) return null;
  return getPage(state, state.activePageId) ?? null;
}

export function getActivePageId(state: Readonly<PageState>): string | null {
  return state.activePageId;
}

export function setPageName(state: PageState, id: string, name: string): boolean {
  return setPageValue(state, id, 'name', name);
}

export function setPageSize(state: PageState, id: string, width: number, height: number): boolean {
  const page = getStoredPage(state, id);
  if (!page || (page.width === width && page.height === height)) return false;
  page.width = width;
  page.height = height;
  state.version++;
  return true;
}

export function setPageColor(state: PageState, id: string, color: number | null): boolean {
  return setPageValue(state, id, 'color', color === null ? null : color >>> 0);
}

export function reorderPage(state: PageState, id: string, newIndex: number): boolean {
  const index = state.pages.findIndex((page) => page.id === id);
  if (index === -1) return false;
  const target = Math.max(0, Math.min(Math.trunc(newIndex), state.pages.length - 1));
  if (target === index) return false;
  const [page] = state.pages.splice(index, 1);
  state.pages.splice(target, 0, page!);
  state.version++;
  return true;
}

export function getPageVersion(state: Readonly<PageState>): number {
  return state.version;
}

function clonePage(page: Readonly<Page>): Page {
  return { ...page };
}

function pagesEqual(a: Readonly<Page>, b: Readonly<Page>): boolean {
  return a.id === b.id && a.name === b.name && a.width === b.width && a.height === b.height && a.color === b.color;
}

function getStoredPage(state: PageState, id: string): Page | undefined {
  return state.pages.find((page) => page.id === id);
}

function setPageValue<Key extends 'name' | 'color'>(state: PageState, id: string, key: Key, value: Page[Key]): boolean {
  const page = getStoredPage(state, id);
  if (!page || page[key] === value) return false;
  page[key] = value;
  state.version++;
  return true;
}
