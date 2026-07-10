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

const PARTNER_LINKS = {
  cardtheland: 'https://www.instagram.com/cardtheland_tcg/',
  arena138: 'https://www.instagram.com/138arena/',
} as const;

type PartnerKey = keyof typeof PARTNER_LINKS;

const PARTNER_CONFIG: { key: PartnerKey; logo: string }[] = [
  { key: 'cardtheland', logo: '/images/partners/cardtheland.png' },
  { key: 'arena138', logo: '/images/partners/138arena.png' },
];

export default function RetailPartners() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const showroom = t.retailPartners?.partners?.appawShop;
  const online = t.retailPartners?.partners?.appawstore;

  const partners = PARTNER_CONFIG.map(({ key, logo }) => ({
    key,
    logo,
    data: t.retailPartners?.partners?.[key],
  })).filter((p) => p.data);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

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
      className="section-padding border-t border-border-default bg-surface-bg relative overflow-hidden"
    >
      <div
        className="container-custom transition-[opacity,transform] duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <div className="mb-10 max-w-[65ch]">
          <p className="section-label mb-4">{t.retailPartners?.badge ?? 'Where to Buy'}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-tight mb-3 text-balance">
            {t.retailPartners?.title ?? 'Purchase Channels'}
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            {t.retailPartners?.subtitle ?? 'Choose your preferred way to shop'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border-default border border-border-default mb-px">
          {showroom && (
            <div className="bg-surface-panel relative min-h-[300px] overflow-hidden lg:row-span-2">
              <div
                className="absolute inset-0 bg-gradient-to-br from-accent-brand/10 via-transparent to-accent-secondary/6"
                aria-hidden="true"
              />
              <div className="relative z-[1] p-6 md:p-8 flex flex-col h-full min-h-[300px]">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-brand/30 text-accent-brand bg-accent-brand/10 mb-5 w-fit">
                  <Store className="w-3 h-3" />
                  {t.retailPartners?.tags?.authorized ?? 'Primary'}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 font-display">{showroom.name}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">{showroom.description}</p>
                <div className="panel-raised flex items-start gap-3 p-4 mb-6 max-w-md mt-auto">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-brand" />
                  <p className="text-text-secondary text-sm leading-relaxed">{showroom.location}</p>
                </div>
                <a
                  href={PRODUCT_NAME.shop.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-fit"
                >
                  {t.retailPartners?.getDirections ?? 'Get Directions'}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] max-w-[180px] hidden md:flex items-center justify-center opacity-80">
                <Image src={getImagePath('/images/logo.png')} alt="" width={72} height={72} className="object-contain" />
              </div>
            </div>
          )}

          {partners.map(({ key, data, logo }) => (
            <div key={key} className="bg-surface-panel p-6 md:p-7 flex flex-col">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-link/30 text-accent-link bg-accent-link/10 mb-4 w-fit">
                <FontAwesomeIcon icon={faInstagram} className="w-3 h-3" />
                {t.retailPartners?.tags?.partner ?? 'Partner'}
              </span>
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-text-primary mb-1.5 font-display">{data!.name}</h3>
                  <p className="text-text-muted text-xs mb-3">{data!.description}</p>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{data!.location}</p>
                  <a
                    href={PARTNER_LINKS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-link hover:text-accent-brand transition-colors duration-150"
                  >
                    {t.retailPartners?.visitStore ?? 'Visit Store'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="w-[4.5rem] h-14 flex-shrink-0 border border-border-default bg-surface-raised flex items-center justify-center p-1.5">
                  <Image src={getImagePath(logo)} alt="" width={56} height={40} className="object-contain max-h-full w-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {online && (
          <div className="border border-border-default bg-border-default">
            <div className="bg-surface-panel px-6 md:px-8 py-5 border-b border-border-default">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-success/30 text-accent-success bg-accent-success/10 mb-3">
                <Globe className="w-3 h-3" />
                {t.retailPartners?.types?.online ?? 'Online'}
              </span>
              <h3 className="text-xl font-bold text-text-primary font-display">{online.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{online.description}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-px bg-border-default">
              {onlineLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 md:p-6 bg-surface-panel hover:bg-surface-raised transition-[background-color] duration-300"
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
          </div>
        )}
      </div>
    </section>
  );
}
