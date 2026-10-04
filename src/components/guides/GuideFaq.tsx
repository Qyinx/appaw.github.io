'use client';

import React, { useState } from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import GuideFaqItem, { toggleExclusiveId } from './GuideFaqItem';

type GuideFaqProps = {
  items: { q: string; a: string }[];
  title: string;
  badge?: string;
  id?: string;
  countLabel?: string;
};

export default function GuideFaq({ items, title, badge, id = 'guide-faq', countLabel }: GuideFaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.q ?? null);

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
          <GuideFaqItem
            key={item.q}
            itemId={item.q}
            indexLabel={String(i + 1).padStart(2, '0')}
            question={item.q}
            open={openId === item.q}
            onToggle={(nextId) => setOpenId((current) => toggleExclusiveId(current, nextId))}
          >
            <div className="guide-faq__answer-rail" aria-hidden="true" />
            <div className={`guide-faq__answer text-text-secondary text-base leading-relaxed${i === 0 ? ' guide-aeo-answer' : ''}`}>
              {renderGuideParagraph(item.a)}
            </div>
          </GuideFaqItem>
        ))}
      </div>
    </section>
  );
}
