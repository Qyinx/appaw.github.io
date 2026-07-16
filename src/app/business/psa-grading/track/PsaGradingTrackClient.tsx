'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEMO_LOOKUP } from '@/lib/grading/mock-data';
import { mockLookup, parseDemoVariant } from '@/lib/grading/mock-lookup';
import { lookupGradingSubmission } from '@/lib/grading/grading-api';
import type { GradingSubmission } from '@/lib/grading/types';
import LocalLink from '@/components/LocalLink';
import { useSubHeader } from '@/hooks/useSubHeader';
import TrackLookupForm, { type TrackLookupFormHandle } from './TrackLookupForm';
import TrackLookupSummaryBar from './TrackLookupSummaryBar';
import TrackResultsPanel, { type ResultsTab } from './TrackResultsPanel';
import TrackGuidePanel from './TrackGuidePanel';
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

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';

export default function PsaGradingTrackClient() {
  const { t } = useLanguage();
  const copy = t.psaGradingTrack;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const demoParam = searchParams.get('demo');
  const demoVariant = parseDemoVariant(demoParam);
  const isDev = process.env.NODE_ENV !== 'production';
  const forceDemoMode = isDev && demoParam !== null;
  const focusParam = searchParams.get('focus');
  const initialFocus = focusParam === 'lookup' ? 'phone' : undefined;
  const requireTurnstile = !forceDemoMode;

  const formHandleRef = useRef<TrackLookupFormHandle>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const skeletonTweenRef = useRef<gsap.core.Timeline | void>(undefined);

  useGradingTrackMotion(pageRef);

  const [phone, setPhone] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [submission, setSubmission] = useState<GradingSubmission | null>(null);
  const [resultsTab, setResultsTab] = useState<ResultsTab>(
    searchParams.get('view') === 'cards' ? 'cards' : 'status',
  );
  const [liveMessage, setLiveMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [resetSignal, setResetSignal] = useState(0);
  const [securityError, setSecurityError] = useState('');

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('');
    setResetSignal((n) => n + 1);
  }, []);

  const syncUrl = useCallback(
    (nextView?: ResultsTab) => {
      const params = new URLSearchParams();
      if (nextView && nextView !== 'status') params.set('view', nextView);
      if (isDev && demoParam !== null) params.set('demo', demoParam);
      if (focusParam === 'lookup') params.set('focus', 'lookup');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [demoParam, focusParam, isDev, pathname, router],
  );

  const fillDemo = useCallback(() => {
    setPhone(DEMO_LOOKUP.phoneNumber);
    setReferenceCode(DEMO_LOOKUP.referenceCode);
  }, []);

  const mapLookupError = useCallback(
    (message: string) => {
      if (message.includes('TURNSTILE_SECRET_KEY not configured')) {
        return copy.form.turnstileMissingKey;
      }
      if (message.includes('Turnstile token required')) {
        return copy.form.turnstileRequired;
      }
      if (message.includes('Turnstile verification failed')) {
        return copy.form.turnstileFailed;
      }
      return copy.form.lookupError;
    },
    [copy.form],
  );

  const runLookup = useCallback(
    async (lookupPhone: string, lookupRef: string, token: string) => {
      setSecurityError('');

      if (requireTurnstile) {
        if (!SITE_KEY) {
          setSecurityError(copy.form.turnstileMissingKey);
          return;
        }
        if (!token) {
          setSecurityError(copy.form.turnstileRequired);
          return;
        }
      }

      setState('loading');
      setSubmission(null);
      setLiveMessage('');

      let result = null;
      let errored = false;
      if (forceDemoMode) {
        result = await mockLookup(lookupPhone, lookupRef, demoVariant);
      } else {
        try {
          result = await lookupGradingSubmission(lookupPhone, lookupRef, token);
        } catch (e) {
          errored = true;
          const message = e instanceof Error ? e.message : String(e);
          if (
            message.includes('Turnstile') ||
            message.includes('TURNSTILE')
          ) {
            setSecurityError(mapLookupError(message));
            setState('idle');
            resetTurnstile();
            return;
          }
          if (process.env.NODE_ENV !== 'production') {
            result = await mockLookup(lookupPhone, lookupRef, demoVariant);
            errored = false;
          }
        }
      }

      resetTurnstile();

      if (!result) {
        if (errored) {
          setSecurityError(copy.form.lookupError);
          setState('idle');
          return;
        }
        setState('not_found');
        setLiveMessage(copy.form.notFoundTitle);
        syncUrl();
        return;
      }
      setSubmission(result.submission);
      setState('success');
      setLiveMessage(`${copy.results.refLabel}: ${result.submission.referenceCode}`);
      syncUrl(resultsTab);
    },
    [
      copy.form.lookupError,
      copy.form.notFoundTitle,
      copy.form.turnstileMissingKey,
      copy.form.turnstileRequired,
      copy.results.refLabel,
      demoVariant,
      forceDemoMode,
      mapLookupError,
      requireTurnstile,
      resetTurnstile,
      resultsTab,
      syncUrl,
    ],
  );

  useEffect(() => {
    const tween = animateSectionEntrance(gridRef.current);
    return () => {
      tween?.kill();
    };
  }, []);

  useEffect(() => {
    const urlView = searchParams.get('view');
    if (urlView === 'cards' || urlView === 'status') {
      setResultsTab(urlView);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.has('phone') && !searchParams.has('ref')) return;
    const urlView = searchParams.get('view');
    syncUrl(urlView === 'cards' || urlView === 'status' ? urlView : undefined);
  }, [searchParams, syncUrl]);

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
    const enterTween = animateResultsColumnEnter(resultsRef.current, null);
    return () => {
      enterTween?.kill();
    };
  }, [state, submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runLookup(phone, referenceCode, turnstileToken);
  };

  const handleNewLookup = useCallback(() => {
    setState('idle');
    setSubmission(null);
    setLiveMessage('');
    setSecurityError('');
    resetTurnstile();
    syncUrl();
  }, [resetTurnstile, syncUrl]);

  const handleTabChange = useCallback(
    (tab: ResultsTab) => {
      setResultsTab(tab);
      syncUrl(tab);
    },
    [syncUrl],
  );

  const onTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setSecurityError(copy.form.turnstileLoadError);
  }, [copy.form.turnstileLoadError]);

  const showDemoButton = isDev && state !== 'success';
  const showForm = state === 'idle' || state === 'loading' || state === 'not_found';

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
      <div className="workspace-canvas container-tool grading-track-canvas pt-2 md:pt-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">{copy.title}</h1>
        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mb-6">{copy.staticIntro}</p>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </div>

        <div
          ref={gridRef}
          className={`grading-track-grid${state === 'success' ? ' grading-track-grid--results' : ''}`}
        >
          {showForm && (
            <div className="grading-track-form-panel">
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
                compact={state !== 'idle'}
                showDemoButton={showDemoButton}
                initialFocus={initialFocus}
                siteKey={SITE_KEY}
                turnstileToken={turnstileToken}
                onTurnstileToken={setTurnstileToken}
                onTurnstileExpire={() => setTurnstileToken('')}
                onTurnstileError={onTurnstileError}
                resetSignal={resetSignal}
                securityError={securityError}
                requireTurnstile={requireTurnstile}
              />
            </div>
          )}

          {state === 'loading' && (
            <div
              ref={skeletonRef}
              className="grading-track-skeleton min-w-0 min-h-[12rem]"
              aria-live="polite"
              aria-busy="true"
            >
              <div data-skeleton-item className="grading-track-skeleton__row h-5 w-40" />
              <div data-skeleton-item className="grading-track-skeleton__panel h-28" />
              <div data-skeleton-item className="grading-track-skeleton__panel h-44" />
            </div>
          )}

          {(state === 'idle' || state === 'not_found') && <TrackGuidePanel copy={copy.guide} />}

          {state === 'success' && submission && (
            <div ref={resultsRef} className="min-w-0">
              <TrackLookupSummaryBar
                copy={copy.summaryBar}
                phone={phone}
                referenceCode={submission.referenceCode}
                onNewLookup={handleNewLookup}
              />
              <TrackResultsPanel
                submission={submission}
                copy={copy.results}
                servicePlanCopy={copy.servicePlan}
                activeTab={resultsTab}
                onTabChange={handleTabChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
