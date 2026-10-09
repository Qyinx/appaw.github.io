'use client';

import React, { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SNKR_BUYBACK_ANNOUNCEMENTS, snkrBuybackDates } from '@/lib/snkr-buyback/data';
import type { GuideLocale } from '@/lib/guides/types';

const UI = {
  en: {
    viewPost: 'View post',
    newTab: 'opens in a new tab',
    listLabel: 'Image boards and POP posts without listed prices',
  },
  zh: {
    viewPost: '睇原帖',
    newTab: '在新分頁開啟',
    listLabel: '未列出價格的圖板與 POP 原帖',
  },
} as const;

export default function SnkrBuybackAnnouncements() {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];

  const groups = useMemo(() => {
    return snkrBuybackDates(SNKR_BUYBACK_ANNOUNCEMENTS).map((date) => ({
      date,
      rows: SNKR_BUYBACK_ANNOUNCEMENTS.filter((row) => row.date === date),
    }));
  }, []);

  return (
    <div className="panel mt-6 overflow-x-auto" role="region" tabIndex={0} aria-label={ui.listLabel}>
      <ul className="divide-y divide-border-default">
        {groups.map((group) => (
          <li key={group.date} className="px-4 py-3">
            <p className="text-sm font-medium text-text-primary">{group.date}</p>
            <ul className="mt-1 flex flex-col">
              {group.rows.map((row, index) => (
                <li key={`${row.source_post_url}-${index}`}>
                  <a
                    href={row.source_post_url}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-text-primary underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ui.viewPost}
                    <span className="sr-only">
                      {' '}
                      {group.date} {index + 1} ({ui.newTab})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
