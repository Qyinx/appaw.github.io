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
  showPaymentColumn?: boolean;
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
  showPaymentColumn = true,
}: Props) {
  const colCount = 5 + (showBatchColumn ? 1 : 0) + (showPaymentColumn ? 1 : 0);
  const minWidth = showBatchColumn
    ? showPaymentColumn
      ? '960px'
      : '840px'
    : showPaymentColumn
      ? '760px'
      : '640px';

  return (
    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
      <table className="w-full table-fixed text-sm" style={{ minWidth }}>
        <thead>
          <tr className="text-left border-b border-border-default">
            <th className="sticky top-0 z-[1] py-2 pr-2 w-28 bg-surface-panel">Customer Order ID</th>
            {showBatchColumn && (
              <th className="sticky top-0 z-[1] py-2 pr-2 w-44 bg-surface-panel">Batch ref</th>
            )}
            <th className="sticky top-0 z-[1] py-2 pr-2 min-w-0 bg-surface-panel">Customer</th>
            <th className="sticky top-0 z-[1] py-2 pr-2 w-32 bg-surface-panel">Phone</th>
            <th className="sticky top-0 z-[1] py-2 pr-2 w-16 bg-surface-panel">Cards</th>
            {showPaymentColumn && (
              <th className="sticky top-0 z-[1] py-2 pr-2 w-36 bg-surface-panel">Payment</th>
            )}
            <th className="sticky top-0 z-[1] py-2 pr-2 w-36 bg-surface-panel">Updated</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border-default/70">
              <td className="py-2 pr-2 font-mono text-xs">
                <CustomerOrderLink orderId={order.id} />
              </td>
              {showBatchColumn && (
                <td className="py-2 pr-2">
                  <BatchReferenceLink referenceCode={order.batchReferenceCode} />
                </td>
              )}
              <td className="py-2 pr-2 min-w-0 truncate" title={order.customerName}>
                {order.customerName}
              </td>
              <td className="py-2 pr-2 font-mono text-xs">{order.phoneNumber}</td>
              <td className="py-2 pr-2 tabular-nums">{order.itemCount}</td>
              {showPaymentColumn && (
                <td className="py-2 pr-2">
                  <PaymentCell summary={paymentMap?.[order.id]} />
                </td>
              )}
              <td className="py-2 pr-2 text-text-muted text-xs">
                {new Date(order.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan={colCount} className="py-6 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
