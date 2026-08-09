'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import type { GuideContent } from '@/lib/guides/types';

type GuideCtaProps = {
  cta: GuideContent['cta'];
};

export default function GuideCta({ cta }: GuideCtaProps) {
  return (
    <section className="panel p-8 md:p-10 border-l-[3px] border-l-accent-brand" aria-labelledby="guide-cta">
      <h2 id="guide-cta" className="text-xl md:text-2xl font-bold font-display text-text-primary mb-3">
        {cta.title}
      </h2>
      <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-xl">{cta.body}</p>
      <div className="flex flex-wrap gap-3">
        <LocalLink
          href={cta.primary.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-cta text-accent-cta-ink border border-accent-cta font-semibold text-sm hover:opacity-90 transition-opacity duration-150"
        >
          {cta.primary.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </LocalLink>
        {cta.secondary ? (
          <LocalLink
            href={cta.secondary.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-strong text-text-primary font-semibold text-sm hover:bg-surface-raised transition-colors duration-150"
          >
            {cta.secondary.label}
          </LocalLink>
        ) : null}
      </div>
    </section>
  );
}
