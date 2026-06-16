import { localizedHref } from '@/lib/i18n-routing';
import type { Language } from '@/context/LanguageContext';

const WA_BASE = 'https://wa.me';

export function buildPublicPortfolioUrl(
  portfolioId: string,
  language: Language,
  origin = typeof window !== 'undefined' ? window.location.origin : 'https://appaw.store',
): string {
  return `${origin}${localizedHref(`/collection/p/${portfolioId}`, language)}`;
}

export function buildFacebookShareUrl(pageUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
}

export function buildWhatsAppShareUrl(message: string, phone?: string): string {
  if (phone) {
    return `${WA_BASE}/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildPortfolioShareMessage(opts: {
  portfolioName: string;
  activeCount: number;
  url: string;
  ownerName?: string;
}): string {
  const { portfolioName, activeCount, url, ownerName } = opts;
  const who = ownerName ? ` — ${ownerName}` : '';
  return `${portfolioName}${who}\n${activeCount} slab${activeCount === 1 ? '' : 's'} available\n${url}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareViaWebApi(payload: { title: string; text: string; url: string }): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    await navigator.share(payload);
    return true;
  } catch {
    return false;
  }
}
