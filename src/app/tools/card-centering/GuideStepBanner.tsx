'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { STEP_COUNT, ALL_GUIDE_HANDLES } from './centering-guide';
import { useCenteringGuide } from './CenteringGuideContext';
import styles from './card-centering.module.css';

type GuideStepBannerProps = {
  imageReady: boolean;
};

const GuideChevronIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function GuideStepBanner({ imageReady }: GuideStepBannerProps) {
  const { t } = useLanguage();
  const tool = t.centeringPage.tool;
  const howToSteps = t.centeringPage.howToSteps;
  const {
    activeStep,
    guideDismissed,
    touchedGuideHandleCount,
    getStepState,
    dismissGuide,
  } = useCenteringGuide();

  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setExpanded(true);
  }, [activeStep]);

  if (guideDismissed) return null;

  const step = howToSteps[activeStep];
  if (!step) return null;

  const isStartStage = activeStep === 0 && !imageReady;
  const isAlignStep = activeStep === 2;
  const canCollapse = !isStartStage;
  const isCollapsed = canCollapse && !expanded;
  const liveStatus = tool.guideLiveStatus
    .replace('{current}', String(activeStep + 1))
    .replace('{total}', String(STEP_COUNT))
    .replace('{title}', step.name);
  const alignProgress =
    isAlignStep && touchedGuideHandleCount < ALL_GUIDE_HANDLES.length
      ? tool.guideHandlesProgress
          .replace('{done}', String(touchedGuideHandleCount))
          .replace('{total}', String(ALL_GUIDE_HANDLES.length))
      : null;

  return (
    <div
      className={`${styles.guideStepBanner}${isCollapsed ? ` ${styles.guideStepBannerCollapsed}` : ''}`}
      data-expanded={expanded ? 'true' : 'false'}
      role="region"
      aria-label={liveStatus}
    >
      <div className={styles.guideStepHeader}>
        <div className={styles.guideStepPills} aria-hidden="true">
          {howToSteps.map((_, i) => {
            const state = getStepState(i);
            return (
              <span
                key={i}
                className={styles.guideStepPill}
                data-state={state}
                title={howToSteps[i]?.name}
              />
            );
          })}
        </div>

        {canCollapse ? (
          <button
            type="button"
            className={styles.guideStepCollapseToggle}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? tool.guideCollapse : tool.guideExpand}
          >
            <span className={styles.guideStepMeta}>{liveStatus}</span>
            <GuideChevronIcon className={styles.guideStepChevron} />
          </button>
        ) : (
          <p className={styles.guideStepMeta}>{liveStatus}</p>
        )}

        <button type="button" className={styles.guideStepDismiss} onClick={dismissGuide} aria-label={tool.guideDismiss}>
          ×
        </button>
      </div>

      {!isCollapsed ? (
        <div className={styles.guideStepCopy}>
          <p className={styles.guideStepHint}>{step.text}</p>
          {alignProgress ? <p className={styles.guideStepProgress}>{alignProgress}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
