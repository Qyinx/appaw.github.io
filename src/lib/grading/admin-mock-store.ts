import { normalizeBatchReferenceCode } from './batch-reference-code';
import { createInitialAdminMock } from './admin-mock-data';
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

const now = () => new Date().toISOString();

let batches: AdminBatch[] = [];
let customerOrders: AdminCustomerOrder[] = [];
let items: AdminItem[] = [];

function resetFromSeed() {
  const seed = createInitialAdminMock();
  batches = seed.batches.map((b) => ({ ...b }));
  customerOrders = seed.customerOrders.map((o) => ({ ...o }));
  items = seed.items.map((i) => ({ ...i }));
}

resetFromSeed();

function nextCustomerOrderId(): number {
  return customerOrders.reduce((max, order) => Math.max(max, order.id), 1000) + 1;
}

function syncBatchCounts(batchId: string) {
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return;

  const orders = customerOrders.filter((o) => o.submissionId === batchId);
  const orderIds = new Set(orders.map((o) => o.id));
  batch.orderCount = orders.length;
  batch.cardCount = items.filter((i) => orderIds.has(i.customerOrderId)).length;
  batch.updatedAt = now();
}

function syncCustomerOrderCount(orderId: number) {
  const order = customerOrders.find((o) => o.id === orderId);
  if (!order) return;

  order.itemCount = items.filter((i) => i.customerOrderId === orderId).length;
  order.updatedAt = now();
  syncBatchCounts(order.submissionId);
}

function normalizeNumeric(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value);
}

function getBatchOrThrow(referenceCode: string): AdminBatch {
  const normalized = normalizeBatchReferenceCode(referenceCode);
  const batch = normalized ? batches.find((b) => b.referenceCode === normalized) : null;
  if (!batch) throw new Error(`Batch not found: ${referenceCode}`);
  return batch;
}

export const adminMockStore = {
  reset() {
    resetFromSeed();
  },

  listBatches(): AdminBatch[] {
    return [...batches].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  createBatch(payload: AdminCreateBatchPayload): AdminBatch {
    const referenceCode = normalizeBatchReferenceCode(payload.referenceCode);
    if (!referenceCode) throw new Error('Invalid BAT reference.');
    if (batches.some((b) => b.referenceCode === referenceCode)) {
      throw new Error(`Batch already exists: ${referenceCode}`);
    }

    const batch: AdminBatch = {
      id: crypto.randomUUID(),
      referenceCode,
      psaSubmissionNumber: normalizeNumeric(payload.psaSubmissionNumber),
      psaOrderNumber: normalizeNumeric(payload.psaOrderNumber),
      completedStepIndex: payload.completedStepIndex ?? 0,
      orderCount: 0,
      cardCount: 0,
      updatedAt: now(),
    };
    batches.push(batch);
    return batch;
  },

  getBatch(referenceCode: string): AdminBatchDetail | null {
    const normalized = normalizeBatchReferenceCode(referenceCode);
    if (!normalized) return null;
    const batch = batches.find((b) => b.referenceCode === normalized);
    if (!batch) return null;

    const orders = customerOrders.filter((o) => o.submissionId === batch.id);
    const orderIds = new Set(orders.map((o) => o.id));
    const batchItems = items
      .filter((i) => orderIds.has(i.customerOrderId))
      .sort((a, b) => {
        if (a.customerOrderId !== b.customerOrderId) return a.customerOrderId - b.customerOrderId;
        return a.submissionOrder - b.submissionOrder;
      });

    return { batch, customerOrders: orders, items: batchItems };
  },

  updateBatch(referenceCode: string, patch: AdminUpdateBatchPayload): AdminBatchDetail {
    const batch = getBatchOrThrow(referenceCode);

    if (patch.psaSubmissionNumber !== undefined) {
      batch.psaSubmissionNumber = normalizeNumeric(patch.psaSubmissionNumber);
    }
    if (patch.psaOrderNumber !== undefined) {
      batch.psaOrderNumber = normalizeNumeric(patch.psaOrderNumber);
    }
    if (patch.completedStepIndex !== undefined) {
      batch.completedStepIndex = patch.completedStepIndex;
    }
    batch.updatedAt = now();

    const detail = this.getBatch(batch.referenceCode);
    if (!detail) throw new Error('Batch not found after update');
    return detail;
  },

  listCustomerOrders(): AdminCustomerOrder[] {
    return [...customerOrders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  getCustomerOrder(orderId: number): AdminCustomerOrderDetail | null {
    const customerOrder = customerOrders.find((o) => o.id === orderId);
    if (!customerOrder) return null;
    return {
      customerOrder,
      items: this.listItemsForCustomerOrder(orderId),
    };
  },

  listCustomerOrdersForBatch(referenceCode: string): AdminCustomerOrder[] {
    const batch = getBatchOrThrow(referenceCode);
    return customerOrders
      .filter((o) => o.submissionId === batch.id)
      .sort((a, b) => a.id - b.id);
  },

  listItemsForCustomerOrder(customerOrderId: number): AdminItem[] {
    return items
      .filter((i) => i.customerOrderId === customerOrderId)
      .sort((a, b) => a.submissionOrder - b.submissionOrder);
  },

  createIntake(payload: AdminIntakePayload): { customerOrder: AdminCustomerOrder } {
    const batchReferenceCode = normalizeBatchReferenceCode(payload.batchReferenceCode);
    if (!batchReferenceCode) throw new Error('Invalid BAT reference.');
    let batch = batches.find((b) => b.referenceCode === batchReferenceCode);
    if (!batch) {
      batch = {
        id: crypto.randomUUID(),
        referenceCode: batchReferenceCode,
        psaSubmissionNumber: null,
        psaOrderNumber: null,
        completedStepIndex: 0,
        orderCount: 0,
        cardCount: 0,
        updatedAt: now(),
      };
      batches.push(batch);
    }

    const orderId = nextCustomerOrderId();

    const timestamp = now();
    const customerId = `cust-${payload.phoneNumber.replace(/\D/g, '') || crypto.randomUUID()}`;
    if (customerOrders.some((o) => o.submissionId === batch.id && o.customerId === customerId)) {
      throw new Error(`Customer order already exists for ${batchReferenceCode} and ${payload.phoneNumber}`);
    }
    const cardItems = payload.items.filter((i) => i.cardName.trim());
    const customerOrder: AdminCustomerOrder = {
      id: orderId,
      submissionId: batch.id,
      customerId,
      batchReferenceCode: batch.referenceCode,
      customerName: payload.customerName.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      itemCount: cardItems.length || 1,
      updatedAt: timestamp,
    };

    customerOrders.push(customerOrder);

    const toInsert = cardItems.length
      ? cardItems
      : [{ cardName: 'Unnamed card', isPaid: false, totalCost: null, receivedCost: null, psaUpgraded: false }];

    toInsert.forEach((card, index) => {
      items.push({
        id: crypto.randomUUID(),
        customerOrderId: customerOrder.id,
        submissionId: batch.id,
        batchReferenceCode: batch.referenceCode,
        customerName: customerOrder.customerName,
        phoneNumber: customerOrder.phoneNumber,
        cardName: card.cardName.trim(),
        isPaid: card.isPaid,
        totalCost: card.totalCost,
        receivedCost: card.receivedCost,
        psaUpgraded: card.psaUpgraded,
        submissionOrder: index + 1,
      });
    });

    syncCustomerOrderCount(customerOrder.id);
    return { customerOrder };
  },

  updateItem(itemId: string, patch: AdminUpdateItemPayload): AdminItem {
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx < 0) throw new Error('Item not found');

    const current = items[idx];
    const updated: AdminItem = {
      ...current,
      ...(patch.isPaid !== undefined ? { isPaid: patch.isPaid } : {}),
      ...(patch.totalCost !== undefined ? { totalCost: patch.totalCost } : {}),
      ...(patch.receivedCost !== undefined ? { receivedCost: patch.receivedCost } : {}),
      ...(patch.psaUpgraded !== undefined ? { psaUpgraded: patch.psaUpgraded } : {}),
    };
    items[idx] = updated;
    syncCustomerOrderCount(current.customerOrderId);
    return updated;
  },

  reorderCustomerOrderItems(customerOrderId: number, itemIds: string[]): AdminItem[] {
    const orderItems = items.filter((i) => i.customerOrderId === customerOrderId);
    if (itemIds.length !== orderItems.length) {
      throw new Error('itemIds must include every card in the customer order');
    }

    const orderItemIds = new Set(orderItems.map((i) => i.id));
    if (!itemIds.every((id) => orderItemIds.has(id))) {
      throw new Error('itemIds must only include cards from this customer order');
    }

    itemIds.forEach((id, index) => {
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], submissionOrder: index + 1 };
      }
    });

    syncCustomerOrderCount(customerOrderId);
    return this.listItemsForCustomerOrder(customerOrderId);
  },
};
