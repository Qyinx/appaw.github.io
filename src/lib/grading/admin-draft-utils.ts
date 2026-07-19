import type { AdminCreateOrderItemPayload, AdminItem, AdminUpdateItemPayload } from './admin-types';

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

export function itemFieldsDirty(saved: AdminItem, draft: AdminItem): boolean {
  return (
    saved.cardName !== draft.cardName ||
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
      isPaid: draft.isPaid,
      totalCost: draft.totalCost,
      receivedCost: draft.receivedCost,
      psaUpgraded: draft.psaUpgraded,
    };
  }

  const payload: AdminUpdateItemPayload = {};
  if (saved.cardName !== draft.cardName) payload.cardName = draft.cardName;
  if (saved.isPaid !== draft.isPaid) payload.isPaid = draft.isPaid;
  if (saved.totalCost !== draft.totalCost) payload.totalCost = draft.totalCost;
  if (saved.receivedCost !== draft.receivedCost) payload.receivedCost = draft.receivedCost;
  if (saved.psaUpgraded !== draft.psaUpgraded) payload.psaUpgraded = draft.psaUpgraded;
  return payload;
}

export function createOrderItemPayload(draft: AdminItem): AdminCreateOrderItemPayload {
  return {
    cardName: draft.cardName.trim(),
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
    totalCost: null,
    receivedCost: null,
    psaUpgraded: false,
    submissionOrder,
  };
}
