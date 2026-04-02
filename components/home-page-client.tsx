'use client';

import { useEffect, useMemo, useState } from 'react';
import { Grid3X3, ListFilter, Zap, ChevronDown } from 'lucide-react';
import type { Collection, Item } from '@/lib/types';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header';
import { SearchBar } from '@/components/search-bar';
import { FilterTags } from '@/components/filter-tags';
import { ItemCard } from '@/components/item-card';
import { AnimatedItem } from '@/components/animated-item';
import { ItemSkeleton } from '@/components/item-skeleton';
import { useLazyLoad } from '@/hooks/use-lazy-load';

interface HomePageClientProps {
  collections: Collection[];
}

export function HomePageClient({ collections }: HomePageClientProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const collectionItems = useMemo(() => {
    if (selectedCollection === null) {
      return collections.flatMap((collection) => collection.items);
    }

    const collection = collections.find((entry) => entry.id === selectedCollection);
    return collection?.items || [];
  }, [collections, selectedCollection]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();

    collectionItems.forEach((item) => {
      item.tags?.forEach((tag) => {
        tagSet.add(tag);
      });
    });

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [collectionItems]);

  useEffect(() => {
    setSelectedTags((previous) => {
      const availableTagSet = new Set(availableTags);
      const next = previous.filter((tag) => availableTagSet.has(tag));
      return next.length === previous.length ? previous : next;
    });
  }, [availableTags]);

  const filteredItems = useMemo(() => {
    let items: Item[] = collectionItems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.tags?.some((tag) => tag.toLowerCase().includes(query)) || false),
      );
    }

    if (selectedTags.length > 0) {
      items = items.filter((item) => selectedTags.some((tag) => item.tags?.includes(tag)));
    }

    return items;
  }, [collectionItems, searchQuery, selectedTags]);

  const totalAvailableCount = collectionItems.length;

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((entry) => entry !== tag) : [...previous, tag],
    );
  };

  const getCollectionName = () => {
    if (selectedCollection === null) return 'All Items';
    return collections.find((collection) => collection.id === selectedCollection)?.name || 'All Items';
  };

  const {
    items: displayedItems,
    displayedCount,
    hasMore,
    loadMore,
    isLoading,
    observerTarget,
  } = useLazyLoad(filteredItems, {
    initialCount: 40,
    incrementCount: 20,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collections={collections}
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      <MobileHeader
        collections={collections}
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                {selectedCollection === null ? (
                  <Grid3X3 className="w-8 h-8 text-accent" />
                ) : (
                  <Zap className="w-8 h-8 text-accent" />
                )}
                <h2 className="text-4xl font-bold text-foreground">{getCollectionName()}</h2>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <div className="min-w-20 px-3 py-1 rounded-md border border-border bg-card/50 text-center text-sm font-semibold text-foreground leading-none">
                  {totalAvailableCount.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  item{totalAvailableCount !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-20 lg:top-4 z-30 bg-background/95 backdrop-blur-sm py-2 mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="mb-8 space-y-4">
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ListFilter className="w-4 h-4" />
                  Active filters:
                </div>
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-accent/20 border border-accent/30 rounded-full px-3 py-1 text-sm text-accent flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            <FilterTags allTags={availableTags} selectedTags={selectedTags} onToggleTag={toggleTag} />
          </div>

          {filteredItems.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedItems.map((item, index) => (
                  <AnimatedItem key={item.id} index={index}>
                    <ItemCard item={item} />
                  </AnimatedItem>
                ))}
              </div>

              {isLoading && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ItemSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              )}

              {hasMore && (
                <div ref={observerTarget} className="mt-12 flex flex-col items-center gap-4">
                  {!isLoading && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Showing {displayedCount} of {filteredItems.length} items
                      </p>
                      <button
                        onClick={loadMore}
                        className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                      >
                        <span>Load more</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {!hasMore && displayedCount > 0 && (
                <div className="mt-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve reached the end. All {filteredItems.length} items loaded.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-border bg-card/30">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Try adjusting your search query or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="mt-6 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
