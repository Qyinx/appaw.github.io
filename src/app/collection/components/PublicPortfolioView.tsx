'use client';

import React, { useMemo, useState } from 'react';
import { Globe, MessageCircle, Package, RotateCcw } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import HeroStamp from '@/components/ui/HeroStamp';
import { useLanguage } from '@/context/LanguageContext';
import type { PublicCard, PublicPortfolio } from '@/lib/collection/publicPortfolio';
import { buildWhatsAppShareUrl } from '@/lib/collection/portfolioShare';
import { GradePill } from './shared';
import { CollectionAnimeEnter } from './CollectionAnimeEnter';
import { CollectionWorkspaceChrome } from './CollectionWorkspaceChrome';
import { CollectionAnimeStagger } from './CollectionAnimeStagger';

interface PublicPortfolioViewProps {
  portfolio: PublicPortfolio;
}

type SoldFilter = 'all' | 'active' | 'sold';
type SortKey = 'listPrice' | 'grade' | 'name';

function SoldBadge({ sold }: { sold: boolean }) {
  const { t } = useLanguage();
  return (
    <span
      className={`font-mono text-xs font-bold px-2 py-1 border uppercase tracking-wider ${
        sold
          ? 'bg-accent-danger/10 border-accent-danger/30 text-accent-danger'
          : 'bg-accent-success/10 border-accent-success/25 text-accent-success'
      }`}
    >
      {sold ? t.collection.publicPage.sold : t.collection.publicPage.active}
    </span>
  );
}

function PublicCardImage({ card }: { card: PublicCard }) {
  const { t } = useLanguage();
  const [showBack, setShowBack] = useState(false);
  const src = showBack && card.backImage ? card.backImage : card.frontImage;

  if (!src) {
    return (
      <div className="aspect-[3/4] w-full border border-border-default bg-surface-raised flex items-center justify-center">
        <Package className="w-8 h-8 text-text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full border border-border-default bg-surface-raised overflow-hidden group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
      {card.backImage && card.frontImage && card.backImage !== card.frontImage && (
        <button
          type="button"
          onClick={() => setShowBack(v => !v)}
          className="collection-action-pill absolute bottom-2 right-2 min-h-0 min-w-0 p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          title={showBack ? t.collection.wts.showFront : t.collection.wts.showBack}
          aria-label={showBack ? t.collection.wts.showFront : t.collection.wts.showBack}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function formatListPrice(card: PublicCard, preferredCurrency?: string) {
  if (card.listPrice == null) return null;
  if (card.inPreferredCurrency?.listPrice != null && preferredCurrency) {
    return `${preferredCurrency} ${card.inPreferredCurrency.listPrice.toLocaleString()}`;
  }
  return `${card.listCurrency ?? 'HKD'} ${card.listPrice.toLocaleString()}`;
}

export function PublicPortfolioView({ portfolio }: PublicPortfolioViewProps) {
  const { t } = useLanguage();
  const isPublic = portfolio.isPublic !== false;

  const [soldFilter, setSoldFilter] = useState<SoldFilter>(isPublic ? 'active' : 'all');
  const [sortKey, setSortKey] = useState<SortKey>(isPublic ? 'listPrice' : 'name');
  const [sortAsc, setSortAsc] = useState(isPublic);

  const activeCount = portfolio.cards.filter(c => !c.sold).length;
  const soldCount = portfolio.cards.filter(c => c.sold).length;

  const displayedCards = useMemo(() => {
    let list = portfolio.cards.filter(c => {
      if (soldFilter === 'active') return !c.sold;
      if (soldFilter === 'sold') return c.sold;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'listPrice') {
        cmp = (a.listPrice ?? 0) - (b.listPrice ?? 0);
      } else if (sortKey === 'grade') {
        cmp = a.grade - b.grade;
      } else {
        cmp = a.name.localeCompare(b.name);
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [portfolio.cards, soldFilter, sortKey, sortAsc]);

  const statRows = isPublic
    ? [
        { label: t.collection.wts.statsAvailable, value: String(activeCount), tone: 'text-accent-success' },
        { label: t.collection.publicPage.statsSold, value: String(soldCount), tone: 'text-accent-danger' },
        { label: t.collection.publicPage.statsTotal, value: String(portfolio.cards.length), tone: 'text-text-primary' },
      ]
    : [
        { label: t.collection.publicPage.statsTotal, value: String(portfolio.cards.length), tone: 'text-text-primary' },
        { label: t.collection.publicPage.statsActive, value: String(activeCount), tone: 'text-accent-success' },
        { label: t.collection.publicPage.statsSold, value: String(soldCount), tone: 'text-accent-danger' },
      ];

  const contactWa = portfolio.contact?.whatsapp;
  const contactMessage = t.collection.wts.contactMessage
    .replace('{portfolio}', portfolio.name)
    .replace('{owner}', portfolio.ownerDisplayName ?? '');

  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip">
      <CollectionWorkspaceChrome
        leading={(
          <>
            <Globe className="w-3.5 h-3.5 text-accent-secondary flex-shrink-0" aria-hidden="true" />
            <h1 className="text-text-primary font-semibold text-xs sm:text-sm truncate">{portfolio.name}</h1>
          </>
        )}
        trailing={portfolio.ownerDisplayName ? (
          <p className="text-text-muted text-xs font-mono truncate max-w-[40%]">
            {t.collection.publicPage.byOwner.replace('{name}', portfolio.ownerDisplayName)}
          </p>
        ) : undefined}
      />

      <div className="workspace-canvas container-tool py-6 pb-24 md:pb-6">
        <CollectionAnimeEnter className="mb-5">
        <HeroStamp
          decorative={false}
          layout="dashboard"
          lines={{
            brand: isPublic ? t.collection.wts.publicBadge : t.collection.publicPage.badge,
            tagline: portfolio.name,
            muted: isPublic
              ? t.collection.wts.publicSubtitle.replace('{n}', String(activeCount))
              : (portfolio.ownerDisplayName ?? t.collection.publicPage.subtitle),
          }}
        >
          <div className="hero-stamp__stats" aria-label={t.collection.publicPage.statsSection}>
            {statRows.map(row => (
              <div key={row.label} className="hero-stamp__stat">
                <span className="hero-stamp__stat-label">{row.label}</span>
                <span className={`hero-stamp__stat-value ${row.tone}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </HeroStamp>
        </CollectionAnimeEnter>

        <CollectionAnimeEnter delay={40}>
        <div className="collection-public-toolbar">
          <div className="collection-filter-pills" role="group" aria-label={t.collection.filters.all}>
            {([
              ['all', t.collection.filters.all],
              ['active', t.collection.filters.active],
              ['sold', t.collection.filters.sold],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className="collection-filter-pill"
                aria-pressed={soldFilter === value}
                onClick={() => setSoldFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="public-sort" className="sr-only">{t.collection.wts.sortLabel}</label>
            <select
              id="public-sort"
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="collection-toolbar__select"
            >
              <option value="listPrice">{t.collection.wts.sortPrice}</option>
              <option value="grade">{t.collection.wts.sortGrade}</option>
              <option value="name">{t.collection.wts.sortName}</option>
            </select>
            <button
              type="button"
              onClick={() => setSortAsc(v => !v)}
              className="collection-action-pill min-w-[2.75rem] px-2.5"
              aria-pressed={sortAsc}
              aria-label={sortAsc ? t.collection.wts.sortAsc : t.collection.wts.sortDesc}
            >
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>
        </div>
        </CollectionAnimeEnter>

        {displayedCards.length === 0 ? (
          <CollectionAnimeEnter delay={60}>
          <div className="flex flex-col items-center justify-center py-20 text-center panel">
            <div className="w-14 h-14 border border-border-strong flex items-center justify-center mb-4 bg-surface-raised">
              <Package className="w-6 h-6 text-text-muted" aria-hidden="true" />
            </div>
            <p className="text-text-secondary text-sm mb-1">
              {soldFilter === 'active'
                ? t.collection.wts.noActiveListings
                : t.collection.publicPage.emptyTitle.replace('{name}', portfolio.name)}
            </p>
            <p className="text-text-muted text-xs">{t.collection.publicPage.emptyBody}</p>
          </div>
          </CollectionAnimeEnter>
        ) : (
          <CollectionAnimeStagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            animateKey={`${soldFilter}-${sortKey}-${sortAsc}-${displayedCards.length}`}
          >
            {displayedCards.map(card => (
              <article key={card.id} data-collection-animate className="collection-public-card">
                <PublicCardImage card={card} />
                <div className="flex items-start justify-between gap-2">
                  <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                  <SoldBadge sold={card.sold} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${card.sold ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    {card.name}
                  </p>
                  <p className="text-text-muted text-xs mt-1 line-clamp-1">
                    {[card.year, card.set, card.number].filter(Boolean).join(' · ')}
                  </p>
                  {card.certNumber && (
                    <p className="text-text-muted text-xs font-mono mt-0.5">{card.certNumber}</p>
                  )}
                </div>
                {card.listPrice != null && (
                  <div className="border-t border-border-default pt-3">
                    <div className="spec-row !py-2 !px-0">
                      <span className="spec-row__label">{t.collection.table.list}</span>
                      <span className={`spec-row__value font-tabular ${card.sold ? 'text-text-muted line-through' : 'text-accent-secondary'}`}>
                        {formatListPrice(card, portfolio.preferredCurrency)}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </CollectionAnimeStagger>
        )}
      </div>

      {contactWa && (
        <>
          <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border-default bg-surface-panel/95 backdrop-blur-sm p-3 md:hidden">
            <a
              href={buildWhatsAppShareUrl(contactMessage, contactWa)}
              target="_blank"
              rel="noopener noreferrer"
              className="collection-action-pill collection-action-pill--primary collection-action-pill--block"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t.collection.wts.contactSeller}
            </a>
          </div>
          <div className="hidden md:block fixed bottom-6 right-6 z-40">
            <a
              href={buildWhatsAppShareUrl(contactMessage, contactWa)}
              target="_blank"
              rel="noopener noreferrer"
              className="collection-action-pill collection-action-pill--primary shadow-lg"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t.collection.wts.contactSeller}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
