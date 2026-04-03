'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, ArrowRight, Check } from 'lucide-react';
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

export default function BusinessPage() {
  const { t } = useLanguage();
  const [heroVisible, setHeroVisible] = useState(false);
  const protectorReveal = useReveal();
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="relative container-custom py-24 z-10">
          <div
            className="max-w-3xl mx-auto text-center transition-all duration-1000"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <div className="inline-flex items-center gap-2.5 border border-[#d4a843]/40 rounded-full px-5 py-2 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
              <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">Our Product</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.08] tracking-tight text-white mb-6">
              {t.business.title}
            </h1>

            <div className="flex items-center justify-center gap-4 mb-7">
              <div className="w-12 h-px bg-[#d4a843]" />
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" />
              <div className="w-12 h-px bg-[#d4a843]" />
            </div>

            <p className="text-[#9ca3af] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {t.business.subtitle}
            </p>

            {/* Jump links */}
            <div className="flex items-center justify-center gap-6 mt-14">
              <a href="#protector" className="group inline-flex items-center gap-3 border border-[#d4a843]/30 hover:border-[#d4a843] px-8 py-3.5 transition-all duration-300 hover:bg-[#d4a843]/5">
                <Shield className="w-4 h-4 text-[#d4a843]" />
                <span className="text-white text-sm font-medium">{t.business.cardProtector.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4a843] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           SERVICE 01 — PSA Card Protector
           Full-width split: text left, floating product right
      ══════════════════════════════════════════ */}
      <section id="protector" ref={protectorReveal.ref} className="py-28 bg-white overflow-hidden scroll-mt-20">
        <div className="container-custom">
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

              <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1] mb-6">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-neutral-500 text-base leading-relaxed mb-10">
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
                    <span className="text-neutral-600 text-sm leading-relaxed">{feature}</span>
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
                    <span key={f} className="px-3 py-1 border border-white/10 rounded-full text-[10px] text-white/50 uppercase tracking-wider">
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
           CTA — Final dark stage
      ══════════════════════════════════════════ */}
      <section ref={ctaReveal.ref} className="py-28 bg-white relative overflow-hidden">
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

            <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1] mb-6">
              {t.business.cta.title}
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed mb-12 max-w-xl mx-auto">
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
