'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { createBatch, listBatches } from '@/lib/grading/admin-api';
import { batchDetailHref } from '@/lib/grading/admin-routes';
import {
  formatBatchReferenceCode,
  isValidBatchReferenceCode,
  suggestNextBatchRound,
} from '@/lib/grading/batch-reference-code';
import {
  GRADING_SERVICE_PLAN_CODES,
  GRADING_SERVICE_PLAN_LABELS,
  type GradingServicePlan,
} from '@/lib/grading/reference-code';
import { completedStepLabel, stepSelectOptions } from '@/lib/grading/admin-utils';

function parseNumericInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function currentDateParts() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function GradingBatchNewClient() {
  const router = useRouter();
  const initialDate = currentDateParts();
  const [year, setYear] = useState(String(initialDate.year));
  const [month, setMonth] = useState(String(initialDate.month).padStart(2, '0'));
  const [plan, setPlan] = useState<GradingServicePlan>('EXP');
  const [batchRound, setBatchRound] = useState('1');
  const [batchRoundTouched, setBatchRoundTouched] = useState(false);
  const [existingBatchRefs, setExistingBatchRefs] = useState<string[]>([]);
  const [psaSubmissionNumber, setPsaSubmissionNumber] = useState('');
  const [psaOrderNumber, setPsaOrderNumber] = useState('');
  const [completedStepIndex, setCompletedStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void listBatches()
      .then((batches) => setExistingBatchRefs(batches.map((batch) => batch.referenceCode)))
      .catch(() => setExistingBatchRefs([]));
  }, []);

  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);
  const parsedRound = parseInt(batchRound, 10);

  useEffect(() => {
    if (batchRoundTouched) return;
    if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return;
    }
    const next = suggestNextBatchRound(existingBatchRefs, parsedYear, parsedMonth, plan);
    setBatchRound(String(next));
  }, [batchRoundTouched, existingBatchRefs, parsedYear, parsedMonth, plan]);

  const referenceCode = useMemo(() => {
    if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth) || !Number.isFinite(parsedRound)) {
      return '';
    }
    if (parsedYear < 2000 || parsedYear > 2100 || parsedMonth < 1 || parsedMonth > 12 || parsedRound < 1) {
      return '';
    }
    return formatBatchReferenceCode(parsedYear, parsedMonth, plan, parsedRound);
  }, [parsedYear, parsedMonth, parsedRound, plan]);

  const save = async () => {
    setError('');
    if (!isValidBatchReferenceCode(referenceCode)) {
      setError('Valid batch reference required: BAT-YYYY-MM-PLAN-R.');
      return;
    }
    if (psaSubmissionNumber.trim() && parseNumericInput(psaSubmissionNumber) === null) {
      setError('PSA submission number must be digits only.');
      return;
    }
    if (psaOrderNumber.trim() && parseNumericInput(psaOrderNumber) === null) {
      setError('PSA order number must be digits only.');
      return;
    }

    setSaving(true);
    try {
      const batch = await createBatch({
        referenceCode,
        psaSubmissionNumber: parseNumericInput(psaSubmissionNumber),
        psaOrderNumber: parseNumericInput(psaOrderNumber),
        completedStepIndex,
      });
      router.push(batchDetailHref(batch.referenceCode));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/psa-grading" className="text-sm text-accent-link hover:underline">
          ← Dashboard
        </Link>
        <h2 className="text-xl font-semibold mt-2">New PSA batch</h2>
        <p className="text-sm text-text-muted mt-1">
          Create one `grading_submissions` batch row. Customer orders are added from Intake.
        </p>
      </div>

      <section className="border border-border-default bg-surface-panel p-5 space-y-4">
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
            Reference ID
          </label>
          <input
            value={referenceCode}
            readOnly
            placeholder="BAT-YYYY-MM-PLAN-R"
            className="w-full border border-border-default bg-surface-bg/50 px-3 py-2 font-mono min-h-[44px]"
          />
          <p className="text-xs text-text-muted mt-1">
            Format: BAT-{'{YYYY}'}-{'{MM}'}-{'{grade level}'}-{'{batch no.}'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Year
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const value = String(i + 1).padStart(2, '0');
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Grade level
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as GradingServicePlan)}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
            >
              {GRADING_SERVICE_PLAN_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} — {GRADING_SERVICE_PLAN_LABELS[code]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Batch no.
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={batchRound}
              onChange={(e) => {
                setBatchRoundTouched(true);
                setBatchRound(e.target.value.replace(/\D/g, ''));
              }}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              PSA submission number
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={psaSubmissionNumber}
              onChange={(e) => setPsaSubmissionNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="78421"
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              PSA order number
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={psaOrderNumber}
              onChange={(e) => setPsaOrderNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="884120"
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
            Submission progress
          </label>
          <select
            value={completedStepIndex}
            onChange={(e) => setCompletedStepIndex(Number(e.target.value))}
            className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
          >
            {stepSelectOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-muted mt-1">{completedStepLabel(completedStepIndex)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={saving}>
            {saving ? 'Creating...' : 'Create batch'}
          </button>
          <Link href="/admin/psa-grading" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </section>

      {error && <p className="text-accent-danger text-sm">{error}</p>}
    </div>
  );
}
