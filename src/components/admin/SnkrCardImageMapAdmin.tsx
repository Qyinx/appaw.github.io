'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import { listSnkrCards, latestSnkrRow, type SnkrCardSeries } from '@/lib/snkr-buyback/cards';
import { snkrCardName } from '@/lib/snkr-buyback/data';
import { snkrCardNature } from '@/lib/snkr-buyback/nature';
import { snkrBuybackImageSrc } from '@/lib/snkr-buyback/images';
import type { GuideLocale } from '@/lib/guides/types';
import type { SnkrBuybackPrice } from '@/lib/snkr-buyback/types';

const IS_LOCAL_UPLOAD = process.env.NODE_ENV !== 'production';

const UI = {
  en: {
    badge: 'Admin only',
    title: 'SNKR card images (Admin)',
    lead: 'Map card_id to the filename. Use Upload on local npm run dev, or drop {card_id}.webp into public/images/snkr-buyback/. Open Source to check the original SNKR post. Not linked from public nav.',
    missingFirst: 'Missing first',
    search: 'Search name / id / number / nature',
    cols: {
      image: 'Image',
      id: 'card_id',
      name: 'Name',
      number: 'Card #',
      nature: 'Nature',
      source: 'Source',
      path: 'Save as',
      upload: 'Upload',
    },
    missing: 'MISSING',
    present: 'OK',
    copied: 'Copied',
    copy: 'Copy id',
    openSource: 'View post',
    upload: 'Upload',
    uploading: 'Uploading…',
    uploadDone: 'Saved',
    uploadDisabled: 'Local npm run dev only',
    uploadHint:
      'Upload converts to webp and refreshes the image manifest. Production / static export has no upload API.',
  },
  zh: {
    badge: 'Admin 專用',
    title: 'SNKR 卡圖對照（Admin）',
    lead: '對照 card_id 同檔名。本地 npm run dev 可用 Upload；或手動存 public/images/snkr-buyback/{card_id}.webp。開「來源」睇 SNKR 原帖。唔入公開導航。',
    missingFirst: '缺圖優先',
    search: '搜卡名／id／編號／性質',
    cols: {
      image: '圖',
      id: 'card_id',
      name: '卡名',
      number: '編號',
      nature: '性質',
      source: '來源',
      path: '目標檔名',
      upload: '上傳',
    },
    missing: '缺圖',
    present: '有圖',
    copied: '已複製',
    copy: '複製 id',
    openSource: '睇原帖',
    upload: '上傳',
    uploading: '上傳中…',
    uploadDone: '已存',
    uploadDisabled: '只喺本地 npm run dev 可用',
    uploadHint: '上傳會轉成 webp 並刷新 image-manifest。Production／static export 冇上傳 API。',
  },
} as const;

type Row = {
  cardId: string;
  name: string;
  cardNumber: string;
  nature: string;
  days: number;
  imageSrc: string | null;
  savePath: string;
  sourceUrl: string | null;
};

function stubPrice(cardName: string, cardNameEn: string): SnkrBuybackPrice {
  return {
    date: '',
    card_id: '',
    card_name: cardName,
    card_name_en: cardNameEn,
    card_number: '',
    psa_grade: '',
    buyback_price: 0,
    currency: 'JPY',
    price_source: 'text',
    source_post_url: '',
    image_url: '',
    notes: '',
  };
}

function pickSourceUrl(card: SnkrCardSeries): string | null {
  const latest = latestSnkrRow(card, 'all');
  const latestUrl = latest?.source_post_url?.trim();
  if (latestUrl) return latestUrl;
  for (let i = card.rows.length - 1; i >= 0; i -= 1) {
    const url = card.rows[i]?.source_post_url?.trim();
    if (url) return url;
  }
  return null;
}

export default function SnkrCardImageMapAdmin() {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];
  const [missingFirst, setMissingFirst] = useState(true);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewOverride, setPreviewOverride] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useSubHeader({
    contentWidth: 'page',
    content: (
      <p className="min-w-0 truncate text-sm font-semibold text-text-primary">{ui.title}</p>
    ),
  });

  const rows: Row[] = useMemo(() => {
    return listSnkrCards().map((card) => {
      const latest = latestSnkrRow(card, 'all');
      const nameSource = latest ?? stubPrice(card.cardName, card.cardNameEn);
      const displayName = card.cardName || nameSource.card_name;
      const baseSrc = snkrBuybackImageSrc(card.cardId);
      return {
        cardId: card.cardId,
        name: snkrCardName(
          {
            ...nameSource,
            card_name: displayName,
            card_name_en: card.cardNameEn || nameSource.card_name_en,
          },
          locale,
        ),
        cardNumber: (card.cardNumber || '').trim(),
        nature: snkrCardNature(displayName, card.psaGrade),
        days: card.rows.length,
        imageSrc: previewOverride[card.cardId] ?? baseSrc,
        savePath: `public/images/snkr-buyback/${card.cardId}.webp`,
        sourceUrl: pickSourceUrl(card),
      };
    });
  }, [locale, previewOverride]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(
        (row) =>
          row.cardId.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q) ||
          row.cardNumber.toLowerCase().includes(q) ||
          row.nature.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      if (missingFirst) {
        const am = a.imageSrc ? 1 : 0;
        const bm = b.imageSrc ? 1 : 0;
        if (am !== bm) return am - bm;
      }
      return b.days - a.days;
    });
    return list;
  }, [rows, query, missingFirst]);

  const present = rows.filter((r) => r.imageSrc).length;
  const missing = rows.length - present;
  const withSource = rows.filter((r) => r.sourceUrl).length;
  const withoutSource = rows.length - withSource;
  const natureCounts = useMemo(() => {
    const counts = { PSA10: 0, RAW: 0, sealed: 0, other: 0 };
    for (const row of rows) {
      if (row.nature === 'PSA10') counts.PSA10 += 1;
      else if (row.nature === 'RAW') counts.RAW += 1;
      else if (row.nature === '未開封') counts.sealed += 1;
      else counts.other += 1;
    }
    return counts;
  }, [rows]);

  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    } catch {
      /* ignore */
    }
  }

  async function uploadForCard(cardId: string, file: File) {
    if (!IS_LOCAL_UPLOAD) return;
    setBusyId(cardId);
    setUploadStatus((s) => ({ ...s, [cardId]: ui.uploading }));
    try {
      const body = new FormData();
      body.set('cardId', cardId);
      body.set('file', file);
      const res = await fetch('/api/admin/snkr-buyback-image/', {
        method: 'POST',
        body,
      });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const bust = `${data.url}?t=${Date.now()}`;
      setPreviewOverride((prev) => ({ ...prev, [cardId]: bust }));
      setUploadStatus((s) => ({ ...s, [cardId]: ui.uploadDone }));
    } catch (e) {
      setUploadStatus((s) => ({ ...s, [cardId]: String(e) }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <article className="flex min-h-screen flex-col bg-surface-bg">
      <header className="border-b border-border-default pb-8 pt-20">
        <div className="container-custom max-w-none">
          <p className="section-label mb-4">{ui.badge}</p>
          <h1 className="mb-3 font-display text-3xl font-bold text-text-primary md:text-4xl">
            {ui.title}
          </h1>
          <p className="mb-4 max-w-3xl text-base leading-relaxed text-text-secondary">{ui.lead}</p>
          <p className="mb-2 text-sm text-text-secondary">{ui.uploadHint}</p>
          <p className="mb-2 text-sm text-text-secondary">
            {locale === 'zh'
              ? `有圖 ${present} · 缺圖 ${missing} · 共 ${rows.length} 張`
              : `${present} present · ${missing} missing · ${rows.length} cards`}
          </p>
          <p className="mb-2 text-sm text-text-secondary">
            {locale === 'zh'
              ? `有來源連結 ${withSource} · 無來源 ${withoutSource}`
              : `Source link ${withSource} · none ${withoutSource}`}
          </p>
          <p className="mb-6 text-sm text-text-secondary">
            {locale === 'zh'
              ? `性質：PSA10 ${natureCounts.PSA10} · RAW ${natureCounts.RAW} · 未開封 ${natureCounts.sealed}` +
                (natureCounts.other ? ` · 其他 ${natureCounts.other}` : '')
              : `Nature: PSA10 ${natureCounts.PSA10} · RAW ${natureCounts.RAW} · sealed ${natureCounts.sealed}` +
                (natureCounts.other ? ` · other ${natureCounts.other}` : '')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.search}
              className="min-h-11 flex-1 rounded-none border border-border-default bg-surface-raised px-3 text-sm text-text-primary"
            />
            <label className="inline-flex min-h-11 cursor-pointer select-none items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={missingFirst}
                onChange={(e) => setMissingFirst(e.target.checked)}
                className="h-4 w-4"
              />
              {ui.missingFirst}
            </label>
          </div>
        </div>
      </header>

      <div className="section-padding">
        <div className="container-custom max-w-none overflow-x-auto">
          <table className="w-full min-w-[1280px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-text-secondary">
                <th className="py-3 pr-3 font-semibold">{ui.cols.image}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.id}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.name}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.number}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.nature}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.source}</th>
                <th className="py-3 pr-3 font-semibold">{ui.cols.path}</th>
                <th className="sticky right-0 z-20 bg-surface-bg py-3 pl-3 font-semibold shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.18)]">{ui.cols.upload}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.cardId} className="align-top border-b border-border-default">
                  <td className="py-3 pr-3">
                    <div className="flex h-20 w-14 items-center justify-center overflow-hidden border border-border-default bg-surface-raised">
                      {row.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.imageSrc}
                          alt={row.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="px-1 text-center text-[11px] font-semibold text-red-600">
                          {ui.missing}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <code className="break-all font-mono text-xs text-text-primary">{row.cardId}</code>
                    <button
                      type="button"
                      onClick={() => copyId(row.cardId)}
                      className="mt-2 block min-h-9 border border-border-default px-2 text-xs hover:bg-surface-raised"
                    >
                      {copiedId === row.cardId ? ui.copied : ui.copy}
                    </button>
                  </td>
                  <td className="py-3 pr-3 text-text-primary">{row.name}</td>
                  <td className="whitespace-nowrap py-3 pr-3 font-mono text-xs text-text-primary">
                    {row.cardNumber || '—'}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-3 font-medium text-text-primary">
                    {row.nature}
                  </td>
                  <td className="py-3 pr-3">
                    {row.sourceUrl ? (
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        {ui.openSource}
                      </a>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <code className="break-all font-mono text-[11px] text-text-secondary">
                      {row.savePath}
                    </code>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      {row.imageSrc ? ui.present : ui.missing}
                    </p>
                  </td>
                  <td className="sticky right-0 z-10 bg-surface-bg py-3 pl-3 shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.15)]">
                    <input
                      ref={(el) => {
                        fileRefs.current[row.cardId] = el;
                      }}
                      type="file"
                      accept="image/webp,image/png,image/jpeg,image/jpg,.webp,.png,.jpg,.jpeg"
                      className="hidden"
                      disabled={!IS_LOCAL_UPLOAD || busyId === row.cardId}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) void uploadForCard(row.cardId, file);
                      }}
                    />
                    <button
                      type="button"
                      disabled={!IS_LOCAL_UPLOAD || busyId === row.cardId}
                      onClick={() => fileRefs.current[row.cardId]?.click()}
                      className="min-h-9 border border-border-default px-2 text-xs hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
                      title={IS_LOCAL_UPLOAD ? undefined : ui.uploadDisabled}
                    >
                      {busyId === row.cardId ? ui.uploading : ui.upload}
                    </button>
                    {!IS_LOCAL_UPLOAD ? (
                      <p className="mt-1 text-[11px] text-text-secondary">{ui.uploadDisabled}</p>
                    ) : uploadStatus[row.cardId] ? (
                      <p className="mt-1 text-[11px] text-text-secondary">{uploadStatus[row.cardId]}</p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
