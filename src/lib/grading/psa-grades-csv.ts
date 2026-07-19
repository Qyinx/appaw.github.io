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

/** Pair CSV rows to batch items in table order (batch order ID = index + 1). */
export function matchPsaGradesToBatch(
  csvRows: PsaCsvGradeRow[],
  batchItems: AdminItem[],
): PsaGradeMatchResult {
  const len = Math.max(csvRows.length, batchItems.length);
  const rows: PsaGradePreviewRow[] = [];
  for (let i = 0; i < len; i += 1) {
    const csv = csvRows[i];
    const item = batchItems[i];
    if (!csv || !item) continue;
    const nameMatch =
      normalizeCardNameForMatch(csv.description) === normalizeCardNameForMatch(item.cardName);
    rows.push({
      batchOrder: i + 1,
      itemId: item.id,
      ourCardName: item.cardName,
      psaDescription: csv.description,
      certNumber: csv.certNumber,
      grade: csv.grade,
      zipUrl: csv.zipUrl,
      nameMatch,
    });
  }
  return {
    rows,
    countMismatch: csvRows.length !== batchItems.length,
    csvCount: csvRows.length,
    batchCount: batchItems.length,
    mismatchCount: rows.filter((r) => !r.nameMatch).length,
  };
}
