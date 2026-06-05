'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Globe, Store, Sparkles } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faEtsy, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import { PRODUCT_NAME } from '@/lib/product-names';
import CarousellIcon from '@/components/ui/CarousellIcon';

const ETSY_URL = 'https://appawstore.etsy.com/';
const CAROUSELL_URL = 'https://www.carousell.com.hk/u/appaw.store/';
const WA_URL = 'https://wa.me/85292851189';

type TabId = 'showroom' | 'partner' | 'online';

const THEME: Record<TabId, { accent: string; rgb: string; tabShadow: string }> = {
  showroom: { accent: '#D4899A', rgb: '212,137,154', tabShadow: '0 8px 28px rgba(212,137,154,0.35)' },
  partner: { accent: '#818cf8', rgb: '129,140,248', tabShadow: '0 8px 28px rgba(129,140,248,0.35)' },
  online: { accent: '#34D399', rgb: '52,211,153', tabShadow: '0 8px 28px rgba(52,211,153,0.35)' },
};

const TAB_ORDER: TabId[] = ['showroom', 'partner', 'online'];

function PanelFade({ tabId, children }: { tabId: TabId; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [tabId]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

export default function RetailPartners() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('showroom');

  const theme = THEME[activeTab];
  const tabIndex = TAB_ORDER.indexOf(activeTab);

  const showroom = t.retailPartners?.partners?.appawShop;
  const partner = t.retailPartners?.partners?.cardtheland;
  const online = t.retailPartners?.partners?.appawstore;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const tabs: { id: TabId; short: string; icon: React.ReactNode }[] = [
    { id: 'showroom', short: t.retailPartners?.tags?.authorized ?? 'Showroom', icon: <Store className="w-4 h-4" /> },
    { id: 'partner', short: t.retailPartners?.tags?.partner ?? 'Partner', icon: <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" /> },
    { id: 'online', short: t.retailPartners?.types?.online ?? 'Online', icon: <Globe className="w-4 h-4" /> },
  ];

  const onlineLinks = [
    {
      href: ETSY_URL,
      label: t.shopOptions?.buyOnEtsy ?? 'Buy on Etsy',
      desc: t.shopOptions?.buyOnEtsyDesc ?? 'International · Ships worldwide',
      color: '#F1641E',
      icon: <FontAwesomeIcon icon={faEtsy} className="w-5 h-5" />,
    },
    {
      href: CAROUSELL_URL,
      label: t.shopOptions?.buyOnCarousell ?? 'Buy on Carousell',
      desc: t.shopOptions?.buyOnCarousellDesc ?? 'Hong Kong · Best for local buyers',
      color: '#00CBA0',
      icon: <CarousellIcon className="h-4 w-auto" />,
    },
    {
      href: WA_URL,
      label: t.shopOptions?.orderWhatsApp ?? 'Order via WhatsApp',
      desc: t.shopOptions?.orderWhatsAppDesc ?? 'Direct order · Fastest response',
      color: '#25D366',
      icon: <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-28 bg-[#1e1e2e] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(212,137,154,0.06),transparent)] pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
        style={{ background: `rgba(${theme.rgb}, 0.07)` }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />

      <div
        className="container-custom relative max-w-4xl mx-auto transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#D4899A]/50" />
            <span className="inline-flex items-center gap-2 text-[#D4899A] text-[11px] uppercase tracking-[0.28em] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {t.retailPartners?.badge ?? 'Where to Buy'}
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#D4899A]/50" />
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold font-display text-white leading-tight mb-3">
            {t.retailPartners?.title ?? 'Purchase Channels'}
          </h2>
          <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            {t.retailPartners?.subtitle ?? 'Choose your preferred way to shop'}
          </p>
        </div>

        {/* Tab bar with sliding pill */}
        <div
          role="tablist"
          className="relative flex rounded-2xl border border-white/[0.08] bg-[#111116]/90 backdrop-blur-sm p-1.5 mb-6"
        >
          <div
            className="absolute top-1.5 bottom-1.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `calc(${tabIndex * (100 / 3)}% + 6px)`,
              width: `calc(${100 / 3}% - 12px)`,
              background: theme.accent,
              boxShadow: theme.tabShadow,
            }}
          />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabTheme = THEME[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-3 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/65'
                }`}
              >
                <span
                  className="transition-colors duration-300"
                  style={{ color: isActive ? '#fff' : tabTheme.accent }}
                >
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.short}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          className="relative rounded-[1.25rem] border overflow-hidden transition-colors duration-700"
          style={{
            borderColor: `rgba(${theme.rgb}, 0.22)`,
            background: 'rgba(17,17,22,0.92)',
          }}
        >
          {/* Themed wash */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 85% 15%, rgba(${theme.rgb}, 0.14), transparent 60%)`,
            }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-700"
            style={{ background: `linear-gradient(to bottom, ${theme.accent}, transparent)` }}
          />

          <div className="relative p-6 md:p-9">
            {/* Showroom */}
            {activeTab === 'showroom' && showroom && (
              <PanelFade tabId="showroom">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 rounded-full border mb-4"
                      style={{ color: theme.accent, borderColor: `rgba(${theme.rgb}, 0.35)`, background: `rgba(${theme.rgb}, 0.08)` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accent }} />
                      {t.retailPartners?.tags?.authorized ?? 'Primary'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">{showroom.name}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-md">{showroom.description}</p>
                    <div
                      className="flex items-start gap-3 p-4 rounded-xl border mb-6 max-w-md"
                      style={{ borderColor: `rgba(${theme.rgb}, 0.15)`, background: `rgba(${theme.rgb}, 0.04)` }}
                    >
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
                      <p className="text-white/55 text-sm leading-relaxed">{showroom.location}</p>
                    </div>
                    <a
                      href={PRODUCT_NAME.shop.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all duration-300 hover:gap-3.5 hover:brightness-110"
                      style={{ background: theme.accent, boxShadow: `0 0 28px rgba(${theme.rgb}, 0.3)` }}
                    >
                      {t.retailPartners?.getDirections ?? 'Get Directions'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Logo visual */}
                  <div className="hidden md:flex relative w-36 h-36 items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full border animate-[spin_20s_linear_infinite] opacity-30"
                      style={{ borderColor: `rgba(${theme.rgb}, 0.4)` }}
                    />
                    <div
                      className="absolute inset-3 rounded-full border animate-[spin_14s_linear_infinite_reverse] opacity-50"
                      style={{ borderColor: `rgba(${theme.rgb}, 0.25)` }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center border"
                      style={{ background: `rgba(${theme.rgb}, 0.12)`, borderColor: `rgba(${theme.rgb}, 0.3)` }}
                    >
                      <Image src={getImagePath('/images/logo.png')} alt="" width={48} height={48} className="object-contain" />
                    </div>
                  </div>
                </div>
              </PanelFade>
            )}

            {/* Partner */}
            {activeTab === 'partner' && partner && (
              <PanelFade tabId="partner">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 rounded-full border mb-4"
                      style={{ color: theme.accent, borderColor: `rgba(${theme.rgb}, 0.35)`, background: `rgba(${theme.rgb}, 0.08)` }}
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-3 h-3" />
                      {t.retailPartners?.tags?.partner ?? 'Partner'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">{partner.name}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-5 max-w-md">{partner.description}</p>
                    <div
                      className="flex items-start gap-3 p-4 rounded-xl border mb-6 max-w-md"
                      style={{ borderColor: `rgba(${theme.rgb}, 0.15)`, background: `rgba(${theme.rgb}, 0.04)` }}
                    >
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
                      <p className="text-white/55 text-sm leading-relaxed">{partner.location}</p>
                    </div>
                    <a
                      href="https://www.instagram.com/cardtheland_tcg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold border transition-all duration-300 hover:gap-3.5"
                      style={{
                        color: theme.accent,
                        borderColor: `rgba(${theme.rgb}, 0.45)`,
                        background: `rgba(${theme.rgb}, 0.06)`,
                      }}
                    >
                      {t.retailPartners?.visitStore ?? 'Visit Store'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="hidden md:flex relative w-36 h-36 items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-2xl rotate-6 opacity-40"
                      style={{ background: `linear-gradient(135deg, rgba(${theme.rgb}, 0.2), transparent)` }}
                    />
                    <div
                      className="relative w-24 h-24 rounded-2xl flex items-center justify-center border overflow-hidden"
                      style={{ background: `rgba(${theme.rgb}, 0.1)`, borderColor: `rgba(${theme.rgb}, 0.3)` }}
                    >
                      <Image
                        src={getImagePath('/images/partners/cardtheland.png')}
                        alt=""
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </PanelFade>
            )}

            {/* Online */}
            {activeTab === 'online' && online && (
              <PanelFade tabId="online">
                <div className="mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 rounded-full border mb-4"
                    style={{ color: theme.accent, borderColor: `rgba(${theme.rgb}, 0.35)`, background: `rgba(${theme.rgb}, 0.08)` }}
                  >
                    <Globe className="w-3 h-3" />
                    {t.retailPartners?.types?.online ?? 'Online'}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-display">{online.name}</h3>
                  <p className="text-white/45 text-sm mt-2">{online.description}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {onlineLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:-translate-y-1 transition-all duration-300"
                      style={{ ['--hover-border' as string]: link.color }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${link.color}55`;
                        e.currentTarget.style.background = `${link.color}0a`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <span
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${link.color}18`, color: link.color }}
                      >
                        {link.icon}
                      </span>
                      <span className="text-sm font-bold text-white/90 mb-1 leading-snug">{link.label}</span>
                      <span className="text-[11px] text-white/35 leading-relaxed flex-1">{link.desc}</span>
                      <ArrowRight
                        className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                        style={{ color: link.color }}
                      />
                    </a>
                  ))}
                </div>
              </PanelFade>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
