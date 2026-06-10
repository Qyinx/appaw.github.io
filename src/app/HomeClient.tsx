'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight, Check, Eye, Lock, Shield, Star, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';
import HomeHero from '@/components/home/HomeHero';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import trackEvent from '@/lib/analytics';

export default function HomeClient() {
  const { t } = useLanguage();
  const servicesReveal = useRevealOnScroll<HTMLElement>();
  const featuresReveal = useRevealOnScroll<HTMLElement>();
  const tradingReveal = useRevealOnScroll<HTMLElement>();
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

  const featureCards = [
    { icon: Shield, ...t.home.features.quality },
    { icon: Eye, ...t.home.features.trust },
    { icon: Lock, ...t.home.features.support },
  ];

  const tradingBullets = t.home.tradingPreview.features.slice(0, 2);

  const homeSpecRows = [
    [t.home.specs.rows.compatibility, t.home.specs.rows.compatibilityValue],
    [t.home.specs.rows.material, t.home.specs.rows.materialValue],
    [t.home.specs.rows.uvProtection, t.home.specs.rows.uvProtectionValue],
    [t.home.specs.rows.origin, t.home.specs.rows.originValue],
  ] as const;

  return (
    <div className="flex flex-col bg-surface-bg page-blueprint">
      <HomeHero
        onShopClick={handleShopClick}
        onCollectionClick={handleCollectionClick}
        onCenteringClick={handleCenteringClick}
      />

      <section ref={servicesReveal.ref} className="section-padding border-b border-border-default bg-surface-panel scroll-mt-20">
        <div className="container-custom">
          <Reveal visible={servicesReveal.visible} dir="up" className="mb-12 max-w-2xl">
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
                  <span className={`inline-block self-start font-mono text-[10px] uppercase tracking-widest px-2 py-1 border mb-4 ${service.accent}`}>
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

          <Reveal visible={servicesReveal.visible} dir="up" delay={80} className="mt-8">
            <div className="panel p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="max-w-xl">
                <p className="section-label mb-2">{t.home.services.trading.badge}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{t.home.services.trading.subtitle}</p>
              </div>
              <LocalLink
                href="/business/card-trading"
                onClick={handleTradingClick}
                className="btn btn-secondary shrink-0 self-start sm:self-center"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                {t.home.services.trading.cta}
              </LocalLink>
            </div>
          </Reveal>

          <Reveal visible={servicesReveal.visible} dir="up" delay={120} className="mt-8">
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
          <Reveal visible={featuresReveal.visible} dir="up" className="mb-10 max-w-2xl">
            <p className="section-label mb-4">{t.home.features.badge}</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3 text-balance">
              {t.home.features.title}
            </h2>
            <p className="text-text-secondary">{t.home.features.subtitle}</p>
          </Reveal>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-default border border-border-default">
            {featureCards.map(({ icon: Icon, title, description }, i) => (
              <Reveal
                key={title}
                visible={featuresReveal.visible}
                dir="up"
                delay={i * 40}
                className="p-6 md:p-8 bg-surface-panel"
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
      </section>

      <section ref={tradingReveal.ref} className="section-padding border-b border-border-default bg-surface-panel">
        <div className="container-custom max-w-3xl">
          <Reveal visible={tradingReveal.visible} dir="up" className="panel p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-lg">
                <p className="section-label mb-3">{t.home.tradingPreview.badge}</p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3 text-balance">
                  {t.home.tradingPreview.title}
                </h2>
                <p className="text-text-secondary mb-4">{t.home.tradingPreview.description}</p>
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
                className="btn btn-primary shrink-0 self-start"
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                {t.home.tradingPreview.cta}
              </LocalLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section ref={specsReveal.ref} className="section-padding border-b border-border-default">
        <div className="container-custom max-w-3xl">
          <Reveal visible={specsReveal.visible} dir="up">
            <p className="section-label mb-4">{t.home.specs.badge}</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-8 text-balance">
              {t.home.specs.title}
            </h2>
          </Reveal>

          <Reveal visible={specsReveal.visible} dir="up" delay={80} className="panel p-6">
            {homeSpecRows.map(([label, value]) => (
              <div key={label} className="spec-row">
                <span className="spec-row__label">{label}</span>
                <span className="spec-row__value">{value}</span>
              </div>
            ))}
          </Reveal>

          <Reveal visible={specsReveal.visible} dir="up" delay={120} className="mt-8 flex flex-wrap gap-3">
            <LocalLink href="/products/psa-protectors" onClick={handleShopClick} className="btn btn-primary">
              {t.home.specs.cta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
            <LocalLink href="/products/psa-protectors" onClick={handleShopClick} className="btn btn-secondary">
              {t.home.specs.fullSpecsCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
          </Reveal>
        </div>
      </section>

      <RetailPartners />

      <section ref={ctaReveal.ref} className="section-padding bg-surface-panel border-t border-border-default">
        <Reveal visible={ctaReveal.visible} dir="up" className="container-custom text-center max-w-2xl mx-auto">
          <Star className="w-5 h-5 text-accent-brand mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4 text-balance">
            {t.home.cta.title}
          </h2>
          <p className="text-text-secondary text-lg mb-10">{t.home.cta.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ShopNowButton
              label={t.home.cta.button}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              buttonClassName="btn btn-primary"
              chevronSize="w-4 h-4"
            />
            <LocalLink href="/business/card-trading" onClick={handleTradingClick} className="btn btn-secondary">
              {t.home.tradingPreview.cta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
