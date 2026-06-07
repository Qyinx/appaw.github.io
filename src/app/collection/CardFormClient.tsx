'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2, AlertCircle } from 'lucide-react';
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
  // Track whether the server actually has front/back images (independent of data-URL fetch success)
  const [serverImages, setServerImages] = useState<{ front: boolean; back: boolean }>({ front: false, back: false });

  /* ── Fetch card image as authenticated data URL ── */
  const fetchImageAsDataUrl = useCallback(async (url: string): Promise<string | undefined> => {
    try {
      const token = await getAccessToken();
      // Fetch images directly from the backend URL. Ensure the backend
      // allows CORS for the site origin and accepts the Authorization header.
      const fetchUrl = url;
      const res = await fetch(fetchUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.debug('fetchImageAsDataUrl: non-OK response', { url: fetchUrl, status: res.status, statusText: res.statusText });
        return undefined;
      }
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.debug('fetchImageAsDataUrl: error fetching', { url, error: err });
      return undefined;
    }
  }, [getAccessToken]);

  /* ── Load data on mount ── */
  const loadedRef = useRef(false);
  const imageCandidatesRef = useRef<{ front?: string; back?: string; raw?: any }>({});
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
          // For edit mode, inspect the raw card response's `images` array. The
          // backend may return an array of objects like `{ url, seq }` where
          // `seq === 0` means front and `seq === 1` means back. If entries are
          // plain strings, try to map by index. Fall back to the backend images
          // endpoint if no direct URL is present.
          const imageUrl = (seq: number) => `${BACKEND_URL}/cards/${c.id}/images/${seq}`;

          const getRawImageUrl = (raw: any, seq: number): string | undefined => {
            if (Array.isArray(raw.images) && raw.images.length > 0) {
              // Prefer object entries with an explicit seq
              const obj = raw.images.find((it: any) => it && typeof it === 'object' && (it.seq === seq || it.seq === String(seq) || it.index === seq));
              if (obj) return obj.url ?? obj.Url ?? obj.path ?? obj.image ?? undefined;
              // Otherwise, if it's an array of strings, use by index
              if (typeof raw.images[seq] === 'string') return raw.images[seq];
              // As a last attempt, if there's only one image and seq===0, use that
              if (raw.images.length === 1 && seq === 0 && typeof raw.images[0] === 'string') return raw.images[0];
            }
            // Fallback to explicit front/back fields
            return seq === 0 ? (raw.FrontImage ?? raw.frontImage ?? undefined) : (raw.BackImage ?? raw.backImage ?? undefined);
          };

          const candidateFront = getRawImageUrl(rawCard, 0) ?? c.frontImage;
          const candidateBack  = getRawImageUrl(rawCard, 1) ?? c.backImage;

          const hasSeq = (seq: number) => {
            if (!Array.isArray(rawCard.images)) return false;
            const hasObj = rawCard.images.some((it: any) => it && typeof it === 'object' && (it.seq === seq || it.seq === String(seq) || it.index === seq));
            const hasIndexString = typeof rawCard.images[seq] === 'string';
            return hasObj || hasIndexString;
          };

          // Save candidates for lazy loading later
          imageCandidatesRef.current = { front: candidateFront, back: candidateBack, raw: rawCard };

          const serverHasFront = hasSeq(0) || isServerUrl(candidateFront);
          const serverHasBack  = hasSeq(1) || isServerUrl(candidateBack);
          setServerImages({ front: serverHasFront, back: serverHasBack });

          // Do not fetch image data now — load lazily when user requests
          setCard({ ...c, frontImage: undefined, backImage: undefined });
        }
      } catch (e) {
        setDataError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [isAuthenticated, isEdit, cardId, apiFetch]);

  /* ── Lazy load images on demand ── */
  const loadImages = useCallback(async () => {
    const raw = imageCandidatesRef.current.raw;
    if (!raw) return undefined;
    const candidateFront = imageCandidatesRef.current.front;
    const candidateBack  = imageCandidatesRef.current.back;
    const imageUrl = (seq: number) => `${BACKEND_URL}/cards/${raw.Id ?? raw.id}/images/${seq}`;
    const hasSeqOnServer = (seq: number) => {
      if (!Array.isArray(raw.images)) return false;
      const hasObj = raw.images.some((it: any) => it && typeof it === 'object' && (it.seq === seq || it.seq === String(seq) || it.index === seq));
      const hasIndexString = typeof raw.images[seq] === 'string';
      return hasObj || hasIndexString;
    };

    const fetchCandidate = async (candidateUrl: string | undefined, seq: number) => {
      if (candidateUrl && candidateUrl.startsWith('data:')) return candidateUrl;
      // Try candidate URL if present
      if (candidateUrl) {
        const fetched = await fetchImageAsDataUrl(candidateUrl).catch(() => undefined);
        if (fetched) return fetched;
        // eslint-disable-next-line no-console
        console.debug('loadImages: failed to fetch candidate image', { candidateUrl, seq });
      }
      // Only attempt backend images endpoint if the GET /cards response included an image for this seq
      if (!hasSeqOnServer(seq)) {
        // eslint-disable-next-line no-console
        console.debug('loadImages: backend did not report image seq', { id: raw.Id ?? raw.id, seq });
        return undefined;
      }
      const backendFetched = await fetchImageAsDataUrl(imageUrl(seq)).catch(() => undefined);
      if (backendFetched) return backendFetched;
      // eslint-disable-next-line no-console
      console.debug('loadImages: failed to fetch backend image', { url: imageUrl(seq), seq });
      return undefined;
    };

    const [frontImage, backImage] = await Promise.all([
      fetchCandidate(candidateFront, 0),
      fetchCandidate(candidateBack, 1),
    ]);
    setCard(prev => prev ? { ...prev, frontImage, backImage } : prev);
    return { frontImage, backImage };
  }, [fetchImageAsDataUrl]);

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
      <div className="min-h-dvh bg-surface-bg collection-workspace flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-label={t.common.loading} />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') window.location.replace(localize('/collection/auth'));
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-label={t.common.loading} />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace flex items-center justify-center p-4">
        <div className="panel max-w-md w-full p-6 border-l-[3px] border-l-accent-danger text-center">
          <AlertCircle className="w-6 h-6 text-accent-danger mx-auto mb-3" aria-hidden="true" />
          <p className="text-accent-danger text-sm mb-4">{dataError}</p>
          <button type="button" onClick={() => router.push(localize('/collection/list'))} className="btn btn-secondary min-h-11 w-full">
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
      <div className="min-h-dvh bg-surface-bg collection-workspace flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-secondary animate-spin" aria-hidden="true" />
      </div>
    }>
      <CardFormInner {...props} />
    </Suspense>
  );
}
