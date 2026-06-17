'use client';

import React from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import GuideBulletGroups from './GuideBulletGroups';
import GuideSpecPanel from './GuideSpecPanel';
import GuideTable from './GuideTable';
import GuideImage from './GuideImage';
import GuideVideo from './GuideVideo';
import type { GuideSection, GuideSubsection } from '@/lib/guides/types';

type GuideProseProps = {
  sections: GuideSection[];
};

function renderSubsection(sub: GuideSubsection, key: string) {
  const Heading = sub.level === 4 ? 'h4' : 'h3';
  const headingClass =
    sub.level === 4
      ? 'text-lg font-semibold font-display text-text-primary mt-6 mb-3'
      : 'text-xl font-bold font-display text-text-primary mt-8 mb-4';

  return (
    <div key={key}>
      <Heading className={headingClass}>{sub.title}</Heading>
      {sub.paragraphs?.map((para, i) => (
        <p key={i} className="text-text-secondary text-base leading-relaxed mb-4">
          {renderGuideParagraph(para)}
        </p>
      ))}
      {sub.bulletGroups ? <GuideBulletGroups groups={sub.bulletGroups} /> : null}
      {sub.images?.map((image, i) => (
        <GuideImage key={`${image.src}-${i}`} src={image.src} caption={image.caption} />
      ))}
      {sub.videos?.map((video, i) => (
        <GuideVideo key={`${video.src}-${i}`} src={video.src} caption={video.caption} />
      ))}
    </div>
  );
}

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
          {section.bulletGroups ? <GuideBulletGroups groups={section.bulletGroups} /> : null}
          {section.videos?.map((video, i) => (
            <GuideVideo key={`${video.src}-${i}`} src={video.src} caption={video.caption} />
          ))}
          {section.callout ? (
            <blockquote className="my-6 border-l-4 border-accent-link/60 bg-surface-raised/50 px-5 py-4 text-text-secondary text-base leading-relaxed">
              {renderGuideParagraph(section.callout)}
            </blockquote>
          ) : null}
          {section.subsections?.map((sub, i) => renderSubsection(sub, `${section.id}-sub-${i}`))}
          {section.table ? (
            <GuideTable table={section.table} />
          ) : section.specs && section.specs.length > 0 ? (
            <div className="mt-6">
              <GuideSpecPanel rows={section.specs} />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
