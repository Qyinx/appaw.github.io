'use client';

import React from 'react';

type GuideHeroProps = {
  badge: string;
  title: string;
  lead: string;
  readTime: string;
  updated: string;
};

export default function GuideHero({ badge, title, lead, readTime, updated }: GuideHeroProps) {
  return (
    <section className="relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default page-blueprint">
      <div className="container-custom max-w-[1080px]">
        <p className="section-label mb-8">{badge}</p>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-6 text-balance">
          {title}
        </h1>
        <div className="w-12 h-px bg-accent-brand mb-7" aria-hidden="true" />
        <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mb-6">{lead}</p>
        <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
          {readTime} · Updated {updated}
        </p>
      </div>
    </section>
  );
}
