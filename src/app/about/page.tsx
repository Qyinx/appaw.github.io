'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, Heart, Users, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import StatsGrid from '@/components/ui/StatsGrid';

// Scroll-reveal hook
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

export default function AboutPage() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);

  const storyReveal   = useReveal();
  const missionReveal = useReveal();
  const valuesReveal  = useReveal();
  const trustReveal   = useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const values = [
    { icon: Award, number: '01', title: t.about.values.quality.title,   description: t.about.values.quality.description,   color: '#3b82f6' },
    { icon: Heart, number: '02', title: t.about.values.integrity.title,  description: t.about.values.integrity.description,  color: '#D4899A' },
    { icon: Zap,   number: '03', title: t.about.values.passion.title,    description: t.about.values.passion.description,    color: '#818cf8' },
    { icon: Users, number: '04', title: t.about.values.service.title,    description: t.about.values.service.description,    color: '#8b5cf6' },
  ];

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
           HERO — Cinematic Dark
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-[#1e1e2e] pt-20">
        {/* Ambient gold glow bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_110%,rgba(212,137,154,0.12),transparent)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="relative container-custom py-24 z-10">
          <div
            className="max-w-3xl transition-all duration-1000"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 border border-[#D4899A]/40 rounded-full px-5 py-2 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4899A] animate-pulse" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Our Story</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight text-white mb-6">
              {t.about.title}
            </h1>

            {/* Gold rule */}
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-px bg-[#D4899A]" />
              <div className="w-2 h-2 rounded-full bg-[#D4899A]" />
              <div className="w-24 h-px bg-[#D4899A]/30" />
            </div>

            <p className="text-[#9ca3af] text-lg md:text-xl leading-relaxed max-w-xl">
              {t.about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           STORY — Two-column editorial
      ══════════════════════════════════════════ */}
      <section ref={storyReveal.ref} className="py-28 bg-white overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div
              className="transition-all duration-1000"
              style={{ opacity: storyReveal.visible ? 1 : 0, transform: storyReveal.visible ? 'translateX(0)' : 'translateX(-32px)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#D4899A]" />
                <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Who We Are</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1] mb-6">
                {t.about.story.title}
              </h2>
              <p className="text-neutral-500 text-base leading-relaxed mb-8">
                {t.about.story.content}
              </p>
              {/* Founder attribution — E-E-A-T signal */}
              <div className="flex items-center gap-3 mb-10 pt-5 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-full bg-[#D4899A]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D4899A] text-sm font-black">{t.about.story.founderName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-neutral-900 text-sm font-semibold">{t.about.story.founderName}</p>
                  <p className="text-neutral-400 text-xs">{t.about.story.founderRole}</p>
                </div>
              </div>
              <a
                href="/business"
                className="inline-flex items-center gap-2 text-[#D4899A] font-semibold text-sm group"
              >
                <span>See Our Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Visual */}
            <div
              className="relative transition-all duration-1000"
              style={{ opacity: storyReveal.visible ? 1 : 0, transform: storyReveal.visible ? 'translateX(0)' : 'translateX(32px)', transitionDelay: '200ms' }}
            >
              {/* Rotating ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-[#D4899A]/10 animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-56 h-56 rounded-full border border-[#D4899A]/15 animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* Product frame */}
              <div className="relative mx-auto w-72 bg-gradient-to-b from-[#252538] to-[#181828] rounded-3xl p-8 border border-[#D4899A]/20 shadow-[0_40px_80px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(212,137,154,0.15)]">
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#D4899A]/50" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#D4899A]/50" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#D4899A]/50" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#D4899A]/50" />

                <Image
                  src={getImagePath('/images/logo.png')}
                  alt="Appaw Store"
                  width={160}
                  height={160}
                  className="mx-auto"
                />
                <div className="mt-5 text-center">
                  <p className="text-[#D4899A]/60 text-[10px] uppercase tracking-[0.2em]">Established</p>
                  <p className="text-white text-sm font-semibold mt-1">Appaw Store · Hong Kong</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           MISSION — Dark centred statement
      ══════════════════════════════════════════ */}
      <section ref={missionReveal.ref} className="py-28 bg-[#1e1e2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,137,154,0.06),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />

        <div className="container-custom relative">
          <div
            className="max-w-3xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: missionReveal.visible ? 1 : 0, transform: missionReveal.visible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            {/* Decorative line + dot */}
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#D4899A]/40" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Our Mission</span>
              <div className="w-14 h-px bg-[#D4899A]/40" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-8">
              {t.about.mission.title}
            </h2>

            {/* Large quote-style text */}
            <p className="text-[#9ca3af] text-lg leading-relaxed">
              {t.about.mission.content}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           VALUES — Editorial card grid
      ══════════════════════════════════════════ */}
      <section ref={valuesReveal.ref} className="py-28 bg-white overflow-hidden">
        <div className="container-custom">

          {/* Header */}
          <div
            className="max-w-xl mb-20 transition-all duration-700"
            style={{ opacity: valuesReveal.visible ? 1 : 0, transform: valuesReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#D4899A]" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">What Drives Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1]">
              {t.about.values.title}
            </h2>
          </div>

          {/* Cards — same gap-px editorial pattern */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 border border-neutral-100">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="group bg-white p-10 relative overflow-hidden hover:shadow-[0_0_0_2px_#D4899A] transition-all duration-500"
                  style={{
                    opacity: valuesReveal.visible ? 1 : 0,
                    transform: valuesReveal.visible ? 'translateY(0)' : 'translateY(32px)',
                    transitionDelay: `${(i + 1) * 100}ms`,
                    transitionDuration: '700ms',
                  }}
                >
                  {/* Watermark number */}
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-neutral-50 select-none leading-none group-hover:text-[#D4899A]/5 transition-colors duration-500">
                    {value.number}
                  </span>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 relative"
                    style={{ backgroundColor: `${value.color}18`, color: value.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-[#c9972f] transition-colors duration-300 relative">
                    {value.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed relative">
                    {value.description}
                  </p>

                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4899A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           TRUST — Dark stats stage
      ══════════════════════════════════════════ */}
      <section ref={trustReveal.ref} className="py-28 bg-[#1e1e2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(212,137,154,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/25 to-transparent" />

        <div className="container-custom relative">
          <div
            className="max-w-2xl mx-auto text-center mb-20 transition-all duration-700"
            style={{ opacity: trustReveal.visible ? 1 : 0, transform: trustReveal.visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-[#D4899A]/40" />
              <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">By The Numbers</span>
              <div className="w-14 h-px bg-[#D4899A]/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-6">
              {t.about.trust.title}
            </h2>
            <p className="text-[#9ca3af] text-base leading-relaxed">
              {t.about.trust.description}
            </p>
          </div>

          {/* Stats grid */}
          <StatsGrid
            isVisible={trustReveal.visible}
            theme="dark"
            stats={[
              { value: 1200, suffix: '+', label: t.about.trust.stats.cardsProtected, sub: t.about.trust.stats.andCounting      },
              { value: 100, suffix: '+', label: t.about.trust.stats.happyCustomers,  sub: t.about.trust.stats.worldwide         },
              { value: 99,  suffix: '%', label: t.about.trust.stats.satisfaction,    sub: t.about.trust.stats.customerVerified  },
              { value: 1,   suffix: '+', label: t.about.trust.stats.yearsOfCraft,    sub: t.about.trust.stats.ofExcellence      },
            ]}
          />
        </div>
      </section>

    </div>
  );
}
