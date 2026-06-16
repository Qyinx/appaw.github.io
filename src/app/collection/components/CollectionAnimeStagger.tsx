'use client';

import React, { useRef } from 'react';
import { useCollectionStagger } from '../hooks/useCollectionAnime';

interface CollectionAnimeStaggerProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  selector?: string;
  /** Re-run stagger when this key changes (e.g. filter hash). */
  animateKey?: string | number;
}

export function CollectionAnimeStagger({
  children,
  className = '',
  active = true,
  selector = '[data-collection-animate]',
  animateKey,
}: CollectionAnimeStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useCollectionStagger(
    ref,
    [active, animateKey],
    { selector, disabled: !active },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
