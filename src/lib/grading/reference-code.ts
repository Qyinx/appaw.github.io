/** PSA service plan suffix used by BAT batch references. */
export type GradingServicePlan =
  | 'VBLK'
  | 'VPLS'
  | 'VMAX'
  | 'REG'
  | 'EXP'
  | 'SPX'
  | 'WALK'
  | 'PRE1'
  | 'PRE2'
  | 'PRE3';

/** Longer codes first so BAT suffix regex never partial-matches. */
export const GRADING_SERVICE_PLAN_CODES: GradingServicePlan[] = [
  'VBLK',
  'VPLS',
  'VMAX',
  'REG',
  'EXP',
  'SPX',
  'WALK',
  'PRE1',
  'PRE2',
  'PRE3',
];

export const GRADING_SERVICE_PLAN_LABELS: Record<GradingServicePlan, string> = {
  VBLK: 'Value Bulk',
  VPLS: 'Value Plus',
  VMAX: 'Value Max',
  REG: 'Regular',
  EXP: 'Express',
  SPX: 'Super Express',
  WALK: 'Walk-Through',
  PRE1: 'Premium 1',
  PRE2: 'Premium 2',
  PRE3: 'Premium 3',
};

/** Alternation for BAT-YYYY-MM-PLAN-N parsers and HTML pattern attrs. */
export const GRADING_SERVICE_PLAN_SUFFIX_PATTERN = GRADING_SERVICE_PLAN_CODES.join('|');
