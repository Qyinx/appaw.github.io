'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import type { Translations } from '@/i18n/en';

type HowToCopy = Translations['psaGradingPage']['howTo'];

type Props = {
  copy: HowToCopy;
  /** Enables scroll-scrub active-step classes (pinned how-to section). */
  scrollLinked?: boolean;
};

export default function PsaGradingWorkflowTimeline({ copy, scrollLinked = false }: Props) {
  const listClass = scrollLinked
    ? 'grading-workflow-timeline__list grading-workflow-timeline__list--scroll-linked'
    : 'grading-workflow-timeline__list';

  return (
    <div className={`grading-workflow-timeline${scrollLinked ? ' grading-workflow-timeline--scroll-linked' : ''}`}>
      {scrollLinked ? (
        <div className="grading-workflow-timeline__track" aria-hidden="true">
          <span className="grading-workflow-timeline__track-line" />
          <span className="grading-workflow-timeline__track-fill" />
        </div>
      ) : null}

      <ol className={listClass} aria-label={copy.title}>
        {copy.steps.map((step, index) => {
          const stepNum = index + 1;
          const isLast = index === copy.steps.length - 1;

          return (
            <li
              key={step.title}
              data-step-index={index}
              className={`grading-workflow-timeline__item${isLast ? ' grading-workflow-timeline__item--last' : ''}${scrollLinked && index === 0 ? ' grading-workflow-timeline__item--active' : ''}`}
              aria-current={scrollLinked && index === 0 ? 'step' : undefined}
            >
              <div className="grading-workflow-timeline__rail" aria-hidden="true">
                <span className="grading-workflow-timeline__node" />
              </div>

              <div className="grading-workflow-timeline__content panel">
                <span className="grading-workflow-timeline__index font-mono" aria-hidden="true">
                  {String(stepNum).padStart(2, '0')}
                </span>
                <p className="grading-workflow-timeline__step-label font-mono text-xs uppercase tracking-wide text-text-muted">
                  {copy.stepLabel} {stepNum}
                </p>
                <h3 className="grading-workflow-timeline__title font-display font-bold text-text-primary text-lg md:text-xl tracking-tight">
                  {step.title}
                </h3>
                <p className="grading-workflow-timeline__tagline font-mono text-xs uppercase tracking-wide text-text-muted">
                  {step.tagline}
                </p>
                <p className="grading-workflow-timeline__body text-sm text-text-secondary leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grading-workflow-timeline__footer">
        <LocalLink
          href="/business/psa-grading/track"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-secondary hover:underline min-h-[44px]"
        >
          <span>{copy.trackLink}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </LocalLink>
      </div>
    </div>
  );
}
