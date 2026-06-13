import type { PreferredCurrencyPrices } from '@/app/collection/types';
import type { Currency } from '@/app/collection/types';

export const SUPPORTED_CURRENCIES: Currency[] = ['HKD', 'USD', 'JPY', 'TWD', 'SGD'];

/** User PreferredCurrency → supported code (default USD). */
export function normalizePreferredCurrency(raw: unknown): Currency {
  const code = String(raw ?? 'USD').toUpperCase();
  return SUPPORTED_CURRENCIES.includes(code as Currency) ? (code as Currency) : 'USD';
}

/** Sum server-converted buy prices from per-card `InPreferredCurrency`. */
export function sumBuyPriceInPreferred(
  cards: ReadonlyArray<{ buyPrice: number; inPreferredCurrency?: PreferredCurrencyPrices }>,
): { total: number | null; partial: boolean } {
  let total = 0;
  let any = false;
  let partial = false;

  for (const card of cards) {
    const converted = card.inPreferredCurrency?.buyPrice;
    if (converted != null) {
      total += converted;
      any = true;
    } else if (card.buyPrice) {
      partial = true;
    }
  }

  return {
    total: any ? Math.round(total * 100) / 100 : null,
    partial,
  };
}
