'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BatchReferenceLink from './BatchReferenceLink';
import CustomerOrderLink from './CustomerOrderLink';
import ServicePlanBadge from './ServicePlanBadge';
import { formatHkd } from '@/lib/grading/admin-format';
import type { AdminItem, AdminItemImage } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { parseCostInput } from '@/lib/grading/admin-utils';

type Density = 'batch' | 'order' | 'default';

type Props = {
  items: AdminItem[];
  editable?: boolean;
  editableCardName?: boolean;
  onUpdateItem?: (itemId: string, patch: Partial<AdminItem>) => void;
  showFooter?: boolean;
  showOrderColumns?: boolean;
  /** When true, hide batch reference column (e.g. on batch detail page). */
  showBatchReferenceColumn?: boolean;
  showSubmissionOrder?: boolean;
  /** 1-based sequence across all cards in the batch (batch detail page). */
  showBatchOrderId?: boolean;
  /** Cert / grade / images under card name (Grades ready onward). */
  showGradeColumns?: boolean;
  /** Ops density preset — batch/order hide redundant identity columns. */
  density?: Density;
  /** Group rows under customer-order headers (batch Cards tab). */
  groupByOrder?: boolean;
  reorderable?: boolean;
  onMoveItem?: (itemId: string, direction: 'up' | 'down') => void;
  reordering?: boolean;
  removable?: boolean;
  onRemoveItem?: (itemId: string) => void;
  removing?: boolean;
  /** Anchor at start of scrollable table — scroll here after bulk-add to top. */
  topRef?: React.RefObject<HTMLDivElement | null>;
  /** Anchor at end of scrollable table body — used to scroll after bulk add. */
  bottomRef?: React.RefObject<HTMLDivElement | null>;
  /** Fired when card-name input blurs (settle filled rows). */
  onCardNameBlur?: (itemId: string) => void;
};

const MONEY_INPUT =
  'w-[6.5rem] border border-border-strong bg-surface-bg px-2 py-1.5 text-sm text-right font-mono font-tabular text-text-primary';
const MONEY_CELL = 'text-right font-mono text-sm font-medium font-tabular text-text-primary';
const MONEY_HEAD =
  'sticky top-0 z-[1] py-2 px-2 font-semibold text-text-primary text-right bg-surface-raised w-[7rem]';
const TH =
  'sticky top-0 z-[1] py-2 px-2 font-medium text-text-secondary bg-surface-raised';

function sumCosts(items: AdminItem[], key: 'totalCost' | 'receivedCost') {
  return items.reduce((acc, i) => acc + (i[key] ?? 0), 0);
}

function formatCostDisplay(value: number | null): string {
  if (value === null) return '—';
  return formatHkd(value);
}

function ItemImagesPopup({
  images,
  cardName,
}: {
  images: AdminItemImage[];
  cardName: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  if (!images?.length) {
    return <span className="text-text-muted text-xs">No images</span>;
  }

  const title = cardName?.trim() || 'Card';

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(true)}
        className="px-2 py-1 text-xs border border-border-default bg-surface-bg hover:bg-surface-raised text-text-primary min-h-[32px]"
      >
        Images ({images.length})
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="presentation"
          >
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute inset-0 bg-accent-structural/55"
              onClick={() => setOpen(false)}
            />
            <div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${panelId}-title`}
              className="relative z-[1] w-full max-w-3xl max-h-[90dvh] overflow-auto border border-border-default bg-surface-panel p-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p
                    id={`${panelId}-title`}
                    className="text-sm font-semibold text-text-primary truncate"
                  >
                    {title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {images.length} image{images.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn-secondary text-sm min-h-[40px] shrink-0"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.seq}
                    src={img.url}
                    alt={`${title} image ${img.seq}`}
                    loading="lazy"
                    className="w-full max-h-[70dvh] object-contain border border-border-default bg-surface-bg"
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

type OrderGroup = {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  items: { item: AdminItem; batchIndex: number }[];
};

function groupItemsByOrder(items: AdminItem[]): OrderGroup[] {
  const map = new Map<number, OrderGroup>();
  const order: number[] = [];
  items.forEach((item, batchIndex) => {
    let group = map.get(item.customerOrderId);
    if (!group) {
      group = {
        orderId: item.customerOrderId,
        customerName: item.customerName,
        phoneNumber: item.phoneNumber,
        items: [],
      };
      map.set(item.customerOrderId, group);
      order.push(item.customerOrderId);
    }
    group.items.push({ item, batchIndex });
  });
  return order.map((id) => map.get(id)!);
}

export default function AdminCardsTable({
  items,
  editable,
  editableCardName,
  onUpdateItem,
  showFooter,
  showOrderColumns = true,
  showBatchReferenceColumn = true,
  showSubmissionOrder = false,
  showBatchOrderId = false,
  showGradeColumns = false,
  density = 'default',
  groupByOrder = false,
  reorderable,
  onMoveItem,
  reordering,
  removable,
  onRemoveItem,
  removing,
  topRef,
  bottomRef,
  onCardNameBlur,
}: Props) {
  const hideIdentity = density === 'batch' || density === 'order';
  const showCustomerOrderColumn = showOrderColumns && !groupByOrder;
  const showBatchRefColumn = showOrderColumns && showBatchReferenceColumn && !hideIdentity;
  const showCustomerCol = !hideIdentity;
  const showPhoneCol = !hideIdentity;
  const showPlanCol = !hideIdentity;
  const showOrderLinkCol = density === 'batch' && !groupByOrder;

  const showSeqCol =
    Boolean(reorderable) ||
    (showSubmissionOrder && !showBatchOrderId) ||
    (showBatchOrderId && !reorderable);

  const colCount =
    (showSeqCol ? 1 : 0) +
    1 + // Card
    (showOrderLinkCol || showCustomerOrderColumn ? 1 : 0) +
    (showBatchRefColumn ? 1 : 0) +
    (showCustomerCol ? 1 : 0) +
    (showPhoneCol ? 1 : 0) +
    (showPlanCol ? 1 : 0) +
    1 + // Paid
    1 + // Total
    1 + // Received
    1 + // Upgraded
    (removable ? 1 : 0);

  const leadingColsBeforeMoney =
    (showSeqCol ? 1 : 0) +
    1 + // Card
    (showOrderLinkCol || showCustomerOrderColumn ? 1 : 0) +
    (showBatchRefColumn ? 1 : 0) +
    (showCustomerCol ? 1 : 0) +
    (showPhoneCol ? 1 : 0) +
    (showPlanCol ? 1 : 0) +
    1; // Paid

  const minWidth =
    density === 'batch' ? '760px' : density === 'order' ? '640px' : hideIdentity ? '720px' : '960px';

  const groups = useMemo(
    () => (groupByOrder ? groupItemsByOrder(items) : null),
    [groupByOrder, items],
  );

  const renderCardCell = (item: AdminItem) => (
    <td className="py-2 px-2 text-text-primary align-top">
      <div className="space-y-1 min-w-0">
        {editableCardName && onUpdateItem ? (
          <input
            type="text"
            value={item.cardName}
            onChange={(e) => onUpdateItem(item.id, { cardName: e.target.value })}
            className="w-full border border-border-strong bg-surface-bg px-2.5 py-1.5 text-sm text-text-primary"
            placeholder="Card name"
          />
        ) : (
          <span className="block truncate" title={item.cardName}>
            {item.cardName || '—'}
          </span>
        )}
        {showGradeColumns && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
            {editable && onUpdateItem ? (
              <>
                <label className="inline-flex items-center gap-1.5 min-w-0">
                  <span className="shrink-0">Cert</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    value={item.certNumber ?? ''}
                    onChange={(e) =>
                      onUpdateItem(item.id, { certNumber: e.target.value || null })
                    }
                    placeholder="—"
                    className="w-[8.5rem] border border-border-strong bg-surface-bg px-2 py-1 text-xs font-mono text-text-primary"
                    aria-label={`Cert number: ${item.cardName || 'card'}`}
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 min-w-0">
                  <span className="shrink-0">Grade</span>
                  <input
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={item.grade ?? ''}
                    onChange={(e) => onUpdateItem(item.id, { grade: e.target.value || null })}
                    placeholder="—"
                    className="w-[5.5rem] border border-border-strong bg-surface-bg px-2 py-1 text-xs font-mono text-text-primary"
                    aria-label={`Grade: ${item.cardName || 'card'}`}
                  />
                </label>
              </>
            ) : (
              <>
                <span title="Cert number" className="font-mono">
                  Cert{' '}
                  {item.certNumber ? (
                    <a
                      href={`https://www.psacard.com/cert/${encodeURIComponent(item.certNumber.replace(/\s/g, ''))}/psa`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-secondary hover:underline"
                    >
                      {item.certNumber}
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
                <span title="Grade" className="font-mono">
                  Grade {item.grade || '—'}
                </span>
              </>
            )}
            {item.certNumber && editable && onUpdateItem ? (
              <a
                href={`https://www.psacard.com/cert/${encodeURIComponent(item.certNumber.replace(/\s/g, ''))}/psa`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-secondary hover:underline font-mono"
                aria-label={`Open PSA cert ${item.certNumber}`}
              >
                Open
              </a>
            ) : null}
            <ItemImagesPopup images={item.images ?? []} cardName={item.cardName} />
          </div>
        )}
      </div>
    </td>
  );

  const renderMoneyCells = (item: AdminItem) => (
    <>
      <td className="py-2 px-2 text-center">
        {editable && onUpdateItem ? (
          <input
            type="checkbox"
            checked={item.isPaid}
            onChange={(e) => onUpdateItem(item.id, { isPaid: e.target.checked })}
            className="w-4 h-4"
            aria-label={`Paid: ${item.cardName || 'card'}`}
          />
        ) : (
          <span className={item.isPaid ? 'text-accent-success' : 'text-text-muted'}>
            {item.isPaid ? 'Yes' : 'No'}
          </span>
        )}
      </td>
      <td className={`py-2 px-2 ${MONEY_CELL}`}>
        {editable && onUpdateItem ? (
          <input
            type="number"
            min={0}
            value={item.totalCost ?? ''}
            onChange={(e) => onUpdateItem(item.id, { totalCost: parseCostInput(e.target.value) })}
            className={MONEY_INPUT}
            placeholder="—"
            aria-label={`Total cost: ${item.cardName || 'card'}`}
          />
        ) : (
          <span>{formatCostDisplay(item.totalCost)}</span>
        )}
      </td>
      <td className={`py-2 px-2 ${MONEY_CELL}`}>
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
            aria-label={`Received cost: ${item.cardName || 'card'}`}
          />
        ) : (
          <span>{formatCostDisplay(item.receivedCost)}</span>
        )}
      </td>
      <td className="py-2 px-2 text-center">
        {editable && onUpdateItem ? (
          <input
            type="checkbox"
            checked={item.psaUpgraded}
            onChange={(e) => onUpdateItem(item.id, { psaUpgraded: e.target.checked })}
            className="w-4 h-4"
            aria-label={`PSA upgraded: ${item.cardName || 'card'}`}
          />
        ) : (
          <span className={item.psaUpgraded ? 'text-accent-warn' : 'text-text-muted'}>
            {item.psaUpgraded ? 'Yes' : 'No'}
          </span>
        )}
      </td>
    </>
  );

  const renderRow = (item: AdminItem, index: number, displaySeq?: number) => {
    const cells: React.ReactNode[] = [];

    if (reorderable) {
      cells.push(
        <td key="reorder" className="py-2 px-2">
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
        </td>,
      );
    } else if (showSubmissionOrder && !showBatchOrderId) {
      cells.push(
        <td key="submission-order" className="py-2 px-2 font-mono text-sm text-text-muted tabular-nums">
          {item.submissionOrder}
        </td>,
      );
    } else if (showBatchOrderId) {
      cells.push(
        <td
          key="batch-order"
          className="py-2 px-2 font-mono text-sm text-text-muted tabular-nums"
          title="Sequence in batch"
        >
          {displaySeq ?? index + 1}
        </td>,
      );
    }

    cells.push(<React.Fragment key="card">{renderCardCell(item)}</React.Fragment>);

    if (showOrderLinkCol || showCustomerOrderColumn) {
      cells.push(
        <td key="order-link" className="py-2 px-2 font-mono text-xs text-text-secondary">
          <CustomerOrderLink orderId={item.customerOrderId} />
        </td>,
      );
    }
    if (showBatchRefColumn) {
      cells.push(
        <td key="batch-ref" className="py-2 px-2">
          <BatchReferenceLink referenceCode={item.batchReferenceCode} />
        </td>,
      );
    }
    if (showCustomerCol) {
      cells.push(
        <td key="customer" className="py-2 px-2">
          {item.customerName}
        </td>,
      );
    }
    if (showPhoneCol) {
      cells.push(
        <td key="phone" className="py-2 px-2 font-mono text-xs">
          {item.phoneNumber}
        </td>,
      );
    }
    if (showPlanCol) {
      cells.push(
        <td key="plan" className="py-2 px-2">
          <ServicePlanBadge plan={parseServicePlanLabel(item.batchReferenceCode)} />
        </td>,
      );
    }

    cells.push(<React.Fragment key="money">{renderMoneyCells(item)}</React.Fragment>);

    if (removable) {
      cells.push(
        <td key="remove" className="py-2 px-2">
          <button
            type="button"
            aria-label={`Remove ${item.cardName || 'card'}`}
            disabled={removing || items.length <= 1}
            onClick={() => onRemoveItem?.(item.id)}
            className="px-2 py-1 text-xs border border-border-default bg-surface-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-raised text-accent-danger"
          >
            Remove
          </button>
        </td>,
      );
    }

    return (
      <tr
        key={item.id}
        className="border-b border-border-default/70"
        onBlur={
          onCardNameBlur
            ? (e) => {
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.contains(next)) return;
                onCardNameBlur(item.id);
              }
            : undefined
        }
      >{cells}</tr>
    );
  };

  return (
    <div className="border border-border-default overflow-x-auto max-h-[70vh] overflow-y-auto">
      {topRef && <div ref={topRef} aria-hidden="true" className="h-0 w-0" />}
      <table className="w-full table-fixed text-sm" style={{ minWidth }}>
        <thead>
          <tr className="text-left border-b border-border-default">
            {reorderable && <th className={`${TH} w-20`}>#</th>}
            {showSubmissionOrder && !reorderable && !showBatchOrderId && (
              <th className={`${TH} w-12`}>#</th>
            )}
            {showBatchOrderId && !reorderable && (
              <th className={`${TH} w-12`} title="Sequence in batch">
                #
              </th>
            )}
            <th className={`${TH} min-w-[10rem]`}>Card</th>
            {(showOrderLinkCol || showCustomerOrderColumn) && (
              <th className={`${TH} w-24`}>Order</th>
            )}
            {showBatchRefColumn && <th className={`${TH} w-40`}>Batch ref</th>}
            {showCustomerCol && <th className={`${TH} w-28`}>Customer</th>}
            {showPhoneCol && <th className={`${TH} w-28`}>Phone</th>}
            {showPlanCol && <th className={`${TH} w-28`}>Plan</th>}
            <th className={`${TH} w-14 text-center`}>Paid</th>
            <th className={MONEY_HEAD}>Total</th>
            <th className={MONEY_HEAD}>Received</th>
            <th className={`${TH} w-14 text-center`}>Upgraded</th>
            {removable && <th className={`${TH} w-20`}>Remove</th>}
          </tr>
        </thead>
        <tbody>
          {groups
            ? groups.map((group) => (
                <React.Fragment key={group.orderId}>
                  <tr className="bg-surface-raised/80 border-b border-border-default">
                    <td colSpan={colCount} className="py-2 px-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <CustomerOrderLink orderId={group.orderId} />
                        <span className="text-text-primary font-medium">{group.customerName}</span>
                        <span className="font-mono text-xs text-text-muted">{group.phoneNumber}</span>
                        <span className="text-xs text-text-muted tabular-nums font-mono">
                          {group.items.length} cards
                        </span>
                      </div>
                    </td>
                  </tr>
                  {group.items.map(({ item, batchIndex }) =>
                    renderRow(item, batchIndex, batchIndex + 1),
                  )}
                </React.Fragment>
              ))
            : items.map((item, index) => renderRow(item, index))}
          {!items.length && (
            <tr>
              <td colSpan={colCount} className="py-6 text-center text-text-muted">
                No cards yet.
              </td>
            </tr>
          )}
        </tbody>
        {showFooter && items.length > 0 && (
          <tfoot>
            <tr className="bg-surface-raised border-t-2 border-border-strong font-semibold text-text-primary text-sm">
              <td colSpan={leadingColsBeforeMoney} className="py-2 px-2 text-text-secondary text-right">
                Totals
              </td>
              <td className={`py-2 px-2 ${MONEY_CELL}`}>
                {formatHkd(sumCosts(items, 'totalCost'))}
              </td>
              <td className={`py-2 px-2 ${MONEY_CELL}`}>
                {formatHkd(sumCosts(items, 'receivedCost'))}
              </td>
              <td colSpan={removable ? 2 : 1} />
            </tr>
          </tfoot>
        )}
      </table>
      {bottomRef && (
        <div ref={bottomRef} aria-hidden="true" className="h-0 w-0 scroll-mb-48" />
      )}
    </div>
  );
}
