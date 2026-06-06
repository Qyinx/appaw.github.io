'use client';



import React from 'react';

import LocalLink from '@/components/LocalLink';

import { ArrowRight, Star } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import RetailPartners from '@/components/RetailPartners';

import ShopNowButton from '@/components/ui/ShopNowButton';

import HeroStamp from '@/components/ui/HeroStamp';

import ProductSpecPanel from '@/components/products/ProductSpecPanel';

import Reveal, { MotionStagger } from '@/components/ui/Reveal';

import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

import trackEvent from '@/lib/analytics';



export default function HomeClient() {

  const { t } = useLanguage();

  const heroMounted = useHeroMount();

  const servicesReveal = useRevealOnScroll<HTMLElement>();

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



  const specPreview: [string, string][] = [
    [t.home.specs.rows.compatibility, t.home.specs.rows.compatibilityValue],
    [t.home.specs.rows.uvProtection, t.home.specs.rows.uvProtectionValue],
    [t.home.specs.rows.closure, t.home.specs.rows.closureValue],
  ];



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



  return (

    <div className="flex flex-col bg-surface-bg page-blueprint">



      {/* HERO — stamp + spec panel */}

      <section className="relative section-padding border-b border-border-default overflow-hidden">

        <div className="container-custom">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <MotionStagger visible={heroMounted} className="min-w-0">

              <p className="section-label mb-6 motion-stagger-item">{t.home.hero.badge}</p>



              <div className="motion-stagger-item mb-8">

                <HeroStamp />

              </div>



              <h1 className="motion-stagger-item text-xl md:text-2xl font-display font-bold text-text-primary mb-4 leading-snug">

                {t.home.hero.h1Keyword}

              </h1>



              <p className="motion-stagger-item text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">

                {t.home.hero.headlineLines.map(({ text, accent }, i) => (

                  <span

                    key={`${text}-${i}`}

                    className={`block ${accent ? 'text-accent-brand' : 'text-text-primary'}`}

                  >

                    {text}

                  </span>

                ))}

              </p>



              <p className="motion-stagger-item text-text-secondary text-base md:text-lg leading-relaxed mb-8 max-w-lg">

                {t.home.hero.subtitle}

              </p>



              <div className="motion-stagger-item flex flex-col sm:flex-row gap-3">

                <LocalLink href="/products/psa-protectors" onClick={handleShopClick} className="btn btn-primary">

                  {t.home.hero.cta}

                  <ArrowRight className="w-4 h-4" aria-hidden="true" />

                </LocalLink>

                <LocalLink href="/collection" onClick={handleCollectionClick} className="btn btn-secondary">

                  {t.nav.collection}

                </LocalLink>

                <LocalLink href="/tools/card-centering" onClick={handleCenteringClick} className="btn btn-ghost">

                  {t.nav.centeringTool}

                </LocalLink>

              </div>

            </MotionStagger>



            <ProductSpecPanel
              visible={heroMounted}
              imageAlt={t.psaProtectorPage.heroImageAlt}
              specs={specPreview}
            />

          </div>

        </div>

      </section>



      {/* SERVICES — spec-sheet cards */}

      <section ref={servicesReveal.ref} className="section-padding border-b border-border-default bg-surface-panel scroll-mt-20">

        <div className="container-custom">

          <Reveal visible={servicesReveal.visible} dir="up" className="mb-12 max-w-2xl">

            <p className="section-label mb-4">{t.home.services.badge}</p>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">

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

        </div>

      </section>



      {/* SEO SPEC TABLE */}

      <section ref={specsReveal.ref} className="section-padding border-b border-border-default">

        <div className="container-custom max-w-3xl">

          <Reveal visible={specsReveal.visible} dir="up">

            <p className="section-label mb-4">{t.home.specs.badge}</p>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-4">

              {t.home.specs.title}

            </h2>

            <p className="text-text-secondary mb-8">{t.home.specs.intro}</p>

          </Reveal>



          <Reveal visible={specsReveal.visible} dir="up" delay={80} className="panel p-6">

            {[

              [t.home.specs.rows.product, t.home.specs.rows.productValue],

              [t.home.specs.rows.compatibility, t.home.specs.rows.compatibilityValue],

              [t.home.specs.rows.material, t.home.specs.rows.materialValue],

              [t.home.specs.rows.closure, t.home.specs.rows.closureValue],

              [t.home.specs.rows.uvProtection, t.home.specs.rows.uvProtectionValue],

              [t.home.specs.rows.weight, t.home.specs.rows.weightValue],

              [t.home.specs.rows.dimensions, t.home.specs.rows.dimensionsValue],

              [t.home.specs.rows.origin, t.home.specs.rows.originValue],

            ].map(([label, value]) => (

              <div key={label} className="spec-row">

                <span className="spec-row__label">{label}</span>

                <span className="spec-row__value">{value}</span>

              </div>

            ))}

          </Reveal>



          <Reveal visible={specsReveal.visible} dir="up" delay={120} className="mt-8">

            <LocalLink href="/products/psa-protectors" onClick={handleShopClick} className="btn btn-primary">

              {t.home.specs.cta}

              <ArrowRight className="w-4 h-4" aria-hidden="true" />

            </LocalLink>

          </Reveal>

        </div>

      </section>



      <RetailPartners />



      {/* CTA */}

      <section ref={ctaReveal.ref} className="section-padding bg-surface-panel border-t border-border-default">

        <Reveal visible={ctaReveal.visible} dir="up" className="container-custom text-center max-w-2xl mx-auto">

          <Star className="w-5 h-5 text-accent-brand mx-auto mb-6" aria-hidden="true" />

          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">

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

            <LocalLink href="/business/card-trading" className="btn btn-secondary">

              {t.home.tradingPreview.cta}

              <ArrowRight className="w-4 h-4" aria-hidden="true" />

            </LocalLink>

          </div>

        </Reveal>

      </section>

    </div>

  );

}

