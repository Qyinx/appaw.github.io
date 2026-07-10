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
type ResultsTab = 'status' | 'cards';

type Props = {
  submission: GradingSubmission;
  copy: ResultsCopy;
  servicePlanCopy: ServicePlanCopy;
  relatedSubmissions?: GradingRelatedSubmission[];
  onSelectReference?: (referenceCode: string) => void;
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
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const badgeRefs = useRef<HTMLSpanElement[]>([]);
  const [activeTab, setActiveTab] = useState<ResultsTab>(() => defaultTab(submission));
  const [copiedTracking, setCopiedTracking] = useState(false);

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
    setActiveTab(defaultTab(submission));
    badgeRefs.current = [];
  }, [submission.id]);

  useEffect(() => {
    const sections: HTMLElement[] = [];
    if (panelRef.current) sections.push(panelRef.current);
    if (footerRef.current) sections.push(footerRef.current);

    const tl = animateResultsTimeline(sections);
    const statusFields: HTMLElement[] = [];
    if (statusRef.current) statusFields.push(statusRef.current);
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
          <div ref={statusRef} className="spec-row px-0 !py-0 !border-b-0">
            <div className="min-w-0">
              <span className="spec-row__label block mb-1">{copy.refLabel}</span>
              <p className="font-mono text-sm md:text-base text-accent-brand tabular-nums tracking-[0.08em] uppercase">
                {submission.referenceCode}
              </p>
            </div>
            {planLabel && (
              <div className="text-right shrink-0">
                <span className="spec-row__label block mb-1">{copy.servicePlanLabel}</span>
                <p className="spec-row__value">{planLabel}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grading-track-results__body space-y-6">
        <div className="spec-row px-0 !py-0 !border-b-0">
          <div className="min-w-0">
            <span className="spec-row__label block mb-1">{copy.statusLabel}</span>
            <p className="text-base font-medium text-text-primary">{submission.statusSummary}</p>
          </div>
        </div>

        <SubmissionStatusBadges
          submission={submission}
          copy={copy.status}
          badgeRefs={badgeRefs}
        />

        <div
          role="tablist"
          aria-label={copy.statusLabel}
          className="grid grid-cols-2 gap-px border border-border-default bg-border-default min-w-0"
        >
          <button
            type="button"
            role="tab"
            id="grading-tab-status"
            aria-selected={activeTab === 'status'}
            aria-controls="grading-panel-status"
            onClick={() => setActiveTab('status')}
            className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-3 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'status'
                ? 'bg-surface-panel text-text-primary'
                : 'bg-surface-raised text-text-muted hover:text-text-secondary'
            }`}
          >
            <Route className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{copy.tabs.status}</span>
          </button>
          <button
            type="button"
            role="tab"
            id="grading-tab-cards"
            aria-selected={activeTab === 'cards'}
            aria-controls="grading-panel-cards"
            onClick={() => setActiveTab('cards')}
            className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-3 text-sm font-medium transition-colors duration-150 ${
              activeTab === 'cards'
                ? 'bg-surface-panel text-text-primary'
                : 'bg-surface-raised text-text-muted hover:text-text-secondary'
            }`}
          >
            <List className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{cardsTabLabel}</span>
          </button>
        </div>

        <div
          role="tabpanel"
          id="grading-panel-status"
          aria-labelledby="grading-tab-status"
          hidden={activeTab !== 'status'}
          tabIndex={activeTab === 'status' ? 0 : undefined}
          className={activeTab === 'status' ? 'min-w-0' : 'hidden'}
        >
          <GradingProgressStepper
            submission={localizedSubmission}
            copy={copy}
            badgeRefs={badgeRefs}
          />

          {submission.shipped && submission.shipTrackingNumber && (
            <div className="mt-8 pt-8 border-t border-border-default min-w-0" data-result-row>
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

        <div
          role="tabpanel"
          id="grading-panel-cards"
          aria-labelledby="grading-tab-cards"
          hidden={activeTab !== 'cards'}
          tabIndex={activeTab === 'cards' ? 0 : undefined}
          className={activeTab === 'cards' ? 'min-w-0' : 'hidden'}
        >
          <div ref={tableRef} className="min-w-0 overflow-x-auto">
            <SubmissionItemsTable items={submission.items} copy={copy.items} showTitle={false} />
          </div>
        </div>

        {relatedSubmissions &&
          relatedSubmissions.length > 0 &&
          onSelectReference && (
            <div className="pt-6 border-t border-border-default">
              <RelatedSubmissionsStrip
                currentReferenceCode={submission.referenceCode}
                related={relatedSubmissions}
                copy={copy.relatedSubmissions!}
                servicePlanCopy={servicePlanCopy}
                onSelectReference={onSelectReference}
              />
            </div>
          )}
        </div>
      </div>

      <p ref={footerRef} className="text-xs font-mono text-text-muted mt-3 px-1">
        {copy.lastSynced.replace('{date}', new Date(submission.lastSyncedAt).toLocaleString())}
      </p>
    </div>
  );
}
