import type { AdminBatch, AdminCustomerOrder } from './admin-types';
import { parseServicePlanLabel } from './admin-types';
import type { GradingServicePlan } from './reference-code';
import { FULL_STEP_COUNT, buildFullStepList } from './step-labels';

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

/** Ops priority for plan rails (faster / premium first). */
export const PLAN_RAIL_PRIORITY: Array<GradingServicePlan | '—'> = [
  'WALK',
  'SPX',
  'EXP',
  'REG',
  'STD',
  'PRE3',
  'PRE2',
  'PRE1',
  'RHLD',
  'VMAX',
  'VPLS',
  'VBLK',
  '—',
];

/** Short header labels for the 11-step admin plan rail. */
export const RAIL_STEP_SHORT_LABELS: string[] = [
  'Rec',
  'Sent',
  'Arr',
  'Prep',
  'ID',
  'Grade',
  'Asm',
  'QA',
  'Ready',
  'Done',
  'Pickup',
];

export function railStepFullLabels(): string[] {
  return buildFullStepList(10).map((s) => s.label);
}

export type PlanRailGroup = {
  plan: GradingServicePlan | '—';
  batches: AdminBatch[];
};

export function groupBatchesByPlan(batches: AdminBatch[]): PlanRailGroup[] {
  const buckets = new Map<GradingServicePlan | '—', AdminBatch[]>();
  for (const batch of batches) {
    const plan = parseServicePlanLabel(batch.referenceCode);
    const list = buckets.get(plan);
    if (list) list.push(batch);
    else buckets.set(plan, [batch]);
  }

  for (const list of buckets.values()) {
    list.sort((a, b) => {
      const stage = a.completedStepIndex - b.completedStepIndex;
      if (stage !== 0) return stage;
      return a.referenceCode.localeCompare(b.referenceCode);
    });
  }

  return PLAN_RAIL_PRIORITY.filter((plan) => buckets.has(plan)).map((plan) => ({
    plan,
    batches: buckets.get(plan)!,
  }));
}

export type BatchPickupProgress = {
  picked: number;
  total: number;
};

/** Count picked-up orders for a batch reference from the dashboard order list. */
export function pickupProgressForBatch(
  batchReferenceCode: string,
  orders: AdminCustomerOrder[],
): BatchPickupProgress {
  let picked = 0;
  let total = 0;
  for (const order of orders) {
    if (order.batchReferenceCode !== batchReferenceCode) continue;
    total += 1;
    if (order.pickedUp) picked += 1;
  }
  return { picked, total };
}

export { FULL_STEP_COUNT };
