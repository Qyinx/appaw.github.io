'use client';

import React, { useRef } from 'react';
import { Hash } from 'lucide-react';
import { GRADING_SERVICE_PLAN_SUFFIX_PATTERN } from '@/lib/grading/reference-code';
import { animateSigilFocus } from './useGradingTrackAnime';

export const BAT_REFERENCE_PREFIX = 'BAT-';

/** Keep BAT- prefix while typing/pasting; never leave the field empty of the prefix. */
export function ensureBatReferencePrefix(raw: string): string {
  const upper = raw.toUpperCase().replace(/\s+/g, '');
  if (!upper || upper === 'B' || upper === 'BA' || upper === 'BAT') {
    return BAT_REFERENCE_PREFIX;
  }
  if (upper.startsWith(BAT_REFERENCE_PREFIX)) {
    return upper;
  }
  if (upper.startsWith('BAT')) {
    return `${BAT_REFERENCE_PREFIX}${upper.slice(3).replace(/^-+/, '')}`;
  }
  return `${BAT_REFERENCE_PREFIX}${upper.replace(/^-+/, '')}`;
}

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  helper: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
};

/**
 * Single reference field — BAT- locked as prefix chrome.
 * Full paste of BAT-YYYY-MM-PLAN-N (or body only) works in one shot.
 */
export default function ReferenceCodeHighlight({
  id,
  label,
  value,
  placeholder,
  helper,
  inputRef,
  onChange,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const focusCleanupRef = useRef<(() => void) | null>(null);

  const bodyValue = value.startsWith(BAT_REFERENCE_PREFIX)
    ? value.slice(BAT_REFERENCE_PREFIX.length)
    : value.replace(/^BAT-?/i, '');

  const handleChange = (nextBody: string) => {
    onChange(ensureBatReferencePrefix(`${BAT_REFERENCE_PREFIX}${nextBody}`));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text.trim()) return;
    e.preventDefault();
    onChange(ensureBatReferencePrefix(text));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select body so Ctrl/Cmd+V replaces in one paste.
    requestAnimationFrame(() => {
      e.target.select();
    });
    focusCleanupRef.current?.();
    focusCleanupRef.current = animateSigilFocus(wrapRef.current);
  };

  const handleBlur = () => {
    focusCleanupRef.current?.();
    focusCleanupRef.current = null;
    if (wrapRef.current) wrapRef.current.style.boxShadow = '';
  };

  return (
    <div ref={wrapRef}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-2">
        {label}
        <span className="text-accent-danger ml-1" aria-hidden="true">
          *
        </span>
      </label>
      <div className="grading-track-sigil-field group relative border border-border-default transition-[border-color,box-shadow] duration-150 focus-within:border-accent-brand focus-within:shadow-[inset_3px_0_0_0_var(--accent-brand)]">
        <div className="relative flex items-center gap-2 px-4 py-2.5 min-h-[44px]">
          <Hash className="w-4 h-4 shrink-0 text-accent-brand" aria-hidden="true" />
          <span
            className="font-mono text-base md:text-lg text-accent-brand tracking-[0.12em] shrink-0 select-none"
            aria-hidden="true"
          >
            BAT-
          </span>
          <input
            ref={inputRef}
            id={id}
            type="text"
            autoComplete="off"
            required
            value={bodyValue}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            pattern={`\\d{4}-\\d{1,2}-(${GRADING_SERVICE_PLAN_SUFFIX_PATTERN})-\\d+`}
            title={placeholder}
            className="w-full min-w-0 bg-transparent border-0 p-0 text-text-primary font-mono text-base md:text-lg uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-0 placeholder:text-text-muted/45 placeholder:tracking-[0.12em]"
            placeholder="XXXX-XX-XXX-N"
            spellCheck={false}
            aria-describedby={helper.trim() ? `${id}-helper` : undefined}
          />
        </div>
      </div>
      {helper.trim() ? (
        <p id={`${id}-helper`} className="mt-2 text-sm text-text-muted psa-grading-track-aeo-answer">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
