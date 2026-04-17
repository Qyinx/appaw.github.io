'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Magnet, Repeat, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';

export default function HomePage() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const servicesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Hero entrance
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Scroll reveal observers
  useEffect(() => {
    const pairs: [React.RefObject<HTMLElement | null>, (v: boolean) => void][] = [
      [servicesRef, setServicesVisible],
      [ctaRef, setCtaVisible],
    ];
    const observers = pairs.map(([ref, setter]) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.12 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // Mouse tracking for hero parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const tiltX = mousePos.y * -6;
  const tiltY = mousePos.x * 6;


  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════
           HERO — Focused brand statement with clear dual CTAs
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#09090f]">
        {/* Ambient radial gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_110%,rgba(212,168,67,0.13),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(212,168,67,0.04),transparent)]" />

        {/* Top hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 left-[15%] w-[480px] h-[480px] rounded-full bg-[rgba(212,168,67,0.06)] blur-[100px] pointer-events-none animate-[orb-drift-a_14s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[15%] w-[360px] h-[360px] rounded-full bg-[rgba(129,140,248,0.04)] blur-[80px] pointer-events-none animate-[orb-drift-b_18s_ease-in-out_2s_infinite]" />
        <div className="absolute top-[55%] right-[38%] w-[280px] h-[280px] rounded-full bg-[rgba(212,168,67,0.04)] blur-[70px] pointer-events-none animate-[orb-drift-a_22s_ease-in-out_5s_infinite]" />

        {/* Scanning light line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent animate-[scan-line_7s_linear_3s_infinite]" />
        </div>

        <div className="relative container-custom py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — Text */}
            <div
              className="order-2 lg:order-1 transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
            >
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-5 py-2 mb-10 hover:border-[#d4a843]/70 transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{t.home.hero.badge}</span>
              </div>

              {/* Headline — staggered line reveal */}
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold font-display leading-[1.08] tracking-tight mb-6">
                {[
                  { text: 'Showcase',      cls: 'text-white',     delay: '200ms' },
                  { text: 'Your Passion.', cls: 'text-[#d4a843]', delay: '380ms' },
                  { text: 'Protect Your',  cls: 'text-white',     delay: '530ms' },
                  { text: 'Investment.',   cls: 'text-white',     delay: '680ms' },
                ].map(({ text, cls, delay }) => (
                  <div key={text} className="overflow-hidden leading-[1.08]">
                    <span
                      className={`block ${cls}`}
                      style={heroVisible
                        ? { animation: `line-rise 0.9s cubic-bezier(0.16,1,0.3,1) ${delay} both` }
                        : { transform: 'translateY(110%)', opacity: 0 }
                      }
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </h1>

              {/* Gold rule divider */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-px bg-[#d4a843]" />
                <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
                <div className="w-24 h-px bg-[#d4a843]/30" />
              </div>

              {/* Subtitle */}
              <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed mb-10 max-w-md">
                {t.home.hero.subtitle}
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ShopNowButton
                  label={t.home.hero.cta}
                  shopOptions={t.shopOptions}
                  whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                  buttonClassName="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#d4a843] text-black font-semibold rounded-xl hover:bg-[#e5bc5a] active:scale-95 transition-all duration-200 shadow-[0_8px_32px_rgba(212,168,67,0.32)] hover:shadow-[0_12px_48px_rgba(212,168,67,0.55)]"
                />
                <Link
                  href="/business/card-trading"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-200 group"
                >
                  {t.home.hero.learnMore}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RIGHT — Product Stage */}
            <div
              className="order-1 lg:order-2 relative flex items-center justify-center transition-all duration-1000 delay-300"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(48px)' }}
            >
              {/* Rotating ring decorations */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#d4a843]/10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-[350px] h-[350px] rounded-full border border-[#d4a843]/15 animate-[spin_20s_linear_infinite_reverse]" />

              {/* Ambient glow */}
              <div className="absolute w-64 h-64 bg-[#d4a843]/10 rounded-full blur-3xl" />

              {/* 3D tilt product container */}
              <div
                className="relative w-72 md:w-80 transition-[transform] duration-200 ease-out will-change-transform"
                style={{ transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
              >
                {/* Product frame */}
                <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-6 border border-[#d4a843]/20 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(212,168,67,0.15)]">
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#d4a843]/50" />
                  <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#d4a843]/50" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#d4a843]/50" />
                  <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#d4a843]/50" />

                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111]">
                    <Image
                      src={getImagePath('/images/cards/069.SM-P.refine.png')}
                      alt="PSA Card Aluminum Protector"
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                      quality={100}
                      unoptimized
                    />
                    {/* Subtle shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                  </div>

                  {/* Label bar */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-[#d4a843]/60 text-[10px] uppercase tracking-[0.2em]">Premium Protection</p>
                      <p className="text-white text-sm font-semibold mt-0.5">PSA Card Protector</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="w-3 h-3 text-[#d4a843] fill-[#d4a843]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating chips — each bobs at its own rhythm */}
                <div
                  className="absolute -top-4 -right-4 flex items-center gap-1.5 bg-[#0a1a0a]/90 border border-green-500/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg"
                  style={{ animation: 'float 4s ease-in-out infinite' }}
                >
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-[11px] font-semibold">&gt;95% UV</span>
                </div>

                <div
                  className="absolute top-1/3 -left-5 flex items-center gap-1.5 bg-[#09090f]/90 border border-[#d4a843]/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg"
                  style={{ animation: 'float 5s ease-in-out 1.3s infinite' }}
                >
                  <Magnet className="w-3 h-3 text-[#d4a843]" />
                  <span className="text-[#d4a843] text-[11px] font-semibold">N52 Magnets</span>
                </div>

                <div
                  className="absolute -bottom-4 left-4 flex items-center gap-1.5 bg-[#1a0d00]/90 border border-amber-500/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg"
                  style={{ animation: 'float 3.5s ease-in-out 2.2s infinite' }}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 text-[11px] font-semibold">Anti-Fade</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090f] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
           SERVICES — Luxury dark editorial
      ══════════════════════════════════════════════════════════ */}
      <section ref={servicesRef} className="relative py-32 bg-[#09090f] overflow-hidden scroll-mt-20">
        {/* Ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_25%_50%,rgba(212,168,67,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_75%_50%,rgba(129,140,248,0.04),transparent)]" />
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="container-custom relative">

          {/* Section header */}
          <div
            className="text-center max-w-2xl mx-auto mb-20 transition-all duration-700"
            style={{ opacity: servicesVisible ? 1 : 0, transform: servicesVisible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#d4a843]/60" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.3em] font-medium">{t.home.services.badge}</span>
              <div className="w-10 h-px bg-[#d4a843]/60" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1]">
              {t.home.services.title}
            </h2>
          </div>

          {/* Two luxury service cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">

            {/* ── Service 01: PSA Card Protector ── */}
            <Link
              href="/products/psa-protectors"
              className="group relative block rounded-2xl overflow-hidden transition-all duration-700"
              style={{
                opacity: servicesVisible ? 1 : 0,
                transform: servicesVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '150ms',
                transitionDuration: '800ms',
              }}
            >
              {/* Card background with gradient border effect */}
              <div className="relative bg-gradient-to-b from-[#141418] to-[#0c0c10] border border-[#d4a843]/15 rounded-2xl overflow-hidden group-hover:border-[#d4a843]/40 transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(212,168,67,0.08),inset_0_1px_0_rgba(212,168,67,0.1)]">

                {/* Shimmer sweep — revealed on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 h-full w-[45%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[shimmer-sweep_2.8s_linear_infinite]" />
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#d4a843]/30 group-hover:border-[#d4a843]/60 transition-colors duration-500" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#d4a843]/30 group-hover:border-[#d4a843]/60 transition-colors duration-500" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#d4a843]/30 group-hover:border-[#d4a843]/60 transition-colors duration-500" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#d4a843]/30 group-hover:border-[#d4a843]/60 transition-colors duration-500" />

                {/* Editorial number watermark */}
                <span className="absolute top-6 right-8 text-[6rem] font-bold leading-none text-white/[0.025] select-none group-hover:text-[#d4a843]/[0.06] transition-colors duration-700 font-display">
                  01
                </span>

                {/* Product visual area */}
                <div className="relative h-72 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_60%,rgba(212,168,67,0.08),transparent)]" />
                  <div className="relative w-44 h-56 transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2">
                    <Image
                      src={getImagePath('/images/cards/069.SM-P.refine.png')}
                      alt="PSA Card Protector"
                      fill
                      className="object-contain drop-shadow-[0_12px_40px_rgba(212,168,67,0.15)]"
                      sizes="176px"
                    />
                  </div>

                  {/* Floating service badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#09090f]/80 backdrop-blur-xl border border-[#d4a843]/25 rounded-full px-4 py-2">
                    <Shield className="w-3.5 h-3.5 text-[#d4a843]" />
                    <span className="text-[#d4a843] text-[10px] font-semibold uppercase tracking-[0.2em]">Protection</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />

                {/* Text area */}
                <div className="px-8 py-8">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#d4a843] transition-colors duration-500 font-display">
                    {t.business.cardProtector.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-8">
                    {t.home.services.protector.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2.5 text-[#d4a843] font-semibold text-sm uppercase tracking-[0.1em] group-hover:gap-4 transition-all duration-500">
                    {t.home.services.protector.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>

                {/* Bottom gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a843] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
              </div>
            </Link>

            {/* ── Service 02: TCG Trading ── */}
            <Link
              href="/business/card-trading"
              className="group relative block rounded-2xl overflow-hidden transition-all duration-700"
              style={{
                opacity: servicesVisible ? 1 : 0,
                transform: servicesVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '300ms',
                transitionDuration: '800ms',
              }}
            >
              {/* Card background */}
              <div className="relative bg-gradient-to-b from-[#141418] to-[#0c0c10] border border-[#818cf8]/15 rounded-2xl overflow-hidden group-hover:border-[#818cf8]/40 transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(129,140,248,0.08),inset_0_1px_0_rgba(129,140,248,0.08)]">

                {/* Shimmer sweep — revealed on hover (offset so cards don't sync) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 h-full w-[45%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[shimmer-sweep_2.8s_linear_1.4s_infinite]" />
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#818cf8]/30 group-hover:border-[#818cf8]/60 transition-colors duration-500" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#818cf8]/30 group-hover:border-[#818cf8]/60 transition-colors duration-500" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#818cf8]/30 group-hover:border-[#818cf8]/60 transition-colors duration-500" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#818cf8]/30 group-hover:border-[#818cf8]/60 transition-colors duration-500" />

                {/* Editorial number watermark */}
                <span className="absolute top-6 right-8 text-[6rem] font-bold leading-none text-white/[0.025] select-none group-hover:text-[#818cf8]/[0.08] transition-colors duration-700 font-display">
                  02
                </span>

                {/* Card fan visual area */}
                <div className="relative h-72 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_60%,rgba(129,140,248,0.07),transparent)]" />
                  {/* Card fan */}
                  <div className="relative flex items-center justify-center">
                    {[
                      { src: '/images/cards/192.SV-P.refine.png', rotate: -12, x: -44, delay: '0ms' },
                      { src: '/images/cards/105.SV-9.refine.png', rotate: 0,   x: 0,   delay: '50ms' },
                      { src: '/images/cards/069.SM-P.refine.png', rotate: 12,  x: 44,  delay: '100ms' },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="absolute w-[7.5rem] h-40 rounded-xl overflow-hidden border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:shadow-[0_24px_48px_rgba(129,140,248,0.10)]"
                        style={{
                          transform: `rotate(${card.rotate}deg) translateX(${card.x}px)`,
                          zIndex: i === 1 ? 3 : i === 2 ? 2 : 1,
                          transitionDelay: card.delay,
                        }}
                      >
                        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                          <Image src={getImagePath(card.src)} alt="Graded card" fill className="object-cover" sizes="120px" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating service badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#09090f]/80 backdrop-blur-xl border border-[#818cf8]/30 rounded-full px-4 py-2">
                    <Repeat className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span className="text-[#818cf8] text-[10px] font-semibold uppercase tracking-[0.2em]">Trading</span>
                  </div>

                  {/* Active indicator */}
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-[#09090f]/80 backdrop-blur-xl border border-green-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-[10px] font-medium">Active</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[#818cf8]/25 to-transparent" />

                {/* Text area */}
                <div className="px-8 py-8">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#818cf8] transition-colors duration-500 font-display">
                    {t.business.cardTrading.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-8">
                    {t.home.services.trading.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2.5 text-[#818cf8] font-semibold text-sm uppercase tracking-[0.1em] group-hover:gap-4 transition-all duration-500">
                    {t.home.services.trading.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>

                {/* Bottom emerald accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════
           RETAIL PARTNERS
      ══════════════════════════════════════════════════════════ */}
      <RetailPartners />

      {/* ══════════════════════════════════════════════════════════
           FINAL CTA — Clean close
      ══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-32 bg-[#09090f] relative">
        {/* Gold radial glow — kept in own overflow-hidden layer so they don't bleed */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(212,168,67,0.1),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/30 to-transparent" />
        </div>

        <div className="container-custom relative text-center">
          <div
            className="transition-all duration-1000"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            {/* Decorative line + star */}
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#d4a843]/40" />
              <Star className="w-4 h-4 text-[#d4a843]" />
              <div className="w-14 h-px bg-[#d4a843]/40" />
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.15] mb-6"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #d4a843 50%, #ffffff 65%, #ffffff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: ctaVisible ? 'text-shine 4s linear infinite' : 'none',
              }}
            >
              {t.home.cta.title}
            </h2>

            <p className="text-[#9ca3af] text-lg max-w-xl mx-auto leading-relaxed mb-12">
              {t.home.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ShopNowButton
                label={t.home.cta.button}
                shopOptions={t.shopOptions}
                whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                buttonClassName="inline-flex items-center gap-3 px-10 py-5 bg-[#d4a843] text-black font-bold text-lg rounded-xl hover:bg-[#e5bc5a] active:scale-95 transition-all duration-200 shadow-[0_8px_40px_rgba(212,168,67,0.4)] hover:shadow-[0_16px_60px_rgba(212,168,67,0.6)]"
                chevronSize="w-5 h-5"
              />
              <Link
                href="/business/card-trading"
                className="inline-flex items-center gap-3 px-10 py-5 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all duration-200 group"
              >
                {t.home.tradingPreview.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
