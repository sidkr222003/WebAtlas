'use client';

import { cn } from '@/lib/utils';
import { X, Tag } from 'lucide-react';

interface FilterTagsProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export function FilterTags({ allTags, selectedTags, onToggleTag }: FilterTagsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filter by tags
        </h3>
      </div>
      <div className="overflow-x-auto overflow-y-hidden no-scrollbar pb-1">
        <div className="grid grid-rows-3 grid-flow-col auto-cols-max gap-2 min-w-max">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap",
                selectedTags.includes(tag)
                  ? "bg-accent text-accent-foreground border border-accent shadow-sm shadow-accent/20"
                  : "bg-card/30 text-foreground border border-border hover:border-accent/50"
              )}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <X className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
