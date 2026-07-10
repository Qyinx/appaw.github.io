import type { GradingServicePlan } from './reference-code';

/** PSA OrderProgressStep.step enum 0–8 */
export type PsaProgressStepId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type GradingStepKind = 'appaw' | 'psa';

export interface GradingProgressStep {
  id: string;
  index: number;
  kind: GradingStepKind;
  /** Set when kind === 'psa' */
  psaStep?: PsaProgressStepId;
  completed: boolean;
  label: string;
}

export interface GradingSubmissionItem {
  id: string;
  description: string;
  certNumber: string | null;
  grade: string | null;
}

export interface GradingSubmission {
  id: string;
  referenceCode: string;
  phoneNumber: string;
  customerName: string;
  servicePlan: GradingServicePlan | null;
  intakeGroupId: string | null;
  psaOrderNumber: string | null;
  statusSummary: string;
  problemOrder: boolean;
  gradesReady: boolean;
  shipped: boolean;
  accountingHold: boolean;
  readyForLabelReview: boolean;
  shipCarrier: string | null;
  shipTrackingNumber: string | null;
  lastSyncedAt: string;
  steps: GradingProgressStep[];
  items: GradingSubmissionItem[];
}

export interface GradingRelatedSubmission {
  referenceCode: string;
  servicePlan: GradingServicePlan;
  statusSummary: string;
}

export interface GradingLookupResult {
  submission: GradingSubmission;
  relatedSubmissions?: GradingRelatedSubmission[];
}

export type GradingDemoVariant = 'default' | 'shipped' | 'awaiting' | 'pickup';

/** @deprecated Use PsaProgressStepId */
export type GradingProgressStepId = PsaProgressStepId;
