'use client';

/**
 * Skeleton loader for items while loading
 * Shows shimmer animation to indicate loading state
 */
export function ItemSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 animate-pulse">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          background-size: 1000px 100%;
        }
      `}</style>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Favicon placeholder */}
          <div className="w-10 h-10 rounded-lg bg-muted/30 shimmer flex-shrink-0" />

          <div className="flex-1 space-y-2">
            {/* Title placeholder */}
            <div className="h-5 bg-muted/30 shimmer rounded-md w-3/4" />
            {/* Category placeholder */}
            <div className="h-3 bg-muted/20 shimmer rounded-md w-1/3" />
          </div>
        </div>
        {/* Arrow placeholder */}
        <div className="w-5 h-5 bg-muted/30 shimmer rounded flex-shrink-0" />
      </div>

      {/* Description placeholder */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted/30 shimmer rounded-md w-full" />
        <div className="h-3 bg-muted/30 shimmer rounded-md w-5/6" />
      </div>

      {/* Tags placeholder */}
      <div className="flex gap-2">
        <div className="h-6 bg-muted/20 shimmer rounded-full w-16" />
        <div className="h-6 bg-muted/20 shimmer rounded-full w-20" />
      </div>
    </div>
  );
}
