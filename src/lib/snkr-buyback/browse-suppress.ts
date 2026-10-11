/**
 * Same-post bare-name collapses pending image/OCR card_number splits.
 * Hidden from public browse + detail until gated; still visible on admin map.
 * Product lock 2026-10-11: follow ブラッキー pattern.
 * Gengar / GengarEX / Nymphia / Kabigon splits imported 2026-10-11 — removed from suppress.
 */
export const SNKR_BUYBACK_BROWSE_SUPPRESSED_IDS = new Set<string>([
  '52a2c07ab551', // コミパラ ルフィ — One Piece; product-flagged, hide until decide/split
]);

export function isSnkrBuybackBrowseSuppressed(cardId: string): boolean {
  return SNKR_BUYBACK_BROWSE_SUPPRESSED_IDS.has(cardId);
}
