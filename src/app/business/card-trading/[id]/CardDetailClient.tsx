'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Hash, Globe, Tag, ExternalLink, ZoomIn, Layers, Share2, Check, ShieldOff, Clock } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
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
        image: card.image ?? '',
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
        image: bc.image || '',
        imageBack: bc.imageBack,
        company: bc.company,
        grade: bc.grade,
        isBlackLabel: bc.isBlackLabel,
      };
    }
    return {
      name: card.name,
      image: card.image || '',
      imageBack: card.imageBack,
      company: card.company,
      grade: card.grade,
      isBlackLabel: card.isBlackLabel,
    };
  }, [isBundle, allInBundle, selectedBundleIdx, card]);

  const gradeColor = getGradeColor(activeCard.grade, activeCard.isBlackLabel);
  const companyStyle = getCompanyStyle(activeCard.company);
  const hasBack = !!activeCard.imageBack;

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

  return (
    <div className="bg-[#09090f]">

      {/* ═══ Top bar ═══ */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#09090f]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container-custom flex items-center justify-between py-3">
          <Link
            href="/business/card-trading/"
            className="flex items-center gap-2 text-white/50 hover:text-[#d4a843] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{mp.detail?.backToMarketplace ?? 'Back to Marketplace'}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Card name breadcrumb — desktop only */}
            <span className="hidden md:block text-white/25 text-xs truncate max-w-[200px]">{card.name}</span>

            {/* Sold indicator in top bar */}
            {card.sold && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldOff className="w-3 h-3" />
                {mp.card.sold}
              </span>
            )}

            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.06] text-white/50 hover:text-white border border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? (mp.detail?.linkCopied ?? 'Link Copied!') : (mp.detail?.shareLink ?? 'Share Link')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Main content ═══ */}
      <div>
        <div className="container-custom py-6 md:py-10 pb-12 md:pb-16">
          <div className="grid md:grid-cols-[1fr_1fr] lg:grid-cols-[5fr_4fr] gap-8 md:gap-12 max-w-6xl mx-auto">

            {/* ── Left: Image viewer ── */}
            <div className="relative">
              {/* Card container with padding for badges */}
              <div className="relative bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 md:p-6 overflow-hidden">
                {/* Glow — muted for sold cards */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-64 h-64 rounded-full blur-3xl ${card.sold ? 'bg-white/[0.02]' : 'bg-[#d4a843]/5'}`} />
                </div>

                {/* Badges — inside padded container */}
                <div className="relative flex items-center gap-1.5 mb-4 z-10">
                  <div
                    className="h-7 min-w-[40px] flex items-center justify-center px-2.5 rounded-md"
                    style={{ background: companyStyle.background, color: companyStyle.color, boxShadow: companyStyle.shadow }}
                  >
                    <span className="text-[11px] font-bold leading-none">{activeCard.company}</span>
                  </div>
                  <div className={`h-7 min-w-[40px] flex items-center justify-center gap-1 px-2.5 rounded-md ${gradeColor.bg} ${gradeColor.text} ${gradeColor.glow} border ${gradeColor.border}`}>
                    {activeCard.isBlackLabel && <span className="text-[8px] font-bold text-[#d4a843] leading-none">BL</span>}
                    <span className="text-[11px] font-black leading-none">{activeCard.grade}</span>
                  </div>
                  {isBundle && (
                    <div className="flex items-center gap-1 px-2.5 h-7 rounded-md bg-[#d4a843] text-[#09090f]">
                      <Layers className="w-3 h-3" />
                      <span className="text-[10px] font-extrabold leading-none">{mp.bundle.fullSet}</span>
                    </div>
                  )}
                  {/* Sold badge inline with other badges */}
                  {card.sold && (
                    <div className="flex items-center gap-1 px-2.5 h-7 rounded-md bg-red-500/90 text-white">
                      <span className="text-[10px] font-extrabold uppercase leading-none">{mp.card.sold}</span>
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
                      <Image src={getImagePath(activeCard.image)} alt={`${activeCard.name} front`} fill
                        className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="(max-width: 768px) 90vw, 520px" priority />
                    </div>
                    {/* Back */}
                    {hasBack && (
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <Image src={getImagePath(activeCard.imageBack!)} alt={`${activeCard.name} back`} fill
                          className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="(max-width: 768px) 90vw, 520px" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls row — zoom hint + flip toggle */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {/* Zoom hint */}
                  <div className="hidden md:flex items-center gap-1.5 text-white/20 text-[10px] select-none">
                    <ZoomIn className="w-3 h-3" />
                    <span>Hover to zoom</span>
                  </div>

                  {/* Front / Back toggle */}
                  {hasBack && (
                    <div className="relative flex items-center bg-white/[0.06] rounded-full p-0.5">
                      <button
                        onClick={() => setShowBack(false)}
                        className={`relative z-10 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
                          !showBack ? 'text-[#09090f]' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {mp.modal.front}
                      </button>
                      <button
                        onClick={() => setShowBack(true)}
                        className={`relative z-10 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
                          showBack ? 'text-[#09090f]' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {mp.modal.back}
                      </button>
                      <div
                        className="absolute top-0.5 h-[calc(100%-4px)] rounded-full bg-[#d4a843] transition-all duration-300"
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
                      return (
                        <button
                          key={idx}
                          onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                          className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            active
                              ? 'border-[#d4a843] shadow-[0_0_12px_rgba(212,168,67,0.4)]'
                              : 'border-white/10 hover:border-white/25 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {bc.image && <Image src={getImagePath(bc.image)} alt={bc.name} fill className="object-contain p-1" sizes="64px" />}
                          {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a843]" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-center text-white/25 text-[10px] mt-1.5">{selectedBundleIdx + 1} / {allInBundle.length}</p>
                </div>
              )}
            </div>

            {/* ── Right: Info panel ── */}
            <div className="flex flex-col md:py-2">
              <p className="text-[#d4a843] text-[10px] uppercase tracking-[0.2em] font-medium mb-2">{mp.modal.details}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display">{card.name}</h1>
              <p className="text-white/30 text-sm mb-5">
                {card.set && <>{card.set}</>}
                {card.number && <> · {card.number}</>}
              </p>

              {/* Full Set indicator */}
              {isBundle && card.bundleCards && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/25">
                    <Layers className="w-3.5 h-3.5 text-[#d4a843]" />
                    <span className="text-[#d4a843] text-xs font-bold">{mp.bundle.fullSet} · {allInBundle.length} {mp.bundle.cards}</span>
                  </div>
                  <span className="text-white/25 text-[10px] italic">{mp.bundle.setOnly}</span>
                </div>
              )}

              {/* Price */}
              <div className={`rounded-xl p-4 mb-5 border ${card.sold ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#d4a843]/8 border-[#d4a843]/20'}`}>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">{isBundle ? mp.bundle.setPrice : mp.card.price}</p>
                <div className="flex items-center gap-3">
                  <p className={`text-2xl md:text-3xl font-bold font-display ${card.sold ? 'text-white/25 line-through' : 'text-[#d4a843]'}`}>{formatPrice(card.price, card.currency)}</p>
                  {card.sold && (
                    <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      {mp.card.sold}
                    </span>
                  )}
                </div>
              </div>

              {/* Info table */}
              <div className="space-y-0 mb-5">
                {infoRows.map((row, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/20">{row.icon}</span>
                    <span className="text-white/40 text-xs flex-shrink-0 w-20">{row.label}</span>
                    <span className="text-white text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Created / Updated dates — same row style as info table */}
              {(card.createdAt || card.updatedAt) && (
                <div className="mb-5">
                  {card.createdAt && (
                    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04]">
                      <span className="text-white/20"><Clock className="w-3.5 h-3.5" /></span>
                      <span className="text-white/40 text-xs flex-shrink-0 w-20">Listed</span>
                      <time dateTime={card.createdAt} className="text-white text-sm font-medium">
                        {new Date(card.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                    </div>
                  )}
                  {card.updatedAt && card.updatedAt !== card.createdAt && (
                    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04]">
                      <span className="text-white/20"><Clock className="w-3.5 h-3.5" /></span>
                      <span className="text-white/40 text-xs flex-shrink-0 w-20">Updated</span>
                      <time dateTime={card.updatedAt} className="text-white text-sm font-medium">
                        {new Date(card.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </time>
                    </div>
                  )}
                </div>
              )}

              {/* Bundle card list — uses allInBundle so idx matches thumbnail strip and activeCard */}
              {isBundle && allInBundle.length > 0 && (
                <div className="mb-5">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2">{mp.bundle.cardsInSet}</p>
                  <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                    {allInBundle.map((bc, idx) => {
                      const bcGrade = getGradeColor(bc.grade, bc.isBlackLabel);
                      const bcCompany = getCompanyStyle(bc.company);
                      const isActive = idx === selectedBundleIdx;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all text-left border-b border-white/[0.04] last:border-b-0 ${
                            isActive ? 'bg-[#d4a843]/[0.06]' : 'bg-transparent hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className={`text-[10px] font-mono w-4 text-center flex-shrink-0 ${isActive ? 'text-[#d4a843]' : 'text-white/20'}`}>{idx + 1}</span>
                          <div className={`relative w-7 h-9 flex-shrink-0 rounded overflow-hidden transition-all ${isActive ? 'ring-1 ring-[#d4a843]/40' : 'ring-1 ring-white/[0.06]'}`}>
                            {bc.image && <Image src={getImagePath(bc.image)} alt={bc.name} fill className="object-contain p-0.5" sizes="28px" />}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>{bc.name}</span>
                            {(bc.set || bc.number) && (
                              <span className="text-[9px] text-white/20 truncate">
                                {[bc.set, bc.number].filter(Boolean).join(' · ')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="h-[18px] px-1.5 flex items-center justify-center rounded text-[7px] font-bold leading-none"
                              style={{ background: bcCompany.background, color: bcCompany.color }}>{bc.company}</div>
                            <div className={`h-[18px] px-1.5 flex items-center justify-center gap-0.5 rounded text-[8px] font-black leading-none ${bcGrade.bg} ${bcGrade.text} border ${bcGrade.border}`}>
                              {bc.isBlackLabel && <span className="text-[5px] font-bold text-[#d4a843]">BL</span>}
                              {bc.grade}
                            </div>
                          </div>
                          {isActive && <div className="w-1 h-4 rounded-full bg-[#d4a843] flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              {card.sold ? (
                <div className="space-y-3">
                  {/* Sold banner */}
                  <div className="rounded-xl bg-red-500/[0.08] border border-red-500/20 p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <ShieldOff className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-bold">{mp.card.soldOut}</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">{mp.card.soldDescription}</p>
                  </div>

                  {/* Ask about similar via WhatsApp */}
                  <a
                    href={`https://wa.me/85292851189?text=${encodeURIComponent(
                      `Hi, I see the ${card.name} (${card.company}) is sold. Do you have similar cards available?`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] text-white/70 hover:text-white text-sm font-medium transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" />
                    <span>{mp.card.askSimilar}</span>
                  </a>

                  {/* Browse marketplace */}
                  <Link
                    href="/business/card-trading/"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white/40 hover:text-[#d4a843] text-xs font-medium transition-all"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{mp.card.similarItems}</span>
                  </Link>
                </div>
              ) : (
                <a
                  href={`https://wa.me/85292851189?text=${encodeURIComponent(
                    isBundle
                      ? `Hi, I'd like to make an offer for the full set: ${card.name} (${card.bundleCards?.length} cards, ${card.company}, ${card.year})\nListed price: ${formatPrice(card.price, card.currency)}\nCard link: https://appaw.store/business/card-trading/${card.id}/\nMy offer: `
                      : `Hi, I'd like to make an offer for: ${card.name} (${card.company} ${formatGrade(card.grade, card.isBlackLabel)}, ${card.year})\nListed price: ${formatPrice(card.price, card.currency)}\nCard link: https://appaw.store/business/card-trading/${card.id}/\nMy offer: `
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] text-sm font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)]"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                  <span>{mp.card.inquire}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Magnifier lens ═══ */}
      {magnifier.active && (
        <div
          className="pointer-events-none fixed rounded-full border-2 border-[#d4a843]/50 shadow-[0_0_24px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(0,0,0,0.2)] overflow-hidden z-[60]"
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
              backgroundImage: `url(${getImagePath(showBack && hasBack ? activeCard.imageBack! : activeCard.image)})`,
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
