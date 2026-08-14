import { formatHkd } from './admin-format';
import type { AdminCustomerOrderDetail, AdminItem } from './admin-types';
import {
  isItemFullyPaid,
  isItemOverReceived,
  parseServicePlanLabel,
  summarizePayment,
} from './admin-types';

/** Issuer contact for PSA invoice PDF — not a legal BR extract. */
export const INVOICE_ISSUER = {
  name: 'Appaw Store',
  website: 'appaw.store',
  email: 'support@appaw.store',
  phone: '+852 9285 1189',
} as const;

/** Partner shop — explicitly Service / Drop-off Address, not registered office. */
export const INVOICE_SERVICE_ADDRESS = {
  label: 'Service / Drop-off Address',
  lines: ['138 Arena, 1/F, 522 Jaffe Road, Causeway Bay, Hong Kong'] as const,
} as const;

/** Credit = received > total (surplus on file). Prefer over “Overpaid”. */
export type InvoicePaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Credit';

export interface CustomerOrderInvoiceLine {
  order: number;
  cardName: string;
  /** Existing / confirmed PSA cert when set. */
  certNumber: string | null;
  plan: string;
  status: InvoicePaymentStatus;
  totalCost: number | null;
  receivedCost: number | null;
  totalLabel: string;
  receivedLabel: string;
}

export interface CustomerOrderInvoice {
  invoiceNumber: string;
  filename: string;
  invoiceDateLabel: string;
  invoiceDateIso: string | null;
  issuer: typeof INVOICE_ISSUER;
  serviceAddress: typeof INVOICE_SERVICE_ADDRESS;
  customer: {
    name: string;
    phone: string;
    orderId: number;
    batchReference: string;
  };
  lines: CustomerOrderInvoiceLine[];
  summary: {
    totalAmount: number;
    amountReceived: number;
    outstanding: number;
    paidCount: number;
    totalCount: number;
    totalAmountLabel: string;
    amountReceivedLabel: string;
    outstandingLabel: string;
    paidRatioLabel: string;
  };
}

function paymentStatus(item: AdminItem): InvoicePaymentStatus {
  if (isItemOverReceived(item)) return 'Credit';
  if (isItemFullyPaid(item)) return 'Paid';
  const received = item.receivedCost ?? 0;
  if (received > 0) return 'Partial';
  return 'Unpaid';
}

function moneyLabel(value: number | null): string {
  if (value === null) return '—';
  return formatHkd(value);
}

/** `INV-{Batch Reference}-{Customer Order ID}` e.g. INV-BAT-2026-07-EXP-3-5 */
export function buildInvoiceNumber(batchReference: string, orderId: number): string {
  const ref = batchReference.trim() || 'UNKNOWN';
  return `INV-${ref}-${orderId}`;
}

export function sanitizeInvoiceFilename(invoiceNumber: string): string {
  return `${invoiceNumber.replace(/[^A-Za-z0-9._-]+/g, '_')}.pdf`;
}

function pickInvoiceDate(detail: AdminCustomerOrderDetail): {
  iso: string | null;
  label: string;
} {
  const raw =
    detail.customerOrder.createdAt?.trim() ||
    detail.customerOrder.updatedAt?.trim() ||
    null;
  if (!raw) {
    return { iso: null, label: '—' };
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return { iso: raw, label: raw };
  }
  return {
    iso: date.toISOString(),
    label: new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Hong_Kong',
    }).format(date),
  };
}

export function buildCustomerOrderInvoice(
  detail: AdminCustomerOrderDetail,
): CustomerOrderInvoice {
  const { customerOrder, items } = detail;
  const invoiceNumber = buildInvoiceNumber(
    customerOrder.batchReferenceCode,
    customerOrder.id,
  );
  const date = pickInvoiceDate(detail);
  const payment = summarizePayment(items);
  const outstanding = Math.max(0, payment.totalCostSum - payment.receivedCostSum);

  const lines: CustomerOrderInvoiceLine[] = [...items]
    .sort((a, b) => a.submissionOrder - b.submissionOrder)
    .map((item) => ({
      order: item.submissionOrder,
      cardName: item.cardName.trim() || '—',
      certNumber: item.certNumber?.trim() || null,
      plan: String(parseServicePlanLabel(item.batchReferenceCode)),
      status: paymentStatus(item),
      totalCost: item.totalCost,
      receivedCost: item.receivedCost,
      totalLabel: moneyLabel(item.totalCost),
      receivedLabel: moneyLabel(item.receivedCost),
    }));

  return {
    invoiceNumber,
    filename: sanitizeInvoiceFilename(invoiceNumber),
    invoiceDateLabel: date.label,
    invoiceDateIso: date.iso,
    issuer: INVOICE_ISSUER,
    serviceAddress: INVOICE_SERVICE_ADDRESS,
    customer: {
      name: customerOrder.customerName.trim() || '—',
      phone: customerOrder.phoneNumber.trim() || '—',
      orderId: customerOrder.id,
      batchReference: customerOrder.batchReferenceCode,
    },
    lines,
    summary: {
      totalAmount: payment.totalCostSum,
      amountReceived: payment.receivedCostSum,
      outstanding,
      paidCount: payment.paidCount,
      totalCount: payment.totalCount,
      totalAmountLabel: formatHkd(payment.totalCostSum),
      amountReceivedLabel: formatHkd(payment.receivedCostSum),
      outstandingLabel: formatHkd(outstanding),
      paidRatioLabel: `${payment.paidCount}/${payment.totalCount}`,
    },
  };
}
