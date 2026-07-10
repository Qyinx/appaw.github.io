import { formatBatchReferenceCode } from './batch-reference-code';
import type { AdminBatch, AdminCustomerOrder, AdminItem } from './admin-types';

const now = () => new Date().toISOString();

export const MOCK_BATCH_GRADING = formatBatchReferenceCode(2026, 7, 'EXP', 3);
export const MOCK_BATCH_REGULAR = formatBatchReferenceCode(2026, 7, 'REG', 3);
export const MOCK_BATCH_SHIPPED = formatBatchReferenceCode(2026, 6, 'SPX', 12);

export function createInitialAdminMock(): {
  batches: AdminBatch[];
  customerOrders: AdminCustomerOrder[];
  items: AdminItem[];
} {
  const timestamp = now();

  const batches: AdminBatch[] = [
    {
      id: 'batch-exp-3',
      referenceCode: MOCK_BATCH_GRADING,
      psaSubmissionNumber: 78421,
      psaOrderNumber: 884120,
      completedStepIndex: 5,
      orderCount: 1,
      cardCount: 2,
      updatedAt: timestamp,
    },
    {
      id: 'batch-reg-3',
      referenceCode: MOCK_BATCH_REGULAR,
      psaSubmissionNumber: 78422,
      psaOrderNumber: 884121,
      completedStepIndex: 4,
      orderCount: 1,
      cardCount: 3,
      updatedAt: timestamp,
    },
    {
      id: 'batch-spx-12',
      referenceCode: MOCK_BATCH_SHIPPED,
      psaSubmissionNumber: 65102,
      psaOrderNumber: 772901,
      completedStepIndex: 10,
      orderCount: 1,
      cardCount: 2,
      updatedAt: timestamp,
    },
  ];

  const customerOrders: AdminCustomerOrder[] = [
    {
      id: 1001,
      submissionId: 'batch-exp-3',
      customerId: 'cust-alex',
      batchReferenceCode: MOCK_BATCH_GRADING,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      itemCount: 2,
      updatedAt: timestamp,
    },
    {
      id: 1002,
      submissionId: 'batch-reg-3',
      customerId: 'cust-alex',
      batchReferenceCode: MOCK_BATCH_REGULAR,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      itemCount: 3,
      updatedAt: timestamp,
    },
    {
      id: 1003,
      submissionId: 'batch-spx-12',
      customerId: 'cust-jamie',
      batchReferenceCode: MOCK_BATCH_SHIPPED,
      customerName: 'Jamie Ho',
      phoneNumber: '+85261234567',
      itemCount: 2,
      updatedAt: timestamp,
    },
  ];

  const items: AdminItem[] = [
    {
      id: 'item-exp-1',
      customerOrderId: 1001,
      submissionId: 'batch-exp-3',
      batchReferenceCode: MOCK_BATCH_GRADING,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      cardName: '2024 Pokemon SV8a - Umbreon ex SAR',
      isPaid: true,
      totalCost: 350,
      receivedCost: 350,
      psaUpgraded: false,
      submissionOrder: 1,
    },
    {
      id: 'item-exp-2',
      customerOrderId: 1001,
      submissionId: 'batch-exp-3',
      batchReferenceCode: MOCK_BATCH_GRADING,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      cardName: '2023 Pokemon SV2a - Charizard ex #199',
      isPaid: true,
      totalCost: 280,
      receivedCost: 280,
      psaUpgraded: true,
      submissionOrder: 2,
    },
    {
      id: 'item-reg-1',
      customerOrderId: 1002,
      submissionId: 'batch-reg-3',
      batchReferenceCode: MOCK_BATCH_REGULAR,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      cardName: '2021 Pokemon SWSH - Pikachu VMAX #188',
      isPaid: true,
      totalCost: 180,
      receivedCost: 180,
      psaUpgraded: false,
      submissionOrder: 1,
    },
    {
      id: 'item-reg-2',
      customerOrderId: 1002,
      submissionId: 'batch-reg-3',
      batchReferenceCode: MOCK_BATCH_REGULAR,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      cardName: '2020 Pokemon SWSH - Charizard V #154',
      isPaid: false,
      totalCost: 150,
      receivedCost: 0,
      psaUpgraded: false,
      submissionOrder: 2,
    },
    {
      id: 'item-reg-3',
      customerOrderId: 1002,
      submissionId: 'batch-reg-3',
      batchReferenceCode: MOCK_BATCH_REGULAR,
      customerName: 'Alex Collector',
      phoneNumber: '+85292851189',
      cardName: '2019 Pokemon SM - Mewtwo & Mew GX #242',
      isPaid: false,
      totalCost: 220,
      receivedCost: 0,
      psaUpgraded: false,
      submissionOrder: 3,
    },
    {
      id: 'item-spx-1',
      customerOrderId: 1003,
      submissionId: 'batch-spx-12',
      batchReferenceCode: MOCK_BATCH_SHIPPED,
      customerName: 'Jamie Ho',
      phoneNumber: '+85261234567',
      cardName: '2022 Pokemon SWSH - Lugia V Alt Art',
      isPaid: true,
      totalCost: 420,
      receivedCost: 420,
      psaUpgraded: false,
      submissionOrder: 1,
    },
    {
      id: 'item-spx-2',
      customerOrderId: 1003,
      submissionId: 'batch-spx-12',
      batchReferenceCode: MOCK_BATCH_SHIPPED,
      customerName: 'Jamie Ho',
      phoneNumber: '+85261234567',
      cardName: '2021 Pokemon Celebrations - Charizard',
      isPaid: true,
      totalCost: 300,
      receivedCost: 300,
      psaUpgraded: true,
      submissionOrder: 2,
    },
  ];

  return { batches, customerOrders, items };
}
