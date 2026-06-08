'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { CollectorCard, Portfolio } from '../types';
import { resolveAbsoluteBackendUrl } from '../lib/cardImages';
import { GradePill } from './shared';

/* ─── Image URL ───────────────────────────────────────────────────────────── */

export function resolveCardImageUrl(src?: string): string | undefined {
  if (!src) return undefined;
  return resolveAbsoluteBackendUrl(src);
}

/* ─── Grade tier accent ───────────────────────────────────────────────────── */

export function gradeTierClass(grade: number): string {
  if (grade >= 10) return 'collection-grade-tier--gem';
  if (grade >= 9) return 'collection-grade-tier--mint';
  if (grade >= 7) return 'collection-grade-tier--good';
  return 'collection-grade-tier--base';
}

/* ─── Thumbnail ───────────────────────────────────────────────────────────── */

export function CardThumbnail({
  card,
  size = 'md',
  className = '',
}: {
  card: CollectorCard;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const src = resolveCardImageUrl(card.frontImage);
  const sizeClass =
    size === 'sm' ? 'collection-thumb--sm' : size === 'lg' ? 'collection-thumb--lg' : 'collection-thumb--md';

  return (
    <div className={`collection-thumb ${sizeClass} ${className}`} data-has-image={src ? 'true' : 'false'}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="collection-thumb__img" loading="lazy" />
      ) : (
        <div className="collection-thumb__placeholder" aria-hidden="true">
          <Package className="collection-thumb__icon" />
        </div>
      )}
      <span className="collection-thumb__corner collection-thumb__corner--tl" aria-hidden="true" />
      <span className="collection-thumb__corner collection-thumb__corner--br" aria-hidden="true" />
    </div>
  );
}

/* ─── Status badge ────────────────────────────────────────────────────────── */

export function CardStatusBadge({ sold, onClick }: { sold: boolean; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`collection-status-badge ${sold ? 'collection-status-badge--sold' : 'collection-status-badge--active'}`}
    >
      {sold ? t.collection.publicPage.sold : t.collection.publicPage.active}
    </button>
  );
}

/* ─── Portfolio tags ──────────────────────────────────────────────────────── */

export function PortfolioTags({ portfolios }: { portfolios: Portfolio[] }) {
  if (portfolios.length === 0) return null;
  return (
    <div className="collection-portfolio-tags">
      {portfolios.map(p => (
        <span key={p.id} className="collection-portfolio-tag">
          {p.name}
        </span>
      ))}
    </div>
  );
}

/* ─── Card meta block ─────────────────────────────────────────────────────── */

export function CardMetaBlock({
  card,
  memberships = [],
  compact = false,
}: {
  card: CollectorCard;
  memberships?: Portfolio[];
  compact?: boolean;
}) {
  const meta = [card.year, card.set, card.number, card.language].filter(Boolean).join(' · ');
  const soldClass = card.sold ? 'collection-card-name--sold' : '';

  return (
    <div className={`collection-card-meta ${compact ? 'collection-card-meta--compact' : ''}`}>
      <p className={`collection-card-name ${soldClass}`}>{card.name}</p>
      {meta && <p className="collection-card-detail">{meta}</p>}
      {card.certNumber && (
        <p className="collection-card-cert">
          <span className="collection-card-cert__label">CERT</span>
          {card.certNumber}
        </p>
      )}
      {!compact && memberships.length > 0 && <PortfolioTags portfolios={memberships} />}
    </div>
  );
}

/* ─── Price block ─────────────────────────────────────────────────────────── */

export function CardPriceBlock({ card, showList = true }: { card: CollectorCard; showList?: boolean }) {
  const soldClass = card.sold ? 'collection-price--sold' : '';
  return (
    <div className="collection-price-block">
      <span className={`collection-price-buy ${soldClass}`}>
        <span className="collection-price-buy__currency">{card.buyCurrency}</span>
        {card.buyPrice.toLocaleString()}
      </span>
      {showList && card.listPrice != null && (
        <span className="collection-price-list">
          List {card.listCurrency} {card.listPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}
