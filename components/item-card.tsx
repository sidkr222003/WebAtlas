'use client';

import type { Item } from '@/lib/types';
import { getPricingColor } from '@/lib/item-utils';
import { ArrowUpRight, Globe } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [faviconError, setFaviconError] = useState(false);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(item.url);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 hover:bg-card/80 hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Website Favicon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-card/50 border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors overflow-hidden">
            {faviconUrl && !faviconError ? (
              <Image
                src={faviconUrl}
                alt={item.name}
                width={32}
                height={32}
                onError={() => setFaviconError(true)}
                className="w-8 h-8"
              />
            ) : (
              <Globe className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors line-clamp-2">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {item.category}
            </p>
          </div>
        </div>

        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {item.description}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {item.pricing && (
          <span
            className={`${getPricingColor(item.pricing)} text-xs font-medium text-white px-2.5 py-1 rounded-full`}
          >
            {item.pricing}
          </span>
        )}
        {item.tags && item.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
