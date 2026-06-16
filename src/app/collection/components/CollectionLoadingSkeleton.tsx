'use client';

import React from 'react';

interface CollectionLoadingSkeletonProps {
  variant?: 'ledger' | 'vault' | 'form' | 'grid';
  rows?: number;
  label?: string;
}

export function CollectionLoadingSkeleton({
  variant = 'ledger',
  rows = 6,
  label = 'Loading…',
}: CollectionLoadingSkeletonProps) {
  if (variant === 'form') {
    return (
      <div className="collection-skeleton panel p-5 md:p-6 space-y-6" aria-live="polite" aria-busy="true" aria-label={label}>
        <div className="collection-skeleton__block h-4 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="collection-skeleton__block h-11 sm:col-span-2" />
          <div className="collection-skeleton__block h-11" />
          <div className="collection-skeleton__block h-11" />
        </div>
        <div className="collection-skeleton__block h-4 w-40" />
        <div className="space-y-3">
          <div className="collection-skeleton__block h-11" />
          <div className="collection-skeleton__block h-11" />
        </div>
      </div>
    );
  }

  if (variant === 'vault' || variant === 'grid') {
    const count = variant === 'grid' ? Math.min(rows, 6) : rows;
    return (
      <div
        className={`collection-skeleton ${variant === 'vault' ? 'collection-vault' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}`}
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="collection-skeleton__vault-card panel p-4 space-y-3">
            <div className="collection-skeleton__block aspect-[3/4] w-full" />
            <div className="collection-skeleton__block h-3 w-2/3" />
            <div className="collection-skeleton__block h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="collection-skeleton collection-ledger" aria-live="polite" aria-busy="true" aria-label={label}>
      <div className="collection-skeleton__ledger-head hidden sm:block" aria-hidden="true" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="collection-skeleton__ledger-row">
          <div className="collection-skeleton__block w-12 aspect-[3/4] flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="collection-skeleton__block h-3 w-3/4" />
            <div className="collection-skeleton__block h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
