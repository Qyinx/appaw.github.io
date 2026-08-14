'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminCardsTable from '../../components/AdminCardsTable';
import AdminCustomerOrdersTable from '../../components/AdminCustomerOrdersTable';
import BatchNotesEditor, { normalizeBatchNotesHtml } from '../../components/BatchNotesEditor';
import PsaGradesCsvImport from '../../components/PsaGradesCsvImport';
import ServicePlanBadge from '../../components/ServicePlanBadge';
import { replaceBrowserSearchParams, useBrowserSearch } from '@/hooks/useBrowserSearch';
import {
  deleteBatch,
  getBatch,
  invalidateBatchOrders,
  listCustomerOrders,
  listItemsForBatch,
  updateBatch,
  updateItem,
} from '@/lib/grading/admin-api';
import {
  anyItemFieldsDirty,
  cloneAdminItems,
  itemFieldsDirty,
  itemUpdatePayload,
} from '@/lib/grading/admin-draft-utils';
import { batchDetailTabFromSearch, type BatchDetailTab } from '@/lib/grading/admin-routes';
import type {
  AdminBatch,
  AdminCustomerOrder,
  AdminItem,
  AdminPaymentSummary,
} from '@/lib/grading/admin-types';
import {
  BATCH_CARD_EDIT_STEP,
  EMPTY_PAYMENT_SUMMARY,
  parseServicePlanLabel,
} from '@/lib/grading/admin-types';
import { completedStepLabel, stepSelectOptions } from '@/lib/grading/admin-utils';
import {
  normalizePublicBoardStatus,
  PUBLIC_BOARD_STATUS_OPTIONS,
  type PublicBoardStatus,
} from '@/lib/grading/public-board';

const GRADES_READY_STEP = 8;

type Props = {
  referenceCode: string;
};

function parseNumericInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cutoffLocalToIso(local: string): string | null {
  const trimmed = local.trim();
  if (!trimmed) return null;
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function applyBatchFields(
  batch: AdminBatch,
  setters: {
    setPsaSubmissionNumber: (v: string) => void;
    setPsaOrderNumber: (v: string) => void;
    setCompletedStepIndex: (v: number) => void;
    setDraftNotes: (v: string) => void;
    setDraftEstShippingDate: (v: string) => void;
    setPublicBoardStatus: (v: PublicBoardStatus) => void;
    setIntakeCutoffLocal: (v: string) => void;
  },
) {
  setters.setPsaSubmissionNumber(String(batch.psaSubmissionNumber ?? ''));
  setters.setPsaOrderNumber(String(batch.psaOrderNumber ?? ''));
  setters.setCompletedStepIndex(batch.completedStepIndex);
  setters.setDraftNotes(batch.notes ?? '');
  setters.setDraftEstShippingDate(batch.estShippingDate ?? '');
  setters.setPublicBoardStatus(normalizePublicBoardStatus(batch.publicBoardStatus ?? 'hidden'));
  setters.setIntakeCutoffLocal(isoToDatetimeLocal(batch.intakeCutoffAt));
}

export default function GradingBatchDetailClient({ referenceCode }: Props) {
  const router = useRouter();
  const search = useBrowserSearch();
  const activeTab = batchDetailTabFromSearch(search);

  const setActiveTab = useCallback(
    (tab: BatchDetailTab) => {
      replaceBrowserSearchParams({ tab: tab === 'details' ? null : tab }, search);
    },
    [search],
  );

  const [batch, setBatch] = useState<AdminBatch | null>(null);
  const [customerOrders, setCustomerOrders] = useState<AdminCustomerOrder[]>([]);
  const [savedItems, setSavedItems] = useState<AdminItem[]>([]);
  const [draftItems, setDraftItems] = useState<AdminItem[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  const [psaSubmissionNumber, setPsaSubmissionNumber] = useState('');
  const [psaOrderNumber, setPsaOrderNumber] = useState('');
  const [completedStepIndex, setCompletedStepIndex] = useState(0);
  const [draftNotes, setDraftNotes] = useState('');
  const [draftEstShippingDate, setDraftEstShippingDate] = useState('');
  const [publicBoardStatus, setPublicBoardStatus] = useState<PublicBoardStatus>('hidden');
  const [intakeCutoffLocal, setIntakeCutoffLocal] = useState('');

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [ordersError, setOrdersError] = useState('');
  const [itemsError, setItemsError] = useState('');
  const [message, setMessage] = useState('');

  const ordersLoadedRef = useRef(false);
  const itemsLoadedRef = useRef(false);
  ordersLoadedRef.current = ordersLoaded;
  itemsLoadedRef.current = itemsLoaded;

  const fieldSetters = useMemo(
    () => ({
      setPsaSubmissionNumber,
      setPsaOrderNumber,
      setCompletedStepIndex,
      setDraftNotes,
      setDraftEstShippingDate,
      setPublicBoardStatus,
      setIntakeCutoffLocal,
    }),
    [],
  );

  const loadSummary = useCallback(
    async (force = false) => {
      setError('');
      setMessage('');
      setLoading(true);
      setOrdersLoaded(false);
      setItemsLoaded(false);
      setCustomerOrders([]);
      setSavedItems([]);
      setDraftItems([]);
      setOrdersError('');
      setItemsError('');
      try {
        const summary = await getBatch(referenceCode, force);
        if (!summary) {
          setError('Batch not found.');
          setBatch(null);
          return;
        }
        setBatch(summary.batch);
        applyBatchFields(summary.batch, fieldSetters);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setBatch(null);
      } finally {
        setLoading(false);
      }
    },
    [referenceCode, fieldSetters],
  );

  const loadOrders = useCallback(
    async (submissionId: string, force = false) => {
      setOrdersError('');
      setOrdersLoading(true);
      try {
        if (force) invalidateBatchOrders(submissionId);
        const orders = await listCustomerOrders({ submissionId }, force);
        setCustomerOrders(orders);
        setOrdersLoaded(true);
      } catch (e) {
        setOrdersError(e instanceof Error ? e.message : String(e));
      } finally {
        setOrdersLoading(false);
      }
    },
    [],
  );

  const loadItems = useCallback(
    async (ref: string, force = false) => {
      setItemsError('');
      setItemsLoading(true);
      try {
        const items = await listItemsForBatch(ref, force);
        setSavedItems(cloneAdminItems(items));
        setDraftItems(cloneAdminItems(items));
        setItemsLoaded(true);
      } catch (e) {
        setItemsError(e instanceof Error ? e.message : String(e));
      } finally {
        setItemsLoading(false);
      }
    },
    [],
  );

  const refreshAll = useCallback(
    async (force = true) => {
      setError('');
      setMessage('');
      setLoading(true);
      try {
        const summary = await getBatch(referenceCode, force);
        if (!summary) {
          setError('Batch not found.');
          setBatch(null);
          setCustomerOrders([]);
          setSavedItems([]);
          setDraftItems([]);
          setOrdersLoaded(false);
          setItemsLoaded(false);
          return;
        }
        setBatch(summary.batch);
        applyBatchFields(summary.batch, fieldSetters);

        const tasks: Promise<void>[] = [];
        if (ordersLoadedRef.current || activeTab === 'orders') {
          tasks.push(loadOrders(summary.batch.id, force));
        }
        if (itemsLoadedRef.current || activeTab === 'cards') {
          tasks.push(loadItems(summary.batch.referenceCode, force));
        }
        await Promise.all(tasks);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [referenceCode, fieldSetters, activeTab, loadOrders, loadItems],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (!batch) return;
    if (activeTab === 'orders' && !ordersLoaded && !ordersLoading) {
      void loadOrders(batch.id);
    }
    if (activeTab === 'cards' && !itemsLoaded && !itemsLoading) {
      void loadItems(batch.referenceCode);
    }
  }, [
    activeTab,
    batch,
    ordersLoaded,
    ordersLoading,
    itemsLoaded,
    itemsLoading,
    loadOrders,
    loadItems,
  ]);

  const batchDirty = useMemo(() => {
    if (!batch) return false;
    const savedStatus = normalizePublicBoardStatus(batch.publicBoardStatus ?? 'hidden');
    const savedCutoff = isoToDatetimeLocal(batch.intakeCutoffAt);
    return (
      parseNumericInput(psaSubmissionNumber) !== batch.psaSubmissionNumber ||
      parseNumericInput(psaOrderNumber) !== batch.psaOrderNumber ||
      completedStepIndex !== batch.completedStepIndex ||
      normalizeBatchNotesHtml(draftNotes) !== normalizeBatchNotesHtml(batch.notes) ||
      (draftEstShippingDate.trim() || null) !== (batch.estShippingDate ?? null) ||
      publicBoardStatus !== savedStatus ||
      intakeCutoffLocal !== savedCutoff
    );
  }, [
    batch,
    psaSubmissionNumber,
    psaOrderNumber,
    completedStepIndex,
    draftNotes,
    draftEstShippingDate,
    publicBoardStatus,
    intakeCutoffLocal,
  ]);

  const itemsDirty = useMemo(
    () => (itemsLoaded ? anyItemFieldsDirty(savedItems, draftItems) : false),
    [itemsLoaded, savedItems, draftItems],
  );

  const hasUnsavedChanges = batchDirty || itemsDirty;

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  const paymentMap = useMemo(() => {
    const map: Record<string, AdminPaymentSummary> = {};
    for (const order of customerOrders) {
      map[order.id] = order.paymentSummary ?? EMPTY_PAYMENT_SUMMARY;
    }
    return map;
  }, [customerOrders]);

  const handleDraftItemUpdate = (itemId: string, patch: Partial<AdminItem>) => {
    setDraftItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
    setMessage('');
  };

  const discardChanges = () => {
    if (!batch) return;
    setDraftItems(cloneAdminItems(savedItems));
    applyBatchFields(batch, fieldSetters);
    setError('');
    setMessage('');
  };

  const saveAllChanges = async () => {
    if (!batch || !hasUnsavedChanges) return;
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
      let nextBatch = batch;

      if (batchDirty) {
        const summary = await updateBatch(batch.referenceCode, {
          psaSubmissionNumber: parseNumericInput(psaSubmissionNumber),
          psaOrderNumber: parseNumericInput(psaOrderNumber),
          completedStepIndex,
          notes: normalizeBatchNotesHtml(draftNotes),
          estShippingDate: draftEstShippingDate.trim() || null,
          publicBoardStatus,
          intakeCutoffAt: cutoffLocalToIso(intakeCutoffLocal),
        });
        nextBatch = summary.batch;
        setBatch(nextBatch);
        applyBatchFields(nextBatch, fieldSetters);
      }

      if (itemsDirty) {
        const savedById = new Map(savedItems.map((item) => [item.id, item]));
        const changedItems = draftItems.filter((draft) => {
          const saved = savedById.get(draft.id);
          return saved ? itemFieldsDirty(saved, draft) : false;
        });

        const updatedItems = [...savedItems];
        for (const draft of changedItems) {
          const saved = savedById.get(draft.id);
          const updated = await updateItem(draft.id, itemUpdatePayload(draft, saved));
          const index = updatedItems.findIndex((item) => item.id === draft.id);
          if (index >= 0) updatedItems[index] = updated;
        }
        setSavedItems(cloneAdminItems(updatedItems));
        setDraftItems(cloneAdminItems(updatedItems));
      }

      setMessage('Changes saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleCsvApplied = useCallback(
    (nextBatch: AdminBatch, nextItems: AdminItem[]) => {
      setBatch(nextBatch);
      applyBatchFields(nextBatch, fieldSetters);
      setSavedItems(cloneAdminItems(nextItems));
      setDraftItems(cloneAdminItems(nextItems));
      setItemsLoaded(true);
    },
    [fieldSetters],
  );

  const canDeleteBatch = batch != null && Number(batch.completedStepIndex) === BATCH_CARD_EDIT_STEP;

  const handleDeleteBatch = async () => {
    if (!batch || !canDeleteBatch || deleting || saving) return;

    const orderCount = batch.orderCount ?? customerOrders.length;
    const cardCount = batch.cardCount ?? savedItems.length;
    const firstOk = window.confirm(
      `Delete batch ${batch.referenceCode} permanently?\n\n` +
        `This removes ${orderCount} customer order(s) and ${cardCount} card(s), including images.\n` +
        `Only allowed while progress is at step 0.`,
    );
    if (!firstOk) return;

    const typed = window.prompt(`Type the batch reference to confirm delete:\n${batch.referenceCode}`);
    if (typed == null) return;
    if (typed.trim() !== batch.referenceCode) {
      setError('Delete cancelled — reference code did not match.');
      return;
    }

    setDeleting(true);
    setError('');
    setMessage('');
    try {
      await deleteBatch(batch.referenceCode);
      router.push('/admin/psa-grading');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setDeleting(false);
    }
  };

  const orderCount = ordersLoaded ? customerOrders.length : (batch?.orderCount ?? 0);
  const cardCount = itemsLoaded ? draftItems.length : (batch?.cardCount ?? 0);
  const servicePlans = batch ? [parseServicePlanLabel(batch.referenceCode)] : [];

  if (loading) return <p className="text-text-muted text-sm">Loading batch…</p>;
  if (!batch) {
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
    <div className="space-y-4">
      <div>
        <Link href="/admin/psa-grading" className="text-sm text-accent-link hover:underline">
          ← Dashboard
        </Link>
        <h2 className="text-xl font-semibold mt-2 font-mono">{batch.referenceCode}</h2>
        <p className="text-sm text-text-muted mt-1">PSA batch — manage progress, orders, and cards.</p>
      </div>

      <div
        className="sticky z-20 -mx-[var(--space-page-x)] px-[var(--space-page-x)] py-3 border-b border-border-default bg-surface-bg/95 backdrop-blur-sm space-y-2"
        style={{ top: 'calc(var(--site-header-height) + var(--site-subheader-height, 0px))' }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div
            className="collection-filter-pills collection-filter-pills--scroll w-full sm:w-fit"
            role="tablist"
            aria-label="Batch sections"
          >
            <button
              type="button"
              role="tab"
              id="batch-tab-details"
              aria-selected={activeTab === 'details'}
              aria-pressed={activeTab === 'details'}
              aria-controls="batch-panel-details"
              className="collection-filter-pill"
              onClick={() => setActiveTab('details')}
            >
              Details{batchDirty ? ' •' : ''}
            </button>
            <button
              type="button"
              role="tab"
              id="batch-tab-orders"
              aria-selected={activeTab === 'orders'}
              aria-pressed={activeTab === 'orders'}
              aria-controls="batch-panel-orders"
              className="collection-filter-pill"
              onClick={() => setActiveTab('orders')}
            >
              Orders ({orderCount})
            </button>
            <button
              type="button"
              role="tab"
              id="batch-tab-cards"
              aria-selected={activeTab === 'cards'}
              aria-pressed={activeTab === 'cards'}
              aria-controls="batch-panel-cards"
              className="collection-filter-pill"
              onClick={() => setActiveTab('cards')}
            >
              Cards ({cardCount}){itemsDirty ? ' •' : ''}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => void refreshAll(true)}
              disabled={saving}
            >
              Refresh
            </button>
            {activeTab === 'orders' && (
              <Link href="/admin/psa-grading/intake" className="btn btn-secondary">
                Add customer order
              </Link>
            )}
          </div>
        </div>
        {hasUnsavedChanges && (
          <p className="text-xs text-accent-warn">Unsaved changes - click Save changes when ready.</p>
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

      {activeTab === 'details' && (
        <section
          id="batch-panel-details"
          role="tabpanel"
          aria-labelledby="batch-tab-details"
          className="panel p-4 space-y-4"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Reference ID
              </label>
              <input
                value={batch.referenceCode}
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
            <div>
              <label htmlFor="batch-est-shipping-date" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Est. shipping date
              </label>
              <input
                id="batch-est-shipping-date"
                type="date"
                value={draftEstShippingDate}
                onChange={(e) => setDraftEstShippingDate(e.target.value)}
                disabled={saving}
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="batch-public-board-status" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Hub board status
              </label>
              <select
                id="batch-public-board-status"
                value={publicBoardStatus}
                onChange={(e) => setPublicBoardStatus(normalizePublicBoardStatus(e.target.value))}
                disabled={saving}
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              >
                {PUBLIC_BOARD_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1">Shown on /business/psa-grading/. Manual.</p>
            </div>
            <div>
              <label htmlFor="batch-intake-cutoff" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Intake cutoff
              </label>
              <input
                id="batch-intake-cutoff"
                type="datetime-local"
                value={intakeCutoffLocal}
                onChange={(e) => setIntakeCutoffLocal(e.target.value)}
                disabled={saving}
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-2">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Service levels</p>
              <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
                {servicePlans.map((plan) => (
                  <ServicePlanBadge key={plan} plan={plan} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Notes
            </label>
            <BatchNotesEditor
              value={draftNotes}
              onChange={setDraftNotes}
              disabled={saving || deleting}
            />
            <p className="text-xs text-text-muted mt-1">Internal ops notes - not shown on customer tracking.</p>
          </div>

          <div className="border border-accent-danger/40 bg-surface-bg p-4 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-accent-danger">Delete batch</h3>
              <p className="text-xs text-text-muted mt-1">
                Permanently removes this batch, all customer orders, cards, and imported images.
                Allowed only while submission progress is at step 0 (
                {completedStepLabel(BATCH_CARD_EDIT_STEP)}).
              </p>
            </div>
            {!canDeleteBatch && (
              <p className="text-xs text-accent-warn">
                Delete locked — batch progress is past step 0 (
                {completedStepLabel(Number(batch.completedStepIndex))}).
              </p>
            )}
            <button
              type="button"
              className="btn btn-secondary text-accent-danger border-accent-danger/50"
              onClick={() => void handleDeleteBatch()}
              disabled={!canDeleteBatch || deleting || saving}
            >
              {deleting ? 'Deleting…' : 'Delete this batch'}
            </button>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section
          id="batch-panel-orders"
          role="tabpanel"
          aria-labelledby="batch-tab-orders"
          className="panel p-4 space-y-3"
        >
          {ordersLoading && !ordersLoaded ? (
            <p className="text-sm text-text-muted">Loading orders…</p>
          ) : ordersError ? (
            <div className="space-y-2">
              <p className="text-sm text-accent-danger">{ordersError}</p>
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={() => void loadOrders(batch.id, true)}
              >
                Retry
              </button>
            </div>
          ) : customerOrders.length > 0 ? (
            <AdminCustomerOrdersTable
              orders={customerOrders}
              paymentMap={paymentMap}
              showBatchColumn={false}
              emptyMessage="No customer orders yet."
            />
          ) : (
            <p className="text-sm text-text-muted">
              No customer orders yet.{' '}
              <Link href="/admin/psa-grading/intake" className="text-accent-link hover:underline">
                Add via intake
              </Link>
            </p>
          )}
        </section>
      )}

      {activeTab === 'cards' && (
        <section
          id="batch-panel-cards"
          role="tabpanel"
          aria-labelledby="batch-tab-cards"
          className="panel p-4 space-y-3"
        >
          {itemsLoading && !itemsLoaded ? (
            <p className="text-sm text-text-muted">Loading cards…</p>
          ) : itemsError ? (
            <div className="space-y-2">
              <p className="text-sm text-accent-danger">{itemsError}</p>
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={() => void loadItems(batch.referenceCode, true)}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {completedStepIndex >= GRADES_READY_STEP && (
                <PsaGradesCsvImport
                  referenceCode={batch.referenceCode}
                  items={draftItems}
                  onApplied={handleCsvApplied}
                />
              )}
              <AdminCardsTable
                items={draftItems}
                density="batch"
                groupByOrder
                editable
                showFooter
                showBatchOrderId
                showBatchReferenceColumn={false}
                showGradeColumns
                onUpdateItem={handleDraftItemUpdate}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}
