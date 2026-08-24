'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, List, Route, Search } from 'lucide-react';
import type { GradingRelatedSubmission, GradingSubmission } from '@/lib/grading/types';
import type { GradingServicePlan } from '@/lib/grading/reference-code';
import type { Translations } from '@/i18n/en';
import GradingProgressStepper from '../components/GradingProgressStepper';
import SubmissionItemsTable from '../components/SubmissionItemsTable';
import SubmissionNotesMessage from '../components/SubmissionNotesMessage';
import SubmissionStatusBadges from '../components/SubmissionStatusBadges';
import RelatedSubmissionsStrip from './RelatedSubmissionsStrip';
import {
  animateButtonPress,
  animateReferenceSigil,
  animateResultsTimeline,
  animateSummaryFields,
  animateTableRows,
  animateTabCrossfade,
} from './useGradingTrackAnime';

type ResultsCopy = Translations['psaGradingTrack']['results'];
type SummaryCopy = Translations['psaGradingTrack']['summaryBar'];
type ServicePlanCopy = Translations['psaGradingTrack']['servicePlan'];
export type ResultsTab = 'status' | 'cards';

type Props = {
  submission: GradingSubmission;
  copy: ResultsCopy;
  summaryCopy: SummaryCopy;
  servicePlanCopy: ServicePlanCopy;
  resultsPanelPart: string;
  phone: string;
  onNewLookup: () => void;
  relatedSubmissions?: GradingRelatedSubmission[];
  onSelectReference?: (referenceCode: string) => void;
  relatedSwitchDisabled?: boolean;
  activeTab?: ResultsTab;
  onTabChange?: (tab: ResultsTab) => void;
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone || '····';
  const last4 = digits.slice(-4);
  return `•••• ${last4}`;
}

function servicePlanLabel(
  plan: GradingServicePlan | null,
  copy: ServicePlanCopy,
): string | null {
  if (!plan) return null;
  const map: Record<GradingServicePlan, string> = {
    VBLK: copy.valueBulk,
    VPLS: copy.valuePlus,
    VMAX: copy.valueMax,
    REG: copy.regular,
    EXP: copy.express,
    SPX: copy.superExpress,
    WALK: copy.walkThrough,
    RHLD: copy.reholder,
    PRE1: copy.premium1,
    PRE2: copy.premium2,
    PRE3: copy.premium3,
  };
  return map[plan];
}

function carrierTrackingUrl(carrier: string, tracking: string): string | null {
  const normalized = carrier.toLowerCase();
  const num = tracking.replace(/\s/g, '');
  if (normalized.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(num)}`;
  }
  if (normalized.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(num)}`;
  }
  if (normalized.includes('dhl')) {
    return `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${encodeURIComponent(num)}`;
  }
  return null;
}

function defaultTab(submission: GradingSubmission): ResultsTab {
  const hasCardsDetail =
    submission.gradesReady ||
    submission.items.some(
      (item) =>
        (item.grade != null && item.grade !== '') ||
        (item.certNumber != null && item.certNumber !== ''),
    );
  return hasCardsDetail ? 'cards' : 'status';
}

export default function TrackResultsPanel({
  submission,
  copy,
  summaryCopy,
  servicePlanCopy,
  resultsPanelPart,
  phone,
  onNewLookup,
  relatedSubmissions,
  onSelectReference,
  relatedSwitchDisabled = false,
  activeTab: controlledTab,
  onTabChange,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLParagraphElement>(null);
  const statusBlockRef = useRef<HTMLDivElement>(null);
  const statusTabRef = useRef<HTMLDivElement>(null);
  const cardsTabRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const badgeRefs = useRef<HTMLSpanElement[]>([]);
  const statusBadgeRefs = useRef<HTMLSpanElement[]>([]);
  const prevTabRef = useRef<ResultsTab | null>(null);
  const [internalTab, setInternalTab] = useState<ResultsTab>(() => defaultTab(submission));
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);

  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  const planLabel = servicePlanLabel(submission.servicePlan, servicePlanCopy);
  const cardsTabLabel = copy.tabs.cards.replace('{count}', String(submission.items.length));

  const localizedSubmission: GradingSubmission = {
    ...submission,
    steps: submission.steps.map((step) => {
      if (step.id === 'appaw-recorded') {
        return { ...step, label: copy.steps.appawRecorded };
      }
      if (step.id === 'appaw-sent-psa') {
        return { ...step, label: copy.steps.appawSentToPsa };
      }
      if (step.id === 'appaw-pickup') {
        return { ...step, label: copy.steps.appawPickup };
      }
      return step;
    }),
  };

  useEffect(() => {
    if (controlledTab === undefined) {
      setInternalTab(defaultTab(submission));
    }
    badgeRefs.current = [];
    statusBadgeRefs.current = [];
  }, [submission.id, controlledTab]);

  useEffect(() => {
    const sections: HTMLElement[] = [];
    if (panelRef.current) sections.push(panelRef.current);
    if (footerRef.current) sections.push(footerRef.current);

    const timelineCleanup = animateResultsTimeline(sections);
    const statusFields: HTMLElement[] = [];
    if (headerRef.current) statusFields.push(headerRef.current);
    if (statusBlockRef.current) statusFields.push(statusBlockRef.current);

    const summaryCleanup = animateSummaryFields(statusFields);
    const sigilCleanup = animateReferenceSigil(headerRef.current, codeRef.current);

    return () => {
      timelineCleanup();
      summaryCleanup();
      sigilCleanup();
    };
  }, [submission.id]);

  useEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = activeTab;
    if (prev == null || prev === activeTab) return;

    const outgoing = prev === 'status' ? statusTabRef.current : cardsTabRef.current;
    const incoming = activeTab === 'status' ? statusTabRef.current : cardsTabRef.current;
    return animateTabCrossfade(outgoing, incoming);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'cards' || !tableRef.current) return;

    const rows = Array.from(
      tableRef.current.querySelectorAll<HTMLElement>('[data-result-row]'),
    );
    if (!rows.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateTableRows(rows);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, [submission.id, activeTab]);

  const copyTracking = async (tracking: string, btn: HTMLElement | null) => {
    animateButtonPress(btn);
    try {
      await navigator.clipboard.writeText(tracking.replace(/\s/g, ''));
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const copyReference = async (btn: HTMLElement | null) => {
    animateButtonPress(btn);
    try {
      await navigator.clipboard.writeText(submission.referenceCode);
      setCopiedReference(true);
      setTimeout(() => setCopiedReference(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const trackingUrl =
    submission.shipCarrier && submission.shipTrackingNumber
      ? carrierTrackingUrl(submission.shipCarrier, submission.shipTrackingNumber)
      : null;

  return (
    <div className="min-w-0">
      <div
        ref={panelRef}
        className="grading-track-results grading-track-dossier border border-border-strong bg-surface-panel min-w-0"
      >
        <div className="grading-track-results__header grading-track-dossier-header">
          <p className="chapter-label mb-2" data-part={resultsPanelPart}>
            <span className="sr-only">Part {resultsPanelPart}</span>
          </p>

          <div ref={headerRef} className="grading-track-results__identity">
            <div className="grading-track-results__ref min-w-0 flex-1">
              <span className="spec-row__label">{copy.refLabel}</span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p
                  ref={codeRef}
                  className="grading-track-results__sigil font-mono text-lg md:text-xl text-accent-brand tabular-nums tracking-[0.08em] uppercase break-all"
                >
                  {submission.referenceCode}
                </p>
                <button
                  type="button"
                  onClick={(e) => copyReference(e.currentTarget)}
                  className="btn btn-secondary btn-icon shrink-0"
                  aria-label={copiedReference ? copy.copiedReference : copy.copyReference}
                >
                  {copiedReference ? (
                    <Check className="w-4 h-4 text-accent-success" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onNewLookup}
              className="btn btn-secondary min-h-[44px] inline-flex items-center justify-center gap-2 shrink-0 px-4 text-sm self-start"
            >
              <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
              {summaryCopy.newLookup}
            </button>
          </div>

          <dl className="grading-track-results__meta">
            <div className="grading-track-results__meta-item">
              <dt>{summaryCopy.phoneLabel}</dt>
              <dd className="font-mono tabular-nums">{maskPhone(phone)}</dd>
            </div>
            {planLabel && (
              <div className="grading-track-results__meta-item">
                <dt>{copy.servicePlanLabel}</dt>
                <dd>{planLabel}</dd>
              </div>
            )}
          </dl>

          <div className="grading-track-results__badges">
            <SubmissionStatusBadges
              submission={submission}
              copy={copy.status}
              badgeRefs={statusBadgeRefs}
            />
          </div>
        </div>

        <div className="grading-track-results__body space-y-4">
          {relatedSubmissions &&
            relatedSubmissions.length > 0 &&
            onSelectReference && (
              <div className="panel border border-accent-warn/30 p-0 overflow-hidden">
                <RelatedSubmissionsStrip
                  currentReferenceCode={submission.referenceCode}
                  related={relatedSubmissions}
                  copy={copy.relatedSubmissions!}
                  servicePlanCopy={servicePlanCopy}
                  onSelectReference={onSelectReference}
                  switchDisabled={relatedSwitchDisabled}
                />
              </div>
            )}

          <SubmissionNotesMessage title={copy.notesTitle} html={submission.notes} />

          <div className="collection-filter-pills w-full sm:w-fit" role="group" aria-label={copy.tabsLabel}>
            <button
              type="button"
              className="collection-filter-pill flex-1 sm:flex-none"
              aria-pressed={activeTab === 'status'}
              onClick={() => setActiveTab('status')}
            >
              <Route className="w-4 h-4 shrink-0 inline mr-1.5" aria-hidden="true" />
              {copy.tabs.status}
            </button>
            <button
              type="button"
              className="collection-filter-pill flex-1 sm:flex-none"
              aria-pressed={activeTab === 'cards'}
              onClick={() => setActiveTab('cards')}
            >
              <List className="w-4 h-4 shrink-0 inline mr-1.5" aria-hidden="true" />
              {cardsTabLabel}
            </button>
          </div>

          <div hidden={activeTab !== 'status'} className={activeTab === 'status' ? 'min-w-0' : 'hidden'}>
            <div ref={statusTabRef} className="min-w-0">
              <div ref={statusBlockRef} className="grading-track-journey">
                <GradingProgressStepper
                  submission={localizedSubmission}
                  copy={copy}
                  badgeRefs={badgeRefs}
                />
              </div>

              {submission.shipped && submission.shipTrackingNumber && (
                <div className="mt-6 pt-6 border-t border-border-default min-w-0" data-result-row>
                  <h2 className="text-lg font-display font-semibold text-text-primary mb-4">
                    {copy.shippingTitle}
                  </h2>
                  <div className="panel-raised px-4 py-1 border border-border-default">
                    <div className="spec-row px-0">
                      <span className="spec-row__label">{copy.carrierLabel}</span>
                      <span className="spec-row__value">{submission.shipCarrier}</span>
                    </div>
                    <div className="spec-row px-0">
                      <span className="spec-row__label">{copy.trackingLabel}</span>
                      <span className="spec-row__value inline-flex flex-wrap items-center justify-end gap-2 min-w-0">
                        <span className="font-mono tabular-nums break-all">{submission.shipTrackingNumber}</span>
                        <button
                          type="button"
                          onClick={(e) => copyTracking(submission.shipTrackingNumber!, e.currentTarget)}
                          className="btn btn-secondary btn-icon shrink-0"
                          aria-label={copiedTracking ? copy.copiedTracking : copy.copyTracking}
                        >
                          {copiedTracking ? (
                            <Check className="w-4 h-4 text-accent-success" aria-hidden="true" />
                          ) : (
                            <Copy className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </span>
                    </div>
                  </div>
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-accent-secondary hover:underline min-h-[44px]"
                    >
                      {copy.trackPackage}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div hidden={activeTab !== 'cards'} className={activeTab === 'cards' ? 'min-w-0' : 'hidden'}>
            <div ref={cardsTabRef} className="min-w-0 overflow-x-auto">
              <div ref={tableRef}>
                <SubmissionItemsTable
                  items={submission.items}
                  copy={copy.items}
                  showTitle={false}
                  gradesReady={submission.gradesReady}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p ref={footerRef} className="text-xs font-mono text-text-muted mt-3 px-1">
        {copy.lastSynced.replace('{date}', new Date(submission.lastSyncedAt).toLocaleString())}
      </p>
    </div>
  );
}
