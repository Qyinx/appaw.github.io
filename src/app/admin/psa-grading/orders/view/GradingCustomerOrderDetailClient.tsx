'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminCardComposer, { type CardComposerValue } from '../../components/AdminCardComposer';
import AdminCardsTable from '../../components/AdminCardsTable';
import AdminPendingCards from '../../components/AdminPendingCards';
import BatchReferenceLink from '../../components/BatchReferenceLink';
import ServicePlanBadge from '../../components/ServicePlanBadge';
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
  isCardNameFilled,
  isDraftItemId,
  itemFieldsDirty,
  itemOrderDirty,
  itemUpdatePayload,
  settleItemsByCardName,
  splitItemsByCardNameFill,
} from '@/lib/grading/admin-draft-utils';
import type { AdminCustomerOrderDetail, AdminItem } from '@/lib/grading/admin-types';
import { BATCH_CARD_EDIT_STEP, parseServicePlanLabel, summarizePayment } from '@/lib/grading/admin-types';
import { completedStepLabel } from '@/lib/grading/admin-utils';
import { formatHkd } from '@/lib/grading/admin-format';
import { getPsaDefaultTotalCost } from '@/lib/grading/psa-pricing';
import { isReholderPlan } from '@/lib/grading/plan-accent';

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
  const listBottomRef = useRef<HTMLDivElement>(null);
  const scrollAfterCommitRef = useRef(false);

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
      setDraftItems(settleItemsByCardName(cloneAdminItems(result.items)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!scrollAfterCommitRef.current) return;
    scrollAfterCommitRef.current = false;
    listBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [draftItems]);

  const cardsEditable = detail?.batchCompletedStepIndex === BATCH_CARD_EDIT_STEP;

  const { pending: pendingItems, filled: filledItems } = useMemo(
    () => splitItemsByCardNameFill(draftItems),
    [draftItems],
  );

  const planDefaultTotal = useMemo(() => {
    if (!detail) return null;
    const plan = parseServicePlanLabel(detail.customerOrder.batchReferenceCode);
    return plan === '—' ? null : getPsaDefaultTotalCost(plan);
  }, [detail]);

  const showCertFields = useMemo(() => {
    if (!detail) return false;
    const plan = parseServicePlanLabel(detail.customerOrder.batchReferenceCode);
    return plan !== '—' && isReholderPlan(plan);
  }, [detail]);

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
    const { pending, filled } = splitItemsByCardNameFill(draftItems);
    const currentIndex = filled.findIndex((item) => item.id === itemId);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filled.length) return;

    const reordered = [...filled];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];
    setDraftItems(settleItemsByCardName([...pending, ...reordered]));
    setMessage('');
  };

  const handleCommitComposer = (value: CardComposerValue) => {
    if (!detail || !cardsEditable) return;
    const item = {
      ...createDraftItem(detail.customerOrder, 0),
      cardName: value.cardName,
      certNumber: value.certNumber,
      grade: value.grade,
      isPaid: value.isPaid,
      totalCost: value.totalCost,
      receivedCost: value.receivedCost,
      psaUpgraded: value.psaUpgraded,
    };
    scrollAfterCommitRef.current = true;
    setDraftItems((prev) => settleItemsByCardName([...prev, item]));
    setMessage('');
  };

  const handlePendingBlur = () => {
    if (!cardsEditable) return;
    setDraftItems((prev) => settleItemsByCardName(prev));
  };

  const handleRemoveCard = (itemId: string) => {
    if (!cardsEditable) return;
    setDraftItems((prev) => {
      const next = prev.filter((item) => item.id !== itemId);
      if (next.length === 0 && detail) {
        return [];
      }
      return settleItemsByCardName(next);
    });
    setMessage('');
  };

  const discardChanges = () => {
    if (!detail) return;
    setDraftItems(settleItemsByCardName(cloneAdminItems(detail.items)));
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
      if (draftItems.filter((item) => isCardNameFilled(item.cardName)).length === 0) {
        setError('Order must have at least one named card.');
        return;
      }
      if (draftItems.some((item) => isDraftItemId(item.id) && !item.cardName.trim())) {
        setError('Name or remove blank drafts before saving.');
        return;
      }
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const idMap = new Map<string, string>();

      if (cardsEditable) {
        const namedDrafts = draftItems.filter((item) => isCardNameFilled(item.cardName));
        const draftIdSet = new Set(namedDrafts.map((item) => item.id));
        const toRemove = detail.items.filter((item) => !draftIdSet.has(item.id));
        for (const item of toRemove) {
          await deleteCustomerOrderItem(item.id);
        }

        for (const draft of namedDrafts.filter((item) => isDraftItemId(item.id))) {
          const created = await createCustomerOrderItem(orderId, createOrderItemPayload(draft));
          idMap.set(draft.id, created.id);
        }

        const resolvedIds = namedDrafts.map((draft) => idMap.get(draft.id) ?? draft.id);

        for (let i = 0; i < namedDrafts.length; i += 1) {
          const draft = namedDrafts[i];
          const id = resolvedIds[i];
          const original = detail.items.find((item) => item.id === id);
          if (!original || itemFieldsDirty(original, draft)) {
            await updateItem(id, itemUpdatePayload(draft, original));
          }
        }

        const needsReorder =
          toRemove.length > 0 ||
          idMap.size > 0 ||
          itemOrderDirty(detail.items, namedDrafts);
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
  const paymentSummary = summarizePayment(filledItems);

  return (
    <div className={`space-y-4 ${cardsEditable ? 'pb-40' : ''}`}>
      <div>
        <Link href="/admin/psa-grading" className="text-sm text-accent-link hover:underline">
          ← Dashboard
        </Link>
        <h2 className="text-xl font-semibold mt-2 font-mono tabular-nums">
          {customerOrder.batchReferenceCode} - {customerOrder.id}
        </h2>
        <p className="text-sm text-text-muted mt-1">Customer order - cards and payment details.</p>
      </div>

      <div
        className="sticky z-20 -mx-[var(--space-page-x)] px-[var(--space-page-x)] py-3 border-b border-border-default bg-surface-bg/95 backdrop-blur-sm space-y-2"
        style={{ top: 'calc(var(--site-header-height) + var(--site-subheader-height, 0px))' }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            Cards ({filledItems.length} named
            {pendingItems.length > 0 ? `, ${pendingItems.length} draft` : ''})
            {cardsEditable
              ? ' — composer at bottom'
              : ' — payment fields only (batch past step 0)'}
          </p>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="btn btn-primary min-h-[44px]"
              onClick={() => void saveAllChanges()}
              disabled={saving || exporting || !hasUnsavedChanges}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary min-h-[44px]"
              onClick={discardChanges}
              disabled={saving || exporting || !hasUnsavedChanges}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn btn-secondary min-h-[44px]"
              onClick={() => void load(true)}
              disabled={saving || exporting}
            >
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-secondary min-h-[44px]"
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
            Unsaved changes - click Save changes when ready. Export Invoice stays locked until saved.
          </p>
        )}
        {message && (
          <p role="status" aria-live="polite" className="text-accent-success text-sm">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" aria-live="assertive" className="text-accent-danger text-sm">
            {error}
          </p>
        )}
      </div>

      <section className="panel p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Customer Order ID</p>
            <p className="font-mono text-sm">{customerOrder.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Batch ref</p>
            <BatchReferenceLink referenceCode={customerOrder.batchReferenceCode} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Service level</p>
            <ServicePlanBadge plan={parseServicePlanLabel(customerOrder.batchReferenceCode)} />
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

      <section className="panel p-4 space-y-3">
        <div className="panel-raised p-3 max-w-md">
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

        {cardsEditable && (
          <AdminPendingCards
            items={pendingItems.map((item) => ({
              id: item.id,
              cardName: item.cardName,
              certNumber: item.certNumber ?? null,
              grade: item.grade ?? null,
              isPaid: item.isPaid,
              totalCost: item.totalCost,
              receivedCost: item.receivedCost,
              psaUpgraded: item.psaUpgraded,
            }))}
            disabled={saving || exporting}
            showCertFields={showCertFields}
            onUpdate={(id, patch) => handleDraftItemUpdate(id, patch)}
            onRemove={handleRemoveCard}
            onRowBlur={() => handlePendingBlur()}
          />
        )}

        <div className="space-y-2">
          <p className="text-xs text-text-secondary uppercase tracking-wide">
            {cardsEditable ? 'Settled cards' : 'Cards'}
          </p>
          <AdminCardsTable
            items={cardsEditable ? filledItems : draftItems}
            density="order"
            editable
            editableCardName={cardsEditable}
            showFooter
            showOrderColumns={false}
            showGradeColumns
            reorderable={cardsEditable}
            reordering={saving}
            onMoveItem={handleMoveItem}
            removable={cardsEditable}
            removing={saving}
            onRemoveItem={handleRemoveCard}
            onUpdateItem={handleDraftItemUpdate}
            bottomRef={listBottomRef}
          />
        </div>
      </section>

      {cardsEditable && (
        <AdminCardComposer
          defaultTotalCost={planDefaultTotal}
          disabled={saving || exporting}
          showCertFields={showCertFields}
          onCommit={handleCommitComposer}
        />
      )}
    </div>
  );
}
