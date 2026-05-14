'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2 } from 'lucide-react';
import {
  BACKEND_URL,
  type CollectorCard,
  type CardFormState,
  type GradingCompany,
  type Portfolio,
  normalizeCard,
  normalizePortfolio,
} from './types';
import { compressImage, getMemberLevel } from './components/shared';
import { CardFormView } from './components/CardFormView';
import { cacheGet, cacheSet, cacheInvalidate } from './lib/apiCache';

interface CardFormClientProps {
  /** undefined = new card, string = card ID to edit */
  cardId?: string;
}

function CardFormInner({ cardId: cardIdProp }: CardFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = cardIdProp ?? searchParams.get('id') ?? undefined;
  const { isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();

  const isEdit = !!cardId;

  /* ── Stable refs for auth helpers (avoids effect re-runs on token refresh) ── */
  const getTokenRef = useRef(getAccessTokenSilently);
  useEffect(() => { getTokenRef.current = getAccessTokenSilently; }, [getAccessTokenSilently]);

  /* ── API helper ── */
  const apiFetch = useCallback(async (path: string, options?: RequestInit) => {
    const token = await getTokenRef.current();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Data state ── */
  const [card, setCard] = useState<CollectorCard | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [cardPortfolioIds, setCardPortfolioIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  // Track whether the server actually has front/back images (independent of data-URL fetch success)
  const [serverImages, setServerImages] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });

  /* ── Fetch card image as authenticated data URL ── */
  const fetchImageAsDataUrl = useCallback(async (url: string): Promise<string | undefined> => {
    try {
      const token = await getTokenRef.current();
      const fetchUrl = url.startsWith(BACKEND_URL)
        ? url.replace(BACKEND_URL, '/api/imgproxy')
        : url;
      const res = await fetch(fetchUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return undefined;
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch { return undefined; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load data on mount ── */
  const loadedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || loadedRef.current) return;
    loadedRef.current = true;
    const isServerUrl = (s?: string) => !!s && !s.startsWith('data:');

    async function load() {
      setDataLoading(true);
      setDataError(null);
      // Serve portfolios from cache immediately
      const cachedPortfolios = cacheGet<object[]>('/portfolios');
      if (cachedPortfolios) setPortfolios(cachedPortfolios.map(normalizePortfolio));
      try {
        const [portfolioList, rawCard] = await Promise.all([
          apiFetch('/portfolios') as Promise<object[]>,
          isEdit ? apiFetch(`/cards/${cardId}`) : Promise.resolve(null),
        ]);
        cacheSet('/portfolios', portfolioList as object[]);
        setPortfolios((portfolioList as object[]).map(normalizePortfolio));

        if (rawCard) {
          const c = normalizeCard(rawCard);
          // Extract portfolio IDs from the card response directly
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawPortfolios: any[] = Array.isArray((rawCard as any).portfolios) ? (rawCard as any).portfolios : [];
          setCardPortfolioIds(rawPortfolios.map(p => String(p.Id ?? p.id ?? '')).filter(Boolean));
          // For edit mode, always fetch images directly from the known URL pattern
          // since GET /cards/:id may not return the images array.
          const imageUrl = (seq: number) => `${BACKEND_URL}/cards/${c.id}/images/${seq}`;
          const [frontImage, backImage] = await Promise.all([
            c.frontImage && !isServerUrl(c.frontImage)
              ? Promise.resolve(c.frontImage)
              : fetchImageAsDataUrl(imageUrl(0)),
            c.backImage && !isServerUrl(c.backImage)
              ? Promise.resolve(c.backImage)
              : fetchImageAsDataUrl(imageUrl(1)),
          ]);
          // Record server image existence based on actual fetch result OR known server URL
          setServerImages({
            front: !!frontImage || isServerUrl(c.frontImage),
            back:  !!backImage  || isServerUrl(c.backImage),
          });
          setCard({ ...c, frontImage, backImage });
        }
      } catch (e) {
        setDataError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [isAuthenticated, isEdit, cardId]); // apiFetch/fetchImageAsDataUrl are stable (ref-based)

  /* ── Scan helper ── */
  const handleScan = useCallback(async (file: File): Promise<Partial<CardFormState>> => {
    const { base64, mimeType } = await compressImage(file);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await apiFetch('/cards/scan', {
      method: 'POST',
      body: JSON.stringify({ image: base64, mimeType }),
    });
    const company = (raw.grade_company ?? undefined) as GradingCompany | undefined;
    const isBlackLabel = raw.score_blacklabel === true || raw.score_blacklabel === 'true';
    return {
      name:         raw.card_name != null
        ? (raw.card_original_name ? `${raw.card_name} - ${raw.card_original_name}` : raw.card_name)
        : undefined,
      year:         raw.card_year  != null ? String(raw.card_year) : undefined,
      grade:        raw.score      != null ? String(raw.score)     : undefined,
      company,
      isBlackLabel: isBlackLabel || undefined,
      set:          raw.card_series ?? undefined,
      number:       raw.card_number ?? undefined,
      certNumber:   raw.cert_number ?? undefined,
      language:     raw.card_lang   ?? undefined,
    };
  }, [apiFetch]);

  /* ── Image sync helper ── */
  const syncCardImages = useCallback(async (
    savedCardId: string,
    frontImage: string | undefined,
    backImage:  string | undefined,
    hadFront:   boolean,
    hadBack:    boolean,
  ) => {
    const token = await getTokenRef.current();
    const isDataUrl = (s?: string) => !!s && s.startsWith('data:');

    const uploadImage = async (dataUrl: string, seq: number) => {
      const blob = await fetch(dataUrl).then(r => r.blob());
      const fd = new FormData();
      fd.append('image', blob, `card-${seq}.jpg`);
      fd.append('seq', String(seq));
      const res = await fetch(`${BACKEND_URL}/cards/${savedCardId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error(`Image upload failed (seq ${seq})`);
    };

    const deleteImage = async (seq: number) => {
      const res = await fetch(`${BACKEND_URL}/cards/${savedCardId}/images/${seq}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 404) throw new Error(`Image delete failed (seq ${seq})`);
    };

    await Promise.all([
      isDataUrl(frontImage) ? uploadImage(frontImage!, 0)
        : (!frontImage && hadFront ? deleteImage(0) : Promise.resolve()),
      isDataUrl(backImage)  ? uploadImage(backImage!,  1)
        : (!backImage  && hadBack  ? deleteImage(1) : Promise.resolve()),
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Save handler ── */
  const handleSave = useCallback(async (form: CardFormState, portfolioIds: string[]) => {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        year: +form.year,
        company: form.company,
        grade: +form.grade,
        buyPrice: form.buyPrice ? +form.buyPrice : 0,
        buyCurrency: form.buyCurrency,
        sold: form.sold,
        listPrice: form.listPrice ? +form.listPrice : undefined,
        listCurrency: form.listCurrency,
        set: form.set ?? '',
        number: form.number ?? '',
        certNumber: form.certNumber ?? '',
        language: form.language,
        isBlackLabel: form.isBlackLabel ?? false,
      };

      let savedCardId: string;
      if (isEdit && card) {
        await apiFetch(`/cards/${card.id}`, { method: 'PUT', body: JSON.stringify(body) });
        savedCardId = card.id;
      } else {
        const created = await apiFetch('/cards', { method: 'POST', body: JSON.stringify(body) });
        savedCardId = normalizeCard(created.data ?? created).id;
      }

      // Sync images
      await syncCardImages(savedCardId, form.frontImage, form.backImage, serverImages.front, serverImages.back);

      // Sync portfolio memberships
      // Use cardPortfolioIds (sourced from GET /cards/:id response) as the authoritative
      // baseline so we only call the API for actual adds/removes.
      const currentPortfolioIds = isEdit
        ? cardPortfolioIds
        : portfolios.filter(p => p.cardIds.includes(savedCardId)).map(p => p.id);
      const toAdd    = portfolioIds.filter(id => !currentPortfolioIds.includes(id));
      const toRemove = currentPortfolioIds.filter(id => !portfolioIds.includes(id));
      await Promise.all([
        ...toAdd.map(pid => apiFetch(`/portfolios/${pid}/cards`, {
          method: 'POST', body: JSON.stringify({ cardId: savedCardId }),
        })),
        ...toRemove.map(pid => apiFetch(`/portfolios/${pid}/cards/${savedCardId}`, { method: 'DELETE' })),
      ]);

      cacheInvalidate('/cards', '/portfolios');

      if (isEdit) {
        // Update serverImages and cardPortfolioIds to reflect new state after save
        setServerImages({ front: !!form.frontImage, back: !!form.backImage });
        setCardPortfolioIds(portfolioIds);
        setSaving(false);
        setSaveMsg('Card updated');
        setTimeout(() => setSaveMsg(null), 3000);
      } else {
        router.push('/collection/list');
        router.refresh();
      }
    } catch (e) {
      setSaving(false);
      alert(e instanceof Error ? e.message : 'Save failed');
    }
  }, [isEdit, card, cardPortfolioIds, serverImages, apiFetch, syncCardImages, portfolios, router]);

  /* ── Auth guard ── */
  if (auth0Loading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#9B7EBF] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') window.location.replace('/collection/auth');
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#9B7EBF] animate-spin" />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <p className="text-red-400 text-sm">{dataError}</p>
      </div>
    );
  }

  const initialPortfolioIds = card
    ? (cardPortfolioIds.length > 0
        ? cardPortfolioIds
        : portfolios.filter(p => p.cardIds.includes(card.id)).map(p => p.id))
    : [];

  // suppress unused import warning
  void getMemberLevel;

  return (
    <CardFormView
      initial={card ? {
        name: card.name,
        year: String(card.year),
        company: card.company,
        grade: String(card.grade),
        buyPrice: String(card.buyPrice),
        buyCurrency: card.buyCurrency,
        sold: card.sold,
        listPrice: card.listPrice ? String(card.listPrice) : '',
        listCurrency: card.listCurrency ?? 'HKD',
        set: card.set ?? '',
        number: card.number ?? '',
        certNumber: card.certNumber ?? '',
        language: card.language ?? 'Japanese',
        isBlackLabel: card.isBlackLabel ?? false,
        frontImage: card.frontImage,
        backImage: card.backImage,
      } : null}
      isEdit={isEdit}
      onBack={() => router.push('/collection/list')}
      onSave={handleSave}
      onScan={handleScan}
      saving={saving}
      saveMsg={saveMsg}
      portfolios={portfolios}
      initialPortfolioIds={initialPortfolioIds}
    />
  );
}

export default function CardFormClient(props: CardFormClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#9B7EBF] animate-spin" />
      </div>
    }>
      <CardFormInner {...props} />
    </Suspense>
  );
}
