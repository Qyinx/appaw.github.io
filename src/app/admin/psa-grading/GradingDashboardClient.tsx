'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  invalidateGradingListCache,
  loadGradingDashboard,
} from '@/lib/grading/admin-api';
import { setOrderPickedUp } from '@/lib/grading/set-order-picked-up';
import type { AdminBatch, AdminCustomerOrder, AdminPaymentSummary } from '@/lib/grading/admin-types';
import { EMPTY_PAYMENT_SUMMARY, parseServicePlanLabel } from '@/lib/grading/admin-types';
import { completedStepLabel, stepSelectOptions } from '@/lib/grading/admin-utils';
import AdminCustomerOrdersTable from './components/AdminCustomerOrdersTable';
import BatchReferenceLink from './components/BatchReferenceLink';
import PlanProgressRails from './components/PlanProgressRails';
import PsaSyncPanel from './components/PsaSyncPanel';
import ServicePlanBadge from './components/ServicePlanBadge';

/** Primary dashboard views — plan rails + stage queues + full filtered list. */
type DashboardTab = 'plans' | 'recording' | 'pickup' | 'all';
type AllView = 'batches' | 'orders';
type PaymentFilter = 'all' | 'full' | 'partial' | 'unpaid';

/** Matches backend GRADES_READY_STEP — Excel import available from here. */
const GRADES_READY_STEP = 8;

function paymentStatus(summary: AdminPaymentSummary): PaymentFilter {
  if (summary.totalCount === 0) return 'unpaid';
  if (summary.paidCount === summary.totalCount) return 'full';
  if (summary.paidCount === 0) return 'unpaid';
  return 'partial';
}

function parseDashboardTab(raw: string | null): DashboardTab {
  if (raw === 'pickup' || raw === 'recording' || raw === 'all' || raw === 'plans') return raw;
  // Legacy Batches / Orders tabs → All
  if (raw === 'batches' || raw === 'orders') return 'all';
  return 'plans';
}

function parseAllView(tabRaw: string | null, viewRaw: string | null): AllView {
  if (tabRaw === 'orders' || viewRaw === 'orders') return 'orders';
  return 'batches';
}

function formatBatchWhen(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

/** Newest create date first; missing dates last. */
function compareBatchCreatedDesc(a: AdminBatch, b: AdminBatch): number {
  const aMs = a.createdAt ? Date.parse(a.createdAt) : NaN;
  const bMs = b.createdAt ? Date.parse(b.createdAt) : NaN;
  const aOk = Number.isFinite(aMs);
  const bOk = Number.isFinite(bMs);
  if (aOk && bOk && aMs !== bMs) return bMs - aMs;
  if (aOk !== bOk) return aOk ? -1 : 1;
  return a.referenceCode.localeCompare(b.referenceCode);
}

function BatchTable({
  batches,
  loading,
  emptyMessage,
}: {
  batches: AdminBatch[];
  loading: boolean;
  emptyMessage: string;
}) {
  return (
    <section className="panel p-4">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full table-fixed text-sm min-w-[1020px]">
          <thead>
            <tr className="text-left border-b border-border-default">
              <th className="sticky top-0 z-[1] py-2 pr-2 w-44 bg-surface-panel">Reference ID</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-36 bg-surface-panel">Created</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-28 bg-surface-panel">Plan</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-28 bg-surface-panel">PSA Submission</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-28 bg-surface-panel">PSA Order</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-48 bg-surface-panel">Progress</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-20 bg-surface-panel">Customer orders</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-20 bg-surface-panel">Cards</th>
              <th className="sticky top-0 z-[1] py-2 pr-2 w-36 bg-surface-panel">Updated</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => {
              const progress = completedStepLabel(batch.completedStepIndex);
              const plan = parseServicePlanLabel(batch.referenceCode);
              return (
                <tr key={batch.id} className="border-b border-border-default/70">
                  <td className="py-2 pr-2">
                    <BatchReferenceLink referenceCode={batch.referenceCode} />
                  </td>
                  <td
                    className="py-2 pr-2 text-text-muted text-xs tabular-nums"
                    title={batch.createdAt ?? undefined}
                  >
                    {formatBatchWhen(batch.createdAt)}
                  </td>
                  <td className="py-2 pr-2">
                    <ServicePlanBadge plan={plan} />
                  </td>
                  <td className="py-2 pr-2 font-mono text-xs">
                    {batch.psaSubmissionNumber ?? '—'}
                  </td>
                  <td className="py-2 pr-2 font-mono text-xs">{batch.psaOrderNumber ?? '—'}</td>
                  <td className="py-2 pr-2 text-text-secondary" title={progress}>
                    <span className="truncate block">{progress}</span>
                    {batch.completedStepIndex >= GRADES_READY_STEP &&
                    !batch.psaExcelImported ? (
                      <span
                        className="mt-0.5 inline-flex items-center gap-1 rounded-sm border border-accent-warn/40 bg-accent-warn/15 px-1.5 py-0.5 text-xs text-accent-warn font-semibold"
                        title="PSA Excel / CSV grades not applied yet"
                      >
                        <span aria-hidden="true">⚠</span>
                        Excel pending
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-2 tabular-nums">{batch.orderCount}</td>
                  <td className="py-2 pr-2 tabular-nums">{batch.cardCount}</td>
                  <td className="py-2 pr-2 text-text-muted text-xs">
                    {formatBatchWhen(batch.updatedAt)}
                  </td>
                </tr>
              );
            })}
            {!loading && batches.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function GradingDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [batches, setBatches] = useState<AdminBatch[]>([]);
  const [customerOrders, setCustomerOrders] = useState<AdminCustomerOrder[]>([]);
  const [paymentMap, setPaymentMap] = useState<Record<string, AdminPaymentSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabRaw = searchParams.get('tab');
  const activeTab = parseDashboardTab(tabRaw);
  const allView = parseAllView(tabRaw, searchParams.get('view'));
  const batchSearch = searchParams.get('q') ?? '';
  const progressFilter = searchParams.get('progress') ?? 'all';
  const orderSearch = searchParams.get('orderQ') ?? '';
  const batchRefFilter = searchParams.get('batch') ?? 'all';
  const paymentFilter = (searchParams.get('payment') ?? 'all') as PaymentFilter;

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        // `all` clears filter keys only — tab=all is a real view
        const clearAll =
          value === 'all' && (key === 'progress' || key === 'batch' || key === 'payment');
        if (value === null || value === '' || clearAll) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
        // Default tab is plans — keep URL clean
      if (next.get('tab') === 'plans') next.delete('tab');
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams],
  );

  const setTab = useCallback(
    (tab: DashboardTab) => {
      if (tab === 'plans') {
        updateParams({ tab: null, view: null });
        return;
      }
      if (tab === 'recording') {
        updateParams({ tab: 'recording', view: null });
        return;
      }
      if (tab === 'pickup') {
        updateParams({ tab: 'pickup', view: null });
        return;
      }
      updateParams({ tab: 'all' });
    },
    [updateParams],
  );

  const load = useCallback(async (force = false) => {
    setError('');
    setLoading(true);
    try {
      if (force) invalidateGradingListCache();
      const { batches: batchRows, customerOrders: orderRows } = await loadGradingDashboard({ force });
      setBatches(batchRows);
      setCustomerOrders(orderRows);

      const payments: Record<string, AdminPaymentSummary> = {};
      for (const order of orderRows) {
        payments[order.id] = order.paymentSummary ?? EMPTY_PAYMENT_SUMMARY;
      }
      setPaymentMap(payments);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const q = batchSearch.trim().toLowerCase();
  const orderQ = orderSearch.trim().toLowerCase();

  const excelPendingBatches = useMemo(
    () =>
      batches.filter(
        (b) => b.completedStepIndex >= GRADES_READY_STEP && !b.psaExcelImported,
      ),
    [batches],
  );

  const recordingBatches = useMemo(
    () => batches.filter((b) => b.completedStepIndex === 0).sort(compareBatchCreatedDesc),
    [batches],
  );

  const pickupBatches = useMemo(
    () =>
      batches
        .filter((b) => b.completedStepIndex === 9 || b.completedStepIndex === 10)
        .sort(compareBatchCreatedDesc),
    [batches],
  );

  const pickupBatchCreatedAt = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const b of pickupBatches) map.set(b.referenceCode, b.createdAt);
    return map;
  }, [pickupBatches]);

  const pickupBatchRefs = useMemo(
    () => new Set(pickupBatches.map((b) => b.referenceCode)),
    [pickupBatches],
  );

  const pickupOrders = useMemo(
    () =>
      customerOrders
        .filter((o) => pickupBatchRefs.has(o.batchReferenceCode))
        .sort((a, b) => {
          // Group by batch create date (newest first), then pending pickup first.
          const aCreated = pickupBatchCreatedAt.get(a.batchReferenceCode);
          const bCreated = pickupBatchCreatedAt.get(b.batchReferenceCode);
          const aMs = aCreated ? Date.parse(aCreated) : NaN;
          const bMs = bCreated ? Date.parse(bCreated) : NaN;
          const aOk = Number.isFinite(aMs);
          const bOk = Number.isFinite(bMs);
          if (aOk && bOk && aMs !== bMs) return bMs - aMs;
          if (aOk !== bOk) return aOk ? -1 : 1;
          const byBatch = a.batchReferenceCode.localeCompare(b.batchReferenceCode);
          if (byBatch !== 0) return byBatch;
          if (Boolean(a.pickedUp) !== Boolean(b.pickedUp)) return a.pickedUp ? 1 : -1;
          return b.id - a.id;
        }),
    [customerOrders, pickupBatchRefs, pickupBatchCreatedAt],
  );

  const handleTogglePickedUp = useCallback(
    async (orderId: number, pickedUp: boolean) => {
      try {
        const updated = await setOrderPickedUp(orderId, pickedUp);
        setCustomerOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, ...updated } : order)),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [],
  );

  const filteredBatches = useMemo(
    () =>
      batches
        .filter((b) => {
          const createdIso = (b.createdAt ?? '').toLowerCase();
          const createdLocal = formatBatchWhen(b.createdAt).toLowerCase();
          const matchesSearch =
            !q ||
            b.referenceCode.toLowerCase().includes(q) ||
            String(b.psaSubmissionNumber ?? '').includes(q) ||
            String(b.psaOrderNumber ?? '').includes(q) ||
            createdIso.includes(q) ||
            createdLocal.includes(q);
          const matchesProgress =
            progressFilter === 'all' || String(b.completedStepIndex) === progressFilter;
          return matchesSearch && matchesProgress;
        })
        .sort(compareBatchCreatedDesc),
    [batches, q, progressFilter],
  );

  const filteredOrders = useMemo(
    () =>
      customerOrders
        .filter((o) => {
          const matchesSearch =
            !orderQ ||
            o.batchReferenceCode.toLowerCase().includes(orderQ) ||
            o.id.toString().includes(orderQ) ||
            o.customerName.toLowerCase().includes(orderQ) ||
            o.phoneNumber.includes(orderQ);
          const matchesBatch =
            batchRefFilter === 'all' || o.batchReferenceCode === batchRefFilter;
          const summary = paymentMap[o.id];
          const matchesPayment =
            paymentFilter === 'all' ||
            !summary ||
            paymentStatus(summary) === paymentFilter;
          return matchesSearch && matchesBatch && matchesPayment;
        })
        .sort((a, b) => {
          const byBatch = b.batchReferenceCode.localeCompare(a.batchReferenceCode);
          if (byBatch !== 0) return byBatch;
          return b.id - a.id;
        }),
    [customerOrders, orderQ, batchRefFilter, paymentFilter, paymentMap],
  );

  return (
    <div className="space-y-4">
      <PsaSyncPanel />

      {excelPendingBatches.length > 0 ? (
        <div
          className="border border-accent-warn/40 bg-accent-warn/10 px-3 py-2 text-sm text-accent-warn"
          role="status"
        >
          <span className="font-semibold">
            {excelPendingBatches.length} batch
            {excelPendingBatches.length === 1 ? '' : 'es'} Excel pending
          </span>
          <span className="text-text-secondary">
            {' '}
            — grades-ready, PSA CSV not applied yet. Check Plans chips or All → Batches.
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div
            className="collection-filter-pills collection-filter-pills--scroll w-fit max-w-full overflow-x-auto"
            role="tablist"
            aria-label="Dashboard view"
          >
            <button
              type="button"
              role="tab"
              className="collection-filter-pill"
              aria-selected={activeTab === 'plans'}
              aria-pressed={activeTab === 'plans'}
              onClick={() => setTab('plans')}
            >
              Plans
              <span className="ml-1.5 font-mono tabular-nums opacity-70">{batches.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              className="collection-filter-pill"
              aria-selected={activeTab === 'recording'}
              aria-pressed={activeTab === 'recording'}
              onClick={() => setTab('recording')}
            >
              Recording (0)
              <span className="ml-1.5 font-mono tabular-nums opacity-70">{recordingBatches.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              className="collection-filter-pill"
              aria-selected={activeTab === 'pickup'}
              aria-pressed={activeTab === 'pickup'}
              onClick={() => setTab('pickup')}
            >
              Pickup (9–10)
              <span className="ml-1.5 font-mono tabular-nums opacity-70">{pickupBatches.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              className="collection-filter-pill"
              aria-selected={activeTab === 'all'}
              aria-pressed={activeTab === 'all'}
              onClick={() => setTab('all')}
            >
              All
              <span className="ml-1.5 font-mono tabular-nums opacity-70">{batches.length}</span>
            </button>
          </div>
          <button type="button" className="btn btn-secondary min-h-[44px] shrink-0" onClick={() => void load(true)}>
            Refresh
          </button>
        </div>

        {activeTab === 'plans' && (
          <p className="text-sm text-text-muted">
            One rail per plan level (Premier → Value Bulk). Batch chips sit on their pipeline
            step and list order IDs for quick open.
          </p>
        )}

        {activeTab === 'recording' && (
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <p className="text-sm text-text-muted flex-1 min-w-0">
              Batches still at stage 0 — {completedStepLabel(0)}.
            </p>
            <Link href="/admin/psa-grading/intake" className="btn btn-secondary min-h-[44px]">
              New intake
            </Link>
            <Link href="/admin/psa-grading/batches/new" className="btn btn-primary min-h-[44px]">
              New batch
            </Link>
          </div>
        )}

        {activeTab === 'pickup' && (
          <p className="text-sm text-text-muted">
            Batches at stage 9 ({completedStepLabel(9)}) or 10 ({completedStepLabel(10)}), newest
            create date first. Mark which customer orders have been collected below.
          </p>
        )}

        {activeTab === 'all' && (
          <>
            <div
              className="collection-filter-pills collection-filter-pills--scroll w-fit max-w-full"
              role="group"
              aria-label="All view type"
            >
              <button
                type="button"
                className="collection-filter-pill"
                aria-pressed={allView === 'batches'}
                onClick={() => updateParams({ view: null, tab: 'all' })}
              >
                Batches
              </button>
              <button
                type="button"
                className="collection-filter-pill"
                aria-pressed={allView === 'orders'}
                onClick={() => updateParams({ view: 'orders', tab: 'all' })}
              >
                Orders
              </button>
            </div>

            {allView === 'batches' && (
              <div className="flex flex-col sm:flex-wrap sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <label htmlFor="batch-search" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                    Search batches
                  </label>
                  <input
                    id="batch-search"
                    value={batchSearch}
                    onChange={(e) => updateParams({ q: e.target.value, tab: 'all' })}
                    placeholder="Reference, create date, PSA submission, PSA order…"
                    className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
                  />
                </div>
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <label htmlFor="batch-progress" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                    Progress
                  </label>
                  <select
                    id="batch-progress"
                    value={progressFilter}
                    onChange={(e) => updateParams({ progress: e.target.value, tab: 'all' })}
                    className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
                  >
                    <option value="all">All steps</option>
                    {stepSelectOptions().map((opt) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Link href="/admin/psa-grading/batches/new" className="btn btn-primary min-h-[44px]">
                  New batch
                </Link>
                <p className="text-xs text-text-muted font-mono tabular-nums self-center sm:self-end sm:pb-3">
                  {filteredBatches.length} batches
                </p>
              </div>
            )}

            {allView === 'orders' && (
              <div className="flex flex-col sm:flex-wrap sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <label htmlFor="order-search" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                    Search orders
                  </label>
                  <input
                    id="order-search"
                    value={orderSearch}
                    onChange={(e) => updateParams({ orderQ: e.target.value, tab: 'all' })}
                    placeholder="Order id, customer, phone, batch ref…"
                    className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
                  />
                </div>
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <label htmlFor="order-batch" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                    Batch reference
                  </label>
                  <select
                    id="order-batch"
                    value={batchRefFilter}
                    onChange={(e) => updateParams({ batch: e.target.value, tab: 'all' })}
                    className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
                  >
                    <option value="all">All batches</option>
                    {[...batches].sort(compareBatchCreatedDesc).map((batch) => {
                      const created = formatBatchWhen(batch.createdAt);
                      return (
                        <option key={batch.id} value={batch.referenceCode}>
                          {created !== '—'
                            ? `${batch.referenceCode} · ${created}`
                            : batch.referenceCode}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[160px]">
                  <label htmlFor="order-payment" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                    Payment status
                  </label>
                  <select
                    id="order-payment"
                    value={paymentFilter}
                    onChange={(e) => updateParams({ payment: e.target.value, tab: 'all' })}
                    className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
                  >
                    <option value="all">All</option>
                    <option value="full">Fully paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <p className="text-xs text-text-muted font-mono tabular-nums self-center sm:self-end sm:pb-3">
                  {filteredOrders.length} orders
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {loading && <p className="text-text-muted text-sm">Loading…</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}

      {activeTab === 'plans' && (
        <PlanProgressRails batches={batches} orders={customerOrders} loading={loading} />
      )}

      {activeTab === 'recording' && (
        <BatchTable
          batches={recordingBatches}
          loading={loading}
          emptyMessage="No batches at stage 0."
        />
      )}

      {activeTab === 'pickup' && (
        <div className="space-y-4">
          <BatchTable
            batches={pickupBatches}
            loading={loading}
            emptyMessage="No batches at stage 9 or 10."
          />
          <section className="panel p-4 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Orders in pickup batches</h3>
            <AdminCustomerOrdersTable
              orders={pickupOrders}
              paymentMap={paymentMap}
              loading={loading}
              emptyMessage="No customer orders in pickup-stage batches."
              onTogglePickedUp={handleTogglePickedUp}
            />
          </section>
        </div>
      )}

      {activeTab === 'all' && allView === 'batches' && (
        <BatchTable
          batches={filteredBatches}
          loading={loading}
          emptyMessage="No batches match."
        />
      )}

      {activeTab === 'all' && allView === 'orders' && (
        <section className="panel p-4">
          <AdminCustomerOrdersTable
            orders={filteredOrders}
            paymentMap={paymentMap}
            loading={loading}
            onTogglePickedUp={handleTogglePickedUp}
          />
        </section>
      )}
    </div>
  );
}
