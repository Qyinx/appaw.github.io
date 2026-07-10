import { parseBatchReferenceCode } from './batch-reference-code';
import type { GradingServicePlan } from './reference-code';

export interface AdminBatch {
  id: string;
  /** PSA batch reference, BAT-YYYY-MM-PLAN-R. */
  referenceCode: string;
  psaSubmissionNumber: number | null;
  psaOrderNumber: number | null;
  completedStepIndex: number;
  orderCount: number;
  cardCount: number;
  updatedAt: string;
}

export interface AdminCustomerOrder {
  id: number;
  submissionId: string;
  customerId: string;
  batchReferenceCode: string;
  customerName: string;
  phoneNumber: string;
  itemCount: number;
  updatedAt: string;
}

export interface AdminItem {
  id: string;
  customerOrderId: number;
  submissionId: string;
  batchReferenceCode: string;
  customerName: string;
  phoneNumber: string;
  cardName: string;
  isPaid: boolean;
  totalCost: number | null;
  receivedCost: number | null;
  psaUpgraded: boolean;
  submissionOrder: number;
}

export interface AdminBatchDetail {
  batch: AdminBatch;
  customerOrders: AdminCustomerOrder[];
  items: AdminItem[];
}

export interface AdminCustomerOrderDetail {
  customerOrder: AdminCustomerOrder;
  items: AdminItem[];
}

export interface AdminIntakeItemDraft {
  cardName: string;
  isPaid: boolean;
  totalCost: number | null;
  receivedCost: number | null;
  psaUpgraded: boolean;
}

export interface AdminIntakePayload {
  batchReferenceCode: string;
  customerName: string;
  phoneNumber: string;
  items: AdminIntakeItemDraft[];
}

export interface AdminCreateBatchPayload {
  referenceCode: string;
  psaSubmissionNumber?: number | null;
  psaOrderNumber?: number | null;
  completedStepIndex?: number;
}

export interface AdminUpdateItemPayload {
  isPaid?: boolean;
  totalCost?: number | null;
  receivedCost?: number | null;
  psaUpgraded?: boolean;
}

export interface AdminUpdateBatchPayload {
  psaSubmissionNumber?: number | null;
  psaOrderNumber?: number | null;
  completedStepIndex?: number;
}

export interface AdminReorderItemsPayload {
  itemIds: string[];
}

export interface AdminPaymentSummary {
  paidCount: number;
  totalCount: number;
  totalCostSum: number;
  receivedCostSum: number;
}

export function parseServicePlanLabel(referenceCode: string): GradingServicePlan | '—' {
  return parseBatchReferenceCode(referenceCode)?.plan ?? '—';
}

export function summarizePayment(items: AdminItem[]): AdminPaymentSummary {
  return items.reduce(
    (acc, item) => ({
      paidCount: acc.paidCount + (item.isPaid ? 1 : 0),
      totalCount: acc.totalCount + 1,
      totalCostSum: acc.totalCostSum + (item.totalCost ?? 0),
      receivedCostSum: acc.receivedCostSum + (item.receivedCost ?? 0),
    }),
    { paidCount: 0, totalCount: 0, totalCostSum: 0, receivedCostSum: 0 },
  );
}

export function formatPaymentSummary(summary: AdminPaymentSummary): string {
  const paid = `${summary.paidCount}/${summary.totalCount} paid`;
  const costs = `HKD ${summary.receivedCostSum} / ${summary.totalCostSum}`;
  return `${paid} · ${costs}`;
}
