import type { Metadata } from 'next';
import { withLocaleAlternates, zhRouteMetadata } from '@/lib/seo/locale-metadata';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import type { GuideLocale } from '@/lib/guides/types';
import { snkrCardName } from './data';
import { getSnkrCard, type SnkrCardSeries } from './cards';

const INDEX_PATH = '/guides/psa-market-buyback-snkr/';

export function snkrCardPath(cardId: string): string {
  return `${INDEX_PATH}c/${cardId}/`;
}

function displayName(card: SnkrCardSeries, locale: GuideLocale): string {
  return snkrCardName(
    {
      date: '',
      card_id: card.cardId,
      card_name: card.cardName,
      card_name_en: card.cardNameEn,
      card_number: card.cardNumber,
      psa_grade: card.psaGrade,
      buyback_price: 0,
      currency: '',
      price_source: '',
      source_post_url: '',
      image_url: '',
      notes: '',
    },
    locale,
  );
}

function pageTitle(card: SnkrCardSeries, locale: GuideLocale): string {
  return displayName(card, locale) || (locale === 'zh' ? '未命名卡' : 'Untitled card');
}

function pageDescription(card: SnkrCardSeries, locale: GuideLocale): string {
  const name = displayName(card, locale);
  const number = card.cardNumber ? ` ${card.cardNumber}` : '';
  if (locale === 'zh') {
    return `${name}${number} 的 SNKRDUNK 秋葉原買取價，同名同級，僅供市場參考，並非 Appaw Store 或 138 Arena 的收卡價格。`;
  }
  return `${name}${number} SNKRDUNK Akihabara buyback prices, same name and grade, for market reference only. Not an Appaw Store or 138 Arena purchase offer.`;
}

export function snkrCardMetadata(cardId: string, locale: GuideLocale): Metadata {
  const card = getSnkrCard(cardId);
  const robots = { index: false, follow: false } as const;
  if (!card) {
    return {
      title: { absolute: 'Not found | Appaw Store' },
      robots,
    };
  }

  const path = snkrCardPath(cardId);
  const title = pageTitle(card, locale);
  const description = pageDescription(card, locale);
  const base: Metadata = {
    title: { absolute: `${title} | Appaw Store` },
    description,
    robots,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `https://appaw.store${path}`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };

  if (locale === 'zh') {
    return zhRouteMetadata(base, path, {
      title: { absolute: `${title} | Appaw Store` },
      description,
    });
  }
  return withLocaleAlternates(base, path);
}

export function snkrCardStructuredData(cardId: string, locale: GuideLocale): Record<string, unknown>[] {
  const card = getSnkrCard(cardId);
  if (!card) return [];
  const isZh = locale === 'zh';
  const path = snkrCardPath(cardId);
  const pageUrl = `https://appaw.store${isZh ? `/zh${path}` : path}`;
  const indexUrl = `https://appaw.store${isZh ? `/zh${INDEX_PATH}` : INDEX_PATH}`;
  const name = displayName(card, locale);
  const title = pageTitle(card, locale);
  const description = pageDescription(card, locale);

  return [
    webPageJsonLd({
      name: title,
      description,
      url: pageUrl,
      inLanguage: isZh ? 'zh-HK' : 'en',
      isPartOf: { '@type': 'WebSite', name: 'Appaw Store', url: 'https://appaw.store' },
    }),
    breadcrumbJsonLd([
      {
        position: 1,
        name: isZh ? '首頁' : 'Home',
        item: isZh ? 'https://appaw.store/zh/' : 'https://appaw.store/',
      },
      {
        position: 2,
        name: isZh ? '指南' : 'Guides',
        item: isZh ? 'https://appaw.store/zh/guides/' : 'https://appaw.store/guides/',
      },
      {
        position: 3,
        name: isZh ? 'SNKRDUNK 秋葉原買取參考價' : 'SNKRDUNK Akihabara Buyback Reference Prices',
        item: indexUrl,
      },
      { position: 4, name, item: pageUrl },
    ]),
  ];
}
