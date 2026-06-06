import React from 'react';

export interface HeroStampLines {
  brand: string;
  tagline: string;
  muted: string;
}

const DEFAULT_LINES: HeroStampLines = {
  brand: 'Appaw Store',
  tagline: 'Precision Hardware · Hong Kong',
  muted: 'PSA protectors · Centering tools',
};

interface HeroStampProps {
  className?: string;
  lines?: Partial<HeroStampLines>;
  /** Decorative stamp — hidden from assistive tech (default). Set false when lines carry meaning. */
  decorative?: boolean;
}

export default function HeroStamp({
  className = '',
  lines,
  decorative = true,
}: HeroStampProps) {
  const merged = { ...DEFAULT_LINES, ...lines };

  return (
    <div
      className={`hero-stamp${className ? ` ${className}` : ''}`}
      {...(decorative ? { 'aria-hidden': true as const } : {})}
    >
      <span className="hero-stamp__line hero-stamp__line--brand">{merged.brand}</span>
      <span className="hero-stamp__line">{merged.tagline}</span>
      <span className="hero-stamp__line hero-stamp__line--muted">{merged.muted}</span>
    </div>
  );
}
