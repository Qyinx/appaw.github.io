'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import { Loader2 } from 'lucide-react';
import {
  fetchPublicPortfolioForClient,
  type PublicPortfolio,
} from '@/lib/collection/publicPortfolio';
import { PublicPortfolioView } from './PublicPortfolioView';
import { PublicPortfolioNotFound, PublicPortfolioError } from './PublicPortfolioNotFound';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; portfolio: PublicPortfolio }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

/** Parse portfolio id from `/collection/p/:id/` or `/zh/collection/p/:id/`. */
const RESERVED_SEGMENTS = new Set(['view', '_']);

export function portfolioIdFromPathname(pathname: string): string {
  const match = pathname.match(/\/(?:zh\/)?collection\/p\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || RESERVED_SEGMENTS.has(segment)) return '';
  return segment;
}

export function PublicPortfolioPageClient({ id: idProp = '' }: { id?: string }) {
  const pathname = useBrowserPathname();
  const id = useMemo(() => portfolioIdFromPathname(pathname) || idProp, [pathname, idProp]);

  const [state, setState] = useState<LoadState>(() =>
    id ? { status: 'loading' } : { status: 'not_found' },
  );

  useEffect(() => {
    if (!id) {
      setState({ status: 'not_found' });
      return;
    }

    let cancelled = false;

    (async () => {
      setState({ status: 'loading' });
      try {
        const portfolio = await fetchPublicPortfolioForClient(id);
        if (cancelled) return;
        if (!portfolio) {
          setState({ status: 'not_found' });
          return;
        }
        setState({ status: 'ready', portfolio });
      } catch (e) {
        if (cancelled) return;
        setState({
          status: 'error',
          message: e instanceof Error ? e.message : 'Unknown error',
        });
      }
    })();

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

  if (state.status === 'not_found') return <PublicPortfolioNotFound />;
  if (state.status === 'error') return <PublicPortfolioError message={state.message} />;

  return <PublicPortfolioView portfolio={state.portfolio} />;
}