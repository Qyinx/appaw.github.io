/* ─────────────────────────────────────────────────────
   REPLACED — full dark redesign (April 2026)
   • All sections unified to #09090f dark background
   • PSA service: gold (#d4a843) accent
   • Trading service: emerald (#818cf8) accent
   • Hero: ambient orbs + scan line + staggered headline
   • Jump links: colour-coded pill style
   ───────────────────────────────────────────────────── */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, ArrowRight, Check, Repeat, TrendingUp, Star } from 'lucide-react';
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
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function BusinessClient() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const protectorReveal = useReveal();
  const tradingReveal   = useReveal();
  const ctaReveal       = useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
           HERO — Cinematic Dark
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-[#09090f] pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_110%,rgba(212,168,67,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-[10%] w-[420px] h-[420px] rounded-full bg-[rgba(212,168,67,0.05)] blur-[90px] pointer-events-none animate-[orb-drift-a_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[10%] w-72 h-72 rounded-full bg-[rgba(129,140,248,0.04)] blur-[70px] pointer-events-none animate-[orb-drift-b_20s_ease-in-out_3s_infinite]" />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/15 to-transparent animate-[scan-line_8s_linear_2s_infinite]" />
        </div>

        <div className="relative container-custom py-24 z-10">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-5 py-2 mb-10 transition-all duration-700"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '100ms' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Our Services</span>
            </div>

            {/* Staggered headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight mb-6">
              <div className="overflow-hidden">
                <span
                  className="block text-white"
                  style={heroVisible
                    ? { animation: 'line-rise 0.9s cubic-bezier(0.16,1,0.3,1) 200ms both' }
                    : { transform: 'translateY(110%)', opacity: 0 }
                  }
                >
                  {t.business.title}
                </span>
              </div>
              <div className="overflow-hidden mt-1">
                <span
                  className="block text-[#d4a843]"
                  style={heroVisible
                    ? { animation: 'line-rise 0.9s cubic-bezier(0.16,1,0.3,1) 380ms both' }
                    : { transform: 'translateY(110%)', opacity: 0 }
                  }
                >
                  {t.business.subtitle}
                </span>
              </div>
            </h1>

            {/* Divider */}
            <div
              className="flex items-center justify-center gap-4 mb-7 transition-all duration-700"
              style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '600ms' }}
            >
              <div className="w-12 h-px bg-[#d4a843]" />
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
              <div className="w-12 h-px bg-[#d4a843]" />
            </div>

            {/* Jump links — gold for PSA, emerald for Trading */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 mt-14 transition-all duration-700"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '750ms' }}
            >
              <a href="#protector" className="group inline-flex items-center gap-3 border border-[#d4a843]/40 hover:border-[#d4a843] hover:bg-[#d4a843]/5 px-7 py-3.5 rounded-full transition-all duration-300">
                <Shield className="w-4 h-4 text-[#d4a843]" />
                <span className="text-white text-sm font-medium">{t.business.cardProtector.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4a843] group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#trading" className="group inline-flex items-center gap-3 border border-[#818cf8]/40 hover:border-[#818cf8] hover:bg-[#818cf8]/5 px-7 py-3.5 rounded-full transition-all duration-300">
                <Repeat className="w-4 h-4 text-[#818cf8]" />
                <span className="text-white text-sm font-medium">{t.business.cardTrading.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#818cf8] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           SERVICE 01 — PSA Card Protector
      ══════════════════════════════════════════ */}
      <section id="protector" ref={protectorReveal.ref} className="py-28 bg-[#09090f] overflow-hidden scroll-mt-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_15%_50%,rgba(212,168,67,0.04),transparent)]" />
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text side */}
            <div
              className="transition-all duration-1000"
              style={{ opacity: protectorReveal.visible ? 1 : 0, transform: protectorReveal.visible ? 'translateX(0)' : 'translateX(-32px)' }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#d4a843]" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Service 01</span>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-[#d4a843]/30 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-[#d4a843]" />
                <span className="text-[#d4a843] text-xs uppercase tracking-[0.2em] font-medium">Premium Protection</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-6">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-[#9ca3af] text-base leading-relaxed mb-10">
                {t.business.cardProtector.description}
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-12">
                {t.business.cardProtector.features.slice(0, 4).map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 transition-all duration-500"
                    style={{
                      opacity: protectorReveal.visible ? 1 : 0,
                      transform: protectorReveal.visible ? 'translateX(0)' : 'translateX(-16px)',
                      transitionDelay: `${300 + i * 100}ms`,
                    }}
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#d4a843]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#d4a843]" />
                    </div>
                    <span className="text-white/60 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/products/psa-protectors"
                className="group inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.25)]"
              >
                <span>View Product</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Product visual */}
            <div
              className="relative transition-all duration-1000"
              style={{ opacity: protectorReveal.visible ? 1 : 0, transform: protectorReveal.visible ? 'translateX(0)' : 'translateX(32px)', transitionDelay: '200ms' }}
            >
              {/* Rotating decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-[#d4a843]/8 animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-64 h-64 rounded-full border border-[#d4a843]/12 animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* Product frame */}
              <div className="relative mx-auto max-w-sm bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-10 border border-[#d4a843]/20 shadow-[0_40px_80px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(212,168,67,0.15)]">
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#d4a843]/50" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#d4a843]/50" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#d4a843]/50" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#d4a843]/50" />

                <div className="relative h-72 flex items-center justify-center">
                  <Image
                    src={getImagePath('/images/cards/069.SM-P.refine.png')}
                    alt="PSA Card Protector"
                    fill
                    className="object-contain"
                    sizes="320px"
                  />
                </div>

                {/* Feature chips below image */}
                <div className="flex flex-wrap justify-center gap-2 mt-8 pt-6 border-t border-white/10">
                  {['Aluminum Alloy', 'UV-Blocking Glass', 'N52 Magnets'].map((f) => (
                    <span key={f} className="px-3 py-1 border border-[#d4a843]/20 rounded-full text-[10px] text-[#d4a843]/60 uppercase tracking-wider">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           SERVICE 02 — TCG Trading & Brokerage
           Dark immersive section
      ══════════════════════════════════════════ */}
      <section id="trading" ref={tradingReveal.ref} className="py-28 bg-[#09090f] relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#818cf8]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#818cf8]/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(129,140,248,0.05),transparent)]" />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Visual — Card showcase on left */}
            <div
              className="order-2 lg:order-1 transition-all duration-1000"
              style={{ opacity: tradingReveal.visible ? 1 : 0, transform: tradingReveal.visible ? 'translateX(0)' : 'translateX(-32px)', transitionDelay: '200ms' }}
            >
              <div className="relative">
                {/* Ambient glow */}
                <div className="absolute -inset-6 bg-gradient-to-br from-[#818cf8]/10 via-transparent to-transparent rounded-[2rem] blur-2xl" />

                {/* Card stack */}
                <div className="relative p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#818cf8]" />
                      <span className="text-white/40 text-xs uppercase tracking-[0.2em]">{t.business.cardTrading.badge}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs">Active</span>
                    </div>
                  </div>

                  {/* Card fan display */}
                  <div className="relative h-64 flex items-center justify-center">
                    {[
                      { src: '/images/cards/192.SV-P.refine.png', rotate: -8, x: -30, delay: 0 },
                      { src: '/images/cards/105.SV-9.refine.png', rotate: 0,  x: 0,   delay: 100 },
                      { src: '/images/cards/069.SM-P.refine.png', rotate: 8,  x: 30,  delay: 200 },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="absolute w-36 h-48 rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:z-10 hover:scale-110"
                        style={{
                          transform: tradingReveal.visible
                            ? `rotate(${card.rotate}deg) translateX(${card.x}px)`
                            : 'rotate(0deg) translateX(0) scale(0.8)',
                          opacity: tradingReveal.visible ? 1 : 0,
                          transitionDelay: `${400 + card.delay}ms`,
                          zIndex: i === 1 ? 3 : i === 2 ? 2 : 1,
                        }}
                      >
                        <Image
                          src={getImagePath(card.src)}
                          alt="Graded trading card"
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                    {[
                      { value: '500+', label: t.business.cardTrading.stats.cardsTraded, icon: <Repeat className="w-3.5 h-3.5" /> },
                      { value: '5.0',  label: t.business.cardTrading.stats.avgRating,    icon: <Star className="w-3.5 h-3.5" /> },
                      { value: '85%',  label: t.business.cardTrading.stats.repeatClients,icon: <TrendingUp className="w-3.5 h-3.5" /> },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="text-center transition-all duration-500"
                        style={{
                          opacity: tradingReveal.visible ? 1 : 0,
                          transform: tradingReveal.visible ? 'translateY(0)' : 'translateY(12px)',
                          transitionDelay: `${600 + i * 100}ms`,
                        }}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[#818cf8] mb-1">
                          {s.icon}
                          <span className="text-xl font-bold">{s.value}</span>
                        </div>
                        <p className="text-white/30 text-[10px] uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text side — right */}
            <div
              className="order-1 lg:order-2 transition-all duration-1000"
              style={{ opacity: tradingReveal.visible ? 1 : 0, transform: tradingReveal.visible ? 'translateX(0)' : 'translateX(32px)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#818cf8]" />
                <span className="text-[#818cf8] text-xs uppercase tracking-[0.25em] font-medium">Service 02</span>
              </div>

              <div className="inline-flex items-center gap-2 border border-[#818cf8]/30 rounded-full px-4 py-1.5 mb-6">
                <Repeat className="w-3.5 h-3.5 text-[#818cf8]" />
                <span className="text-[#818cf8] text-xs uppercase tracking-[0.2em] font-medium">{t.business.cardTrading.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-6">
                {t.business.cardTrading.title}
              </h2>
              <p className="text-[#9ca3af] text-base leading-relaxed mb-10">
                {t.business.cardTrading.description}
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-12">
                {t.business.cardTrading.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 transition-all duration-500"
                    style={{
                      opacity: tradingReveal.visible ? 1 : 0,
                      transform: tradingReveal.visible ? 'translateX(0)' : 'translateX(16px)',
                      transitionDelay: `${300 + i * 100}ms`,
                    }}
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#818cf8]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#818cf8]" />
                    </div>
                    <span className="text-white/60 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/business/card-trading"
                  className="group inline-flex items-center gap-3 bg-[#818cf8] hover:bg-[#a5b4fc] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(129,140,248,0.35)]"
                >
                  <span>{t.business.cardTrading.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 border border-[#818cf8]/30 hover:border-[#818cf8] text-[#818cf8] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 hover:bg-[#818cf8]/5"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                  <span>{t.business.cta.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           CTA — Final dark stage
      ══════════════════════════════════════════ */}
      <section ref={ctaReveal.ref} className="py-28 bg-[#09090f] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(212,168,67,0.07),transparent)]" />
        <div className="container-custom relative">
          <div
            className="max-w-3xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: ctaReveal.visible ? 1 : 0, transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#d4a843]/40" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Get In Touch</span>
              <div className="w-14 h-px bg-[#d4a843]/40" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-6">
              {t.business.cta.title}
            </h2>
            <p className="text-[#9ca3af] text-base leading-relaxed mb-12 max-w-xl mx-auto">
              {t.business.cta.description}
            </p>

            <a
              href="https://wa.me/85292851189"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.25)]"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              {t.business.cta.whatsapp}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
