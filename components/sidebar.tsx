'use client';

import { cn } from '@/lib/utils';
import type { Collection } from '@/lib/types';
import { Grid3X3, Briefcase, Zap, Heart, Palette } from 'lucide-react';

interface SidebarProps {
  collections: Collection[];
  selectedCollection: string | null;
  onSelectCollection: (collectionId: string | null) => void;
}

const collectionIcons: Record<string, React.ReactNode> = {
  work: <Briefcase className="w-5 h-5" />,
  entertainment: <Zap className="w-5 h-5" />,
  developer: <Palette className="w-5 h-5" />,
  personal: <Heart className="w-5 h-5" />,
};

export function Sidebar({ collections, selectedCollection, onSelectCollection }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-popover/40 backdrop-blur-sm overflow-y-auto hidden lg:flex lg:flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-accent">
          Web<span className="text-foreground">Atlas</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Your curated directory</p>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
          Collections
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCollection(null)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3",
              selectedCollection === null
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-card/50"
            )}
          >
            <Grid3X3 className="w-5 h-5 shrink-0" />
            <span>All Items</span>
          </button>

          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onSelectCollection(collection.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3",
                selectedCollection === collection.id
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-card/50"
              )}
            >
              <div className={cn(
                "w-5 h-5 flex items-center justify-center shrink-0",
                selectedCollection === collection.id ? "text-accent-foreground" : "text-muted-foreground"
              )}>
                {collectionIcons[collection.id] || <Grid3X3 className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{collection.name}</p>
                <p className={cn(
                  "text-xs",
                  selectedCollection === collection.id
                    ? "opacity-80"
                    : "text-muted-foreground"
                )}>
                  {collection.items.length} items
                </p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1"></div>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Explore curated collections of tools and resources
        </p>
      </div>
    </aside>
  );
}
