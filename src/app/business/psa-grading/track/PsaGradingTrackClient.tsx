'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEMO_LOOKUP } from '@/lib/grading/mock-data';
import { mockLookup, parseDemoVariant } from '@/lib/grading/mock-lookup';
import { lookupGradingSubmission } from '@/lib/grading/grading-api';
import type { GradingRelatedSubmission, GradingSubmission } from '@/lib/grading/types';
import LocalLink from '@/components/LocalLink';
import { useSubHeader } from '@/hooks/useSubHeader';
import TrackLookupForm, { type TrackLookupFormHandle } from './TrackLookupForm';
import TrackResultsPanel, { type ResultsTab } from './TrackResultsPanel';
import { useLanguage } from '@/context/LanguageContext';
import {
  animateFormErrorShake,
  useTrackGridEnter,
  useTrackLoadingState,
  useTrackResultsEnter,
} from './useGradingTrackAnime';
import {
  clearTrackLookupSession,
  readTrackLookupSession,
  writeTrackLookupSession,
} from '@/lib/grading/track-session';

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
  const gridRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const sessionRestoredRef = useRef(false);

  const [phone, setPhone] = useState('');
  const [referenceCode, setReferenceCode] = useState('BAT-');
  const [state, setState] = useState<LookupState>('idle');
  const [submission, setSubmission] = useState<GradingSubmission | null>(null);
  const [relatedSubmissions, setRelatedSubmissions] = useState<GradingRelatedSubmission[]>(
    [],
  );
  const [relatedSwitching, setRelatedSwitching] = useState(false);
  const [pendingAutoLookup, setPendingAutoLookup] = useState(false);
  const [resultsTab, setResultsTab] = useState<ResultsTab>(
    searchParams.get('view') === 'cards' ? 'cards' : 'status',
  );
  const [liveMessage, setLiveMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [resetSignal, setResetSignal] = useState(0);
  const [securityError, setSecurityError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useTrackGridEnter(gridRef);
  useTrackLoadingState(formHandleRef, skeletonRef, state === 'loading');
  useTrackResultsEnter(resultsRef, state === 'success' && submission != null);

  const persistSession = useCallback(
    (
      nextPhone: string,
      nextRef: string,
      nextSubmission: GradingSubmission,
      nextRelated: GradingRelatedSubmission[],
      nextTab: ResultsTab,
    ) => {
      writeTrackLookupSession({
        phone: nextPhone,
        referenceCode: nextRef,
        submission: nextSubmission,
        relatedSubmissions: nextRelated,
        resultsTab: nextTab,
      });
    },
    [],
  );

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

  // Restore last successful lookup (survives F5).
  useEffect(() => {
    if (sessionRestoredRef.current) {
      setSessionReady(true);
      return;
    }
    sessionRestoredRef.current = true;

    if (focusParam === 'lookup') {
      setSessionReady(true);
      return;
    }

    const saved = readTrackLookupSession();
    if (saved) {
      setPhone(saved.phone);
      setReferenceCode(saved.referenceCode);
      setSubmission(saved.submission);
      setRelatedSubmissions(saved.relatedSubmissions);
      const urlView = searchParams.get('view');
      const tab =
        urlView === 'cards' || urlView === 'status' ? urlView : saved.resultsTab;
      setResultsTab(tab);
      setState('success');
      setLiveMessage(`${copy.results.refLabel}: ${saved.submission.referenceCode}`);
      if (tab === 'cards' && urlView !== 'cards') {
        syncUrl(tab);
      }
    }
    setSessionReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount restore only
  }, []);

  // Keep storage in sync whenever results are showing (covers related switch + tab).
  useEffect(() => {
    if (!sessionReady || state !== 'success' || !submission) return;
    persistSession(phone, referenceCode, submission, relatedSubmissions, resultsTab);
  }, [
    sessionReady,
    state,
    submission,
    phone,
    referenceCode,
    relatedSubmissions,
    resultsTab,
    persistSession,
  ]);

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
            setRelatedSwitching(false);
            setPendingAutoLookup(false);
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
      setRelatedSwitching(false);
      setPendingAutoLookup(false);

      if (!result) {
        if (errored) {
          setSecurityError(copy.form.lookupError);
          setState('idle');
          return;
        }
        setRelatedSubmissions([]);
        setState('not_found');
        setLiveMessage(copy.form.notFoundTitle);
        clearTrackLookupSession();
        syncUrl();
        return;
      }
      const related = result.relatedSubmissions ?? [];
      setSubmission(result.submission);
      setReferenceCode(result.submission.referenceCode);
      setRelatedSubmissions(related);
      setState('success');
      setLiveMessage(`${copy.results.refLabel}: ${result.submission.referenceCode}`);
      persistSession(
        lookupPhone,
        result.submission.referenceCode,
        result.submission,
        related,
        resultsTab,
      );
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
      persistSession,
      requireTurnstile,
      resetTurnstile,
      resultsTab,
      syncUrl,
    ],
  );

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
    if (state !== 'not_found') return;
    const formEl = formHandleRef.current?.getFormElement() ?? null;
    return animateFormErrorShake(formEl);
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runLookup(phone, referenceCode, turnstileToken);
  };

  const handleNewLookup = useCallback(() => {
    setState('idle');
    setSubmission(null);
    setRelatedSubmissions([]);
    setRelatedSwitching(false);
    setPendingAutoLookup(false);
    setLiveMessage('');
    setSecurityError('');
    setReferenceCode('BAT-');
    clearTrackLookupSession();
    resetTurnstile();
    syncUrl();
  }, [resetTurnstile, syncUrl]);

  const handleSelectRelated = useCallback(
    (nextRef: string) => {
      if (relatedSwitching || state === 'loading') return;
      setReferenceCode(nextRef);
      setSecurityError('');

      if (!requireTurnstile) {
        setRelatedSwitching(true);
        void runLookup(phone, nextRef, '');
        return;
      }

      if (turnstileToken) {
        setRelatedSwitching(true);
        void runLookup(phone, nextRef, turnstileToken);
        return;
      }

      // Phone + ref already set — show form only for Turnstile, then auto-submit.
      setRelatedSwitching(false);
      setSubmission(null);
      setState('idle');
      setPendingAutoLookup(true);
      resetTurnstile();
    },
    [
      phone,
      relatedSwitching,
      requireTurnstile,
      resetTurnstile,
      runLookup,
      state,
      turnstileToken,
    ],
  );

  useEffect(() => {
    if (!pendingAutoLookup || !turnstileToken) return;
    setPendingAutoLookup(false);
    setRelatedSwitching(true);
    void runLookup(phone, referenceCode, turnstileToken);
  }, [pendingAutoLookup, turnstileToken, phone, referenceCode, runLookup]);

  const handleTabChange = useCallback(
    (tab: ResultsTab) => {
      setResultsTab(tab);
      syncUrl(tab);
      if (submission) {
        persistSession(phone, referenceCode, submission, relatedSubmissions, tab);
      }
    },
    [phone, referenceCode, relatedSubmissions, persistSession, submission, syncUrl],
  );

  const onTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setSecurityError(copy.form.turnstileLoadError);
  }, [copy.form.turnstileLoadError]);

  const showDemoButton = isDev && state !== 'success';
  const showForm = state === 'idle' || state === 'loading' || state === 'not_found';

  useSubHeader({
    contentWidth: 'page',
    content: (
      <div className="flex min-w-0 items-center justify-between gap-3">
        <LocalLink
          href="/business/psa-grading"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px] min-w-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{copy.backToHub}</span>
        </LocalLink>
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
      </div>
    ),
  });

  return (
    <div className="min-h-dvh bg-surface-bg grading-track-workspace collection-workspace page-blueprint overflow-x-clip">
      <div className="workspace-canvas container-tool grading-track-canvas pb-10 md:pb-14">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveMessage}
        </div>

        {!sessionReady ? (
          <div
            className="grading-track-skeleton min-w-0 min-h-[12rem]"
            aria-busy="true"
            aria-label={copy.skeletonLabel}
          >
            <div data-skeleton-item className="grading-track-skeleton__row h-5 w-40" />
            <div data-skeleton-item className="grading-track-skeleton__panel h-28" />
            <div data-skeleton-item className="grading-track-skeleton__panel h-44" />
          </div>
        ) : (
          <div
            ref={gridRef}
            className={`grading-track-grid${state === 'success' ? ' grading-track-grid--results' : ' grading-track-grid--idle'}`}
          >
            {showForm && (
              <div className="grading-track-form-panel">
                <TrackLookupForm
                  ref={formHandleRef}
                  copy={copy.form}
                  panelLabel={copy.formPanelLabel}
                  panelPart={copy.formPanelPart}
                  formIntro={copy.formIntro}
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
                aria-label={copy.skeletonLabel}
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
                  summaryCopy={copy.summaryBar}
                  servicePlanCopy={copy.servicePlan}
                  resultsPanelPart={copy.resultsPanelPart}
                  phone={phone}
                  onNewLookup={handleNewLookup}
                  relatedSubmissions={relatedSubmissions}
                  onSelectReference={handleSelectRelated}
                  relatedSwitchDisabled={relatedSwitching}
                  activeTab={resultsTab}
                  onTabChange={handleTabChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
