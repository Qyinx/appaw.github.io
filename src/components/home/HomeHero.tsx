'use client';

import React, { useCallback, useState } from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ShopNowButton from '@/components/ui/ShopNowButton';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount } from '@/hooks/useRevealOnScroll';
import { useProtectorColorState } from '@/hooks/useProtectorColorState';
import { useHeroColorAutoplay } from '@/hooks/useHeroColorAutoplay';
import { buildProtectorColors } from '@/lib/products/protector-colors';
import HeroSpecimenStage from './HeroSpecimenStage';
import HeroColorFilmstrip from './HeroColorFilmstrip';

const AUTOPLAY_INTERVAL_MS = 4200;

interface HomeHeroProps {
  onShopClick?: () => void;
  onCollectionClick?: () => void;
  onCenteringClick?: () => void;
}

export default function HomeHero({ onShopClick, onCollectionClick, onCenteringClick }: HomeHeroProps) {
  const { t, language } = useLanguage();
  const isZh = language === 'zh';
  const heroMounted = useHeroMount();
  const colors = buildProtectorColors(t);
  const {
    selectedColor,
    previousColorIndex,
    slideDir,
    colorSlideAnimated,
    isScanning,
    selectColor,
  } = useProtectorColorState();

  const [hoverPaused, setHoverPaused] = useState(false);

  const { pause: pauseAutoplay } = useHeroColorAutoplay(
    colors.length,
    selectedColor,
    selectColor,
    { intervalMs: AUTOPLAY_INTERVAL_MS, hoverPaused },
  );

  const handleUserColorInteract = useCallback(() => {
    pauseAutoplay();
  }, [pauseAutoplay]);

  const h = t.home.hero;

  return (
    <section className="home-hero-exhibit relative flex flex-col border-b border-border-default page-blueprint min-h-[min(85dvh,940px)] lg:min-h-[min(92dvh,940px)]">
      <div className="home-hero-exhibit__atmosphere" aria-hidden="true" />

      <div className="container-custom relative z-[1] flex-1 flex flex-col pt-8 sm:pt-10 pb-0">
        <MotionStagger visible={heroMounted} className="home-hero-exhibit__top flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-6 sm:mb-8">
          <p className="section-label motion-stagger-item !mb-0">{h.badge}</p>
          <ul className="home-hero-exhibit__metrics motion-stagger-item flex flex-wrap justify-end gap-x-4 gap-y-1 list-none p-0 m-0">
            {h.trustRibbon.map(({ value, label }) => (
              <li key={label} className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted whitespace-nowrap">
                <span className="text-text-primary font-tabular">{value}</span>
                <span className="mx-1.5 text-border-strong" aria-hidden="true">
                  /
                </span>
                {label}
              </li>
            ))}
          </ul>
        </MotionStagger>

        <div
          className="home-hero-exhibit__body flex-1"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
        >
          <MotionStagger visible={heroMounted} className="home-hero-exhibit__masthead">
            <h1
              className={`home-hero-poster motion-stagger-item${isZh ? ' home-hero-poster--zh' : ''}`}
              lang={isZh ? 'zh-HK' : 'en'}
            >
              <span className="sr-only">{h.h1Keyword}. </span>
              {h.headlineLines.map(({ text, accent }, i) => (
                <span
                  key={`${text}-${i}`}
                  className={`home-hero-poster__line home-hero-poster__line--${i}`}
                  data-accent={accent ? 'true' : 'false'}
                >
                  {text}
                </span>
              ))}
            </h1>

            <p className="home-hero-exhibit__subtitle motion-stagger-item text-text-secondary text-base md:text-lg leading-relaxed text-pretty">
              {h.subtitle}
            </p>
          </MotionStagger>

          <Reveal visible={heroMounted} dir="up" delay={160} className="home-hero-exhibit__specimen">
            <HeroSpecimenStage
              colors={colors}
              selectedColor={selectedColor}
              previousColorIndex={previousColorIndex}
              slideDir={slideDir}
              colorSlideAnimated={colorSlideAnimated}
              isScanning={isScanning}
              productTitle={t.business.cardProtector.title}
            />
          </Reveal>
        </div>

        <MotionStagger visible={heroMounted} className="home-hero-dock">
          <div className="home-hero-dock__inner">
            <div className="home-hero-dock__cta">
              <ShopNowButton
                label={h.cta}
                shopOptions={t.shopOptions}
                whatsappMessage={t.business.cardProtector.whatsappOrder}
                buttonClassName="btn btn-primary w-full sm:w-auto"
                onClick={onShopClick}
              />
            </div>
            <nav className="home-hero-dock__nav" aria-label={h.secondaryNav}>
              <LocalLink
                href="/collection"
                onClick={onCollectionClick}
                className="home-hero-dock__link"
              >
                {t.nav.collection}
              </LocalLink>
              <LocalLink
                href="/tools/card-centering"
                onClick={onCenteringClick}
                className="home-hero-dock__link"
              >
                {t.nav.centeringTool}
              </LocalLink>
              <LocalLink href="/products/psa-protectors" className="home-hero-dock__link home-hero-dock__link--accent">
                {h.instrument.viewProduct}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </LocalLink>
            </nav>
          </div>
        </MotionStagger>
      </div>

      <HeroColorFilmstrip
        colors={colors}
        selectedColor={selectedColor}
        pickColorLabel={h.instrument.pickColor}
        headerLabel={h.instrument.headerLabel}
        variantIdLabel={h.instrument.variantId}
        finishTypeLabel={h.instrument.finishType}
        finishSolidLabel={t.psaProtectorPage.colorVariants.pricing.single}
        finishGradientLabel={t.psaProtectorPage.colorVariants.pricing.gradient}
        cycleDurationMs={AUTOPLAY_INTERVAL_MS}
        isAutoplayActive={!hoverPaused}
        onSelectColor={selectColor}
        onUserInteract={handleUserColorInteract}
      />
    </section>
  );
}
