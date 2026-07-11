'use client';

import React from 'react';
import type { AdminCustomerOrder, AdminPaymentSummary } from '@/lib/grading/admin-types';
import { formatHkd } from '@/lib/grading/admin-format';
import BatchReferenceLink from './BatchReferenceLink';
import CustomerOrderLink from './CustomerOrderLink';

type Props = {
  orders: AdminCustomerOrder[];
  paymentMap?: Record<string, AdminPaymentSummary>;
  loading?: boolean;
  emptyMessage?: string;
  showBatchColumn?: boolean;
};

function PaymentCell({ summary }: { summary: AdminPaymentSummary | undefined }) {
  if (!summary || summary.totalCount === 0) {
    return <span className="text-text-muted text-sm">—</span>;
  }
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-text-primary tabular-nums font-mono text-sm">
        {formatHkd(summary.receivedCostSum)} / {formatHkd(summary.totalCostSum)}
      </span>
      <span className="text-text-secondary text-xs tabular-nums">
        {summary.paidCount}/{summary.totalCount} paid
      </span>
    </div>
  );
}

export default function AdminCustomerOrdersTable({
  orders,
  paymentMap,
  loading,
  emptyMessage = 'No customer orders match.',
  showBatchColumn = true,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[960px]">
        <thead>
          <tr className="text-left border-b border-border-default">
            <th className="py-2 pr-3">Customer Order ID</th>
            {showBatchColumn && <th className="py-2 pr-3">Reference ID in PSA Batches</th>}
            <th className="py-2 pr-3">Customer</th>
            <th className="py-2 pr-3">Phone</th>
            <th className="py-2 pr-3">Cards</th>
            <th className="py-2 pr-3">Payment</th>
            <th className="py-2 pr-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border-default/70">
              <td className="py-2.5 pr-3 font-mono text-xs">
                <CustomerOrderLink orderId={order.id} />
              </td>
              {showBatchColumn && (
                <td className="py-2.5 pr-3">
                  <BatchReferenceLink referenceCode={order.batchReferenceCode} />
                </td>
              )}
              <td className="py-2.5 pr-3">{order.customerName}</td>
              <td className="py-2.5 pr-3 font-mono text-xs">{order.phoneNumber}</td>
              <td className="py-2.5 pr-3 tabular-nums">{order.itemCount}</td>
              <td className="py-2.5 pr-3">
                <PaymentCell summary={paymentMap?.[order.id]} />
              </td>
              <td className="py-2.5 pr-3 text-text-muted text-xs">
                {new Date(order.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan={showBatchColumn ? 7 : 6} className="py-6 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
