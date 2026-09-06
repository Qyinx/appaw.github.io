'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { Search, ArrowUpDown, ChevronDown, X, Package, Eye, ExternalLink, Hash, Globe, Tag, ZoomIn, Layers, Share2, Check, ShoppingBag, Tag as TagIcon, Shield, Gauge } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { marketplaceImageSrc } from '@/lib/marketplace/cardImage';
import { usePublicMarketplaceCards } from '@/hooks/usePublicMarketplaceCards';
import { getGradeColor, getCompanyStyle, formatPrice, formatGrade } from '@/lib/card-helpers';
import { MARKETPLACE_IN_PROGRESS } from '@/lib/marketplace-config';
import { useSubHeader } from '@/hooks/useSubHeader';
import ServiceAvailabilityBanner from '@/components/business/ServiceAvailabilityBanner';
import type { TradingCard, GradingCompany, GradeTier } from '@/types/trading-card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  emptyMarketplaceQuery,
  marketplaceQueryHasFilters,
  marketplaceQueryToSearchParams,
  parseMarketplaceSearchParams,
  type MarketplaceQuery,
  type MarketplaceSortKey,
} from '@/lib/marketplace/query';

/* ──────────────────────────────────────────
   Trading Guide + FAQ
   ────────────────────────────────────────── */
function TradingGuide({ guide, registerActivate }: {
  guide: ReturnType<typeof useLanguage>['t']['tradingGuide'];
  registerActivate?: (fn: () => void) => void;
}) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Expose an imperative activate function to the parent
  useEffect(() => {
    registerActivate?.(() => {
      setActiveTab('sell');
      setOpenFaq(1); // index of commission FAQ in sell.faq.items
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const side = activeTab === 'buy' ? guide.buy : guide.sell;
  const tabAccent = activeTab === 'buy' ? 'var(--accent-primary)' : 'var(--accent-secondary)';
  const tabAccentRgb = activeTab === 'buy' ? '255,154,166' : '139,152,251';

  return (
    <section id="consign" className="section-padding bg-surface-bg relative overflow-x-clip border-t border-border-default">

      <div className="container-custom">

        {/* Header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold font-display text-text-primary leading-[1.1] mb-3">{guide.title}</h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">{guide.subtitle}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 bg-surface-raised border border-border-default rounded-none w-fit mb-12">
          <button
            onClick={() => { setActiveTab('buy'); setOpenFaq(null); }}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
            style={activeTab === 'buy'
              ? { background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)', color: 'var(--accent-primary)', boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-primary) 30%, transparent)' }
              : { color: 'var(--text-muted)' }
            }
          >
            <ShoppingBag className="w-4 h-4" />
            {guide.buyTab}
          </button>
          <button
            onClick={() => { setActiveTab('sell'); setOpenFaq(null); }}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
            style={activeTab === 'sell'
              ? { background: 'color-mix(in srgb, var(--accent-secondary) 12%, transparent)', color: 'var(--accent-secondary)', boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-secondary) 25%, transparent)' }
              : { color: 'var(--text-muted)' }
            }
          >
            <TagIcon className="w-4 h-4" />
            {guide.sellTab}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Rules list */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-8 flex items-center gap-3">
              <span className="w-6 h-px" style={{ background: tabAccent }} />
              {side.title}
            </h3>
            <div className="space-y-4">
              {side.rules.map((rule, i) => (
                <div
                  key={i}
                  className="group flex gap-5 p-5 panel transition-[border-color,background-color] duration-300"
                  style={{ borderColor: `rgba(${tabAccentRgb},0.12)`, background: `rgba(${tabAccentRgb},0.03)` }}
                >
                  {/* Step number */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: `rgba(${tabAccentRgb},0.12)`, color: tabAccent }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold text-sm mb-1.5">{rule.heading}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{rule.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ accordion */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-8 flex items-center gap-3">
              <span className="w-6 h-px bg-border-strong" />
              {side.faq.title}
            </h3>
            <div className="space-y-2">
              {side.faq.items.map((item, i) => (
                  <div key={i} className="border border-border-default rounded-none overflow-hidden bg-surface-panel">
                    <button
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-raised"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-text-primary text-sm font-medium leading-snug">{item.q}</span>
                      <ChevronDown
                        className="flex-shrink-0 w-4 h-4 text-text-muted transition-transform duration-300"
                        style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-[max-height,opacity] duration-300"
                      style={{ maxHeight: openFaq === i ? '240px' : '0px', opacity: openFaq === i ? 1 : 0 }}
                    >
                      <p className="px-5 pt-1 pb-4 text-text-secondary text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Why Appaw? — Trust & Provenance Section
   ────────────────────────────────────────── */
function WhyAppaw({ labels, onSeeCommission }: {
  labels: ReturnType<typeof useLanguage>['t']['cardMarketplace'];
  onSeeCommission?: () => void;
}) {
  const wa = labels.whyAppaw;

  const pillarMeta = [
    { icon: Shield, accent: 'var(--accent-primary)', link: '/products/psa-protectors' as string | null },
    { icon: Eye,    accent: 'var(--accent-secondary)', link: null },
    { icon: Tag,    accent: 'var(--accent-success)', link: '#consign' as string | null },
    { icon: Check,  accent: 'var(--accent-warn)', link: null },
  ];

  return (
    <section className="section-padding border-t border-border-default bg-surface-panel overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold font-display text-text-primary leading-[1.1] mb-3">
            {wa.title} <span className="text-accent-brand">{wa.titleAccent}</span>
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-lg">
            {wa.subtitle}
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-default border border-border-default">
          {wa.pillars.map((p, i) => {
            const { icon: Icon, accent, link } = pillarMeta[i];
            const isCommission = i === 2;
            return (
              <div key={i} className="group relative bg-surface-panel p-6 md:p-8 hover:bg-surface-raised transition-colors duration-200 overflow-hidden min-w-0">
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ backgroundColor: accent }}
                />
                {/* Watermark number */}
                <span className="absolute -top-4 -right-2 text-[6rem] font-bold text-text-primary/[0.04] select-none leading-none group-hover:text-text-primary/[0.04] transition-colors duration-500">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div
                  className="w-12 h-12 rounded-none border border-border-default flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-text-primary mb-3">
                  {p.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {p.body}
                </p>
                {link && p.linkText && (
                  isCommission ? (
                    <button
                      onClick={onSeeCommission}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200"
                      style={{ color: accent }}
                    >
                      {p.linkText}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <LocalLink
                      href={link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200"
                      style={{ color: accent }}
                    >
                      {p.linkText}
                      <ExternalLink className="w-3 h-3" />
                    </LocalLink>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Detail Modal — portaled above site chrome
   ────────────────────────────────────────── */
function CardDetailModal({ card, labels, onClose }: { card: TradingCard; labels: ReturnType<typeof useLanguage>['t']['cardMarketplace']; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isBundle = !!(card.bundleCards && card.bundleCards.length > 0);
  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardUrl = useMemo(() => {
    const base = `${typeof window !== 'undefined' ? window.location.origin : ''}/business/card-trading/${card.id}/`;
    return selectedBundleIdx > 0 ? `${base}?card=${selectedBundleIdx}` : base;
  }, [card.id, selectedBundleIdx]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(cardUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [cardUrl]);

  // Single source of truth: main card is idx 0, sub-cards follow.
  const allInBundle = useMemo(() => {
    if (!isBundle || !card.bundleCards) return [];
    return [
      { name: card.name, image: card.image, imageBack: card.imageBack, company: card.company, grade: card.grade, isBlackLabel: card.isBlackLabel, set: card.set, number: card.number, year: card.year, certNumber: card.certNumber },
      ...card.bundleCards,
    ];
  }, [isBundle, card]);

  // Active card resolved from allInBundle — all fields update when selection changes
  const activeCard = useMemo(() => {
    if (isBundle && allInBundle.length > 0) {
      const bc = allInBundle[selectedBundleIdx] ?? allInBundle[0];
      return { name: bc.name, image: bc.image, imageBack: bc.imageBack, company: bc.company, grade: bc.grade, isBlackLabel: bc.isBlackLabel, set: bc.set, number: bc.number, year: bc.year ?? card.year, certNumber: bc.certNumber };
    }
    return { name: card.name, image: card.image, imageBack: card.imageBack, company: card.company, grade: card.grade, isBlackLabel: card.isBlackLabel, set: card.set, number: card.number, year: card.year, certNumber: card.certNumber };
  }, [isBundle, allInBundle, selectedBundleIdx, card]);

  const gradeColor = getGradeColor(activeCard.grade, activeCard.isBlackLabel);
  const companyStyle = getCompanyStyle(activeCard.company);
  const frontSrc = marketplaceImageSrc(activeCard.image);
  const backSrc = marketplaceImageSrc(activeCard.imageBack);
  const hasBack = !!backSrc;
  const lensSrc = showBack && hasBack ? backSrc : frontSrc;

  // Magnifier state — uses pixel offsets for accurate edge/corner viewing
  const LENS = 180; // lens diameter in px
  const ZOOM = 3;
  const [magnifier, setMagnifier] = useState<{ active: boolean; pageX: number; pageY: number; bgX: number; bgY: number; bgW: number; bgH: number }>({
    active: false, pageX: 0, pageY: 0, bgX: 0, bgY: 0, bgW: 0, bgH: 0,
  });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Cursor position as ratio (0–1) within the container
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    // Background dimensions at zoom level
    const bgW = rect.width * ZOOM;
    const bgH = rect.height * ZOOM;
    // Offset so the cursor point sits at the center of the lens
    const bgX = LENS / 2 - rx * bgW;
    const bgY = LENS / 2 - ry * bgH;
    setMagnifier({ active: true, pageX: e.clientX, pageY: e.clientY, bgX, bgY, bgW, bgH });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier({ active: false, pageX: 0, pageY: 0, bgX: 0, bgY: 0, bgW: 0, bgH: 0 });
  }, []);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const infoRows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Tag className="w-3.5 h-3.5" />, label: labels.card.company, value: activeCard.company },
    { icon: <Hash className="w-3.5 h-3.5" />, label: labels.card.grade, value: formatGrade(activeCard.grade, activeCard.isBlackLabel) },
    { icon: <Hash className="w-3.5 h-3.5" />, label: labels.card.year, value: String(activeCard.year) },
    ...(activeCard.set ? [{ icon: <ExternalLink className="w-3.5 h-3.5" />, label: labels.card.set, value: activeCard.set }] : []),
    ...(activeCard.number ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: labels.card.number, value: activeCard.number }] : []),
    ...(card.language ? [{ icon: <Globe className="w-3.5 h-3.5" />, label: labels.card.language, value: card.language }] : []),
    ...(activeCard.certNumber ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: labels.card.cert, value: activeCard.certNumber }] : []),
  ];

  if (!mounted) return null;

  return createPortal(
    <div
      className="marketplace-detail-modal fixed inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6 overscroll-contain"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activeCard.name}
    >
      {/* Backdrop — covers header + filters */}
      <button
        type="button"
        className="absolute inset-0 bg-accent-structural/85 cursor-pointer"
        aria-label={labels.modal.close}
        onClick={onClose}
      />

      {/* Centered popup panel */}
      <div
        className="relative z-[1] flex w-full max-w-5xl max-h-[min(92dvh,900px)] flex-col overflow-hidden border border-border-strong bg-surface-panel shadow-[0_24px_64px_rgba(0,0,0,0.45)] animate-[fadeUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top-right actions */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {/* Copy link */}
          <button onClick={handleCopyLink}
            type="button"
            title={labels.detail?.copyLink ?? 'Copy link'}
            className={`min-h-11 min-w-11 flex items-center justify-center border border-border-default transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-surface-raised hover:bg-surface-raised text-text-secondary hover:text-text-primary'
            }`}>
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
          {/* Open full page — carries ?card=N so the detail page pre-selects the right card */}
          <LocalLink href={`/business/card-trading/${card.id}/${selectedBundleIdx > 0 ? `?card=${selectedBundleIdx}` : ''}`}
            title={labels.detail?.viewPage ?? 'View full page'}
            className="min-h-11 min-w-11 flex items-center justify-center border border-border-default bg-surface-raised hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-[color,background-color,border-color,opacity,transform,box-shadow]">
            <ExternalLink className="w-4 h-4" />
          </LocalLink>
          {/* Close */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={labels.modal.close}
            className="min-h-11 min-w-11 flex items-center justify-center border border-border-default bg-surface-raised hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-[color,background-color,border-color,opacity,transform,box-shadow]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 min-h-0 flex-1 overflow-hidden">
          {/* Left — fit height (no scroll); image shrinks so flip never needs a scrollbar */}
          <div className="relative bg-surface-raised p-4 md:p-6 flex flex-col min-h-[min(46dvh,480px)] md:min-h-0 overflow-hidden border-b md:border-b-0 md:border-r border-border-default">
            {/* Badges — in flow like full page */}
            <div className="relative flex items-center gap-1.5 mb-3 z-10 shrink-0">
              <div
                className="h-7 min-w-[40px] flex items-center justify-center px-2.5 rounded-md"
                style={{ background: companyStyle.background, color: companyStyle.color, boxShadow: companyStyle.shadow }}
              >
                <span className="text-xs font-bold leading-none">{activeCard.company}</span>
              </div>
              <div className={`h-7 min-w-[40px] flex items-center justify-center gap-1 px-2.5 rounded-md ${gradeColor.bg} ${gradeColor.text} border ${gradeColor.border}`}>
                {activeCard.isBlackLabel && <span className="text-xs font-bold text-accent-brand leading-none">BL</span>}
                <span className="text-sm font-black leading-none tabular-nums">{activeCard.grade}</span>
              </div>
              {isBundle && (
                <div className="flex items-center gap-1 px-2.5 h-7 rounded-md bg-accent-cta text-accent-cta-ink border border-border-strong">
                  <Layers className="w-3 h-3" />
                  <span className="text-xs font-extrabold leading-none">{labels.bundle.fullSet}</span>
                </div>
              )}
            </div>

            {/* Flex stage: image scales to leftover height → no overflow scrollbar */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center px-2">
              <div
                ref={imgContainerRef}
                className="relative aspect-[3/4] h-full max-h-full w-auto max-w-full md:cursor-crosshair"
                style={{ perspective: '400px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  }}
                >
                  {/* Front */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                    {frontSrc && (
                      <Image src={frontSrc} alt={`${activeCard.name} – ${activeCard.company} ${activeCard.grade}${activeCard.isBlackLabel ? ' Black Label' : ''} front`} fill
                        className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="420px" />
                    )}
                  </div>
                  {/* Back */}
                  {hasBack && backSrc && (
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <Image src={backSrc} alt={`${activeCard.name} – ${activeCard.company} ${activeCard.grade}${activeCard.isBlackLabel ? ' Black Label' : ''} back`} fill
                        className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="420px" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls — shrink-0 so always visible; mousedown preventDefault stops focus scroll */}
            <div className="flex items-center justify-center gap-4 mt-3 shrink-0">
              <div className="hidden md:flex items-center gap-1.5 text-text-muted text-xs select-none">
                <ZoomIn className="w-3 h-3" />
                <span>Hover to zoom</span>
              </div>

              {hasBack && (
                <div className="relative flex items-center bg-surface-raised border border-border-default rounded-none p-0.5">
                  <button
                    type="button"
                    aria-pressed={!showBack}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowBack(false)}
                    className={`relative z-10 px-4 py-1.5 rounded-none text-xs font-medium min-h-11 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ${
                      !showBack ? 'text-surface-bg' : 'text-text-muted hover:text-text-primary/60'
                    }`}
                  >
                    {labels.modal.front}
                  </button>
                  <button
                    type="button"
                    aria-pressed={showBack}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowBack(true)}
                    className={`relative z-10 px-4 py-1.5 rounded-none text-xs font-medium min-h-11 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ${
                      showBack ? 'text-surface-bg' : 'text-text-muted hover:text-text-primary/60'
                    }`}
                  >
                    {labels.modal.back}
                  </button>
                  <div
                    className="absolute top-0.5 h-[calc(100%-4px)] rounded-none bg-accent-structural transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 pointer-events-none"
                    style={{
                      width: 'calc(50% - 2px)',
                      left: showBack ? 'calc(50% + 2px)' : '2px',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right — Info */}
          <div className="p-0 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-1 font-display pr-28">{activeCard.name}</h2>
            <p className="text-text-muted text-sm mb-4">
              {activeCard.set && <>{activeCard.set}</>}
              {activeCard.number && <> · {activeCard.number}</>}
            </p>

            {/* Full Set indicator */}
            {isBundle && card.bundleCards && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-surface-raised border border-border-default">
                  <Layers className="w-3.5 h-3.5 text-accent-brand" />
                  <span className="text-accent-brand text-xs font-bold">{labels.bundle.fullSet} · {allInBundle.length} {labels.bundle.cards}</span>
                </div>
                <span className="text-text-muted text-xs italic">{labels.bundle.setOnly}</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-surface-raised border border-border-default rounded-none p-4 mb-5">
              <p className="text-text-muted text-xs uppercase tracking-[0.14em] mb-1">{isBundle ? labels.bundle.setPrice : labels.card.price}</p>
              <p className="text-accent-brand text-2xl font-bold font-display">{formatPrice(card.price, card.currency)}</p>
            </div>

            {/* Info table */}
            <div className="space-y-0 mb-5">
              {infoRows.map((row, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border-default last:border-0">
                  <span className="text-text-muted">{row.icon}</span>
                  <span className="text-text-muted text-xs flex-shrink-0 w-20">{row.label}</span>
                  <span className="text-text-primary text-sm font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Bundle card list — uses allInBundle so idx matches thumbnail strip and activeCard */}
            {isBundle && allInBundle.length > 0 && (
              <div className="mb-5">
                <p className="text-text-muted text-xs uppercase tracking-[0.14em] mb-3">{labels.bundle.cardsInSet}</p>
                <div className="flex flex-col gap-1.5">
                  {allInBundle.map((bc, idx) => {
                    const bcGrade = getGradeColor(bc.grade, bc.isBlackLabel);
                    const bcCompany = getCompanyStyle(bc.company);
                    const isActive = idx === selectedBundleIdx;
                    const thumbSrc = marketplaceImageSrc(bc.image);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                        className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-none border border-transparent transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 text-left overflow-hidden ${
                          isActive
                            ? 'bg-surface-raised border-border-strong'
                            : 'hover:bg-surface-raised'
                        }`}
                      >
                        {/* Left accent bar */}
                        <div className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-none transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ${isActive ? 'bg-accent-cta' : 'bg-transparent'}`} />

                        {/* Thumbnail */}
                        <div className={`relative flex-shrink-0 w-10 h-[52px] rounded-none overflow-hidden border transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ${
                          isActive
                            ? 'border-border-strong'
                            : 'border-border-default'
                        }`}>
                          {thumbSrc && (
                            <Image src={thumbSrc} alt={bc.name} fill className="object-contain p-0.5" sizes="40px" />
                          )}
                        </div>

                        {/* Name + meta */}
                        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                          <span className={`text-sm font-semibold truncate leading-tight transition-colors ${
                            isActive ? 'text-text-primary' : 'text-text-secondary'
                          }`}>{bc.name}</span>
                          {(bc.set || bc.number) && (
                            <span className="text-xs text-text-muted truncate leading-tight">
                              {[bc.set, bc.number].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </div>

                        {/* Stacked badges */}
                        <div className="flex flex-col items-end gap-[5px] flex-shrink-0">
                          <div
                            className="h-[15px] px-1.5 flex items-center justify-center rounded text-xs font-bold leading-none"
                            style={{ background: bcCompany.background, color: bcCompany.color }}
                          >{bc.company}</div>
                          <div className={`h-[15px] px-1.5 flex items-center justify-center gap-0.5 rounded text-xs font-black leading-none ${bcGrade.bg} ${bcGrade.text} border ${bcGrade.border}`}>
                            {bc.isBlackLabel && <span className="text-xs font-bold text-accent-brand">BL</span>}
                            {bc.grade}
                          </div>
                        </div>

                        {/* Open this specific card on the full detail page */}
                        <LocalLink
                          href={`/business/card-trading/${card.id}/${idx > 0 ? `?card=${idx}` : ''}`}
                          onClick={e => e.stopPropagation()}
                          title={labels.detail?.viewPage ?? 'View full page'}
                          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ${
                            isActive
                              ? 'bg-surface-raised text-text-primary border border-border-strong hover:bg-surface-raised'
                              : 'bg-surface-raised text-text-muted hover:bg-surface-raised hover:text-text-secondary'
                          }`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </LocalLink>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            </div>
            {/* Inquire CTA — sticky bottom with safe-area */}
            <div className="shrink-0 border-t border-border-default bg-surface-panel px-5 md:px-8 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            {card.sold ? (
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-center gap-2.5 w-full min-h-11 py-3.5 rounded-none bg-accent-danger/10 border border-accent-danger/30 text-accent-danger text-sm font-bold uppercase tracking-[0.1em]">
                  <span>{labels.card.soldOut}</span>
                </div>
                <LocalLink href="/business/card-trading/" className="flex items-center justify-center gap-2 w-full min-h-11 py-2.5 rounded-lg bg-surface-raised text-text-secondary hover:text-text-primary text-sm font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow]">
                  <span>{labels.card.similarItems}</span>
                </LocalLink>
              </div>
            ) : (
              <a
                href={`https://wa.me/85292851189?text=${encodeURIComponent(
                  isBundle
                    ? `Hi, I'd like to make an offer for the full set: ${card.name} (${card.bundleCards?.length} cards, ${card.company}, ${card.year})\nListed price: ${formatPrice(card.price, card.currency)}\nCard link: https://appaw.store/business/card-trading/${card.id}/\nMy offer: `
                    : `Hi, I'd like to make an offer for: ${card.name} (${card.company} ${formatGrade(card.grade, card.isBlackLabel)}, ${card.year})\nListed price: ${formatPrice(card.price, card.currency)}\nCard link: https://appaw.store/business/card-trading/${card.id}/\nMy offer: `
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary w-full min-h-11 py-3.5 text-sm font-bold uppercase tracking-[0.1em]"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>{labels.card.inquire}</span>
              </a>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed magnifier lens — pixel-based positioning for accurate edge/corner viewing */}
      {magnifier.active && lensSrc && (
        <div
          className="pointer-events-none fixed rounded-full border-2 border-border-strong shadow-[0_0_24px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(0,0,0,0.2)] overflow-hidden z-[210]"
          style={{
            width: LENS,
            height: LENS,
            left: magnifier.pageX,
            top: magnifier.pageY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: magnifier.bgW,
              height: magnifier.bgH,
              left: magnifier.bgX,
              top: magnifier.bgY,
              backgroundImage: `url(${lensSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      )}
    </div>,
    document.body,
  );
}

/* ──────────────────────────────────────────
   Loading — slab-shaped gallery skeletons
   ────────────────────────────────────────── */
function MarketplaceGridSkeleton({ label, count = 10 }: { label: string; count?: number }) {
  return (
    <div
      className="marketplace-skeleton-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="marketplace-skeleton-card panel overflow-hidden"
          style={{ animationDelay: `${i * 60}ms` }}
          aria-hidden="true"
        >
          <div className="marketplace-skeleton-slab relative aspect-[3/4] bg-surface-raised">
            <div className="marketplace-skeleton-slab__frame" />
            <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
              <div className="collection-skeleton__block h-6 w-11" />
              <div className="collection-skeleton__block h-8 w-8" />
            </div>
            <div className="marketplace-skeleton-slab__window collection-skeleton__block" />
          </div>
          <div className="px-3.5 pt-2.5 pb-3 space-y-2">
            <div className="collection-skeleton__block h-3.5 w-[78%]" />
            <div className="collection-skeleton__block h-2.5 w-[42%]" />
            <div className="pt-1 flex items-center justify-between gap-2">
              <div className="collection-skeleton__block h-2.5 w-24" />
              <div className="collection-skeleton__block h-7 w-7" />
            </div>
          </div>
        </div>
      ))}
      <p className="sr-only">{label}</p>
    </div>
  );
}

/* ──────────────────────────────────────────
   Main Component
   ────────────────────────────────────────── */
export default function CardTradingPage() {
  const { t } = useLanguage();
  const mp = t.cardMarketplace;
  const guide = t.tradingGuide;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseMarketplaceSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const { cards, total, totalPages, loading: cardsLoading, error: cardsError } = usePublicMarketplaceCards(
    query,
    !MARKETPLACE_IN_PROGRESS,
  );
  const loading = MARKETPLACE_IN_PROGRESS ? false : cardsLoading;
  const error = MARKETPLACE_IN_PROGRESS ? null : cardsError;

  const [searchInput, setSearchInput] = useState(query.q);
  const [showSort, setShowSort] = useState(false);

  const applyQuery = useCallback((next: MarketplaceQuery) => {
    const params = marketplaceQueryToSearchParams(next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    setSearchInput(query.q);
  }, [query.q]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput.trim() === query.q) return;
      applyQuery({ ...query, q: searchInput.trim(), page: 1 });
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput, query, applyQuery]);

  const flushSearch = useCallback(() => {
    const next = searchInput.trim();
    if (next === query.q) return;
    applyQuery({ ...query, q: next, page: 1 });
  }, [applyQuery, query, searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    if (query.q) applyQuery({ ...query, q: '', page: 1 });
  }, [applyQuery, query]);

  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const activateCommissionRef = useRef<(() => void) | null>(null);

  const handleSeeCommission = useCallback(() => {
    activateCommissionRef.current?.();
    setTimeout(() => {
      document.getElementById('consign')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  useEffect(() => { const timer = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(timer); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setCtaVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!showSort) return;
    const handler = () => setShowSort(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showSort]);

  const displayItems = useMemo(() => {
    type DisplayItem = {
      key: string;
      tileImage: string | undefined;
      tileName: string;
      tileCompany: GradingCompany;
      tileGrade: number;
      tileIsBlackLabel?: boolean;
      tileSet?: string;
      tileNumber?: string;
      tileYear: number;
      parentCard: TradingCard;
      isSubCard: boolean;
      bundleTotal: number;
    };
    const items: DisplayItem[] = [];
    cards.forEach(card => {
      const bundleTotal = card.bundleCards?.length ? card.bundleCards.length + 1 : 1;
      items.push({
        key: card.id,
        tileImage: card.image || card.bundleCards?.[0]?.image,
        tileName: card.name,
        tileCompany: card.company,
        tileGrade: card.grade,
        tileIsBlackLabel: card.isBlackLabel,
        tileSet: card.set,
        tileNumber: card.number,
        tileYear: card.year,
        parentCard: card,
        isSubCard: false,
        bundleTotal,
      });
      card.bundleCards?.forEach((bc, idx) => {
        items.push({
          key: `${card.id}-bc-${idx}`,
          tileImage: bc.image,
          tileName: bc.name,
          tileCompany: bc.company,
          tileGrade: bc.grade,
          tileIsBlackLabel: bc.isBlackLabel,
          tileSet: bc.set,
          tileNumber: bc.number,
          tileYear: bc.year ?? card.year,
          parentCard: card,
          isSubCard: true,
          bundleTotal,
        });
      });
    });
    return items;
  }, [cards]);

  const hasActiveFilters = marketplaceQueryHasFilters(query);

  const resetFilters = useCallback(() => {
    setSearchInput('');
    applyQuery(emptyMarketplaceQuery());
  }, [applyQuery]);

  const companies: GradingCompany[] = ['PSA', 'BGS', 'CGC', 'TAG'];
  const gradeTiers: { key: GradeTier; label: string; hint: string }[] = [
    { key: 'gem',  label: mp.filters.gradeRanges.gem,  hint: mp.filters.gradeRangeHints.gem },
    { key: 'high', label: mp.filters.gradeRanges.high, hint: mp.filters.gradeRangeHints.high },
    { key: 'mid',  label: mp.filters.gradeRanges.mid,  hint: mp.filters.gradeRangeHints.mid },
    { key: 'low',  label: mp.filters.gradeRanges.low,  hint: mp.filters.gradeRangeHints.low },
  ];

  const sortOptions: { key: MarketplaceSortKey; label: string }[] = [
    { key: 'newest',    label: mp.sortOptions.newest },
    { key: 'gradeHigh', label: mp.sortOptions.gradeHigh },
    { key: 'gradeLow',  label: mp.sortOptions.gradeLow },
    { key: 'priceHigh', label: mp.sortOptions.priceHigh },
    { key: 'priceLow',  label: mp.sortOptions.priceLow },
    { key: 'nameAZ',    label: mp.sortOptions.nameAZ },
  ];
  const activeSortLabel = sortOptions.find((opt) => opt.key === query.sort)?.label ?? mp.sortBy;

  const toggleCompany = (c: GradingCompany) => {
    const next = query.companies.includes(c)
      ? query.companies.filter((x) => x !== c)
      : [...query.companies, c];
    applyQuery({ ...query, companies: next, page: 1 });
  };

  const filterToolbar = !MARKETPLACE_IN_PROGRESS ? (
    <div className="marketplace-toolbar flex flex-col gap-3">
      <div className="collection-toolbar__head !mb-0">
        <p className="collection-toolbar__count">
          {loading ? (
            <span className="marketplace-toolbar__loading inline-flex items-center gap-2 text-text-muted">
              <span className="marketplace-toolbar__loading-dot" aria-hidden="true" />
              {mp.loadingLabel}
            </span>
          ) : (
            <>
              <strong>{total}</strong>
              {' '}
              {mp.resultsCount}
            </>
          )}
        </p>
        {hasActiveFilters ? (
          <button type="button" onClick={resetFilters} className="collection-action-pill text-xs">
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            {mp.filters.clearAll}
          </button>
        ) : null}
      </div>

      <div className="flex items-stretch gap-2 min-w-0">
        <div className="collection-toolbar__search flex-1">
          <Search className="collection-toolbar__search-icon" aria-hidden="true" />
          <label htmlFor="marketplace-search" className="sr-only">{mp.searchPlaceholder}</label>
          <input
            id="marketplace-search"
            type="text"
            inputMode="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                flushSearch();
              }
            }}
            onBlur={flushSearch}
            placeholder={mp.searchPlaceholder}
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="search"
            className="collection-toolbar__input !pr-11"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-9 min-w-9 inline-flex items-center justify-center text-text-muted hover:text-text-primary"
              aria-label={mp.filters.clearSearch}
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSort((v) => !v); }}
            className="collection-action-pill"
            aria-expanded={showSort}
            aria-haspopup="listbox"
          >
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline max-w-[9rem] truncate">{activeSortLabel}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {showSort ? (
            <div
              className="absolute right-0 mt-2 w-52 bg-surface-panel border border-border-default shadow-[2px_2px_0_var(--border-default)] overflow-hidden z-50"
              role="listbox"
              aria-label={mp.sortBy}
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={query.sort === opt.key}
                  onClick={() => { applyQuery({ ...query, sort: opt.key, page: 1 }); setShowSort(false); }}
                  className={`w-full text-left px-4 py-3 min-h-11 text-sm font-mono uppercase tracking-[0.06em] transition-colors ${
                    query.sort === opt.key
                      ? 'bg-accent-structural text-surface-bg'
                      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="marketplace-filter-row flex flex-nowrap items-stretch gap-2 min-w-0">
        <div
          className="collection-filter-pills collection-filter-pills--scroll marketplace-company-pills overflow-x-auto"
          role="group"
          aria-label={mp.card.company}
        >
          <button
            type="button"
            className="collection-filter-pill"
            aria-pressed={query.companies.length === 0}
            onClick={() => applyQuery({ ...query, companies: [], page: 1 })}
          >
            {mp.filters.allCompanies}
          </button>
          {companies.map((c) => {
            const style = getCompanyStyle(c);
            const active = query.companies.includes(c);
            return (
              <button
                key={c}
                type="button"
                className="collection-filter-pill marketplace-company-pill"
                data-company={c}
                aria-pressed={active}
                onClick={() => toggleCompany(c)}
                style={active ? {
                  background: style.background,
                  color: style.color,
                  boxShadow: style.shadow,
                } : undefined}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div
          className="collection-filter-pills collection-filter-pills--scroll overflow-x-auto"
          role="group"
          aria-label={mp.card.grade}
        >
          <button
            type="button"
            className="collection-filter-pill"
            aria-pressed={query.grade == null}
            onClick={() => applyQuery({ ...query, grade: null, page: 1 })}
          >
            {mp.filters.allGrades}
          </button>
          {gradeTiers.map((tier) => (
            <button
              key={tier.key}
              type="button"
              className="collection-filter-pill"
              title={tier.hint}
              aria-label={tier.hint}
              aria-pressed={query.grade === tier.key}
              onClick={() => applyQuery({ ...query, grade: query.grade === tier.key ? null : tier.key, page: 1 })}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  useSubHeader(filterToolbar ? { content: filterToolbar, contentWidth: 'page' } : null);


return (
    <div className="flex flex-col bg-surface-bg min-h-dvh overflow-x-clip">
      {MARKETPLACE_IN_PROGRESS ? (
        <ServiceAvailabilityBanner copy={mp.availability} />
      ) : null}

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-8 pb-4 md:pt-10 md:pb-5 overflow-hidden border-b border-border-default">
        <div className="relative container-custom z-10">
          <div className="max-w-3xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-1000" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)' }}>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-primary leading-[1.2] tracking-tight mb-2">{mp.title}</h1>

            {/* Short visible AEO line — full aeoAnswer lives in page JSON-LD */}
            <p className="marketplace-aeo-answer text-text-secondary text-xs sm:text-sm leading-snug max-w-xl mb-3">
              {mp.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#consign"
                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-md bg-surface-raised border border-border-default hover:border-border-strong hover:bg-surface-raised text-text-secondary hover:text-text-primary text-xs font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200"
              >
                <TagIcon className="w-3.5 h-3.5" />
                {mp.hero.linkConsign}
              </a>
              <a
                href="#consign"
                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-md bg-surface-raised border border-border-default hover:border-border-strong hover:bg-surface-raised text-text-secondary hover:text-text-primary text-xs font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {mp.hero.linkBuyingGuide}
              </a>
              <LocalLink
                href="/products/psa-protectors"
                className="hidden sm:inline-flex items-center gap-2 min-h-11 px-4 rounded-md bg-surface-raised border border-border-default hover:border-border-strong hover:bg-surface-raised text-text-secondary hover:text-text-primary text-xs font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200"
              >
                <Shield className="w-3.5 h-3.5" />
                {mp.hero.linkProtectors}
              </LocalLink>
              <LocalLink
                href="/tools/card-centering"
                className="hidden md:inline-flex items-center gap-2 min-h-11 px-4 rounded-md bg-surface-raised border border-border-default hover:border-border-strong hover:bg-surface-raised text-text-secondary hover:text-text-primary text-xs font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200"
              >
                <Gauge className="w-3.5 h-3.5" />
                {mp.hero.linkCentering}
              </LocalLink>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ RESULTS HEADER ═══════════ */}
      {!MARKETPLACE_IN_PROGRESS && <div className="container-custom pt-4 md:pt-6 pb-2 flex items-center justify-between">
        {loading ? (
          <p className="marketplace-toolbar__loading inline-flex items-center gap-2 text-sm text-text-muted" aria-live="polite">
            <span className="marketplace-toolbar__loading-dot" aria-hidden="true" />
            {mp.loadingLabel}
          </p>
        ) : !error ? (
          <p className="text-text-muted text-sm">
            <span className="text-accent-brand font-bold">{total}</span> {mp.resultsCount}
          </p>
        ) : (
          <span />
        )}
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-text-muted hover:text-accent-brand transition-colors flex items-center gap-1.5">
            <X className="w-3 h-3" />{mp.emptyState.reset}
          </button>
        )}
      </div>}

      {/* ═══════════ CARD GRID ═══════════ */}
      <section className="container-custom py-6 flex-1">
        {MARKETPLACE_IN_PROGRESS ? (
          <div className="panel px-5 py-6 md:px-6 md:py-8 max-w-2xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary mb-2">Status</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {mp.availability.gridNote}
            </p>
          </div>
        ) : loading ? (
          <MarketplaceGridSkeleton label={mp.loadingLabel} count={10} />
        ) : error ? (
        /* Error state */
          <div className="panel max-w-md mx-auto px-5 py-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-none bg-accent-danger/10 border border-accent-danger/25 flex items-center justify-center mb-4">
              <X className="w-6 h-6 text-accent-danger" />
            </div>
            <h3 className="text-text-primary text-lg font-semibold mb-2">{t.common.error}</h3>
            <p className="text-text-muted text-sm mb-6 max-w-sm">{error}</p>
          </div>
        ) : displayItems.length > 0 ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {displayItems.map((item, i) => {
              const { tileImage, tileName, tileCompany, tileGrade, tileIsBlackLabel, tileSet, tileNumber, tileYear, parentCard, isSubCard, bundleTotal } = item;
              const gradeColor = getGradeColor(tileGrade, tileIsBlackLabel);
              const companyStyle = getCompanyStyle(tileCompany);
              const isBundle = bundleTotal > 1;
              const tileSrc = marketplaceImageSrc(tileImage);

              return (
                <div
                  key={item.key}
                  className="group relative panel overflow-hidden cursor-pointer transition-[border-color,box-shadow,transform] duration-300 hover:border-accent-brand/45 min-w-0"
                  style={{ animation: `fadeUp 0.4s ease-out ${i * 40}ms both` }}
                  onClick={() => setSelectedCard(parentCard)}
                >
                  {/* Image area */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-raised">
                    {tileSrc && (
                      <Image
                        src={tileSrc}
                        alt={`${tileName} – ${tileCompany} ${tileGrade}${tileIsBlackLabel ? ' Black Label' : ''} graded card`}
                        fill
                        className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                    )}

                    {/* RIGHT-SIDE badge column — company + grade stacked */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
                      {/* Grading company */}
                      <div
                        className="h-6 px-2.5 flex items-center justify-center rounded-none text-sm font-black leading-none tabular-nums border border-border-default"
                        style={{ background: companyStyle.background, color: companyStyle.color, boxShadow: companyStyle.shadow }}
                      >
                        {tileCompany}
                      </div>
                      {/* Grade score */}
                      <div className={`min-w-[32px] px-2 py-1.5 flex flex-col items-center justify-center rounded-none border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
                        {tileIsBlackLabel && <span className="text-xs font-black text-accent-brand leading-none mb-0.5">BL</span>}
                        <span className="text-sm font-black leading-none tabular-nums">{tileGrade}</span>
                      </div>
                    </div>

                    {/* Bundle badge — bottom left */}
                    {isBundle && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
                        <div className="h-6 flex items-center gap-1 px-2 rounded-none bg-accent-cta text-accent-cta-ink border border-border-strong">
                          <Layers className="w-3 h-3" />
                          <span className="text-xs font-extrabold uppercase tracking-wider leading-none">{mp.bundle.fullSet}</span>
                        </div>
                        <div className="h-6 flex items-center px-1.5 border border-border-default bg-surface-bg/80">
                          <span className="text-xs font-bold text-text-primary leading-none">
                            {isSubCard
                              ? `${(parentCard.bundleCards?.findIndex(bc => bc.name === tileName) ?? -1) + 2}/${bundleTotal}`
                              : `1/${bundleTotal}`
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Sold overlay — gold to signal "price realized" prestige */}
                    {parentCard.sold && (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center z-10">
                        <div className="px-4 py-1.5 border border-accent-brand/50 bg-accent-brand/90">
                          <span className="text-surface-bg text-xs font-bold uppercase tracking-wider">{mp.card.sold}</span>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay — golden CTA pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-accent-cta text-accent-cta-ink rounded-none text-xs font-bold border border-border-strong transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        {mp.card.viewDetails}
                      </div>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="px-3.5 pt-2.5 pb-3">
                    <h3 className="text-text-primary font-bold text-sm leading-snug mb-0.5 truncate group-hover:text-accent-brand transition-colors duration-200">
                      {tileName}
                    </h3>
                    <p className="text-text-muted text-xs truncate mb-2 leading-tight">
                      {tileYear}{tileSet ? ` · ${tileSet}` : ''}
                    </p>

                    {/* Price + WhatsApp action */}
                    <div className="flex items-center justify-between gap-2">
                      {parentCard.sold ? (
                        <span className="text-xs font-bold text-accent-brand/70 uppercase tracking-wider">{mp.card.sold}</span>
                      ) : (
                        <span className="text-text-primary text-sm font-semibold tabular-nums">{formatPrice(parentCard.price, parentCard.currency)}</span>
                      )}
                      {!parentCard.sold && (
                        <div className="min-h-11 min-w-11 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors duration-200">
                          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-3 mt-10" aria-label={mp.filters.page}>
              <button
                type="button"
                disabled={query.page <= 1}
                onClick={() => applyQuery({ ...query, page: query.page - 1 })}
                className="min-h-11 px-4 rounded-lg border border-border-default text-sm text-text-secondary disabled:opacity-40"
              >
                {mp.filters.prev}
              </button>
              <span className="text-sm text-text-muted">
                {mp.filters.page} {query.page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={query.page >= totalPages}
                onClick={() => applyQuery({ ...query, page: query.page + 1 })}
                className="min-h-11 px-4 rounded-lg border border-border-default text-sm text-text-secondary disabled:opacity-40"
              >
                {mp.filters.next}
              </button>
            </nav>
          )}
        </>
        ) : (
          <div className="panel max-w-md mx-auto px-5 py-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary mb-3">Empty</p>
            <div className="w-12 h-12 mx-auto rounded-none bg-surface-raised border border-border-default flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-text-secondary" />
            </div>
            <h3 className="text-text-primary text-base font-semibold mb-2">{mp.emptyState.title}</h3>
            <p className="text-text-secondary text-sm mb-5 max-w-sm mx-auto">{mp.emptyState.description}</p>
            <button onClick={resetFilters} className="btn btn-secondary">
              {mp.emptyState.reset}
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ TRADING GUIDE & FAQ ═══════════ */}
      <TradingGuide guide={guide} registerActivate={(fn) => { activateCommissionRef.current = fn; }} />

      {/* ═══════════ WHY APPAW ═══════════ */}
      <WhyAppaw labels={mp} onSeeCommission={handleSeeCommission} />

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section ref={ctaRef} className="border-t border-border-default bg-surface-panel">
        <div className="container-custom py-12 md:py-16">
          <div className="panel max-w-3xl mx-auto text-center px-6 py-8 md:py-10 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-1000"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(24px)' }}>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary leading-[1.1] mb-3">{mp.ctaBanner.title}</h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-xl mx-auto">{mp.ctaBanner.description}</p>
              <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em]">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                {mp.ctaBanner.button}
              </a>
          </div>
        </div>
      </section>

      {/* ═══════════ DETAIL MODAL ═══════════ */}
      {!MARKETPLACE_IN_PROGRESS && selectedCard && (
        <CardDetailModal card={selectedCard} labels={mp} onClose={() => setSelectedCard(null)} />
      )}

    </div>
  );
}
