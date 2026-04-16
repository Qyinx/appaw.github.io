/* ─────────────────────────────────────────────────────
   REVAMPED — luxury editorial redesign (April 2026)
   • Split-screen hero with hover-expand interaction
   • Marquee brand strip
   • Ghost-numeral editorial service sections (01 / 02)
   • Trust-numbers bar
   • Dual-split CTA mirroring the hero
   ───────────────────────────────────────────────────── */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, ArrowRight, ArrowUpRight, Repeat, Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const MARQUEE_ITEMS = [
  'Protect Your Collection',
  'Trade With Confidence',
  'PSA · CGC · MTG · Pokémon',
  'Hong Kong Based',
  'Trusted by Collectors',
  'World-Class Aluminum Cases',
];

export default function BusinessClient() {
  const { t } = useLanguage();
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const [heroMounted,  setHeroMounted]  = useState(false);

  const service01Ref = useReveal();
  const trustRef     = useReveal();
  const service02Ref = useReveal();
  const ctaRef       = useReveal();

  /* Entrance delay */
  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col bg-[#09090f]">

      {/* ══════════════════════════════════════════
           §1  SPLIT-SCREEN HERO
      ══════════════════════════════════════════ */}
      <section
        className="relative flex flex-col md:flex-row overflow-hidden"
        style={{ height: 'calc(100dvh - 4rem)' }}
      >
        {/* ── Desktop-only centre divider (CSS-controlled, no JS) ── */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-1/2 z-20 w-px pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 5%, #d4a843 25%, #d4a843 75%, transparent 95%)',
            opacity: heroMounted ? 0.55 : 0,
            transition: 'opacity 1s ease 0.6s',
          }}
        />
        <div
          className="hidden md:flex absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#d4a843]/50 bg-[#09090f] items-center justify-center pointer-events-none"
          style={{
            opacity: heroMounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.7s',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />
        </div>

        {/* ── LEFT — PSA Protector ── */}
        <div
          className="relative overflow-hidden cursor-pointer flex-1"
          onMouseEnter={() => setHoveredSide('left')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0 bg-[#09090f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_75%,rgba(212,168,67,0.07),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_50%,rgba(212,168,67,0.09),transparent)]"
            style={{ opacity: hoveredSide === 'left' ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />

          <div className="relative h-full flex flex-col justify-between p-7 md:p-12 lg:p-14 z-10">
            {/* Top label */}
            <div
              className="flex items-center gap-3"
              style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? 'none' : 'translateY(-12px)', transition: 'all 0.8s ease 0.3s' }}
            >
              <span className="text-[#d4a843]/40 text-xs uppercase tracking-[0.35em] font-medium">01</span>
              <div className="w-6 h-px bg-[#d4a843]/25" />
              <span className="text-[#d4a843]/40 text-xs uppercase tracking-[0.2em]">Protection</span>
            </div>

            {/* Centre image */}
            <div className="flex-1 flex items-center justify-center py-4 relative">
              <span
                className="absolute font-serif font-bold select-none leading-none text-white/[0.022] pointer-events-none"
                style={{ fontSize: 'clamp(130px, 20vw, 360px)' }}
              >I</span>
              <div
                className="relative w-32 md:w-44 lg:w-52 aspect-[3/4]"
                style={{
                  transform: hoveredSide === 'left' ? 'scale(1.07) translateY(-6px)' : 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
                  filter: 'drop-shadow(0 20px 48px rgba(212,168,67,0.18))',
                }}
              >
                <Image
                  src={getImagePath('/images/cards/069.SM-P.refine.png')}
                  alt="PSA Card Aluminum Protector"
                  fill
                  className="object-contain"
                  sizes="208px"
                />
              </div>
            </div>

            {/* Bottom text + CTA */}
            <div style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? 'none' : 'translateY(14px)', transition: 'all 0.8s ease 0.55s' }}>
              <h2 className="font-display text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-white/30 text-xs md:text-sm leading-relaxed mb-5 max-w-xs">
                Aluminum alloy · UV-blocking glass · N52 magnets
              </p>
              <Link
                href="/products/psa-protectors"
                className="group inline-flex items-center gap-2 text-[#d4a843] text-xs font-semibold uppercase tracking-[0.25em] hover:gap-3.5 transition-all duration-300"
              >
                <span>View Product</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile horizontal divider */}
        <div className="md:hidden h-px flex-shrink-0 bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />

        {/* ── RIGHT — Card Trading ── */}
        <div
          className="relative overflow-hidden cursor-pointer flex-1"
          onMouseEnter={() => setHoveredSide('right')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="absolute inset-0 bg-[#09090f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_75%,rgba(129,140,248,0.07),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(129,140,248,0.1),transparent)]"
            style={{ opacity: hoveredSide === 'right' ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />

          <div className="relative h-full flex flex-col justify-between p-7 md:p-12 lg:p-14 z-10">
            {/* Top label — right-aligned */}
            <div
              className="flex items-center justify-end gap-3"
              style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? 'none' : 'translateY(-12px)', transition: 'all 0.8s ease 0.4s' }}
            >
              <span className="text-[#818cf8]/40 text-xs uppercase tracking-[0.2em]">Brokerage</span>
              <div className="w-6 h-px bg-[#818cf8]/25" />
              <span className="text-[#818cf8]/40 text-xs uppercase tracking-[0.35em] font-medium">02</span>
            </div>

            {/* Centre — card fan */}
            <div className="flex-1 flex items-center justify-center py-4 relative">
              <span
                className="absolute font-serif font-bold select-none leading-none text-white/[0.022] pointer-events-none"
                style={{ fontSize: 'clamp(90px, 14vw, 260px)' }}
              >II</span>
              <div className="relative w-40 md:w-48 h-40 md:h-48">
                {[
                  { src: '/images/cards/192.SV-P.refine.png', rotate: -13, x: -34, y: 8,  z: 1, sc: 0.86 },
                  { src: '/images/cards/105.SV-9.refine.png', rotate: 0,   x: 0,   y: 0,  z: 3, sc: 1    },
                  { src: '/images/cards/069.SM-P.refine.png', rotate: 13,  x: 34,  y: 8,  z: 2, sc: 0.86 },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-20 md:w-28 h-28 md:h-36 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                    style={{
                      transform: `translate(calc(-50% + ${card.x * (hoveredSide === 'right' ? 1.3 : 1)}px), calc(-50% + ${card.y}px)) rotate(${card.rotate * (hoveredSide === 'right' ? 1.2 : 1)}deg) scale(${card.sc * (hoveredSide === 'right' ? 1.07 : 1)})`,
                      zIndex: card.z,
                      transition: `transform 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 45}ms`,
                    }}
                  >
                    <Image src={getImagePath(card.src)} alt="Graded trading card" fill className="object-cover" sizes="112px" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom text + CTA — right-aligned */}
            <div
              className="text-right"
              style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? 'none' : 'translateY(14px)', transition: 'all 0.8s ease 0.65s' }}
            >
              <h2 className="font-display text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
                {t.business.cardTrading.title}
              </h2>
              <p className="text-white/30 text-xs md:text-sm leading-relaxed mb-5 max-w-xs ml-auto">
                Buy · Sell · Consign — PSA &amp; CGC graded cards
              </p>
              <Link
                href="/business/card-trading"
                className="group inline-flex items-center gap-2 text-[#818cf8] text-xs font-semibold uppercase tracking-[0.25em] hover:gap-3.5 transition-all duration-300"
              >
                <span>Start Trading</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#09090f] to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════
           §2  MARQUEE STRIP
      ══════════════════════════════════════════ */}
      <div className="relative border-y border-white/[0.05] py-3.5 overflow-hidden bg-[#09090f]">
        <div className="flex animate-[marquee_35s_linear_infinite] whitespace-nowrap will-change-transform">
          {[0, 1, 2].map((rep) => (
            <span key={rep} className="flex items-center shrink-0">
              {MARQUEE_ITEMS.map((text, j) => (
                <React.Fragment key={j}>
                  <span className="text-white/[0.18] text-[11px] uppercase tracking-[0.3em] px-8">{text}</span>
                  <span className="text-[#d4a843]/25 text-[9px]">◆</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
           §3  SERVICE 01 — PSA PROTECTOR
               Editorial layout: text | divider | visual
      ══════════════════════════════════════════ */}
      <section
        id="protector"
        ref={service01Ref.ref}
        className="relative py-28 md:py-36 overflow-hidden scroll-mt-20"
      >
        {/* Ghost numeral */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none" aria-hidden="true">
          <span
            className="font-serif font-bold leading-none text-white block"
            style={{
              fontSize: 'clamp(180px, 30vw, 500px)',
              opacity: service01Ref.visible ? 0.028 : 0,
              transform: service01Ref.visible ? 'translateX(-5%)' : 'translateX(-18%)',
              transition: 'opacity 1.4s ease, transform 1.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >01</span>
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-10 lg:gap-16 items-center">

            {/* TEXT */}
            <div
              style={{
                opacity: service01Ref.visible ? 1 : 0,
                transform: service01Ref.visible ? 'translateX(0)' : 'translateX(-36px)',
                transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-px bg-[#d4a843]" />
                <span className="text-[#d4a843] text-[11px] uppercase tracking-[0.35em]">Service 01 — Protection</span>
              </div>

              <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.06] mb-8">
                PSA Card<br />
                <em className="not-italic text-[#d4a843]">Aluminum</em><br />
                Protector
              </h2>

              <p className="text-[#5c626e] text-[15px] leading-relaxed mb-10 max-w-sm">
                {t.business.cardProtector.description}
              </p>

              {/* Spec chips */}
              <div className="flex flex-wrap gap-2 mb-12">
                {['Aluminum Alloy Frame', '>95% UV Glass', 'N52 Magnets', 'Standard 35PT Fit'].map((s) => (
                  <span key={s} className="px-3.5 py-1.5 border border-[#d4a843]/[0.18] text-[#d4a843]/55 text-[10px] uppercase tracking-[0.2em]">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-8">
                <Link
                  href="/products/psa-protectors"
                  className="group inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-[11px] uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:shadow-[0_0_48px_rgba(212,168,67,0.28)]"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>View Product</span>
                </Link>
                <a
                  href="https://appawstore.etsy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/[0.25] text-[11px] uppercase tracking-[0.2em] hover:text-white/50 transition-colors"
                >
                  <span>Etsy Shop</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* DIVIDER */}
            <div
              className="hidden lg:block h-full min-h-80 bg-gradient-to-b from-transparent via-[#d4a843]/[0.18] to-transparent self-stretch"
              style={{ opacity: service01Ref.visible ? 1 : 0, transition: 'opacity 1.2s ease 0.3s' }}
            />

            {/* VISUAL */}
            <div
              className="flex items-center justify-center relative"
              style={{
                opacity: service01Ref.visible ? 1 : 0,
                transform: service01Ref.visible ? 'translateY(0)' : 'translateY(36px)',
                transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s',
              }}
            >
              {/* Slow rotating rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-[#d4a843]/[0.07] animate-[spin_50s_linear_infinite]" />
                <div className="absolute w-52 h-52 rounded-full border border-[#d4a843]/[0.05] animate-[spin_32s_linear_infinite_reverse]" />
              </div>

              {/* Framed product card */}
              <div className="relative w-52 md:w-64 aspect-[3/4] border border-[#d4a843]/[0.12] bg-gradient-to-b from-[#131313] to-[#0b0b0b] shadow-[0_60px_120px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,168,67,0.08)]">
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#d4a843]/35" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#d4a843]/35" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#d4a843]/35" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#d4a843]/35" />
                <Image
                  src={getImagePath('/images/cards/069.SM-P.refine.png')}
                  alt="PSA Card Aluminum Protector"
                  fill
                  className="object-contain p-5"
                  sizes="256px"
                />
                {/* Price ribbon */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#d4a843] px-4 py-1">
                  <span className="text-[#09090f] text-[10px] font-black uppercase tracking-[0.15em]">From USD 17.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           §4  TRUST NUMBERS
      ══════════════════════════════════════════ */}
      <section
        ref={trustRef.ref}
        className="border-y border-white/[0.05] py-14 bg-[#0b0b10] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { number: '500+', label: 'Cards Traded',     accent: '#d4a843' },
              { number: '4.9',  label: 'Star Rating',      accent: '#d4a843' },
              { number: '127',  label: 'Verified Reviews', accent: '#818cf8' },
              { number: '5',    label: 'Markets Served',   accent: '#818cf8' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center py-4 md:border-r border-white/[0.04] last:border-r-0"
                style={{
                  opacity: trustRef.visible ? 1 : 0,
                  transform: trustRef.visible ? 'translateY(0)' : 'translateY(18px)',
                  transition: `all 0.8s ease ${i * 90}ms`,
                }}
              >
                <div className="font-display text-5xl font-bold leading-none mb-2" style={{ color: stat.accent }}>
                  {stat.number}
                </div>
                <div className="text-white/20 text-[10px] uppercase tracking-[0.28em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           §5  SERVICE 02 — TCG TRADING
               Editorial layout: visual | divider | text (mirrored)
      ══════════════════════════════════════════ */}
      <section
        id="trading"
        ref={service02Ref.ref}
        className="relative py-28 md:py-36 overflow-hidden scroll-mt-20"
      >
        {/* Ghost numeral — right side */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none select-none text-right" aria-hidden="true">
          <span
            className="font-serif font-bold leading-none text-white inline-block"
            style={{
              fontSize: 'clamp(180px, 30vw, 500px)',
              opacity: service02Ref.visible ? 0.028 : 0,
              transform: service02Ref.visible ? 'translateX(5%)' : 'translateX(18%)',
              transition: 'opacity 1.4s ease, transform 1.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >02</span>
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-10 lg:gap-16 items-center">

            {/* VISUAL — left on desktop, below text on mobile */}
            <div
              className="flex items-center justify-center relative order-2 lg:order-1"
              style={{
                opacity: service02Ref.visible ? 1 : 0,
                transform: service02Ref.visible ? 'translateY(0)' : 'translateY(36px)',
                transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s',
              }}
            >
              {/* Glow pool */}
              <div className="absolute w-72 h-72 rounded-full bg-[rgba(129,140,248,0.06)] blur-[90px] pointer-events-none" />

              {/* Card spread */}
              <div className="relative w-64 md:w-80 h-60 md:h-72">
                {[
                  { src: '/images/cards/192.SV-P.refine.png', rotate: -14, x: -52, y: 14, z: 1, sc: 0.84 },
                  { src: '/images/cards/105.SV-9.refine.png', rotate: 0,   x: 0,   y: 0,  z: 3, sc: 1    },
                  { src: '/images/cards/069.SM-P.refine.png', rotate: 14,  x: 52,  y: 14, z: 2, sc: 0.84 },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-28 md:w-36 h-40 md:h-48 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(129,140,248,0.07)] hover:z-10 hover:scale-110 transition-all duration-500"
                    style={{
                      transform: `translate(calc(-50% + ${card.x}px), calc(-50% + ${card.y}px)) rotate(${card.rotate}deg) scale(${card.sc})`,
                      zIndex: card.z,
                    }}
                  >
                    <Image src={getImagePath(card.src)} alt="Graded trading card" fill className="object-cover" sizes="144px" />
                  </div>
                ))}
              </div>

              {/* Floating info badges */}
              <div className="absolute -top-3 right-0 md:-right-4 bg-[#0e0e13] border border-[#818cf8]/25 px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="text-[#818cf8] text-xl font-bold font-display leading-none">0%</div>
                <div className="text-white/30 text-[9px] uppercase tracking-wider mt-1">Listing Fee</div>
              </div>
              <div className="absolute -bottom-3 left-0 md:-left-4 bg-[#0e0e13] border border-[#d4a843]/[0.18] px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-0.5 justify-center text-[#d4a843]">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
                <div className="text-white/30 text-[9px] uppercase tracking-wider mt-1">5.0 Rating</div>
              </div>
            </div>

            {/* DIVIDER */}
            <div
              className="hidden lg:block h-full min-h-80 bg-gradient-to-b from-transparent via-[#818cf8]/[0.15] to-transparent self-stretch order-2"
              style={{ opacity: service02Ref.visible ? 1 : 0, transition: 'opacity 1.2s ease 0.3s' }}
            />

            {/* TEXT */}
            <div
              className="order-1 lg:order-3"
              style={{
                opacity: service02Ref.visible ? 1 : 0,
                transform: service02Ref.visible ? 'translateX(0)' : 'translateX(36px)',
                transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-5 h-px bg-[#818cf8]" />
                <span className="text-[#818cf8] text-[11px] uppercase tracking-[0.35em]">Service 02 — Brokerage</span>
              </div>

              <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.06] mb-8">
                TCG<br />
                <em className="not-italic text-[#818cf8]">Trading</em> &amp;<br />
                Brokerage
              </h2>

              <p className="text-[#5c626e] text-[15px] leading-relaxed mb-10 max-w-sm">
                {t.business.cardTrading.description}
              </p>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-2 mb-12">
                {['No Listing Fee', 'PSA & CGC', 'Face-to-Face HK', 'Commission on Sale'].map((f) => (
                  <span key={f} className="px-3.5 py-1.5 border border-[#818cf8]/[0.18] text-[#818cf8]/55 text-[10px] uppercase tracking-[0.2em]">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <Link
                  href="/business/card-trading"
                  className="group inline-flex items-center gap-3 bg-[#818cf8] hover:bg-[#a5b4fc] text-[#09090f] font-bold text-[11px] uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:shadow-[0_0_48px_rgba(129,140,248,0.28)]"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Browse Cards</span>
                </Link>
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/[0.25] text-[11px] uppercase tracking-[0.2em] hover:text-white/50 transition-colors"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           §6  DUAL-SPLIT CTA — mirrors the hero
      ══════════════════════════════════════════ */}
      <section ref={ctaRef.ref} className="relative overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />

        <div className="grid md:grid-cols-2">
          {/* Left — PSA */}
          <div
            className="relative overflow-hidden group p-12 md:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-white/[0.05]"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transform: ctaRef.visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="absolute inset-0 bg-[#09090f]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_0%_100%,rgba(212,168,67,0.055),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 left-0">
              <div className="absolute top-4 left-4 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-[#d4a843]/40" />
            </div>
            <div className="relative">
              <span className="text-[#d4a843]/35 text-[10px] uppercase tracking-[0.4em] block mb-5">Protection</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1] mb-4">
                Shop Our<br />Protector
              </h3>
              <p className="text-white/[0.22] text-sm leading-relaxed mb-10 max-w-xs">
                Premium aluminum cases — worldwide shipping from USD&nbsp;17.99
              </p>
              <Link
                href="/products/psa-protectors"
                className="group/btn inline-flex items-center gap-3 border border-[#d4a843]/35 hover:border-[#d4a843] hover:bg-[#d4a843]/5 text-[#d4a843] text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-4 transition-all duration-300"
              >
                <span>View Product</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right — Trading */}
          <div
            className="relative overflow-hidden group p-12 md:p-16 lg:p-20"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transform: ctaRef.visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s',
            }}
          >
            <div className="absolute inset-0 bg-[#09090f]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_100%_100%,rgba(129,140,248,0.055),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0">
              <div className="absolute top-4 right-4 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-[#818cf8]/40" />
            </div>
            <div className="relative">
              <span className="text-[#818cf8]/35 text-[10px] uppercase tracking-[0.4em] block mb-5">Brokerage</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1] mb-4">
                Start Your<br />Trade
              </h3>
              <p className="text-white/[0.22] text-sm leading-relaxed mb-10 max-w-xs">
                Buy, sell, or consign your graded cards — no upfront listing fee
              </p>
              <a
                href="https://wa.me/85292851189"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 border border-[#818cf8]/35 hover:border-[#818cf8] hover:bg-[#818cf8]/5 text-[#818cf8] text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-4 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#818cf8]/[0.18] to-transparent" />
      </section>

    </div>
  );
}
