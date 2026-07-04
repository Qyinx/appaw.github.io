'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';

type GuideFaqProps = {
  items: { q: string; a: string }[];
  title: string;
  badge?: string;
  id?: string;
  countLabel?: string;
};

export default function GuideFaq({ items, title, badge, id = 'guide-faq', countLabel }: GuideFaqProps) {
  if (!items.length) return null;

  const statLabel = countLabel?.replace('{n}', String(items.length));

  return (
    <section id={id} className="guide-faq scroll-mt-24" aria-labelledby={`${id}-heading`}>
      <div className="guide-faq__header">
        <div className="guide-faq__header-copy">
          {badge ? <p className="section-label mb-3">{badge}</p> : null}
          <h2 id={`${id}-heading`} className="text-2xl md:text-3xl font-bold font-display text-text-primary text-balance">
            {title}
          </h2>
        </div>
        <div className="guide-faq__stat" aria-hidden="true">
          <span className="guide-faq__stat-num">{items.length}</span>
          <span className="guide-faq__stat-label">{statLabel ?? 'topics'}</span>
        </div>
      </div>

      <div className="guide-faq__list divide-y divide-border-default border border-border-default">
        {items.map((item, i) => (
          <details key={item.q} className="guide-faq__item group bg-surface-panel" open={i === 0}>
            <summary className="guide-faq__summary">
              <span className="guide-faq__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="guide-faq__question">{item.q}</span>
              <span className="guide-faq__chevron-wrap" aria-hidden="true">
                <ChevronDown className="guide-faq__chevron" strokeWidth={2.5} />
              </span>
            </summary>
            <div className="guide-faq__answer-wrap">
              <div className="guide-faq__answer-inner">
                <div className="guide-faq__answer-rail" aria-hidden="true" />
                <div className={`guide-faq__answer text-text-secondary text-base leading-relaxed${i === 0 ? ' guide-aeo-answer' : ''}`}>
                  {renderGuideParagraph(item.a)}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
