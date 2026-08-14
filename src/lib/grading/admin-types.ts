import { parseBatchReferenceCode } from './batch-reference-code';
import type { GradingServicePlan } from './reference-code';
import type { PublicBoardStatus } from './public-board';

export interface AdminBatch {
  id: string;
  /** PSA batch reference, BAT-YYYY-MM-PLAN-R. */
  referenceCode: string;
  psaSubmissionNumber: number | null;
  psaOrderNumber: number | null;
  completedStepIndex: number;
  orderCount: number;
  cardCount: number;
  /** Ops-only rich text notes (TipTap HTML). */
  notes?: string | null;
  /** ISO date YYYY-MM-DD. */
  estShippingDate?: string | null;
  /**
   * Manual hub board status. `hidden` = not listed on /business/psa-grading/.
   * Not auto-synced from PSA.
   */
  publicBoardStatus?: PublicBoardStatus | null;
  /** Manual intake cutoff ISO datetime for the public board countdown. */
  intakeCutoffAt?: string | null;
  createdAt?: string;
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
  createdAt?: string;
  updatedAt: string;
  paymentSummary?: AdminPaymentSummary;
}

/** Grading customer identity (phone-keyed). */
export interface AdminGradingCustomer {
  id: string;
  phoneNumber: string;
  customerName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminItemImage {
  seq: number;
  url: string;
}

export interface AdminItem {
  id: string;
  customerOrderId: number;
  submissionId: string;
  batchReferenceCode: string;
  customerName: string;
  phoneNumber: string;
  cardName: string;
  certNumber: string | null;
  grade: string | null;
  images: AdminItemImage[];
  isPaid: boolean;
  totalCost: number | null;
  receivedCost: number | null;
  psaUpgraded: boolean;
  submissionOrder: number;
}

/** Light GET/PATCH batch response — counts only, no orders/items. */
export interface AdminBatchSummary {
  batch: AdminBatch;
}

/** Assembled client-side or via ?include=full. */
export interface AdminBatchDetail {
  batch: AdminBatch;
  customerOrders: AdminCustomerOrder[];
  items: AdminItem[];
}

export interface AdminCustomerOrderDetail {
  customerOrder: AdminCustomerOrder;
  items: AdminItem[];
  /** Batch submission progress — card add/remove allowed only at step 0. */
  batchCompletedStepIndex: number;
}

export interface AdminIntakeItemDraft {
  cardName: string;
  /** Existing PSA cert — required in practice for RHLD. */
  certNumber?: string | null;
  /** Intake current grade (optional); PSA CSV overwrites after return. */
  grade?: string | null;
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
  publicBoardStatus?: PublicBoardStatus | null;
  intakeCutoffAt?: string | null;
}

export interface AdminUpdateItemPayload {
  cardName?: string;
  certNumber?: string | null;
  grade?: string | null;
  isPaid?: boolean;
  totalCost?: number | null;
  receivedCost?: number | null;
  psaUpgraded?: boolean;
}

export interface AdminApplyBatchGradesPayload {
  items: Array<{
    id: string;
    certNumber: string | null;
    grade: string | null;
  }>;
}

/** JSON base64 upload of pre-extracted images for one batch item. */
export interface AdminImportBatchImageEntry {
  seq?: number;
  contentType: string;
  /** Raw base64 (no data: prefix required). */
  data: string;
}

export interface AdminImportBatchImagesPayload {
  id: string;
  images: AdminImportBatchImageEntry[];
  force?: boolean;
}

export interface AdminImportBatchImagesResult {
  processed: Array<{
    itemId: string;
    skipped?: boolean;
    reason?: string;
    imageCount?: number;
    images?: AdminItemImage[];
  }>;
  failed: Array<{ itemId: string | null; error: string }>;
}

export interface AdminCreateOrderItemPayload {
  cardName: string;
  certNumber?: string | null;
  grade?: string | null;
  isPaid?: boolean;
  totalCost?: number | null;
  receivedCost?: number | null;
  psaUpgraded?: boolean;
}

/** Batch step index while cards may still be added/removed on an order. */
export const BATCH_CARD_EDIT_STEP = 0;

export interface AdminUpdateBatchPayload {
  psaSubmissionNumber?: number | null;
  psaOrderNumber?: number | null;
  completedStepIndex?: number;
  notes?: string | null;
  estShippingDate?: string | null;
  publicBoardStatus?: PublicBoardStatus | null;
  intakeCutoffAt?: string | null;
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

/** Fully paid via checkbox or received covering total (includes over-receive). */
export function isItemFullyPaid(item: AdminItem): boolean {
  if (item.isPaid) return true;
  if (item.totalCost == null) return false;
  return (item.receivedCost ?? 0) >= item.totalCost;
}

/** Received exceeds listed total — customer has credit on that line. */
export function isItemOverReceived(item: AdminItem): boolean {
  if (item.totalCost == null) return false;
  return (item.receivedCost ?? 0) > item.totalCost;
}

export function parseServicePlanLabel(referenceCode: string): GradingServicePlan | '—' {
  return parseBatchReferenceCode(referenceCode)?.plan ?? '—';
}

export function summarizePayment(items: AdminItem[]): AdminPaymentSummary {
  return items.reduce(
    (acc, item) => ({
      paidCount: acc.paidCount + (isItemFullyPaid(item) ? 1 : 0),
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

export const EMPTY_PAYMENT_SUMMARY: AdminPaymentSummary = {
  paidCount: 0,
  totalCount: 0,
  totalCostSum: 0,
  receivedCostSum: 0,
};
