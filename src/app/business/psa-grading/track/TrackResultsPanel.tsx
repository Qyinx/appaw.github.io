'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, List, Route } from 'lucide-react';
import type { GradingRelatedSubmission, GradingSubmission } from '@/lib/grading/types';
import type { GradingServicePlan } from '@/lib/grading/reference-code';
import type { Translations } from '@/i18n/en';
import GradingProgressStepper from '../components/GradingProgressStepper';
import SubmissionItemsTable from '../components/SubmissionItemsTable';
import SubmissionStatusBadges from '../components/SubmissionStatusBadges';
import RelatedSubmissionsStrip from '../track/RelatedSubmissionsStrip';
import {
  animateButtonPress,
  animateResultsTimeline,
  animateSummaryFields,
  animateTableRows,
} from './grading-track-motion';

type ResultsCopy = Translations['psaGradingTrack']['results'];
type ServicePlanCopy = Translations['psaGradingTrack']['servicePlan'];
export type ResultsTab = 'status' | 'cards';

type Props = {
  submission: GradingSubmission;
  copy: ResultsCopy;
  servicePlanCopy: ServicePlanCopy;
  relatedSubmissions?: GradingRelatedSubmission[];
  onSelectReference?: (referenceCode: string) => void;
  activeTab?: ResultsTab;
  onTabChange?: (tab: ResultsTab) => void;
};

function servicePlanLabel(
  plan: GradingServicePlan | null,
  copy: ServicePlanCopy,
): string | null {
  if (!plan) return null;
  const map: Record<GradingServicePlan, string> = {
    REG: copy.regular,
    EXP: copy.express,
    SPX: copy.superExpress,
    WALK: copy.walkThrough,
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
  const hasGrades =
    submission.gradesReady || submission.items.some((item) => item.grade != null && item.grade !== '');
  return hasGrades ? 'cards' : 'status';
}

export default function TrackResultsPanel({
  submission,
  copy,
  servicePlanCopy,
  relatedSubmissions,
  onSelectReference,
  activeTab: controlledTab,
  onTabChange,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statusBlockRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const badgeRefs = useRef<HTMLSpanElement[]>([]);
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
  }, [submission.id, controlledTab]);

  useEffect(() => {
    const sections: HTMLElement[] = [];
    if (panelRef.current) sections.push(panelRef.current);
    if (footerRef.current) sections.push(footerRef.current);

    const tl = animateResultsTimeline(sections);
    const statusFields: HTMLElement[] = [];
    if (headerRef.current) statusFields.push(headerRef.current);
    if (statusBlockRef.current) statusFields.push(statusBlockRef.current);

    const summaryTween = animateSummaryFields(statusFields);

    return () => {
      tl?.kill();
      summaryTween?.kill();
    };
  }, [submission.id]);

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
        className="grading-track-results border border-border-default bg-surface-panel min-w-0"
      >
        <div className="grading-track-results__header">
          <div ref={headerRef} className="spec-row px-0 !py-0 !border-b-0">
            <div className="min-w-0">
              <span className="spec-row__label block mb-1">{copy.refLabel}</span>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-sm md:text-base text-accent-brand tabular-nums tracking-[0.08em] uppercase">
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
            {planLabel && (
              <div className="text-right shrink-0">
                <span className="spec-row__label block mb-1">{copy.servicePlanLabel}</span>
                <p className="spec-row__value">{planLabel}</p>
              </div>
            )}
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
                />
              </div>
            )}

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
            <GradingProgressStepper
              submission={localizedSubmission}
              copy={copy}
              badgeRefs={badgeRefs}
            />

            {submission.shipped && submission.shipTrackingNumber && (
              <div className="mt-6 pt-6 border-t border-border-default min-w-0" data-result-row>
                <h2 className="text-lg font-display font-semibold text-text-primary mb-4">
                  {copy.shippingTitle}
                </h2>
                <div className="panel-raised px-4 py-1">
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

          <div hidden={activeTab !== 'cards'} className={activeTab === 'cards' ? 'min-w-0' : 'hidden'}>
            <div ref={tableRef} className="min-w-0 overflow-x-auto">
              <SubmissionItemsTable items={submission.items} copy={copy.items} showTitle={false} />
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
