import { useEffect, useRef, useCallback, useState } from 'react';

interface UseLazyLoadOptions {
  initialCount?: number;
  incrementCount?: number;
  threshold?: number;
}

interface UseLazyLoadReturn<T> {
  items: T[];
  displayedCount: number;
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  observerTarget: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for lazy loading items with intersection observer
 * Displays initial items and loads more when user scrolls near bottom
 */
export function useLazyLoad<T>(
  allItems: T[],
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn<T> {
  const {
    initialCount = 40,
    incrementCount = 20,
    threshold = 0.1
  } = options;

  const observerTarget = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [displayedCount, setDisplayedCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const items = allItems.slice(0, displayedCount);
  const hasMore = displayedCount < allItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setDisplayedCount(prev => Math.min(prev + incrementCount, allItems.length));
      setIsLoading(false);
      frameRef.current = null;
    });
  }, [allItems.length, hasMore, isLoading, incrementCount]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  return {
    items,
    displayedCount,
    hasMore,
    loadMore,
    isLoading,
    observerTarget
  };
}
