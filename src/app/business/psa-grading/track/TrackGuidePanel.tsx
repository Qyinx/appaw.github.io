'use client';

import React, { useEffect, useRef } from 'react';
import LocalLink from '@/components/LocalLink';
import type { Translations } from '@/i18n/en';
import { animateSectionEntrance } from './grading-track-motion';

type GuideCopy = Translations['psaGradingTrack']['guide'];

type Props = {
  copy: GuideCopy;
};

export default function TrackGuidePanel({ copy }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = animateSectionEntrance(panelRef.current);
    return () => {
      tween?.kill();
    };
  }, []);

  return (
    <div ref={panelRef} className="panel p-5 min-h-[12rem] min-w-0 flex flex-col justify-center gap-4">
      <p className="text-sm text-text-secondary leading-relaxed">{copy.idleHint}</p>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="font-medium text-text-primary">{copy.phoneRowLabel}</dt>
          <dd className="text-text-secondary">{copy.phoneRowValue}</dd>
        </div>
        <div>
          <dt className="font-medium text-text-primary">{copy.refRowLabel}</dt>
          <dd className="text-text-secondary">{copy.refRowValue}</dd>
        </div>
        {copy.formatExample ? (
          <div>
            <dt className="font-medium text-text-primary">{copy.formatExampleLabel}</dt>
            <dd className="text-text-secondary font-mono text-xs">{copy.formatExample}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-medium text-text-primary">{copy.multiPlanLabel}</dt>
          <dd className="text-text-secondary">{copy.multiPlanValue}</dd>
        </div>
      </dl>
      <div className="flex flex-col sm:flex-row gap-3">
        <LocalLink
          href="/business/psa-grading#pricing"
          className="inline-flex items-center min-h-[44px] text-sm text-accent-secondary hover:underline w-fit"
        >
          {copy.pricingLink}
        </LocalLink>
        <LocalLink
          href="/business/psa-grading#faq"
          className="inline-flex items-center min-h-[44px] text-sm text-accent-secondary hover:underline w-fit"
        >
          {copy.faqLink}
        </LocalLink>
      </div>
    </div>
  );
}
