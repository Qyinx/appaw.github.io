import { useState, useEffect } from 'react';
import type { TradingCard } from '@/types/trading-card';
import { fetchCards } from '@/lib/cards-api';

/* ──────────────────────────────────────────
   useCards Hook
   Loads trading cards from API with
   loading / error states.

   When `initialCards` is provided (e.g. from
   a server component) the hook starts with
   data already available — no loading flash
   and the HTML contains real card content
   for SEO / static export.
   ────────────────────────────────────────── */

export function useCards(initialCards?: TradingCard[]) {
  const hasInitial = !!initialCards?.length;
  const [cards, setCards] = useState<TradingCard[]>(initialCards ?? []);
  const [loading, setLoading] = useState(!hasInitial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If an API URL is configured, always re-fetch for fresh data.
    // Otherwise skip the fetch when we already have build-time data.
    if (hasInitial && !process.env.NEXT_PUBLIC_CARDS_API_URL) return;

    let cancelled = false;
    if (!hasInitial) setLoading(true);

    fetchCards()
      .then(data => { if (!cancelled) setCards(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { cards, loading, error };
}
