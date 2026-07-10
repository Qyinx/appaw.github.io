'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminCardsTable from '../../components/AdminCardsTable';
import { getBatch, updateBatch, updateItem } from '@/lib/grading/admin-api';
import {
  anyItemFieldsDirty,
  cloneAdminItems,
  itemFieldsDirty,
  itemUpdatePayload,
} from '@/lib/grading/admin-draft-utils';
import type { AdminBatchDetail, AdminItem } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { completedStepLabel, stepSelectOptions } from '@/lib/grading/admin-utils';

type Props = {
  referenceCode: string;
};

function parseNumericInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export default function GradingBatchDetailClient({ referenceCode }: Props) {
  const [detail, setDetail] = useState<AdminBatchDetail | null>(null);
  const [draftItems, setDraftItems] = useState<AdminItem[]>([]);
  const [psaSubmissionNumber, setPsaSubmissionNumber] = useState('');
  const [psaOrderNumber, setPsaOrderNumber] = useState('');
  const [completedStepIndex, setCompletedStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const batchDetail = await getBatch(referenceCode);
      if (!batchDetail) {
        setError('Batch not found.');
        setDetail(null);
        setDraftItems([]);
        return;
      }
      setDetail(batchDetail);
      setDraftItems(cloneAdminItems(batchDetail.items));
      setPsaSubmissionNumber(String(batchDetail.batch.psaSubmissionNumber ?? ''));
      setPsaOrderNumber(String(batchDetail.batch.psaOrderNumber ?? ''));
      setCompletedStepIndex(batchDetail.batch.completedStepIndex);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [referenceCode]);

  useEffect(() => {
    void load();
  }, [load]);

  const batchDirty = useMemo(() => {
    if (!detail) return false;
    return (
      parseNumericInput(psaSubmissionNumber) !== detail.batch.psaSubmissionNumber ||
      parseNumericInput(psaOrderNumber) !== detail.batch.psaOrderNumber ||
      completedStepIndex !== detail.batch.completedStepIndex
    );
  }, [detail, psaSubmissionNumber, psaOrderNumber, completedStepIndex]);

  const itemsDirty = useMemo(
    () => (detail ? anyItemFieldsDirty(detail.items, draftItems) : false),
    [detail, draftItems],
  );

  const hasUnsavedChanges = batchDirty || itemsDirty;

  const handleDraftItemUpdate = (itemId: string, patch: Partial<AdminItem>) => {
    setDraftItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
    setMessage('');
  };

  const discardChanges = () => {
    if (!detail) return;
    setDraftItems(cloneAdminItems(detail.items));
    setPsaSubmissionNumber(String(detail.batch.psaSubmissionNumber ?? ''));
    setPsaOrderNumber(String(detail.batch.psaOrderNumber ?? ''));
    setCompletedStepIndex(detail.batch.completedStepIndex);
    setError('');
    setMessage('');
  };

  const saveAllChanges = async () => {
    if (!detail || !hasUnsavedChanges) return;
    if (psaSubmissionNumber.trim() && parseNumericInput(psaSubmissionNumber) === null) {
      setError('PSA submission number must be digits only.');
      return;
    }
    if (psaOrderNumber.trim() && parseNumericInput(psaOrderNumber) === null) {
      setError('PSA order number must be digits only.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      let nextDetail = detail;

      if (batchDirty) {
        nextDetail = await updateBatch(detail.batch.referenceCode, {
          psaSubmissionNumber: parseNumericInput(psaSubmissionNumber),
          psaOrderNumber: parseNumericInput(psaOrderNumber),
          completedStepIndex,
        });
      }

      const savedById = new Map(nextDetail.items.map((item) => [item.id, item]));
      const changedItems = draftItems.filter((draft) => {
        const saved = savedById.get(draft.id);
        return saved ? itemFieldsDirty(saved, draft) : false;
      });

      const updatedItems = [...nextDetail.items];
      for (const draft of changedItems) {
        const updated = await updateItem(draft.id, itemUpdatePayload(draft));
        const index = updatedItems.findIndex((item) => item.id === draft.id);
        if (index >= 0) updatedItems[index] = updated;
      }

      const merged: AdminBatchDetail = { ...nextDetail, items: updatedItems };
      setDetail(merged);
      setDraftItems(cloneAdminItems(updatedItems));
      setPsaSubmissionNumber(String(merged.batch.psaSubmissionNumber ?? ''));
      setPsaOrderNumber(String(merged.batch.psaOrderNumber ?? ''));
      setCompletedStepIndex(merged.batch.completedStepIndex);
      setMessage('Changes saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const servicePlans = detail ? [parseServicePlanLabel(detail.batch.referenceCode)] : [];

  if (loading) return <p className="text-text-muted text-sm">Loading batch...</p>;
  if (!detail) {
    return (
      <div className="space-y-3">
        <p className="text-accent-danger">{error || 'Batch not found.'}</p>
        <Link href="/admin/psa-grading" className="text-accent-link text-sm hover:underline">
          ← Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/psa-grading" className="text-sm text-accent-link hover:underline">
          ← Dashboard
        </Link>
        <h2 className="text-xl font-semibold mt-2 font-mono">{detail.batch.referenceCode}</h2>
        <p className="text-sm text-text-muted mt-1">PSA batch — manage progress, orders, and cards.</p>
      </div>

      <section className="border border-border-default bg-surface-panel p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Batch details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Reference ID
            </label>
            <input
              value={detail.batch.referenceCode}
              readOnly
              className="w-full border border-border-default bg-surface-bg/50 px-3 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              PSA submission number
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={psaSubmissionNumber}
              onChange={(e) => setPsaSubmissionNumber(e.target.value.replace(/\D/g, ''))}
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
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
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
          <div className="md:col-span-2">
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">Service levels</p>
            <div className="flex flex-wrap gap-2">
              {servicePlans.map((plan) => (
                <span
                  key={plan}
                  className="text-xs font-medium px-2 py-1 border border-border-default bg-surface-bg"
                >
                  {plan}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void saveAllChanges()}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={discardChanges}
            disabled={saving || !hasUnsavedChanges}
          >
            Discard
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => void load()} disabled={saving}>
            Refresh
          </button>
          <Link href="/admin/psa-grading/intake" className="btn btn-secondary">
            Add customer order
          </Link>
        </div>
        {hasUnsavedChanges && (
          <p className="text-xs text-accent-warn">Unsaved changes — click Save changes when ready.</p>
        )}
      </section>

      <section className="border border-border-default bg-surface-panel p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Cards in batch ({draftItems.length})
        </h3>
        <AdminCardsTable
          items={draftItems}
          editable
          showFooter
          onUpdateItem={handleDraftItemUpdate}
        />
      </section>

      {message && <p className="text-accent-success text-sm">{message}</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}
    </div>
  );
}
