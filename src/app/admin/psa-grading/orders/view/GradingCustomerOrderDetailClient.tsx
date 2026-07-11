'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminCardsTable from '../../components/AdminCardsTable';
import BatchReferenceLink from '../../components/BatchReferenceLink';
import { getCustomerOrder, reorderCustomerOrderItems, updateItem } from '@/lib/grading/admin-api';
import {
  anyItemFieldsDirty,
  cloneAdminItems,
  itemFieldsDirty,
  itemOrderDirty,
  itemUpdatePayload,
} from '@/lib/grading/admin-draft-utils';
import type { AdminCustomerOrderDetail, AdminItem } from '@/lib/grading/admin-types';
import { parseServicePlanLabel, summarizePayment } from '@/lib/grading/admin-types';
import { formatHkd } from '@/lib/grading/admin-format';

type Props = {
  orderId: number;
};

export default function GradingCustomerOrderDetailClient({ orderId }: Props) {
  const [detail, setDetail] = useState<AdminCustomerOrderDetail | null>(null);
  const [draftItems, setDraftItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await getCustomerOrder(orderId);
      if (!result) {
        setError('Customer order not found.');
        setDetail(null);
        setDraftItems([]);
        return;
      }
      setDetail(result);
      setDraftItems(cloneAdminItems(result.items));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const itemsDirty = useMemo(
    () => (detail ? anyItemFieldsDirty(detail.items, draftItems) : false),
    [detail, draftItems],
  );

  const orderDirty = useMemo(
    () => (detail ? itemOrderDirty(detail.items, draftItems) : false),
    [detail, draftItems],
  );

  const hasUnsavedChanges = itemsDirty || orderDirty;

  const handleDraftItemUpdate = (itemId: string, patch: Partial<AdminItem>) => {
    setDraftItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
    setMessage('');
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = draftItems.findIndex((item) => item.id === itemId);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= draftItems.length) return;

    const reordered = [...draftItems];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];
    setDraftItems(
      reordered.map((item, index) => ({ ...item, submissionOrder: index + 1 })),
    );
    setMessage('');
  };

  const discardChanges = () => {
    if (!detail) return;
    setDraftItems(cloneAdminItems(detail.items));
    setError('');
    setMessage('');
  };

  const saveAllChanges = async () => {
    if (!detail || !hasUnsavedChanges) return;

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const savedById = new Map(detail.items.map((item) => [item.id, item]));
      const changedItems = draftItems.filter((draft) => {
        const saved = savedById.get(draft.id);
        return saved ? itemFieldsDirty(saved, draft) : false;
      });

      let nextItems = [...detail.items];
      for (const draft of changedItems) {
        const updated = await updateItem(draft.id, itemUpdatePayload(draft));
        const index = nextItems.findIndex((item) => item.id === draft.id);
        if (index >= 0) nextItems[index] = updated;
      }

      if (orderDirty) {
        nextItems = await reorderCustomerOrderItems(
          orderId,
          draftItems.map((item) => item.id),
        );
      }

      setDetail({ ...detail, items: nextItems });
      setDraftItems(cloneAdminItems(nextItems));
      setMessage('Changes saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-text-muted text-sm">Loading customer order…</p>;
  if (!detail) {
    return (
      <div className="space-y-3">
        <p className="text-accent-danger">{error || 'Customer order not found.'}</p>
        <Link href="/admin/psa-grading" className="text-accent-link text-sm hover:underline">
          ← Dashboard
        </Link>
      </div>
    );
  }

  const { customerOrder } = detail;
  const paymentSummary = summarizePayment(draftItems);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/psa-grading" className="text-sm text-accent-link hover:underline">
          ← Dashboard
        </Link>
        <h2 className="text-xl font-semibold mt-2 font-mono">{customerOrder.id}</h2>
        <p className="text-sm text-text-muted mt-1">Customer order — cards and payment details.</p>
      </div>

      <section className="panel p-5 space-y-4">
        <h3 className="section-label">Order details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Customer Order ID</p>
            <p className="font-mono text-sm">{customerOrder.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Reference ID in PSA Batches</p>
            <BatchReferenceLink referenceCode={customerOrder.batchReferenceCode} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Service level</p>
            <p className="text-sm">{parseServicePlanLabel(customerOrder.batchReferenceCode)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Customer</p>
            <p className="text-sm">{customerOrder.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Phone</p>
            <p className="font-mono text-sm">{customerOrder.phoneNumber}</p>
          </div>
        </div>
      </section>

      <section className="panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="section-label">
              Cards in order ({draftItems.length})
            </h3>
            <p className="text-xs text-text-muted mt-1">Use ↑ ↓ to reorder cards. Save when finished editing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void saveAllChanges()}
              disabled={saving || !hasUnsavedChanges}
            >
              {saving ? 'Saving…' : 'Save changes'}
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
          </div>
        </div>
        {hasUnsavedChanges && (
          <p className="text-xs text-accent-warn">Unsaved changes — click Save changes when ready.</p>
        )}

        <div className="panel-raised p-4 max-w-md">
          <div className="spec-row px-0">
            <span className="spec-row__label">Total</span>
            <span className="spec-row__value font-tabular">{formatHkd(paymentSummary.totalCostSum)}</span>
          </div>
          <div className="spec-row px-0">
            <span className="spec-row__label">Received</span>
            <span className="spec-row__value font-tabular">{formatHkd(paymentSummary.receivedCostSum)}</span>
          </div>
          <div className="spec-row px-0">
            <span className="spec-row__label">Paid</span>
            <span className="spec-row__value font-tabular">
              {paymentSummary.paidCount}/{paymentSummary.totalCount}
            </span>
          </div>
        </div>

        <AdminCardsTable
          items={draftItems}
          editable
          showFooter
          showOrderColumns={false}
          reorderable
          reordering={saving}
          onMoveItem={handleMoveItem}
          onUpdateItem={handleDraftItemUpdate}
        />
      </section>

      {message && <p className="text-accent-success text-sm">{message}</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}
    </div>
  );
}
