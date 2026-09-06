import { fetchPublicMarketplaceCardIds } from '@/lib/marketplace/publicCards';

/** Placeholder slug so static export succeeds when the marketplace has no public cards yet. */
export const CARD_TRADING_PLACEHOLDER_ID = '_';

export async function cardTradingGenerateStaticParams(): Promise<{ id: string }[]> {
  const ids = await fetchPublicMarketplaceCardIds();
  if (!ids.length) return [{ id: CARD_TRADING_PLACEHOLDER_ID }];
  return ids.map((id) => ({ id }));
}
