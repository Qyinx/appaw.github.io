/**
 * Grading admin API client — direct calls to the Cloudflare Worker.
 * Auth: POST /grading/auth → JWT in sessionStorage → X-Ops-Key on ops routes.
 * @see appaw.store.backend/docs/API-ADMIN.md
 */
import { joinBackendUrl } from '@/lib/collection/backendUrl';
import type {
  AdminBatch,
  AdminBatchSummary,
  AdminApplyBatchGradesPayload,
  AdminCreateBatchPayload,
  AdminCreateOrderItemPayload,
  AdminCustomerOrder,
  AdminCustomerOrderDetail,
  AdminGradingCustomer,
  AdminImportBatchImagesPayload,
  AdminImportBatchImagesResult,
  AdminIntakePayload,
  AdminItem,
  AdminUpdateBatchPayload,
  AdminUpdateItemPayload,
} from './admin-types';

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
async function gradingLogin(password: string, turnstileToken: string): Promise<string> {
  const res = await fetch(gradingPath('auth'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, turnstileToken }),
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

export async function verifyGradingAdminAuth(
  password: string,
  turnstileToken: string,
): Promise<void> {
  if (!turnstileToken.trim()) {
    throw new Error('Turnstile token required');
  }
  try {
    setOpsToken(await gradingLogin(password, turnstileToken));
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach grading backend. Is the Worker running on :8787?');
    }
    throw error;
  }
}

function mapGradingCustomer(row: Record<string, unknown>): AdminGradingCustomer {
  return {
    id: String(row.id ?? ''),
    phoneNumber: String(row.phone_number ?? row.phoneNumber ?? ''),
    customerName: String(row.customer_name ?? row.customerName ?? ''),
    createdAt:
      typeof row.created_at === 'string'
        ? row.created_at
        : typeof row.createdAt === 'string'
          ? row.createdAt
          : undefined,
    updatedAt:
      typeof row.updated_at === 'string'
        ? row.updated_at
        : typeof row.updatedAt === 'string'
          ? row.updatedAt
          : undefined,
  };
}

export const MIN_CUSTOMER_PHONE_SEARCH = 4;

/** Search grading customers by phone substring (`GET /grading/customers?phone=`). */
export async function searchCustomersByPhone(phoneQuery: string): Promise<AdminGradingCustomer[]> {
  const q = phoneQuery.trim();
  if (q.replace(/\D/g, '').length < MIN_CUSTOMER_PHONE_SEARCH) return [];

  const params = new URLSearchParams({ phone: q });
  const res = await gradingOpsFetch(`/grading/customers?${params}`);
  const payload = (await parseJsonResponse(res)) as { customers?: Record<string, unknown>[] };
  return (payload.customers ?? []).map(mapGradingCustomer);
}

export type AdminListRange = {
  from?: string;
  to?: string;
};

export type GradingDashboardData = {
  batches: AdminBatch[];
  customerOrders: AdminCustomerOrder[];
};

const LIST_CACHE_MS = 5000;
const listGetCache = new Map<string, { at: number; promise: Promise<unknown> }>();
let dashboardLoadCache: {
  key: string;
  at: number;
  promise: Promise<GradingDashboardData>;
} | null = null;

function customerOrdersQuery(opts?: { submissionId?: string } & AdminListRange): string {
  const params = new URLSearchParams();
  if (opts?.submissionId) params.set('submissionId', opts.submissionId);
  if (opts?.from) params.set('from', opts.from);
  if (opts?.to) params.set('to', opts.to);
  return params.toString();
}

function cachedListGet<T>(key: string, fetcher: () => Promise<T>, force = false): Promise<T> {
  if (!force) {
    const hit = listGetCache.get(key);
    if (hit && Date.now() - hit.at < LIST_CACHE_MS) {
      return hit.promise as Promise<T>;
    }
  }

  const promise = fetcher();
  listGetCache.set(key, { at: Date.now(), promise });
  return promise;
}

/** Clears short-lived GET caches (lists, batch/order detail). Pass before manual Refresh. */
export function invalidateGradingListCache(): void {
  listGetCache.clear();
  dashboardLoadCache = null;
}

function invalidateBatchDetailCache(referenceCode: string): void {
  const normalized = decodeURIComponent(referenceCode);
  listGetCache.delete(`batch:${normalized}`);
  listGetCache.delete(`batch-items:${normalized}`);
}

function invalidateBatchOrdersCache(submissionId: string): void {
  for (const key of listGetCache.keys()) {
    if (key.startsWith('customer-orders:') && key.includes(`submissionId=${submissionId}`)) {
      listGetCache.delete(key);
    }
  }
}

function invalidateCustomerOrderDetailCache(orderId: number): void {
  listGetCache.delete(`customer-order:${orderId}`);
}

export async function loadGradingDashboard(opts?: {
  force?: boolean;
  range?: AdminListRange;
}): Promise<GradingDashboardData> {
  const force = opts?.force ?? false;
  const rangeKey = listRangeQuery(opts?.range);
  const cacheKey = `dashboard:${rangeKey}`;

  if (!force && dashboardLoadCache && dashboardLoadCache.key === cacheKey) {
    if (Date.now() - dashboardLoadCache.at < LIST_CACHE_MS) {
      return dashboardLoadCache.promise;
    }
  }

  const promise = Promise.all([
    listBatches(opts?.range, force),
    listCustomerOrders(opts?.range, force),
  ]).then(([batches, customerOrders]) => ({ batches, customerOrders }));

  dashboardLoadCache = { key: cacheKey, at: Date.now(), promise };
  return promise;
}

export async function listBatches(range?: AdminListRange, force = false): Promise<AdminBatch[]> {
  const cacheKey = `batches:${listRangeQuery(range)}`;
  return cachedListGet(
    cacheKey,
    async () => {
      const res = await gradingOpsFetch(`/grading/batches${listRangeQuery(range)}`);
      const payload = (await parseJsonResponse(res)) as { batches?: AdminBatch[] };
      return payload.batches ?? [];
    },
    force,
  );
}

function listRangeQuery(range?: AdminListRange): string {
  if (!range?.from && !range?.to) return '';
  const params = new URLSearchParams();
  if (range.from) params.set('from', range.from);
  if (range.to) params.set('to', range.to);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function createBatch(payload: AdminCreateBatchPayload): Promise<AdminBatch> {
  const res = await gradingOpsFetch('/grading/batches', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const parsed = (await parseJsonResponse(res)) as { batch?: AdminBatch };
  if (!parsed.batch) throw new Error('Batch create failed');
  return parsed.batch;
}

export async function getBatch(referenceCode: string, force = false): Promise<AdminBatchSummary | null> {
  const normalized = decodeURIComponent(referenceCode);
  const cacheKey = `batch:${normalized}`;
  return cachedListGet(
    cacheKey,
    async () => {
      const res = await gradingOpsFetch(`/grading/batches/${encodeURIComponent(normalized)}`);
      if (res.status === 404) return null;
      return (await parseJsonResponse(res)) as AdminBatchSummary;
    },
    force,
  );
}

export async function updateBatch(
  referenceCode: string,
  patch: AdminUpdateBatchPayload,
): Promise<AdminBatchSummary> {
  const res = await gradingOpsFetch(`/grading/batches/${encodeURIComponent(referenceCode)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const result = (await parseJsonResponse(res)) as AdminBatchSummary;
  invalidateBatchDetailCache(referenceCode);
  return result;
}

export async function applyBatchGrades(
  referenceCode: string,
  payload: AdminApplyBatchGradesPayload,
): Promise<AdminBatchSummary> {
  const res = await gradingOpsFetch(`/grading/batches/${encodeURIComponent(referenceCode)}/grades`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const result = (await parseJsonResponse(res)) as AdminBatchSummary;
  invalidateBatchDetailCache(referenceCode);
  return result;
}

export async function importBatchImages(
  referenceCode: string,
  payload: AdminImportBatchImagesPayload,
): Promise<AdminImportBatchImagesResult> {
  const res = await gradingOpsFetch(
    `/grading/batches/${encodeURIComponent(referenceCode)}/import-images`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
  const result = (await parseJsonResponse(res)) as AdminImportBatchImagesResult;
  invalidateBatchDetailCache(referenceCode);
  return result;
}

export async function listCustomerOrders(
  opts?: { submissionId?: string } & AdminListRange,
  force = false,
): Promise<AdminCustomerOrder[]> {
  const qs = customerOrdersQuery(opts);
  const cacheKey = `customer-orders:${qs}`;
  return cachedListGet(
    cacheKey,
    async () => {
      const res = await gradingOpsFetch(`/grading/customer-orders${qs ? `?${qs}` : ''}`);
      const payload = (await parseJsonResponse(res)) as { customerOrders?: AdminCustomerOrder[] };
      return payload.customerOrders ?? [];
    },
    force,
  );
}

export async function getCustomerOrder(
  orderId: number,
  force = false,
): Promise<AdminCustomerOrderDetail | null> {
  const cacheKey = `customer-order:${orderId}`;
  return cachedListGet(
    cacheKey,
    async () => {
      const res = await gradingOpsFetch(`/grading/customer-orders/${orderId}`);
      if (res.status === 404) return null;
      return (await parseJsonResponse(res)) as AdminCustomerOrderDetail;
    },
    force,
  );
}

export async function listItemsForCustomerOrder(customerOrderId: number): Promise<AdminItem[]> {
  const res = await gradingOpsFetch(`/grading/items?customerOrderId=${customerOrderId}`);
  const payload = (await parseJsonResponse(res)) as { items?: AdminItem[] };
  return payload.items ?? [];
}

export async function listItemsForBatch(
  referenceCode: string,
  force = false,
): Promise<AdminItem[]> {
  const normalized = decodeURIComponent(referenceCode);
  const cacheKey = `batch-items:${normalized}`;
  return cachedListGet(
    cacheKey,
    async () => {
      const res = await gradingOpsFetch(
        `/grading/items?referenceCode=${encodeURIComponent(normalized)}`,
      );
      const payload = (await parseJsonResponse(res)) as { items?: AdminItem[] };
      return payload.items ?? [];
    },
    force,
  );
}

/** Drop cached orders for a batch so the next Orders-tab visit refetches. */
export function invalidateBatchOrders(submissionId: string): void {
  invalidateBatchOrdersCache(submissionId);
}

export async function createIntake(
  payload: AdminIntakePayload,
): Promise<{ customerOrder: AdminCustomerOrder }> {
  const res = await gradingOpsFetch('/grading/customer-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return (await parseJsonResponse(res)) as { customerOrder: AdminCustomerOrder };
}

export async function createCustomerOrderItem(
  orderId: number,
  payload: AdminCreateOrderItemPayload,
): Promise<AdminItem> {
  const res = await gradingOpsFetch(`/grading/customer-orders/${orderId}/items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const parsed = (await parseJsonResponse(res)) as { item?: AdminItem };
  if (!parsed.item) throw new Error('Item create failed');
  invalidateCustomerOrderDetailCache(orderId);
  return parsed.item;
}

export async function deleteCustomerOrderItem(itemId: string): Promise<void> {
  const res = await gradingOpsFetch(`/grading/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  });
  await parseJsonResponse(res);
  invalidateGradingListCache();
}

export async function updateItem(itemId: string, patch: AdminUpdateItemPayload): Promise<AdminItem> {
  if (Object.keys(patch).length === 0) {
    throw new Error('Item update has no changed fields');
  }
  const res = await gradingOpsFetch(`/grading/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const payload = (await parseJsonResponse(res)) as { item?: AdminItem; data?: AdminItem };
  const item = payload.item ?? payload.data;
  if (!item) throw new Error('Item update failed');
  // Payment edits affect order detail + dashboard payment summaries.
  invalidateGradingListCache();
  return item;
}

export async function reorderCustomerOrderItems(
  orderId: number,
  itemIds: string[],
): Promise<AdminItem[]> {
  const res = await gradingOpsFetch(`/grading/customer-orders/${orderId}/items/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ itemIds }),
  });
  const payload = (await parseJsonResponse(res)) as { items?: AdminItem[] };
  if (!payload.items) throw new Error('Item reorder failed');
  return payload.items;
}
