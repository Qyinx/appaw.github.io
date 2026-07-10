import type { GradingServicePlan } from './reference-code';

const PLAN_SUFFIX_PATTERN = 'REG|EXP|SPX|WALK';

export const BATCH_REFERENCE_CODE_PATTERN = new RegExp(
  `^BAT-\\d{4}-\\d{1,2}-(${PLAN_SUFFIX_PATTERN})-\\d+$`,
  'i',
);

export function formatBatchReferenceCode(
  year: number,
  month: number,
  plan: GradingServicePlan,
  round: number,
): string {
  const m = Math.min(12, Math.max(1, month));
  const r = Math.max(1, Math.round(round));
  return `BAT-${year}-${String(m).padStart(2, '0')}-${plan}-${r}`;
}

export function normalizeBatchReferenceCode(input: string): string | null {
  const trimmed = input.trim().toUpperCase();
  const match = trimmed.match(
    new RegExp(`^BAT-(\\d{4})-(\\d{1,2})-(${PLAN_SUFFIX_PATTERN})-(\\d+)$`),
  );
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const plan = match[3] as GradingServicePlan;
  const round = parseInt(match[4], 10);

  if (year < 2000 || year > 2100 || month < 1 || month > 12 || round < 1) {
    return null;
  }

  return formatBatchReferenceCode(year, month, plan, round);
}

export function isValidBatchReferenceCode(input: string): boolean {
  return normalizeBatchReferenceCode(input) !== null;
}

export interface ParsedBatchReference {
  year: number;
  month: number;
  plan: GradingServicePlan;
  round: number;
}

export function parseBatchReferenceCode(input: string): ParsedBatchReference | null {
  const normalized = normalizeBatchReferenceCode(input);
  if (!normalized) return null;

  const match = normalized.match(/^BAT-(\d{4})-(\d{1,2})-(REG|EXP|SPX|WALK)-(\d+)$/);
  if (!match) return null;

  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    plan: match[3] as GradingServicePlan,
    round: parseInt(match[4], 10),
  };
}

/** Next batch round for year/month/plan, based on existing BAT reference codes. */
export function suggestNextBatchRound(
  existingReferenceCodes: string[],
  year: number,
  month: number,
  plan: GradingServicePlan,
): number {
  const monthPadded = String(month).padStart(2, '0');
  const prefix = `BAT-${year}-${monthPadded}-${plan}-`;
  let maxRound = 0;

  for (const code of existingReferenceCodes) {
    const parsed = parseBatchReferenceCode(code);
    if (!parsed) continue;
    if (parsed.year !== year || parsed.month !== month || parsed.plan !== plan) continue;
    maxRound = Math.max(maxRound, parsed.round);
  }

  return Math.max(1, maxRound + 1);
}
