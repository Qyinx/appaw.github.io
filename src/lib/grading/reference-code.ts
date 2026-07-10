/** PSA service plan suffix used by BAT batch references. */
export type GradingServicePlan = 'REG' | 'EXP' | 'SPX' | 'WALK';

export const GRADING_SERVICE_PLAN_CODES: GradingServicePlan[] = ['REG', 'EXP', 'SPX', 'WALK'];

export const GRADING_SERVICE_PLAN_LABELS: Record<GradingServicePlan, string> = {
  REG: 'Regular',
  EXP: 'Express',
  SPX: 'Super Express',
  WALK: 'Walk-Through',
};
