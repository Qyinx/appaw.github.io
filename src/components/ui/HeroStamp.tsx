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
  /** dashboard = full-width row with optional stats slot beside identity lines */
  layout?: 'default' | 'dashboard';
  children?: React.ReactNode;
}

export default function HeroStamp({
  className = '',
  lines,
  decorative = true,
  layout = 'default',
  children,
}: HeroStampProps) {
  const merged = { ...DEFAULT_LINES, ...lines };
  const layoutClass = layout === 'dashboard' ? ' hero-stamp--dashboard' : '';
  const identity = (
    <>
      <span className="hero-stamp__line hero-stamp__line--brand">{merged.brand}</span>
      <span className="hero-stamp__line">{merged.tagline}</span>
      {merged.muted ? (
        <span className="hero-stamp__line hero-stamp__line--muted">{merged.muted}</span>
      ) : null}
    </>
  );

  return (
    <div
      className={`hero-stamp${layoutClass}${className ? ` ${className}` : ''}`}
      {...(decorative ? { 'aria-hidden': true as const } : {})}
    >
      {layout === 'dashboard' ? (
        <div className="hero-stamp__identity">{identity}</div>
      ) : (
        identity
      )}
      {children}
    </div>
  );
}
