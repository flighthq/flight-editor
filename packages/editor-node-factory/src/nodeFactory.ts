import type { NodeAny } from '@flighthq/types';

export type NodeCreator = () => NodeAny;

export interface NodeFactoryEntry {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly create: NodeCreator;
}

export interface NodeFactory {
  entries: Map<string, NodeFactoryEntry>;
}

export function createNodeFactory(): NodeFactory {
  return { entries: new Map() };
}

export function registerNodeKind(
  factory: NodeFactory,
  id: string,
  label: string,
  category: string,
  create: NodeCreator,
): void {
  factory.entries.set(id, { id, label, category, create });
}

export function unregisterNodeKind(factory: NodeFactory, id: string): boolean {
  return factory.entries.delete(id);
}

export function getNodeKindIds(factory: Readonly<NodeFactory>): string[] {
  return Array.from(factory.entries.keys());
}

export function getNodeKindEntry(factory: Readonly<NodeFactory>, id: string): NodeFactoryEntry | undefined {
  return factory.entries.get(id);
}

export function getNodeKindsByCategory(factory: Readonly<NodeFactory>, category: string): NodeFactoryEntry[] {
  const result: NodeFactoryEntry[] = [];
  for (const entry of factory.entries.values()) {
    if (entry.category === category) {
      result.push(entry);
    }
  }
  return result;
}

export function getNodeKindCategories(factory: Readonly<NodeFactory>): string[] {
  const categories = new Set<string>();
  for (const entry of factory.entries.values()) {
    categories.add(entry.category);
  }
  return Array.from(categories);
}

export function createNodeFromKind(factory: Readonly<NodeFactory>, id: string): NodeAny | null {
  const entry = factory.entries.get(id);
  if (!entry) return null;
  return entry.create();
}
