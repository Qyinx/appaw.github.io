'use client';

import React from 'react';
import { Globe, Package } from 'lucide-react';
import HeroStamp from '@/components/ui/HeroStamp';
import { useLanguage } from '@/context/LanguageContext';
import type { PublicPortfolio } from '@/lib/collection/publicPortfolio';
import { GradePill } from './shared';

interface PublicPortfolioViewProps {
  portfolio: PublicPortfolio;
}

function SoldBadge({ sold }: { sold: boolean }) {
  const { t } = useLanguage();
  return (
    <span
      className={`font-mono text-[10px] font-bold px-2 py-1 border uppercase tracking-wider ${
        sold
          ? 'bg-accent-danger/10 border-accent-danger/30 text-accent-danger'
          : 'bg-accent-success/10 border-accent-success/25 text-accent-success'
      }`}
    >
      {sold ? t.collection.publicPage.sold : t.collection.publicPage.active}
    </span>
  );
}

function CardImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="aspect-[3/4] w-full border border-border-default bg-surface-raised flex items-center justify-center">
        <Package className="w-8 h-8 text-text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="aspect-[3/4] w-full border border-border-default bg-surface-raised overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-contain" loading="lazy" />
    </div>
  );
}

export function PublicPortfolioView({ portfolio }: PublicPortfolioViewProps) {
  const { t } = useLanguage();
  const { cards } = portfolio;
  const activeCount = cards.filter(c => !c.sold).length;
  const soldCount = cards.filter(c => c.sold).length;

  const statRows = [
    { label: t.collection.publicPage.statsTotal, value: String(cards.length), tone: 'text-text-primary' },
    { label: t.collection.publicPage.statsActive, value: String(activeCount), tone: 'text-accent-success' },
    { label: t.collection.publicPage.statsSold, value: String(soldCount), tone: 'text-accent-danger' },
  ];

  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip">
      <div className="workspace-chrome sticky top-16 md:top-20 z-30 border-b border-border-default shadow-[0_1px_0_var(--border-default)]">
        <div className="container-tool flex flex-row items-center justify-between gap-2 py-2 collection-topbar-inner min-h-[2.75rem]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Globe className="w-3.5 h-3.5 text-accent-secondary flex-shrink-0" aria-hidden="true" />
            <h1 className="text-text-primary font-semibold text-xs sm:text-sm truncate">{portfolio.name}</h1>
          </div>
          {portfolio.ownerDisplayName && (
            <p className="text-text-muted text-xs font-mono truncate max-w-[40%]">
              {t.collection.publicPage.byOwner.replace('{name}', portfolio.ownerDisplayName)}
            </p>
          )}
        </div>
      </div>

      <div className="workspace-canvas container-tool py-6">
        <HeroStamp
          decorative={false}
          layout="dashboard"
          className="mb-5"
          lines={{
            brand: t.collection.publicPage.badge,
            tagline: portfolio.name,
            muted: portfolio.ownerDisplayName ?? t.collection.publicPage.subtitle,
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

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center panel">
            <div className="w-14 h-14 border border-border-strong flex items-center justify-center mb-4 bg-surface-raised">
              <Package className="w-6 h-6 text-text-muted" aria-hidden="true" />
            </div>
            <p className="text-text-secondary text-sm mb-1">
              {t.collection.publicPage.emptyTitle.replace('{name}', portfolio.name)}
            </p>
            <p className="text-text-muted text-xs">{t.collection.publicPage.emptyBody}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map(card => (
              <article key={card.id} className="panel p-4 flex flex-col gap-3 hover:border-border-strong transition-[border-color]">
                <CardImage src={card.frontImage} alt={card.name} />
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
                        {card.inPreferredCurrency?.listPrice != null && portfolio.preferredCurrency
                          ? `${portfolio.preferredCurrency} ${card.inPreferredCurrency.listPrice.toLocaleString()}`
                          : `${card.listCurrency ?? 'HKD'} ${card.listPrice.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
