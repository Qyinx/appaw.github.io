'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import type { GuideCtaBlock } from '@/lib/guides/types';

type GuideMidCtaProps = {
  cta: GuideCtaBlock;
  label?: string;
};

export default function GuideMidCta({ cta, label = 'Next step' }: GuideMidCtaProps) {
  return (
    <aside
      className="guide-mid-cta panel p-6 md:p-8 border-l-[3px] border-l-accent-secondary my-10"
      aria-label={cta.title}
    >
      <p className="section-label mb-3 text-accent-secondary">{label}</p>
      <h3 className="text-lg md:text-xl font-bold font-display text-text-primary mb-2">{cta.title}</h3>
      <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-5 max-w-xl">{cta.body}</p>
      <div className="flex flex-wrap gap-3">
        <LocalLink
          href={cta.primary.href}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-brand text-accent-structural border border-accent-brand font-semibold text-sm hover:opacity-90 transition-opacity duration-150"
        >
          {cta.primary.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </LocalLink>
        {cta.secondary ? (
          <LocalLink
            href={cta.secondary.href}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-strong text-text-primary font-semibold text-sm hover:bg-surface-raised transition-colors duration-150"
          >
            {cta.secondary.label}
          </LocalLink>
        ) : null}
      </div>
    </aside>
  );
}
