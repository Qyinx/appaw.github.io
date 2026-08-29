'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Globe, Store } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faEtsy, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import { PSA_DROP_OFF_MAPS_URL } from '@/lib/grading/psa-booking';
import CarousellIcon from '@/components/ui/CarousellIcon';

const ETSY_URL = 'https://appawstore.etsy.com/';
const CAROUSELL_URL = 'https://www.carousell.com.hk/u/appaw.store/';
const WA_URL = 'https://wa.me/85292851189';
const ARENA_IG = 'https://www.instagram.com/138arena/';
const CARDTHELAND_IG = 'https://www.instagram.com/cardtheland_tcg/';

export default function RetailPartners() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const arena = t.retailPartners?.partners?.arena138;
  const partner = t.retailPartners?.partners?.cardtheland;
  const online = t.retailPartners?.partners?.appawstore;

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

        {/* Primary: 138 Arena */}
        {arena && (
          <div className="border border-border-default bg-surface-panel relative overflow-hidden mb-px">
            <div
              className="absolute inset-0 bg-gradient-to-br from-accent-brand/12 via-transparent to-accent-secondary/8"
              aria-hidden="true"
            />
            <div className="relative z-[1] grid lg:grid-cols-[1fr_auto] gap-6 p-6 md:p-8 lg:p-10">
              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-brand/30 text-accent-brand bg-accent-brand/10">
                    <Store className="w-3 h-3" />
                    {t.retailPartners?.tags?.main ?? t.retailPartners?.tags?.authorized ?? 'Main location'}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                    {t.retailPartners?.tags?.fullService ?? 'Full service'}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-text-primary mb-2 font-display">
                  {arena.name}
                </h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                  {arena.description}
                </p>
                <div className="panel-raised flex items-start gap-3 p-4 mb-6 max-w-xl">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-brand" />
                  <p className="text-text-secondary text-sm leading-relaxed">{arena.location}</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-auto">
                  <a
                    href={PSA_DROP_OFF_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-fit"
                  >
                    {t.retailPartners?.getDirections ?? 'Get Directions'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={ARENA_IG}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-fit"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                    {t.retailPartners?.visitStore ?? 'Visit Store'}
                  </a>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center w-36 shrink-0">
                <div className="w-28 h-28 border border-border-default bg-surface-raised flex items-center justify-center p-3">
                  <Image
                    src={getImagePath('/images/partners/138arena.png')}
                    alt=""
                    width={88}
                    height={64}
                    className="object-contain max-h-full w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {partner && (
          <div className="border border-border-default bg-surface-panel mb-px p-6 md:p-7 flex flex-col">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 border border-accent-link/30 text-accent-link bg-accent-link/10 mb-4 w-fit">
              <FontAwesomeIcon icon={faInstagram} className="w-3 h-3" />
              {t.retailPartners?.tags?.partner ?? 'Partner'}
            </span>
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-text-primary mb-1.5 font-display">
                  {partner.name}
                </h3>
                <p className="text-text-muted text-xs mb-3">{partner.description}</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{partner.location}</p>
                <a
                  href={CARDTHELAND_IG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-link hover:text-accent-brand transition-colors duration-150"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                  {t.retailPartners?.visitPartner ?? 'Visit on Instagram'}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="w-[4.5rem] h-14 flex-shrink-0 border border-border-default bg-surface-raised flex items-center justify-center p-1.5">
                <Image
                  src={getImagePath('/images/partners/cardtheland.png')}
                  alt=""
                  width={56}
                  height={40}
                  className="object-contain max-h-full w-auto"
                />
              </div>
            </div>
          </div>
        )}

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
