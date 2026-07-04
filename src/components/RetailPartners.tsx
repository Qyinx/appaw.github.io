'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Globe, Store } from 'lucide-react';
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
      className="py-24 md:py-28 bg-surface-bg relative overflow-hidden border-t border-border-default"
    >
      <div
        className="container-custom relative max-w-4xl mx-auto transition-[opacity,transform] duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <div className="text-center mb-10">
          <p className="section-label mb-4 justify-center">
            {t.retailPartners?.badge ?? 'Where to Buy'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-tight mb-3">
            {t.retailPartners?.title ?? 'Purchase Channels'}
          </h2>
          <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            {t.retailPartners?.subtitle ?? 'Choose your preferred way to shop'}
          </p>
        </div>

        <div
          role="tablist"
          className="relative flex border border-border-default bg-surface-panel p-1 mb-6"
        >
          <div
            className="absolute top-1.5 bottom-1.5 transition-[left,width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `calc(${tabIndex * (100 / 3)}% + 6px)`,
              width: `calc(${100 / 3}% - 12px)`,
              background: 'var(--accent-primary)',
              ...(activeTab === 'partner' ? { background: 'var(--accent-secondary)' } : {}),
              ...(activeTab === 'online' ? { background: 'var(--accent-success)' } : {}),
            }}
          />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-3 py-3.5 text-sm font-semibold transition-colors duration-300 min-h-[44px] ${
                  isActive ? 'text-accent-structural' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.short}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="panel p-0 overflow-hidden">
          <div className="p-6 md:p-9">
            {activeTab === 'showroom' && showroom && (
              <PanelFade tabId="showroom">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-brand/30 text-accent-brand bg-accent-brand/10 mb-4">
                      {t.retailPartners?.tags?.authorized ?? 'Primary'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 font-display">{showroom.name}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-md">{showroom.description}</p>
                    <div className="panel-raised flex items-start gap-3 p-4 mb-6 max-w-md">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-brand" />
                      <p className="text-text-secondary text-sm leading-relaxed">{showroom.location}</p>
                    </div>
                    <a
                      href={PRODUCT_NAME.shop.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      {t.retailPartners?.getDirections ?? 'Get Directions'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="hidden md:flex w-36 h-36 items-center justify-center panel p-4">
                    <Image src={getImagePath('/images/logo.png')} alt="" width={48} height={48} className="object-contain" />
                  </div>
                </div>
              </PanelFade>
            )}

            {activeTab === 'partner' && partner && (
              <PanelFade tabId="partner">
                <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-link/30 text-accent-link bg-accent-link/10 mb-4">
                      <FontAwesomeIcon icon={faInstagram} className="w-3 h-3" />
                      {t.retailPartners?.tags?.partner ?? 'Partner'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 font-display">{partner.name}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-md">{partner.description}</p>
                    <div className="panel-raised flex items-start gap-3 p-4 mb-6 max-w-md">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-link" />
                      <p className="text-text-secondary text-sm leading-relaxed">{partner.location}</p>
                    </div>
                    <a
                      href="https://www.instagram.com/cardtheland_tcg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      {t.retailPartners?.visitStore ?? 'Visit Store'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="hidden md:flex w-36 h-36 items-center justify-center panel p-4">
                    <Image
                      src={getImagePath('/images/partners/cardtheland.png')}
                      alt=""
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                </div>
              </PanelFade>
            )}

            {activeTab === 'online' && online && (
              <PanelFade tabId="online">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-success/30 text-accent-success bg-accent-success/10 mb-4">
                    <Globe className="w-3 h-3" />
                    {t.retailPartners?.types?.online ?? 'Online'}
                  </span>
                  <h3 className="text-2xl font-bold text-text-primary font-display">{online.name}</h3>
                  <p className="text-text-secondary text-sm mt-2">{online.description}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-px bg-border-default border border-border-default">
                  {onlineLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 bg-surface-panel hover:bg-surface-raised transition-[background-color,border-color] duration-300"
                    >
                      <span
                        className="w-11 h-11 border border-border-default flex items-center justify-center mb-3"
                        style={{ color: link.color }}
                      >
                        {link.icon}
                      </span>
                      <span className="text-sm font-bold text-text-primary mb-1 leading-snug">{link.label}</span>
                      <span className="text-[11px] text-text-muted leading-relaxed flex-1">{link.desc}</span>
                      <ArrowRight
                        className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-[opacity,transform] duration-300"
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
