'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ExternalLink, Loader2, LogIn } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useCollectionAuth } from '@/app/collection/hooks/useCollectionAuth';
import { authAuthorizationParams, currentReturnTo } from '@/app/collection/lib/authSession';
import {
  normalizeCard,
  normalizePortfolio,
  type CollectorCard,
  type Portfolio,
} from '@/app/collection/types';
import { isMarketplaceSellerEmail } from '@/lib/marketplace-seller';
import { formatPrice } from '@/lib/card-helpers';

const MARKETPLACE_PORTFOLIO_NAME = 'Marketplace';
const ARENA_IG = 'https://www.instagram.com/138arena/';

export default function SellClient() {
  const { t } = useLanguage();
  const copy = t.cardMarketplace.sellPage;
  const localize = useLocalizedPath();
  const { isAuthenticated, isLoading: authLoading, user, loginWithRedirect } = useAuth0();
  const { apiFetch } = useCollectionAuth();

  const canSell = isMarketplaceSellerEmail(user?.email);
  const [cards, setCards] = useState<CollectorCard[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});

  const publicPortfolio = useMemo(
    () =>
      portfolios.find((p) => p.isPublic)
      ?? portfolios.find((p) => p.name === MARKETPLACE_PORTFOLIO_NAME),
    [portfolios],
  );

  const listedIds = useMemo(() => new Set(publicPortfolio?.cardIds ?? []), [publicPortfolio]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cardsRaw, portfoliosRaw] = await Promise.all([
        apiFetch('/cards?limit=100&page=1'),
        apiFetch('/portfolios'),
      ]);
      const cardRows = Array.isArray(cardsRaw?.cards) ? cardsRaw.cards : Array.isArray(cardsRaw) ? cardsRaw : [];
      const portfolioRows = Array.isArray(portfoliosRaw) ? portfoliosRaw : portfoliosRaw?.data ?? [];
      const normalizedPortfolios: Portfolio[] = portfolioRows.map(normalizePortfolio);
      const publicOnes = normalizedPortfolios.filter((p) => p.isPublic);
      const withCards = await Promise.all(
        publicOnes.map(async (p) => {
          const detail = await apiFetch(`/portfolios/${p.id}`);
          return normalizePortfolio(detail.data ?? detail);
        }),
      );
      const byId = new Map(withCards.map((p) => [p.id, p]));
      setCards(cardRows.map(normalizeCard));
      setPortfolios(normalizedPortfolios.map((p) => byId.get(p.id) ?? p));
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, copy.loadError]);

  useEffect(() => {
    if (!isAuthenticated || !canSell) return;
    void load();
  }, [isAuthenticated, canSell, load]);

  const ensurePublicPortfolio = useCallback(async (): Promise<string> => {
    if (publicPortfolio?.id) {
      if (!publicPortfolio.isPublic) {
        await apiFetch(`/portfolios/${publicPortfolio.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: publicPortfolio.name, isPublic: true }),
        });
        setPortfolios((prev) =>
          prev.map((p) => (p.id === publicPortfolio.id ? { ...p, isPublic: true } : p)),
        );
      }
      return publicPortfolio.id;
    }
    const created = await apiFetch('/portfolios', {
      method: 'POST',
      body: JSON.stringify({ name: MARKETPLACE_PORTFOLIO_NAME, isPublic: true }),
    });
    const normalized = normalizePortfolio(created.data ?? created);
    setPortfolios((prev) => [...prev, normalized]);
    return normalized.id;
  }, [apiFetch, publicPortfolio]);

  const handleList = useCallback(async (card: CollectorCard) => {
    const draft = priceDraft[card.id] ?? (card.listPrice != null ? String(card.listPrice) : '');
    const price = Number(draft);
    if (!Number.isFinite(price) || price <= 0) return;
    setBusyId(card.id);
    try {
      await apiFetch(`/cards/${card.id}`, {
        method: 'PUT',
        body: JSON.stringify({ listPrice: price, listCurrency: card.listCurrency ?? card.buyCurrency ?? 'HKD' }),
      });
      const portfolioId = await ensurePublicPortfolio();
      if (!listedIds.has(card.id)) {
        await apiFetch(`/portfolios/${portfolioId}/cards`, {
          method: 'POST',
          body: JSON.stringify({ cardId: card.id }),
        });
      }
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, listPrice: price } : c)));
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId && !p.cardIds.includes(card.id)
            ? { ...p, cardIds: [...p.cardIds, card.id], isPublic: true }
            : p.id === portfolioId
              ? { ...p, isPublic: true }
              : p,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.loadError);
    } finally {
      setBusyId(null);
    }
  }, [apiFetch, ensurePublicPortfolio, listedIds, priceDraft, copy.loadError]);

  const handleUnlist = useCallback(async (card: CollectorCard) => {
    if (!publicPortfolio?.id) return;
    setBusyId(card.id);
    try {
      await apiFetch(`/portfolios/${publicPortfolio.id}/cards/${card.id}`, { method: 'DELETE' });
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === publicPortfolio.id
            ? { ...p, cardIds: p.cardIds.filter((id) => id !== card.id) }
            : p,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.loadError);
    } finally {
      setBusyId(null);
    }
  }, [apiFetch, publicPortfolio, copy.loadError]);

  const signIn = () => {
    void loginWithRedirect({
      appState: { returnTo: currentReturnTo() || localize('/business/card-trading/sell/') },
      authorizationParams: authAuthorizationParams(),
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-surface-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-surface-bg flex items-center justify-center p-6">
        <div className="panel max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-text-primary mb-3">{copy.title}</h1>
          <p className="text-sm text-text-secondary mb-6">{copy.signIn}</p>
          <button
            type="button"
            onClick={signIn}
            className="btn btn-primary w-full min-h-11 text-sm font-semibold"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            {copy.signIn}
          </button>
        </div>
      </div>
    );
  }

  if (!canSell) {
    return (
      <div className="min-h-dvh bg-surface-bg flex items-center justify-center p-6">
        <div className="panel max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-text-primary mb-3">{copy.deniedTitle}</h1>
          <p className="text-sm text-text-secondary leading-relaxed mb-2">{copy.deniedBody}</p>
          <p className="text-xs text-text-muted mb-6">{copy.arenaAddress}</p>
          <a
            href={ARENA_IG}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full min-h-11 text-sm font-semibold"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            {copy.arenaCta}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-bg">
      <div className="container-custom py-16 max-w-3xl">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-2">{copy.title}</h1>
        <p className="text-sm text-text-secondary mb-8">{copy.hint}</p>
        {error && <p className="text-sm text-accent-danger mb-4">{error}</p>}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-label="Loading" />
          </div>
        ) : cards.length === 0 ? (
          <div className="panel p-8 text-center">
            <p className="text-sm text-text-secondary mb-4">{copy.empty}</p>
            <LocalLink href="/collection/list/" className="text-accent-brand text-sm font-medium hover:underline">
              {copy.openCollection}
            </LocalLink>
          </div>
        ) : (
          <ul className="space-y-3">
            {cards.map((card) => {
              const listed = listedIds.has(card.id);
              const draft = priceDraft[card.id] ?? (card.listPrice != null ? String(card.listPrice) : '');
              return (
                <li key={card.id} className="panel p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{card.name}</p>
                    <p className="text-xs text-text-muted">
                      {card.company} {card.grade}
                      {card.year ? ` · ${card.year}` : ''}
                      {listed ? ` · ${copy.listed}` : ''}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>{copy.listPrice}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      className="w-28 min-h-11 px-2 bg-surface-raised border border-border-default text-text-primary text-sm"
                      value={draft}
                      onChange={(e) => setPriceDraft((prev) => ({ ...prev, [card.id]: e.target.value }))}
                    />
                  </label>
                  {listed ? (
                    <button
                      type="button"
                      disabled={busyId === card.id}
                      onClick={() => void handleUnlist(card)}
                      className="min-h-11 px-4 rounded-lg border border-border-default text-sm text-text-secondary"
                    >
                      {busyId === card.id ? copy.saving : copy.unlist}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === card.id || !draft}
                      onClick={() => void handleList(card)}
                      className="btn btn-primary min-h-11 text-sm font-semibold disabled:opacity-40"
                    >
                      {busyId === card.id ? copy.saving : copy.list}
                    </button>
                  )}
                  {card.listPrice != null && (
                    <span className="text-xs text-text-muted">
                      {formatPrice(card.listPrice, card.listCurrency ?? 'HKD')}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
