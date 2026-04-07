'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Shield, ArrowRight, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Pause, Play, Layers, Sun, Weight, Box, Palette } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';

/* ─── Scroll-reveal ─── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Feature data ─── */
const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

const CAROUSEL_INTERVAL = 4000;

export default function PSAProtectorPage() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const colorDir = useRef<'left' | 'right'>('right');
  const selectColor = useCallback((i: number) => {
    colorDir.current = i > selectedColor ? 'right' : 'left';
    setSelectedColor(i);
  }, [selectedColor]);

  const featuresReveal = useReveal();
  const colorsReveal   = useReveal();
  const compatReveal   = useReveal();
  const specsReveal    = useReveal();
  const ctaReveal      = useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  /* Carousel auto-advance */
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureImages.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, activeFeature]);

  const goToFeature = useCallback((i: number) => { setActiveFeature(i); setIsPaused(false); }, []);
  const nextFeature = useCallback(() => setActiveFeature((p) => (p + 1) % featureImages.length), []);
  const prevFeature = useCallback(() => setActiveFeature((p) => (p - 1 + featureImages.length) % featureImages.length), []);

  /* Spec cards data */
  const specs = [
    { icon: Box,    label: t.psaProtectorPage.specs.size,         value: '8.7 × 14.2 × 0.98 cm', desc: t.psaProtectorPage.specs.sizeDesc },
    { icon: Weight, label: t.psaProtectorPage.specs.weight,       value: '74 g',                   desc: t.psaProtectorPage.specs.weightDesc },
    { icon: Layers, label: t.psaProtectorPage.specs.materials,    value: t.psaProtectorPage.specs.materialsValue, desc: t.psaProtectorPage.specs.materialsDesc },
    { icon: Sun,    label: t.psaProtectorPage.specs.uvProtection, value: '> 95 %',                 desc: t.psaProtectorPage.specs.uvProtectionDesc },
  ];

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
           HERO — Cinematic Dark, split layout
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#09090f] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_50%,rgba(212,168,67,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090f] to-transparent pointer-events-none" />

        <div className="relative container-custom py-20 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div
              className="transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
            >
              <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-5 py-2 mb-10">
                <Shield className="w-4 h-4 text-[#d4a843]" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{t.psaProtectorPage.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight text-white mb-6">
                {t.business.cardProtector.title}
              </h1>

              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-px bg-[#d4a843]" />
                <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
                <div className="w-24 h-px bg-[#d4a843]/30" />
              </div>

              <p className="text-[#9ca3af] text-lg md:text-xl leading-relaxed max-w-xl mb-12">
                {t.business.cardProtector.description}
              </p>

              <ShopNowButton
                label={t.business.cardProtector.cta}
                shopOptions={t.shopOptions}
                whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                buttonClassName="inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.35)]"
              />
            </div>

            {/* Product visual */}
            <div
              className="relative transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateX(0)' : 'translateX(32px)', transitionDelay: '200ms' }}
            >
              {/* Spinning rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-[#d4a843]/8 animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-64 h-64 rounded-full border border-[#d4a843]/12 animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* Dark product frame */}
              <div className="relative mx-auto max-w-sm bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 border border-[#d4a843]/20 shadow-[0_40px_80px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,168,67,0.15)]">
                <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#d4a843]/50" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#d4a843]/50" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#d4a843]/50" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#d4a843]/50" />

                <div className="relative aspect-[3/4]">
                  <Image
                    src={getImagePath('/images/cards/069.SM-P.refine.png')}
                    alt="PSA Card Aluminum Protector"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           FEATURES — Immersive Dark Carousel (mirrored)
      ══════════════════════════════════════════ */}
      <section ref={featuresReveal.ref} className="py-28 bg-[#09090f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(212,168,67,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(59,130,246,0.04),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />

        <div className="container-custom relative">

          {/* Section header — centred */}
          <div
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: featuresReveal.visible ? 1 : 0, transform: featuresReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Details</span>
              <div className="w-8 h-px bg-[#d4a843]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              {t.psaProtectorPage.featuresTitle}
            </h2>
            <p className="text-[#6b7280] max-w-xl mx-auto leading-relaxed">
              {t.psaProtectorPage.featuresSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Feature list — LEFT (mirrored from index right) */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: featuresReveal.visible ? 1 : 0,
                transform: featuresReveal.visible ? 'translateX(0)' : 'translateX(-32px)',
                transitionDelay: '200ms',
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

              {/* Play / pause */}
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
                <ShopNowButton
                  label={t.business.cardProtector.cta}
                  shopOptions={t.shopOptions}
                  whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                  buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-[#d4a843] text-black font-semibold rounded-xl hover:bg-[#e5bc5a] transition-all duration-200 shadow-[0_8px_32px_rgba(212,168,67,0.3)]"
                />
              </div>
            </div>

            {/* Carousel — RIGHT (mirrored from index left) */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: featuresReveal.visible ? 1 : 0,
                transform: featuresReveal.visible ? 'translateX(0)' : 'translateX(32px)',
                transitionDelay: '400ms',
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
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           COLORS — Color Variants Showcase
      ══════════════════════════════════════════ */}
      {(() => {
        const colors = [
          { name: t.psaProtectorPage.colorVariants.colors.black,       hex: '#1a1a1a', accent: '#3a3a3a', glow: 'rgba(80,80,80,0.14)',   ring: 'rgba(255,255,255,0.35)', image: '/images/describe/color-black.png' },
          { name: t.psaProtectorPage.colorVariants.colors.silver,      hex: '#c0c0c0', accent: '#e0e0e0', glow: 'rgba(192,192,192,0.12)', ring: 'rgba(192,192,192,0.6)',  image: '/images/describe/color-silver.png' },
          { name: t.psaProtectorPage.colorVariants.colors.gold,        hex: '#d4a843', accent: '#e5bc5a', glow: 'rgba(212,168,67,0.14)',  ring: 'rgba(212,168,67,0.7)',   image: '/images/describe/color-gold.png' },
          { name: t.psaProtectorPage.colorVariants.colors.roseGold,    hex: '#b76e79', accent: '#d4919c', glow: 'rgba(183,110,121,0.12)', ring: 'rgba(183,110,121,0.6)',  image: '/images/describe/color-rosegold.png' },
          { name: t.psaProtectorPage.colorVariants.colors.navy,        hex: '#1e3a5f', accent: '#2d5a8e', glow: 'rgba(30,58,95,0.16)',    ring: 'rgba(45,90,142,0.6)',    image: '/images/describe/color-navy.png' },
          { name: t.psaProtectorPage.colorVariants.colors.forestGreen, hex: '#2d5a3d', accent: '#3d7a52', glow: 'rgba(45,90,61,0.14)',    ring: 'rgba(61,122,82,0.6)',    image: '/images/describe/color-green.png' },
          { name: t.psaProtectorPage.colorVariants.colors.burgundy,    hex: '#6b2139', accent: '#8e3050', glow: 'rgba(107,33,57,0.14)',   ring: 'rgba(142,48,80,0.6)',    image: '/images/describe/color-burgundy.png' },
        ];
        const active  = colors[selectedColor];
        const dir     = colorDir.current;
        const slideIn = dir === 'right' ? 'translateX(0) scale(1) rotateY(0deg)' : 'translateX(0) scale(1) rotateY(0deg)';
        const slideOutGone = dir === 'right' ? 'translateX(-25%) scale(0.85) rotateY(8deg)' : 'translateX(25%) scale(0.85) rotateY(-8deg)';
        const slideInFrom  = dir === 'right' ? 'translateX(25%) scale(0.85) rotateY(-8deg)' : 'translateX(-25%) scale(0.85) rotateY(8deg)';
        return (
          <section ref={colorsReveal.ref} className="py-28 bg-[#09090f] relative overflow-hidden">

            {/* ─ Animated aurora background ─ */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Large orbiting aurora blob */}
              <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] animate-[auroraOrbit_12s_ease-in-out_infinite] transition-colors duration-1000"
                style={{ backgroundColor: active.glow, top: '10%', left: '20%' }}
              />
              {/* Secondary orbiting blob — counter direction */}
              <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-[auroraOrbit_16s_ease-in-out_infinite_reverse] transition-colors duration-1000"
                style={{ backgroundColor: active.ring, opacity: 0.07, bottom: '5%', right: '15%' }}
              />
              {/* Subtle noise-grain overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
            </div>

            {/* Top & bottom edge lines — color-reactive */}
            <div className="absolute top-0 left-0 right-0 h-px transition-all duration-700" style={{ background: `linear-gradient(to right, transparent 5%, ${active.ring} 50%, transparent 95%)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-700" style={{ background: `linear-gradient(to right, transparent 5%, ${active.ring} 50%, transparent 95%)` }} />

            <div className="container-custom relative">

              {/* Section header */}
              <div
                className="text-center mb-16 transition-all duration-700"
                style={{ opacity: colorsReveal.visible ? 1 : 0, transform: colorsReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
              >
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="w-8 h-px transition-colors duration-700" style={{ backgroundColor: active.accent }} />
                  <span className="text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-700" style={{ color: active.accent }}>
                    <Palette className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                    {t.psaProtectorPage.colorVariants.badge}
                  </span>
                  <div className="w-8 h-px transition-colors duration-700" style={{ backgroundColor: active.accent }} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
                  {t.psaProtectorPage.colorVariants.title}
                </h2>
                <p className="text-[#6b7280] max-w-xl mx-auto leading-relaxed">
                  {t.psaProtectorPage.colorVariants.subtitle}
                </p>
              </div>

              {/* Product showcase */}
              <div
                className="flex flex-col items-center transition-all duration-1000"
                style={{
                  opacity: colorsReveal.visible ? 1 : 0,
                  transform: colorsReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: '200ms',
                }}
              >
                <div className="relative w-full max-w-md mb-14" style={{ perspective: '1200px' }}>

                  {/* Orbiting ring — decorative */}
                  <div
                    className="absolute inset-[-15%] rounded-full border transition-colors duration-1000 animate-[spin_25s_linear_infinite] pointer-events-none"
                    style={{ borderColor: `${active.ring}15` }}
                  />
                  <div
                    className="absolute inset-[-8%] rounded-full border transition-colors duration-1000 animate-[spin_18s_linear_infinite_reverse] pointer-events-none"
                    style={{ borderColor: `${active.ring}10` }}
                  />

                  {/* Ambient glow behind the image */}
                  <div
                    className="absolute -inset-16 rounded-full blur-[100px] transition-all duration-1000 animate-[colorPulse_4s_ease-in-out_infinite]"
                    style={{ backgroundColor: active.hex, opacity: 0.25 }}
                  />

                  {/* Product image — direction-aware 3D slide */}
                  <div className="relative aspect-square" style={{ transformStyle: 'preserve-3d' }}>
                    {colors.map((color, i) => {
                      const isActive = selectedColor === i;
                      return (
                        <div
                          key={i}
                          className="absolute inset-0"
                          style={{
                            transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? slideIn : slideOutGone,
                            zIndex: isActive ? 2 : 1,
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                        >
                          <Image
                            src={getImagePath(color.image)}
                            alt={`PSA Protector – ${color.name}`}
                            fill
                            className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-[gentleFloat_6s_ease-in-out_infinite]"
                            sizes="(max-width: 768px) 90vw, 448px"
                            priority={i === 0}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Reflection — mirrored, faded */}
                  <div className="absolute left-[10%] right-[10%] top-[92%] h-[30%] overflow-hidden opacity-[0.08] blur-[2px] pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
                    <div className="relative w-full h-full">
                      <Image
                        src={getImagePath(active.image)}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="320px"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Color name — animated swap */}
                <div className="mb-8 text-center h-16 flex flex-col items-center justify-center">
                  <span
                    key={selectedColor}
                    className="text-white text-xl sm:text-2xl font-bold tracking-wide animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                  >
                    {active.name}
                  </span>
                  <span className="text-white/25 text-[0.65rem] mt-1.5 tracking-[0.3em] uppercase">
                    {t.psaProtectorPage.colorVariants.pickColor}
                  </span>
                </div>

                {/* Horizontal swatch row */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => selectColor(i)}
                      className="group relative flex flex-col items-center transition-all duration-300"
                      aria-label={color.name}
                    >
                      {/* Outer ring — visible when selected */}
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          boxShadow: selectedColor === i
                            ? `0 0 0 2.5px #09090f, 0 0 0 4.5px ${color.ring}, 0 0 20px ${color.glow}`
                            : 'none',
                          transform: selectedColor === i ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        {/* Inner swatch */}
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/15 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-md"
                          style={{ background: `linear-gradient(135deg, ${color.hex}, ${color.accent})` }}
                        />
                      </div>

                      {/* Active dot below swatch */}
                      <div
                        className="mt-2 w-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: selectedColor === i ? color.accent : 'transparent',
                          transform: selectedColor === i ? 'scale(1)' : 'scale(0)',
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Info note */}
                <p className="text-white/20 text-xs leading-relaxed text-center max-w-md">
                  {t.psaProtectorPage.colorVariants.note}
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══════════════════════════════════════════
           COMPATIBILITY — Luxury Fit Guide
      ══════════════════════════════════════════ */}
      <section ref={compatReveal.ref} className="py-28 bg-white overflow-hidden">
        <div className="container-custom">

          {/* Centred header */}
          <div
            className="max-w-2xl mx-auto text-center mb-20 transition-all duration-700"
            style={{ opacity: compatReveal.visible ? 1 : 0, transform: compatReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Fit Guide</span>
              <div className="w-8 h-px bg-[#d4a843]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1] mb-4">
              {t.psaProtectorPage.compatibilityTitle}
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed max-w-lg mx-auto">{t.psaProtectorPage.compatibilitySubtitle}</p>
          </div>

          {/* 3-column balanced gap-px editorial grid */}
          <div className="grid md:grid-cols-3 gap-px bg-neutral-100 border border-neutral-100 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, accent: '#16a34a', accentBg: 'rgba(22,163,74,0.08)', title: t.psaProtectorPage.compatible, text: t.business.cardProtector.compatibility.fits },
              { icon: XCircle,     accent: '#dc2626', accentBg: 'rgba(220,38,38,0.08)', title: t.psaProtectorPage.notCompatible, text: t.business.cardProtector.compatibility.notFits },
              { icon: AlertCircle, accent: '#d4a843', accentBg: 'rgba(212,168,67,0.08)', title: t.psaProtectorPage.note, text: t.business.cardProtector.compatibility.note },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group bg-white p-10 relative overflow-hidden transition-all duration-700 hover:shadow-[0_0_0_2px_#d4a843]"
                  style={{
                    opacity: compatReveal.visible ? 1 : 0,
                    transform: compatReveal.visible ? 'translateY(0)' : 'translateY(24px)',
                    transitionDelay: `${(i + 1) * 120}ms`,
                  }}
                >
                  {/* Watermark number */}
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-neutral-50 select-none leading-none group-hover:text-[#d4a843]/5 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 transition-transform duration-500 origin-left" style={{ backgroundColor: item.accent, transform: 'scaleX(1)' }} />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-transform duration-500 group-hover:scale-110 relative"
                    style={{ backgroundColor: item.accentBg, color: item.accent }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-[#c9972f] transition-colors duration-300 relative">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed relative">
                    {item.text}
                  </p>

                  {/* Bottom slide-in accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a843] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           SPECS — Dark editorial card grid
      ══════════════════════════════════════════ */}
      <section ref={specsReveal.ref} className="py-28 bg-[#0d0d14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,168,67,0.05),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />

        <div className="container-custom relative">

          {/* Header */}
          <div
            className="max-w-xl mb-20 transition-all duration-700"
            style={{ opacity: specsReveal.visible ? 1 : 0, transform: specsReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#d4a843]" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">{t.psaProtectorPage.techBadge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-4">
              {t.psaProtectorPage.techTitle}
            </h2>
            <p className="text-white/40 text-base leading-relaxed">{t.psaProtectorPage.techSubtitle}</p>
          </div>

          {/* Spec cards — dark gap-px editorial */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {specs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div
                  key={i}
                  className="group bg-[#0d0d14] p-10 relative overflow-hidden hover:shadow-[0_0_0_1px_rgba(212,168,67,0.4)] transition-all duration-500"
                  style={{
                    opacity: specsReveal.visible ? 1 : 0,
                    transform: specsReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                    transitionDelay: `${(i + 1) * 100}ms`,
                    transitionDuration: '700ms',
                  }}
                >
                  {/* Watermark */}
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-white/[0.02] select-none leading-none group-hover:text-[#d4a843]/5 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-[#d4a843]/10 text-[#d4a843] transition-transform duration-500 group-hover:scale-110 relative">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4a843] transition-colors duration-300 relative">
                    {spec.label}
                  </h3>
                  <p className="text-[#d4a843] text-sm font-semibold mb-1 relative">{spec.value}</p>
                  <p className="text-white/35 text-xs leading-relaxed relative">{spec.desc}</p>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a843] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           RETAIL PARTNERS
      ══════════════════════════════════════════ */}
      <RetailPartners />

      {/* ══════════════════════════════════════════
           CTA — Dark final stage
      ══════════════════════════════════════════ */}
      <section ref={ctaReveal.ref} className="py-28 bg-[#09090f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,168,67,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />

        <div className="container-custom relative">
          <div
            className="max-w-2xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: ctaReveal.visible ? 1 : 0, transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#d4a843]/40" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Shop Now</span>
              <div className="w-14 h-px bg-[#d4a843]/40" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-6">
              {t.psaProtectorPage.ctaTitle}
            </h2>
            <p className="text-[#9ca3af] text-base leading-relaxed mb-12 max-w-xl mx-auto">
              {t.psaProtectorPage.ctaSubtitle}
            </p>

            <ShopNowButton
              label={t.business.cardProtector.cta}
              shopOptions={t.shopOptions}
              whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
              buttonClassName="inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.35)]"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
