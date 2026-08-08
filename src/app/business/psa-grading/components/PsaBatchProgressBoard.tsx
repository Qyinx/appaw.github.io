'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import { planBoardAccent } from '@/lib/grading/plan-accent';
import {
  cutoffUrgency,
  fetchPublicBatchBoard,
  formatCountdown,
  phaseIndex,
  type PublicBatchBoardItem,
  type PublicBoardPhase,
} from '@/lib/grading/public-board';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PHASES: PublicBoardPhase[] = ['intake', 'atPsa', 'returning', 'pickup'];

type BatchBoardCopy = ReturnType<typeof useLanguage>['t']['psaGradingPage']['batchBoard'];

function refreshScrollTriggers() {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

function formatCountdownLabel(
  item: PublicBatchBoardItem,
  copy: Pick<
    BatchBoardCopy,
    'closesIn' | 'closesInHours' | 'closesInMinutes' | 'intakeClosed' | 'noCutoff'
  >,
  nowMs: number,
): string {
  const cd = formatCountdown(item.intakeCutoffAt, nowMs);
  if (cd.kind === 'none') return copy.noCutoff;
  if (cd.kind === 'closed' || !item.intakeOpen) return copy.intakeClosed;
  const parts = cd.labelParts!;
  if (parts.days > 0) {
    return copy.closesIn
      .replace('{days}', String(parts.days))
      .replace('{hours}', String(parts.hours));
  }
  if (parts.hours > 0) {
    return copy.closesInHours
      .replace('{hours}', String(parts.hours))
      .replace('{minutes}', String(parts.minutes));
  }
  return copy.closesInMinutes.replace('{minutes}', String(Math.max(1, parts.minutes)));
}

function BatchStrip({
  item,
  copy,
  nowMs,
}: {
  item: PublicBatchBoardItem;
  copy: BatchBoardCopy;
  nowMs: number;
}) {
  const urgency = cutoffUrgency(item, nowMs);
  const countdown = formatCountdownLabel(item, copy, nowMs);
  const activeIdx = phaseIndex(item.status);
  const showBook = item.intakeOpen;
  const planLabel = GRADING_SERVICE_PLAN_LABELS[item.plan] ?? item.plan;
  const accent = planBoardAccent(item.plan);

  return (
    <article
      className={`border border-border-default bg-surface-bg border-l-[3px] ${accent.edge}`}
      data-urgency={urgency}
      data-plan={item.plan}
      aria-label={`${planLabel} ${copy.phases[item.status]}`}
    >
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-mono text-[0.65rem] uppercase tracking-[0.14em] border px-2 py-0.5 ${accent.badge}`}
            >
              {item.plan}
            </span>
            <p className="font-display font-bold text-text-primary text-base md:text-lg leading-snug">
              {planLabel}
            </p>
            <p className="font-display font-semibold text-text-secondary text-sm md:text-base leading-snug">
              {copy.phases[item.status]}
            </p>
            {urgency === 'soon' ? (
              <span className="font-mono text-[0.65rem] uppercase tracking-wide text-accent-warn">
                {copy.closingSoon}
              </span>
            ) : null}
            {urgency === 'closed' && item.status === 'intake' ? (
              <span className="font-mono text-[0.65rem] uppercase tracking-wide text-text-muted">
                {copy.intakeClosed}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-text-secondary">{copy.phaseHints[item.status]}</p>
          <p
            className={`font-mono text-lg md:text-xl font-semibold tabular-nums ${
              urgency === 'soon'
                ? 'text-accent-warn'
                : urgency === 'closed'
                  ? 'text-text-muted'
                  : 'text-text-primary'
            }`}
          >
            {countdown}
          </p>
          <p className="font-mono text-xs text-text-muted tracking-wide">{item.referenceCode}</p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {showBook ? (
            <a
              href={PSA_SUBMISSION_APPOINTMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full md:w-auto min-h-[44px]"
            >
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              <span>{copy.bookCta}</span>
            </a>
          ) : (
            <LocalLink
              href="/business/psa-grading/track"
              className="btn btn-secondary w-full md:w-auto min-h-[44px]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{copy.trackCta}</span>
            </LocalLink>
          )}
        </div>
      </div>

      <div
        className="grid grid-cols-4 gap-0 border-t border-border-default"
        role="list"
        aria-label={copy.phases[item.status]}
      >
        {PHASES.map((phase, index) => {
          const done = index <= activeIdx;
          const current = index === activeIdx;
          return (
            <div
              key={phase}
              role="listitem"
              className={`px-2 py-2 text-center border-r border-border-default last:border-r-0 ${
                current
                  ? accent.phaseCurrent
                  : done
                    ? 'bg-surface-raised'
                    : 'bg-surface-bg'
              }`}
            >
              <span
                className={`block h-1 mb-1.5 ${done ? accent.bar : 'bg-border-default'}`}
                aria-hidden="true"
              />
              <span
                className={`font-mono text-[0.55rem] uppercase tracking-wide ${
                  current ? 'text-text-primary font-semibold' : 'text-text-muted'
                }`}
              >
                {copy.phases[phase]}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function BatchCompactRow({
  item,
  copy,
  nowMs,
}: {
  item: PublicBatchBoardItem;
  copy: BatchBoardCopy;
  nowMs: number;
}) {
  const urgency = cutoffUrgency(item, nowMs);
  const countdown = formatCountdownLabel(item, copy, nowMs);
  const showBook = item.intakeOpen;
  const planLabel = GRADING_SERVICE_PLAN_LABELS[item.plan] ?? item.plan;
  const accent = planBoardAccent(item.plan);

  return (
    <article
      className={`flex flex-col gap-2 border border-border-default bg-surface-bg border-l-[3px] ${accent.edge} px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4`}
      data-plan={item.plan}
      aria-label={`${planLabel} ${copy.phases[item.status]}`}
    >
      <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={`font-mono text-[0.6rem] uppercase tracking-[0.12em] ${accent.badgeText}`}>
          {item.plan}
        </span>
        <span className="font-display font-semibold text-sm text-text-primary">{planLabel}</span>
        <span className="font-display font-medium text-sm text-text-secondary">
          {copy.phases[item.status]}
        </span>
        <span
          className={`font-mono text-xs tabular-nums ${
            urgency === 'soon' ? 'text-accent-warn' : 'text-text-muted'
          }`}
        >
          {countdown}
        </span>
        <span className="font-mono text-[0.65rem] text-text-muted w-full sm:w-auto">
          {item.referenceCode}
        </span>
      </div>
      <div className="shrink-0">
        {showBook ? (
          <a
            href={PSA_SUBMISSION_APPOINTMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary min-h-[40px] text-xs px-3"
          >
            {copy.bookCta}
          </a>
        ) : (
          <LocalLink
            href="/business/psa-grading/track"
            className="btn btn-secondary min-h-[40px] text-xs px-3"
          >
            {copy.trackCta}
          </LocalLink>
        )}
      </div>
    </article>
  );
}

function SpotlightBatchList({
  items,
  copy,
  nowMs,
}: {
  items: PublicBatchBoardItem[];
  copy: BatchBoardCopy;
  nowMs: number;
}) {
  return (
    <ul className="m-0 list-none space-y-3 p-0" aria-label={copy.title}>
      {items.map((item) => (
        <li key={item.referenceCode}>
          <BatchStrip item={item} copy={copy} nowMs={nowMs} />
        </li>
      ))}
    </ul>
  );
}

function OtherRoundsAccordion({
  items,
  copy,
  nowMs,
}: {
  items: PublicBatchBoardItem[];
  copy: BatchBoardCopy;
  nowMs: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (!didMountRef.current) {
        didMountRef.current = true;
        gsap.set(panel, { height: 0, opacity: 1, overflow: 'hidden' });
        return;
      }

      if (open) {
        gsap.set(panel, { height: 'auto', overflow: 'hidden' });
        const target = panel.scrollHeight;
        gsap.fromTo(
          panel,
          { height: 0, opacity: 0.6 },
          {
            height: target,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(panel, { height: 'auto', overflow: 'visible' });
              refreshScrollTriggers();
            },
          },
        );
      } else {
        gsap.set(panel, { overflow: 'hidden' });
        gsap.to(panel, {
          height: 0,
          opacity: 0.85,
          duration: 0.28,
          ease: 'power2.inOut',
          onComplete: refreshScrollTriggers,
        });
      }
    },
    { scope: rootRef, dependencies: [open, items.length] },
  );

  const toggleLabel = open
    ? copy.hideOtherRounds
    : copy.showOtherRounds.replace('{count}', String(items.length));

  return (
    <div ref={rootRef} className="border border-border-default bg-surface-bg">
      <button
        type="button"
        className="flex w-full min-h-[44px] items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
        aria-controls="batch-other-rounds-panel"
        id="batch-other-rounds-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display font-semibold text-sm text-text-primary">
          {copy.otherRounds}
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-text-muted">
          {toggleLabel}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        ref={panelRef}
        id="batch-other-rounds-panel"
        role="region"
        aria-labelledby="batch-other-rounds-trigger"
        className="overflow-hidden"
        style={{ height: 0 }}
      >
        <ul className="space-y-2 list-none m-0 px-3 pb-3">
          {items.map((item) => (
            <li key={item.referenceCode}>
              <BatchCompactRow item={item} copy={copy} nowMs={nowMs} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function splitBoardBatches(batches: PublicBatchBoardItem[]): {
  spotlight: PublicBatchBoardItem[];
  others: PublicBatchBoardItem[];
} {
  const open = batches.filter((b) => b.intakeOpen);
  if (open.length === 0) {
    return { spotlight: batches, others: [] };
  }
  const openRefs = new Set(open.map((b) => b.referenceCode));
  return {
    spotlight: open,
    others: batches.filter((b) => !openRefs.has(b.referenceCode)),
  };
}

export default function PsaBatchProgressBoard() {
  const { t } = useLanguage();
  const copy = t.psaGradingPage.batchBoard;
  const [batches, setBatches] = useState<PublicBatchBoardItem[] | null>(null);
  const [error, setError] = useState('');
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();

  const load = useCallback(async () => {
    setError('');
    try {
      const forceMock =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('mockBoard') === '1';
      const board = await fetchPublicBatchBoard({ forceMock });
      setBatches(board.batches);
      setUpdatedAt(board.updatedAt);
      setNowMs(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.error);
      setBatches([]);
    }
  }, [copy.error]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (batches === null) return;
    refreshScrollTriggers();
  }, [batches]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const { spotlight, others } = useMemo(
    () => (batches ? splitBoardBatches(batches) : { spotlight: [], others: [] }),
    [batches],
  );

  return (
    <section
      id="batches"
      className="relative overflow-x-clip border-b border-border-default bg-surface-panel page-blueprint scroll-mt-20"
      aria-labelledby="batch-board-title"
    >
      <div className="container-custom py-8 md:py-10">
        <div className="mb-6 max-w-2xl space-y-2">
          <h2
            id="batch-board-title"
            className="font-display font-bold text-text-primary text-xl md:text-2xl tracking-tight"
          >
            {copy.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">{copy.lead}</p>
        </div>

        {batches === null ? (
          <p className="text-sm text-text-muted">{copy.loading}</p>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-accent-danger" role="alert">
              {error || copy.error}
            </p>
            <button type="button" className="btn btn-secondary min-h-[44px]" onClick={() => void load()}>
              {copy.retry}
            </button>
          </div>
        ) : batches.length === 0 ? (
          <div className="border border-border-default bg-surface-bg p-5 space-y-3 max-w-xl">
            <p className="font-display font-bold text-text-primary text-lg">{copy.emptyTitle}</p>
            <p className="text-sm text-text-secondary">{copy.emptyBody}</p>
            <a
              href={PSA_SUBMISSION_APPOINTMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary min-h-[44px] inline-flex"
            >
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              <span>{copy.emptyCta}</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {spotlight.length > 0 ? (
              <SpotlightBatchList items={spotlight} copy={copy} nowMs={nowMs} />
            ) : null}
            {others.length > 0 ? (
              <OtherRoundsAccordion items={others} copy={copy} nowMs={nowMs} />
            ) : null}
          </div>
        )}

        {updatedAt ? (
          <p className="mt-4 font-mono text-xs text-text-muted">
            {copy.updatedLabel}: {new Date(updatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>
    </section>
  );
}
