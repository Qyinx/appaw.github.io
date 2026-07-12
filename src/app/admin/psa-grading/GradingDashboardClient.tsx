'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  invalidateGradingListCache,
  loadGradingDashboard,
} from '@/lib/grading/admin-api';
import type { AdminBatch, AdminCustomerOrder, AdminPaymentSummary } from '@/lib/grading/admin-types';
import { EMPTY_PAYMENT_SUMMARY } from '@/lib/grading/admin-types';
import { completedStepLabel, stepSelectOptions } from '@/lib/grading/admin-utils';
import AdminCustomerOrdersTable from './components/AdminCustomerOrdersTable';
import BatchReferenceLink from './components/BatchReferenceLink';
import SectionHeader from './components/SectionHeader';

type DashboardTab = 'batches' | 'orders';
type PaymentFilter = 'all' | 'full' | 'partial' | 'unpaid';

function paymentStatus(summary: AdminPaymentSummary): PaymentFilter {
  if (summary.totalCount === 0) return 'unpaid';
  if (summary.paidCount === summary.totalCount) return 'full';
  if (summary.paidCount === 0) return 'unpaid';
  return 'partial';
}

export default function GradingDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [batches, setBatches] = useState<AdminBatch[]>([]);
  const [customerOrders, setCustomerOrders] = useState<AdminCustomerOrder[]>([]);
  const [paymentMap, setPaymentMap] = useState<Record<string, AdminPaymentSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeTab = (searchParams.get('tab') === 'orders' ? 'orders' : 'batches') as DashboardTab;
  const batchSearch = searchParams.get('q') ?? '';
  const progressFilter = searchParams.get('progress') ?? 'all';
  const orderSearch = searchParams.get('orderQ') ?? '';
  const batchRefFilter = searchParams.get('batch') ?? 'all';
  const paymentFilter = (searchParams.get('payment') ?? 'all') as PaymentFilter;

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '' || value === 'all') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams],
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

  const filteredBatches = useMemo(
    () =>
      batches.filter((b) => {
        const matchesSearch =
          !q ||
          b.referenceCode.toLowerCase().includes(q) ||
          String(b.psaSubmissionNumber ?? '').includes(q) ||
          String(b.psaOrderNumber ?? '').includes(q);
        const matchesProgress =
          progressFilter === 'all' || String(b.completedStepIndex) === progressFilter;
        return matchesSearch && matchesProgress;
      }),
    [batches, q, progressFilter],
  );

  const filteredOrders = useMemo(
    () =>
      customerOrders.filter((o) => {
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
      }),
    [customerOrders, orderQ, batchRefFilter, paymentFilter, paymentMap],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="collection-filter-pills" role="group" aria-label="Dashboard view">
            <button
              type="button"
              className="collection-filter-pill"
              aria-pressed={activeTab === 'batches'}
              onClick={() => updateParams({ tab: 'batches' })}
            >
              Batches
            </button>
            <button
              type="button"
              className="collection-filter-pill"
              aria-pressed={activeTab === 'orders'}
              onClick={() => updateParams({ tab: 'orders' })}
            >
              Customer Orders
            </button>
          </div>
          <button type="button" className="btn btn-secondary min-h-[44px]" onClick={() => void load(true)}>
            Refresh
          </button>
        </div>

        {activeTab === 'batches' && (
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="batch-search" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Search batches
              </label>
              <input
                id="batch-search"
                value={batchSearch}
                onChange={(e) => updateParams({ q: e.target.value })}
                placeholder="Reference, PSA submission, PSA order…"
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              />
            </div>
            <div className="min-w-[180px]">
              <label htmlFor="batch-progress" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Progress
              </label>
              <select
                id="batch-progress"
                value={progressFilter}
                onChange={(e) => updateParams({ progress: e.target.value })}
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
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="order-search" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Search orders
              </label>
              <input
                id="order-search"
                value={orderSearch}
                onChange={(e) => updateParams({ orderQ: e.target.value })}
                placeholder="Order id, customer, phone, batch ref…"
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              />
            </div>
            <div className="min-w-[180px]">
              <label htmlFor="order-batch" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Batch reference
              </label>
              <select
                id="order-batch"
                value={batchRefFilter}
                onChange={(e) => updateParams({ batch: e.target.value })}
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              >
                <option value="all">All batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.referenceCode}>
                    {batch.referenceCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label htmlFor="order-payment" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                Payment status
              </label>
              <select
                id="order-payment"
                value={paymentFilter}
                onChange={(e) => updateParams({ payment: e.target.value })}
                className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              >
                <option value="all">All</option>
                <option value="full">Fully paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted font-mono tabular-nums">
          {activeTab === 'batches'
            ? `${filteredBatches.length} batches`
            : `${filteredOrders.length} orders`}
        </p>
      </div>

      {loading && <p className="text-text-muted text-sm">Loading…</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}

      {activeTab === 'batches' && (
        <section className="panel p-5">
          <SectionHeader
            title="PSA Batches"
            action={
              <Link href="/admin/psa-grading/batches/new" className="btn btn-primary text-sm">
                New batch
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[840px]">
              <thead>
                <tr className="text-left border-b border-border-default">
                  <th className="py-2 pr-3">Reference ID</th>
                  <th className="py-2 pr-3">PSA Submission</th>
                  <th className="py-2 pr-3">PSA Order</th>
                  <th className="py-2 pr-3">Progress</th>
                  <th className="py-2 pr-3">Customer orders</th>
                  <th className="py-2 pr-3">Cards</th>
                  <th className="py-2 pr-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="border-b border-border-default/70">
                    <td className="py-2.5 pr-3">
                      <BatchReferenceLink referenceCode={batch.referenceCode} />
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs">
                      {batch.psaSubmissionNumber ?? '—'}
                    </td>
                    <td className="py-2.5 pr-3 font-mono text-xs">{batch.psaOrderNumber ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">
                      {completedStepLabel(batch.completedStepIndex)}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums">{batch.orderCount}</td>
                    <td className="py-2.5 pr-3 tabular-nums">{batch.cardCount}</td>
                    <td className="py-2.5 pr-3 text-text-muted text-xs">
                      {new Date(batch.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!loading && filteredBatches.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-text-muted">
                      No batches match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="panel p-5">
          <SectionHeader title="Customer Orders" />
          <AdminCustomerOrdersTable
            orders={filteredOrders}
            paymentMap={paymentMap}
            loading={loading}
          />
        </section>
      )}
    </div>
  );
}
