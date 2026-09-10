'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { formatHkd } from '@/lib/grading/admin-format';
import { planPricingAccent } from '@/lib/grading/plan-accent';
import { PSA_PRICING_ROWS, type PsaPricingRow } from '@/lib/grading/psa-pricing';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import type { Translations } from '@/i18n/en';

type PricingCopy = Translations['psaGradingPage']['pricing'];

type Props = {
  copy: PricingCopy;
};

function PsaPricingFeeCell({
  row,
  copy,
}: {
  row: PsaPricingRow;
  copy: PricingCopy;
}) {
  if (row.feeHkd == null) {
    return <span className="text-text-muted">—</span>;
  }

  if (row.feeTiers && row.feeTiers.length > 0) {
    return (
      <div className="flex flex-col gap-0.5">
        {row.feeTiers.map((tier) => {
          const price = formatHkd(tier.feeHkd);
          const label =
            tier.maxCards == null
              ? copy.feeTier5plus.replace('{price}', price)
              : copy.feeTier1to4.replace('{price}', price);
          return (
            <span
              key={`${tier.minCards}-${tier.maxCards ?? 'plus'}`}
              className="font-mono font-tabular text-text-primary text-sm"
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  }

  const listFeeHkd = row.feeHkd;
  const discountedFeeHkd = row.discountedFeeHkd;
  const showDiscount =
    discountedFeeHkd != null && discountedFeeHkd > 0 && discountedFeeHkd < listFeeHkd;

  if (!showDiscount) {
    return <span className="font-mono font-tabular text-text-primary">{formatHkd(listFeeHkd)}</span>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono font-tabular text-text-primary font-medium">{formatHkd(discountedFeeHkd)}</span>
      <span
        className="font-mono font-tabular text-xs text-text-muted line-through"
        aria-label={copy.listPriceLabel.replace('{price}', formatHkd(listFeeHkd))}
      >
        {formatHkd(listFeeHkd)}
      </span>
    </div>
  );
}

export default function PsaPricingTable({ copy }: Props) {
  return (
    <div className="space-y-3">
      <div className="panel overflow-x-auto" role="region" tabIndex={0} aria-label={copy.tableLabel}>
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th scope="col" className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted w-[28%]">
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
              const accent = planPricingAccent(row.plan);
              return (
                <tr
                  key={row.plan}
                  className={`align-top ${accent.row} ${accent.edge}`}
                  data-plan={row.plan}
                >
                  <th scope="row" className="px-5 py-3 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] border px-1.5 py-0.5 ${accent.chip}`}
                      >
                        {row.plan}
                      </span>
                      <span className="font-medium text-text-primary">
                        {GRADING_SERVICE_PLAN_LABELS[row.plan]}
                      </span>
                    </div>
                  </th>
                  <td className="px-5 py-3">
                    <PsaPricingFeeCell row={row} copy={copy} />
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

      <div className="panel-raised p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-text-secondary">{copy.bookFooter}</p>
        <a
          href={PSA_SUBMISSION_APPOINTMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary shrink-0 min-h-[44px]"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          <span>{copy.ctaBook}</span>
        </a>
      </div>
    </div>
  );
}
