'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AdminBatch } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { completedStepLabel } from '@/lib/grading/admin-utils';
import { isValidBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import BatchReferenceLink from './BatchReferenceLink';

type Props = {
  batches: AdminBatch[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
};

export default function BatchReferencePicker({ batches, value, onChange, loading }: Props) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const query = value.trim().toLowerCase();

  const filteredBatches = useMemo(() => {
    if (!query) return batches;
    return batches.filter((batch) => {
      return (
        batch.referenceCode.toLowerCase().includes(query) ||
        String(batch.psaSubmissionNumber ?? '').includes(query) ||
        String(batch.psaOrderNumber ?? '').includes(query)
      );
    });
  }, [batches, query]);

  const matchedBatch = useMemo(
    () =>
      batches.find((batch) => batch.referenceCode.toUpperCase() === value.trim().toUpperCase()) ??
      null,
    [batches, value],
  );

  const trimmedValue = value.trim();
  const isValidNewCode = trimmedValue.length > 0 && isValidBatchReferenceCode(trimmedValue);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const selectBatch = (batch: AdminBatch) => {
    onChange(batch.referenceCode);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true);
      event.preventDefault();
      return;
    }

    if (!open) return;

    if (event.key === 'Escape') {
      setOpen(false);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(filteredBatches.length - 1, 0)));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter' && filteredBatches[activeIndex]) {
      event.preventDefault();
      selectBatch(filteredBatches[activeIndex]);
    }
  };

  return (
    <div ref={rootRef} className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filteredBatches[activeIndex]
              ? `${listboxId}-option-${filteredBatches[activeIndex].id}`
              : undefined
          }
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type BAT-2026-07-EXP-3"
          className="w-full border border-border-default bg-surface-bg pl-3 pr-11 py-2 font-mono min-h-[44px]"
          autoComplete="off"
        />
        <button
          type="button"
          aria-label={open ? 'Close batch list' : 'Open batch list'}
          className="absolute inset-y-0 right-0 px-3 text-text-muted hover:text-text-primary transition-colors"
          onClick={() => {
            setOpen((current) => !current);
            inputRef.current?.focus();
          }}
        >
          <span aria-hidden className="text-sm leading-none">
            {open ? '▴' : '▾'}
          </span>
        </button>

        {open && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 w-full border border-border-default bg-surface-panel shadow-lg max-h-64 overflow-y-auto"
          >
            {loading && (
              <p className="px-3 py-2.5 text-sm text-text-muted">Loading batches…</p>
            )}
            {!loading && filteredBatches.length === 0 && (
              <p className="px-3 py-2.5 text-sm text-text-muted">
                {query ? 'No matching batches.' : 'No batches in the last year.'}
              </p>
            )}
            {!loading &&
              filteredBatches.map((batch, index) => {
                const plan = parseServicePlanLabel(batch.referenceCode);
                const active = index === activeIndex;
                return (
                  <button
                    key={batch.id}
                    id={`${listboxId}-option-${batch.id}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`w-full text-left px-3 py-2.5 border-b border-border-default/60 last:border-b-0 transition-colors min-h-[44px] ${
                      active ? 'bg-accent-brand/10' : 'hover:bg-surface-raised'
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectBatch(batch)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-medium text-text-primary">
                        {batch.referenceCode}
                      </span>
                      <span className="text-xs font-medium px-1.5 py-0.5 border border-border-default bg-surface-bg">
                        {plan}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">
                      {completedStepLabel(batch.completedStepIndex)}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 tabular-nums font-mono">
                      {batch.orderCount} orders · {batch.cardCount} cards
                      {(batch.psaSubmissionNumber ?? batch.psaOrderNumber) && (
                        <>
                          {' '}
                          · PSA{' '}
                          {[batch.psaSubmissionNumber, batch.psaOrderNumber]
                            .filter((n) => n != null)
                            .join(' / ')}
                        </>
                      )}
                    </p>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {matchedBatch && (
        <div className="border border-border-default bg-surface-bg px-3 py-2.5 text-xs space-y-1">
          <p className="text-text-secondary">
            Selected batch ·{' '}
            <BatchReferenceLink referenceCode={matchedBatch.referenceCode} />
          </p>
          <p className="text-text-muted">
            {completedStepLabel(matchedBatch.completedStepIndex)} · {matchedBatch.orderCount} orders
            · {matchedBatch.cardCount} cards
          </p>
        </div>
      )}

      {!matchedBatch && isValidNewCode && (
        <p className="text-xs text-accent-warn">
          New reference — batch will be created automatically on save if it does not exist yet.
        </p>
      )}

      {!matchedBatch && trimmedValue && !isValidNewCode && (
        <p className="text-xs text-text-muted">Format: BAT-YYYY-MM-PLAN-R (e.g. BAT-2026-07-EXP-3)</p>
      )}
    </div>
  );
}
