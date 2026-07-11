'use client';

import React from 'react';
import BatchReferenceLink from './BatchReferenceLink';
import CustomerOrderLink from './CustomerOrderLink';
import { formatHkd } from '@/lib/grading/admin-format';
import type { AdminItem } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { parseCostInput } from '@/lib/grading/admin-utils';

type Props = {
  items: AdminItem[];
  editable?: boolean;
  onUpdateItem?: (itemId: string, patch: Partial<AdminItem>) => void;
  showFooter?: boolean;
  showOrderColumns?: boolean;
  showSubmissionOrder?: boolean;
  reorderable?: boolean;
  onMoveItem?: (itemId: string, direction: 'up' | 'down') => void;
  reordering?: boolean;
};

const MONEY_INPUT =
  'w-full min-w-[5.5rem] border border-border-strong bg-surface-raised px-2.5 py-1.5 text-sm text-right font-mono font-tabular text-text-primary';
const MONEY_CELL = 'text-right font-mono text-sm font-medium font-tabular text-text-primary bg-surface-raised';
const MONEY_HEAD =
  'py-2.5 px-3 font-semibold text-text-primary text-right bg-surface-raised w-24';

function sumCosts(items: AdminItem[], key: 'totalCost' | 'receivedCost') {
  return items.reduce((acc, i) => acc + (i[key] ?? 0), 0);
}

function formatCostDisplay(value: number | null): string {
  if (value === null) return '—';
  return formatHkd(value);
}

export default function AdminCardsTable({
  items,
  editable,
  onUpdateItem,
  showFooter,
  showOrderColumns = true,
  showSubmissionOrder = false,
  reorderable,
  onMoveItem,
  reordering,
}: Props) {
  const orderColSpan =
    (showOrderColumns ? 2 : 0) +
    (showSubmissionOrder ? 1 : 0) +
    (reorderable ? 1 : 0);

  return (
    <div className="border border-border-default overflow-x-auto">
      <table className="w-full text-sm min-w-[1040px]">
        <thead>
          <tr className="text-left border-b border-border-default bg-surface-raised">
            {reorderable && (
              <th className="py-2.5 px-3 font-medium text-text-secondary w-20">#</th>
            )}
            {showSubmissionOrder && !reorderable && (
              <th className="py-2.5 px-3 font-medium text-text-secondary w-12">#</th>
            )}
            <th className="py-2.5 px-3 font-medium text-text-secondary">Card</th>
            {showOrderColumns && (
              <>
                <th className="py-2.5 px-3 font-medium text-text-secondary">Customer Order ID</th>
                <th className="py-2.5 px-3 font-medium text-text-secondary">Reference ID in PSA Batches</th>
              </>
            )}
            <th className="py-2.5 px-3 font-medium text-text-secondary">Customer</th>
            <th className="py-2.5 px-3 font-medium text-text-secondary">Phone</th>
            <th className="py-2.5 px-3 font-medium text-text-secondary w-16">Plan</th>
            <th className="py-2.5 px-3 font-medium text-text-secondary w-16">Paid</th>
            <th className={MONEY_HEAD}>Total</th>
            <th className={MONEY_HEAD}>Received</th>
            <th className="py-2.5 px-3 font-medium text-text-secondary w-24">Upgraded</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b border-border-default/70">
              {reorderable && (
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm text-text-muted w-5 tabular-nums">
                      {item.submissionOrder}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        aria-label={`Move ${item.cardName} up`}
                        disabled={reordering || index === 0}
                        onClick={() => onMoveItem?.(item.id, 'up')}
                        className="px-1 py-0.5 text-xs border border-border-default bg-surface-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-raised"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${item.cardName} down`}
                        disabled={reordering || index === items.length - 1}
                        onClick={() => onMoveItem?.(item.id, 'down')}
                        className="px-1 py-0.5 text-xs border border-border-default bg-surface-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-raised"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </td>
              )}
              {showSubmissionOrder && !reorderable && (
                <td className="py-2.5 px-3 font-mono text-sm text-text-muted tabular-nums">
                  {item.submissionOrder}
                </td>
              )}
              <td className="py-2.5 px-3 text-text-primary">{item.cardName}</td>
              {showOrderColumns && (
                <>
                  <td className="py-2.5 px-3 font-mono text-xs text-text-secondary">
                    <CustomerOrderLink orderId={item.customerOrderId} />
                  </td>
                  <td className="py-2.5 px-3">
                    <BatchReferenceLink referenceCode={item.batchReferenceCode} />
                  </td>
                </>
              )}
              <td className="py-2.5 px-3">{item.customerName}</td>
              <td className="py-2.5 px-3 font-mono text-xs">{item.phoneNumber}</td>
              <td className="py-2.5 px-3">
                <span className="text-xs font-medium px-1.5 py-0.5 border border-border-default">
                  {parseServicePlanLabel(item.batchReferenceCode)}
                </span>
              </td>
              <td className="py-2.5 px-3">
                {editable && onUpdateItem ? (
                  <input
                    type="checkbox"
                    checked={item.isPaid}
                    onChange={(e) => onUpdateItem(item.id, { isPaid: e.target.checked })}
                    className="w-4 h-4"
                  />
                ) : (
                  <span className={item.isPaid ? 'text-accent-success' : 'text-text-muted'}>
                    {item.isPaid ? 'Yes' : 'No'}
                  </span>
                )}
              </td>
              <td className={`py-2.5 px-3 ${MONEY_CELL}`}>
                {editable && onUpdateItem ? (
                  <input
                    type="number"
                    min={0}
                    value={item.totalCost ?? ''}
                    onChange={(e) =>
                      onUpdateItem(item.id, { totalCost: parseCostInput(e.target.value) })
                    }
                    className={MONEY_INPUT}
                    placeholder="—"
                  />
                ) : (
                  <span>{formatCostDisplay(item.totalCost)}</span>
                )}
              </td>
              <td className={`py-2.5 px-3 ${MONEY_CELL}`}>
                {editable && onUpdateItem ? (
                  <input
                    type="number"
                    min={0}
                    value={item.receivedCost ?? ''}
                    onChange={(e) =>
                      onUpdateItem(item.id, { receivedCost: parseCostInput(e.target.value) })
                    }
                    className={MONEY_INPUT}
                    placeholder="—"
                  />
                ) : (
                  <span>{formatCostDisplay(item.receivedCost)}</span>
                )}
              </td>
              <td className="py-2.5 px-3">
                {editable && onUpdateItem ? (
                  <input
                    type="checkbox"
                    checked={item.psaUpgraded}
                    onChange={(e) => onUpdateItem(item.id, { psaUpgraded: e.target.checked })}
                    className="w-4 h-4"
                  />
                ) : (
                  <span className={item.psaUpgraded ? 'text-accent-warn' : 'text-text-muted'}>
                    {item.psaUpgraded ? 'Yes' : 'No'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        {showFooter && items.length > 0 && (
          <tfoot>
            <tr className="bg-surface-raised border-t-2 border-border-strong font-semibold text-text-primary text-sm">
              <td colSpan={5 + orderColSpan} className="py-2.5 px-3 text-text-secondary text-right">
                Totals
              </td>
              <td className={`py-2.5 px-3 ${MONEY_CELL}`}>
                {formatHkd(sumCosts(items, 'totalCost'))}
              </td>
              <td className={`py-2.5 px-3 ${MONEY_CELL}`}>
                {formatHkd(sumCosts(items, 'receivedCost'))}
              </td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
