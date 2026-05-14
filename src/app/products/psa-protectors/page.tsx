'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Shield, ArrowRight, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, Pause, Play, Layers, Sun, Weight, Box, Palette } from 'lucide-react';
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

/* ─── FAQ Accordion ─── */
function FaqAccordion({ items, visible }: {
  items: { q: string; a: string }[];
  visible: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-white/[0.06]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
            }}
          >
            <button
              className="w-full flex items-start gap-5 py-6 text-left group"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span
                className="flex-shrink-0 text-[0.65rem] font-bold tracking-widest mt-0.5 font-mono transition-colors duration-300"
                style={{ color: isOpen ? '#D4899A' : 'rgba(255,255,255,0.18)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="flex-1 text-sm font-medium leading-relaxed transition-colors duration-300"
                style={{ color: isOpen ? 'white' : 'rgba(255,255,255,0.65)' }}
              >
                {item.q}
              </span>
              <ChevronDown
                className="flex-shrink-0 w-4 h-4 mt-0.5 transition-all duration-300"
                style={{
                  color: isOpen ? '#D4899A' : 'rgba(255,255,255,0.22)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-400"
              style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <div className="pl-9 pb-6">
                <div className="flex gap-4">
                  <div className="w-px bg-[#D4899A]/30 flex-shrink-0" />
                  <p className="text-white/45 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PSAProtectorPage() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const colorDir  = useRef<'left' | 'right'>('right');
  const prevColor  = useRef<number>(0);
  const selectColor = useCallback((i: number) => {
    colorDir.current = i > selectedColor ? 'right' : 'left';
    prevColor.current = selectedColor;
    setSelectedColor(i);
  }, [selectedColor]);

  const featuresReveal = useReveal();
  const colorsReveal   = useReveal();
  const compatReveal   = useReveal();
  const specsReveal    = useReveal();
  const faqReveal      = useReveal();
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
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#1e1e2e] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_50%,rgba(212,137,154,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e2e] to-transparent pointer-events-none" />

        <div className="relative container-custom py-20 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div
              className="transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
            >
              <div className="inline-flex items-center gap-2.5 border border-[#D4899A]/40 rounded-full px-5 py-2 mb-10">
                <Shield className="w-4 h-4 text-[#D4899A]" />
                <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">{t.psaProtectorPage.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight text-white mb-6">
                {t.business.cardProtector.title}
              </h1>

              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-px bg-[#D4899A]" />
                <div className="w-2 h-2 rounded-full bg-[#D4899A]" />
                <div className="w-24 h-px bg-[#D4899A]/30" />
              </div>

              <p className="text-[#9ca3af] text-lg md:text-xl leading-relaxed max-w-xl mb-12">
                {t.business.cardProtector.description}
              </p>

              <ShopNowButton
                label={t.business.cardProtector.cta}
                shopOptions={t.shopOptions}
                whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                buttonClassName="inline-flex items-center gap-3 bg-[#D4899A] hover:bg-[#E8A3B2] text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,137,154,0.35)]"
              />
            </div>

            {/* Product visual */}
            <div
              className="relative transition-all duration-1000"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateX(0)' : 'translateX(32px)', transitionDelay: '200ms' }}
            >
              {/* Spinning rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-[#D4899A]/8 animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-64 h-64 rounded-full border border-[#D4899A]/12 animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* Dark product frame */}
              <div className="relative mx-auto max-w-sm bg-gradient-to-b from-[#252538] to-[#181828] rounded-3xl p-8 border border-[#D4899A]/20 shadow-[0_40px_80px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(212,137,154,0.15)]">
                <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#D4899A]/50" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#D4899A]/50" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#D4899A]/50" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#D4899A]/50" />

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
      <section ref={featuresReveal.ref} className="py-28 bg-[#1e1e2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(212,137,154,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(59,130,246,0.04),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />

        <div className="container-custom relative">

          {/* Section header — centred */}
          <div
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: featuresReveal.visible ? 1 : 0, transform: featuresReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#D4899A]" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Details</span>
              <div className="w-8 h-px bg-[#D4899A]" />
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
                      backgroundColor: activeFeature === index ? 'rgba(212,137,154,0.08)' : 'transparent',
                      borderColor: activeFeature === index ? 'rgba(212,137,154,0.25)' : 'transparent',
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: activeFeature === index ? '#D4899A' : 'rgba(255,255,255,0.05)',
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
                      <ChevronRight className="w-4 h-4 text-[#D4899A] flex-shrink-0" />
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
                  buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-[#D4899A] text-black font-semibold rounded-xl hover:bg-[#E8A3B2] transition-all duration-200 shadow-[0_8px_32px_rgba(212,137,154,0.3)]"
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
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#D4899A]/8 rounded-full blur-3xl pointer-events-none" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2e]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={prevFeature}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#D4899A]/20 backdrop-blur-md border border-white/10 hover:border-[#D4899A]/40 rounded-full flex items-center justify-center z-20 transition-all group"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-[#D4899A]" />
                </button>
                <button
                  onClick={nextFeature}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-[#D4899A]/20 backdrop-blur-md border border-white/10 hover:border-[#D4899A]/40 rounded-full flex items-center justify-center z-20 transition-all group"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-[#D4899A]" />
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
                        backgroundColor: activeFeature === i ? '#D4899A' : 'rgba(255,255,255,0.25)',
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
        // Ordered: warm solids → warm gradients → cool gradients → cool solids
        const colors = [
          { name: t.psaProtectorPage.colorVariants.colors.gold,           hex: '#f0c96a', hex2: undefined,  accent: '#f8de98', glow: 'rgba(240,200,106,0.16)', ring: 'rgba(240,200,106,0.6)',  image: '/images/describe/color/color-gold.png' },
          { name: t.psaProtectorPage.colorVariants.colors.silver,         hex: '#d4b800', hex2: undefined,  accent: '#ffe033', glow: 'rgba(210,180,0,0.22)',   ring: 'rgba(255,220,0,0.7)',    image: '/images/describe/color/color-yellow.png' },
          { name: t.psaProtectorPage.colorVariants.colors.goldenEmberRed, hex: '#d4a030', hex2: '#b82020', accent: '#e07040', glow: 'rgba(192,80,32,0.16)',   ring: 'rgba(220,120,60,0.6)',   image: '/images/describe/color/color-golden-ember-red.png' },
          { name: t.psaProtectorPage.colorVariants.colors.blueDarkGrey,   hex: '#4a76a8', hex2: '#404858', accent: '#5080b0', glow: 'rgba(46,64,96,0.18)',    ring: 'rgba(100,140,180,0.5)',  image: '/images/describe/color/color-blue-dark-grey.png' },
          { name: t.psaProtectorPage.colorVariants.colors.roseTintedBlue, hex: '#c86888', hex2: '#4868b8', accent: '#b090c8', glow: 'rgba(128,96,152,0.14)',  ring: 'rgba(180,140,200,0.5)',  image: '/images/describe/color/color-rose-tinted-bule.png' },
          { name: t.psaProtectorPage.colorVariants.colors.navy,           hex: '#6b3fa0', hex2: undefined,  accent: '#9b6fd4', glow: 'rgba(107,63,160,0.18)',  ring: 'rgba(155,111,212,0.55)', image: '/images/describe/color/color-purple.png' },
          { name: t.psaProtectorPage.colorVariants.colors.forestGreen,    hex: '#2d5a3d', hex2: undefined,  accent: '#3d7a52', glow: 'rgba(45,90,61,0.14)',    ring: 'rgba(61,122,82,0.6)',    image: '/images/describe/color/color-green.png' },
          { name: t.psaProtectorPage.colorVariants.colors.dark,           hex: '#1a1a2e', hex2: undefined,  accent: '#3a3a50', glow: 'rgba(26,26,46,0.28)',    ring: 'rgba(80,80,110,0.55)',   image: '/images/describe/color/color-dark.png' },
        ];
        const active = colors[selectedColor];

        return (
          <section ref={colorsReveal.ref} className="py-24 md:py-32 bg-[#1e1e2e] relative overflow-hidden">

            {/* Reactive aurora background — fades in after section reveals to avoid jarring first load */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute w-[700px] h-[700px] rounded-full blur-[160px] animate-[auroraOrbit_14s_ease-in-out_infinite]"
                style={{
                  backgroundColor: active.glow,
                  top: '-15%', right: '-5%',
                  opacity: colorsReveal.visible ? 1 : 0,
                  transition: 'background-color 1.2s ease, opacity 2s ease 0.5s',
                }}
              />
              <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[140px] animate-[auroraOrbit_20s_ease-in-out_infinite_reverse]"
                style={{
                  backgroundColor: active.ring,
                  bottom: '-5%', left: '-5%',
                  opacity: colorsReveal.visible ? 0.045 : 0,
                  transition: 'background-color 1.2s ease, opacity 2s ease 0.7s',
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
            </div>

            {/* Reactive edge hairlines */}
            <div className="absolute top-0 left-0 right-0 h-px transition-all duration-1000" style={{ background: `linear-gradient(to right, transparent 10%, ${active.ring} 50%, transparent 90%)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-1000" style={{ background: `linear-gradient(to right, transparent 10%, ${active.ring} 50%, transparent 90%)` }} />

            <div className="container-custom relative">

              {/* Section header — left-aligned */}
              <div
                className="mb-14 transition-all duration-700"
                style={{ opacity: colorsReveal.visible ? 1 : 0, transform: colorsReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px transition-colors duration-700" style={{ backgroundColor: active.accent }} />
                  <span className="text-xs uppercase tracking-[0.3em] font-medium transition-colors duration-700" style={{ color: active.accent }}>
                    <Palette className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                    {t.psaProtectorPage.colorVariants.badge}
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
                  {t.psaProtectorPage.colorVariants.title}
                </h2>
                <p className="text-[#9ca3af] text-base max-w-lg leading-relaxed">
                  {t.psaProtectorPage.colorVariants.subtitle}
                </p>
              </div>

              {/* Two-column: image left / controls right */}
              <div
                className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center"
                style={{
                  opacity: colorsReveal.visible ? 1 : 0,
                  transform: colorsReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                  transition: 'opacity 0.9s ease 0.18s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.18s',
                }}
              >

                {/* ── LEFT: product image ── */}
                <div className="relative flex items-center justify-center" style={{ perspective: '1200px' }}>
                  {/* Decorative rings */}
                  <div className="absolute inset-[-12%] rounded-full border transition-colors duration-1000 animate-[spin_28s_linear_infinite] pointer-events-none" style={{ borderColor: `${active.ring}12` }} />
                  <div className="absolute inset-[-5%] rounded-full border transition-colors duration-1000 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" style={{ borderColor: `${active.ring}08` }} />
                  {/* Ambient glow — smooth color transition, no burst flash */}
                  <div
                    className="absolute inset-[-8%] rounded-full blur-[80px]"
                    style={{ backgroundColor: active.hex, opacity: 0.17, transition: 'background-color 0.8s ease' }}
                  />

                  {/* Image stack — crossfade with scale + blur dissolve */}
                  <div className="relative w-full aspect-square max-w-sm">
                    {colors.map((color, i) => {
                      const isActive = i === selectedColor;
                      return (
                        <div
                          key={i}
                          className="absolute inset-0"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'scale(1)' : 'scale(0.93)',
                            filter: isActive ? 'blur(0px)' : 'blur(4px)',
                            transition: isActive
                              ? 'opacity 0.55s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease'
                              : 'opacity 0.28s ease, transform 0.28s ease, filter 0.22s ease',
                            zIndex: isActive ? 2 : 1,
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                        >
                          <Image
                            src={getImagePath(color.image)}
                            alt={`PSA Protector – ${color.name}`}
                            fill
                            className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.65)] animate-[gentleFloat_6s_ease-in-out_infinite]"
                            sizes="(max-width: 1024px) 80vw, 480px"
                            priority={i === 0}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Reflection */}
                  <div className="absolute left-[12%] right-[12%] top-[90%] h-[22%] overflow-hidden opacity-[0.07] blur-[3px] pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
                    <div className="relative w-full h-full">
                      <Image src={getImagePath(active.image)} alt="" fill className="object-contain" sizes="280px" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: colour selector & CTA ── */}
                <div>

                  {/* Active colour name + gradient badge */}
                  <div className="mb-10">
                    <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-3">
                      {t.psaProtectorPage.colorVariants.pickColor}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        key={selectedColor}
                        className="font-display text-5xl md:text-6xl font-bold text-white animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both] leading-none tracking-tight"
                      >
                        {active.name}
                      </span>
                      {active.hex2 && (
                        <span
                          className="self-end mb-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-bold border rounded-full"
                          style={{
                            borderColor: `${active.ring}50`,
                            color: active.accent,
                            background: `linear-gradient(135deg, ${active.hex}20, ${active.hex2}20)`,
                          }}
                        >
                          Gradient
                        </span>
                      )}
                    </div>
                    {/* Reactive underline */}
                    <div
                      className="mt-4 h-px w-16 transition-all duration-700"
                      style={{ background: `linear-gradient(to right, ${active.accent}, transparent)` }}
                    />
                  </div>

                  {/* Swatch chip grid — 4 columns, rectangular chips + name labels */}
                  <div className="grid grid-cols-4 gap-3 mb-10">
                    {colors.map((color, i) => {
                      const isActive = selectedColor === i;
                      return (
                        <button
                          key={i}
                          onClick={() => selectColor(i)}
                          aria-label={color.name}
                          aria-pressed={isActive}
                          className="group flex flex-col items-center gap-2 transition-all duration-300"
                        >
                          {/* Rectangular colour chip */}
                          <div className="relative w-full">
                            <div
                              className="w-full h-9 rounded-lg"
                              style={{
                                background: color.hex2
                                  ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex2} 100%)`
                                  : `linear-gradient(145deg, ${color.accent} 0%, ${color.hex} 65%)`,
                                boxShadow: isActive
                                  ? `0 0 0 1.5px #1e1e2e, 0 0 0 3px ${color.ring}, 0 8px 24px ${color.glow}`
                                  : '0 2px 8px rgba(0,0,0,0.45)',
                                transform: isActive ? 'scale(1.06) translateY(-3px)' : 'scale(1) translateY(0)',
                                transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
                              }}
                            />
                            {/* Ping ring fires once on activation */}
                            {isActive && (
                              <div
                                key={selectedColor}
                                className="absolute inset-0 rounded-lg pointer-events-none animate-[chipPing_0.55s_ease-out_both]"
                                style={{ border: `1.5px solid ${color.ring}` }}
                              />
                            )}
                          </div>
                          {/* Name label */}
                          <span
                            className="text-[11px] uppercase tracking-[0.12em] leading-tight text-center line-clamp-1 transition-colors duration-300 w-full"
                            style={{ color: isActive ? color.accent : 'rgba(255,255,255,0.28)' }}
                          >
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Note */}
                  <p className="text-white/20 text-xs leading-relaxed max-w-xs">
                    {t.psaProtectorPage.colorVariants.note}
                  </p>
                </div>

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
              <div className="w-8 h-px bg-[#D4899A]" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Fit Guide</span>
              <div className="w-8 h-px bg-[#D4899A]" />
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
              { icon: AlertCircle, accent: '#D4899A', accentBg: 'rgba(212,137,154,0.08)', title: t.psaProtectorPage.note, text: t.business.cardProtector.compatibility.note },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group bg-white p-10 relative overflow-hidden transition-all duration-700 hover:shadow-[0_0_0_2px_#D4899A]"
                  style={{
                    opacity: compatReveal.visible ? 1 : 0,
                    transform: compatReveal.visible ? 'translateY(0)' : 'translateY(24px)',
                    transitionDelay: `${(i + 1) * 120}ms`,
                  }}
                >
                  {/* Watermark number */}
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-neutral-50 select-none leading-none group-hover:text-[#D4899A]/5 transition-colors duration-500">
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
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4899A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,137,154,0.05),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />

        <div className="container-custom relative">

          {/* Header */}
          <div
            className="max-w-xl mb-20 transition-all duration-700"
            style={{ opacity: specsReveal.visible ? 1 : 0, transform: specsReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#D4899A]" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">{t.psaProtectorPage.techBadge}</span>
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
                  className="group bg-[#0d0d14] p-10 relative overflow-hidden hover:shadow-[0_0_0_1px_rgba(212,137,154,0.4)] transition-all duration-500"
                  style={{
                    opacity: specsReveal.visible ? 1 : 0,
                    transform: specsReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                    transitionDelay: `${(i + 1) * 100}ms`,
                    transitionDuration: '700ms',
                  }}
                >
                  {/* Watermark */}
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-white/[0.02] select-none leading-none group-hover:text-[#D4899A]/5 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-[#D4899A]/10 text-[#D4899A] transition-transform duration-500 group-hover:scale-110 relative">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4899A] transition-colors duration-300 relative">
                    {spec.label}
                  </h3>
                  <p className="text-[#D4899A] text-sm font-semibold mb-1 relative">{spec.value}</p>
                  <p className="text-white/35 text-xs leading-relaxed relative">{spec.desc}</p>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4899A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
           FAQ
      ══════════════════════════════════════════ */}
      <section ref={faqReveal.ref} className="py-28 bg-[#0d0d14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_15%_50%,rgba(212,137,154,0.05),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 xl:gap-24 items-start">

            {/* LEFT — sticky section header */}
            <div
              className="lg:sticky lg:top-32 transition-all duration-700"
              style={{ opacity: faqReveal.visible ? 1 : 0, transform: faqReveal.visible ? 'translateX(0)' : 'translateX(-24px)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#D4899A]" />
                <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">{t.psaProtectorPage.faq.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-5">
                {t.psaProtectorPage.faq.title}
              </h2>
              <p className="text-white/35 text-sm leading-relaxed mb-12">
                {t.psaProtectorPage.faq.subtitle}
              </p>

              {/* Decorative question count */}
              <div className="flex items-end gap-3 mb-10">
                <span className="text-[5.5rem] font-bold font-display leading-none select-none" style={{ color: 'rgba(255,255,255,0.04)' }}>
                  {t.psaProtectorPage.faq.items.length}
                </span>
                <span className="text-white/25 text-[0.65rem] uppercase tracking-[0.2em] leading-snug mb-4">
                  questions<br />answered
                </span>
              </div>

              <div className="h-px bg-white/[0.06] mb-10" />

              {/* Product stat mini-grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: '> 95%', l: 'UV Blocked' },
                  { v: 'N52',   l: 'Magnet Grade' },
                  { v: '74 g',  l: 'Weight' },
                  { v: '8',     l: 'Colors' },
                ].map((s) => (
                  <div key={s.l} className="border border-white/[0.06] rounded-xl px-4 py-3 hover:border-[#D4899A]/20 transition-colors duration-300">
                    <p className="text-[#D4899A] text-base font-bold leading-none mb-1">{s.v}</p>
                    <p className="text-white/30 text-[0.62rem] uppercase tracking-wider">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — accordion */}
            <div
              className="transition-all duration-700"
              style={{ opacity: faqReveal.visible ? 1 : 0, transform: faqReveal.visible ? 'translateX(0)' : 'translateX(24px)', transitionDelay: '150ms' }}
            >
              <FaqAccordion items={t.psaProtectorPage.faq.items} visible={faqReveal.visible} />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           CTA — Dark final stage
      ══════════════════════════════════════════ */}
      <section ref={ctaReveal.ref} className="py-28 bg-[#1e1e2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,137,154,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />

        <div className="container-custom relative">
          <div
            className="max-w-2xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: ctaReveal.visible ? 1 : 0, transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#D4899A]/40" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Shop Now</span>
              <div className="w-14 h-px bg-[#D4899A]/40" />
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
              buttonClassName="inline-flex items-center gap-3 bg-[#D4899A] hover:bg-[#E8A3B2] text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,137,154,0.35)]"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
