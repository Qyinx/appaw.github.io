'use client';

import React, { useEffect, useRef } from 'react';
import { PackageOpen, Send, Store } from 'lucide-react';

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

const PHASE_ICONS: Record<StepperPhase, React.ComponentType<{ className?: string }>> = {
  intake: Store,
  psa: Send,
  pickup: PackageOpen,
};

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

function groupItemsByPhase(items: StepperItem[]): { phase: StepperPhase; items: StepperItem[] }[] {
  return PHASE_ORDER.map((phase) => ({
    phase,
    items: items.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);
}

function statusWordClass(state: StepperItemState): string {
  if (state === 'complete') return 'text-accent-success';
  if (state === 'active') return 'text-accent-warn';
  return 'text-text-muted';
}

function phaseCellClass(state: StepperItemState, isActivePhase: boolean): string {
  const base = 'flex flex-col gap-1.5 px-3 py-3 min-w-0 border-l-[3px]';
  if (isActivePhase) {
    return `${base} bg-surface-panel border-l-accent-primary text-text-primary`;
  }
  if (state === 'complete') {
    return `${base} bg-surface-raised border-l-accent-success/60 text-text-secondary`;
  }
  return `${base} bg-surface-raised border-l-transparent text-text-muted`;
}

/** Vertical ops stepper: neo-brutalist rail + mono status words */
export default function Stepper({
  items,
  progressPercent,
  currentStepIndex,
  progressSummary,
  progressLabel = 'PROGRESS',
  phaseLabels,
  phaseCodes = DEFAULT_PHASE_CODES,
  statusWords = { complete: 'DONE', active: 'NOW', pending: 'NEXT' },
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

  const phaseStatusWord = (state: StepperItemState) =>
    state === 'complete'
      ? statusWords.complete
      : state === 'active'
        ? statusWords.active
        : statusWords.pending;

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
    <div className="stepper-ops min-w-0 space-y-5">
      <div className="stepper-ops__header border border-border-default bg-surface-panel">
        <div className="flex items-baseline justify-between gap-3 px-4 py-3 border-b border-border-default">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted">
            {progressLabel}
          </p>
          <p className="font-mono text-xs tabular-nums text-text-primary">{progressSummary}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="relative h-2 flex-1 bg-surface-raised border border-border-strong overflow-hidden"
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
          <span className="font-mono text-sm tabular-nums text-text-primary shrink-0 w-12 text-right">
            {Math.round(pct)}%
          </span>
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
              className={phaseCellClass(phaseState, isActivePhase)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <PhaseIcon className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                <span className="font-mono text-[0.6875rem] tabular-nums tracking-wider">
                  [{phaseCodes[phase]}]
                </span>
              </div>
              <p className="text-xs leading-snug line-clamp-2 w-full">{phaseLabels[phase]}</p>
              <div className="flex items-center justify-between gap-2 font-mono text-[0.6875rem] tabular-nums">
                <span>
                  {completed}/{total}
                </span>
                <span className={statusWordClass(phaseState)}>{phaseStatusWord(phaseState)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        ref={scrollRef}
        className="relative min-w-0 max-h-[min(28rem,60vh)] overflow-y-auto overscroll-y-contain scroll-smooth border border-border-default bg-surface-panel [scrollbar-gutter:stable]"
        aria-label={progressSummary}
      >
        <div className="relative min-w-0 px-3 py-3 sm:px-4">
          <div
            className="absolute left-[1.65rem] sm:left-[1.9rem] top-4 bottom-4 w-px bg-border-strong overflow-hidden pointer-events-none"
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

          <div className="space-y-6 pb-1">
            {grouped.map(({ phase, items: phaseItems }) => (
              <section key={phase} aria-labelledby={`stepper-phase-${phase}`}>
                <h3
                  id={`stepper-phase-${phase}`}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted mb-3 pl-11"
                >
                  [{phaseCodes[phase]}] {phaseLabels[phase]}
                </h3>
                <ol className="space-y-2" aria-label={phaseLabels[phase]}>
                  {phaseItems.map((item) => {
                    const index = globalIndex++;
                    const isActive = item.state === 'active';
                    const isCurrentStage = index === currentStepIndex;
                    const stepNum = String(index + 1).padStart(2, '0');

                    return (
                      <li
                        key={item.id}
                        ref={getItemRef?.(index)}
                        data-current-step={isCurrentStage ? 'true' : undefined}
                        aria-current={isActive ? 'step' : undefined}
                        className="relative pl-11 scroll-mt-4"
                      >
                        <span
                          ref={isActive ? getActiveIconRef : undefined}
                          className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center border font-mono text-[0.625rem] tabular-nums ${
                            item.state === 'complete'
                              ? 'border-accent-success/50 bg-surface-bg text-accent-success'
                              : isActive
                                ? 'border-accent-warn/60 bg-surface-bg text-accent-warn'
                                : 'border-border-strong bg-surface-bg text-text-muted'
                          }`}
                          aria-hidden="true"
                        >
                          {stepNum}
                        </span>

                        {isActive ? (
                          <div className="border border-border-strong bg-surface-raised overflow-hidden pl-3 pr-3 py-3 shadow-[inset_3px_0_0_0_var(--accent-primary)]">
                            <div className="flex items-start justify-between gap-3 min-w-0">
                              <p className="text-sm font-medium text-text-primary min-w-0">
                                <span className="font-mono text-accent-primary mr-1.5" aria-hidden="true">
                                  &gt;
                                </span>
                                {item.title}
                              </p>
                              {item.caption && (
                                <span
                                  className={`shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] ${statusWordClass(item.state)}`}
                                >
                                  {item.caption}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3 min-w-0 py-2 px-1 border-b border-border-default/80">
                            <p
                              className={`text-sm min-w-0 ${
                                item.state === 'complete' ? 'text-text-secondary' : 'text-text-primary'
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.caption && (
                              <span
                                className={`shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] ${statusWordClass(item.state)}`}
                              >
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
