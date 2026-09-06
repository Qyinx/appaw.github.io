'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { ArrowLeft, Hash, Globe, Tag, ExternalLink, ZoomIn, Layers, Share2, Check, ShieldOff, Clock } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import { marketplaceImageSrc } from '@/lib/marketplace/cardImage';
import { getGradeColor, getCompanyStyle, formatPrice, formatGrade } from '@/lib/card-helpers';
import type { TradingCard } from '@/types/trading-card';

/* ──────────────────────────────────────────
   Individual Card Detail Page (Client)
   ──────────────────────────────────────────
   Full-page card view with image viewer,
   3D flip, magnifier, bundle support,
   share button and WhatsApp CTA.
   ────────────────────────────────────────── */

export default function CardDetailClient({ card }: { card: TradingCard }) {
  const { t } = useLanguage();
  const mp = t.cardMarketplace;
  const isBundle = !!(card.bundleCards && card.bundleCards.length > 0);

  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState(false);

  // Read ?card=N on mount — links from the modal pre-select a specific bundle card
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get('card') ?? '0', 10);
    if (!isNaN(idx) && idx > 0) setSelectedBundleIdx(idx);
  }, []);

  // Canonical ordered array: main card is always idx 0, sub-cards follow.
  // All three consumers (activeCard, thumbnail strip, Cards in This Set) must use THIS array.
  const allInBundle = useMemo(() => {
    if (!isBundle || !card.bundleCards) return [];
    return [
      {
        name: card.name,
        image: card.image,
        imageBack: card.imageBack,
        company: card.company,
        grade: card.grade,
        isBlackLabel: card.isBlackLabel,
        set: card.set,
        number: card.number,
        certNumber: card.certNumber,
      },
      ...card.bundleCards,
    ];
  }, [isBundle, card]);

  // Active card data — resolved from allInBundle by selectedBundleIdx
  const activeCard = useMemo(() => {
    if (isBundle && allInBundle.length > 0) {
      const bc = allInBundle[selectedBundleIdx] ?? allInBundle[0];
      return {
        name: bc.name,
        image: bc.image,
        imageBack: bc.imageBack,
        company: bc.company,
        grade: bc.grade,
        isBlackLabel: bc.isBlackLabel,
      };
    }
    return {
      name: card.name,
      image: card.image,
      imageBack: card.imageBack,
      company: card.company,
      grade: card.grade,
      isBlackLabel: card.isBlackLabel,
    };
  }, [isBundle, allInBundle, selectedBundleIdx, card]);

  const gradeColor = getGradeColor(activeCard.grade, activeCard.isBlackLabel);
  const companyStyle = getCompanyStyle(activeCard.company);
  const frontSrc = marketplaceImageSrc(activeCard.image);
  const backSrc = marketplaceImageSrc(activeCard.imageBack);
  const hasBack = !!backSrc;
  const lensSrc = showBack && hasBack ? backSrc : frontSrc;

  /* ── Magnifier ── */
  const LENS = 180;
  const ZOOM = 3;
  const [magnifier, setMagnifier] = useState<{
    active: boolean; pageX: number; pageY: number;
    bgX: number; bgY: number; bgW: number; bgH: number;
  }>({ active: false, pageX: 0, pageY: 0, bgX: 0, bgY: 0, bgW: 0, bgH: 0 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const bgW = rect.width * ZOOM;
    const bgH = rect.height * ZOOM;
    const bgX = LENS / 2 - rx * bgW;
    const bgY = LENS / 2 - ry * bgH;
    setMagnifier({ active: true, pageX: e.clientX, pageY: e.clientY, bgX, bgY, bgW, bgH });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier({ active: false, pageX: 0, pageY: 0, bgX: 0, bgY: 0, bgW: 0, bgH: 0 });
  }, []);

  /* ── Share ── */
  const handleCopyLink = useCallback(() => {
    const base = window.location.origin + window.location.pathname;
    const url = (isBundle && selectedBundleIdx > 0)
      ? `${base}?card=${selectedBundleIdx}`
      : base;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [isBundle, selectedBundleIdx]);

  /* ── Info rows ── */
  const infoRows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Tag className="w-3.5 h-3.5" />, label: mp.card.company, value: isBundle ? card.company : activeCard.company },
    { icon: <Hash className="w-3.5 h-3.5" />, label: mp.card.grade, value: isBundle && card.bundleCards
      ? `${Math.min(card.grade, ...card.bundleCards.map(bc => bc.grade))}–${Math.max(card.grade, ...card.bundleCards.map(bc => bc.grade))}`
      : formatGrade(activeCard.grade, activeCard.isBlackLabel) },
    { icon: <Hash className="w-3.5 h-3.5" />, label: mp.card.year, value: String(card.year) },
    ...(card.set ? [{ icon: <ExternalLink className="w-3.5 h-3.5" />, label: mp.card.set, value: card.set }] : []),
    ...(card.number ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: mp.card.number, value: card.number }] : []),
    ...(card.language ? [{ icon: <Globe className="w-3.5 h-3.5" />, label: mp.card.language, value: card.language }] : []),
    ...(card.certNumber ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: mp.card.cert, value: card.certNumber }] : []),
  ];

  useSubHeader({
    leading: (
      <LocalLink
        href="/business/card-trading/"
        className="flex items-center gap-2 text-text-secondary hover:text-accent-warn text-sm transition-colors min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{mp.detail?.backToMarketplace ?? 'Back to Marketplace'}</span>
      </LocalLink>
    ),
    center: (
      <span className="hidden md:block text-text-muted text-xs truncate max-w-[200px]">{card.name}</span>
    ),
    trailing: (
      <div className="flex items-center gap-3">
        {card.sold && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldOff className="w-3 h-3" aria-hidden="true" />
            {mp.card.sold}
          </span>
        )}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-[color,background-color,border-color,opacity,transform] min-h-[44px] ${
            copied
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-surface-raised text-text-secondary hover:text-text-primary border border-border-default hover:border-border-strong'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Share2 className="w-3.5 h-3.5" aria-hidden="true" />}
          <span className="hidden sm:inline">{copied ? (mp.detail?.linkCopied ?? 'Link Copied!') : (mp.detail?.shareLink ?? 'Share Link')}</span>
        </button>
      </div>
    ),
  });

  return (
    <div className="bg-surface-bg min-h-dvh overflow-x-clip">

      {/* ═══ Main content ═══ */}
      <div>
        <div className="container-custom py-6 md:py-10 pb-12 md:pb-16">
          <div className="grid md:grid-cols-[1fr_1fr] lg:grid-cols-[5fr_4fr] gap-8 md:gap-12 max-w-6xl mx-auto">

            {/* ── Left: Image viewer ── */}
            <div className="relative">
              {/* Card container with padding for badges */}
              <div className="relative panel p-4 md:p-6 overflow-hidden min-w-0 bg-surface-panel">
                {/* Badges — inside padded container */}
                <div className="relative flex items-center gap-1.5 mb-4 z-10">
                  <div
                    className="h-7 min-w-[40px] flex items-center justify-center px-2.5 rounded-md"
                    style={{ background: companyStyle.background, color: companyStyle.color, boxShadow: companyStyle.shadow }}
                  >
                    <span className="text-xs font-bold leading-none">{activeCard.company}</span>
                  </div>
                  <div className={`h-7 min-w-[40px] flex items-center justify-center gap-1 px-2.5 rounded-md ${gradeColor.bg} ${gradeColor.text} ${gradeColor.glow} border ${gradeColor.border}`}>
                    {activeCard.isBlackLabel && <span className="text-xs font-bold text-[#d4a843] leading-none">BL</span>}
                    <span className="text-xs font-black leading-none">{activeCard.grade}</span>
                  </div>
                  {isBundle && (
                    <div className="flex items-center gap-1 px-2.5 h-7 rounded-md bg-accent-warn text-[#09090f]">
                      <Layers className="w-3 h-3" />
                      <span className="text-xs font-extrabold leading-none">{mp.bundle.fullSet}</span>
                    </div>
                  )}
                  {/* Sold badge inline with other badges */}
                  {card.sold && (
                    <div className="flex items-center gap-1 px-2.5 h-7 rounded-md bg-red-500/90 text-white">
                      <span className="text-xs font-extrabold uppercase leading-none">{mp.card.sold}</span>
                    </div>
                  )}
                </div>

                {/* Card image with 3D flip + magnifier */}
                <div
                  ref={imgContainerRef}
                  className={`relative w-full aspect-[3/4] max-w-[520px] mx-auto ${card.sold ? 'cursor-default' : 'md:cursor-crosshair'}`}
                  style={{ perspective: '400px' }}
                  onMouseMove={card.sold ? undefined : handleMouseMove}
                  onMouseLeave={card.sold ? undefined : handleMouseLeave}
                >
                  {/* Sold diagonal ribbon */}
                  {card.sold && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg">
                      <div className="absolute top-[40px] -right-[60px] w-[260px] bg-red-500/90 text-white text-xs font-black uppercase tracking-[0.25em] text-center py-2 rotate-45 shadow-[0_2px_12px_rgba(239,68,68,0.5)]">
                        {mp.card.sold}
                      </div>
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  )}
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
                        <Image src={frontSrc} alt={`${activeCard.name} front`} fill
                          className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="(max-width: 768px) 90vw, 520px" priority />
                      )}
                    </div>
                    {/* Back */}
                    {hasBack && backSrc && (
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <Image src={backSrc} alt={`${activeCard.name} back`} fill
                          className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="(max-width: 768px) 90vw, 520px" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls row — zoom hint + flip toggle */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {/* Zoom hint */}
                  <div className="hidden md:flex items-center gap-1.5 text-text-muted text-xs select-none">
                    <ZoomIn className="w-3 h-3" />
                    <span>Hover to zoom</span>
                  </div>

                  {/* Front / Back toggle — selected text contrasts pill (same as modal) */}
                  {hasBack && (
                    <div className="relative flex items-center bg-surface-raised border border-border-default rounded-none p-0.5">
                      <button
                        type="button"
                        aria-pressed={!showBack}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowBack(false)}
                        className={`relative z-10 px-4 py-1.5 rounded-none text-xs font-medium min-h-11 transition-[color,background-color,border-color,opacity,transform] duration-300 ${
                          !showBack ? 'text-surface-bg' : 'text-text-muted hover:text-text-primary/60'
                        }`}
                      >
                        {mp.modal.front}
                      </button>
                      <button
                        type="button"
                        aria-pressed={showBack}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowBack(true)}
                        className={`relative z-10 px-4 py-1.5 rounded-none text-xs font-medium min-h-11 transition-[color,background-color,border-color,opacity,transform] duration-300 ${
                          showBack ? 'text-surface-bg' : 'text-text-muted hover:text-text-primary/60'
                        }`}
                      >
                        {mp.modal.back}
                      </button>
                      <div
                        className="absolute top-0.5 h-[calc(100%-4px)] rounded-none bg-accent-structural transition-[color,background-color,border-color,opacity,transform] duration-300 pointer-events-none"
                        style={{ width: 'calc(50% - 2px)', left: showBack ? 'calc(50% + 2px)' : '2px' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bundle thumbnail strip — uses allInBundle so idx matches activeCard */}
              {isBundle && allInBundle.length > 0 && (
                <div className="mt-4 px-4 md:px-6">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {allInBundle.map((bc, idx) => {
                      const active = idx === selectedBundleIdx;
                      const thumbSrc = marketplaceImageSrc(bc.image);
                      return (
                        <button
                          key={idx}
                          onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                          className={`relative flex-shrink-0 w-16 h-20 rounded-none overflow-hidden border-2 transition-[color,background-color,border-color,opacity,transform] duration-200 ${
                            active
                              ? 'border-accent-warn'
                              : 'border-border-default hover:border-border-strong opacity-60 hover:opacity-100'
                          }`}
                        >
                          {thumbSrc && <Image src={thumbSrc} alt={bc.name} fill className="object-contain p-1" sizes="64px" />}
                          {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-warn" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-center text-text-muted text-xs mt-1.5">{selectedBundleIdx + 1} / {allInBundle.length}</p>
                </div>
              )}
            </div>

            {/* ── Right: Info panel ── */}
            <div className="flex flex-col md:py-2">
              <p className="text-[#d4a843] text-xs uppercase tracking-[0.2em] font-medium mb-2">{mp.modal.details}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1 font-display">{card.name}</h1>
              <p className="text-text-muted text-sm mb-5">
                {card.set && <>{card.set}</>}
                {card.number && <> · {card.number}</>}
              </p>

              {/* Full Set indicator */}
              {isBundle && card.bundleCards && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-warn/10 border border-[#d4a843]/25">
                    <Layers className="w-3.5 h-3.5 text-[#d4a843]" />
                    <span className="text-[#d4a843] text-xs font-bold">{mp.bundle.fullSet} · {allInBundle.length} {mp.bundle.cards}</span>
                  </div>
                  <span className="text-text-muted text-xs italic">{mp.bundle.setOnly}</span>
                </div>
              )}

              {/* Price */}
              <div className={`rounded-none p-4 mb-5 border ${card.sold ? 'bg-surface-raised border-border-default' : 'bg-surface-raised border-accent-warn/30'}`}>
                <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-1">{isBundle ? mp.bundle.setPrice : mp.card.price}</p>
                <div className="flex items-center gap-3">
                  <p className={`text-2xl md:text-3xl font-bold font-display ${card.sold ? 'text-text-muted line-through' : 'text-[#d4a843]'}`}>{formatPrice(card.price, card.currency)}</p>
                  {card.sold && (
                    <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider">
                      {mp.card.sold}
                    </span>
                  )}
                </div>
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

              {/* Created / Updated dates — same row style as info table */}
              {(card.createdAt || card.updatedAt) && (
                <div className="mb-5">
                  {card.createdAt && (
                    <div className="flex items-center gap-3 py-2.5 border-b border-border-default">
                      <span className="text-text-muted"><Clock className="w-3.5 h-3.5" /></span>
                      <span className="text-text-muted text-xs flex-shrink-0 w-20">Listed</span>
                      <time dateTime={card.createdAt} className="text-text-primary text-sm font-medium">
                        {new Date(card.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                    </div>
                  )}
                  {card.updatedAt && card.updatedAt !== card.createdAt && (
                    <div className="flex items-center gap-3 py-2.5 border-b border-border-default">
                      <span className="text-text-muted"><Clock className="w-3.5 h-3.5" /></span>
                      <span className="text-text-muted text-xs flex-shrink-0 w-20">Updated</span>
                      <time dateTime={card.updatedAt} className="text-text-primary text-sm font-medium">
                        {new Date(card.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                    </div>
                  )}
                </div>
              )}

              {/* Bundle card list — uses allInBundle so idx matches thumbnail strip and activeCard */}
              {isBundle && allInBundle.length > 0 && (
                <div className="mb-5">
                  <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-2">{mp.bundle.cardsInSet}</p>
                  <div className="rounded-none border border-border-default overflow-hidden">
                    {allInBundle.map((bc, idx) => {
                      const bcGrade = getGradeColor(bc.grade, bc.isBlackLabel);
                      const bcCompany = getCompanyStyle(bc.company);
                      const isActive = idx === selectedBundleIdx;
                      const thumbSrc = marketplaceImageSrc(bc.image);
                      return (
                        <button
                          key={idx}
                          onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-[color,background-color,border-color,opacity,transform] text-left border-b border-border-default last:border-b-0 ${
                            isActive ? 'bg-surface-raised' : 'bg-transparent hover:bg-surface-raised'
                          }`}
                        >
                          <span className={`text-xs font-mono w-4 text-center flex-shrink-0 ${isActive ? 'text-[#d4a843]' : 'text-text-muted'}`}>{idx + 1}</span>
                          <div className={`relative w-7 h-9 flex-shrink-0 rounded-none overflow-hidden border transition-[color,background-color,border-color,opacity,transform] ${isActive ? 'border-accent-warn' : 'border-border-default'}`}>
                            {thumbSrc && <Image src={thumbSrc} alt={bc.name} fill className="object-contain p-0.5" sizes="28px" />}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{bc.name}</span>
                            {(bc.set || bc.number) && (
                              <span className="text-xs text-text-muted truncate">
                                {[bc.set, bc.number].filter(Boolean).join(' · ')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="h-[18px] px-1.5 flex items-center justify-center rounded text-xs font-bold leading-none"
                              style={{ background: bcCompany.background, color: bcCompany.color }}>{bc.company}</div>
                            <div className={`h-[18px] px-1.5 flex items-center justify-center gap-0.5 rounded text-xs font-black leading-none ${bcGrade.bg} ${bcGrade.text} border ${bcGrade.border}`}>
                              {bc.isBlackLabel && <span className="text-xs font-bold text-[#d4a843]">BL</span>}
                              {bc.grade}
                            </div>
                          </div>
                          {isActive && <div className="w-1 h-4 rounded-full bg-accent-warn flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA — sticky bottom with safe-area on mobile */}
              <div className="sticky bottom-0 -mx-5 md:-mx-8 mt-auto border-t border-border-default bg-surface-panel px-5 md:px-8 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
              {card.sold ? (
                <div className="space-y-3">
                  {/* Sold banner */}
                  <div className="rounded-none bg-accent-danger/10 border border-accent-danger/25 p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <ShieldOff className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-bold">{mp.card.soldOut}</span>
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed">{mp.card.soldDescription}</p>
                  </div>

                  {/* Ask about similar via WhatsApp */}
                  <a
                    href={`https://wa.me/85292851189?text=${encodeURIComponent(
                      `Hi, I see the ${card.name} (${card.company}) is sold. Do you have similar cards available?`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-secondary w-full min-h-11 py-3 text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" />
                    <span>{mp.card.askSimilar}</span>
                  </a>

                  {/* Browse marketplace */}
                  <LocalLink
                    href="/business/card-trading/"
                    className="flex items-center justify-center gap-2 w-full min-h-11 py-2.5 rounded-lg text-text-muted hover:text-accent-warn text-xs font-medium transition-[color,background-color,border-color,opacity,transform]"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{mp.card.similarItems}</span>
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
                  <span>{mp.card.inquire}</span>
                </a>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Magnifier lens ═══ */}
      {magnifier.active && lensSrc && (
        <div
          className="pointer-events-none fixed rounded-full border-2 border-border-strong shadow-[0_0_24px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(0,0,0,0.2)] overflow-hidden z-[60]"
          style={{
            width: LENS, height: LENS,
            left: magnifier.pageX, top: magnifier.pageY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: magnifier.bgW, height: magnifier.bgH,
              left: magnifier.bgX, top: magnifier.bgY,
              backgroundImage: `url(${lensSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      )}
    </div>
  );
}
