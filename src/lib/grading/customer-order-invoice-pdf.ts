import { downloadBlob } from '@/lib/collection/portfolioCollage';
import { basePath, getImagePath } from '@/lib/utils';
import type { AdminCustomerOrderDetail } from './admin-types';
import {
  buildCustomerOrderInvoice,
  type CustomerOrderInvoice,
  type InvoicePaymentStatus,
} from './customer-order-invoice';

/** Brand tokens from docs/style.md — pure white canvas for print. */
const C = {
  white: '#FFFFFF',
  ink: '#0F1419',
  secondary: '#4A5568',
  muted: '#6B7280',
  raised: '#F3F2F0',
  border: '#D6D8DB',
  borderStrong: '#C0C4CA',
  blush: '#E85D6F',
  indigo: '#5B6FD6',
  gold: '#F59E0B',
  success: '#10B981',
} as const;

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const PAGE_H = 297;
const FOOTER_BASELINE = 276;
const CONTENT_BOTTOM = FOOTER_BASELINE - 8;

/** Matches site `--font-display` (Syne) for invoice company name. */
const SYNE_FONT = 'Syne';
const SYNE_VFS_NAME = 'Syne-Bold.ttf';
const SYNE_FONT_PATH = `${basePath}/fonts/Syne-Bold.ttf`;

type JsPdfCtor = typeof import('jspdf').jsPDF;
type JsPdfDoc = InstanceType<JsPdfCtor>;
type AutoTableFn = typeof import('jspdf-autotable').default;

async function loadPdfDeps(): Promise<{ jsPDF: JsPdfCtor; autoTable: AutoTableFn }> {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  return {
    jsPDF,
    autoTable: autoTableMod.default,
  };
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

function setCompanyNameFont(doc: JsPdfDoc, hasSyne: boolean): void {
  doc.setFont(hasSyne ? SYNE_FONT : 'helvetica', 'bold');
}

async function loadLogoDataUrl(): Promise<string | null> {
  const src = getImagePath('/images/logo.png');
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

function statusColor(status: InvoicePaymentStatus): string {
  if (status === 'Paid') return C.success;
  if (status === 'Credit') return C.indigo;
  if (status === 'Partial') return C.gold;
  return C.muted;
}

function statusStamp(status: InvoicePaymentStatus): string {
  return `[ ${status.toUpperCase()} ]`;
}

function padPage(n: number): string {
  return String(n).padStart(2, '0');
}

/** Neo-brutalist L-bracket corner marks (4mm arms). */
function drawCornerMarks(doc: JsPdfDoc, x: number, y: number, w: number, h: number): void {
  const arm = 4;
  doc.setDrawColor(C.ink);
  doc.setLineWidth(0.6);
  // Top-left
  doc.line(x, y, x + arm, y);
  doc.line(x, y, x, y + arm);
  // Top-right
  doc.line(x + w, y, x + w - arm, y);
  doc.line(x + w, y, x + w, y + arm);
  // Bottom-left
  doc.line(x, y + h, x + arm, y + h);
  doc.line(x, y + h, x, y + h - arm);
  // Bottom-right
  doc.line(x + w, y + h, x + w - arm, y + h);
  doc.line(x + w, y + h, x + w, y + h - arm);
}

function measureSpecRowHeight(doc: JsPdfDoc, value: string, width: number): number {
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(value, width);
  return 3.2 + lines.length * 3.6 + 2.2;
}

function drawSpecRow(
  doc: JsPdfDoc,
  x: number,
  y: number,
  label: string,
  value: string,
  width: number,
  options?: { valueFont?: 'syne' | 'courier'; hasSyne?: boolean },
): number {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(C.muted);
  doc.text(label.toUpperCase(), x, y);

  if (options?.valueFont === 'syne') {
    setCompanyNameFont(doc, Boolean(options.hasSyne));
    doc.setFontSize(10);
  } else {
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
  }
  doc.setTextColor(C.ink);
  const lines = doc.splitTextToSize(value, width);
  doc.text(lines, x, y + 3.2);
  return y + 3.2 + lines.length * 3.6 + 2.2;
}

function drawBracketLabel(doc: JsPdfDoc, text: string, x: number, y: number): void {
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C.ink);
  doc.text(text, x, y);
}

function drawHeader(
  doc: JsPdfDoc,
  invoice: CustomerOrderInvoice,
  logoDataUrl: string | null,
  hasSyne: boolean,
): number {
  let y = MARGIN;
  const headerH = 22;

  drawCornerMarks(doc, MARGIN, y, CONTENT_W, headerH);

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN + 2, y + 4, 12, 12);
    } catch {
      doc.setDrawColor(C.ink);
      doc.setLineWidth(0.5);
      doc.rect(MARGIN + 2, y + 4, 12, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(C.ink);
      doc.text('A', MARGIN + 8, y + 11.5, { align: 'center' });
    }
  } else {
    doc.setDrawColor(C.ink);
    doc.setLineWidth(0.5);
    doc.rect(MARGIN + 2, y + 4, 12, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(C.ink);
    doc.text('A', MARGIN + 8, y + 11.5, { align: 'center' });
  }

  setCompanyNameFont(doc, hasSyne);
  doc.setFontSize(14);
  doc.setTextColor(C.ink);
  doc.text(invoice.issuer.name.toUpperCase(), MARGIN + 17, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(C.secondary);
  doc.text('PSA Submission Service', MARGIN + 17, y + 13);

  // Macro INVOICE stamp
  setCompanyNameFont(doc, hasSyne);
  doc.setFontSize(26);
  doc.setTextColor(C.ink);
  doc.text('INVOICE', PAGE_W - MARGIN - 2, y + 9, { align: 'right' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(C.ink);
  doc.text(invoice.invoiceNumber, PAGE_W - MARGIN - 2, y + 14.5, { align: 'right' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(C.muted);
  doc.text(invoice.invoiceDateLabel, PAGE_W - MARGIN - 2, y + 18.5, { align: 'right' });

  y += headerH + 3;

  // Full-width 2pt blush bar
  doc.setDrawColor(C.blush);
  doc.setFillColor(C.blush);
  doc.setLineWidth(0);
  doc.rect(MARGIN, y, CONTENT_W, 2, 'F');

  return y + 8;
}

function drawParties(
  doc: JsPdfDoc,
  invoice: CustomerOrderInvoice,
  y: number,
  hasSyne: boolean,
): number {
  const colGap = 6;
  const colW = (CONTENT_W - colGap) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + colGap;
  const contentX = 4;
  const contentW = colW - 8;
  const titleH = 10;
  const topPad = 4;
  const bottomPad = 4;

  const issuerFields: Array<[string, string]> = [
    ['Company', invoice.issuer.name],
    ['Email', invoice.issuer.email],
    ['Phone', invoice.issuer.phone],
  ];
  const customerFields: Array<[string, string]> = [
    ['Name', invoice.customer.name],
    ['Phone', invoice.customer.phone],
  ];

  const fieldsHeight = (fields: Array<[string, string]>) =>
    fields.reduce((sum, [, value]) => sum + measureSpecRowHeight(doc, value, contentW), 0);

  const boxH = Math.max(
    topPad + titleH + fieldsHeight(issuerFields) + bottomPad,
    topPad + titleH + fieldsHeight(customerFields) + bottomPad,
  );

  // Blueprint panels — hairline ink border, no side blush rails
  doc.setDrawColor(C.ink);
  doc.setFillColor(C.white);
  doc.setLineWidth(0.4);
  doc.rect(leftX, y, colW, boxH, 'FD');
  doc.rect(rightX, y, colW, boxH, 'FD');

  const drawPanelHeader = (panelX: number, label: string) => {
    drawBracketLabel(doc, label, panelX + contentX, y + topPad + 3.5);
    // 2pt blush top rule under label
    doc.setFillColor(C.blush);
    doc.rect(panelX + contentX, y + topPad + 5.5, colW - contentX * 2, 1.5, 'F');
  };

  drawPanelHeader(leftX, '[ ISSUER ]');
  drawPanelHeader(rightX, '[ CUSTOMER ]');

  let leftY = y + topPad + titleH;
  for (const [label, value] of issuerFields) {
    leftY = drawSpecRow(doc, leftX + contentX, leftY, label, value, contentW, {
      valueFont: label === 'Company' ? 'syne' : 'courier',
      hasSyne,
    });
  }

  let rightY = y + topPad + titleH;
  for (const [label, value] of customerFields) {
    rightY = drawSpecRow(doc, rightX + contentX, rightY, label, value, contentW);
  }

  return Math.max(y + boxH, leftY, rightY) + 6;
}

function drawServiceAddress(doc: JsPdfDoc, invoice: CustomerOrderInvoice, y: number): number {
  const stripH = 14;
  doc.setDrawColor(C.ink);
  doc.setFillColor(C.raised);
  doc.setLineWidth(0.4);
  doc.rect(MARGIN, y, CONTENT_W, stripH, 'FD');

  drawBracketLabel(doc, '[ SERVICE / DROP-OFF ]', MARGIN + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(C.secondary);
  doc.text(invoice.serviceAddress.lines[0], MARGIN + 3, y + 10.5);

  return y + stripH + 6;
}

function drawFooter(doc: JsPdfDoc, invoice: CustomerOrderInvoice): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const baseline = FOOTER_BASELINE;

    // Thick ink rule + thin blush underline
    doc.setDrawColor(C.ink);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, baseline, PAGE_W - MARGIN, baseline);

    doc.setDrawColor(C.blush);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, baseline + 1.2, PAGE_W - MARGIN, baseline + 1.2);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(C.indigo);
    doc.text(invoice.issuer.website, MARGIN, baseline + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C.muted);
    doc.text(`WhatsApp  ${invoice.issuer.phone}`, MARGIN, baseline + 11);

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(C.ink);
    doc.text(`PAGE ${padPage(i)} / ${padPage(pageCount)}`, PAGE_W - MARGIN, baseline + 6, {
      align: 'right',
    });
  }
}

function drawTotals(doc: JsPdfDoc, invoice: CustomerOrderInvoice, startY: number): void {
  const boxW = 78;
  const boxX = PAGE_W - MARGIN - boxW;
  const rowH = 7.5;
  const padTop = 5;
  const padBottom = 4;
  const hasOutstanding = invoice.summary.outstanding > 0;
  const rows: Array<{
    label: string;
    value: string;
    emphasize?: 'outstanding' | 'paid';
  }> = [
    { label: 'Total Amount', value: invoice.summary.totalAmountLabel },
    { label: 'Amount Received', value: invoice.summary.amountReceivedLabel },
    { label: 'Outstanding', value: invoice.summary.outstandingLabel, emphasize: 'outstanding' },
    { label: 'Paid', value: invoice.summary.paidRatioLabel, emphasize: 'paid' },
  ];
  const boxH = padTop + rows.length * rowH + padBottom;

  let y = startY;
  if (y + boxH > CONTENT_BOTTOM) {
    doc.addPage();
    doc.setFillColor(C.white);
    doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
    y = MARGIN + 8;
  }

  // Flush ledger slab — structural ink border, white fill
  doc.setDrawColor(C.ink);
  doc.setFillColor(C.white);
  doc.setLineWidth(0.8);
  doc.rect(boxX, y, boxW, boxH, 'FD');

  let rowY = y + padTop;
  for (const row of rows) {
    const bandTop = rowY - 4;
    const isOutstandingHazard = row.emphasize === 'outstanding' && hasOutstanding;
    const isPaidOk = row.emphasize === 'paid' && !hasOutstanding;

    if (isOutstandingHazard) {
      doc.setFillColor(C.blush);
      doc.rect(boxX + 0.8, bandTop, boxW - 1.6, rowH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(isOutstandingHazard ? C.white : C.muted);
    doc.text(row.label.toUpperCase(), boxX + 3, rowY);

    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    if (isOutstandingHazard) {
      doc.setTextColor(C.white);
    } else if (row.emphasize === 'outstanding') {
      doc.setTextColor(C.muted);
    } else if (isPaidOk) {
      doc.setTextColor(C.ink);
    } else {
      doc.setTextColor(C.ink);
    }
    doc.text(row.value, boxX + boxW - 3, rowY, { align: 'right' });
    rowY += rowH;
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
  const [{ jsPDF, autoTable }, logoDataUrl, syneBase64] = await Promise.all([
    loadPdfDeps(),
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
    creator: 'Appaw Store Admin',
  });

  doc.setFillColor(C.white);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  let y = drawHeader(doc, invoice, logoDataUrl, hasSyne);
  y = drawParties(doc, invoice, y, hasSyne);
  y = drawServiceAddress(doc, invoice, y);

  drawBracketLabel(doc, '[ 01  LIST ]', MARGIN, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, top: 18, bottom: PAGE_H - CONTENT_BOTTOM },
    head: [['#', 'Card', 'Plan', 'Status', 'Total', 'Received']],
    body: invoice.lines.map((line) => [
      String(line.order),
      line.cardName,
      line.plan,
      statusStamp(line.status),
      line.totalLabel,
      line.receivedLabel,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: C.ink,
      lineColor: C.border,
      lineWidth: 0.2,
      cellPadding: { top: 2.2, bottom: 2.2, left: 2, right: 2 },
      overflow: 'linebreak',
      valign: 'middle',
    },
    headStyles: {
      fillColor: C.ink,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 7.5,
      font: 'helvetica',
      lineColor: C.ink,
      lineWidth: 0.25,
    },
    alternateRowStyles: {
      fillColor: C.white,
    },
    columnStyles: {
      0: { cellWidth: 10, font: 'courier', halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, font: 'courier', halign: 'center' },
      3: { cellWidth: 26, font: 'courier', halign: 'center' },
      4: { cellWidth: 28, font: 'courier', halign: 'right' },
      5: { cellWidth: 28, font: 'courier', halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 3) return;
      const stamp = String(data.cell.raw).toUpperCase();
      let status: InvoicePaymentStatus = 'Unpaid';
      if (stamp.includes('CREDIT')) status = 'Credit';
      else if (stamp.includes('PARTIAL')) status = 'Partial';
      else if (stamp.includes('UNPAID')) status = 'Unpaid';
      else if (stamp.includes('PAID')) status = 'Paid';
      data.cell.styles.textColor = statusColor(status);
      data.cell.styles.fontStyle = 'bold';
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        doc.setFillColor(C.white);
        doc.rect(0, 0, PAGE_W, 16, 'F');
        doc.setFont('courier', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(C.muted);
        doc.text(`${invoice.invoiceNumber}  ·  CONTINUED`, MARGIN, 10);
        doc.setDrawColor(C.blush);
        doc.setLineWidth(1);
        doc.line(MARGIN, 12, PAGE_W - MARGIN, 12);
      }
    },
  });

  const table = (
    doc as unknown as {
      lastAutoTable?: { finalY: number };
    }
  ).lastAutoTable;
  const afterTableY = (table?.finalY ?? y) + 6;
  drawTotals(doc, invoice, afterTableY);
  drawFooter(doc, invoice);

  const blob = doc.output('blob');
  downloadBlob(blob, invoice.filename);
  return invoice;
}
