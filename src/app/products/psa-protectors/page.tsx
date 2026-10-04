'use client';

import React, { useState } from 'react';
import LocalLink from '@/components/LocalLink';
import { ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { en } from '@/i18n';
import RetailPartners from '@/components/RetailPartners';
import TrustpilotReviewCollector from '@/components/TrustpilotReviewCollector';
import ShopNowButton from '@/components/ui/ShopNowButton';
import ColorVariantShowcase from '@/components/products/ColorVariantShowcase';
import ProductFeaturesShowcase from '@/components/products/ProductFeaturesShowcase';
import CompatibilityFitGuide from '@/components/products/CompatibilityFitGuide';
import Reveal from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useProtectorColorState } from '@/hooks/useProtectorColorState';
import { useSiteFrameColor } from '@/hooks/useSiteFrameColor';
import { buildProtectorColors } from '@/lib/products/protector-colors';
import { protectorPriceLabels } from '@/lib/products/protector-pricing';

const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

function FaqAccordion({
  items,
  visible,
}: {
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
              <span
                className={`flex-shrink-0 text-[0.65rem] font-bold tracking-widest mt-0.5 font-mono transition-colors duration-300 ${isOpen ? 'text-accent-brand' : 'text-text-muted'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`flex-1 text-sm font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-text-primary' : 'text-text-secondary'}`}
              >
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
  const page = t.psaProtectorPage;
  const centeringCrossLink = page.centeringCrossLink ?? en.psaProtectorPage.centeringCrossLink;
  const hkGuide = page.hkGuide ?? en.psaProtectorPage.hkGuide;
  const seoH1 = page.seoH1 ?? en.psaProtectorPage.seoH1;
  const heroMounted = useHeroMount();
  const colors = buildProtectorColors(t);
  const prices = protectorPriceLabels();
  const {
    selectedColor,
    previousColorIndex,
    slideDir,
    colorSlideAnimated,
    isScanning,
    priceAnimating,
    selectColor,
  } = useProtectorColorState({
    trackPrice: true,
  });

  const activeFinish = colors[selectedColor];
  useSiteFrameColor(activeFinish?.hex, activeFinish?.hex2);

  const notesReveal = useRevealOnScroll<HTMLElement>();
  const featuresReveal = useRevealOnScroll<HTMLElement>();
  const compatReveal = useRevealOnScroll<HTMLElement>();
  const faqReveal = useRevealOnScroll<HTMLElement>();
  const ctaReveal = useRevealOnScroll<HTMLElement>();

  return (
    <div className="flex flex-col bg-surface-bg">
      {/* HERO — Choose Your Style, compact for first viewport */}
      <section
        id="color-options"
        className="pt-6 pb-8 md:pt-8 md:pb-10 border-b-2 border-border-strong bg-surface-bg overflow-hidden scroll-mt-20"
      >
        <div className="container-custom">
          <Reveal visible={heroMounted} dir="up">
            <ColorVariantShowcase
              colors={colors}
              selectedColor={selectedColor}
              previousColorIndex={previousColorIndex}
              slideDir={slideDir}
              colorSlideAnimated={colorSlideAnimated}
              isScanning={isScanning}
              priceAnimating={priceAnimating}
              productTitle={t.business.cardProtector.title}
              pickColorLabel={page.colorVariants.pickColor}
              gradientBadge={page.colorVariants.pricing.gradient}
              startingPriceLabel={t.business.cardProtector.startingPrice}
              singlePrice={prices.single}
              gradientPrice={prices.gradient}
              shippingInfo={t.business.cardProtector.shippingInfo}
              ctaLabel={t.business.cardProtector.cta}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              onSelectColor={selectColor}
              hero={{
                badge: page.colorVariants.badge,
                seoH1,
                title: page.colorVariants.title,
                subtitle: page.colorVariants.subtitle,
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* COLLECTOR NOTES — merged overview + HK guide */}
      <section
        ref={notesReveal.ref}
        className="section-padding bg-surface-panel border-b border-border-default overflow-hidden"
      >
        <div className="container-custom">
          <Reveal visible={notesReveal.visible} dir="up" className="max-w-3xl">
            <p className="section-label mb-4">{page.overview.badge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.15] mb-6">
              {page.overview.title}
            </h2>
            <div className="space-y-4">
              {page.overview.body.map((para, i) => (
                <p key={`overview-${i}`} className="text-text-secondary text-base leading-relaxed">
                  {para}
                </p>
              ))}
              {hkGuide.body.map((para, i) => (
                <p key={`guide-${i}`} className="text-text-secondary text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            {'fullGuideLink' in hkGuide && hkGuide.fullGuideLink ? (
              <LocalLink
                href="/guides/choose-35pt-slab-protector/"
                className="inline-flex items-center gap-2 mt-6 text-accent-brand font-semibold text-sm group"
              >
                <span>{hkGuide.fullGuideLink}</span>
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150"
                  aria-hidden="true"
                />
              </LocalLink>
            ) : null}
            {'guideLinks' in hkGuide && hkGuide.guideLinks?.length ? (
              <div className="mt-10 pt-8 border-t border-border-default">
                <p className="section-label mb-4">
                  {'guideLinksTitle' in hkGuide ? hkGuide.guideLinksTitle : 'Related guides'}
                </p>
                <ul className="grid sm:grid-cols-2 gap-px bg-border-default border border-border-default">
                  {hkGuide.guideLinks.map((link) => (
                    <li key={link.href}>
                      <LocalLink
                        href={link.href}
                        className="flex items-center justify-between gap-3 p-4 bg-surface-panel hover:bg-surface-raised transition-colors duration-150 group h-full"
                      >
                        <span className="text-sm font-medium text-text-primary leading-snug">
                          {link.label}
                        </span>
                        <ArrowRight
                          className="w-4 h-4 shrink-0 text-text-muted group-hover:text-accent-brand group-hover:translate-x-0.5 transition-all duration-150"
                          aria-hidden="true"
                        />
                      </LocalLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={featuresReveal.ref}
        className="section-padding border-b border-border-default bg-surface-bg overflow-hidden"
      >
        <div className="container-custom">
          <Reveal visible={featuresReveal.visible} dir="up" className="mb-10 max-w-xl">
            <p className="section-label mb-4">{page.featuresBadge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
              {page.featuresTitle}
            </h2>
          </Reveal>

          <Reveal visible={featuresReveal.visible} dir="up" delay={80}>
            <ProductFeaturesShowcase
              features={t.business.cardProtector.features}
              images={featureImages}
              pausedLabel={page.carousel.paused}
              autoPlayingLabel={page.carousel.autoPlaying}
            />
          </Reveal>
        </div>
      </section>

      {/* COMPATIBILITY */}
      <section
        ref={compatReveal.ref}
        className="section-padding border-b border-border-default bg-surface-panel overflow-hidden"
      >
        <div className="container-custom">
          <Reveal visible={compatReveal.visible} dir="up" className="mb-8 max-w-xl">
            <p className="section-label mb-4">{page.fitGuideBadge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.08]">
              {page.compatibilityTitle}
            </h2>
          </Reveal>

          <CompatibilityFitGuide
            visible={compatReveal.visible}
            labels={{
              fitGuideBadge: page.fitGuideBadge,
              compatibilityTitle: page.compatibilityTitle,
              compatibilitySubtitle: page.compatibilitySubtitle,
              compatible: page.compatible,
              notCompatible: page.notCompatible,
              note: page.note,
              fitsSummary: t.business.cardProtector.compatibility.fits,
              notFitsSummary: t.business.cardProtector.compatibility.notFits,
              noteSummary: t.business.cardProtector.compatibility.note,
              fitGuide: page.fitGuide ?? en.psaProtectorPage.fitGuide,
            }}
          />
        </div>
      </section>

      <RetailPartners />

      {/* TRUSTPILOT — compact */}
      <section className="py-12 md:py-14 bg-surface-bg border-b border-border-default">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-4 justify-center">{page.trustpilotReview.badge}</p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary leading-[1.15] mb-3">
              {page.trustpilotReview.title}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {page.trustpilotReview.body}
            </p>
            <TrustpilotReviewCollector />
          </div>
        </div>
      </section>

      {/* CENTERING CROSS-LINK — compact */}
      <section className="py-12 md:py-14 bg-surface-panel border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <p className="section-label mb-4 justify-center text-accent-link before:bg-accent-link">
              {centeringCrossLink.badge}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary leading-[1.15] mb-3">
              {centeringCrossLink.title}
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
              {centeringCrossLink.body}
            </p>
            <LocalLink href="/tools/card-centering" className="btn btn-secondary">
              {centeringCrossLink.cta}
              <ChevronRight className="w-4 h-4" />
            </LocalLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqReveal.ref}
        className="section-padding bg-surface-bg border-b border-border-default overflow-hidden"
      >
        <div className="container-custom">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-12 xl:gap-20 items-start">
            <Reveal visible={faqReveal.visible} dir="left" className="lg:sticky lg:top-32">
              <p className="section-label mb-4">{page.faq.badge}</p>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.1] mb-4">
                {page.faq.title}
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">{page.faq.subtitle}</p>

              <div className="grid grid-cols-2 gap-px bg-border-default border border-border-default">
                {[
                  { v: '> 95%', l: page.faqStats.uvBlocked },
                  { v: 'N52', l: page.faqStats.magnetGrade },
                  { v: '74 g', l: page.faqStats.weight },
                  { v: '8', l: page.faqStats.colors },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="bg-surface-panel px-4 py-3 hover:bg-surface-raised transition-colors duration-300"
                  >
                    <p className="text-accent-brand text-base font-bold leading-none mb-1 font-tabular">
                      {s.v}
                    </p>
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal visible={faqReveal.visible} dir="right" delay={80}>
              <FaqAccordion items={page.faq.items} visible={faqReveal.visible} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaReveal.ref}
        className="section-padding bg-surface-panel border-t border-border-default overflow-hidden"
      >
        <div className="container-custom">
          <Reveal visible={ctaReveal.visible} dir="up" className="max-w-2xl mx-auto text-center">
            <p className="section-label mb-6 justify-center">{page.ctaBadge}</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary leading-[1.1] mb-4">
              {page.ctaTitle}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-xl mx-auto">
              {page.ctaSubtitle}
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
