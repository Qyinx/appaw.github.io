import type { GradingCompany, TradingCard } from '@/types/trading-card';
import { joinBackendUrl } from '@/lib/collection/backendUrl';
import {
  getCardImageUrlFromRaw,
  resolveStoredCardImageUrls,
} from '@/app/collection/lib/cardImages';
import {
  buildPublicCardsSearchParams,
  emptyMarketplaceQuery,
  type MarketplaceQuery,
} from '@/lib/marketplace/query';
import { CARD_TRADING_PLACEHOLDER_ID } from '@/lib/marketplace-card-trading-static';

const COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'CGC', 'TAG'];

export interface PublicMarketplaceList {
  cards: TradingCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function parseGradingCompany(raw: unknown): GradingCompany {
  const s = String(raw ?? '').toUpperCase();
  if (COMPANIES.includes(s as GradingCompany)) return s as GradingCompany;
  return 'PSA';
}

function unwrapPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    return obj.data as Record<string, unknown>;
  }
  return obj;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function cardImages(raw: Record<string, unknown>, cardId: string): string[] {
  const { frontImage, backImage } = resolveStoredCardImageUrls(cardId, raw, {
    frontImage: getCardImageUrlFromRaw(raw, 0),
    backImage: getCardImageUrlFromRaw(raw, 1),
  });
  return [frontImage, backImage].filter((url): url is string => !!url);
}

export function mapPublicCardToTradingCard(raw: unknown): TradingCard | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = String(row.Id ?? row.id ?? '').trim();
  if (!id) return null;

  const images = cardImages(row, id);
  const listPrice = toNumber(row.ListPrice ?? row.listPrice, 0);
  const soldRaw = row.Sold ?? row.sold;
  const sold = soldRaw === 1 || soldRaw === true || soldRaw === '1';
  const black = row.IsBlackLabel ?? row.isBlackLabel;

  return {
    id,
    name: String(row.Name ?? row.name ?? ''),
    year: toNumber(row.Year ?? row.year, 0),
    company: parseGradingCompany(row.Company ?? row.company),
    grade: toNumber(row.Grade ?? row.grade, 0),
    isBlackLabel: black === 1 || black === true || black === '1',
    image: images[0],
    imageBack: images[1],
    set: row.Set != null || row.set != null ? String(row.Set ?? row.set) : undefined,
    number: row.Number != null || row.number != null ? String(row.Number ?? row.number) : undefined,
    certNumber:
      row.CertNumber != null || row.certNumber != null
        ? String(row.CertNumber ?? row.certNumber)
        : undefined,
    price: listPrice,
    currency: String(row.ListCurrency ?? row.listCurrency ?? 'HKD'),
    language:
      row.Language != null || row.language != null
        ? String(row.Language ?? row.language)
        : undefined,
    sold,
    createdAt: row.CreatedAt != null || row.createdAt != null
      ? String(row.CreatedAt ?? row.createdAt)
      : undefined,
    updatedAt: row.UpdatedAt != null || row.updatedAt != null
      ? String(row.UpdatedAt ?? row.updatedAt)
      : undefined,
  };
}

export async function fetchPublicMarketplaceCards(
  query: MarketplaceQuery = emptyMarketplaceQuery(),
): Promise<PublicMarketplaceList> {
  const params = buildPublicCardsSearchParams(query);
  const res = await fetch(`${joinBackendUrl('/cards/public')}?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Marketplace API error: ${res.status}`);
  const raw = await res.json();
  const payload = unwrapPayload(raw);
  const rows = Array.isArray(payload.cards) ? payload.cards : [];
  return {
    cards: rows.map(mapPublicCardToTradingCard).filter((c): c is TradingCard => c != null),
    total: toNumber(payload.total, 0),
    page: toNumber(payload.page, query.page),
    limit: toNumber(payload.limit, query.limit),
    totalPages: Math.max(toNumber(payload.totalPages, 1), 1),
  };
}

export async function fetchPublicMarketplaceCardIds(): Promise<string[]> {
  try {
    const res = await fetch(joinBackendUrl('/cards/public/ids'), { cache: 'no-store' });
    if (!res.ok) return [];
    const raw = await res.json();
    const payload = unwrapPayload(raw);
    const ids: unknown[] = Array.isArray(payload.ids) ? payload.ids : [];
    return ids.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchPublicMarketplaceCard(id: string): Promise<TradingCard | null> {
  if (!id || id === CARD_TRADING_PLACEHOLDER_ID) return null;
  try {
    const res = await fetch(joinBackendUrl(`/cards/public/${encodeURIComponent(id)}`), {
      cache: 'no-store',
    });
    if (res.status === 404 || res.status === 403) return null;
    if (!res.ok) return null;
    const raw = await res.json();
    const payload = unwrapPayload(raw);
    return mapPublicCardToTradingCard(payload);
  } catch {
    return null;
  }
}

/** First page of in-stock listings for SSG ItemList JSON-LD. */
export async function fetchPublicMarketplaceCardsForBuild(): Promise<TradingCard[]> {
  try {
    const result = await fetchPublicMarketplaceCards({
      ...emptyMarketplaceQuery(),
      limit: 24,
      page: 1,
    });
    return result.cards;
  } catch {
    return [];
  }
}
