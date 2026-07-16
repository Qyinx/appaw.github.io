'use client';

import React from 'react';
import { Search } from 'lucide-react';
import type { Translations } from '@/i18n/en';

type SummaryCopy = Translations['psaGradingTrack']['summaryBar'];

type Props = {
  copy: SummaryCopy;
  phone: string;
  referenceCode: string;
  onNewLookup: () => void;
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone || '····';
  const last4 = digits.slice(-4);
  return `•••• ${last4}`;
}

export default function TrackLookupSummaryBar({
  copy,
  phone,
  referenceCode,
  onNewLookup,
}: Props) {
  return (
    <div className="grading-track-summary border border-border-default bg-surface-panel mb-4">
      <div className="grading-track-summary__row">
        <dl className="grading-track-summary__specs min-w-0">
          <div className="grading-track-summary__spec">
            <dt>{copy.phoneLabel}</dt>
            <dd className="font-mono tabular-nums">{maskPhone(phone)}</dd>
          </div>
          <div className="grading-track-summary__spec">
            <dt>{copy.refLabel}</dt>
            <dd className="font-mono">{referenceCode}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onNewLookup}
          className="btn btn-secondary min-h-[44px] inline-flex items-center justify-center gap-2 shrink-0 px-4 text-sm"
        >
          <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
          {copy.newLookup}
        </button>
      </div>
    </div>
  );
}
