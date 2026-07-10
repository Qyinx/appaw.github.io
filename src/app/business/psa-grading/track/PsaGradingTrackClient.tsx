'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { DEMO_LOOKUP } from '@/lib/grading/mock-data';
import { mockLookup, parseDemoVariant } from '@/lib/grading/mock-lookup';
import { lookupGradingSubmission } from '@/lib/grading/grading-api';
import type { GradingRelatedSubmission, GradingSubmission } from '@/lib/grading/types';
import LocalLink from '@/components/LocalLink';
import HeroStamp from '@/components/ui/HeroStamp';
import { useSubHeader } from '@/hooks/useSubHeader';
import TrackLookupForm, { type TrackLookupFormHandle } from './TrackLookupForm';
import TrackResultsPanel from './TrackResultsPanel';
import { useLanguage } from '@/context/LanguageContext';
import {
  animateFormErrorShake,
  animateFormLoading,
  animateLoadingSkeleton,
  animateResultsColumnEnter,
  animateSectionEntrance,
  useGradingTrackMotion,
} from './useGradingTrackMotion';

type LookupState = 'idle' | 'loading' | 'success' | 'not_found';

export default function PsaGradingTrackClient() {
  const { t } = useLanguage();
  const copy = t.psaGradingTrack;
  const searchParams = useSearchParams();
  const demoParam = searchParams.get('demo');
  const demoVariant = parseDemoVariant(demoParam);
  const forceDemoMode = demoParam !== null;

  const formHandleRef = useRef<TrackLookupFormHandle>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const skeletonTweenRef = useRef<gsap.core.Timeline | void>(undefined);

  useGradingTrackMotion(pageRef);

  const [phone, setPhone] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [submission, setSubmission] = useState<GradingSubmission | null>(null);
  const [relatedSubmissions, setRelatedSubmissions] = useState<GradingRelatedSubmission[]>([]);

  const fillDemo = useCallback(() => {
    setPhone(DEMO_LOOKUP.phoneNumber);
    setReferenceCode(DEMO_LOOKUP.referenceCode);
  }, []);

  const runLookup = useCallback(
    async (lookupPhone: string, lookupRef: string) => {
      setState('loading');
      setSubmission(null);
      setRelatedSubmissions([]);

      let result = null;
      if (forceDemoMode) {
        result = await mockLookup(lookupPhone, lookupRef, demoVariant);
      } else {
        try {
          result = await lookupGradingSubmission(lookupPhone, lookupRef);
        } catch {
          if (process.env.NODE_ENV !== 'production') {
            result = await mockLookup(lookupPhone, lookupRef, demoVariant);
          }
        }
      }
      if (!result) {
        setState('not_found');
        return;
      }
      setSubmission(result.submission);
      setRelatedSubmissions(result.relatedSubmissions ?? []);
      setState('success');
    },
    [demoVariant, forceDemoMode],
  );

  useEffect(() => {
    const tween = animateSectionEntrance(heroRef.current);
    return () => {
      tween?.kill();
    };
  }, []);

  useEffect(() => {
    const formEl = formHandleRef.current?.getFormElement() ?? null;
    const loadingTween = animateFormLoading(formEl, skeletonRef.current, state === 'loading');

    if (state === 'loading' && skeletonRef.current) {
      skeletonTweenRef.current?.kill();
      skeletonTweenRef.current = animateLoadingSkeleton(skeletonRef.current);
    } else {
      skeletonTweenRef.current?.kill();
      skeletonTweenRef.current = undefined;
    }

    return () => {
      loadingTween?.kill();
      skeletonTweenRef.current?.kill();
    };
  }, [state]);

  useEffect(() => {
    if (state !== 'not_found') return;
    const formEl = formHandleRef.current?.getFormElement() ?? null;
    const shakeTween = animateFormErrorShake(formEl);
    return () => {
      shakeTween?.kill();
    };
  }, [state]);

  useEffect(() => {
    if (state !== 'success' || !submission) return;
    const formEl = formHandleRef.current?.getFormElement() ?? null;
    const enterTween = animateResultsColumnEnter(resultsRef.current, formEl);
    return () => {
      enterTween?.kill();
    };
  }, [state, submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runLookup(phone, referenceCode);
  };

  const handleSelectReference = useCallback(
    async (ref: string) => {
      setReferenceCode(ref);
      await runLookup(phone, ref);
    },
    [phone, runLookup],
  );

  const hasSidePanel = state === 'loading' || (state === 'success' && submission != null);

  useSubHeader({
    width: 'narrow',
    leading: (
      <LocalLink
        href="/business/psa-grading"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px] min-w-0"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{copy.backToHub}</span>
      </LocalLink>
    ),
    trailing: (
      <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-[0.6875rem] font-mono text-text-muted uppercase tracking-[0.08em] min-w-0">
        <LocalLink href="/" className="hover:text-text-secondary transition-colors duration-150 shrink-0">
          {copy.breadcrumb.home}
        </LocalLink>
        <span aria-hidden="true" className="text-border-strong">/</span>
        <LocalLink href="/business" className="hover:text-text-secondary transition-colors duration-150 shrink-0">
          {copy.breadcrumb.business}
        </LocalLink>
        <span aria-hidden="true" className="text-border-strong">/</span>
        <LocalLink href="/business/psa-grading" className="hover:text-text-secondary transition-colors duration-150 shrink-0">
          {copy.breadcrumb.grading}
        </LocalLink>
        <span aria-hidden="true" className="text-border-strong">/</span>
        <span className="text-text-secondary truncate">{copy.breadcrumb.track}</span>
      </nav>
    ),
  });

  return (
    <div
      ref={pageRef}
      className="min-h-dvh bg-surface-bg grading-track-workspace collection-workspace page-blueprint overflow-x-clip"
    >
      <div className="workspace-canvas container-tool grading-track-canvas">
        <div ref={heroRef} className="mb-6 md:mb-8">
          <HeroStamp
            decorative={false}
            lines={{
              brand: copy.badge,
              tagline: copy.title,
              muted: copy.subtitle,
            }}
          />
        </div>

        <div
          className={
            hasSidePanel
              ? 'grading-track-grid'
              : 'grading-track-grid grading-track-grid--centered'
          }
        >
          <div className={hasSidePanel ? 'grading-track-form-panel' : undefined}>
            <TrackLookupForm
              ref={formHandleRef}
              copy={copy.form}
              panelLabel={copy.formPanelLabel}
              phone={phone}
              referenceCode={referenceCode}
              onPhoneChange={setPhone}
              onReferenceCodeChange={setReferenceCode}
              onSubmit={handleSubmit}
              onFillDemo={fillDemo}
              state={state}
              compact={hasSidePanel}
            />
          </div>

          {state === 'loading' && (
            <div
              ref={skeletonRef}
              className="grading-track-skeleton min-w-0"
              aria-live="polite"
              aria-busy="true"
            >
              <div data-skeleton-item className="grading-track-skeleton__row h-5 w-40" />
              <div data-skeleton-item className="grading-track-skeleton__panel h-28" />
              <div data-skeleton-item className="grading-track-skeleton__panel h-44" />
            </div>
          )}

          {state === 'success' && submission && (
            <div ref={resultsRef} className="min-w-0">
              <TrackResultsPanel
                submission={submission}
                copy={copy.results}
                servicePlanCopy={copy.servicePlan}
                relatedSubmissions={relatedSubmissions}
                onSelectReference={handleSelectReference}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
