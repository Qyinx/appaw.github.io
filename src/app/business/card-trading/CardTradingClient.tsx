'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, X, MessageCircle, Package, Eye, ExternalLink, Hash, Globe, Tag, ZoomIn, Layers, Loader2, Share2, Check, ShoppingBag, Tag as TagIcon, Shield } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import { useCards } from '@/hooks/useCards';
import { getGradeColor, getCompanyStyle, formatPrice, formatGrade } from '@/lib/card-helpers';
import type { TradingCard, GradingCompany, GradeTier } from '@/types/trading-card';

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */

function getGradeTier(grade: number): GradeTier {
  if (grade >= 10) return 'gem';
  if (grade >= 8)  return 'high';
  if (grade >= 5)  return 'mid';
  return 'low';
}

/* ──────────────────────────────────────────
   Trading Guide + FAQ
   ────────────────────────────────────────── */
function TradingGuide({ guide }: { guide: ReturnType<typeof useLanguage>['t']['tradingGuide'] }) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const side = activeTab === 'buy' ? guide.buy : guide.sell;
  const tabAccent = activeTab === 'buy' ? '#d4a843' : '#818cf8';
  const tabAccentRgb = activeTab === 'buy' ? '212,168,67' : '129,140,248';

  return (
    <section id="consign" className="py-24 bg-[#09090f] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,168,67,0.04),transparent)]" />

      <div className="container-custom relative">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
            <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{guide.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white leading-[1.1] mb-4">{guide.title}</h2>
          <p className="text-[#9ca3af] text-base leading-relaxed">{guide.subtitle}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-12">
          <button
            onClick={() => { setActiveTab('buy'); setOpenFaq(null); }}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
            style={activeTab === 'buy'
              ? { background: `rgba(212,168,67,0.15)`, color: '#d4a843', boxShadow: `inset 0 0 0 1px rgba(212,168,67,0.3)` }
              : { color: 'rgba(255,255,255,0.4)' }
            }
          >
            <ShoppingBag className="w-4 h-4" />
            {guide.buyTab}
          </button>
          <button
            onClick={() => { setActiveTab('sell'); setOpenFaq(null); }}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
            style={activeTab === 'sell'
              ? { background: `rgba(129,140,248,0.12)`, color: '#818cf8', boxShadow: `inset 0 0 0 1px rgba(129,140,248,0.25)` }
              : { color: 'rgba(255,255,255,0.4)' }
            }
          >
            <TagIcon className="w-4 h-4" />
            {guide.sellTab}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Rules list */}
          <div>
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-6 h-px" style={{ background: tabAccent }} />
              {side.title}
            </h3>
            <div className="space-y-4">
              {side.rules.map((rule, i) => (
                <div
                  key={i}
                  className="group flex gap-5 p-5 rounded-2xl border transition-all duration-300 hover:border-opacity-60"
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
                    <p className="text-white font-semibold text-sm mb-1.5" style={{ color: 'white' }}>{rule.heading}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{rule.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ accordion */}
          <div>
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-6 h-px bg-white/20" />
              {side.faq.title}
            </h3>
            <div className="space-y-2">
              {side.faq.items.map((item, i) => {
                const isCommission = item.a.includes('%');
                return (
                  <div key={i} className="border border-white/[0.07] rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-white/80 text-sm font-medium leading-snug">{item.q}</span>
                      <ChevronDown
                        className="flex-shrink-0 w-4 h-4 text-white/30 transition-transform duration-300"
                        style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openFaq === i ? (isCommission ? '700px' : '200px') : '0px', opacity: openFaq === i ? 1 : 0 }}
                    >
                      <p className="px-5 pt-1 pb-3 text-white/50 text-sm leading-relaxed">{item.a}</p>
                      {isCommission && (
                        <div className="px-5 pb-6">
                          <p className="text-white/25 text-[9px] uppercase tracking-[0.2em] text-center mb-4">Commission Rate by Sale Price</p>
                          {/*
                            Apex (140,8) → Base y=252, half-width=120 → (20,252)–(260,252)
                            Slope: right_x = 140 + (y−8)×120/244   left_x = mirror
                            Tiers: y=8–57, 59–108, 110–159, 161–210, 212–252  (1px gap)
                            Leader dots at right-edge midpoint of each tier
                          */}
                          <svg viewBox="0 0 380 272" className="w-full max-w-[380px] mx-auto block">
                            {/* Pyramid bands */}
                            <polygon points="140,8 116,57 164,57"                   fill="rgba(212,168,67,0.42)" stroke="rgba(212,168,67,0.68)" strokeWidth="1" strokeLinejoin="round" />
                            <polygon points="115,59 165,59 189,108 91,108"          fill="rgba(212,168,67,0.31)" stroke="rgba(212,168,67,0.50)" strokeWidth="1" />
                            <polygon points="90,110 190,110 214,159 66,159"         fill="rgba(212,168,67,0.21)" stroke="rgba(212,168,67,0.37)" strokeWidth="1" />
                            <polygon points="65,161 215,161 239,210 41,210"         fill="rgba(212,168,67,0.13)" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
                            <polygon points="40,212 240,212 260,252 20,252"         fill="rgba(212,168,67,0.07)" stroke="rgba(212,168,67,0.16)" strokeWidth="1" />

                            {/* T1 — mid_y=32, right_x=152 */}
                            <circle cx="152" cy="32" r="2.5" fill="#d4a843" fillOpacity="0.6" />
                            <line x1="154" y1="32" x2="268" y2="32" stroke="rgba(212,168,67,0.25)" strokeWidth="0.8" strokeDasharray="3,2.5" />
                            <text x="272" y="28" fill="#d4a843" fontSize="11.5" fontWeight="bold" fontFamily="inherit">4.25%</text>
                            <text x="272" y="40" fill="rgba(212,168,67,0.62)" fontSize="7.5" fontFamily="inherit">≥ HK$50,000</text>

                            {/* T2 — mid_y=83, right_x=177 */}
                            <circle cx="177" cy="83" r="2.5" fill="#d4a843" fillOpacity="0.6" />
                            <line x1="179" y1="83" x2="268" y2="83" stroke="rgba(212,168,67,0.25)" strokeWidth="0.8" strokeDasharray="3,2.5" />
                            <text x="272" y="79" fill="#d4a843" fontSize="11.5" fontWeight="bold" fontFamily="inherit">4.5%</text>
                            <text x="272" y="91" fill="rgba(212,168,67,0.62)" fontSize="7.5" fontFamily="inherit">HK$10,000–49,999</text>

                            {/* T3 — mid_y=134, right_x=202 */}
                            <circle cx="202" cy="134" r="2.5" fill="#d4a843" fillOpacity="0.6" />
                            <line x1="204" y1="134" x2="268" y2="134" stroke="rgba(212,168,67,0.25)" strokeWidth="0.8" strokeDasharray="3,2.5" />
                            <text x="272" y="130" fill="#d4a843" fontSize="11.5" fontWeight="bold" fontFamily="inherit">5.25%</text>
                            <text x="272" y="142" fill="rgba(212,168,67,0.62)" fontSize="7.5" fontFamily="inherit">HK$2,000–9,999</text>

                            {/* T4 — mid_y=185, right_x=227 */}
                            <circle cx="227" cy="185" r="2.5" fill="#d4a843" fillOpacity="0.6" />
                            <line x1="229" y1="185" x2="268" y2="185" stroke="rgba(212,168,67,0.25)" strokeWidth="0.8" strokeDasharray="3,2.5" />
                            <text x="272" y="181" fill="#d4a843" fontSize="11.5" fontWeight="bold" fontFamily="inherit">6%</text>
                            <text x="272" y="193" fill="rgba(212,168,67,0.62)" fontSize="7.5" fontFamily="inherit">HK$1,000–1,999</text>

                            {/* T5 — mid_y=232, right_x=250 */}
                            <circle cx="250" cy="232" r="2.5" fill="#d4a843" fillOpacity="0.6" />
                            <line x1="252" y1="232" x2="268" y2="232" stroke="rgba(212,168,67,0.25)" strokeWidth="0.8" strokeDasharray="3,2.5" />
                            <text x="272" y="228" fill="#d4a843" fontSize="11.5" fontWeight="bold" fontFamily="inherit">7%</text>
                            <text x="272" y="240" fill="rgba(212,168,67,0.62)" fontSize="7.5" fontFamily="inherit">{'< HK$1,000 · min HK$50'}</text>

                            {/* Footnote */}
                            <text x="140" y="265" textAnchor="middle" fill="rgba(255,255,255,0.17)" fontSize="7" fontFamily="inherit">On final agreed sale price • No upfront fees</text>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Detail Modal
   ────────────────────────────────────────── */
function CardDetailModal({ card, labels, onClose }: { card: TradingCard; labels: ReturnType<typeof useLanguage>['t']['cardMarketplace']; onClose: () => void }) {
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
      { name: card.name, image: card.image ?? '', imageBack: card.imageBack, company: card.company, grade: card.grade, isBlackLabel: card.isBlackLabel, set: card.set, number: card.number, year: card.year, certNumber: card.certNumber },
      ...card.bundleCards,
    ];
  }, [isBundle, card]);

  // Active card resolved from allInBundle — all fields update when selection changes
  const activeCard = useMemo(() => {
    if (isBundle && allInBundle.length > 0) {
      const bc = allInBundle[selectedBundleIdx] ?? allInBundle[0];
      return { name: bc.name, image: bc.image || '', imageBack: bc.imageBack, company: bc.company, grade: bc.grade, isBlackLabel: bc.isBlackLabel, set: bc.set, number: bc.number, year: bc.year ?? card.year, certNumber: bc.certNumber };
    }
    return { name: card.name, image: card.image || '', imageBack: card.imageBack, company: card.company, grade: card.grade, isBlackLabel: card.isBlackLabel, set: card.set, number: card.number, year: card.year, certNumber: card.certNumber };
  }, [isBundle, allInBundle, selectedBundleIdx, card]);

  const gradeColor = getGradeColor(activeCard.grade, activeCard.isBlackLabel);
  const companyStyle = getCompanyStyle(activeCard.company);
  const hasBack = !!activeCard.imageBack;

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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Panel */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl animate-[fadeUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top-right actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Copy link */}
          <button onClick={handleCopyLink}
            title={labels.detail?.copyLink ?? 'Copy link'}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white'
            }`}>
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
          {/* Open full page — carries ?card=N so the detail page pre-selects the right card */}
          <Link href={`/business/card-trading/${card.id}/${selectedBundleIdx > 0 ? `?card=${selectedBundleIdx}` : ''}`}
            title={labels.detail?.viewPage ?? 'View full page'}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all">
            <ExternalLink className="w-4 h-4" />
          </Link>
          {/* Close */}
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          {/* Left — Image with front/back toggle */}
          <div className="relative bg-gradient-to-br from-white/[0.04] to-transparent p-4 md:p-6 flex flex-col items-center justify-center min-h-[450px] md:min-h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 rounded-full bg-[#d4a843]/5 blur-3xl" />
            </div>

            {/* Card image with 3D flip + magnifier */}
            <div
              ref={imgContainerRef}
              className="relative w-full aspect-[3/4] max-w-[480px] md:cursor-crosshair"
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
                  <Image src={getImagePath(activeCard.image)} alt={`${activeCard.name} – ${activeCard.company} ${activeCard.grade}${activeCard.isBlackLabel ? ' Black Label' : ''} front`} fill
                    className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="480px" />
                </div>
                {/* Back */}
                {hasBack && (
                  <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <Image src={getImagePath(activeCard.imageBack!)} alt={`${activeCard.name} – ${activeCard.company} ${activeCard.grade}${activeCard.isBlackLabel ? ' Black Label' : ''} back`} fill
                      className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" sizes="480px" />
                  </div>
                )}
              </div>
            </div>

            {/* Zoom hint */}
            <div className="hidden md:flex items-center gap-1.5 mt-3 text-white/20 text-[10px] select-none">
              <ZoomIn className="w-3 h-3" />
              <span>Hover to zoom</span>
            </div>

            {/* Front / Back toggle */}
            {hasBack && (
              <div className="relative mt-5 flex items-center bg-white/[0.06] rounded-full p-0.5">
                <button
                  onClick={() => setShowBack(false)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
                    !showBack ? 'text-[#09090f]' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {labels.modal.front}
                </button>
                <button
                  onClick={() => setShowBack(true)}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 ${
                    showBack ? 'text-[#09090f]' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {labels.modal.back}
                </button>
                {/* Sliding highlight pill */}
                <div
                  className="absolute top-0.5 h-[calc(100%-4px)] rounded-full bg-[#d4a843] transition-all duration-300"
                  style={{
                    width: 'calc(50% - 2px)',
                    left: showBack ? 'calc(50% + 2px)' : '2px',
                  }}
                />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5">
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
                  <span className="text-[10px] font-extrabold leading-none">{labels.bundle.fullSet}</span>
                </div>
              )}
            </div>


          </div>

          {/* Right — Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-[#d4a843] text-[10px] uppercase tracking-[0.2em] font-medium mb-2">{labels.modal.details}</p>
            <h2 className="text-2xl font-bold text-white mb-1 font-display">{activeCard.name}</h2>
            <p className="text-white/30 text-sm mb-4">
              {activeCard.set && <>{activeCard.set}</>}
              {activeCard.number && <> · {activeCard.number}</>}
            </p>

            {/* Full Set indicator */}
            {isBundle && card.bundleCards && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/25">
                  <Layers className="w-3.5 h-3.5 text-[#d4a843]" />
                  <span className="text-[#d4a843] text-xs font-bold">{labels.bundle.fullSet} · {allInBundle.length} {labels.bundle.cards}</span>
                </div>
                <span className="text-white/25 text-[10px] italic">{labels.bundle.setOnly}</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-[#d4a843]/8 border border-[#d4a843]/20 rounded-xl p-4 mb-5">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">{isBundle ? labels.bundle.setPrice : labels.card.price}</p>
              <p className="text-[#d4a843] text-2xl font-bold font-display">{formatPrice(card.price, card.currency)}</p>
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

            {/* Bundle card list — uses allInBundle so idx matches thumbnail strip and activeCard */}
            {isBundle && allInBundle.length > 0 && (
              <div className="mb-5">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3">{labels.bundle.cardsInSet}</p>
                <div className="flex flex-col gap-1.5">
                  {allInBundle.map((bc, idx) => {
                    const bcGrade = getGradeColor(bc.grade, bc.isBlackLabel);
                    const bcCompany = getCompanyStyle(bc.company);
                    const isActive = idx === selectedBundleIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => { setSelectedBundleIdx(idx); setShowBack(false); }}
                        className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl transition-all duration-200 text-left overflow-hidden ${
                          isActive
                            ? 'bg-[#d4a843]/[0.07] shadow-[inset_0_0_0_1px_rgba(212,168,67,0.14)]'
                            : 'bg-white/[0.025] hover:bg-white/[0.05]'
                        }`}
                      >
                        {/* Left accent bar */}
                        <div className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full transition-all duration-200 ${isActive ? 'bg-[#d4a843]' : 'bg-transparent'}`} />

                        {/* Thumbnail */}
                        <div className={`relative flex-shrink-0 w-10 h-[52px] rounded-lg overflow-hidden transition-all duration-200 ${
                          isActive
                            ? 'ring-1 ring-[#d4a843]/50 shadow-[0_0_14px_rgba(212,168,67,0.18)]'
                            : 'ring-1 ring-white/[0.07]'
                        }`}>
                          {bc.image && <Image src={getImagePath(bc.image)} alt={bc.name} fill className="object-contain p-0.5" sizes="40px" />}
                        </div>

                        {/* Name + meta */}
                        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                          <span className={`text-[11px] font-semibold truncate leading-tight transition-colors ${
                            isActive ? 'text-white' : 'text-white/55'
                          }`}>{bc.name}</span>
                          {(bc.set || bc.number) && (
                            <span className="text-[9px] text-white/25 truncate leading-tight">
                              {[bc.set, bc.number].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </div>

                        {/* Stacked badges */}
                        <div className="flex flex-col items-end gap-[5px] flex-shrink-0">
                          <div
                            className="h-[15px] px-1.5 flex items-center justify-center rounded text-[7px] font-bold leading-none"
                            style={{ background: bcCompany.background, color: bcCompany.color }}
                          >{bc.company}</div>
                          <div className={`h-[15px] px-1.5 flex items-center justify-center gap-0.5 rounded text-[8px] font-black leading-none ${bcGrade.bg} ${bcGrade.text} border ${bcGrade.border}`}>
                            {bc.isBlackLabel && <span className="text-[5px] font-bold text-[#d4a843]">BL</span>}
                            {bc.grade}
                          </div>
                        </div>

                        {/* Open this specific card on the full detail page */}
                        <Link
                          href={`/business/card-trading/${card.id}/${idx > 0 ? `?card=${idx}` : ''}`}
                          onClick={e => e.stopPropagation()}
                          title={labels.detail?.viewPage ?? 'View full page'}
                          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-all duration-200 ${
                            isActive
                              ? 'bg-[#d4a843]/20 text-[#d4a843] hover:bg-[#d4a843]/30'
                              : 'bg-white/[0.04] text-white/20 hover:bg-white/[0.08] hover:text-white/50'
                          }`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inquire CTA */}
            {card.sold ? (
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-bold uppercase tracking-[0.1em]">
                  <span>{labels.card.soldOut}</span>
                </div>
                <Link href="/business/card-trading/" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-xs font-medium transition-all">
                  <span>{labels.card.similarItems}</span>
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
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] text-sm font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)] mt-auto"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>{labels.card.inquire}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Fixed magnifier lens — pixel-based positioning for accurate edge/corner viewing */}
      {magnifier.active && (
        <div
          className="pointer-events-none fixed rounded-full border-2 border-[#d4a843]/50 shadow-[0_0_24px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(0,0,0,0.2)] overflow-hidden z-[60]"
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

/* ──────────────────────────────────────────
   Main Component
   ────────────────────────────────────────── */
export default function CardTradingPage({ initialCards }: { initialCards?: TradingCard[] }) {
  const { t } = useLanguage();
  const mp = t.cardMarketplace;
  const guide = t.tradingGuide;

  // Data — seeded from server at build time, optionally refreshed from API
  const { cards: allCards, loading, error } = useCards(initialCards);

  // Filters
  const [search, setSearch]               = useState('');
  const [companyFilter, setCompanyFilter] = useState<GradingCompany | null>(null);
  const [gradeFilter, setGradeFilter]     = useState<GradeTier | null>(null);
  const [sortBy, setSortBy]               = useState<'newest' | 'gradeHigh' | 'gradeLow' | 'priceHigh' | 'priceLow' | 'nameAZ'>('newest');
  const [showSort, setShowSort]           = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Modal
  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);

  // Scroll reveal
  const [heroVisible, setHeroVisible] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => { const timer = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(timer); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setCtaVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  // Close sort dropdown
  useEffect(() => {
    if (!showSort) return;
    const handler = () => setShowSort(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showSort]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let cards = [...allCards];

    if (search.trim()) {
      const q = search.toLowerCase();
      cards = cards.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.set && c.set.toLowerCase().includes(q)) ||
        (c.number && c.number.toLowerCase().includes(q)) ||
        c.year.toString().includes(q) ||
        (c.bundleCards && c.bundleCards.some((bc: { name: string }) => bc.name.toLowerCase().includes(q)))
      );
    }

    if (companyFilter) cards = cards.filter(c => c.company === companyFilter);

    if (gradeFilter) {
      cards = cards.filter(c => getGradeTier(c.grade) === gradeFilter);
    }

    switch (sortBy) {
      case 'newest':    cards.sort((a, b) => b.year - a.year || b.grade - a.grade); break;
      case 'gradeHigh': cards.sort((a, b) => b.grade - a.grade); break;
      case 'gradeLow':  cards.sort((a, b) => a.grade - b.grade); break;
      case 'priceHigh': cards.sort((a, b) => b.price - a.price); break;
      case 'priceLow':  cards.sort((a, b) => a.price - b.price); break;
      case 'nameAZ':    cards.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return cards;
  }, [allCards, search, companyFilter, gradeFilter, sortBy]);

  // Flatten bundles — each card in a bundle gets its own grid tile.
  // Sub-card tiles open the parent card's modal so the buyer sees the full set.
  const displayItems = useMemo(() => {
    type DisplayItem = {
      key: string;
      tileImage: string;
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
    filtered.forEach(card => {
      const bundleTotal = card.bundleCards?.length ? card.bundleCards.length + 1 : 1;
      // Main card tile
      items.push({
        key: card.id,
        tileImage: card.image || card.bundleCards?.[0]?.image || '',
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
      // Sub-card tiles
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
  }, [filtered]);

  const hasActiveFilters = !!search || !!companyFilter || !!gradeFilter;
  const resetFilters = useCallback(() => { setSearch(''); setCompanyFilter(null); setGradeFilter(null); }, []);

  const companies: GradingCompany[] = ['PSA', 'BGS', 'CGC'];
  const gradeTiers: { key: GradeTier; label: string }[] = [
    { key: 'gem',  label: mp.filters.gradeRanges.gem },
    { key: 'high', label: mp.filters.gradeRanges.high },
    { key: 'mid',  label: mp.filters.gradeRanges.mid },
    { key: 'low',  label: mp.filters.gradeRanges.low },
  ];

  const sortOptions: { key: typeof sortBy; label: string }[] = [
    { key: 'newest',    label: mp.sortOptions.newest },
    { key: 'gradeHigh', label: mp.sortOptions.gradeHigh },
    { key: 'gradeLow',  label: mp.sortOptions.gradeLow },
    { key: 'priceHigh', label: mp.sortOptions.priceHigh },
    { key: 'priceLow',  label: mp.sortOptions.priceLow },
    { key: 'nameAZ',    label: mp.sortOptions.nameAZ },
  ];

  return (
    <div className="flex flex-col bg-[#09090f]">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,rgba(212,168,67,0.08),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />

        <div className="relative container-custom z-10">
          <div className="max-w-4xl transition-all duration-1000" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)' }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{mp.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white leading-[1.1] tracking-tight mb-4">{mp.title}</h1>

            {/* Subtitle */}
            <p className="text-[#9ca3af] text-sm md:text-base leading-relaxed max-w-2xl mb-6">{mp.subtitle}</p>

            {/* Quick-nav links */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] mr-1">{mp.hero.explore}</span>
              <Link
                href="/products/psa-protectors"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#d4a843]/35 hover:bg-[#d4a843]/[0.06] text-white/55 hover:text-[#d4a843] text-xs font-medium transition-all duration-200"
              >
                <Shield className="w-3.5 h-3.5" />
                {mp.hero.linkProtectors}
              </Link>
              <a
                href="#consign"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#d4a843]/35 hover:bg-[#d4a843]/[0.06] text-white/55 hover:text-[#d4a843] text-xs font-medium transition-all duration-200"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {mp.hero.linkBuyingGuide}
              </a>
              <a
                href="#consign"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#d4a843]/35 hover:bg-[#d4a843]/[0.06] text-white/55 hover:text-[#d4a843] text-xs font-medium transition-all duration-200"
              >
                <TagIcon className="w-3.5 h-3.5" />
                {mp.hero.linkConsign}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY FILTER BAR ═══════════ */}
      <div className="sticky top-16 z-30 bg-[#09090f]/95 backdrop-blur-xl border-y border-white/[0.06]">
        <div className="container-custom py-4">

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={mp.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4a843]/50 focus:ring-1 focus:ring-[#d4a843]/20 transition-all" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="w-px h-8 bg-white/[0.08]" />

            {/* Company chips */}
            <div className="flex items-center gap-2">
              <button onClick={() => setCompanyFilter(null)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${!companyFilter ? 'bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/30' : 'text-white/70 border border-white/[0.15] hover:border-white/30 hover:text-white'}`}
              >{mp.filters.allCompanies}</button>
              {companies.map(c => {
                const style = getCompanyStyle(c);
                const active = companyFilter === c;
                return (
                  <button key={c} onClick={() => setCompanyFilter(active ? null : c)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${active ? 'border-transparent' : 'text-white/70 border-white/[0.15] hover:border-white/30 hover:text-white'}`}
                    style={active ? { background: style.background, color: style.color, boxShadow: style.shadow } : undefined}
                  >{c}</button>
                );
              })}
            </div>

            <div className="w-px h-8 bg-white/[0.08]" />

            {/* Grade tiers */}
            <div className="flex items-center gap-2">
              {gradeTiers.map(tier => {
                const active = gradeFilter === tier.key;
                return (
                  <button key={tier.key} onClick={() => setGradeFilter(active ? null : tier.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border whitespace-nowrap ${active ? 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30' : 'text-white/70 border-white/[0.15] hover:border-white/30 hover:text-white'}`}
                  >{tier.label}</button>
                );
              })}
            </div>

            <div className="flex-1" />

            {/* Sort */}
            <div className="relative">
              <button onClick={e => { e.stopPropagation(); setShowSort(v => !v); }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs text-white/70 border border-white/[0.15] hover:border-white/30 hover:text-white transition-all">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{mp.sortBy}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-52 bg-[#16161f] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {sortOptions.map(opt => (
                    <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-3 text-xs transition-colors ${sortBy === opt.key ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'}`}
                    >{opt.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={mp.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4a843]/50 transition-all" />
              </div>
              <button onClick={() => setMobileFilters(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border transition-all ${mobileFilters || hasActiveFilters ? 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30' : 'text-white/50 border-white/[0.08]'}`}>
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />}
              </button>
            </div>

            {mobileFilters && (
              <div className="space-y-4 pb-2 border-t border-white/[0.06] pt-4 animate-[fadeUp_0.3s_ease-out]">
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2">{mp.card.company}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCompanyFilter(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!companyFilter ? 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30' : 'text-white/70 border-white/[0.15]'}`}
                    >{mp.filters.allCompanies}</button>
                    {companies.map(c => {
                      const style = getCompanyStyle(c);
                      return (
                        <button key={c} onClick={() => setCompanyFilter(companyFilter === c ? null : c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${companyFilter === c ? 'border-transparent' : 'text-white/70 border-white/[0.15]'}`}
                          style={companyFilter === c ? { background: style.background, color: style.color, boxShadow: style.shadow } : undefined}
                        >{c}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2">{mp.card.grade}</p>
                  <div className="flex flex-wrap gap-2">
                    {gradeTiers.map(tier => (
                      <button key={tier.key} onClick={() => setGradeFilter(gradeFilter === tier.key ? null : tier.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${gradeFilter === tier.key ? 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30' : 'text-white/70 border-white/[0.15]'}`}
                      >{tier.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2">{mp.sortBy}</p>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map(opt => (
                      <button key={opt.key} onClick={() => setSortBy(opt.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortBy === opt.key ? 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30' : 'text-white/70 border-white/[0.15]'}`}
                      >{opt.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ RESULTS HEADER ═══════════ */}
      <div className="container-custom pt-8 pb-2 flex items-center justify-between">
        {!loading && !error && (
          <p className="text-white/30 text-sm">
            <span className="text-[#d4a843] font-bold">{displayItems.length}</span> {mp.resultsCount}
          </p>
        )}
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-white/30 hover:text-[#d4a843] transition-colors flex items-center gap-1.5">
            <X className="w-3 h-3" />{mp.emptyState.reset}
          </button>
        )}
      </div>

      {/* ═══════════ CARD GRID ═══════════ */}
      <section className="container-custom py-6 flex-1">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="aspect-[3/4] bg-white/[0.04]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/[0.06] rounded w-3/4" />
                  <div className="h-2 bg-white/[0.04] rounded w-1/2" />
                  <div className="h-4 bg-white/[0.06] rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <X className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">{t.common.error}</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm">{error}</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && displayItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {displayItems.map((item, i) => {
              const { tileImage, tileName, tileCompany, tileGrade, tileIsBlackLabel, tileSet, tileNumber, tileYear, parentCard, isSubCard, bundleTotal } = item;
              const gradeColor = getGradeColor(tileGrade, tileIsBlackLabel);
              const companyStyle = getCompanyStyle(tileCompany);
              const isBundle = bundleTotal > 1;

              return (
                <div
                  key={item.key}
                  className="group relative bg-gradient-to-b from-[#141420] to-[#0d0d15] border border-white/[0.07] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#d4a843]/45 hover:shadow-[0_8px_40px_rgba(212,168,67,0.13)]"
                  style={{ animation: `fadeUp 0.4s ease-out ${i * 40}ms both` }}
                  onClick={() => setSelectedCard(parentCard)}
                >
                  {/* Image area */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Ambient inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-[#d4a843]/[0.015] pointer-events-none" />

                    {tileImage && (
                      <Image
                        src={getImagePath(tileImage)}
                        alt={`${tileName} – ${tileCompany} ${tileGrade}${tileIsBlackLabel ? ' Black Label' : ''} graded card`}
                        fill
                        className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-700"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                    )}

                    {/* Bottom gradient fade into info panel */}
                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0d0d15] to-transparent pointer-events-none" />

                    {/* RIGHT-SIDE badge column — company + grade stacked */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
                      {/* Grading company */}
                      <div
                        className="h-6 px-2.5 flex items-center justify-center rounded-lg text-[11px] font-black leading-none shadow-lg"
                        style={{ background: companyStyle.background, color: companyStyle.color, boxShadow: companyStyle.shadow }}
                      >
                        {tileCompany}
                      </div>
                      {/* Grade score */}
                      <div className={`min-w-[32px] px-2 py-1.5 flex flex-col items-center justify-center rounded-lg border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.glow} ${gradeColor.border}`}>
                        {tileIsBlackLabel && <span className="text-[6px] font-black text-[#d4a843] leading-none mb-0.5">BL</span>}
                        <span className="text-[11px] font-black leading-none">{tileGrade}</span>
                      </div>
                    </div>

                    {/* Bundle badge — bottom left */}
                    {isBundle && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
                        <div className="h-6 flex items-center gap-1 px-2 rounded-md bg-[#d4a843] text-[#09090f] shadow-[0_2px_8px_rgba(212,168,67,0.4)]">
                          <Layers className="w-3 h-3" />
                          <span className="text-[9px] font-extrabold uppercase tracking-wider leading-none">{mp.bundle.fullSet}</span>
                        </div>
                        <div className="h-6 flex items-center px-1.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
                          <span className="text-[9px] font-bold text-white leading-none">
                            {isSubCard
                              ? `${(parentCard.bundleCards?.findIndex(bc => bc.name === tileName) ?? -1) + 2}/${bundleTotal}`
                              : `1/${bundleTotal}`
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Sold overlay */}
                    {parentCard.sold && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <div className="px-4 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm border border-red-400/30">
                          <span className="text-white text-xs font-bold uppercase tracking-wider">{mp.card.sold}</span>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay — golden CTA pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#d4a843] text-[#09090f] rounded-full text-[11px] font-bold transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-[0_4px_20px_rgba(212,168,67,0.45)]">
                        <Eye className="w-3.5 h-3.5" />
                        {mp.card.viewDetails}
                      </div>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="px-3.5 pt-2.5 pb-3">
                    <h3 className="text-white font-bold text-sm leading-snug mb-0.5 truncate group-hover:text-[#d4a843] transition-colors duration-200">
                      {tileName}
                    </h3>
                    <p className="text-white/30 text-[11px] truncate mb-3 leading-tight">
                      {tileYear}{tileSet ? ` · ${tileSet}` : ''}
                    </p>

                    {/* Price + WhatsApp action */}
                    <div className="flex items-center justify-between">
                      {parentCard.sold ? (
                        <span className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider">{mp.card.sold}</span>
                      ) : (
                        <span className="text-white/50 text-xs">{mp.card.inquire} →</span>
                      )}
                      {!parentCard.sold && (
                        <div className="w-7 h-7 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors duration-200">
                          <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 text-[#25D366]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6">
              <Package className="w-7 h-7 text-white/20" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">{mp.emptyState.title}</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm">{mp.emptyState.description}</p>
            <button onClick={resetFilters} className="px-6 py-2.5 rounded-lg bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#d4a843] text-sm font-medium hover:bg-[#d4a843]/25 transition-all">
              {mp.emptyState.reset}
            </button>
          </div>
        ) : null}
      </section>

      {/* ═══════════ TRADING GUIDE & FAQ ═══════════ */}
      <TradingGuide guide={guide} />

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section ref={ctaRef} className="border-t border-white/[0.06] bg-gradient-to-b from-[#09090f] to-[#0d0d15]">
        <div className="container-custom py-20">
          <div className="relative max-w-3xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(24px)' }}>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#d4a843]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/30 rounded-full px-5 py-2 mb-8">
                <MessageCircle className="w-3.5 h-3.5 text-[#d4a843]" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.2em] font-medium">Get in Touch</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white leading-[1.1] mb-4">{mp.ctaBanner.title}</h2>
              <p className="text-[#9ca3af] text-base leading-relaxed mb-10 max-w-xl mx-auto">{mp.ctaBanner.description}</p>
              <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.35)]">
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                {mp.ctaBanner.button}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ DETAIL MODAL ═══════════ */}
      {selectedCard && (
        <CardDetailModal card={selectedCard} labels={mp} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
