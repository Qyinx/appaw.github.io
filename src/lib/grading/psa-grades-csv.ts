import type { AdminItem } from './admin-types';

export type PsaCsvGradeRow = {
  certNumber: string;
  description: string;
  grade: string;
  zipUrl: string;
};

export type PsaGradePreviewRow = {
  batchOrder: number;
  itemId: string;
  ourCardName: string;
  psaDescription: string;
  certNumber: string;
  grade: string;
  zipUrl: string;
  nameMatch: boolean;
};

export type PsaGradeMatchResult = {
  rows: PsaGradePreviewRow[];
  countMismatch: boolean;
  csvCount: number;
  batchCount: number;
  mismatchCount: number;
};

/** Collapse whitespace + lowercase for card-name compare. */
export function normalizeCardNameForMatch(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

/**
 * Parse PSA order export CSV.
 * Expected headers: Cert #, Type, Description, Grade, After Service, Images
 */
export function parsePsaGradesCsv(text: string): PsaCsvGradeRow[] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const certIdx = header.findIndex((h) => h.includes('cert'));
  const descIdx = header.findIndex((h) => h.includes('description'));
  const gradeIdx = header.findIndex((h) => h === 'grade');
  const imagesIdx = header.findIndex((h) => h.includes('image'));

  if (certIdx < 0 || descIdx < 0 || gradeIdx < 0 || imagesIdx < 0) {
    throw new Error('CSV must include Cert #, Description, Grade, and Images columns');
  }

  const rows: PsaCsvGradeRow[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const certNumber = (cols[certIdx] || '').trim();
    const description = (cols[descIdx] || '').trim();
    const grade = (cols[gradeIdx] || '').trim();
    const zipUrl = (cols[imagesIdx] || '').trim();
    if (!certNumber && !description) continue;
    rows.push({ certNumber, description, grade, zipUrl });
  }
  return rows;
}

/** Normalize cert for match (digits / trim). */
export function normalizeCertForMatch(value: string | null | undefined): string {
  return (value ?? '').replace(/\s/g, '').toLowerCase();
}

/**
 * Pair CSV rows to batch items.
 * Prefer cert match when both sides have a cert; remaining rows fall back to table order.
 */
export function matchPsaGradesToBatch(
  csvRows: PsaCsvGradeRow[],
  batchItems: AdminItem[],
): PsaGradeMatchResult {
  const usedCsv = new Set<number>();
  const usedItems = new Set<number>();
  const paired: Array<{ csvIndex: number; itemIndex: number }> = [];

  const itemsWithCert = batchItems.some(
    (item) => normalizeCertForMatch(item.certNumber).length > 0,
  );

  if (itemsWithCert) {
    const csvByCert = new Map<string, number>();
    csvRows.forEach((row, index) => {
      const cert = normalizeCertForMatch(row.certNumber);
      if (cert && !csvByCert.has(cert)) csvByCert.set(cert, index);
    });

    batchItems.forEach((item, itemIndex) => {
      const cert = normalizeCertForMatch(item.certNumber);
      if (!cert) return;
      const csvIndex = csvByCert.get(cert);
      if (csvIndex == null || usedCsv.has(csvIndex)) return;
      usedCsv.add(csvIndex);
      usedItems.add(itemIndex);
      paired.push({ csvIndex, itemIndex });
    });
  }

  let csvCursor = 0;
  let itemCursor = 0;
  while (csvCursor < csvRows.length && itemCursor < batchItems.length) {
    while (csvCursor < csvRows.length && usedCsv.has(csvCursor)) csvCursor += 1;
    while (itemCursor < batchItems.length && usedItems.has(itemCursor)) itemCursor += 1;
    if (csvCursor >= csvRows.length || itemCursor >= batchItems.length) break;
    usedCsv.add(csvCursor);
    usedItems.add(itemCursor);
    paired.push({ csvIndex: csvCursor, itemIndex: itemCursor });
    csvCursor += 1;
    itemCursor += 1;
  }

  paired.sort((a, b) => a.itemIndex - b.itemIndex);

  const rows: PsaGradePreviewRow[] = paired.map(({ csvIndex, itemIndex }) => {
    const csv = csvRows[csvIndex];
    const item = batchItems[itemIndex];
    const nameMatch =
      normalizeCardNameForMatch(csv.description) === normalizeCardNameForMatch(item.cardName);
    return {
      batchOrder: itemIndex + 1,
      itemId: item.id,
      ourCardName: item.cardName,
      psaDescription: csv.description,
      certNumber: csv.certNumber,
      grade: csv.grade,
      zipUrl: csv.zipUrl,
      nameMatch,
    };
  });

  return {
    rows,
    countMismatch: csvRows.length !== batchItems.length,
    csvCount: csvRows.length,
    batchCount: batchItems.length,
    mismatchCount: rows.filter((r) => !r.nameMatch).length,
  };
}
