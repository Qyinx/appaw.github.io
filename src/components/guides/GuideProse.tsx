'use client';

import React from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import GuideSpecPanel from './GuideSpecPanel';
import type { GuideSection } from '@/lib/guides/types';

type GuideProseProps = {
  sections: GuideSection[];
};

export default function GuideProse({ sections }: GuideProseProps) {
  return (
    <div className="space-y-12 min-w-0">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-5 text-balance">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.paragraphs.map((para, i) => (
              <p
                key={i}
                className={`text-text-secondary text-base leading-relaxed${i === 0 ? ' guide-aeo-answer' : ''}`}
              >
                {renderGuideParagraph(para)}
              </p>
            ))}
          </div>
          {section.specs && section.specs.length > 0 ? (
            <div className="mt-6">
              <GuideSpecPanel rows={section.specs} />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
