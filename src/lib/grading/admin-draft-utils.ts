import type { AdminCreateOrderItemPayload, AdminItem, AdminUpdateItemPayload } from './admin-types';

export const DRAFT_ITEM_ID_PREFIX = 'draft-';

export function isDraftItemId(id: string): boolean {
  return id.startsWith(DRAFT_ITEM_ID_PREFIX);
}

export function cloneAdminItems(items: AdminItem[]): AdminItem[] {
  return items.map((item) => ({ ...item }));
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

export function itemUpdatePayload(draft: AdminItem): AdminUpdateItemPayload {
  return {
    cardName: draft.cardName,
    isPaid: draft.isPaid,
    totalCost: draft.totalCost,
    receivedCost: draft.receivedCost,
    psaUpgraded: draft.psaUpgraded,
  };
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
    isPaid: false,
    totalCost: null,
    receivedCost: null,
    psaUpgraded: false,
    submissionOrder,
  };
}
