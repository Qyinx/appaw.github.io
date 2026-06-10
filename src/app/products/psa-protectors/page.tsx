'use client';

import React, { useState } from 'react';
import LocalLink from '@/components/LocalLink';
import { ChevronRight, ChevronDown, Palette, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { en } from '@/i18n';
import RetailPartners from '@/components/RetailPartners';
import ShopNowButton from '@/components/ui/ShopNowButton';
import ProtectorTechnicalSpecs from '@/components/products/ProtectorTechnicalSpecs';
import ProductSpecPanel from '@/components/products/ProductSpecPanel';
import ColorVariantShowcase from '@/components/products/ColorVariantShowcase';
import ProductFeaturesShowcase from '@/components/products/ProductFeaturesShowcase';
import CompatibilityFitGuide from '@/components/products/CompatibilityFitGuide';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useProtectorColorState } from '@/hooks/useProtectorColorState';
import { buildProtectorColors } from '@/lib/products/protector-colors';

/* ─── FAQ Accordion ─── */
const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

/* ─── FAQ Accordion ─── */
function FaqAccordion({ items, visible }: {
  items: { q: string; a: string }[];
  visible: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-border-default border border-border-default">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="bg-surface-panel motion-reveal motion-reveal-up"
            data-visible={visible ? 'true' : 'false'}
            style={{ '--motion-delay': `${i * 40}ms` } as React.CSSProperties}
          >
            <button
              className="w-full flex items-start gap-5 py-6 px-5 text-left group"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={`flex-shrink-0 text-[0.65rem] font-bold tracking-widest mt-0.5 font-mono transition-colors duration-300 ${isOpen ? 'text-accent-brand' : 'text-text-muted'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`flex-1 text-sm font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-text-primary' : 'text-text-secondary'}`}>
                {item.q}
              </span>
              <ChevronDown
                className={`flex-shrink-0 w-4 h-4 mt-0.5 transition-[transform,color] duration-300 ${isOpen ? 'text-accent-brand rotate-180' : 'text-text-muted rotate-0'}`}
              />
            </button>
            <div
              className="overflow-hidden transition-[max-height,opacity] duration-300"
              style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <div className="pl-14 pr-5 pb-6">
                <div className="flex gap-4 border-l border-accent-brand/30 pl-4">
                  <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PSAProtectorPage() {
  const { t } = useLanguage();
  const centeringCrossLink = t.psaProtectorPage.centeringCrossLink ?? en.psaProtectorPage.centeringCrossLink;
  const hkGuide = t.psaProtectorPage.hkGuide ?? en.psaProtectorPage.hkGuide;
  const seoH1 = t.psaProtectorPage.seoH1 ?? en.psaProtectorPage.seoH1;
  const heroMounted = useHeroMount();
  const colors = buildProtectorColors(t);
  const {
    selectedColor,
    previousColorIndex,
    slideDir,
    colorSlideAnimated,
    isScanning,
    priceAnimating,
    selectColor,
  } = useProtectorColorState({ trackPrice: true });

  const featuresReveal = useRevealOnScroll<HTMLElement>();
  const colorsReveal   = useRevealOnScroll<HTMLElement>();
  const compatReveal   = useRevealOnScroll<HTMLElement>();
  const faqReveal      = useRevealOnScroll<HTMLElement>();
  const ctaReveal      = useRevealOnScroll<HTMLElement>();
  const overviewReveal = useRevealOnScroll<HTMLElement>();
  const hkGuideReveal  = useRevealOnScroll<HTMLElement>();

  const heroSpecs: [string, string][] = [
    [t.home.specs.rows.compatibility, t.home.specs.rows.compatibilityValue],
    [t.home.specs.rows.uvProtection, t.home.specs.rows.uvProtectionValue],
    [t.home.specs.rows.closure, t.home.specs.rows.closureValue],
  ];

  return (
    <div className="flex flex-col bg-surface-bg page-blueprint">

      {/* HERO — stamp + spec panel (aligned with homepage) */}
      <section className="relative section-padding border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <MotionStagger visible={heroMounted} className="min-w-0">
              <p className="section-label mb-6 motion-stagger-item">{t.psaProtectorPage.badge}</p>

              <h1 className="motion-stagger-item text-xl md:text-2xl font-display font-bold text-text-primary mb-4 leading-snug">
                {seoH1}
              </h1>

              <p className="motion-stagger-item text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                <span className="block text-accent-brand">{t.business.cardProtector.title}</span>
              </p>

              <p className="motion-stagger-item text-text-secondary text-base md:text-lg leading-relaxed max-w-lg mb-8">
                {t.business.cardProtector.description}
              </p>

              <div className="motion-stagger-item flex flex-col sm:flex-row flex-wrap gap-3">
                <ShopNowButton
                  label={t.business.cardProtector.cta}
                  shopOptions={t.shopOptions}
                  whatsappMessage={t.business.cardProtector.whatsappOrder}
                  buttonClassName="btn btn-primary"
                />
                <a
                  href="#color-options"
                  className="btn btn-ghost text-accent-brand"
                >
                  {t.psaProtectorPage.heroCta}
                </a>
              </div>
            </MotionStagger>

            <ProductSpecPanel
              visible={heroMounted}
              imageAlt={t.psaProtectorPage.heroImageAlt}
              specs={heroSpecs}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           OVERVIEW — Text-rich product description (SEO)
      ══════════════════════════════════════════ */}
      <section ref={overviewReveal.ref} className="section-padding bg-surface-panel border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <Reveal visible={overviewReveal.visible} dir="up" className="max-w-3xl mx-auto">
            <p className="section-label mb-5">{t.psaProtectorPage.overview.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.15] mb-8">
              {t.psaProtectorPage.overview.title}
            </h2>
            <div className="space-y-6">
              {t.psaProtectorPage.overview.body.map((para, i) => (
                <p key={i} className="text-text-secondary text-base md:text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section ref={hkGuideReveal.ref} className="section-padding bg-surface-bg border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <Reveal visible={hkGuideReveal.visible} dir="up" className="max-w-3xl mx-auto">
            <p className="section-label mb-5">{hkGuide.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.15] mb-8">
              {hkGuide.title}
            </h2>
            <div className="space-y-6">
              {hkGuide.body.map((para, i) => (
                <p key={i} className="text-text-secondary text-base md:text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            {'fullGuideLink' in hkGuide && hkGuide.fullGuideLink ? (
              <LocalLink
                href="/guides/choose-35pt-slab-protector/"
                className="inline-flex items-center gap-2 mt-8 text-accent-brand font-semibold text-sm group"
              >
                <span>{hkGuide.fullGuideLink}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" aria-hidden="true" />
              </LocalLink>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* FEATURES — spec list + panel carousel */}
      <section ref={featuresReveal.ref} className="section-padding border-t border-border-default bg-surface-bg overflow-hidden">
        <div className="container-custom">

          <Reveal visible={featuresReveal.visible} dir="up" className="text-center mb-16 max-w-xl mx-auto">
            <p className="section-label mb-5">{t.psaProtectorPage.featuresBadge}</p>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary mb-4">
              {t.psaProtectorPage.featuresTitle}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {t.psaProtectorPage.featuresSubtitle}
            </p>
          </Reveal>

          <Reveal visible={featuresReveal.visible} dir="up" delay={80}>
            <ProductFeaturesShowcase
              features={t.business.cardProtector.features}
              images={featureImages}
              pausedLabel={t.psaProtectorPage.carousel.paused}
              autoPlayingLabel={t.psaProtectorPage.carousel.autoPlaying}
            />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           COLORS — Color Variants Showcase
      ══════════════════════════════════════════ */}
      <section id="color-options" ref={colorsReveal.ref} className="section-padding border-t border-border-default bg-surface-bg overflow-hidden scroll-mt-20">
            <div className="container-custom">

              <Reveal visible={colorsReveal.visible} dir="up" className="mb-14 max-w-xl">
                <p className="section-label mb-5">
                  <Palette className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" aria-hidden="true" />
                  {t.psaProtectorPage.colorVariants.badge}
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-3">
                  {t.psaProtectorPage.colorVariants.title}
                </h2>
                <p className="text-text-secondary text-base leading-relaxed">
                  {t.psaProtectorPage.colorVariants.subtitle}
                </p>
              </Reveal>

              <Reveal visible={colorsReveal.visible} dir="up" delay={80}>
                <ColorVariantShowcase
                  colors={colors}
                  selectedColor={selectedColor}
                  previousColorIndex={previousColorIndex}
                  slideDir={slideDir}
                  colorSlideAnimated={colorSlideAnimated}
                  isScanning={isScanning}
                  priceAnimating={priceAnimating}
                  productTitle={t.business.cardProtector.title}
                  pickColorLabel={t.psaProtectorPage.colorVariants.pickColor}
                  gradientBadge={t.psaProtectorPage.colorVariants.pricing.gradient}
                  startingPriceLabel={t.business.cardProtector.startingPrice}
                  singlePrice={t.psaProtectorPage.colorVariants.pricing.singlePrice}
                  gradientPrice={t.psaProtectorPage.colorVariants.pricing.gradientPrice}
                  shippingInfo={t.business.cardProtector.shippingInfo}
                  ctaLabel={t.business.cardProtector.cta}
                  shopOptions={t.shopOptions}
                  whatsappMessage={t.business.cardProtector.whatsappOrder}
                  onSelectColor={selectColor}
                />
              </Reveal>
            </div>
      </section>

      {/* COMPATIBILITY — slab profile + verdict matrix */}
      <section ref={compatReveal.ref} className="section-padding border-t border-border-default bg-surface-panel page-blueprint overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[minmax(0,0.42fr)_1fr] gap-10 lg:gap-16 items-end mb-12 lg:mb-14">
            <Reveal visible={compatReveal.visible} dir="left" className="min-w-0">
              <p className="section-label mb-5">{t.psaProtectorPage.fitGuideBadge}</p>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.08] mb-4">
                {t.psaProtectorPage.compatibilityTitle}
              </h2>
            </Reveal>
            <Reveal visible={compatReveal.visible} dir="right" delay={60} className="min-w-0 lg:pb-1">
              <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl lg:ml-auto">
                {t.psaProtectorPage.compatibilitySubtitle}
              </p>
            </Reveal>
          </div>

          <CompatibilityFitGuide
            visible={compatReveal.visible}
            labels={{
              fitGuideBadge: t.psaProtectorPage.fitGuideBadge,
              compatibilityTitle: t.psaProtectorPage.compatibilityTitle,
              compatibilitySubtitle: t.psaProtectorPage.compatibilitySubtitle,
              compatible: t.psaProtectorPage.compatible,
              notCompatible: t.psaProtectorPage.notCompatible,
              note: t.psaProtectorPage.note,
              fitsSummary: t.business.cardProtector.compatibility.fits,
              notFitsSummary: t.business.cardProtector.compatibility.notFits,
              noteSummary: t.business.cardProtector.compatibility.note,
              fitGuide: t.psaProtectorPage.fitGuide ?? en.psaProtectorPage.fitGuide,
            }}
          />
        </div>
      </section>

      <ProtectorTechnicalSpecs variant="section" />

      {/* ══════════════════════════════════════════
           RETAIL PARTNERS
      ══════════════════════════════════════════ */}
      <RetailPartners />

      {/* ══════════════════════════════════════════
           CENTERING CROSS-LINK — internal link to tool pillar
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-surface-panel border-t border-border-default overflow-hidden">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-label mb-5 justify-center text-accent-link before:bg-accent-link">
              {centeringCrossLink.badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.15] mb-5">
              {centeringCrossLink.title}
            </h2>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8">
              {centeringCrossLink.body}
            </p>
            <LocalLink href="/tools/card-centering" className="btn btn-secondary">
              {centeringCrossLink.cta}
              <ChevronRight className="w-4 h-4" />
            </LocalLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           FAQ
      ══════════════════════════════════════════ */}
      <section ref={faqReveal.ref} className="section-padding bg-surface-panel border-t border-border-default overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 xl:gap-24 items-start">

            <Reveal visible={faqReveal.visible} dir="left" className="lg:sticky lg:top-32">
              <p className="section-label mb-5">{t.psaProtectorPage.faq.badge}</p>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-5">
                {t.psaProtectorPage.faq.title}
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-12">
                {t.psaProtectorPage.faq.subtitle}
              </p>

              <div className="flex items-end gap-3 mb-10">
                <span className="text-[5.5rem] font-bold font-display leading-none select-none text-surface-raised">
                  {t.psaProtectorPage.faq.items.length}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-text-muted leading-snug mb-4">
                  {t.psaProtectorPage.faqStats.questionsAnswered}
                </span>
              </div>

              <div className="h-px bg-border-default mb-10" />

              <div className="grid grid-cols-2 gap-px bg-border-default border border-border-default">
                {[
                  { v: '> 95%', l: t.psaProtectorPage.faqStats.uvBlocked },
                  { v: 'N52',   l: t.psaProtectorPage.faqStats.magnetGrade },
                  { v: '74 g',  l: t.psaProtectorPage.faqStats.weight },
                  { v: '8',     l: t.psaProtectorPage.faqStats.colors },
                ].map((s) => (
                  <div key={s.l} className="bg-surface-panel px-4 py-3 hover:bg-surface-raised transition-colors duration-300">
                    <p className="text-accent-brand text-base font-bold leading-none mb-1 font-tabular">{s.v}</p>
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal visible={faqReveal.visible} dir="right" delay={80}>
              <FaqAccordion items={t.psaProtectorPage.faq.items} visible={faqReveal.visible} />
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           CTA — Dark final stage
      ══════════════════════════════════════════ */}
      <section ref={ctaReveal.ref} className="section-padding bg-surface-bg border-t border-border-default overflow-hidden">
        <div className="container-custom">
          <Reveal visible={ctaReveal.visible} dir="up" className="max-w-2xl mx-auto text-center panel p-10">
            <p className="section-label mb-10 justify-center">{t.psaProtectorPage.ctaBadge}</p>

            <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-6">
              {t.psaProtectorPage.ctaTitle}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-12 max-w-xl mx-auto">
              {t.psaProtectorPage.ctaSubtitle}
            </p>

            <ShopNowButton
              label={t.business.cardProtector.cta}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              buttonClassName="btn btn-primary"
            />
          </Reveal>
        </div>
      </section>

    </div>
  );
}
