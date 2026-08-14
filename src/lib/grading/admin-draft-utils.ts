import type { AdminCreateOrderItemPayload, AdminItem, AdminUpdateItemPayload } from './admin-types';
import { parseServicePlanLabel } from './admin-types';
import { getPsaDefaultTotalCost } from './psa-pricing';

export const DRAFT_ITEM_ID_PREFIX = 'draft-';

export function isDraftItemId(id: string): boolean {
  return id.startsWith(DRAFT_ITEM_ID_PREFIX);
}

export function cloneAdminItems(items: AdminItem[]): AdminItem[] {
  return items.map((item) => ({
    ...item,
    certNumber: item.certNumber ?? null,
    grade: item.grade ?? null,
    images: item.images ? item.images.map((img) => ({ ...img })) : [],
  }));
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function itemFieldsDirty(saved: AdminItem, draft: AdminItem): boolean {
  return (
    saved.cardName !== draft.cardName ||
    normalizeNullableString(saved.certNumber) !== normalizeNullableString(draft.certNumber) ||
    normalizeNullableString(saved.grade) !== normalizeNullableString(draft.grade) ||
    saved.isPaid !== draft.isPaid ||
    saved.totalCost !== draft.totalCost ||
    saved.receivedCost !== draft.receivedCost ||
    saved.psaUpgraded !== draft.psaUpgraded
  );
}

export function anyItemFieldsDirty(saved: AdminItem[], draft: AdminItem[]): boolean {
  const savedById = new Map(saved.map((item) => [item.id, item]));
  return draft.some((item) => {
    const original = savedById.get(item.id);
    return original ? itemFieldsDirty(original, item) : !isDraftItemId(item.id);
  });
}

export function itemOrderDirty(saved: AdminItem[], draft: AdminItem[]): boolean {
  if (saved.length !== draft.length) return true;
  return saved.some((item, index) => item.id !== draft[index]?.id);
}

/**
 * Build PATCH body for an item.
 * When `saved` is provided, only include changed fields — critical because sending
 * `cardName` (structural) while batch progress > step 0 makes the API return 409.
 */
export function itemUpdatePayload(
  draft: AdminItem,
  saved?: AdminItem,
): AdminUpdateItemPayload {
  if (!saved) {
    return {
      cardName: draft.cardName,
      certNumber: normalizeNullableString(draft.certNumber),
      grade: normalizeNullableString(draft.grade),
      isPaid: draft.isPaid,
      totalCost: draft.totalCost,
      receivedCost: draft.receivedCost,
      psaUpgraded: draft.psaUpgraded,
    };
  }

  const payload: AdminUpdateItemPayload = {};
  if (saved.cardName !== draft.cardName) payload.cardName = draft.cardName;
  if (
    normalizeNullableString(saved.certNumber) !== normalizeNullableString(draft.certNumber)
  ) {
    payload.certNumber = normalizeNullableString(draft.certNumber);
  }
  if (normalizeNullableString(saved.grade) !== normalizeNullableString(draft.grade)) {
    payload.grade = normalizeNullableString(draft.grade);
  }
  if (saved.isPaid !== draft.isPaid) payload.isPaid = draft.isPaid;
  if (saved.totalCost !== draft.totalCost) payload.totalCost = draft.totalCost;
  if (saved.receivedCost !== draft.receivedCost) payload.receivedCost = draft.receivedCost;
  if (saved.psaUpgraded !== draft.psaUpgraded) payload.psaUpgraded = draft.psaUpgraded;
  return payload;
}

export function createOrderItemPayload(draft: AdminItem): AdminCreateOrderItemPayload {
  return {
    cardName: draft.cardName.trim(),
    certNumber: normalizeNullableString(draft.certNumber),
    grade: normalizeNullableString(draft.grade),
    isPaid: draft.isPaid,
    totalCost: draft.totalCost,
    receivedCost: draft.receivedCost,
    psaUpgraded: draft.psaUpgraded,
  };
}

export function createDraftItem(
  customerOrder: { id: number; submissionId: string; batchReferenceCode: string; customerName: string; phoneNumber: string },
  submissionOrder: number,
): AdminItem {
  const plan = parseServicePlanLabel(customerOrder.batchReferenceCode);
  const totalCost = plan === '—' ? null : getPsaDefaultTotalCost(plan);

  return {
    id: `${DRAFT_ITEM_ID_PREFIX}${crypto.randomUUID()}`,
    customerOrderId: customerOrder.id,
    submissionId: customerOrder.submissionId,
    batchReferenceCode: customerOrder.batchReferenceCode,
    customerName: customerOrder.customerName,
    phoneNumber: customerOrder.phoneNumber,
    cardName: '',
    certNumber: null,
    grade: null,
    images: [],
    isPaid: false,
    totalCost,
    receivedCost: null,
    psaUpgraded: false,
    submissionOrder,
  };
}

export function isCardNameFilled(cardName: string): boolean {
  return cardName.trim().length > 0;
}

/** Unfilled names stay at top (compose zone); filled settle to bottom. */
export function partitionItemsByCardNameFill<T extends { cardName: string }>(items: T[]): T[] {
  const { pending, filled } = splitItemsByCardNameFill(items);
  return [...pending, ...filled];
}

export function splitItemsByCardNameFill<T extends { cardName: string }>(items: T[]): {
  pending: T[];
  filled: T[];
} {
  const pending: T[] = [];
  const filled: T[] = [];
  for (const item of items) {
    if (isCardNameFilled(item.cardName)) filled.push(item);
    else pending.push(item);
  }
  return { pending, filled };
}

export function renumberSubmissionOrder(items: AdminItem[]): AdminItem[] {
  return items.map((item, index) => ({ ...item, submissionOrder: index + 1 }));
}

/** Settle filled rows to bottom and refresh submissionOrder. */
export function settleItemsByCardName(items: AdminItem[]): AdminItem[] {
  return renumberSubmissionOrder(partitionItemsByCardNameFill(items));
}
