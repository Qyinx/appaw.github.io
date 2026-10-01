/**
 * PATCH customer-order pickup — own module so Turbopack HMR cannot stick to a
 * missing named export on the large admin-api barrel.
 */
import { joinBackendUrl } from '@/lib/collection/backendUrl';
import type { AdminCustomerOrder, AdminUpdateCustomerOrderPayload } from './admin-types';
import { clearOpsSession, getOpsToken, invalidateGradingListCache } from './admin-api';

async function parseOpsJson(res: Response): Promise<unknown> {
  const payload = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearOpsSession();
    throw new Error('Session expired — log in again');
  }
  if (!res.ok) {
    const message =
      typeof payload === 'object' &&
      payload &&
      'error' in payload &&
      (payload as { error: unknown }).error != null
        ? String((payload as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return payload;
}

/** Mark / clear whether the customer collected cards at 138 Arena. */
export async function setOrderPickedUp(
  orderId: number,
  pickedUp: boolean,
): Promise<AdminCustomerOrder> {
  const token = getOpsToken();
  if (!token) throw new Error('Ops session required');

  const body: AdminUpdateCustomerOrderPayload = { pickedUp };
  const res = await fetch(joinBackendUrl(`/grading/customer-orders/${orderId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Ops-Key': token,
    },
    body: JSON.stringify(body),
  });

  const payload = (await parseOpsJson(res)) as { customerOrder?: AdminCustomerOrder };
  if (!payload.customerOrder) throw new Error('Customer order update failed');

  // Drop all short-lived list/detail caches so rails + tables refetch fresh counts.
  invalidateGradingListCache();
  return payload.customerOrder;
}
