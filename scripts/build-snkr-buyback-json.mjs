#!/usr/bin/env node
/**
 * Rebuild SNKRDUNK Akihabara buyback JSON from the approved CSVs.
 *   node scripts/build-snkr-buyback-json.mjs
 *
 * Only the files in src/lib/snkr-buyback/source/ are inputs.
 * Do not point this at unapproved daily extracts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'src/lib/snkr-buyback/source');
const outDir = path.join(root, 'src/lib/snkr-buyback');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cur);
      cur = '';
    } else if (ch === '\n') {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else if (ch !== '\r') {
      cur += ch;
    }
  }

  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

function records(fileName) {
  const rows = parseCsv(readFileSync(path.join(sourceDir, fileName), 'utf8'));
  const [header, ...data] = rows;
  if (!header) throw new Error(`Missing header in ${fileName}`);
  return data.map((cells) => {
    const record = {};
    header.forEach((key, index) => {
      record[key] = (cells[index] ?? '').trim();
    });
    return record;
  });
}

function writeJson(fileName, rows) {
  const body = `[\n${rows.map((row) => JSON.stringify(row)).join(',\n')}\n]\n`;
  writeFileSync(path.join(outDir, fileName), body, 'utf8');
}

const prices = records('batch1.csv').map((row) => {
  const buybackPrice = Number(row.buyback_price);
  if (!Number.isFinite(buybackPrice)) {
    throw new Error(`Invalid buyback_price for ${row.card_id} on ${row.date}`);
  }
  return {
    date: row.date,
    card_id: row.card_id,
    card_name: row.card_name,
    card_name_en: row.card_name_en,
    card_number: row.card_number,
    psa_grade: row.psa_grade,
    buyback_price: buybackPrice,
    currency: row.currency,
    price_source: row.price_source,
    source_post_url: row.source_post_url,
    image_url: row.image_url,
    notes: row.notes,
  };
});

const announcements = records('announcements.csv').map((row) => ({
  date: row.date,
  label: row.label,
  source_post_url: row.source_post_url,
  notes: row.notes,
}));

if (prices.length === 0 || announcements.length === 0) {
  throw new Error('Refusing to write empty SNKRDUNK buyback JSON');
}

writeJson('prices.json', prices);
writeJson('announcements.json', announcements);
console.log(`Wrote ${prices.length} prices and ${announcements.length} announcements.`);
