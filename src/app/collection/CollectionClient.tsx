'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2 } from 'lucide-react';
import {
  BACKEND_URL,
  type CollectorCard,
  type Portfolio,
  normalizeCard,
  normalizePortfolio,
} from './types';
import { getMemberLevel, type MemberLevel } from './components/shared';
import { CollectionListView } from './components/CollectionListView';
import { cacheGet, cacheSet, cacheInvalidate } from './lib/apiCache';

export default function CollectionClient() {
  const router = useRouter();
  const localize = useLocalizedPath();
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    logout,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  /* ── API helper ──────────────────────────────────────────────────────────── */
  const apiFetch = useCallback(async (path: string, options?: RequestInit) => {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }, [getAccessTokenSilently]);

  /* ── Auto-register helper ────────────────────────────────────────────────── */
  const registerAndReload = useCallback(async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();
      await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({ id_token: idTokenClaims?.__raw }),
      });
      window.location.reload();
    } catch {
      setApiError('Registration failed. Please sign out and sign in again.');
    }
  }, [apiFetch, getIdTokenClaims]);

  /* ── Data state ──────────────────────────────────────────────────────────── */
  const [cards, setCards] = useState<CollectorCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const loadCards = useCallback(async () => {
    // Show cached data immediately while fetching fresh data in background
    const cached = cacheGet<object[]>('/cards');
    if (cached) {
      setCards(cached.map(normalizeCard));
      setLoading(false);
    } else {
      setLoading(true);
    }
    setApiError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const first: any = await apiFetch('/cards?limit=100&page=1');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allRaw: any[] = Array.isArray(first.cards) ? first.cards : (Array.isArray(first) ? first : []);
      const totalPages: number = first.totalPages ?? 1;
      if (totalPages > 1) {
        const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pages.map(p => apiFetch(`/cards?limit=100&page=${p}`).then((r: any) =>
            Array.isArray(r.cards) ? r.cards : []
          ))
        );
        allRaw = allRaw.concat(...rest);
      }
      cacheSet('/cards', allRaw);
      setCards(allRaw.map(normalizeCard));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load cards';
      if (msg === 'User not registered on this app') {
        await registerAndReload();
        return;
      }
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPortfolios = useCallback(async () => {
    const cached = cacheGet<object[]>('/portfolios');
    if (cached) setPortfolios(cached.map(normalizePortfolio));
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list = await apiFetch('/portfolios') as any[];
      cacheSet('/portfolios', list);
      setPortfolios(list.map(normalizePortfolio));
    } catch { /* non-critical */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePortfolio = useCallback(async (name: string, isPublic: boolean) => {
    const created = await apiFetch('/portfolios', {
      method: 'POST',
      body: JSON.stringify({ name, isPublic }),
    });
    const updated = (prev: Portfolio[]) => [...prev, normalizePortfolio(created.data ?? created)];
    setPortfolios(updated);
    cacheInvalidate('/portfolios');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePortfolio = useCallback(async (id: string, name: string, isPublic: boolean) => {
    await apiFetch(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, isPublic }),
    });
    setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name, isPublic } : p));
    cacheInvalidate('/portfolios');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeletePortfolio = useCallback(async (id: string) => {
    await apiFetch(`/portfolios/${id}`, { method: 'DELETE' });
    setPortfolios(prev => prev.filter(p => p.id !== id));
    cacheInvalidate('/portfolios');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCardToPortfolio = useCallback(async (portfolioId: string, cardId: string) => {
    await apiFetch(`/portfolios/${portfolioId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ cardId }),
    });
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId && !p.cardIds.includes(cardId)
        ? { ...p, cardIds: [...p.cardIds, cardId], count: p.count + 1 }
        : p
    ));
    cacheInvalidate('/portfolios');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveCardFromPortfolio = useCallback(async (portfolioId: string, cardId: string) => {
    await apiFetch(`/portfolios/${portfolioId}/cards/${cardId}`, { method: 'DELETE' });
    setPortfolios(prev => prev.map(p =>
      p.id === portfolioId
        ? { ...p, cardIds: p.cardIds.filter(id => id !== cardId), count: Math.max(0, p.count - 1) }
        : p
    ));
    cacheInvalidate('/portfolios');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadPortfolioCards = useCallback(async (portfolioId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await apiFetch(`/portfolios/${portfolioId}`);
      const cardIds: string[] = Array.isArray(data.cards)
        ? data.cards.map((c: any) => String(c.Id ?? c.id ?? ''))
        : [];
      setPortfolios(prev => prev.map(p =>
        p.id === portfolioId ? { ...p, cardIds } : p
      ));
    } catch { /* non-critical */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Profile cache helper ────────────────────────────────────────────────── */
  const fetchAndCacheProfile = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await apiFetch('/users/me');
      const level: MemberLevel | undefined =
        data.Membership === 'Foil' || data.Membership === 'Prism' || data.Membership === 'Aurora'
          ? data.Membership
          : undefined;
      localStorage.setItem('auth0_user', JSON.stringify({
        id: data.Id,
        name: data.DisplayName,
        mail: data.Mail,
        memberLevel: level,
      }));
      setMemberLevel(level);
    } catch { /* non-critical */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || loadedRef.current) return;
    loadedRef.current = true;
    if (!localStorage.getItem('auth0_user')) {
      fetchAndCacheProfile();
    }
    loadCards();
    loadPortfolios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /* ── View state ──────────────────────────────────────────────────────────── */
  const [saveMsg, setSaveMsg] = useState('');
  const userName = user?.name ?? user?.nickname ?? 'Collector';
  const [memberLevel, setMemberLevel] = React.useState<MemberLevel | undefined>(getMemberLevel);

  /* ── Handlers ────────────────────────────────────────────────────────────── */
  const handleDeleteCard = useCallback(async (id: string) => {
    try {
      await apiFetch(`/cards/${id}`, { method: 'DELETE' });
      setCards(prev => prev.filter(c => c.id !== id));
      cacheInvalidate('/cards');
      setSaveMsg('Card deleted ✓');
    } catch (e) {
      setSaveMsg(e instanceof Error ? `Error: ${e.message}` : 'Delete failed');
    }
    setTimeout(() => setSaveMsg(''), 2500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleSold = useCallback(async (card: CollectorCard) => {
    try {
      const updated = await apiFetch(`/cards/${card.id}`, {
        method: 'PUT',
        body: JSON.stringify({ sold: !card.sold }),
      });
      setCards(prev => prev.map(c => c.id === card.id ? normalizeCard(updated.data ?? updated) : c));
      cacheInvalidate('/cards');
      setSaveMsg(card.sold ? 'Marked available ✓' : 'Marked as sold ✓');
    } catch {
      setSaveMsg('Update failed');
    }
    setTimeout(() => setSaveMsg(''), 2500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auth0 SDK still initialising ───────────────────────────────────────── */
  if (auth0Loading) {
    return (
      <div className="min-h-screen bg-surface-bg min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-link animate-spin" />
      </div>
    );
  }

  /* ── Not authenticated ───────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') window.location.replace(localize('/collection/auth'));
    return (
      <div className="min-h-screen bg-surface-bg min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-link animate-spin" />
      </div>
    );
  }

  /* ── List view ───────────────────────────────────────────────────────────── */
  return (
    <CollectionListView
      cards={cards}
      loading={loading}
      apiError={apiError}
      saveMsg={saveMsg}
      user={user}
      userName={userName}
      memberLevel={memberLevel}
      portfolios={portfolios}
      onOpenNew={() => router.push(localize('/collection/card/new'))}
      onOpenEdit={card => router.push(localize(`/collection/card/edit?id=${card.id}`))}
      onRefresh={loadCards}
      onDeleteCard={handleDeleteCard}
      onToggleSold={handleToggleSold}
      onLogout={() => {
        localStorage.removeItem('auth0_user');
        logout({ logoutParams: { returnTo: (() => { const u = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ?? localize('/collection/auth'); return u.startsWith('http') ? u : (typeof window !== 'undefined' ? window.location.origin : '') + u; })() } });
      }}
      onCreatePortfolio={handleCreatePortfolio}
      onUpdatePortfolio={handleUpdatePortfolio}
      onDeletePortfolio={handleDeletePortfolio}
      onAddCardToPortfolio={handleAddCardToPortfolio}
      onRemoveCardFromPortfolio={handleRemoveCardFromPortfolio}
      onLoadPortfolioCards={handleLoadPortfolioCards}
    />
  );
}
