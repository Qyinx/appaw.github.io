const BATCH_RESERVED = new Set(['view', 'new']);
const ORDER_RESERVED = new Set(['view']);

/** Static-export-safe batch detail URL (client router can reach `/view/`). */
export function batchDetailHref(referenceCode: string): string {
  return `/admin/psa-grading/batches/view/?ref=${encodeURIComponent(referenceCode)}`;
}

/** Static-export-safe customer order detail URL. */
export function customerOrderDetailHref(orderId: number): string {
  return `/admin/psa-grading/orders/view/?id=${encodeURIComponent(String(orderId))}`;
}

/** Parse batch ref from query (`?ref=`) or pretty path (`/batches/:code/`). */
export function batchReferenceFromLocation(pathname: string, search: string): string {
  const fromQuery = new URLSearchParams(search).get('ref')?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const match = pathname.match(/\/(?:zh\/)?admin\/psa-grading\/batches\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || BATCH_RESERVED.has(segment)) return '';
  return decodeURIComponent(segment);
}

/** Parse order id from query (`?id=`) or pretty path (`/orders/:id/`). */
export function customerOrderIdFromLocation(pathname: string, search: string): number | null {
  const fromQuery = new URLSearchParams(search).get('id')?.trim();
  if (fromQuery) {
    const parsed = Number(fromQuery);
    if (Number.isFinite(parsed) && parsed >= 1) return parsed;
  }

  const match = pathname.match(/\/(?:zh\/)?admin\/psa-grading\/orders\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || ORDER_RESERVED.has(segment)) return null;
  const parsed = Number(segment);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}
