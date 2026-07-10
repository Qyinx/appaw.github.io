'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Clock, PackageOpen, Send, Store } from 'lucide-react';

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
  phaseLabels: Record<StepperPhase, string>;
  progressBarRef?: React.RefObject<HTMLDivElement | null>;
  verticalFillRef?: React.RefObject<HTMLDivElement | null>;
  phaseBarRef?: React.RefObject<HTMLDivElement | null>;
  getItemRef?: (index: number) => ItemRef;
  getActiveIconRef?: (el: HTMLElement | null) => void;
};

const PHASE_ORDER: StepperPhase[] = ['intake', 'psa', 'pickup'];

const PHASE_ICONS: Record<StepperPhase, React.ComponentType<{ className?: string }>> = {
  intake: Store,
  psa: Send,
  pickup: PackageOpen,
};

function indicatorClass(state: StepperItemState, appaw?: boolean): string {
  if (appaw && state === 'complete') return 'border-accent-brand/50 bg-surface-bg text-accent-brand';
  if (state === 'complete') return 'border-accent-success/50 bg-surface-bg text-accent-success';
  if (state === 'active') return 'border-accent-warn/50 bg-surface-bg text-accent-warn';
  return 'border-border-strong bg-surface-bg text-text-muted';
}

function statusPillClass(state: StepperItemState): string {
  if (state === 'complete') return 'border-accent-success/40 bg-accent-success/10 text-accent-success';
  if (state === 'active') return 'border-accent-warn/40 bg-accent-warn/10 text-accent-warn';
  return 'border-border-default bg-surface-raised text-text-muted';
}

function StatusPillIcon({ state }: { state: StepperItemState }) {
  if (state === 'complete') {
    return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
  }
  if (state === 'active') {
    return <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
  }
  return <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
}

function getPhaseState(items: StepperItem[], phase: StepperPhase): StepperItemState {
  const phaseItems = items.filter((item) => item.phase === phase);
  if (!phaseItems.length) return 'pending';
  if (phaseItems.every((item) => item.state === 'complete')) return 'complete';
  if (phaseItems.every((item) => item.state === 'pending')) return 'pending';
  return 'active';
}

function getPhaseProgress(items: StepperItem[], phase: StepperPhase): { completed: number; total: number } {
  const phaseItems = items.filter((item) => item.phase === phase);
  return {
    completed: phaseItems.filter((item) => item.state === 'complete').length,
    total: phaseItems.length,
  };
}

function phaseIndicatorClass(state: StepperItemState): string {
  if (state === 'complete') return 'border-accent-success/50 bg-accent-success/10 text-accent-success';
  if (state === 'active') return 'border-accent-warn/50 bg-accent-warn/10 text-accent-warn';
  return 'border-border-strong bg-surface-bg text-text-muted';
}

function groupItemsByPhase(items: StepperItem[]): { phase: StepperPhase; items: StepperItem[] }[] {
  return PHASE_ORDER.map((phase) => ({
    phase,
    items: items.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);
}

/** Vertical stepper with scrollable step list; auto-centers on current stage */
export default function Stepper({
  items,
  progressPercent,
  currentStepIndex,
  progressSummary,
  phaseLabels,
  progressBarRef,
  verticalFillRef,
  phaseBarRef,
  getItemRef,
  getActiveIconRef,
}: Props) {
  const pct = Math.min(100, Math.max(0, progressPercent));
  const grouped = groupItemsByPhase(items);
  const activePhase = items[currentStepIndex]?.phase;
  const scrollRef = useRef<HTMLDivElement>(null);

  let globalIndex = 0;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollToActive = () => {
      const activeEl = container.querySelector<HTMLElement>('[data-current-step="true"]');
      if (!activeEl) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const relativeTop = activeRect.top - containerRect.top + container.scrollTop;
      const target = relativeTop - container.clientHeight / 2 + activeRect.height / 2;

      container.scrollTo({
        top: Math.max(0, target),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToActive);
    });

    return () => cancelAnimationFrame(frame);
  }, [currentStepIndex, items]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0 border-b border-border-default pb-4">
        <p className="spec-row__label mb-3">{progressSummary}</p>
        <div
          className="relative h-1.5 bg-surface-raised border border-border-default overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={progressSummary}
        >
          <div
            ref={progressBarRef}
            className="absolute inset-y-0 left-0 w-full bg-accent-brand origin-left"
            style={progressBarRef ? { transform: 'scaleX(0)' } : { transform: `scaleX(${pct / 100})` }}
          />
        </div>
      </div>

      <div
        ref={phaseBarRef}
        className="grid grid-cols-3 gap-px border border-border-default bg-border-default min-w-0"
        role="group"
        aria-label="Submission phases"
      >
        {PHASE_ORDER.map((phase) => {
          const phaseState = getPhaseState(items, phase);
          const { completed, total } = getPhaseProgress(items, phase);
          const PhaseIcon = PHASE_ICONS[phase];
          const isActivePhase = phase === activePhase;

          return (
            <div
              key={phase}
              data-phase-node
              aria-label={`${phaseLabels[phase]}: ${completed} of ${total}`}
              className={`flex flex-col items-center gap-1.5 px-2 py-3 min-w-0 transition-colors duration-150 ${
                isActivePhase ? 'bg-surface-panel text-text-primary' : 'bg-surface-raised text-text-muted'
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center border ${phaseIndicatorClass(phaseState)}`}
              >
                {phaseState === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : phaseState === 'active' ? (
                  <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <PhaseIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
              </span>
              <p className="spec-row__label text-center leading-tight line-clamp-2 w-full normal-case">
                {phaseLabels[phase]}
              </p>
              <p className="text-xs text-text-muted font-mono tabular-nums">{completed}/{total}</p>
            </div>
          );
        })}
      </div>

      <div
        ref={scrollRef}
        className="relative min-w-0 max-h-[min(28rem,60vh)] overflow-y-auto overscroll-y-contain scroll-smooth [scrollbar-gutter:stable]"
        aria-label={progressSummary}
      >
        <div className="relative min-w-0 pr-1">
          <div
            className="absolute left-[1.375rem] top-2 bottom-2 w-0.5 bg-surface-raised overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div
              ref={verticalFillRef}
              className="w-full h-full bg-accent-brand origin-top"
              style={
                verticalFillRef
                  ? { transform: 'scaleY(0)' }
                  : { transform: `scaleY(${pct / 100})` }
              }
            />
          </div>

          <div className="space-y-8 pb-2">
            {grouped.map(({ phase, items: phaseItems }) => (
              <section key={phase} aria-labelledby={`stepper-phase-${phase}`}>
                <h3
                  id={`stepper-phase-${phase}`}
                  className="spec-row__label mb-4 pl-12 normal-case tracking-normal"
                >
                  {phaseLabels[phase]}
                </h3>
                <ol className="space-y-4" aria-label={phaseLabels[phase]}>
                  {phaseItems.map((item) => {
                    const index = globalIndex++;
                    const isActive = item.state === 'active';
                    const isCurrentStage = index === currentStepIndex;

                    return (
                      <li
                        key={item.id}
                        ref={getItemRef?.(index)}
                        data-current-step={isCurrentStage ? 'true' : undefined}
                        aria-current={isActive ? 'step' : undefined}
                        className="relative pl-12 scroll-mt-4"
                      >
                        <span
                          ref={isActive ? getActiveIconRef : undefined}
                          className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center border ${indicatorClass(item.state, item.appaw)}`}
                          aria-hidden={Boolean(item.icon)}
                        >
                          {item.icon}
                        </span>

                        {isActive ? (
                          <div className="panel-raised overflow-hidden px-4 py-3 motion-safe:shadow-[inset_3px_0_0_0_var(--accent-primary)]">
                            <div className="min-w-0 space-y-2">
                              <p className="text-base font-medium text-text-primary">{item.title}</p>
                              {item.caption && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${statusPillClass(item.state)}`}
                                >
                                  <StatusPillIcon state={item.state} />
                                  {item.caption}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="min-w-0 py-1.5 space-y-2">
                            <p
                              className={`text-sm ${item.state === 'complete' ? 'text-text-secondary' : 'text-text-primary'}`}
                            >
                              {item.title}
                            </p>
                            {item.caption && (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${statusPillClass(item.state)}`}
                              >
                                <StatusPillIcon state={item.state} />
                                {item.caption}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
