'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { latestSnkrRow, listSnkrCards, type SnkrCardSeries } from '@/lib/snkr-buyback/cards';
import { formatBuybackPrice, SNKR_BUYBACK_PRICES, snkrBuybackDates, snkrCardName, snkrGradeLabel } from '@/lib/snkr-buyback/data';
import { snkrBuybackImageSrc } from '@/lib/snkr-buyback/images';
import type { GuideLocale } from '@/lib/guides/types';

const CARDS = listSnkrCards();
const DATES = snkrBuybackDates(SNKR_BUYBACK_PRICES);

const UI = {
  en: {
    search: 'Search',
    searchPlaceholder: 'Card name or number',
    date: 'Date',
    allDates: 'All dates',
    grade: 'PSA',
    allGrades: 'All grades',
    ungraded: 'No grade',
    showing: (shown: number, total: number) => `Showing ${shown} of ${total} cards`,
    empty: 'No cards match this filter.',
    noPhoto: 'No photo',
    latest: 'Latest',
    open: 'Same name, same grade',
  },
  zh: {
    search: '搜尋',
    searchPlaceholder: '卡名或卡號',
    date: '日期',
    allDates: '全部日期',
    grade: 'PSA',
    allGrades: '全部等級',
    ungraded: '未標示等級',
    showing: (shown: number, total: number) => `顯示 ${shown} / ${total} 張`,
    empty: '沒有符合條件的卡。',
    noPhoto: '未有圖片',
    latest: '最近公布',
    open: '同名同級對照',
  },
} as const;

const controlClassName =
  'min-h-11 w-full border border-border-default bg-surface-raised px-3 text-sm text-text-primary focus-visible:border-accent-secondary focus-visible:outline-none';

function cardLabel(card: SnkrCardSeries, locale: GuideLocale): string {
  return snkrCardName(
    {
      ...card.rows[0],
      card_name: card.cardName,
      card_name_en: card.cardNameEn,
      card_number: card.cardNumber,
      psa_grade: card.psaGrade,
    },
    locale,
  );
}

function SnkrTileImage({ src, name, emptyLabel }: { src: string | null; name: string; emptyLabel: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised" aria-hidden="true">
        <div className="h-[46%] w-[42%] border-2 border-border-strong bg-surface-panel" />
        <span className="text-sm text-text-muted">{emptyLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes="(max-width: 768px) 46vw, 240px"
      className="object-contain p-3"
    />
  );
}

export default function SnkrBuybackGallery() {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('all');
  const [grade, setGrade] = useState('all');

  const grades = useMemo(() => {
    const values = new Set(CARDS.map((card) => card.psaGrade));
    return [...values].sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b);
    });
  }, []);

  const tiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = CARDS.flatMap((card) => {
      if (grade !== 'all' && card.psaGrade !== grade) return [];
      const row = latestSnkrRow(card, date);
      if (!row) return [];
      if (needle) {
        const haystack = [card.cardName, card.cardNameEn, card.cardNumber].join(' ').toLowerCase();
        if (!haystack.includes(needle)) return [];
      }
      return [{ card, row }];
    });
    matched.sort((a, b) => b.row.buyback_price - a.row.buyback_price || cardLabel(a.card, locale).localeCompare(cardLabel(b.card, locale)));
    return matched;
  }, [query, date, grade, locale]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
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
        <label className="block text-sm text-text-secondary">
          <span className="mb-1 block font-medium text-text-primary">{ui.date}</span>
          <select className={controlClassName} value={date} onChange={(event) => setDate(event.target.value)}>
            <option value="all">{ui.allDates}</option>
            {DATES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="collection-filter-pills collection-filter-pills--scroll w-fit max-w-full overflow-x-auto" role="group" aria-label={ui.grade}>
        <button type="button" className="collection-filter-pill" aria-pressed={grade === 'all'} onClick={() => setGrade('all')}>
          {ui.allGrades}
        </button>
        {grades.map((value) => (
          <button
            key={value || 'none'}
            type="button"
            className="collection-filter-pill"
            aria-pressed={grade === value}
            onClick={() => setGrade(value)}
          >
            {value ? value : ui.ungraded}
          </button>
        ))}
      </div>

      <p className="text-sm text-text-muted" aria-live="polite">
        {ui.showing(tiles.length, CARDS.length)}
      </p>

      {tiles.length === 0 ? (
        <div className="panel px-5 py-8 text-center">
          <p className="text-sm text-text-secondary">{ui.empty}</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {tiles.map(({ card, row }) => {
            const name = cardLabel(card, locale);
            const gradeLabel = snkrGradeLabel(card.psaGrade);
            const price = formatBuybackPrice(row.buyback_price, row.currency);
            const src = snkrBuybackImageSrc(card.cardId);
            const number = card.cardNumber.trim();
            return (
              <li key={card.cardId} className="min-w-0">
                <LocalLink
                  href={`/guides/psa-market-buyback-snkr/c/${card.cardId}/`}
                  prefetch={false}
                  className="group panel flex h-full flex-col overflow-hidden transition-[border-color,background-color] duration-150 hover:border-accent-brand/45 hover:bg-surface-raised"
                  aria-label={`${name || '—'}, PSA ${gradeLabel}, ${price}, ${ui.open}`}
                >
                  <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-surface-raised">
                    <SnkrTileImage src={src} name={name || ui.noPhoto} emptyLabel={ui.noPhoto} />
                    <div className="absolute top-2.5 right-2.5 z-[1] flex items-stretch overflow-hidden border border-border-strong bg-surface-panel">
                      <div className="flex h-7 items-center bg-accent-structural px-2 font-mono text-sm font-bold leading-none text-surface-bg">
                        PSA
                      </div>
                      <div className="flex h-7 min-w-11 items-center border-l border-border-strong bg-surface-raised px-2 font-mono text-sm font-bold leading-none text-text-primary">
                        {gradeLabel}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-3.5 pt-2.5 pb-3">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary text-pretty group-hover:text-accent-brand">
                      {name || '—'}
                    </h3>
                    {number ? <p className="mt-1 text-sm text-text-muted">{number}</p> : null}
                    <div className="mt-auto border-t border-border-default pt-2">
                      <p className="font-mono text-sm font-tabular font-semibold text-text-primary">
                        {price}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        {ui.latest} {row.date}
                      </p>
                    </div>
                  </div>
                </LocalLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
