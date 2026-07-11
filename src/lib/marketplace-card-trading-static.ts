import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';
import { MARKETPLACE_IN_PROGRESS } from '@/lib/marketplace-config';

/** Placeholder slug so static export succeeds while marketplace is in progress. */
export const CARD_TRADING_PLACEHOLDER_ID = '_';

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

export async function cardTradingGenerateStaticParams(): Promise<{ id: string }[]> {
  if (MARKETPLACE_IN_PROGRESS) return [{ id: CARD_TRADING_PLACEHOLDER_ID }];
  const cards = await getCards();
  return cards.map((card) => ({ id: card.id }));
}
