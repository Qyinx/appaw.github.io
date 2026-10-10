import { SNKR_BUYBACK_IMAGE_EXT } from './image-manifest';

/** Public URL for a dropped-in card photo, or null when that file is not in the manifest. */
export function snkrBuybackImageSrc(cardId: string): string | null {
  const ext = SNKR_BUYBACK_IMAGE_EXT[cardId];
  if (!ext) return null;
  return `/images/snkr-buyback/${cardId}.${ext}`;
}
