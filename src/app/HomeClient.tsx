'use client';

import React from 'react';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { ArrowRight, Check, Eye, Lock, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';
import HomeHero from '@/components/home/HomeHero';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import trackEvent from '@/lib/analytics';
import { getImagePath } from '@/lib/utils';

export default function HomeClient() {
  const { t } = useLanguage();
  const servicesReveal = useRevealOnScroll<HTMLElement>();
  const featuresReveal = useRevealOnScroll<HTMLElement>();
  const specsReveal = useRevealOnScroll<HTMLElement>();
  const ctaReveal = useRevealOnScroll<HTMLElement>();

  const handleShopClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'shop_protectors', label: 'hero_shop_protectors' });
  };

  const handleCollectionClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'view_collection', label: 'hero_view_collection' });
  };

  const handleCenteringClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'analyze_centering', label: 'hero_analyze_centering' });
  };

  const handlePsaGradingClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'psa_grading', label: 'homepage_psa_grading' });
  };

  const handleTradingClick = () => {
    trackEvent('cta_click', { category: 'homepage', action: 'browse_trading', label: 'homepage_trading_preview' });
  };

  const services = [
    {
      href: '/products/psa-protectors',
      onClick: handleShopClick,
      badge: t.home.services.protector.badge,
      title: t.business.cardProtector.title,
      description: t.home.services.protector.subtitle,
      cta: t.home.services.protector.cta,
      accent: 'text-accent-brand border-accent-brand/40',
    },
    {
      href: '/collection',
      onClick: handleCollectionClick,
      badge: t.home.services.collection.badge,
      title: t.home.services.collection.title,
      description: t.home.services.collection.description,
      cta: t.home.services.collection.cta,
      accent: 'text-accent-success border-accent-success/40',
    },
    {
      href: '/tools/card-centering',
      onClick: handleCenteringClick,
      badge: t.home.services.centering.badge,
      title: t.home.services.centering.title,
      description: t.home.services.centering.description,
      cta: t.home.services.centering.cta,
      accent: 'text-accent-link border-accent-link/40',
    },
  ];

  const featureSideCards = [
    { icon: Eye, ...t.home.features.trust },
    { icon: Lock, ...t.home.features.support },
  ];

  const tradingBullets = t.home.tradingPreview.features.slice(0, 2);

  const specTiles = [
    {
      key: 'compatibility',
      label: t.home.specs.rows.compatibility,
      value: t.home.specs.rows.compatibilityValue,
      hint: t.home.specs.tiles.compatibility.hint,
    },
    {
      key: 'material',
      label: t.home.specs.rows.material,
      value: t.home.specs.rows.materialValue,
      hint: t.home.specs.tiles.material.hint,
    },
    {
      key: 'uvProtection',
      label: t.home.specs.rows.uvProtection,
      value: t.home.specs.rows.uvProtectionValue,
      hint: t.home.specs.tiles.uvProtection.hint,
    },
    {
      key: 'origin',
      label: t.home.specs.rows.origin,
      value: t.home.specs.rows.originValue,
      hint: t.home.specs.tiles.origin.hint,
    },
  ] as const;

  return (
    <div className="flex flex-col bg-surface-bg">
      <HomeHero
        onShopClick={handleShopClick}
        onCollectionClick={handleCollectionClick}
        onCenteringClick={handleCenteringClick}
      />

      <section ref={servicesReveal.ref} className="section-padding border-b border-border-default bg-surface-panel scroll-mt-20">
        <div className="container-custom">
          <Reveal visible={servicesReveal.visible} dir="up" className="mb-[length:var(--space-align-sm)] max-w-2xl">
            <p className="section-label mb-4">{t.home.services.badge}</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary text-balance">
              {t.home.services.title}
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-border-default border border-border-default">
            {services.map((service, i) => (
              <Reveal
                key={service.href}
                visible={servicesReveal.visible}
                dir="up"
                delay={i * 40}
                className="h-full"
              >
                <LocalLink
                  href={service.href}
                  onClick={service.onClick}
                  className="group bg-surface-panel p-6 md:p-8 flex flex-col h-full hover:bg-surface-raised transition-colors duration-150"
                >
                  <span className={`inline-block self-start font-mono text-xs uppercase tracking-widest px-2 py-1 border mb-4 ${service.accent}`}>
                    {service.badge}
                  </span>
                  <h3 className="text-lg font-display font-semibold text-text-primary mb-3 group-hover:text-accent-brand transition-colors duration-150">
                    {service.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-brand">
                    {service.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </LocalLink>
              </Reveal>
            ))}
          </div>

          <Reveal visible={servicesReveal.visible} dir="up" delay={60} className="mt-[length:var(--space-align-sm)]">
            <LocalLink
              href="/business/psa-grading"
              onClick={handlePsaGradingClick}
              className="panel p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:bg-surface-raised transition-colors duration-150 group"
            >
              <div className="max-w-xl">
                <span className="inline-block font-mono text-xs uppercase tracking-widest px-2 py-1 border border-accent-secondary/40 text-accent-secondary mb-3">
                  {t.home.services.psaGrading.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-brand transition-colors duration-150">
                  {t.home.services.psaGrading.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.home.services.psaGrading.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-brand shrink-0">
                {t.home.services.psaGrading.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </LocalLink>
          </Reveal>

          <Reveal visible={servicesReveal.visible} dir="up" delay={80} className="mt-[length:var(--space-align-xs)]">
            <div className="panel p-6 md:p-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-xl">
                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2 text-balance">
                  {t.home.services.trading.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {t.home.services.trading.description}
                </p>
                <ul className="space-y-2">
                  {tradingBullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-accent-link shrink-0 mt-0.5" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <LocalLink
                href="/business/card-trading"
                onClick={handleTradingClick}
                className="btn btn-secondary shrink-0 self-start"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                {t.home.services.trading.cta}
              </LocalLink>
            </div>
          </Reveal>

          <Reveal visible={servicesReveal.visible} dir="up" delay={120} className="mt-[length:var(--space-align-xs)]">
            <LocalLink
              href="/guides"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-brand transition-colors duration-150"
            >
              <span>{t.home.services.guidesLink}</span>
              <span className="font-semibold text-accent-brand">{t.home.services.guidesCta}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
          </Reveal>
        </div>
      </section>

      <section ref={featuresReveal.ref} className="section-padding border-b border-border-default">
        <div className="container-custom">
          <Reveal visible={featuresReveal.visible} dir="up" className="mb-[length:var(--space-align-sm)] max-w-[65ch]">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3 text-balance">
              {t.home.features.title}
            </h2>
            <p className="text-text-secondary leading-relaxed">{t.home.features.subtitle}</p>
          </Reveal>

          <div className="home-features-bento grid grid-cols-1 md:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)] gap-px bg-border-default border border-border-default">
            <Reveal
              visible={featuresReveal.visible}
              dir="up"
              className="home-features-bento__lead bg-surface-panel relative min-h-[280px] md:min-h-[360px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-brand/8 via-transparent to-accent-secondary/6" aria-hidden="true" />
              <div className="relative z-[1] p-6 md:p-8 flex flex-col h-full">
                <div className="w-10 h-10 border border-accent-brand/30 bg-accent-brand/10 flex items-center justify-center mb-5">
                  <Shield className="w-4 h-4 text-accent-brand" aria-hidden="true" />
                </div>
                <h3 className="font-display text-text-primary font-semibold text-xl mb-3 max-w-[24ch]">
                  {t.home.features.quality.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[42ch] flex-1">
                  {t.home.features.quality.description}
                </p>
              </div>
              <div className="home-features-bento__image pointer-events-none absolute inset-y-0 right-0 w-[38.2%] max-w-[220px] opacity-90">
                <Image
                  src={getImagePath('/images/describe/color/color-gold.png')}
                  alt={t.business.cardProtector.title}
                  fill
                  className="object-contain object-right p-4"
                  sizes="220px"
                />
              </div>
            </Reveal>

            <div className="grid grid-rows-2 gap-px bg-border-default">
              {featureSideCards.map(({ icon: Icon, title, description }, i) => (
                <Reveal
                  key={title}
                  visible={featuresReveal.visible}
                  dir="up"
                  delay={(i + 1) * 40}
                  className="p-6 md:p-8 bg-surface-panel flex flex-col"
                >
                  <div className="w-10 h-10 border border-accent-brand/30 bg-accent-brand/10 flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-accent-brand" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-text-primary font-semibold text-lg mb-3">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={specsReveal.ref} className="section-padding border-b border-border-default">
        <div className="container-custom max-w-4xl">
          <Reveal visible={specsReveal.visible} dir="up" className="mb-10 max-w-[65ch]">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary text-balance">
              {t.home.specs.title}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-px bg-border-default border border-border-default">
            {specTiles.map(({ key, label, value, hint }, i) => (
              <Reveal
                key={key}
                visible={specsReveal.visible}
                dir="up"
                delay={i * 40}
                className="home-spec-tile bg-surface-panel p-6 md:p-8"
              >
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-secondary mb-3">{label}</p>
                <p className="font-display text-lg md:text-xl font-semibold text-text-primary mb-2 text-balance">{value}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{hint}</p>
              </Reveal>
            ))}
          </div>

          <Reveal visible={specsReveal.visible} dir="up" delay={120} className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <ShopNowButton
              label={t.home.specs.cta}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              buttonClassName="btn btn-primary"
              onClick={handleShopClick}
            />
            <LocalLink
              href="/products/psa-protectors"
              onClick={handleShopClick}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-link hover:text-accent-brand transition-colors duration-150"
            >
              {t.home.specs.fullSpecsCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
          </Reveal>
        </div>
      </section>

      <RetailPartners />

      <section ref={ctaReveal.ref} className="section-padding bg-surface-panel border-t border-border-default">
        <Reveal visible={ctaReveal.visible} dir="up" className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4 text-balance">
            {t.home.cta.title}
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-[65ch] mx-auto leading-relaxed">{t.home.cta.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ShopNowButton
              label={t.home.cta.button}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              buttonClassName="btn btn-primary"
              chevronSize="w-4 h-4"
            />
            <LocalLink href="/business/card-trading" onClick={handleTradingClick} className="btn btn-secondary">
              {t.home.services.trading.cta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
