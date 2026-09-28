'use client';

import React, { useMemo } from 'react';

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
};

const DEFAULT_CUTOFF_TIME = '21:00';

/** `YYYY-MM-DDTHH:mm` ↔ split date/time for easier editing than datetime-local. */
export function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function cutoffLocalToIso(local: string): string | null {
  const trimmed = local.trim();
  if (!trimmed) return null;
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function splitLocal(value: string): { date: string; time: string } {
  const trimmed = value.trim();
  if (!trimmed) return { date: '', time: '' };
  const [date = '', timePart = ''] = trimmed.split('T');
  const time = timePart.slice(0, 5);
  return { date, time };
}

function joinLocal(date: string, time: string): string {
  if (!date.trim()) return '';
  const safeTime = time.trim() || DEFAULT_CUTOFF_TIME;
  return `${date.trim()}T${safeTime}`;
}

/** Split date + time inputs. Picking a date defaults time to 21:00. */
export default function AdminCutoffPicker({ id, value, onChange, disabled, hint }: Props) {
  const { date, time } = useMemo(() => splitLocal(value), [value]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${id}-date`} className="sr-only">
            Cutoff date
          </label>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            onChange={(e) => onChange(joinLocal(e.target.value, time))}
            disabled={disabled}
            className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor={`${id}-time`} className="sr-only">
            Cutoff time
          </label>
          <input
            id={`${id}-time`}
            type="time"
            value={time || (date ? DEFAULT_CUTOFF_TIME : '')}
            onChange={(e) => onChange(joinLocal(date, e.target.value))}
            disabled={disabled || !date}
            className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
          />
        </div>
      </div>
      {hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}
