import { SNKR_BUYBACK_PRICES } from './data';
import type { SnkrBuybackPrice } from './types';

export type SnkrCardSeries = {
  cardId: string;
  /** Posted rows, earliest date first. Same-day rows keep source order. */
  rows: SnkrBuybackPrice[];
  cardName: string;
  cardNameEn: string;
  cardNumber: string;
  psaGrade: string;
};

function mostCommon(values: string[]): string {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  let best = values[0] ?? '';
  let bestCount = -1;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function buildCards(): Map<string, SnkrCardSeries> {
  const grouped = new Map<string, SnkrBuybackPrice[]>();
  for (const row of SNKR_BUYBACK_PRICES) {
    const list = grouped.get(row.card_id);
    if (list) list.push(row);
    else grouped.set(row.card_id, [row]);
  }

  const cards = new Map<string, SnkrCardSeries>();
  for (const [cardId, rows] of grouped) {
    const ordered = [...rows].sort((a, b) => a.date.localeCompare(b.date));
    cards.set(cardId, {
      cardId,
      rows: ordered,
      cardName: mostCommon(ordered.map((row) => row.card_name.trim())),
      cardNameEn: mostCommon(ordered.map((row) => row.card_name_en.trim())),
      cardNumber: mostCommon(ordered.map((row) => row.card_number.trim())),
      psaGrade: mostCommon(ordered.map((row) => row.psa_grade.trim())),
    });
  }
  return cards;
}

const CARDS = buildCards();

export function snkrCardIds(): string[] {
  return [...CARDS.keys()];
}

export function listSnkrCards(): SnkrCardSeries[] {
  return [...CARDS.values()];
}

/** Last posted row overall, or the last row on one date. */
export function latestSnkrRow(card: SnkrCardSeries, date: string): SnkrBuybackPrice | undefined {
  if (date === 'all') return card.rows[card.rows.length - 1];
  let match: SnkrBuybackPrice | undefined;
  for (const row of card.rows) {
    if (row.date === date) match = row;
  }
  return match;
}

export function getSnkrCard(cardId: string): SnkrCardSeries | undefined {
  return CARDS.get(cardId);
}
