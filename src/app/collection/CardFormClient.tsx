'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth0 } from '@auth0/auth0-react';
import { AlertCircle } from 'lucide-react';
import {
  joinBackendUrl,
  type CollectorCard,
  type CardFormState,
  type GradingCompany,
  type Portfolio,
  normalizeCard,
  normalizePortfolio,
} from './types';
import { compressImage, getMemberLevel } from './components/shared';
import { CardFormView } from './components/CardFormView';
import { CollectionLoadingSkeleton } from './components/CollectionLoadingSkeleton';
import { cacheGet, cacheSet, cacheInvalidate } from './lib/apiCache';
import {
  cardReportsImage,
  resolveStoredCardImageUrls,
} from './lib/cardImages';
import { useCollectionAuth } from './hooks/useCollectionAuth';

interface CardFormClientProps {
  /** undefined = new card, string = card ID to edit */
  cardId?: string;
}

function CardFormInner({ cardId: cardIdProp }: CardFormClientProps) {
  const router = useRouter();
  const localize = useLocalizedPath();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const cardId = cardIdProp ?? searchParams.get('id') ?? undefined;
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { apiFetch, getAccessToken } = useCollectionAuth();

  const isEdit = !!cardId;

  /* ── Data state ── */
  const [card, setCard] = useState<CollectorCard | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [cardPortfolioIds, setCardPortfolioIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  // Track whether the server has front/back images (for upload/delete sync on save)
  const [serverImages, setServerImages] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });

  /* ── Load data on mount ── */
  const loadedForCardRef = useRef<string | null>(null);
  const imageCandidatesRef = useRef<{ front?: string; back?: string; raw?: any }>({});
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadKey = isEdit ? cardId ?? '' : '__new__';
    if (loadedForCardRef.current === loadKey) return;
    loadedForCardRef.current = loadKey;
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
          const { frontImage, backImage } = resolveStoredCardImageUrls(c.id, rawCard, c);
          imageCandidatesRef.current = { front: frontImage, back: backImage, raw: rawCard };

          setServerImages({
            front: cardReportsImage(rawCard, 0) || isServerUrl(frontImage),
            back: cardReportsImage(rawCard, 1) || isServerUrl(backImage),
          });

          // Public image URLs — no token; usable directly in <img src>
          setCard({ ...c, frontImage, backImage });
        }
      } catch (e) {
        setDataError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [isAuthenticated, isEdit, cardId, apiFetch]);

  /* ── Resolve public image URLs (GET /cards/:id/images/:seq needs no auth) ── */
  const loadImages = useCallback(async () => {
    const raw = imageCandidatesRef.current.raw;
    if (!raw) return undefined;
    const cardIdForImages = String(raw.Id ?? raw.id ?? cardId ?? '');
    const { frontImage, backImage } = resolveStoredCardImageUrls(cardIdForImages, raw, {
      frontImage: imageCandidatesRef.current.front,
      backImage: imageCandidatesRef.current.back,
    });
    setCard(prev => prev ? { ...prev, frontImage, backImage } : prev);
    return { frontImage, backImage };
  }, [cardId]);

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
    const token = await getAccessToken();
    const isDataUrl = (s?: string) => !!s && s.startsWith('data:');

    const uploadImage = async (dataUrl: string, seq: number) => {
      const blob = await fetch(dataUrl).then(r => r.blob());
      const fd = new FormData();
      fd.append('image', blob, `card-${seq}.jpg`);
      fd.append('seq', String(seq));
      const res = await fetch(joinBackendUrl(`/cards/${savedCardId}/images`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error(`Image upload failed (seq ${seq})`);
    };

    const deleteImage = async (seq: number) => {
      const res = await fetch(joinBackendUrl(`/cards/${savedCardId}/images/${seq}`), {
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
  }, [getAccessToken]);

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
        // Debug: log server response to help diagnose missing id issues
        // eslint-disable-next-line no-console
        console.debug('Card create response:', created);
        const payload = (created && typeof created === 'object' && ('data' in created)) ? (created as any).data : created;
        const candidateId = String((payload && (payload.Id ?? payload.id)) ?? '');
        if (!candidateId) throw new Error(`Card creation returned no id: ${JSON.stringify(created)}`);
        savedCardId = candidateId;
      }

      // Sync images (wrap to provide clearer errors)
      try {
        await syncCardImages(savedCardId, form.frontImage, form.backImage, serverImages.front, serverImages.back);
      } catch (imgErr) {
        // eslint-disable-next-line no-console
        console.error('Image sync failed for card', savedCardId, imgErr instanceof Error ? imgErr.message : imgErr);
        throw imgErr;
      }

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
        router.push(localize('/collection/list'));
        router.refresh();
      }
    } catch (e) {
      setSaving(false);
      alert(e instanceof Error ? e.message : 'Save failed');
    }
  }, [isEdit, card, cardPortfolioIds, serverImages, apiFetch, syncCardImages, portfolios, router, localize]);

  /* ── Auth guard ── */
  if (auth0Loading || dataLoading) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint">
        <div className="workspace-canvas container-tool max-w-3xl py-8">
          <CollectionLoadingSkeleton variant="form" label={t.common.loading} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') window.location.replace(localize('/collection/auth'));
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint">
        <div className="workspace-canvas container-tool max-w-3xl py-8">
          <CollectionLoadingSkeleton variant="form" rows={4} label={t.common.loading} />
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace flex items-center justify-center p-4">
        <div className="panel max-w-md w-full p-6 border-l-[3px] border-l-accent-danger text-center">
          <AlertCircle className="w-6 h-6 text-accent-danger mx-auto mb-3" aria-hidden="true" />
          <p className="text-accent-danger text-sm mb-4">{dataError}</p>
          <button type="button" onClick={() => router.push(localize('/collection/list'))} className="collection-action-pill collection-action-pill--block min-h-11 w-full">
            {t.common.back}
          </button>
        </div>
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
      key={cardId ?? 'new'}
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
      onBack={() => router.push(localize('/collection/list'))}
      onSave={handleSave}
      onScan={handleScan}
      onLoadImages={loadImages}
      serverImageFlags={serverImages}
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
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint">
        <div className="workspace-canvas container-tool max-w-3xl py-8">
          <CollectionLoadingSkeleton variant="form" />
        </div>
      </div>
    }>
      <CardFormInner {...props} />
    </Suspense>
  );
}
