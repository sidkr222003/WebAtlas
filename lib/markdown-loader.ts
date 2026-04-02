import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Collection, Item } from "@/lib/types";

interface CollectionSource {
  id: string;
  name: string;
  color: string;
  fileName: string;
}

interface RawItem {
  name?: string;
  url?: string;
  description?: string;
  category?: string;
  pricing?: string;
  tags: string[];
  subcategories: string[];
  rank?: number;
}

const COLLECTION_SOURCES: CollectionSource[] = [
  {
    id: "work",
    name: "Work",
    color: "from-blue-500 to-cyan-500",
    fileName: "work.md",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "from-purple-500 to-pink-500",
    fileName: "entertainment.md",
  },
  {
    id: "developer",
    name: "Developer Tools",
    color: "from-green-500 to-emerald-500",
    fileName: "developer.md",
  },
  {
    id: "personal",
    name: "Personal Projects",
    color: "from-orange-500 to-red-500",
    fileName: "personal.md",
  },
];

const FIELD_PATTERN = /^(?:-\s*)?(?:\*\*)?([^:*]+?)(?:\*\*)?:\s*(.+)$/;

function createEmptyRawItem(): RawItem {
  return {
    tags: [],
    subcategories: [],
  };
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseCsvValues(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeHeading(rawHeading: string): string {
  return rawHeading.replace(/^[^a-zA-Z0-9]+/, "").trim();
}

function mergeUnique(values: string[], incoming: string[]): string[] {
  return Array.from(new Set([...values, ...incoming]));
}

function parseField(line: string): { key: string; value: string } | null {
  const match = line.match(FIELD_PATTERN);
  if (!match) return null;

  const key = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const value = match[2].trim();

  if (!value) {
    return null;
  }

  return { key, value };
}

function finalizeItem(
  currentItem: RawItem,
  fallbackCategory: string,
  collectionId: string,
  idCounts: Map<string, number>,
): Item | null {
  const name = currentItem.name?.trim();
  const url = currentItem.url?.trim();

  if (!name || !url) {
    return null;
  }

  const category = currentItem.category?.trim() || fallbackCategory;
  const idBase = toSlug(name) || "item";
  const idCount = (idCounts.get(idBase) ?? 0) + 1;
  idCounts.set(idBase, idCount);

  const tags = mergeUnique(currentItem.tags, currentItem.subcategories);
  const description = currentItem.description?.trim() || `${name} resource for ${category}.`;

  return {
    id: `${collectionId}-${idBase}${idCount > 1 ? `-${idCount}` : ""}`,
    name,
    url,
    description,
    category,
    pricing: currentItem.pricing,
    subcategories: currentItem.subcategories.length > 0 ? currentItem.subcategories : undefined,
    rank: currentItem.rank,
    tags: tags.length > 0 ? tags : undefined,
  };
}

function parseCollectionMarkdown(content: string, source: CollectionSource): Collection {
  const lines = content.split(/\r?\n/);
  const items: Item[] = [];
  const idCounts = new Map<string, number>();

  let currentSection = source.name;
  let currentItem: RawItem = createEmptyRawItem();

  const flushCurrentItem = () => {
    const parsedItem = finalizeItem(currentItem, currentSection, source.id, idCounts);
    if (parsedItem) {
      items.push(parsedItem);
    }
    currentItem = createEmptyRawItem();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushCurrentItem();
      continue;
    }

    if (line === "---") {
      flushCurrentItem();
      continue;
    }

    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flushCurrentItem();
      currentSection = normalizeHeading(headingMatch[1]) || source.name;
      continue;
    }

    const parsedField = parseField(line);
    if (!parsedField) {
      continue;
    }

    if ((parsedField.key === "name" || parsedField.key === "rank") && currentItem.name && currentItem.url) {
      flushCurrentItem();
    }

    switch (parsedField.key) {
      case "name":
        currentItem.name = parsedField.value;
        break;
      case "url":
        currentItem.url = parsedField.value;
        break;
      case "category":
        currentItem.category = parsedField.value;
        break;
      case "description":
        currentItem.description = parsedField.value;
        break;
      case "pricing":
        currentItem.pricing = parsedField.value;
        break;
      case "tags":
        currentItem.tags = mergeUnique(currentItem.tags, parseCsvValues(parsedField.value));
        break;
      case "subcategories":
        currentItem.subcategories = mergeUnique(currentItem.subcategories, parseCsvValues(parsedField.value));
        break;
      case "rank": {
        const parsedRank = Number.parseInt(parsedField.value, 10);
        if (Number.isFinite(parsedRank)) {
          currentItem.rank = parsedRank;
        }
        break;
      }
      default:
        break;
    }
  }

  flushCurrentItem();

  return {
    id: source.id,
    name: source.name,
    color: source.color,
    itemCount: items.length,
    items,
  };
}

export async function loadCollectionsFromMarkdown(): Promise<Collection[]> {
  const projectRoot = process.cwd();

  const collectionPromises = COLLECTION_SOURCES.map(async (source) => {
    const filePath = path.join(projectRoot, "lib", source.fileName);
    const content = await fs.readFile(filePath, "utf-8");
    return parseCollectionMarkdown(content, source);
  });

  return Promise.all(collectionPromises);
}

export function getAllTagsFromCollections(collections: Collection[]): string[] {
  const tags = new Set<string>();

  collections.forEach((collection) => {
    collection.items.forEach((item) => {
      item.tags?.forEach((tag) => {
        tags.add(tag);
      });
    });
  });

  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
