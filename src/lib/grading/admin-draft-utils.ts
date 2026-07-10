import type { AdminItem, AdminUpdateItemPayload } from './admin-types';

export function cloneAdminItems(items: AdminItem[]): AdminItem[] {
  return items.map((item) => ({ ...item }));
}

export function itemFieldsDirty(saved: AdminItem, draft: AdminItem): boolean {
  return (
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
    return original ? itemFieldsDirty(original, item) : false;
  });
}

export function itemOrderDirty(saved: AdminItem[], draft: AdminItem[]): boolean {
  if (saved.length !== draft.length) return true;
  return saved.some((item, index) => item.id !== draft[index]?.id);
}

export function itemUpdatePayload(draft: AdminItem): AdminUpdateItemPayload {
  return {
    isPaid: draft.isPaid,
    totalCost: draft.totalCost,
    receivedCost: draft.receivedCost,
    psaUpgraded: draft.psaUpgraded,
  };
}
