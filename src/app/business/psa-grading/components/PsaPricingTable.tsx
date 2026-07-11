'use client';

import React from 'react';
import { formatHkd } from '@/lib/grading/admin-format';
import {
  PSA_PRICING_ROWS,
  psaQuoteWhatsAppUrl,
} from '@/lib/grading/psa-pricing';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import type { Translations } from '@/i18n/en';

type PricingCopy = Translations['psaGradingPage']['pricing'];

type Props = {
  copy: PricingCopy;
};

export default function PsaPricingTable({ copy }: Props) {
  return (
    <div className="space-y-3">
      <div className="panel overflow-x-auto" role="region" tabIndex={0} aria-label={copy.tableLabel}>
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th scope="col" className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted w-[22%]">
                {copy.colService}
              </th>
              <th scope="col" className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.colFee}
              </th>
              <th scope="col" className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.colMaxValue}
              </th>
              <th scope="col" className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.colTurnaround}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {PSA_PRICING_ROWS.map((row) => {
              const label = GRADING_SERVICE_PLAN_LABELS[row.plan];
              return (
                <tr key={row.plan} className="align-top">
                  <th scope="row" className="px-5 py-3 text-left font-medium text-text-primary">
                    {label}
                  </th>
                  <td className="px-5 py-3">
                    {row.feeHkd != null ? (
                      <span className="font-mono font-tabular text-text-primary">{formatHkd(row.feeHkd)}</span>
                    ) : (
                      <a
                        href={psaQuoteWhatsAppUrl(label)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-secondary hover:underline min-h-[44px] inline-flex items-center"
                      >
                        {copy.quoteLink}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono font-tabular text-text-secondary">
                    USD {row.maxDeclaredValueUsd.toLocaleString('en-US')}
                  </td>
                  <td className="px-5 py-3 font-tabular text-text-secondary">
                    {copy.days.replace('{days}', row.turnaroundDays)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">
        <span className="font-medium text-text-secondary">{copy.colTurnaround}: </span>
        {copy.turnaroundFootnote}
      </p>
      <p className="text-xs text-text-muted leading-relaxed max-w-3xl">{copy.footnote1}</p>
      <p className="text-xs text-text-muted leading-relaxed max-w-3xl">{copy.footnote2}</p>
    </div>
  );
}
