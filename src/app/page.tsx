'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Shield, Sparkles, Sun, Magnet, ChevronRight, ChevronLeft, Star, Square, Hand, Pause, Play, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import RetailPartners from '@/components/RetailPartners';
import StatsGrid from '@/components/ui/StatsGrid';

const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

const CAROUSEL_INTERVAL = 4500;


export default function HomePage() {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [craftVisible, setCraftVisible] = useState(false);
  const [showcaseVisible, setShowcaseVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const statsRef = useRef<HTMLElement>(null);
  const craftRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Scroll reveal observers
  useEffect(() => {
    const pairs: [React.RefObject<HTMLElement | null>, (v: boolean) => void][] = [
      [statsRef, setStatsVisible],
      [craftRef, setCraftVisible],
      [showcaseRef, setShowcaseVisible],
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

  // Carousel auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureImages.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, activeFeature]);

  const goToFeature = useCallback((index: number) => {
    setActiveFeature(index);
    setIsPaused(false);
  }, []);

  const nextFeature = useCallback(() => {
    setActiveFeature((prev) => (prev + 1) % featureImages.length);
  }, []);

  const prevFeature = useCallback(() => {
    setActiveFeature((prev) => (prev - 1 + featureImages.length) % featureImages.length);
  }, []);

  const tiltX = mousePos.y * -6;
  const tiltY = mousePos.x * 6;


  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════
           HERO — Cinematic Dark Stage
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#09090f]">
        {/* Ambient radial gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_110%,rgba(212,168,67,0.13),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(212,168,67,0.04),transparent)]" />

        {/* Top hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative container-custom py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — Editorial Text */}
            <div
              className="order-2 lg:order-1 transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
            >
              {/* Premium badge */}
              <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-5 py-2 mb-10 hover:border-[#d4a843]/70 transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{t.home.hero.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold font-display leading-[1.08] tracking-tight text-white mb-6">
                <span className="block">Showcase</span>
                <span className="block text-[#d4a843]">Your Passion.</span>
                <span className="block">Protect Your</span>
                <span className="block">Investment.</span>
              </h1>

              {/* Gold rule divider */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-px bg-[#d4a843]" />
                <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
                <div className="w-24 h-px bg-[#d4a843]/30" />
              </div>

              {/* Subtitle */}
              <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed mb-3 max-w-md">
                {t.home.hero.subtitle}
              </p>
              <p className="text-[#6b7280] text-base leading-relaxed mb-10 max-w-md">
                {t.home.hero.description}
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href={t.home.hero.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#d4a843] text-black font-semibold rounded-xl hover:bg-[#e5bc5a] active:scale-95 transition-all duration-200 shadow-[0_8px_32px_rgba(212,168,67,0.32)] hover:shadow-[0_12px_48px_rgba(212,168,67,0.55)] group"
                >
                  {t.home.hero.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/products/psa-protectors"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-200 group"
                >
                  {t.home.hero.learnMore}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-6 pt-8 border-t border-white/10 flex-wrap">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: t.home.hero.trustIndicators.uvProtection },
                  { icon: <Magnet className="w-4 h-4" />, label: t.home.hero.trustIndicators.n52Magnets },
                  { icon: <Sun className="w-4 h-4" />, label: t.home.hero.trustIndicators.antiFadeGlass },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#d4a843]">{item.icon}</span>
                    <span className="text-white/50 text-sm">{item.label}</span>
                  </div>
                ))}
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

                {/* Floating chips */}
                <div className="absolute -top-4 -right-4 flex items-center gap-1.5 bg-[#0a1a0a]/90 border border-green-500/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-[11px] font-semibold">&gt;95% UV</span>
                </div>

                <div className="absolute top-1/3 -left-5 flex items-center gap-1.5 bg-[#09090f]/90 border border-[#d4a843]/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">
                  <Magnet className="w-3 h-3 text-[#d4a843]" />
                  <span className="text-[#d4a843] text-[11px] font-semibold">N52 Magnets</span>
                </div>

                <div className="absolute -bottom-4 left-4 flex items-center gap-1.5 bg-[#1a0d00]/90 border border-amber-500/30 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 text-[11px] font-semibold">Anti-Fade</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into white stats section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════
           STATS BAR — Proof of Excellence
      ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-20 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <StatsGrid
            isVisible={statsVisible}
            theme="light"
            stats={[
              { value: 1200, suffix: '+', label: t.about.trust.stats.cardsProtected, sub: t.about.trust.stats.andCounting     },
              { value: 100, suffix: '+', label: t.about.trust.stats.happyCustomers,  sub: t.about.trust.stats.worldwide        },
              { value: 99,  suffix: '%', label: t.about.trust.stats.satisfaction,    sub: t.about.trust.stats.customerVerified },
              { value: 1,   suffix: '+', label: t.about.trust.stats.yearsOfCraft,    sub: t.about.trust.stats.ofExcellence     },
            ]}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           THE CRAFT — Editorial Feature Cards
      ══════════════════════════════════════════════════════════ */}
      <section ref={craftRef} className="py-28 bg-white overflow-hidden">
        <div className="container-custom">

          {/* Section header */}
          <div
            className="max-w-xl mb-20 transition-all duration-700"
            style={{ opacity: craftVisible ? 1 : 0, transform: craftVisible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1]">
              {t.home.features.title}
            </h2>
          </div>

          {/* Feature grid — separated by single-pixel borders */}
          <div className="grid md:grid-cols-3 gap-px bg-neutral-100 border border-neutral-100">
            {[
              {
                number: '01',
                icon: <Shield className="w-6 h-6" />,
                title: t.home.features.quality.title,
                desc: t.home.features.quality.description,
                color: '#3b82f6',
              },
              {
                number: '02',
                icon: <Sun className="w-6 h-6" />,
                title: t.home.features.trust.title,
                desc: t.home.features.trust.description,
                color: '#d4a843',
              },
              {
                number: '03',
                icon: <Magnet className="w-6 h-6" />,
                title: t.home.features.support.title,
                desc: t.home.features.support.description,
                color: '#10b981',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-10 relative overflow-hidden hover:shadow-[0_0_0_2px_#d4a843] transition-all duration-500"
                style={{
                  opacity: craftVisible ? 1 : 0,
                  transform: craftVisible ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${(i + 1) * 150}ms`,
                  transitionDuration: '700ms',
                }}
              >
                {/* Large number watermark */}
                <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-neutral-50 select-none group-hover:text-[#d4a843]/5 transition-colors duration-500 leading-none">
                  {feature.number}
                </span>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}18`, color: feature.color }}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-[#c9972f] transition-colors duration-300 relative">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm relative">
                  {feature.desc}
                </p>

                {/* Bottom slide-in accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a843] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           PRODUCT SHOWCASE — Immersive Dark Carousel
      ══════════════════════════════════════════════════════════ */}
      <section ref={showcaseRef} className="py-28 bg-[#09090f] overflow-hidden relative">
        {/* Ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgba(212,168,67,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_70%_50%,rgba(59,130,246,0.04),transparent)]" />

        <div className="container-custom relative">

          {/* Section header */}
          <div
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: showcaseVisible ? 1 : 0, transform: showcaseVisible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Our Product</span>
              <div className="w-8 h-px bg-[#d4a843]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              {t.business.cardProtector.title}
            </h2>
            <p className="text-[#6b7280] max-w-xl mx-auto leading-relaxed">
              {t.business.cardProtector.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Carousel */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: showcaseVisible ? 1 : 0,
                transform: showcaseVisible ? 'translateX(0)' : 'translateX(-32px)',
                transitionDelay: '200ms',
              }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#111]">
                {/* Ambient inside */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#d4a843]/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Slides */}
                <div className="relative w-full h-full">
                  {featureImages.map((img, index) => (
                    <div
                      key={index}
                      className="absolute inset-0 transition-all duration-[1000ms] ease-out"
                      style={{
                        opacity: activeFeature === index ? 1 : 0,
                        transform: activeFeature === index ? 'scale(1)' : 'scale(1.04)',
                      }}
                    >
                      <Image
                        src={getImagePath(img)}
                        alt={`Feature detail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090f]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={prevFeature}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#d4a843]/20 backdrop-blur-md border border-white/10 hover:border-[#d4a843]/40 rounded-full flex items-center justify-center z-20 transition-all group"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-[#d4a843]" />
                </button>
                <button
                  onClick={nextFeature}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#d4a843]/20 backdrop-blur-md border border-white/10 hover:border-[#d4a843]/40 rounded-full flex items-center justify-center z-20 transition-all group"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-[#d4a843]" />
                </button>

                {/* Progress dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {featureImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToFeature(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: activeFeature === i ? '24px' : '6px',
                        height: '6px',
                        backgroundColor: activeFeature === i ? '#d4a843' : 'rgba(255,255,255,0.25)',
                      }}
                    />
                  ))}
                </div>

                {/* Counter */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="text-white/35 text-xs font-mono tracking-widest">
                    0{activeFeature + 1} / 0{featureImages.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: showcaseVisible ? 1 : 0,
                transform: showcaseVisible ? 'translateX(0)' : 'translateX(32px)',
                transitionDelay: '400ms',
              }}
            >
              <div className="space-y-1">
                {t.business.cardProtector.features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => goToFeature(index)}
                    className="flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-300 border"
                    style={{
                      backgroundColor: activeFeature === index ? 'rgba(212,168,67,0.08)' : 'transparent',
                      borderColor: activeFeature === index ? 'rgba(212,168,67,0.25)' : 'transparent',
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: activeFeature === index ? '#d4a843' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <span
                        className="text-xs font-bold transition-colors duration-300"
                        style={{ color: activeFeature === index ? '#000' : 'rgba(255,255,255,0.3)' }}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <span
                      className="text-sm leading-relaxed flex-1 transition-colors duration-300"
                      style={{ color: activeFeature === index ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)' }}
                    >
                      {feature}
                    </span>

                    {activeFeature === index && (
                      <ChevronRight className="w-4 h-4 text-[#d4a843] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Play/pause */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/40 transition-all"
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
                <span className="text-white/25 text-xs tracking-wider uppercase">
                  {isPaused ? 'Paused' : 'Auto-playing'}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-10">
                <a
                  href={t.home.hero.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4a843] text-black font-semibold rounded-xl hover:bg-[#e5bc5a] transition-all duration-200 shadow-[0_8px_32px_rgba(212,168,67,0.3)] group"
                >
                  {t.business.cardProtector.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
           RETAIL PARTNERS
      ══════════════════════════════════════════════════════════ */}
      <RetailPartners />

      {/* ══════════════════════════════════════════════════════════
           FINAL CTA — Dramatic Stage
      ══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-32 bg-[#09090f] relative overflow-hidden">
        {/* Gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(212,168,67,0.1),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/30 to-transparent" />

        {/* Giant decorative star watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[22rem] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.012)' }}>★</span>
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

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-[1.1] mb-6">
              {t.home.cta.title}
            </h2>

            <p className="text-[#6b7280] text-lg max-w-xl mx-auto leading-relaxed mb-12">
              {t.home.cta.description}
            </p>

            <a
              href={t.home.cta.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#d4a843] text-black font-bold text-lg rounded-xl hover:bg-[#e5bc5a] active:scale-95 transition-all duration-200 shadow-[0_8px_40px_rgba(212,168,67,0.4)] hover:shadow-[0_16px_60px_rgba(212,168,67,0.6)] group"
            >
              {t.home.cta.button}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
