'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, ShoppingBag, MapPin, Sparkles, Store, Globe, ChevronRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

type StoreType = 'online' | 'retail';

interface Partner {
  id: string;
  name?: string;
  logo?: string;
  link: string;
  type: StoreType;
  platform?: string;
  location?: string;
  description?: string;
  isOfficial?: boolean;
}

const partners: Partner[] = [
  {
    id: 'appawstore',
    logo: '/images/logo.png',
    link: '',
    type: 'online',
    platform: '',
    isOfficial: true,
  },
  {
    id: 'cardtheland',
    logo: '/images/partners/cardtheland.png',
    link: 'https://www.instagram.com/cardtheland_tcg/',
    type: 'retail',
    platform: 'instagram',
  },
];

export default function RetailPartners() {
  const { t } = useLanguage();

  // Unified list: online first, then all retail partners
  const sortedPartners = [
    ...partners.filter((p) => p.type === 'online'),
    ...partners.filter((p) => p.type === 'retail'),
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-primary-50/30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container-custom relative">
        {/* Section Header with Playful Animation */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full text-white text-sm font-bold mb-4 shadow-lg shadow-primary-200/50">
            <ShoppingBag className="w-4 h-4" />
            <span>{t.retailPartners?.badge || 'Where to Buy'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-3 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.retailPartners?.title || 'Purchase Channels'}
          </h2>
          <p className="text-base text-neutral-600">
            {t.retailPartners?.subtitle || 'Choose your preferred way to shop'}
          </p>
        </div>

        {/* Unified Purchase Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sortedPartners.map((partner, index) => {
            const isOnline = partner.type === 'online';
            const isAppaw = partner.id === 'appawstore';
            // Get i18n content for this partner
            const i18nPartner = t.retailPartners?.partners?.[partner.id as keyof typeof t.retailPartners.partners] || {};
            return (
              <a
                key={partner.id}
                href={isOnline ? (t.home?.cta?.shopUrl || partner.link) : partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isAppaw
                    ? 'group relative bg-gradient-to-br from-sky-400 via-blue-300 to-sky-300 rounded-3xl p-6 shadow-2xl hover:shadow-primary-500/50 hover:scale-105 hover:-rotate-1 transition-all duration-500 text-primary-900 flex flex-col h-full border-2 border-sky-300 animate-fade-in'
                    : isOnline
                    ? 'group relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white flex flex-col h-full animate-fade-in'
                    : 'group relative bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 hover:rotate-1 transition-all duration-500 flex flex-col h-full animate-fade-in'
                }
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Decorative Elements */}
                {isAppaw && (
                  <>
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-amber-400 rounded-full blur-2xl opacity-60 animate-pulse" />
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
                  </>
                )}
                {!isOnline && !isAppaw && (
                  <div className="absolute -top-1 -right-1 w-16 h-16 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse" />
                )}

                {/* Logo with Playful Animation */}
                <div className={isAppaw
                  ? 'w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mb-4 shadow-xl border-2 border-sky-200 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500'
                  : isOnline
                  ? 'w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300'
                  : 'w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md border-2 border-emerald-100 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500'}>
                  {partner.logo ? (
                    <Image
                      src={getImagePath(partner.logo)}
                      alt={i18nPartner.name || partner.id}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faInstagram} className={isOnline ? 'w-8 h-8 text-primary-600' : 'w-8 h-8 text-neutral-400'} />
                  )}
                </div>

                {/* Name & Type Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className={isAppaw ? 'text-xl font-bold text-sky-900' : isOnline ? 'text-xl font-bold text-white' : 'text-xl font-bold text-neutral-900'}>
                    {i18nPartner.name || partner.id}
                  </h3>
                  <span className={isAppaw
                    ? 'px-3 py-1 bg-white text-sky-700 text-xs font-black rounded-full flex items-center gap-1.5 border-2 border-sky-700 shadow-lg'
                    : isOnline
                    ? 'px-3 py-1 bg-amber-400 text-amber-900 text-xs font-black rounded-full flex items-center gap-1.5 shadow-md'
                    : 'px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md'}>
                    {isOnline ? <Sparkles className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                    {isOnline
                      ? t.retailPartners?.tags?.official || 'Official Online'
                      : t.retailPartners?.tags?.authorized || 'Authorized Retail'}
                  </span>
                </div>

                {/* Description & Location */}
                {i18nPartner.description && (
                  <p className={isAppaw ? 'text-sky-800 text-sm font-bold mb-3' : isOnline ? 'text-primary-100 text-sm mb-3 font-medium' : 'text-neutral-600 text-sm mb-3 font-medium'}>
                    {i18nPartner.description}
                  </p>
                )}
                {'location' in i18nPartner && i18nPartner.location && (
                  <div className="flex items-center gap-1.5 text-sm text-emerald-700 mb-3 font-semibold">
                    <MapPin className="w-4 h-4" />
                    {i18nPartner.location}
                  </div>
                )}

                {/* CTA with Enhanced Animation */}
                <div className="mt-auto flex items-center justify-end">
                  <div className={isAppaw
                    ? 'flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'
                    : isOnline
                    ? 'flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-full font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300'
                    : 'flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300'}>
                    <span>{isOnline ? (t.retailPartners?.buyNow || 'Shop Now') : (t.retailPartners?.visitStore || 'Visit Store')}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-neutral-600 text-sm font-medium">
            {t.retailPartners?.note || 'Interested in becoming a retail partner? Contact us!'}
          </p>
        </div>
      </div>
    </section>
  );
}
