import type { AdminBatch } from './admin-types';
import { buildFullStepList } from './step-labels';

export function completedStepLabel(index: number): string {
  const steps = buildFullStepList(index);
  const current = steps.find((s) => s.index === index);
  return current?.label ?? `Step ${index}`;
}

/** Intake / picker list: earlier pipeline stage first, then reference code. */
export function sortBatchesByStage(batches: AdminBatch[]): AdminBatch[] {
  return [...batches].sort((a, b) => {
    const stage = a.completedStepIndex - b.completedStepIndex;
    if (stage !== 0) return stage;
    return a.referenceCode.localeCompare(b.referenceCode);
  });
}

export function stepSelectOptions(): Array<{ value: number; label: string }> {
  return buildFullStepList(10).map((s) => ({
    value: s.index,
    label: `${s.index} — ${s.label}`,
  }));
}

export function parseCostInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export function formatCost(value: number | null): string {
  if (value === null) return '—';
  return `HKD ${value}`;
}
