'use client';

import React, { useRef } from 'react';
import { useCollectionEnter } from '../hooks/useCollectionAnime';

interface CollectionAnimeEnterProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  disabled?: boolean;
  /** Re-run enter when portfolio / panel identity changes. */
  enterKey?: string | number;
}

export function CollectionAnimeEnter({
  children,
  className = '',
  delay = 0,
  disabled = false,
  enterKey,
}: CollectionAnimeEnterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useCollectionEnter(ref, [disabled, enterKey], { delay, disabled });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
