import { useState, useEffect } from 'react';
import type { TradingCard } from '@/types/trading-card';
import { fetchCards } from '@/lib/cards-api';

/* ──────────────────────────────────────────
   useCards Hook
   Loads trading cards from API with
   loading / error states.
   ────────────────────────────────────────── */

export function useCards() {
  const [cards, setCards] = useState<TradingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCards()
      .then(data => { if (!cancelled) setCards(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { cards, loading, error };
}
