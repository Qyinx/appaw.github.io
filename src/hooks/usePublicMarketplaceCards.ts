import { useEffect, useState } from 'react';
import type { TradingCard } from '@/types/trading-card';
import {
  fetchPublicMarketplaceCards,
  type PublicMarketplaceList,
} from '@/lib/marketplace/publicCards';
import type { MarketplaceQuery } from '@/lib/marketplace/query';

export function usePublicMarketplaceCards(query: MarketplaceQuery, enabled = true) {
  const [cards, setCards] = useState<TradingCard[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(query.page);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCards([]);
      setTotal(0);
      setTotalPages(1);
      setLoading(false);
      setError(null);
      return;
    }

    const key = JSON.stringify(query);
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPublicMarketplaceCards(query)
      .then((data: PublicMarketplaceList) => {
        if (cancelled) return;
        setCards(data.cards);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // query object identity changes every render; serialize for a stable dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, JSON.stringify(query)]);

  return { cards, total, totalPages, page, loading, error };
}
