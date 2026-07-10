'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import type { Translations } from '@/i18n/en';
import ReferenceCodeHighlight from './ReferenceCodeHighlight';
import {
  animateButtonPress,
  animateErrorAlert,
  animateFieldFill,
  animateFormEntrance,
  prefersReducedMotion,
} from './grading-track-motion';

export type TrackLookupFormHandle = {
  getFormElement: () => HTMLFormElement | null;
};

type FormCopy = Translations['psaGradingTrack']['form'];

type Props = {
  copy: FormCopy;
  panelLabel: string;
  phone: string;
  referenceCode: string;
  onPhoneChange: (value: string) => void;
  onReferenceCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFillDemo: () => void;
  state: 'idle' | 'loading' | 'success' | 'not_found';
  /** Narrow sidebar beside results — stack actions, shorter demo label */
  compact?: boolean;
};

const TrackLookupForm = forwardRef<TrackLookupFormHandle, Props>(function TrackLookupForm(
  {
    copy,
    panelLabel,
    phone,
    referenceCode,
    onPhoneChange,
    onReferenceCodeChange,
    onSubmit,
    onFillDemo,
    state,
    compact = false,
  },
  ref,
) {
  const formRef = useRef<HTMLFormElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);
  const refFieldWrapRef = useRef<HTMLDivElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const errorId = 'grading-track-error';
  const mountedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    getFormElement: () => formRef.current,
  }));

  useLayoutEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set(formRef.current, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(formRef.current, { autoAlpha: 0, y: 28, scale: 0.98 });
    const tween = animateFormEntrance(formRef.current);
    return () => {
      tween?.kill();
    };
  }, []);

  useEffect(() => {
    if (state !== 'not_found') return;
    phoneRef.current?.focus({ preventScroll: true });
    const tween = animateErrorAlert(errorAlertRef.current);
    return () => {
      tween?.kill();
    };
  }, [state]);

  const handleFillDemo = (e: React.MouseEvent<HTMLButtonElement>) => {
    animateButtonPress(e.currentTarget);
    onFillDemo();
    requestAnimationFrame(() => {
      const fields = [phoneRef.current, refFieldWrapRef.current].filter(
        (el): el is HTMLInputElement | HTMLDivElement => el != null,
      );
      animateFieldFill(fields as HTMLElement[]);
    });
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state !== 'loading') animateButtonPress(e.currentTarget);
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="grading-track-form border border-border-default bg-surface-panel"
      noValidate
      aria-describedby={state === 'not_found' ? errorId : undefined}
    >
      <div className="grading-track-form__header">
        <p className="grading-track-form__label">{panelLabel}</p>
      </div>

      <div className="grading-track-form__body space-y-5">
      <div>
        <label htmlFor="grading-phone" className="block text-sm font-medium text-text-primary mb-2">
          {copy.phoneLabel}
          <span className="text-accent-danger ml-1" aria-hidden="true">*</span>
        </label>
        <input
          ref={phoneRef}
          id="grading-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          aria-invalid={state === 'not_found'}
          className="w-full min-h-[44px] px-4 py-2.5 bg-surface-raised border border-border-default text-text-primary text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/50 transition-[box-shadow,border-color] duration-150"
          placeholder={copy.phonePlaceholder}
        />
        <p className="mt-2 text-sm text-text-muted">{copy.phoneHelper}</p>
      </div>

      <div ref={refFieldWrapRef}>
        <ReferenceCodeHighlight
          id="grading-ref"
          label={copy.refLabel}
          value={referenceCode}
          placeholder={copy.refPlaceholder}
          helper={copy.refHelper}
          inputRef={refInputRef}
          onChange={onReferenceCodeChange}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 w-full min-w-0">
        <button
          type="submit"
          disabled={state === 'loading'}
          onClick={handleSubmitClick}
          className="btn btn-primary w-full min-h-[44px] inline-flex items-center justify-center gap-2 !whitespace-normal normal-case tracking-normal font-sans text-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'loading' ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          {state === 'loading' ? copy.submitting : copy.submit}
        </button>
        <button
          type="button"
          onClick={handleFillDemo}
          className="btn btn-secondary w-full min-h-[44px] inline-flex items-center justify-center !whitespace-normal normal-case tracking-normal font-sans text-sm text-center"
        >
          {compact ? (
            <>
              <span className="lg:hidden">{copy.fillDemo}</span>
              <span className="hidden lg:inline">{copy.fillDemoShort}</span>
            </>
          ) : (
            copy.fillDemo
          )}
        </button>
      </div>

      {state === 'not_found' && (
        <div
          ref={errorAlertRef}
          id={errorId}
          role="alert"
          className="flex gap-3 p-4 border border-accent-danger/30 bg-accent-danger/5 text-text-primary"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-accent-danger mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium">{copy.notFoundTitle}</p>
            <p className="text-sm text-text-secondary mt-1">{copy.notFoundBody}</p>
          </div>
        </div>
      )}
      </div>
    </form>
  );
});

export default TrackLookupForm;
