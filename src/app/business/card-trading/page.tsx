import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';
import CardTradingPage from './CardTradingClient';

/* ──────────────────────────────────────────
   Server Component — Card Trading Page
   ──────────────────────────────────────────
   Reads trading card data at BUILD time so
   the static-exported HTML contains real
   card names, prices and descriptions that
   search-engine crawlers can index.

   The data is forwarded to the interactive
   client component as `initialCards`.
   ────────────────────────────────────────── */

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

export default async function Page() {
  const cards = await getCards();

  return <CardTradingPage initialCards={cards} />;
}
