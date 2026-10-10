'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import GuideCta from '@/components/guides/GuideCta';
import SnkrBuybackChart from '@/components/guides/SnkrBuybackChart';
import { getGuideContent } from '@/lib/guides/registry';
import {
  formatBuybackPrice,
  snkrCardName,
  snkrGradeLabel,
  snkrPriceSourceLabel,
} from '@/lib/snkr-buyback/data';
import { getSnkrCard } from '@/lib/snkr-buyback/cards';
import type { GuideLocale } from '@/lib/guides/types';

const UI = {
  en: {
    back: 'Back to reference',
    pageTitle: 'Same name, same grade',
    badge: 'Market reference',
    chartTitle: 'Buyback prices over time',
    chartLabel: (low: string, high: string, count: number) =>
      `Line chart of posted buyback prices. Low ${low}, high ${high}, ${count} posted prices. Not an Appaw Store purchase offer.`,
    range: (low: string, high: string, count: number) =>
      `Lowest ${low}. Highest ${high}. ${count} posted prices. Same-day posts stay separate.`,
    pricesTitle: 'Posted prices',
    columns: ['Date', 'PSA', 'Price', 'View post'],
    viewPost: 'View post',
    newTab: 'opens in a new tab',
    internalId: 'Internal id',
    internalHint: '(not a PSA cert number)',
    missing: 'This card is not in the approved reference table.',
  },
  zh: {
    back: '返回買取參考',
    pageTitle: '同名同級對照',
    badge: '市場參考',
    chartTitle: '買取價走勢',
    chartLabel: (low: string, high: string, count: number) =>
      `買取價折線圖。最低 ${low}，最高 ${high}，共 ${count} 則公布。並非 Appaw Store 的收卡報價。`,
    range: (low: string, high: string, count: number) =>
      `最低 ${low}。最高 ${high}。共 ${count} 則公布。同一日的多則公布分開列出。`,
    pricesTitle: '逐則公布',
    columns: ['日期', 'PSA', '價', '睇原帖'],
    viewPost: '睇原帖',
    newTab: '在新分頁開啟',
    internalId: '內部編號',
    internalHint: '（不是 PSA 證書編號）',
    missing: '已過閘的參考表沒有這張卡。',
  },
} as const;

type SnkrBuybackDetailProps = {
  cardId: string;
};

export default function SnkrBuybackDetail({ cardId }: SnkrBuybackDetailProps) {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];
  const guide = getGuideContent('psa-market-buyback-snkr', locale);
  const card = getSnkrCard(cardId);

  useSubHeader({
    contentWidth: 'guide',
    content: (
      <div className="flex min-w-0 items-center gap-3">
        <LocalLink
          href="/guides/psa-market-buyback-snkr/"
          className="inline-flex shrink-0 items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{ui.back}</span>
        </LocalLink>
        <p className="min-w-0 truncate text-sm font-semibold text-text-primary">{ui.pageTitle}</p>
      </div>
    ),
  });

  if (!card) {
    return (
      <article className="bg-surface-bg">
        <div className="container-custom max-w-[1080px] py-16">
          <p className="text-base text-text-secondary">{ui.missing}</p>
        </div>
      </article>
    );
  }

  const name = snkrCardName(
    {
      ...card.rows[0],
      card_name: card.cardName,
      card_name_en: card.cardNameEn,
    },
    locale,
  );
  const number = card.cardNumber.trim();
  const prices = card.rows.map((row) => row.buyback_price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const currency = card.rows[0]?.currency ?? 'JPY';
  const lowLabel = formatBuybackPrice(low, currency);
  const highLabel = formatBuybackPrice(high, currency);

  return (
    <article className="flex flex-col bg-surface-bg">
      <header className="border-b border-border-default pt-20 pb-10">
        <div className="container-custom max-w-[1080px]">
          <p className="section-label mb-6">{ui.badge}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4 text-balance">
            {ui.pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-text-primary leading-snug mb-6">
            {name || '—'}
            {number ? <span className="text-text-secondary"> · {number}</span> : null}
          </p>
          <p className="guide-lead text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl">{guide.lead}</p>
        </div>
      </header>

      {guide.notice ? (
        <div className="border-b border-border-default bg-surface-raised">
          <p className="container-custom max-w-[1080px] py-4 text-sm leading-relaxed text-text-secondary">
            {guide.notice}
          </p>
        </div>
      ) : null}

      <div className="section-padding">
        <div className="container-custom max-w-[1080px] space-y-12">
          <section aria-labelledby="snkr-chart-heading">
            <h2 id="snkr-chart-heading" className="text-2xl font-bold font-display text-text-primary mb-3">
              {ui.chartTitle}
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary mb-4">
              {ui.range(lowLabel, highLabel, card.rows.length)}
            </p>
            <p className="text-sm text-text-secondary mb-4">
              PSA {snkrGradeLabel(card.psaGrade)}
            </p>
            <div className="panel p-4">
              <SnkrBuybackChart rows={card.rows} label={ui.chartLabel(lowLabel, highLabel, card.rows.length)} />
            </div>
          </section>

          <section aria-labelledby="snkr-prices-heading">
            <h2 id="snkr-prices-heading" className="text-2xl font-bold font-display text-text-primary mb-4">
              {ui.pricesTitle}
            </h2>
            <div className="panel max-h-[min(70dvh,42rem)] overflow-auto" role="region" tabIndex={0}>
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border-default">
                    {ui.columns.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="sticky top-0 z-10 bg-surface-panel px-3 py-3 text-left text-sm font-medium text-text-muted"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {card.rows.map((row, index) => {
                    const sourceLabel = snkrPriceSourceLabel(row.price_source, locale);
                    const note = row.notes.trim();
                    return (
                      <React.Fragment key={`${row.date}-${row.source_post_url}-${index}`}>
                        <tr className="align-top">
                          <td className="whitespace-nowrap px-3 pt-3 text-text-secondary">{row.date}</td>
                          <td className="whitespace-nowrap px-3 pt-3 text-text-secondary">
                            {snkrGradeLabel(row.psa_grade)}
                          </td>
                          <td className="whitespace-nowrap px-3 pt-3 font-mono font-tabular text-text-primary">
                            {formatBuybackPrice(row.buyback_price, row.currency)}
                          </td>
                          <td className="whitespace-nowrap px-3 pt-3">
                            <a
                              href={row.source_post_url}
                              className="inline-flex min-h-11 items-center text-sm font-medium text-text-primary underline underline-offset-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {ui.viewPost}
                              <span className="sr-only"> ({ui.newTab})</span>
                            </a>
                          </td>
                        </tr>
                        <tr className="border-b border-border-default">
                          <td colSpan={4} className="px-3 pb-3 text-sm leading-relaxed text-text-muted">
                            {sourceLabel}
                            {note ? ` · ${note}` : ''}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-sm leading-relaxed text-text-muted">
            <span className="font-medium text-text-secondary">{ui.internalId}</span>{' '}
            <span className="font-mono">{card.cardId}</span> {ui.internalHint}
          </p>

          <GuideCta cta={guide.cta} />
        </div>
      </div>
    </article>
  );
}
