'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import { fetchPublicMarketplaceCard } from '@/lib/marketplace/publicCards';
import { CARD_TRADING_PLACEHOLDER_ID } from '@/lib/marketplace-card-trading-static';
import type { TradingCard } from '@/types/trading-card';
import CardDetailClient from '@/app/business/card-trading/[id]/CardDetailClient';
import LocalLink from '@/components/LocalLink';

const RESERVED = new Set(['view', 'sell', '_']);

export function cardTradingIdFromPathname(pathname: string): string {
  const match = pathname.match(/\/(?:zh\/)?business\/card-trading\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || RESERVED.has(segment)) return '';
  return segment;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; card: TradingCard }
  | { status: 'not_found' };

export function CardTradingViewClient({ id: idProp = '' }: { id?: string }) {
  const pathname = useBrowserPathname();
  const id = useMemo(
    () => cardTradingIdFromPathname(pathname) || idProp,
    [pathname, idProp],
  );

  const [state, setState] = useState<LoadState>(() =>
    id && id !== CARD_TRADING_PLACEHOLDER_ID ? { status: 'loading' } : { status: 'not_found' },
  );

  useEffect(() => {
    if (!id || id === CARD_TRADING_PLACEHOLDER_ID) {
      setState({ status: 'not_found' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });
    fetchPublicMarketplaceCard(id).then((card) => {
      if (cancelled) return;
      setState(card ? { status: 'ready', card } : { status: 'not_found' });
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === 'loading') {
    return (
      <div className="min-h-dvh bg-surface-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (state.status === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-bg text-text-primary">
        <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
        <LocalLink href="/business/card-trading/" className="text-[#d4a843] hover:underline">
          ← Back to Marketplace
        </LocalLink>
      </div>
    );
  }

  return <CardDetailClient card={state.card} />;
}
