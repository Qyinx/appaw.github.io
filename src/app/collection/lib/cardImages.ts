import { BACKEND_URL } from '../types';

/** GET /cards/:id/images/:seq is public — no Bearer token (see backend API.md). */
const CARD_IMAGE_PATH = /\/cards\/[^/]+\/images\/\d+/;

export function resolveAbsoluteBackendUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const base = BACKEND_URL.replace(/\/$/, '');
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
}

export function canonicalCardImageUrl(cardId: string, seq: number): string {
  const base = BACKEND_URL.replace(/\/$/, '');
  return `${base}/cards/${cardId}/images/${seq}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCardImagesArray(raw: any): unknown[] {
  const arr = raw?.images ?? raw?.Images;
  return Array.isArray(arr) ? arr : [];
}

export function imageEntryToUrl(entry: unknown): string | undefined {
  if (typeof entry === 'string' && entry.trim()) return entry.trim();
  if (!entry || typeof entry !== 'object') return undefined;
  const o = entry as Record<string, unknown>;
  const candidate = o.url ?? o.Url ?? o.path ?? o.Path ?? o.image ?? o.Image ?? o.src ?? o.Src;
  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : undefined;
}

function imageEntrySeq(entry: unknown): number | undefined {
  if (!entry || typeof entry !== 'object') return undefined;
  const o = entry as Record<string, unknown>;
  const raw = o.seq ?? o.Seq ?? o.index ?? o.Index ?? o.sequence ?? o.Sequence;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '' && !Number.isNaN(Number(raw))) return Number(raw);
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCardImageUrlFromRaw(raw: any, seq: number): string | undefined {
  const images = getCardImagesArray(raw);
  if (images.length > 0) {
    const bySeq = images.find(it => imageEntrySeq(it) === seq);
    const fromSeq = imageEntryToUrl(bySeq);
    if (fromSeq) return fromSeq;

    if (images.length > seq) {
      const fromIndex = imageEntryToUrl(images[seq]);
      if (fromIndex) return fromIndex;
    }

    if (images.length === 1 && seq === 0) {
      const only = imageEntryToUrl(images[0]);
      if (only) return only;
    }
  }

  if (seq === 0) return imageEntryToUrl(raw.FrontImage ?? raw.frontImage);
  return imageEntryToUrl(raw.BackImage ?? raw.backImage);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cardReportsImage(raw: any, seq: number): boolean {
  const direct = getCardImageUrlFromRaw(raw, seq);
  if (direct && !direct.startsWith('data:')) return true;

  const images = getCardImagesArray(raw);
  if (images.length > seq && imageEntryToUrl(images[seq])) return true;

  const count = raw?.imageCount ?? raw?.ImageCount ?? raw?.imagesCount ?? raw?.ImagesCount;
  if (typeof count === 'number' && count > seq) return true;

  return false;
}

/** Normalize a stored image reference to a loadable public URL for the current backend origin. */
export function resolveStoredCardImageUrl(
  url: string | undefined,
  cardId: string,
  seq: number,
  hasImage = true,
): string | undefined {
  if (!url && !hasImage) return undefined;
  if (url?.startsWith('data:')) return url;
  if (url && CARD_IMAGE_PATH.test(url)) return canonicalCardImageUrl(cardId, seq);
  if (url) return resolveAbsoluteBackendUrl(url);
  if (hasImage && cardId) return canonicalCardImageUrl(cardId, seq);
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveStoredCardImageUrls(
  cardId: string,
  raw: any,
  normalized: { frontImage?: string; backImage?: string },
): { frontImage?: string; backImage?: string } {
  const frontHas = cardReportsImage(raw, 0) || !!normalized.frontImage;
  const backHas = cardReportsImage(raw, 1) || !!normalized.backImage;
  return {
    frontImage: resolveStoredCardImageUrl(
      normalized.frontImage ?? getCardImageUrlFromRaw(raw, 0),
      cardId,
      0,
      frontHas,
    ),
    backImage: resolveStoredCardImageUrl(
      normalized.backImage ?? getCardImageUrlFromRaw(raw, 1),
      cardId,
      1,
      backHas,
    ),
  };
}
