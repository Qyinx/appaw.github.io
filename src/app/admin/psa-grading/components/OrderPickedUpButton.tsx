'use client';

import React, { useState } from 'react';

type Props = {
  pickedUp: boolean;
  pickedUpAt?: string | null;
  disabled?: boolean;
  /** Compact for table cells; default for detail panels. */
  size?: 'compact' | 'default';
  onToggle: (pickedUp: boolean) => Promise<void> | void;
};

/**
 * Ops pickup control — sharp toggle button (not a bare checkbox).
 * Awaiting → brand outline; collected → success fill; click flips state.
 */
export default function OrderPickedUpButton({
  pickedUp,
  pickedUpAt,
  disabled,
  size = 'default',
  onToggle,
}: Props) {
  const [busy, setBusy] = useState(false);
  const compact = size === 'compact';

  const label = busy
    ? 'Saving…'
    : pickedUp
      ? compact
        ? 'Picked up'
        : pickedUpAt
          ? `Picked up · ${new Date(pickedUpAt).toLocaleString()}`
          : 'Picked up'
      : compact
        ? 'Awaiting'
        : 'Mark picked up';

  const title = pickedUp
    ? 'Click to clear pickup (order still waiting on shelf)'
    : 'Click when customer has collected cards';

  return (
    <button
      type="button"
      title={title}
      aria-pressed={pickedUp}
      disabled={disabled || busy}
      onClick={() => {
        if (busy || disabled) return;
        setBusy(true);
        void Promise.resolve(onToggle(!pickedUp)).finally(() => setBusy(false));
      }}
      className={[
        'inline-flex items-center justify-center gap-1.5 border font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-brand',
        compact ? 'min-h-[36px] px-2.5 py-1 text-xs whitespace-nowrap' : 'min-h-[44px] px-3 py-2 text-sm',
        pickedUp
          ? 'border-accent-success/50 bg-accent-success/15 text-accent-success hover:bg-accent-success/25'
          : 'border-border-strong bg-surface-bg text-text-secondary hover:border-accent-brand hover:text-text-primary hover:bg-accent-brand/5',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'inline-block size-2 shrink-0 rounded-none border',
          pickedUp ? 'border-accent-success bg-accent-success' : 'border-border-strong bg-transparent',
        ].join(' ')}
      />
      <span>{label}</span>
    </button>
  );
}
