'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminCardsTable from '../../components/AdminCardsTable';
import BatchReferenceLink from '../../components/BatchReferenceLink';
import {
  createCustomerOrderItem,
  deleteCustomerOrderItem,
  getCustomerOrder,
  reorderCustomerOrderItems,
  updateItem,
} from '@/lib/grading/admin-api';
import {
  anyItemFieldsDirty,
  cloneAdminItems,
  createDraftItem,
  createOrderItemPayload,
  isDraftItemId,
  itemFieldsDirty,
  itemOrderDirty,
  itemUpdatePayload,
} from '@/lib/grading/admin-draft-utils';
import type { AdminCustomerOrderDetail, AdminItem } from '@/lib/grading/admin-types';
import { BATCH_CARD_EDIT_STEP, parseServicePlanLabel, summarizePayment } from '@/lib/grading/admin-types';
import { completedStepLabel } from '@/lib/grading/admin-utils';
import { formatHkd } from '@/lib/grading/admin-format';

type Props = {
  orderId: number;
};

export default function GradingCustomerOrderDetailClient({ orderId }: Props) {
  const [detail, setDetail] = useState<AdminCustomerOrderDetail | null>(null);
  const [draftItems, setDraftItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async (force = false) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await getCustomerOrder(orderId, force);
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

  const cardsEditable = detail?.batchCompletedStepIndex === BATCH_CARD_EDIT_STEP;

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
    if (!cardsEditable) return;
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

  const handleAddCard = () => {
    if (!detail || !cardsEditable) return;
    setDraftItems((prev) => [
      ...prev,
      createDraftItem(detail.customerOrder, prev.length + 1),
    ]);
    setMessage('');
  };

  const handleRemoveCard = (itemId: string) => {
    if (!cardsEditable || draftItems.length <= 1) return;
    setDraftItems((prev) =>
      prev
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, submissionOrder: index + 1 })),
    );
    setMessage('');
  };

  const discardChanges = () => {
    if (!detail) return;
    setDraftItems(cloneAdminItems(detail.items));
    setError('');
    setMessage('');
  };

  const exportInvoice = async () => {
    if (!detail || hasUnsavedChanges || saving || exporting) return;
    setExporting(true);
    setError('');
    setMessage('');
    try {
      const { exportCustomerOrderInvoicePdf } = await import(
        '@/lib/grading/customer-order-invoice-pdf'
      );
      const invoice = await exportCustomerOrderInvoicePdf(detail);
      setMessage(`Invoice downloaded: ${invoice.filename}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setExporting(false);
    }
  };

  const saveAllChanges = async () => {
    if (!detail || !hasUnsavedChanges) return;

    if (cardsEditable) {
      if (draftItems.length === 0) {
        setError('Order must have at least one card.');
        return;
      }
      if (draftItems.some((item) => isDraftItemId(item.id) && !item.cardName.trim())) {
        setError('Each new card needs a name.');
        return;
      }
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const idMap = new Map<string, string>();

      if (cardsEditable) {
        const draftIdSet = new Set(draftItems.map((item) => item.id));
        const toRemove = detail.items.filter((item) => !draftIdSet.has(item.id));
        for (const item of toRemove) {
          await deleteCustomerOrderItem(item.id);
        }

        for (const draft of draftItems.filter((item) => isDraftItemId(item.id))) {
          const created = await createCustomerOrderItem(orderId, createOrderItemPayload(draft));
          idMap.set(draft.id, created.id);
        }

        const resolvedIds = draftItems.map((draft) => idMap.get(draft.id) ?? draft.id);

        for (let i = 0; i < draftItems.length; i += 1) {
          const draft = draftItems[i];
          const id = resolvedIds[i];
          const original = detail.items.find((item) => item.id === id);
          if (!original || itemFieldsDirty(original, draft)) {
            await updateItem(id, itemUpdatePayload(draft, original));
          }
        }

        const needsReorder =
          toRemove.length > 0 ||
          idMap.size > 0 ||
          itemOrderDirty(detail.items, draftItems);
        if (needsReorder) {
          await reorderCustomerOrderItems(orderId, resolvedIds);
        }
      } else {
        const savedById = new Map(detail.items.map((item) => [item.id, item]));
        const changedItems = draftItems.filter((draft) => {
          const saved = savedById.get(draft.id);
          return saved ? itemFieldsDirty(saved, draft) : false;
        });

        for (const draft of changedItems) {
          const saved = savedById.get(draft.id);
          await updateItem(draft.id, itemUpdatePayload(draft, saved));
        }
      }

      await load(true);
      setMessage('Changes saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      await load(true);
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
        <h2 className="text-xl font-semibold mt-2 font-mono tabular-nums">
          {customerOrder.batchReferenceCode} - {customerOrder.id}
        </h2>
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
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Batch progress</p>
            <p className="text-sm">{completedStepLabel(detail.batchCompletedStepIndex)}</p>
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
            <p className="text-xs text-text-muted mt-1">
              {cardsEditable
                ? 'Add, remove, rename, and reorder cards while batch is at step 0. Save when finished.'
                : 'Batch has moved past step 0 — payment fields only. Add/remove cards locked.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cardsEditable && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddCard}
                disabled={saving || exporting}
              >
                Add card
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void saveAllChanges()}
              disabled={saving || exporting || !hasUnsavedChanges}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={discardChanges}
              disabled={saving || exporting || !hasUnsavedChanges}
            >
              Discard
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => void load(true)} disabled={saving || exporting}>
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => void exportInvoice()}
              disabled={saving || exporting || hasUnsavedChanges}
              title={
                hasUnsavedChanges
                  ? 'Save or discard changes before exporting invoice'
                  : 'Download English A4 invoice PDF'
              }
            >
              {exporting ? 'Generating PDF…' : 'Export Invoice'}
            </button>
          </div>
        </div>
        {hasUnsavedChanges && (
          <p className="text-xs text-accent-warn">
            Unsaved changes — click Save changes when ready. Export Invoice stays locked until saved.
          </p>
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
          editableCardName={cardsEditable}
          showFooter
          showOrderColumns={false}
          reorderable={cardsEditable}
          reordering={saving}
          onMoveItem={handleMoveItem}
          removable={cardsEditable}
          removing={saving}
          onRemoveItem={handleRemoveCard}
          onUpdateItem={handleDraftItemUpdate}
        />
      </section>

      {message && <p className="text-accent-success text-sm">{message}</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}
    </div>
  );
}

