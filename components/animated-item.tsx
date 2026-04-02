'use client';

import { ReactNode } from 'react';

interface AnimatedItemProps {
  children: ReactNode;
  index: number;
  delay?: number;
}

/**
 * Wrapper component that animates item appearance with stagger effect
 * Provides smooth fade-in and slide-up animation
 */
export function AnimatedItem({ children, index, delay = 40 }: AnimatedItemProps) {
  const maxStaggeredIndex = Math.min(index, 6);
  const animationDelay = maxStaggeredIndex * delay;

  return (
    <div
      className="animate-fade-in-slide-up"
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {children}
    </div>
  );
}
