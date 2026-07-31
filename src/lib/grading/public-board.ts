import { joinBackendUrl } from '@/lib/collection/backendUrl';
import { parseBatchReferenceCode } from './batch-reference-code';
import type { GradingServicePlan } from './reference-code';

/** Manual public board status — set in admin, not auto-synced from PSA. */
export type PublicBoardStatus = 'hidden' | 'intake' | 'atPsa' | 'returning' | 'pickup';

export type PublicBoardPhase = Exclude<PublicBoardStatus, 'hidden'>;

export type PublicBatchBoardItem = {
  referenceCode: string;
  plan: GradingServicePlan;
  status: PublicBoardPhase;
  intakeCutoffAt: string | null;
  intakeOpen: boolean;
};

export type PublicBatchBoardResponse = {
  batches: PublicBatchBoardItem[];
  updatedAt?: string;
};

export const PUBLIC_BOARD_STATUS_OPTIONS: Array<{ value: PublicBoardStatus; label: string }> = [
  { value: 'hidden', label: 'Hidden (not on hub)' },
  { value: 'intake', label: 'Intake open' },
  { value: 'atPsa', label: 'Intake Closed' },
  { value: 'returning', label: 'Grades / return' },
  { value: 'pickup', label: 'Ready for pickup' },
];

export function isPublicBoardStatus(value: unknown): value is PublicBoardStatus {
  return (
    value === 'hidden' ||
    value === 'intake' ||
    value === 'atPsa' ||
    value === 'returning' ||
    value === 'pickup'
  );
}

export function normalizePublicBoardStatus(value: unknown): PublicBoardStatus {
  return isPublicBoardStatus(value) ? value : 'hidden';
}

export function computeIntakeOpen(
  status: PublicBoardPhase,
  intakeCutoffAt: string | null,
  nowMs: number = Date.now(),
): boolean {
  if (status !== 'intake') return false;
  if (!intakeCutoffAt) return true;
  const cutoff = Date.parse(intakeCutoffAt);
  if (Number.isNaN(cutoff)) return true;
  return nowMs < cutoff;
}

export function toPublicBatchBoardItem(input: {
  referenceCode: string;
  publicBoardStatus?: PublicBoardStatus | null;
  intakeCutoffAt?: string | null;
  nowMs?: number;
}): PublicBatchBoardItem | null {
  const status = normalizePublicBoardStatus(input.publicBoardStatus ?? 'hidden');
  if (status === 'hidden') return null;
  const parsed = parseBatchReferenceCode(input.referenceCode);
  if (!parsed) return null;
  const cutoff = input.intakeCutoffAt?.trim() || null;
  return {
    referenceCode: input.referenceCode,
    plan: parsed.plan,
    status,
    intakeCutoffAt: cutoff,
    intakeOpen: computeIntakeOpen(status, cutoff, input.nowMs),
  };
}

export type CutoffUrgency = 'ok' | 'soon' | 'closed' | 'none';

export function cutoffUrgency(
  item: PublicBatchBoardItem,
  nowMs: number = Date.now(),
): CutoffUrgency {
  if (!item.intakeCutoffAt) return 'none';
  const cutoff = Date.parse(item.intakeCutoffAt);
  if (Number.isNaN(cutoff)) return 'none';
  if (nowMs >= cutoff || (item.status === 'intake' && !item.intakeOpen)) return 'closed';
  if (item.status !== 'intake') return 'closed';
  const hoursLeft = (cutoff - nowMs) / (1000 * 60 * 60);
  if (hoursLeft <= 48) return 'soon';
  return 'ok';
}

export function formatCountdown(
  intakeCutoffAt: string | null,
  nowMs: number = Date.now(),
): {
  kind: 'open' | 'closed' | 'none';
  labelParts: { days: number; hours: number; minutes: number } | null;
} {
  if (!intakeCutoffAt) return { kind: 'none', labelParts: null };
  const cutoff = Date.parse(intakeCutoffAt);
  if (Number.isNaN(cutoff)) return { kind: 'none', labelParts: null };
  const diff = cutoff - nowMs;
  if (diff <= 0) return { kind: 'closed', labelParts: null };
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { kind: 'open', labelParts: { days, hours, minutes } };
}

const PHASE_ORDER: PublicBoardPhase[] = ['intake', 'atPsa', 'returning', 'pickup'];

export function phaseIndex(status: PublicBoardPhase): number {
  return PHASE_ORDER.indexOf(status);
}

export function phaseProgress(status: PublicBoardPhase): number {
  const idx = phaseIndex(status);
  if (idx < 0) return 0;
  return idx / (PHASE_ORDER.length - 1);
}

export function getMockPublicBatchBoard(nowMs: number = Date.now()): PublicBatchBoardResponse {
  const inTwoDays = new Date(nowMs + 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString();
  const inFiveDays = new Date(nowMs + 5 * 24 * 60 * 60 * 1000).toISOString();
  const past = new Date(nowMs - 24 * 60 * 60 * 1000).toISOString();

  const raw = [
    {
      referenceCode: 'BAT-2026-07-EXP-1',
      publicBoardStatus: 'intake' as const,
      intakeCutoffAt: inTwoDays,
    },
    {
      referenceCode: 'BAT-2026-07-VPLS-2',
      publicBoardStatus: 'intake' as const,
      intakeCutoffAt: inFiveDays,
    },
    {
      referenceCode: 'BAT-2026-06-EXP-3',
      publicBoardStatus: 'atPsa' as const,
      intakeCutoffAt: past,
    },
  ];

  const batches = raw
    .map((row) => toPublicBatchBoardItem({ ...row, nowMs }))
    .filter((row): row is PublicBatchBoardItem => row != null);

  return { batches, updatedAt: new Date(nowMs).toISOString() };
}

function isBoardPayload(payload: unknown): payload is PublicBatchBoardResponse {
  if (!payload || typeof payload !== 'object') return false;
  if (!('batches' in payload) || !Array.isArray((payload as { batches: unknown }).batches)) {
    return false;
  }
  return true;
}

function normalizeBoardResponse(payload: PublicBatchBoardResponse, nowMs: number): PublicBatchBoardResponse {
  const batches = payload.batches
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const referenceCode = String((row as PublicBatchBoardItem).referenceCode ?? '');
      const statusRaw = (row as { status?: unknown; publicBoardStatus?: unknown }).status
        ?? (row as { publicBoardStatus?: unknown }).publicBoardStatus;
      const status = normalizePublicBoardStatus(statusRaw ?? 'hidden');
      if (status === 'hidden') return null;
      return toPublicBatchBoardItem({
        referenceCode,
        publicBoardStatus: status,
        intakeCutoffAt: (row as PublicBatchBoardItem).intakeCutoffAt ?? null,
        nowMs,
      });
    })
    .filter((row): row is PublicBatchBoardItem => row != null);

  return {
    batches,
    updatedAt: payload.updatedAt,
  };
}

/**
 * Public board fetch. Tries Worker GET /grading/board; falls back to mock in
 * development when Worker is unavailable or not yet shipping these fields.
 */
export async function fetchPublicBatchBoard(opts?: {
  forceMock?: boolean;
  nowMs?: number;
}): Promise<PublicBatchBoardResponse> {
  const nowMs = opts?.nowMs ?? Date.now();
  if (opts?.forceMock) return getMockPublicBatchBoard(nowMs);

  try {
    const response = await fetch(joinBackendUrl('/grading/board'), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        return getMockPublicBatchBoard(nowMs);
      }
      return { batches: [] };
    }

    const payload: unknown = await response.json();
    if (!isBoardPayload(payload)) {
      if (process.env.NODE_ENV !== 'production') {
        return getMockPublicBatchBoard(nowMs);
      }
      return { batches: [] };
    }

    return normalizeBoardResponse(payload, nowMs);
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      return getMockPublicBatchBoard(nowMs);
    }
    return { batches: [] };
  }
}
