import type { TradingCard, GradingCompany } from '@/types/trading-card';

/* ──────────────────────────────────────────
   Cards API Client
   Fetches trading card data from Cloudflare D1
   via Worker API. Falls back to static JSON
   during local development.
   ────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_CARDS_API_URL || '';

/**
 * Fetch all trading cards.
 * When NEXT_PUBLIC_CARDS_API_URL is set, hits the
 * Cloudflare Worker endpoint. Otherwise loads the
 * local static JSON as a fallback for dev/preview.
 */
export async function fetchCards(): Promise<TradingCard[]> {
  // ── Remote API ──
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/cards`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Cards API error: ${res.status}`);
    const data: TradingCard[] = await res.json();
    return normalise(data);
  }

  // ── Local fallback (static JSON) ──
  const res = await fetch('/data/trade-card.json');
  if (!res.ok) throw new Error('Failed to load local card data');
  const data: TradingCard[] = await res.json();
  return normalise(data);
}

/** Ensure company field is correctly typed after JSON parse */
function normalise(cards: TradingCard[]): TradingCard[] {
  return cards.map(c => ({
    ...c,
    company: c.company as GradingCompany,
  }));
}
