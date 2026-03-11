'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Globe, Store } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

type StoreType = 'online' | 'retail';

interface Partner {
  id: string;
  logo?: string;
  link: string;
  type: StoreType;
}

const partners: Partner[] = [
  {
    id: 'appawstore',
    logo: '/images/logo.png',
    link: '',
    type: 'online',
  },
  {
    id: 'cardtheland',
    logo: '/images/partners/cardtheland.png',
    link: 'https://www.instagram.com/cardtheland_tcg/',
    type: 'retail',
  },
];

export default function RetailPartners() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const sortedPartners = [
    ...partners.filter(p => p.type === 'online'),
    ...partners.filter(p => p.type === 'retail'),
  ];

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-white relative overflow-hidden"
    >
      {/* Subtle warm ambient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_80%,rgba(212,168,67,0.04),transparent)] pointer-events-none" />
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />

      <div className="container-custom relative">

        {/* ── Section Header ─────────────────────────── */}
        <div
          className="max-w-xl mb-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#d4a843]" />
            <span className="text-[#d4a843] text-xs uppercase tracking-[0.25em] font-medium">
              {t.retailPartners?.badge || 'Where to Buy'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-900 leading-[1.1]">
            {t.retailPartners?.title || 'Purchase Channels'}
          </h2>
          <p className="text-neutral-400 mt-4 text-base leading-relaxed">
            {t.retailPartners?.subtitle || 'Choose your preferred way to shop'}
          </p>
        </div>

        {/* ── Partner Cards ───────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100 max-w-4xl">
          {sortedPartners.map((partner, index) => {
            const i18nPartner =
              t.retailPartners?.partners?.[partner.id as keyof typeof t.retailPartners.partners] ?? {};
            const isOnline = partner.type === 'online';
            const href = isOnline ? (t.home?.cta?.shopUrl || partner.link) : partner.link;
            const label = isOnline
              ? (t.retailPartners?.buyNow || 'Shop Now')
              : (t.retailPartners?.visitStore || 'Visit Store');
            const typeLabel = isOnline
              ? (t.retailPartners?.types?.online || 'Online')
              : (t.retailPartners?.types?.retail || 'Retail');

            return (
              <a
                key={partner.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-10 relative overflow-hidden flex flex-col hover:shadow-[0_0_0_2px_#d4a843] transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(32px)',
                  transitionDelay: `${(index + 1) * 150}ms`,
                  transitionDuration: '700ms',
                }}
              >
                {/* Large watermark index */}
                <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-neutral-50 select-none leading-none group-hover:text-[#d4a843]/5 transition-colors duration-500">
                  0{index + 1}
                </span>

                {/* Top row — logo + type badge */}
                <div className="flex items-start justify-between mb-8 relative">
                  <div className="w-16 h-16 rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-center overflow-hidden group-hover:border-[#d4a843]/30 transition-colors duration-500">
                    {partner.logo ? (
                      <Image
                        src={getImagePath(partner.logo)}
                        alt={'name' in i18nPartner ? (i18nPartner as { name: string }).name : partner.id}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faInstagram} className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>

                  {/* Type pill */}
                  <div className="flex items-center gap-1.5 border border-neutral-200 rounded-full px-3 py-1.5 group-hover:border-[#d4a843]/40 transition-colors duration-500">
                    {isOnline ? (
                      <Globe className="w-3 h-3 text-[#d4a843]" />
                    ) : (
                      <Store className="w-3 h-3 text-[#d4a843]" />
                    )}
                    <span className="text-neutral-500 text-xs uppercase tracking-[0.18em]">{typeLabel}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-[#c9972f] transition-colors duration-300 relative">
                  {'name' in i18nPartner
                    ? (i18nPartner as { name: string }).name
                    : partner.id}
                </h3>

                {/* Description */}
                {'description' in i18nPartner && (i18nPartner as { description: string }).description && (
                  <p className="text-neutral-400 text-sm leading-relaxed mb-2 relative">
                    {(i18nPartner as { description: string }).description}
                  </p>
                )}

                {/* Location */}
                {'location' in i18nPartner && (i18nPartner as { location: string }).location && (
                  <div className="flex items-start gap-2 mt-1 mb-2 relative">
                    <MapPin className="w-3.5 h-3.5 text-[#d4a843] flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-400 text-xs leading-relaxed">
                      {(i18nPartner as { location: string }).location}
                    </span>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-8 flex items-center justify-between relative">
                  <div className="flex items-center gap-2 text-[#d4a843] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>{label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Decorative dots */}
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-[#d4a843]/40 transition-colors duration-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-[#d4a843]/40 transition-colors duration-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-[#d4a843]/40 transition-colors duration-700" />
                  </div>
                </div>

                {/* Bottom slide-in accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a843] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
            );
          })}
        </div>

        {/* ── Footer Note ─────────────────────────────── */}
        <div
          className="mt-10 flex items-center gap-4 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '500ms',
          }}
        >
          <div className="w-6 h-px bg-[#d4a843]/40" />
          <p className="text-neutral-400 text-xs uppercase tracking-[0.2em]">
            {t.retailPartners?.note || 'Interested in becoming a retail partner? Contact us!'}
          </p>
        </div>

      </div>
    </section>
  );
}
