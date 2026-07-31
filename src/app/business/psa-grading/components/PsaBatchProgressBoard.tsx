'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Search } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import {
  cutoffUrgency,
  fetchPublicBatchBoard,
  formatCountdown,
  phaseIndex,
  type PublicBatchBoardItem,
  type PublicBoardPhase,
} from '@/lib/grading/public-board';

gsap.registerPlugin(ScrollTrigger);

const PHASES: PublicBoardPhase[] = ['intake', 'atPsa', 'returning', 'pickup'];

function formatCountdownLabel(
  item: PublicBatchBoardItem,
  copy: {
    closesIn: string;
    closesInHours: string;
    closesInMinutes: string;
    intakeClosed: string;
    noCutoff: string;
  },
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
  copy: ReturnType<typeof useLanguage>['t']['psaGradingPage']['batchBoard'];
  nowMs: number;
}) {
  const urgency = cutoffUrgency(item, nowMs);
  const countdown = formatCountdownLabel(item, copy, nowMs);
  const activeIdx = phaseIndex(item.status);
  const showBook = item.intakeOpen;

  return (
    <article
      className="border border-border-default bg-surface-bg border-l-[3px] border-l-accent-brand"
      data-urgency={urgency}
      aria-label={`${GRADING_SERVICE_PLAN_LABELS[item.plan]} ${copy.phases[item.status]}`}
    >
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent-brand border border-accent-brand/30 px-2 py-0.5">
              {item.plan}
            </span>
            <p className="font-display font-bold text-text-primary text-base md:text-lg leading-snug">
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
            aria-live="polite"
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
                  ? 'bg-accent-brand/10'
                  : done
                    ? 'bg-surface-raised'
                    : 'bg-surface-bg'
              }`}
            >
              <span
                className={`block h-1 mb-1.5 ${
                  done ? 'bg-accent-brand' : 'bg-border-default'
                }`}
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
      const board = await fetchPublicBatchBoard();
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

  /* Board height settles after fetch — refresh how-to pin so chapter jumps stay aligned. */
  useEffect(() => {
    if (batches === null) return;
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(id);
  }, [batches]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

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
          <ul className="space-y-3 list-none m-0 p-0">
            {batches.map((item) => (
              <li key={item.referenceCode}>
                <BatchStrip item={item} copy={copy} nowMs={nowMs} />
              </li>
            ))}
          </ul>
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
