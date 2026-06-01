'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Magnet, Repeat, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';
import trackEvent from '@/lib/analytics';

export default function HomeClient() {
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

  // Lightweight CTA analytics
  const handleShopClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'shop_protectors', label: 'hero_shop_protectors' });
  };
  const handleCollectionClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'view_collection', label: 'hero_view_collection' });
  };
  const handleCenteringClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'analyze_centering', label: 'hero_analyze_centering' });
  };


  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════
           HERO — Focused brand statement with clear dual CTAs
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#1e1e2e]">
        {/* Ambient radial gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_110%,rgba(212,137,154,0.13),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(212,137,154,0.04),transparent)]" />

        {/* Top hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/40 to-transparent" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 left-[15%] w-[480px] h-[480px] rounded-full bg-[rgba(212,137,154,0.06)] blur-[100px] pointer-events-none animate-[orb-drift-a_14s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[15%] w-[360px] h-[360px] rounded-full bg-[rgba(129,140,248,0.04)] blur-[80px] pointer-events-none animate-[orb-drift-b_18s_ease-in-out_2s_infinite]" />
        <div className="absolute top-[55%] right-[38%] w-[280px] h-[280px] rounded-full bg-[rgba(212,137,154,0.04)] blur-[70px] pointer-events-none animate-[orb-drift-a_22s_ease-in-out_5s_infinite]" />

        {/* Scanning light line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent animate-[scan-line_7s_linear_3s_infinite]" />
        </div>

        <div className="relative container-custom py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — Text */}
            <div
              className="order-2 lg:order-1 transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
            >
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2.5 border border-[#D4899A]/40 rounded-full px-5 py-2 mb-10 hover:border-[#D4899A]/70 transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4899A] animate-pulse" />
                <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">{t.home.hero.badge}</span>
              </div>

              {/* Headline — staggered line reveal */}
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold font-display leading-[1.08] tracking-tight mb-6">
                {[
                  { text: 'Showcase',      cls: 'text-white',     delay: '200ms' },
                  { text: 'Your Passion.', cls: 'text-[#D4899A]', delay: '380ms' },
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
                {/* Keyword-rich sub-line — SEO search-intent signal inside the H1 */}
                <span className="block mt-5 text-base md:text-lg font-semibold tracking-normal leading-snug text-[#9ca3af]">
                  {t.home.hero.h1Keyword}
                </span>
              </h1>

              {/* Gold rule divider */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-px bg-[#D4899A]" />
                <div className="w-2 h-2 rounded-full bg-[#D4899A]" />
                <div className="w-24 h-px bg-[#D4899A]/30" />
              </div>

              {/* Subtitle */}
              <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed mb-10 max-w-md">
                {t.home.hero.subtitle}
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Primary CTA — glow button */}
                <Link
                  href="/products/psa-protectors"
                  onClick={handleShopClick}
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary-600 text-white font-bold text-[15px] rounded-2xl hover:bg-primary-700 active:scale-[0.97] transition-all duration-200 shadow-[0_0_24px_rgba(212,137,154,0.25)] hover:shadow-[0_0_40px_rgba(212,137,154,0.35)]"
                >
                  {t.home.hero.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* Secondary pill group — glassmorphic, connected */}
                <div className="inline-flex rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md overflow-hidden">
                  <Link
                    href="/collection"
                    onClick={handleCollectionClick}
                    className="group inline-flex items-center gap-2 px-5 py-3 text-white/70 hover:text-white text-sm font-medium hover:bg-white/[0.05] transition-all duration-200 border-r border-white/[0.06]"
                  >
                    <Star className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                    My Collection
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>

                  <Link
                    href="/tools/card-centering"
                    onClick={handleCenteringClick}
                    className="group inline-flex items-center gap-2 px-5 py-3 text-white/70 hover:text-white text-sm font-medium hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#818cf8] flex-shrink-0" />
                    Centering
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — Product Stage */}
            <div
              className="order-1 lg:order-2 relative flex items-center justify-center transition-all duration-1000 delay-300"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(48px)' }}
            >
              {/* Rotating ring decorations */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#D4899A]/10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-[350px] h-[350px] rounded-full border border-[#D4899A]/15 animate-[spin_20s_linear_infinite_reverse]" />

              {/* Ambient glow */}
              <div className="absolute w-64 h-64 bg-[#D4899A]/10 rounded-full blur-3xl" />

              {/* 3D tilt product container */}
              <div
                className="relative w-72 md:w-80 transition-[transform] duration-200 ease-out will-change-transform"
                style={{ transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
              >
                {/* Product frame */}
                <div className="relative bg-gradient-to-b from-[#252538] to-[#181828] rounded-3xl p-6 border border-[#D4899A]/20 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(212,137,154,0.15)]">
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#D4899A]/50" />
                  <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#D4899A]/50" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#D4899A]/50" />
                  <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#D4899A]/50" />

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
                      <p className="text-[#D4899A]/60 text-[10px] uppercase tracking-[0.2em]">Premium Protection</p>
                      <p className="text-white text-sm font-semibold mt-0.5">PSA Card Protector</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="w-3 h-3 text-[#D4899A] fill-[#D4899A]" />
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
                  className="absolute top-1/3 -left-5 flex items-center gap-1.5 bg-[#1e1e2e]/90 border border-[#D4899A]/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg"
                  style={{ animation: 'float 5s ease-in-out 1.3s infinite' }}
                >
                  <Magnet className="w-3 h-3 text-[#D4899A]" />
                  <span className="text-[#D4899A] text-[11px] font-semibold">N52 Magnets</span>
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e2e] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
           SERVICES — Bento Showcase
           Asymmetric grid: hero card (2 col × 2 row) + two stacked
           Holographic glow borders, glassmorphism, staggered reveal
      ══════════════════════════════════════════════════════════ */}
      <section ref={servicesRef} className="relative py-36 bg-[#08080e] overflow-hidden scroll-mt-20">
        {/* ── Dramatic ambient mesh ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-[#D4899A]/[0.035] blur-[160px]" />
          <div className="absolute bottom-[-5%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#818cf8]/[0.025] blur-[130px]" />
          <div className="absolute top-[40%] left-[55%] w-[400px] h-[400px] rounded-full bg-[#34D399]/[0.015] blur-[110px]" />
        </div>
        {/* Dot matrix overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        {/* Edge hairlines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="container-custom relative">

          {/* ── Section header ── */}
          <div
            className="max-w-3xl mx-auto text-center mb-20 transition-all duration-800"
            style={{
              opacity: servicesVisible ? 1 : 0,
              transform: servicesVisible ? 'translateY(0)' : 'translateY(28px)',
            }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#D4899A]/50" />
              <span className="text-[#D4899A] text-[11px] uppercase tracking-[0.3em] font-semibold">{t.home.services.badge}</span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#D4899A]/50" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white leading-[1.05] tracking-tight">
              {t.home.services.title}
            </h2>
          </div>

          {/* ── Bento Grid: 3 cols on lg, hero card spans 2×2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-5 max-w-6xl mx-auto auto-rows-fr">

            {/* ═══ CARD 01 — PSA Protector (Hero · 2 col × 2 row) ═══ */}
            <Link
              href="/products/psa-protectors"
              onClick={handleShopClick}
              className="group relative block lg:col-span-2 lg:row-span-2 rounded-[1.25rem] transition-all duration-700 hover:-translate-y-1"
              style={{
                opacity: servicesVisible ? 1 : 0,
                transform: servicesVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
                transitionDelay: '80ms',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-px rounded-[1.25rem] bg-gradient-to-br from-[#D4899A]/25 via-transparent to-[#D4899A]/10 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              {/* Holographic sweep */}
              <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
                <div className="absolute -left-full top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-[1200ms] ease-out" />
              </div>

              <div className="relative h-full bg-[#0d0d14]/90 backdrop-blur-sm rounded-[1.25rem] border border-white/[0.04] overflow-hidden group-hover:border-[#D4899A]/20 group-hover:shadow-[0_0_80px_rgba(212,137,154,0.06)] transition-all duration-700">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_30%_70%,rgba(212,137,154,0.06),transparent)] pointer-events-none" />

                {/* Watermark number */}
                <div className="absolute top-6 right-8 text-[9rem] font-extrabold leading-none text-white/[0.015] select-none group-hover:text-[#D4899A]/[0.04] transition-colors duration-700 font-display">01</div>

                {/* Content: horizontal on lg */}
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left — Product visual */}
                  <div className="relative flex-1 flex items-center justify-center p-8 md:p-12 min-h-[280px]">
                    {/* Pulse ring */}
                    <div className="absolute w-52 h-52 rounded-full border border-[#D4899A]/[0.06] animate-[spin_25s_linear_infinite] pointer-events-none" />
                    <div className="absolute w-40 h-40 rounded-full border border-[#D4899A]/[0.1] animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />
                    <div className="absolute w-48 h-48 rounded-full bg-[#D4899A]/[0.05] blur-[60px] pointer-events-none" />

                    <div className="relative w-48 h-60 md:w-56 md:h-72 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2" style={{ animation: 'float 6s ease-in-out infinite' }}>
                      <Image
                        src={getImagePath('/images/cards/069.SM-P.refine.png')}
                        alt="PSA Card Aluminum Protector"
                        fill
                        className="object-contain drop-shadow-[0_30px_60px_rgba(212,137,154,0.2)]"
                        sizes="(max-width: 768px) 60vw, 300px"
                      />
                    </div>
                  </div>

                  {/* Right — Text */}
                  <div className="flex-1 flex flex-col justify-center p-8 md:p-12 md:pl-4">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#D4899A]/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#D4899A]" />
                      </div>
                      <span className="text-[#D4899A] text-[10px] font-bold uppercase tracking-[0.25em]">Premium Protection</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display leading-tight group-hover:text-[#D4899A] transition-colors duration-500">
                      {t.business.cardProtector.title}
                    </h3>
                    <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                      {t.home.services.protector.subtitle}
                    </p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['>95% UV', 'N52 Magnet', 'Anti-Fade', '74g'].map((chip) => (
                        <span key={chip} className="px-3 py-1.5 text-[11px] font-medium text-white/60 bg-white/[0.04] border border-white/[0.06] rounded-full">
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4899A]/10 hover:bg-[#D4899A]/20 border border-[#D4899A]/20 rounded-xl text-[#D4899A] text-sm font-semibold uppercase tracking-[0.08em] w-fit transition-all duration-300 group-hover:gap-3.5">
                      {t.home.services.protector.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4899A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
              </div>
            </Link>

            {/* ═══ CARD 02 — My Collection ═══ */}
            <Link
              href="/collection"
              onClick={handleCollectionClick}
              className="group relative block rounded-[1.25rem] transition-all duration-700 hover:-translate-y-1"
              style={{
                opacity: servicesVisible ? 1 : 0,
                transform: servicesVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
                transitionDelay: '220ms',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Gradient border */}
              <div className="absolute -inset-px rounded-[1.25rem] bg-gradient-to-br from-[#34D399]/20 via-transparent to-[#34D399]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              {/* Sweep */}
              <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
                <div className="absolute -left-full top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-[1200ms] ease-out" />
              </div>

              <div className="relative h-full bg-[#0d0d14]/90 backdrop-blur-sm rounded-[1.25rem] border border-white/[0.04] overflow-hidden p-7 flex flex-col group-hover:border-[#34D399]/15 group-hover:shadow-[0_0_60px_rgba(52,211,153,0.04)] transition-all duration-700">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(52,211,153,0.05),transparent)] pointer-events-none" />

                {/* Watermark */}
                <div className="absolute top-4 right-6 text-[7rem] font-extrabold leading-none text-white/[0.015] select-none group-hover:text-[#34D399]/[0.04] transition-colors duration-700 font-display">02</div>

                {/* Icon + badge */}
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#34D399]" />
                  </div>
                  <span className="text-[#34D399] text-[10px] font-bold uppercase tracking-[0.2em]">Organize</span>
                </div>

                <h3 className="relative text-xl font-bold text-white mb-3 font-display group-hover:text-[#34D399] transition-colors duration-500">
                  My Collection
                </h3>
                <p className="relative text-white/45 text-sm leading-relaxed mb-6 flex-1">
                  Add, organize and track your cards with values, provenance and condition.
                </p>

                {/* CTA */}
                <span className="relative inline-flex items-center gap-2 text-[#34D399] text-sm font-semibold uppercase tracking-[0.08em] group-hover:gap-3.5 transition-all duration-500">
                  Open Collection
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#34D399] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
              </div>
            </Link>

            {/* ═══ CARD 03 — Centering Analyzer ═══ */}
            <Link
              href="/tools/card-centering"
              onClick={handleCenteringClick}
              className="group relative block rounded-[1.25rem] transition-all duration-700 hover:-translate-y-1"
              style={{
                opacity: servicesVisible ? 1 : 0,
                transform: servicesVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
                transitionDelay: '360ms',
                transitionDuration: '900ms',
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Gradient border */}
              <div className="absolute -inset-px rounded-[1.25rem] bg-gradient-to-br from-[#818cf8]/20 via-transparent to-[#818cf8]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              {/* Sweep */}
              <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
                <div className="absolute -left-full top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-[1200ms] ease-out" />
              </div>

              <div className="relative h-full bg-[#0d0d14]/90 backdrop-blur-sm rounded-[1.25rem] border border-white/[0.04] overflow-hidden p-7 flex flex-col group-hover:border-[#818cf8]/15 group-hover:shadow-[0_0_60px_rgba(129,140,248,0.04)] transition-all duration-700">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(129,140,248,0.05),transparent)] pointer-events-none" />

                {/* Watermark */}
                <div className="absolute top-4 right-6 text-[7rem] font-extrabold leading-none text-white/[0.015] select-none group-hover:text-[#818cf8]/[0.04] transition-colors duration-700 font-display">03</div>

                {/* Icon + badge */}
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#818cf8]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#818cf8]" />
                  </div>
                  <span className="text-[#818cf8] text-[10px] font-bold uppercase tracking-[0.2em]">Analyze</span>
                </div>

                <h3 className="relative text-xl font-bold text-white mb-3 font-display group-hover:text-[#818cf8] transition-colors duration-500">
                  Centering Analyzer
                </h3>
                <p className="relative text-white/45 text-sm leading-relaxed mb-6 flex-1">
                  Upload a photo or use your camera for an instant centering grade and exportable report.
                </p>

                {/* CTA */}
                <span className="relative inline-flex items-center gap-2 text-[#818cf8] text-sm font-semibold uppercase tracking-[0.08em] group-hover:gap-3.5 transition-all duration-500">
                  Analyze Now
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           PRODUCT SPECIFICATIONS — Crawlable text table (SEO)
           Plain-text spec data search bots can match against queries
           like "Magnetic PSA case 35pt HK".
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-[#0d0d14] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,137,154,0.04),transparent)] pointer-events-none" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#D4899A]" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">{t.home.specs.badge}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white leading-tight mb-5">
              {t.home.specs.title}
            </h2>
            <p className="text-[#9ca3af] text-base leading-relaxed mb-9">
              {t.home.specs.intro}
            </p>

            <table className="w-full text-left border-collapse">
              <tbody>
                {[
                  [t.home.specs.rows.product, t.home.specs.rows.productValue],
                  [t.home.specs.rows.compatibility, t.home.specs.rows.compatibilityValue],
                  [t.home.specs.rows.material, t.home.specs.rows.materialValue],
                  [t.home.specs.rows.closure, t.home.specs.rows.closureValue],
                  [t.home.specs.rows.uvProtection, t.home.specs.rows.uvProtectionValue],
                  [t.home.specs.rows.weight, t.home.specs.rows.weightValue],
                  [t.home.specs.rows.dimensions, t.home.specs.rows.dimensionsValue],
                  [t.home.specs.rows.origin, t.home.specs.rows.originValue],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-white/[0.06]">
                    <th scope="row" className="py-3.5 pr-6 align-top text-sm font-semibold text-white/80 whitespace-nowrap w-1/3">
                      {label}
                    </th>
                    <td className="py-3.5 text-sm text-[#9ca3af] leading-relaxed">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-9">
              <Link
                href="/products/psa-protectors"
                onClick={handleShopClick}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary-600 text-white font-bold text-[15px] rounded-2xl hover:bg-primary-700 active:scale-[0.97] transition-all duration-200 shadow-[0_0_24px_rgba(212,137,154,0.25)] hover:shadow-[0_0_40px_rgba(212,137,154,0.35)]"
              >
                {t.home.specs.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           RETAIL PARTNERS
      ══════════════════════════════════════════════════════════ */}
      <RetailPartners />

      {/* ══════════════════════════════════════════════════════════
           FINAL CTA — Clean close
      ══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-32 bg-[#1e1e2e] relative">
        {/* Gold radial glow — kept in own overflow-hidden layer so they don't bleed */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(212,137,154,0.1),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/30 to-transparent" />
        </div>

        <div className="container-custom relative text-center">
          <div
            className="transition-all duration-1000"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            {/* Decorative line + star */}
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#D4899A]/40" />
              <Star className="w-4 h-4 text-[#D4899A]" />
              <div className="w-14 h-px bg-[#D4899A]/40" />
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.15] mb-6"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #ffffff 35%, #D4899A 50%, #ffffff 65%, #ffffff 100%)',
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <ShopNowButton
                label={t.home.cta.button}
                shopOptions={t.shopOptions}
                whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                buttonClassName="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold text-base rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-md"
                chevronSize="w-5 h-5"
              />
              <Link
                href="/business/card-trading"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold text-base rounded-xl hover:bg-white/5 hover:border-white/40 active:scale-95 transition-all duration-150 group"
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
