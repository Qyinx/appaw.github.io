import { downloadBlob } from '@/lib/collection/portfolioCollage';
import { basePath, getImagePath } from '@/lib/utils';
import type { AdminCustomerOrderDetail } from './admin-types';
import {
  buildCustomerOrderInvoice,
  type CustomerOrderInvoice,
  type CustomerOrderInvoiceLine,
  type InvoicePaymentStatus,
} from './customer-order-invoice';

/**
 * Appaw PSA invoice — instrument sheet.
 * Card list is drawn with doc.text (not autoTable) so Amount/Received
 * always embed — long card names were clipping money columns.
 */
const C = {
  white: '#FFFFFF',
  ink: '#1A140E',
  secondary: '#4A4036',
  muted: '#6B5F52',
  hairline: '#D6CFC3',
  coral: '#C94B3E',
} as const;

const MARGIN = 11;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const PAGE_H = 297;
const RAIL_W = 1.6;
const FOOTER_H = 10;
const CONTENT_BOTTOM = PAGE_H - MARGIN - FOOTER_H;

const SYNE_FONT = 'Syne';
const SYNE_VFS_NAME = 'Syne-Bold.ttf';
const SYNE_FONT_PATH = `${basePath}/fonts/Syne-Bold.ttf`;

/** Fixed column layout (mm) — Amount/Received left (room for `1234 $HKD`). */
const COL = {
  idx: { x: MARGIN, w: 8 },
  amount: { x: MARGIN + 8, w: 24 },
  received: { x: MARGIN + 32, w: 24 },
  status: { x: MARGIN + 56, w: 18 },
  plan: { x: MARGIN + 74, w: 14 },
  card: { x: MARGIN + 88, w: CONTENT_W - 88 },
} as const;

type JsPdfCtor = typeof import('jspdf').jsPDF;
type JsPdfDoc = InstanceType<JsPdfCtor>;

async function loadJsPdf(): Promise<JsPdfCtor> {
  const mod = await import('jspdf');
  return mod.jsPDF;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadSyneBoldBase64(): Promise<string | null> {
  try {
    const res = await fetch(SYNE_FONT_PATH);
    if (!res.ok) return null;
    return arrayBufferToBase64(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function registerSyneBold(doc: JsPdfDoc, base64: string | null): boolean {
  if (!base64) return false;
  try {
    doc.addFileToVFS(SYNE_VFS_NAME, base64);
    doc.addFont(SYNE_VFS_NAME, SYNE_FONT, 'bold');
    return true;
  } catch {
    return false;
  }
}

function setDisplayFont(doc: JsPdfDoc, hasSyne: boolean): void {
  doc.setFont(hasSyne ? SYNE_FONT : 'helvetica', 'bold');
}

function useBodyFont(doc: JsPdfDoc, style: 'normal' | 'bold' = 'normal'): void {
  doc.setFont('helvetica', style);
}

async function loadLogoDataUrl(): Promise<string | null> {
  const src = getImagePath('/images/logo.png', { skipWebp: true });
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function statusLabel(status: InvoicePaymentStatus): string {
  switch (status) {
    case 'Paid':
    case 'Credit':
      return 'Paid';
    case 'Partial':
      return 'Deposit';
    default:
      return 'Unpaid';
  }
}

function padPage(n: number): string {
  return String(n).padStart(2, '0');
}

function drawBrandRail(doc: JsPdfDoc): void {
  doc.setFillColor(C.coral);
  doc.rect(0, 0, RAIL_W, PAGE_H, 'F');
}

function drawRule(doc: JsPdfDoc, y: number, weight = 0.45, color: string = C.ink): void {
  doc.setDrawColor(color);
  doc.setLineWidth(weight);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
}

function ensureSpace(doc: JsPdfDoc, y: number, need: number): number {
  if (y + need <= CONTENT_BOTTOM) return y;
  doc.addPage();
  doc.setFillColor(C.white);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  drawBrandRail(doc);
  return MARGIN + 6;
}

function drawMasthead(
  doc: JsPdfDoc,
  invoice: CustomerOrderInvoice,
  logoDataUrl: string | null,
  hasSyne: boolean,
): number {
  const y = MARGIN;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN, y, 6.5, 6.5);
    } catch {
      /* wordmark is enough */
    }
  }

  setDisplayFont(doc, hasSyne);
  doc.setFontSize(9.5);
  doc.setTextColor(C.ink);
  doc.text(invoice.issuer.name.toUpperCase(), MARGIN + 8.5, y + 2.8);

  useBodyFont(doc);
  doc.setFontSize(5.5);
  doc.setTextColor(C.muted);
  doc.text('PSA submission', MARGIN + 8.5, y + 5.8);

  setDisplayFont(doc, hasSyne);
  doc.setFontSize(16);
  doc.setTextColor(C.ink);
  doc.text('Invoice', PAGE_W - MARGIN, y + 5.2, { align: 'right' });

  let next = y + 8.5;
  drawRule(doc, next, 0.55);
  next += 2.2;

  const specs: Array<[string, string]> = [
    ['No.', invoice.invoiceNumber],
    ['Date', invoice.invoiceDateLabel],
    ['Batch', invoice.customer.batchReference],
    ['Order', String(invoice.customer.orderId)],
  ];
  const gap = 3;
  const cellW = (CONTENT_W - gap * (specs.length - 1)) / specs.length;
  let x = MARGIN;
  for (const [label, value] of specs) {
    useBodyFont(doc);
    doc.setFontSize(5);
    doc.setTextColor(C.muted);
    doc.text(label.toUpperCase(), x, next);

    useBodyFont(doc);
    doc.setFontSize(6.5);
    doc.setTextColor(C.ink);
    const lines = doc.splitTextToSize(value, cellW - 1);
    doc.text(lines, x, next + 2.5);
    x += cellW + gap;
  }

  next += 6.2;
  drawRule(doc, next, 0.25, C.hairline);
  return next + 2;
}

function drawBillTo(doc: JsPdfDoc, invoice: CustomerOrderInvoice, y: number): number {
  useBodyFont(doc);
  doc.setFontSize(5);
  doc.setTextColor(C.muted);
  doc.text('BILL TO', MARGIN, y);

  useBodyFont(doc, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C.ink);
  doc.text(invoice.customer.name, MARGIN, y + 3);

  useBodyFont(doc);
  doc.setFontSize(6.5);
  doc.setTextColor(C.secondary);
  doc.text(invoice.customer.phone, MARGIN, y + 6);

  useBodyFont(doc);
  doc.setFontSize(5);
  doc.setTextColor(C.muted);
  doc.text('DROP-OFF', MARGIN + CONTENT_W / 2, y);

  useBodyFont(doc);
  doc.setFontSize(6.5);
  doc.setTextColor(C.secondary);
  const dropLines = doc.splitTextToSize(
    invoice.serviceAddress.lines[0],
    CONTENT_W / 2 - 2,
  );
  doc.text(dropLines, MARGIN + CONTENT_W / 2, y + 3);

  const dropH = Math.max(5.5, dropLines.length * 2.6);
  const next = y + Math.max(8, dropH + 2);
  drawRule(doc, next, 0.25, C.hairline);
  return next + 2;
}

const TABLE = {
  headerSize: 5.5,
  cellSize: 6.5,
  lineH: 2.5,
  padY: 0.45,
  minRowH: 3.6,
  gapAfter: 0.9,
  headerGap: 2.2,
} as const;

function drawTableHeader(doc: JsPdfDoc, y: number): number {
  useBodyFont(doc, 'bold');
  doc.setFontSize(TABLE.headerSize);
  doc.setTextColor(C.ink);
  doc.text('#', COL.idx.x + COL.idx.w / 2, y, { align: 'center' });
  doc.text('Amount', COL.amount.x + COL.amount.w - 1, y, { align: 'right' });
  doc.text('Received', COL.received.x + COL.received.w - 1, y, { align: 'right' });
  doc.text('Status', COL.status.x, y);
  doc.text('Plan', COL.plan.x + COL.plan.w / 2, y, { align: 'center' });
  doc.text('Card', COL.card.x, y);
  drawRule(doc, y + 0.8, 0.35);
  return y + TABLE.headerGap;
}

function measureRowHeight(doc: JsPdfDoc, line: CustomerOrderInvoiceLine): number {
  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  const cardText = line.certNumber
    ? `${line.cardName}\nCert ${line.certNumber}`
    : line.cardName;
  const cardLines = doc.splitTextToSize(cardText, COL.card.w - 1);
  return Math.max(
    TABLE.minRowH,
    TABLE.padY * 2 + cardLines.length * TABLE.lineH,
  );
}

function drawCardRow(doc: JsPdfDoc, line: CustomerOrderInvoiceLine, y: number): number {
  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  const cardText = line.certNumber
    ? `${line.cardName}\nCert ${line.certNumber}`
    : line.cardName;
  const cardLines = doc.splitTextToSize(cardText, COL.card.w - 1);
  const cardBlockH = cardLines.length * TABLE.lineH;
  const rowH = Math.max(TABLE.minRowH, TABLE.padY * 2 + cardBlockH);

  const rowTop = y - TABLE.padY - 0.4;
  const rowMid = rowTop + rowH / 2;
  // jsPDF y is text baseline — nudge so single-line cells sit visually centered
  const singleBaseline = rowMid + 0.75;
  const cardBaseline = rowTop + (rowH - cardBlockH) / 2 + 1.7;

  useBodyFont(doc, 'bold');
  doc.setFontSize(TABLE.cellSize);
  doc.setTextColor(C.ink);
  doc.text(String(line.order), COL.idx.x + COL.idx.w / 2, singleBaseline, {
    align: 'center',
  });

  useBodyFont(doc, 'bold');
  doc.setFontSize(TABLE.cellSize);
  doc.setTextColor(C.ink);
  doc.text(line.totalLabel, COL.amount.x + COL.amount.w - 1, singleBaseline, {
    align: 'right',
  });

  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  doc.text(line.receivedLabel, COL.received.x + COL.received.w - 1, singleBaseline, {
    align: 'right',
  });

  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  doc.text(statusLabel(line.status), COL.status.x, singleBaseline);

  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  doc.text(line.plan, COL.plan.x + COL.plan.w / 2, singleBaseline, { align: 'center' });

  useBodyFont(doc);
  doc.setFontSize(TABLE.cellSize);
  doc.text(cardLines, COL.card.x, cardBaseline);

  const bottom = rowTop + rowH;
  drawRule(doc, bottom, 0.15, C.hairline);
  return bottom + TABLE.gapAfter;
}

function drawCardsTable(doc: JsPdfDoc, invoice: CustomerOrderInvoice, startY: number): number {
  const pricedCount = invoice.lines.filter((line) => line.totalCost != null).length;

  let y = startY;
  useBodyFont(doc, 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(C.ink);
  doc.text('CARDS', MARGIN, y);
  y += 2.4;

  useBodyFont(doc);
  doc.setFontSize(5.5);
  doc.setTextColor(C.muted);
  doc.text(
    `${pricedCount} of ${invoice.lines.length} cards priced`,
    MARGIN,
    y,
  );
  y += 3;

  y = ensureSpace(doc, y, 12);
  y = drawTableHeader(doc, y);

  invoice.lines.forEach((line) => {
    const need = measureRowHeight(doc, line) + 2;
    const before = y;
    y = ensureSpace(doc, y, need);
    if (y !== before) {
      // New page — repeat header
      useBodyFont(doc);
      doc.setFontSize(6);
      doc.setTextColor(C.muted);
      doc.text(`${invoice.invoiceNumber}  ·  continued`, MARGIN, y);
      y += 4;
      y = drawTableHeader(doc, y);
    }
    y = drawCardRow(doc, line, y);
  });

  return y + 2;
}

function drawTotals(doc: JsPdfDoc, invoice: CustomerOrderInvoice, startY: number): void {
  const boxW = 70;
  const boxX = PAGE_W - MARGIN - boxW;
  const rows: Array<{ label: string; value: string; emphasize?: boolean }> = [
    { label: 'Total', value: invoice.summary.totalAmountLabel },
    { label: 'Received', value: invoice.summary.amountReceivedLabel },
    {
      label: 'Outstanding',
      value: invoice.summary.outstandingLabel,
      emphasize: invoice.summary.outstanding > 0,
    },
    { label: 'Cards paid', value: invoice.summary.paidRatioLabel },
  ];
  const rowH = 5.2;
  const padY = 2.5;
  const boxH = padY * 2 + rows.length * rowH;

  let y = ensureSpace(doc, startY, boxH + 2);

  doc.setDrawColor(C.ink);
  doc.setLineWidth(0.55);
  doc.rect(boxX, y, boxW, boxH, 'S');

  doc.setFillColor(C.coral);
  doc.rect(boxX, y, boxW, 0.7, 'F');

  let rowY = y + padY + 3.2;
  for (const row of rows) {
    useBodyFont(doc);
    doc.setFontSize(6);
    doc.setTextColor(C.muted);
    doc.text(row.label.toUpperCase(), boxX + 2.5, rowY);

    useBodyFont(doc, row.emphasize ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(C.ink);
    doc.text(row.value, boxX + boxW - 2.5, rowY, { align: 'right' });
    rowY += rowH;
  }
}

function drawFooter(doc: JsPdfDoc, invoice: CustomerOrderInvoice): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    drawBrandRail(doc);

    const baseline = PAGE_H - MARGIN - 5;
    doc.setDrawColor(C.hairline);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, baseline - 3, PAGE_W - MARGIN, baseline - 3);

    useBodyFont(doc);
    doc.setFontSize(6);
    doc.setTextColor(C.muted);
    doc.text(
      `${invoice.issuer.website}  ·  ${invoice.issuer.email}  ·  ${invoice.issuer.phone}`,
      MARGIN,
      baseline,
    );
    useBodyFont(doc);
    doc.text(`${padPage(i)} / ${padPage(pageCount)}`, PAGE_W - MARGIN, baseline, {
      align: 'right',
    });
  }
}

/**
 * Build and download an English A4 PSA customer-order invoice PDF.
 * Uses saved order snapshot only — call with `detail`, never draft items.
 */
export async function exportCustomerOrderInvoicePdf(
  detail: AdminCustomerOrderDetail,
): Promise<CustomerOrderInvoice> {
  const invoice = buildCustomerOrderInvoice(detail);
  const [jsPDF, logoDataUrl, syneBase64] = await Promise.all([
    loadJsPdf(),
    loadLogoDataUrl(),
    loadSyneBoldBase64(),
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const hasSyne = registerSyneBold(doc, syneBase64);

  doc.setProperties({
    title: invoice.invoiceNumber,
    subject: `PSA submission invoice for order ${invoice.customer.orderId}`,
    author: invoice.issuer.name,
    creator: 'Appaw Store',
  });

  doc.setFillColor(C.white);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  drawBrandRail(doc);

  // Always reset to Helvetica before body content (Syne is display-only).
  useBodyFont(doc);

  let y = drawMasthead(doc, invoice, logoDataUrl, hasSyne);
  y = drawBillTo(doc, invoice, y);
  y = drawCardsTable(doc, invoice, y);
  drawTotals(doc, invoice, y + 2);
  drawFooter(doc, invoice);

  if (process.env.NODE_ENV !== 'production') {
    const priced = invoice.lines.filter((l) => l.totalCost != null);
    const sample = priced
      .slice(0, 5)
      .map((l) => `#${l.order}=${l.totalLabel}/${l.receivedLabel}`)
      .join(' ');
    const first = detail.items[0] as Record<string, unknown> | undefined;
    // eslint-disable-next-line no-console -- debug Amount cells / stale session
    console.info(
      '[invoice-pdf]',
      invoice.invoiceNumber,
      `lines=${invoice.lines.length}`,
      `priced=${priced.length}`,
      sample || 'no priced lines',
      first
        ? `firstKeys=${Object.keys(first).join('|')} totalCost=${String(first.totalCost)}`
        : 'no-items',
    );
  }

  const blob = doc.output('blob');
  downloadBlob(blob, invoice.filename);
  return invoice;
}
