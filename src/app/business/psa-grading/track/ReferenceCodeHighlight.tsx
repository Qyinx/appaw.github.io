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

/** Reference code input — sigil ticket field for lookup form */
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

  const handleChange = (next: string) => {
    onChange(ensureBatReferencePrefix(next));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    if (el.value.startsWith(BAT_REFERENCE_PREFIX) && start < BAT_REFERENCE_PREFIX.length) {
      requestAnimationFrame(() => {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      });
    }
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
        <div className="relative flex items-center gap-3 px-4 py-2.5 min-h-[44px]">
          <Hash
            className="w-4 h-4 shrink-0 text-accent-brand"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={id}
            type="text"
            autoComplete="off"
            required
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            pattern={`BAT-\\d{4}-\\d{1,2}-(${GRADING_SERVICE_PLAN_SUFFIX_PATTERN})-\\d+`}
            title={placeholder}
            className="w-full min-w-0 bg-transparent border-0 p-0 text-text-primary font-mono text-base md:text-lg uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-0 placeholder:text-text-muted/70 placeholder:tracking-normal placeholder:normal-case"
            placeholder={placeholder}
            spellCheck={false}
          />
        </div>
      </div>
      {helper.trim() ? (
        <p className="mt-2 text-sm text-text-muted psa-grading-track-aeo-answer">{helper}</p>
      ) : null}
    </div>
  );
}
