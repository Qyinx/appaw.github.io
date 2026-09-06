import { resolveAbsoluteBackendUrl } from '@/app/collection/lib/cardImages';
import { getImagePath } from '@/lib/utils';

const CARD_IMAGE_PATH = /\/cards\/[^/]+\/images\/\d+/;

/**
 * Resolves a marketplace image URL for Next/Image or CSS.
 * Returns null when missing — never "" (Next.js re-fetches the page if src="").
 */
export function marketplaceImageSrc(src: string | undefined | null): string | null {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed;
  if (CARD_IMAGE_PATH.test(trimmed) || trimmed.startsWith('/cards/')) {
    return resolveAbsoluteBackendUrl(trimmed);
  }
  return getImagePath(trimmed);
}

export function absoluteMarketplaceImageUrl(src: string | undefined | null): string | undefined {
  if (!src?.trim()) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `https://appaw.store${path}`;
}
