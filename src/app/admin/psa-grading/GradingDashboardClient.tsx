'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listBatches,
  listCustomerOrders,
  listItemsForCustomerOrder,
} from '@/lib/grading/admin-api';
import type { AdminBatch, AdminCustomerOrder } from '@/lib/grading/admin-types';
import { formatPaymentSummary, summarizePayment } from '@/lib/grading/admin-types';
import { completedStepLabel } from '@/lib/grading/admin-utils';
import BatchReferenceLink from './components/BatchReferenceLink';
import CustomerOrderLink from './components/CustomerOrderLink';

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export default function GradingDashboardClient() {
  const [batches, setBatches] = useState<AdminBatch[]>([]);
  const [customerOrders, setCustomerOrders] = useState<AdminCustomerOrder[]>([]);
  const [paymentMap, setPaymentMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [batchRows, orderRows] = await Promise.all([listBatches(), listCustomerOrders()]);
      setBatches(batchRows);
      setCustomerOrders(orderRows);

      const payments: Record<string, string> = {};
      await Promise.all(
        orderRows.map(async (order) => {
          const items = await listItemsForCustomerOrder(order.id);
          payments[order.id] = formatPaymentSummary(summarizePayment(items));
        }),
      );
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

  const q = query.trim().toLowerCase();

  const filteredBatches = useMemo(
    () =>
      batches.filter(
        (b) =>
          !q ||
          b.referenceCode.toLowerCase().includes(q) ||
          String(b.psaSubmissionNumber ?? '').includes(q) ||
          String(b.psaOrderNumber ?? '').includes(q),
      ),
    [batches, q],
  );

  const filteredOrders = useMemo(
    () =>
      customerOrders.filter(
        (o) =>
          !q ||
          o.batchReferenceCode.toLowerCase().includes(q) ||
          o.id.toString().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phoneNumber.includes(q),
      ),
    [customerOrders, q],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="dash-search" className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
            Search
          </label>
          <input
            id="dash-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="BAT ref, order id, phone, PSA number..."
            className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
          />
        </div>
        <button type="button" className="btn btn-secondary min-h-[44px]" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {loading && <p className="text-text-muted text-sm">Loading...</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}

      <section className="border border-border-default bg-surface-panel p-5">
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
                  <td className="py-2.5 pr-3">{batch.orderCount}</td>
                  <td className="py-2.5 pr-3">{batch.cardCount}</td>
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

      <section className="border border-border-default bg-surface-panel p-5">
        <SectionHeader title="Customer Orders" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[960px]">
            <thead>
              <tr className="text-left border-b border-border-default">
                <th className="py-2 pr-3">Customer Order ID</th>
                <th className="py-2 pr-3">Reference ID in PSA Batches</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Cards</th>
                <th className="py-2 pr-3">Payment</th>
                <th className="py-2 pr-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border-default/70">
                  <td className="py-2.5 pr-3 font-mono text-xs">
                    <CustomerOrderLink orderId={order.id} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <BatchReferenceLink referenceCode={order.batchReferenceCode} />
                  </td>
                  <td className="py-2.5 pr-3">{order.customerName}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs">{order.phoneNumber}</td>
                  <td className="py-2.5 pr-3">{order.itemCount}</td>
                  <td className="py-2.5 pr-3 text-xs text-text-secondary">
                    {paymentMap[order.id] ?? '—'}
                  </td>
                  <td className="py-2.5 pr-3 text-text-muted text-xs">
                    {new Date(order.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-text-muted">
                    No customer orders match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
