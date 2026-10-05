'use client';

import React from 'react';
import GuideHeroBackground from './GuideHeroBackground';

type GuideHeroProps = {
  badge: string;
  title: string;
  lead: string;
  readTime: string;
  updated: string;
  published?: string;
  author?: string;
  updatedLabel?: string;
  heroImage?: string;
};

export default function GuideHero({
  badge,
  title,
  lead,
  readTime,
  updated,
  published,
  author,
  updatedLabel = 'Updated',
  heroImage,
}: GuideHeroProps) {
  const metaParts = [readTime];
  if (author) metaParts.push(author);
  if (published) metaParts.push(`Published ${published}`);
  metaParts.push(`${updatedLabel} ${updated}`);

  return (
    <section
      className={`relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default page-blueprint${heroImage ? ' hero-bg-slab' : ''}`}
    >
      {heroImage ? <GuideHeroBackground src={heroImage} /> : null}
      <div className="container-custom relative z-[2] max-w-[1080px]">
        <p className="section-label mb-8">{badge}</p>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-6 text-balance">
          {title}
        </h1>
        <div className="w-12 h-px bg-accent-brand mb-7" aria-hidden="true" />
        <p className="guide-lead text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mb-6">{lead}</p>
        <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
          {metaParts.join(' · ')}
        </p>
      </div>
    </section>
  );
}
