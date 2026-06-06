'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import type { GuideContent } from '@/lib/guides/types';

type GuideRelatedProps = {
  guides: GuideContent[];
  title: string;
  readLabel?: string;
};

export default function GuideRelated({ guides, title, readLabel = 'Read' }: GuideRelatedProps) {
  if (guides.length === 0) return null;

  return (
    <section className="border-t border-border-default pt-12" aria-labelledby="related-guides">
      <h2 id="related-guides" className="section-label mb-6">
        {title}
      </h2>
      <ul className="grid sm:grid-cols-2 gap-px bg-border-default border border-border-default">
        {guides.map((guide) => (
          <li key={guide.slug} className="bg-surface-panel">
            <LocalLink
              href={`/guides/${guide.slug}/`}
              className="block p-6 h-full hover:bg-surface-raised transition-colors duration-150 group"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-2">{guide.badge}</p>
              <p className="text-text-primary font-semibold text-sm leading-snug mb-3 group-hover:text-accent-brand transition-colors duration-150">
                {guide.title}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-accent-link font-medium">
                {readLabel}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </span>
            </LocalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
