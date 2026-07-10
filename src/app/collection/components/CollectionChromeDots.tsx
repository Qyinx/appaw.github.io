'use client';

import React from 'react';

export function CollectionChromeDots() {
  return (
    <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
      <div className="w-2 h-2 bg-accent-primary" />
      <div className="w-2 h-2 bg-border-strong" />
      <div className="w-2 h-2 bg-border-strong" />
    </div>
  );
}
