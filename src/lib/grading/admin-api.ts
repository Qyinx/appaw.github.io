/**
 * Grading admin API client — direct calls to the Cloudflare Worker.
 * Auth: POST /grading/auth → JWT in sessionStorage → X-Ops-Key on ops routes.
 * @see appaw.store.backend/docs/API-ADMIN.md
 */
import { joinBackendUrl } from '@/lib/collection/backendUrl';
import { adminMockStore } from './admin-mock-store';
import type {
  AdminBatch,
  AdminBatchDetail,
  AdminCreateBatchPayload,
  AdminCustomerOrder,
  AdminCustomerOrderDetail,
  AdminIntakePayload,
  AdminItem,
  AdminUpdateBatchPayload,
  AdminUpdateItemPayload,
} from './admin-types';

/** Set NEXT_PUBLIC_GRADING_ADMIN_MOCK=true to use in-memory preview data. */
export const USE_ADMIN_MOCK = process.env.NEXT_PUBLIC_GRADING_ADMIN_MOCK === 'true';

const MOCK_DELAY_MS = 220;
const OPS_TOKEN_KEY = 'aaw-grading-ops-token';

/** e.g. gradingPath('/batches') → {BACKEND}/grading/batches */
function gradingPath(segment: string): string {
  const normalized = segment.replace(/^\/+/, '');
  return joinBackendUrl(normalized ? `/grading/${normalized}` : '/grading');
}

export function setOpsToken(token: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(OPS_TOKEN_KEY, token);
}

export function getOpsToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(OPS_TOKEN_KEY);
}

export function clearOpsSession(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(OPS_TOKEN_KEY);
  sessionStorage.removeItem('aaw-adm');
}

export function hasOpsSession(): boolean {
  return Boolean(getOpsToken());
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

function errorFromPayload(payload: unknown, fallback: string): string {
  if (typeof payload === 'object' && payload && 'error' in payload) {
    return String((payload as { error: unknown }).error);
  }
  return fallback;
}

async function parseJsonResponse(res: Response) {
  const payload = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearOpsSession();
    throw new Error('Session expired — log in again');
  }

  if (!res.ok) {
    throw new Error(errorFromPayload(payload, `Request failed (${res.status})`));
  }

  return payload;
}

/** POST /grading/auth — no X-Ops-Key (API-ADMIN.md § Login). */
async function gradingLogin(password: string): Promise<string> {
  const res = await fetch(gradingPath('auth'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const payload = (await parseJsonResponse(res)) as { ok?: boolean; token?: string };
  if (!payload.token) throw new Error('Auth response missing token');
  return payload.token;
}

/** Ops routes — X-Ops-Key JWT on every request (API-ADMIN.md § Ops requests). */
async function gradingOpsFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getOpsToken();
  if (!token) throw new Error('Ops session required');

  return fetch(joinBackendUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Ops-Key': token,
      ...(init?.headers ?? {}),
    },
  });
}

export async function verifyGradingAdminAuth(password: string): Promise<void> {
  if (USE_ADMIN_MOCK) {
    if (!password.trim()) throw new Error('Password required');
    return delay(undefined);
  }

  try {
    setOpsToken(await gradingLogin(password));
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach grading backend. Is the Worker running on :8787?');
    }
    throw error;
  }
}

export async function listBatches(): Promise<AdminBatch[]> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.listBatches());
  const res = await gradingOpsFetch('/grading/batches');
  const payload = (await parseJsonResponse(res)) as { batches?: AdminBatch[] };
  return payload.batches ?? [];
}

export async function createBatch(payload: AdminCreateBatchPayload): Promise<AdminBatch> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.createBatch(payload));
  const res = await gradingOpsFetch('/grading/batches', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const parsed = (await parseJsonResponse(res)) as { batch?: AdminBatch };
  if (!parsed.batch) throw new Error('Batch create failed');
  return parsed.batch;
}

export async function getBatch(referenceCode: string): Promise<AdminBatchDetail | null> {
  if (USE_ADMIN_MOCK) {
    return delay(adminMockStore.getBatch(decodeURIComponent(referenceCode)));
  }
  const res = await gradingOpsFetch(
    `/grading/batches/${encodeURIComponent(referenceCode)}`,
  );
  if (res.status === 404) return null;
  return (await parseJsonResponse(res)) as AdminBatchDetail;
}

export async function updateBatch(
  referenceCode: string,
  patch: AdminUpdateBatchPayload,
): Promise<AdminBatchDetail> {
  if (USE_ADMIN_MOCK) {
    return delay(adminMockStore.updateBatch(decodeURIComponent(referenceCode), patch));
  }
  const res = await gradingOpsFetch(`/grading/batches/${encodeURIComponent(referenceCode)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return (await parseJsonResponse(res)) as AdminBatchDetail;
}

export async function listCustomerOrders(): Promise<AdminCustomerOrder[]> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.listCustomerOrders());
  const res = await gradingOpsFetch('/grading/customer-orders');
  const payload = (await parseJsonResponse(res)) as { customerOrders?: AdminCustomerOrder[] };
  return payload.customerOrders ?? [];
}

export async function getCustomerOrder(orderId: number): Promise<AdminCustomerOrderDetail | null> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.getCustomerOrder(orderId));
  const res = await gradingOpsFetch(`/grading/customer-orders/${orderId}`);
  if (res.status === 404) return null;
  return (await parseJsonResponse(res)) as AdminCustomerOrderDetail;
}

export async function listItemsForCustomerOrder(customerOrderId: number): Promise<AdminItem[]> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.listItemsForCustomerOrder(customerOrderId));
  const res = await gradingOpsFetch(`/grading/items?customerOrderId=${customerOrderId}`);
  const payload = (await parseJsonResponse(res)) as { items?: AdminItem[] };
  return payload.items ?? [];
}

export async function createIntake(
  payload: AdminIntakePayload,
): Promise<{ customerOrder: AdminCustomerOrder }> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.createIntake(payload));
  const res = await gradingOpsFetch('/grading/customer-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return (await parseJsonResponse(res)) as { customerOrder: AdminCustomerOrder };
}

export async function updateItem(itemId: string, patch: AdminUpdateItemPayload): Promise<AdminItem> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.updateItem(itemId, patch));
  const res = await gradingOpsFetch(`/grading/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const payload = (await parseJsonResponse(res)) as { item?: AdminItem; data?: AdminItem };
  const item = payload.item ?? payload.data;
  if (!item) throw new Error('Item update failed');
  return item;
}

export async function reorderCustomerOrderItems(
  orderId: number,
  itemIds: string[],
): Promise<AdminItem[]> {
  if (USE_ADMIN_MOCK) return delay(adminMockStore.reorderCustomerOrderItems(orderId, itemIds));
  const res = await gradingOpsFetch(`/grading/customer-orders/${orderId}/items/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ itemIds }),
  });
  const payload = (await parseJsonResponse(res)) as { items?: AdminItem[] };
  if (!payload.items) throw new Error('Item reorder failed');
  return payload.items;
}
