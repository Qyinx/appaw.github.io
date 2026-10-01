'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { SERVICE_PLAN_HUE } from '@/components/grading/ServicePlanBadge';
import type { AdminBatch, AdminCustomerOrder } from '@/lib/grading/admin-types';
import { batchDetailHref } from '@/lib/grading/admin-routes';
import {
  FULL_STEP_COUNT,
  groupBatchesByPlan,
  pickupProgressForBatch,
  railStepFullLabels,
  RAIL_STEP_SHORT_LABELS,
} from '@/lib/grading/admin-utils';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import { parseBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import ServicePlanBadge from './ServicePlanBadge';

type Props = {
  batches: AdminBatch[];
  orders: AdminCustomerOrder[];
  loading?: boolean;
};

function shortBatchRef(referenceCode: string): string {
  const parsed = parseBatchReferenceCode(referenceCode);
  if (!parsed) return referenceCode;
  const yy = String(parsed.year).slice(-2);
  return `${yy}-${String(parsed.month).padStart(2, '0')}-R${parsed.round}`;
}

function BatchChip({
  batch,
  hue,
  pickup,
}: {
  batch: AdminBatch;
  hue: string;
  pickup: { picked: number; total: number };
}) {
  const showPickup = batch.completedStepIndex >= 9 || pickup.total > 0;
  return (
    <Link
      href={batchDetailHref(batch.referenceCode)}
      title={`${batch.referenceCode} · ${batch.cardCount} cards · ${batch.orderCount} orders`}
      className="block border px-1.5 py-1 text-left hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-brand"
      style={{
        color: hue,
        borderColor: `color-mix(in srgb, ${hue} 45%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${hue} 12%, transparent)`,
      }}
    >
      <span className="font-mono text-[0.65rem] leading-tight block truncate">{shortBatchRef(batch.referenceCode)}</span>
      <span className="font-mono text-[0.6rem] tabular-nums text-text-secondary block">
        {batch.cardCount}c
        {showPickup && pickup.total > 0 ? ` · ${pickup.picked}/${pickup.total}` : ''}
      </span>
    </Link>
  );
}

export default function PlanProgressRails({ batches, orders, loading }: Props) {
  const groups = useMemo(() => groupBatchesByPlan(batches), [batches]);
  const fullLabels = useMemo(() => railStepFullLabels(), []);
  const stepIndexes = useMemo(
    () => Array.from({ length: FULL_STEP_COUNT }, (_, i) => i),
    [],
  );

  if (loading && batches.length === 0) {
    return <p className="text-text-muted text-sm">Loading plan rails…</p>;
  }

  if (!loading && batches.length === 0) {
    return (
      <section className="panel p-6 text-center text-text-muted text-sm">
        No batches yet. Create a batch or intake to populate plan rails.
      </section>
    );
  }

  return (
    <section className="panel p-0 overflow-hidden" aria-label="Plan progress rails">
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div
            className="grid border-b border-border-default bg-surface-raised/60"
            style={{ gridTemplateColumns: `7.5rem repeat(${FULL_STEP_COUNT}, minmax(4.5rem, 1fr))` }}
          >
            <div className="sticky left-0 z-[1] bg-surface-raised px-3 py-2 text-[0.65rem] uppercase tracking-wide text-text-secondary border-r border-border-default">
              Plan
            </div>
            {stepIndexes.map((step) => (
              <div
                key={step}
                className="px-1 py-2 text-center border-r border-border-default/60 last:border-r-0"
                title={fullLabels[step]}
              >
                <span className="font-mono text-[0.6rem] text-text-muted tabular-nums">{step}</span>
                <span className="block text-[0.65rem] text-text-secondary leading-tight">
                  {RAIL_STEP_SHORT_LABELS[step]}
                </span>
              </div>
            ))}
          </div>

          {groups.map(({ plan, batches: planBatches }) => {
            const hue = SERVICE_PLAN_HUE[plan];
            const planLabel =
              plan === '—' ? 'Unknown' : GRADING_SERVICE_PLAN_LABELS[plan];
            const byStep = stepIndexes.map((step) =>
              planBatches.filter((b) => b.completedStepIndex === step),
            );
            const totalCards = planBatches.reduce((sum, b) => sum + b.cardCount, 0);

            return (
              <div
                key={plan}
                className="grid border-b border-border-default/70 last:border-b-0"
                style={{
                  gridTemplateColumns: `7.5rem repeat(${FULL_STEP_COUNT}, minmax(4.5rem, 1fr))`,
                  borderLeft: `3px solid ${hue}`,
                }}
              >
                <div className="sticky left-0 z-[1] bg-surface-panel px-2 py-2 border-r border-border-default space-y-1">
                  <ServicePlanBadge plan={plan} />
                  <p className="text-[0.65rem] text-text-muted leading-tight truncate" title={planLabel}>
                    {planBatches.length} bat · {totalCards}c
                  </p>
                </div>
                {byStep.map((stepBatches, step) => (
                  <div
                    key={step}
                    className={`px-1 py-1.5 border-r border-border-default/40 last:border-r-0 min-h-[3.5rem] ${
                      stepBatches.length > 0 ? 'bg-surface-raised/40' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                      {stepBatches.map((batch) => (
                        <BatchChip
                          key={batch.id}
                          batch={batch}
                          hue={hue}
                          pickup={pickupProgressForBatch(batch.referenceCode, orders)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
