'use client';

import { useSyncExternalStore } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import CardCenteringClient from './CardCenteringClient';
import CenteringContent from './CenteringContent';
import CenteringFollowCta from './CenteringFollowCta';
import { CenteringGuideProvider } from './CenteringGuideContext';
import {
  getCenteringSubHeaderLive,
  getCenteringSubHeaderLiveVersion,
  subscribeCenteringSubHeaderLive,
} from './centering-subheader-live';

function CenteringWorkspaceChrome() {
  const { t } = useLanguage();
  const tool = t.centeringPage.tool;
  useSyncExternalStore(
    subscribeCenteringSubHeaderLive,
    getCenteringSubHeaderLiveVersion,
    getCenteringSubHeaderLiveVersion,
  );
  const live = getCenteringSubHeaderLive();
  const fmt = (n?: number) => (typeof n === 'number' ? n.toFixed(1) : '—');

  useSubHeader({
    contentWidth: 'page',
    content: (
      <div className="centering-subheader">
        <p className="centering-subheader__title">{tool.workspaceHeading}</p>
        <div className="centering-subheader__status" aria-live="polite" aria-atomic="true" role="status">
          {live.photoMode === 'raw' ? (
            <div className="centering-subheader__readout">
              <div
                className="centering-subheader__grade-block"
                data-quality={live.quality}
              >
                <span className="centering-subheader__kicker">{tool.gradeReadout}</span>
                <span className="centering-subheader__grade-value">{live.zoneLabel ?? '—'}</span>
              </div>
              <div className="centering-subheader__axes">
                <div className="centering-subheader__axis">
                  <span className="centering-subheader__axis-key">{tool.lrLabel}</span>
                  <span className="centering-subheader__axis-val">
                    {fmt(live.lr)}
                    <span className="centering-subheader__slash">/</span>
                    {fmt(typeof live.lr === 'number' ? 100 - live.lr : undefined)}
                  </span>
                </div>
                <div className="centering-subheader__axis">
                  <span className="centering-subheader__axis-key">{tool.tbLabel}</span>
                  <span className="centering-subheader__axis-val">
                    {fmt(live.tb)}
                    <span className="centering-subheader__slash">/</span>
                    {fmt(typeof live.tb === 'number' ? 100 - live.tb : undefined)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          {live.photoMode === 'slab' && live.verdictLabel ? (
            <div className="centering-subheader__readout">
              <div className="centering-subheader__grade-block">
                <span className="centering-subheader__kicker">{tool.gradeReadout}</span>
                <span className="centering-subheader__grade-value">{live.verdictLabel}</span>
              </div>
              <span className="centering-subheader__hint">{live.verdictHint}</span>
            </div>
          ) : null}
          {live.photoMode === 'slab' && !live.hasGrade ? (
            <span className="centering-subheader__hint">{tool.reholderNote}</span>
          ) : null}
        </div>
      </div>
    ),
  });

  return null;
}

export default function CenteringPageShell() {
  return (
    <CenteringGuideProvider>
      <CenteringWorkspaceChrome />
      <CardCenteringClient />
      <CenteringFollowCta variant="strip" />
      <CenteringContent />
    </CenteringGuideProvider>
  );
}
