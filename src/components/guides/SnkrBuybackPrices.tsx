'use client';

import React, { useMemo, useState } from 'react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import {
  SNKR_BUYBACK_PRICES,
  formatBuybackPrice,
  snkrBuybackDates,
  snkrCardName,
  snkrGradeLabel,
  snkrPriceSourceLabel,
} from '@/lib/snkr-buyback/data';
import type { GuideLocale } from '@/lib/guides/types';

const DATES = snkrBuybackDates(SNKR_BUYBACK_PRICES);

const UI = {
  en: {
    date: 'Date',
    allDates: 'All dates',
    search: 'Search',
    searchPlaceholder: 'Card name or number',
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    empty: 'No rows match this filter.',
    legend:
      'Text is a price taken from the post text. Image is a price taken from a picture. The note under each row is the extraction remark, not an Appaw Store quote. The card name opens a same-name, same-grade comparison.',
    columns: ['Date', 'Card', 'PSA', 'Price', 'View post'],
    compare: 'same name, same grade',
    viewPost: 'View post',
    newTab: 'opens in a new tab',
    tableLabel: 'SNKRDUNK Akihabara buyback reference prices',
  },
  zh: {
    date: '日期',
    allDates: '全部日期',
    search: '搜尋',
    searchPlaceholder: '卡名或卡號',
    showing: (shown: number, total: number) => `顯示 ${shown} / ${total} 列`,
    empty: '沒有符合條件的列。',
    legend: '文字價來自帖文文字，圖價來自圖片。每列下方的附註是摘錄備註，不是 Appaw Store 的報價。卡名會開啟同名同級對照。',
    columns: ['日期', '卡名', 'PSA', '價', '睇原帖'],
    compare: '同名同級對照',
    viewPost: '睇原帖',
    newTab: '在新分頁開啟',
    tableLabel: 'SNKRDUNK 秋葉原買取參考價',
  },
} as const;

const controlClassName =
  'min-h-11 w-full border border-border-default bg-surface-raised px-3 text-sm text-text-primary focus-visible:border-accent-secondary focus-visible:outline-none';

export default function SnkrBuybackPrices() {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];
  const [date, setDate] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SNKR_BUYBACK_PRICES.filter((row) => {
      if (date !== 'all' && row.date !== date) return false;
      if (!needle) return true;
      const haystack = [row.card_name, row.card_name_en, row.card_number, row.psa_grade]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [date, query]);

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm leading-relaxed text-text-secondary">{ui.legend}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-text-secondary">
          <span className="mb-1 block font-medium text-text-primary">{ui.date}</span>
          <select
            className={controlClassName}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          >
            <option value="all">{ui.allDates}</option>
            {DATES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-text-secondary">
          <span className="mb-1 block font-medium text-text-primary">{ui.search}</span>
          <input
            type="search"
            className={controlClassName}
            value={query}
            placeholder={ui.searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className="text-sm text-text-muted" aria-live="polite">
        {ui.showing(filtered.length, SNKR_BUYBACK_PRICES.length)}
      </p>
      <div
        className="panel max-h-[min(70dvh,42rem)] overflow-auto"
        role="region"
        tabIndex={0}
        aria-label={ui.tableLabel}
      >
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <caption className="sr-only">{ui.tableLabel}</caption>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-sm text-text-secondary">
                  {ui.empty}
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => {
                const name = snkrCardName(row, locale);
                const number = row.card_number.trim();
                const sourceLabel = snkrPriceSourceLabel(row.price_source, locale);
                const note = row.notes.trim();
                return (
                  <React.Fragment key={`${row.date}-${row.card_id}-${row.source_post_url}-${index}`}>
                    <tr className="align-top">
                      <td className="whitespace-nowrap px-3 pt-3 text-text-secondary">{row.date}</td>
                      <td className="px-3 pt-3 text-text-primary">
                        <LocalLink
                          href={`/guides/psa-market-buyback-snkr/c/${row.card_id}/`}
                          prefetch={false}
                          className="inline-flex min-h-11 items-center font-medium underline underline-offset-2"
                        >
                          {name || '—'}
                          <span className="sr-only">, {ui.compare}</span>
                        </LocalLink>
                        {number ? <span className="mt-1 block text-text-muted">{number}</span> : null}
                      </td>
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
                      <td colSpan={5} className="px-3 pb-3 text-sm leading-relaxed text-text-muted">
                        {sourceLabel}
                        {note ? ` · ${note}` : ''}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
