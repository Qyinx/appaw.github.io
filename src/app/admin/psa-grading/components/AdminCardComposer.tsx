'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { parseCostInput } from '@/lib/grading/admin-utils';

const ADD_BLANKS_MAX = 50;

export type CardComposerValue = {
  cardName: string;
  isPaid: boolean;
  totalCost: number | null;
  receivedCost: number | null;
  psaUpgraded: boolean;
};

type Props = {
  /** Plan promo fee prefilled into Total. */
  defaultTotalCost: number | null;
  disabled?: boolean;
  /** Commit a named card into the settled (bottom) list. */
  onCommit: (value: CardComposerValue) => void;
  /** Optional: spawn blank draft rows that float at top until named. */
  onAddBlanks?: (count: number) => void;
};

const emptyComposer = (defaultTotalCost: number | null): CardComposerValue => ({
  cardName: '',
  isPaid: false,
  totalCost: defaultTotalCost,
  receivedCost: null,
  psaUpgraded: false,
});

/**
 * Sticky bottom composer for PSA card intake.
 * Commit inserts a filled card at the bottom of the settled list.
 * Optional bulk action adds blank drafts that float at the top until filled.
 */
export default function AdminCardComposer({
  defaultTotalCost,
  disabled = false,
  onCommit,
  onAddBlanks,
}: Props) {
  const nameId = useId();
  const totalId = useId();
  const receivedId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<CardComposerValue>(() => emptyComposer(defaultTotalCost));
  const [blankCount, setBlankCount] = useState(1);

  useEffect(() => {
    setDraft((prev) => {
      if (prev.cardName.trim() || prev.totalCost != null) return prev;
      return { ...prev, totalCost: defaultTotalCost };
    });
  }, [defaultTotalCost]);

  const patch = (next: Partial<CardComposerValue>) => {
    setDraft((prev) => ({ ...prev, ...next }));
  };

  const commit = () => {
    if (disabled) return;
    const name = draft.cardName.trim();
    if (!name) {
      nameRef.current?.focus();
      return;
    }
    onCommit({ ...draft, cardName: name });
    setDraft(emptyComposer(defaultTotalCost));
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  const addBlanks = () => {
    if (disabled || !onAddBlanks) return;
    const n = Math.min(ADD_BLANKS_MAX, Math.max(1, Math.floor(blankCount) || 1));
    onAddBlanks(n);
  };

  return (
    <div
      className="sticky bottom-0 z-30 -mx-[var(--space-page-x)] px-[var(--space-page-x)] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border-strong bg-surface-bg/95 backdrop-blur-sm"
      role="region"
      aria-label="Add card"
    >
      <div className="panel-raised p-3 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            New card
          </p>
          <p className="text-xs text-text-muted">
            {onAddBlanks
              ? 'Enter inserts into the list bottom. Blank drafts float at top until named.'
              : 'Enter inserts the card at the bottom of the list.'}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto_auto] items-end">
          <div className="min-w-0">
            <label htmlFor={nameId} className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Card name
            </label>
            <input
              ref={nameRef}
              id={nameId}
              type="text"
              value={draft.cardName}
              disabled={disabled}
              onChange={(e) => patch({ cardName: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commit();
                }
              }}
              placeholder="Type name, then Enter"
              className="w-full border border-border-strong bg-surface-bg px-3 py-2.5 text-sm min-h-[44px] text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
            />
          </div>

          <label className="flex items-center gap-2 text-sm whitespace-nowrap min-h-[44px] px-1">
            <input
              type="checkbox"
              checked={draft.isPaid}
              disabled={disabled}
              onChange={(e) => patch({ isPaid: e.target.checked })}
              className="w-4 h-4"
            />
            Paid
          </label>

          <div>
            <label htmlFor={totalId} className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Total
            </label>
            <input
              id={totalId}
              type="number"
              min={0}
              disabled={disabled}
              value={draft.totalCost ?? ''}
              onChange={(e) => patch({ totalCost: parseCostInput(e.target.value) })}
              className="w-[6.5rem] border border-border-strong bg-surface-bg px-2.5 py-2 text-sm font-mono font-tabular text-right min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
            />
          </div>

          <div>
            <label htmlFor={receivedId} className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Received
            </label>
            <input
              id={receivedId}
              type="number"
              min={0}
              disabled={disabled}
              value={draft.receivedCost ?? ''}
              onChange={(e) => patch({ receivedCost: parseCostInput(e.target.value) })}
              className="w-[6.5rem] border border-border-strong bg-surface-bg px-2.5 py-2 text-sm font-mono font-tabular text-right min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
            />
          </div>

          <label className="flex items-center gap-2 text-sm whitespace-nowrap min-h-[44px] px-1">
            <input
              type="checkbox"
              checked={draft.psaUpgraded}
              disabled={disabled}
              onChange={(e) => patch({ psaUpgraded: e.target.checked })}
              className="w-4 h-4"
            />
            PSA up
          </label>

          <button
            type="button"
            className="btn btn-primary min-h-[44px] px-4"
            onClick={commit}
            disabled={disabled || !draft.cardName.trim()}
          >
            Add to list
          </button>
        </div>

        {onAddBlanks && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-default/70">
            <p className="text-xs text-text-muted mr-auto">
              Need empty slots first? Add blank drafts (float at top).
            </p>
            <label htmlFor={`${nameId}-blanks`} className="sr-only">
              Number of blank drafts
            </label>
            <input
              id={`${nameId}-blanks`}
              type="number"
              min={1}
              max={ADD_BLANKS_MAX}
              value={blankCount}
              disabled={disabled}
              onChange={(e) => {
                const raw = Number(e.target.value);
                if (!Number.isFinite(raw)) {
                  setBlankCount(1);
                  return;
                }
                setBlankCount(Math.min(ADD_BLANKS_MAX, Math.max(1, Math.floor(raw))));
              }}
              className="w-16 border border-border-strong bg-surface-bg px-2 py-2 text-sm font-mono tabular-nums min-h-[44px]"
            />
            <button
              type="button"
              className="btn btn-secondary min-h-[44px]"
              onClick={addBlanks}
              disabled={disabled}
            >
              Add {blankCount === 1 ? 'blank' : `${blankCount} blanks`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
