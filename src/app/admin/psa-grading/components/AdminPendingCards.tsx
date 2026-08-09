'use client';

import React from 'react';
import { parseCostInput } from '@/lib/grading/admin-utils';

export type PendingCardFields = {
  cardName: string;
  isPaid: boolean;
  totalCost: number | null;
  receivedCost: number | null;
  psaUpgraded: boolean;
};

type PendingCardRow = PendingCardFields & {
  id: string;
};

type Props = {
  items: PendingCardRow[];
  disabled?: boolean;
  onUpdate: (id: string, patch: Partial<PendingCardFields>) => void;
  onRemove: (id: string) => void;
  /** Settle when focus leaves a row (named → bottom list). */
  onRowBlur: (id: string) => void;
};

/**
 * Floating unsaved drafts — stay above the settled card list until named.
 */
export default function AdminPendingCards({
  items,
  disabled = false,
  onUpdate,
  onRemove,
  onRowBlur,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="sticky z-[15] -mx-1 px-1 py-2 space-y-2 border border-dashed border-accent-warn/60 bg-surface-raised/90 backdrop-blur-sm"
      style={{ top: 'calc(var(--site-header-height) + var(--site-subheader-height, 0px) + 4.5rem)' }}
      aria-label="Unsaved card drafts"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-2">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-warn">
          Unsaved drafts ({items.length})
        </p>
        <p className="text-xs text-text-muted">
          Float here until named — then drop into the list below.
        </p>
      </div>

      <ul className="space-y-2">
        {items.map((card) => (
          <li key={card.id}>
            <div
              onBlur={(e) => {
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.contains(next)) return;
                onRowBlur(card.id);
              }}
              className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto_auto] items-end border border-border-strong border-dashed bg-surface-bg p-3"
            >
              <div className="min-w-0">
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                  Card name
                </label>
                <input
                  type="text"
                  value={card.cardName}
                  disabled={disabled}
                  onChange={(e) => onUpdate(card.id, { cardName: e.target.value })}
                  placeholder="Name this draft…"
                  className="w-full border border-border-strong bg-surface-panel px-3 py-2 text-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                />
              </div>
              <label className="flex items-center gap-2 text-sm min-h-[44px] min-w-0">
                <input
                  type="checkbox"
                  checked={card.isPaid}
                  disabled={disabled}
                  onChange={(e) => onUpdate(card.id, { isPaid: e.target.checked })}
                  className="w-4 h-4 shrink-0"
                />
                Paid
              </label>
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                  Total
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={disabled}
                  value={card.totalCost ?? ''}
                  onChange={(e) =>
                    onUpdate(card.id, { totalCost: parseCostInput(e.target.value) })
                  }
                  className="w-[6.5rem] border border-border-strong bg-surface-raised px-2.5 py-2 text-sm font-mono font-tabular text-right min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                  Received
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={disabled}
                  value={card.receivedCost ?? ''}
                  onChange={(e) =>
                    onUpdate(card.id, { receivedCost: parseCostInput(e.target.value) })
                  }
                  className="w-[6.5rem] border border-border-strong bg-surface-raised px-2.5 py-2 text-sm font-mono font-tabular text-right min-h-[44px]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm min-h-[44px] min-w-0">
                <input
                  type="checkbox"
                  checked={card.psaUpgraded}
                  disabled={disabled}
                  onChange={(e) => onUpdate(card.id, { psaUpgraded: e.target.checked })}
                  className="w-4 h-4 shrink-0"
                />
                PSA up
              </label>
              <button
                type="button"
                className="btn btn-secondary text-accent-danger min-h-[44px] text-sm"
                disabled={disabled}
                onClick={() => onRemove(card.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
