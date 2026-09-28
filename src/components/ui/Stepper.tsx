'use client';

import React, { useEffect, useRef } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type StepperItemState = 'complete' | 'active' | 'pending';
export type StepperPhase = 'intake' | 'psa' | 'pickup';

export type StepperItem = {
  id: string;
  title: React.ReactNode;
  caption?: string;
  state: StepperItemState;
  phase: StepperPhase;
  appaw?: boolean;
  icon?: React.ReactNode;
};

type ItemRef = (el: HTMLElement | null) => void;

type Props = {
  items: StepperItem[];
  progressPercent: number;
  currentStepIndex: number;
  progressSummary: string;
  progressLabel?: string;
  phaseLabels: Record<StepperPhase, string>;
  phaseCodes?: Record<StepperPhase, string>;
  statusWords?: { complete: string; active: string; pending: string };
  progressBarRef?: React.RefObject<HTMLDivElement | null>;
  verticalFillRef?: React.RefObject<HTMLDivElement | null>;
  phaseBarRef?: React.RefObject<HTMLDivElement | null>;
  getItemRef?: (index: number) => ItemRef;
  getActiveIconRef?: (el: HTMLElement | null) => void;
};

const PHASE_ORDER: StepperPhase[] = ['intake', 'psa', 'pickup'];

const DEFAULT_PHASE_CODES: Record<StepperPhase, string> = {
  intake: '01',
  psa: '02',
  pickup: '03',
};

function groupItemsByPhase(items: StepperItem[]): { phase: StepperPhase; items: StepperItem[] }[] {
  return PHASE_ORDER.map((phase) => ({
    phase,
    items: items.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);
}

function itemToneClass(state: StepperItemState): string {
  if (state === 'complete') return 'stepper-timeline__item--complete';
  if (state === 'active') return 'stepper-timeline__item--active';
  return 'stepper-timeline__item--pending';
}

/**
 * Vertical timeline stepper (CodePen-style rail + node + card),
 * styled with Appaw tokens. Progress % strip and phase grid removed.
 */
export default function Stepper({
  items,
  progressPercent,
  currentStepIndex,
  progressSummary,
  progressLabel = 'PROGRESS',
  phaseLabels,
  phaseCodes = DEFAULT_PHASE_CODES,
  statusWords = { complete: 'DONE', active: 'CURRENT', pending: 'NEXT' },
  progressBarRef: _progressBarRef,
  verticalFillRef,
  phaseBarRef: _phaseBarRef,
  getItemRef,
  getActiveIconRef,
}: Props) {
  const pct = Math.min(100, Math.max(0, progressPercent));
  const grouped = groupItemsByPhase(items);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Kept for GradingProgressStepper animation API compatibility (unused in layout).
  void _progressBarRef;
  void _phaseBarRef;

  let globalIndex = 0;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollToActive = () => {
      const activeEl = container.querySelector<HTMLElement>('[data-current-step="true"]');
      if (!activeEl) return;

      activeEl.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToActive);
    });

    return () => cancelAnimationFrame(frame);
  }, [currentStepIndex, items]);

  return (
    <div className="stepper-timeline min-w-0">
      <div className="stepper-timeline__summary">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted">
          {progressLabel}
        </p>
        <p className="font-mono text-xs tabular-nums text-text-primary">{progressSummary}</p>
      </div>

      <div ref={scrollRef} className="stepper-timeline__rail-wrap" aria-label={progressSummary}>
        <div
          className="stepper-timeline__rail"
          aria-hidden="true"
        >
          <div
            ref={verticalFillRef}
            className="stepper-timeline__rail-fill"
            style={
              verticalFillRef
                ? { transform: 'scaleY(0)' }
                : { transform: `scaleY(${pct / 100})` }
            }
          />
        </div>

        <div className="stepper-timeline__list">
          {grouped.map(({ phase, items: phaseItems }) => (
            <section key={phase} aria-labelledby={`stepper-phase-${phase}`}>
              <h3
                id={`stepper-phase-${phase}`}
                className="stepper-timeline__phase"
              >
                [{phaseCodes[phase]}] {phaseLabels[phase]}
              </h3>
              <ol className="space-y-5" aria-label={phaseLabels[phase]}>
                {phaseItems.map((item) => {
                  const index = globalIndex++;
                  const isActive = item.state === 'active';
                  const isCurrentStage = index === currentStepIndex;
                  const caption =
                    item.caption ??
                    (item.state === 'complete'
                      ? statusWords.complete
                      : item.state === 'active'
                        ? statusWords.active
                        : statusWords.pending);

                  return (
                    <li
                      key={item.id}
                      ref={getItemRef?.(index)}
                      data-current-step={isCurrentStage ? 'true' : undefined}
                      aria-current={isActive ? 'step' : undefined}
                      className={`stepper-timeline__item ${itemToneClass(item.state)}`}
                    >
                      <span
                        ref={isActive ? getActiveIconRef : undefined}
                        className="stepper-timeline__node"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>

                      <div className="stepper-timeline__body">
                        <div className="stepper-timeline__body-inner">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="stepper-timeline__badge">{caption}</span>
                          </div>
                          <p className="stepper-timeline__title text-sm leading-snug text-pretty">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
