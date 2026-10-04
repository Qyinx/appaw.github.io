'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import ShopNowButton from '@/components/ui/ShopNowButton';
import { useHeroMount } from '@/hooks/useRevealOnScroll';
import { useProtectorColorState } from '@/hooks/useProtectorColorState';
import {
  buildProtectorColors,
  protectorVariantId,
} from '@/lib/products/protector-colors';
import HeroColorFilmstrip from './HeroColorFilmstrip';
import HeroSpecimenStage from './HeroSpecimenStage';

const AUTOPLAY_MS = 4200;

interface HomeHeroProps {
  onShopClick?: () => void;
  onCollectionClick?: () => void;
  onCenteringClick?: () => void;
}

function DisplayLine({
  text,
  isZh,
  accent,
}: {
  text: string;
  isZh: boolean;
  accent?: boolean;
}) {
  if (!accent) {
    return <span className="home-hero-poster__line">{text}</span>;
  }

  if (isZh) {
    return (
      <span className="home-hero-poster__line">
        <span className="home-hero-poster__mark">{text.slice(0, 1)}</span>
        {text.slice(1)}
      </span>
    );
  }

  const vowel = /[aeiou]/i;
  const idx = [...text].findIndex((ch) => vowel.test(ch));
  if (idx < 0) {
    return <span className="home-hero-poster__line">{text}</span>;
  }

  return (
    <span className="home-hero-poster__line">
      {text.slice(0, idx)}
      <span className="home-hero-poster__mark">{text[idx]}</span>
      {text.slice(idx + 1)}
    </span>
  );
}

export default function HomeHero({ onShopClick }: HomeHeroProps) {
  const { t, language } = useLanguage();
  const isZh = language === 'zh';
  const mounted = useHeroMount();
  const colors = buildProtectorColors(t);
  const {
    selectedColor,
    previousColorIndex,
    slideDir,
    colorSlideAnimated,
    isScanning,
    isAutoplayActive,
    selectColor,
    pauseForUser,
    setHoverPaused,
  } = useProtectorColorState({
    autoplayMs: AUTOPLAY_MS,
    colorCount: colors.length,
  });

  const h = t.home.hero;
  const finishes = t.psaProtectorPage.colorVariants.pricing;
  const active = colors[selectedColor];
  const chips = [
    h.featureChips.uv,
    h.featureChips.magnets,
    h.featureChips.fit,
  ];
  const specGroups = [
    {
      index: '01',
      title: t.home.features.quality.title,
      body: t.home.features.quality.description,
    },
    {
      index: '02',
      title: t.home.features.trust.title,
      body: t.home.features.trust.description,
    },
  ];

  return (
    <section className="home-hero-exhibit home-hero-exhibit--plate relative flex flex-col border-b-2 border-border-strong bg-surface-bg">
      <div className="home-hero-plate">
        <Reveal visible={mounted} dir="up" delay={0} className="home-hero-plate__kicker">
          <p className="home-hero-kicker home-hero-kicker--stamp">{h.badge}</p>
        </Reveal>

        <Reveal visible={mounted} dir="up" delay={90} className="home-hero-plate__type">
          <h1
            className={`home-hero-poster${isZh ? ' home-hero-poster--zh' : ''}`}
            lang={isZh ? 'zh-HK' : 'en'}
            data-visible={mounted ? 'true' : 'false'}
          >
            <span className="sr-only">{h.h1Keyword}. </span>
            {h.headlineLines.map((line) => (
              <DisplayLine
                key={line.text}
                text={line.text}
                isZh={isZh}
                accent={line.accent}
              />
            ))}
          </h1>
          <ul className="home-hero-plate__chips" aria-label={h.badge}>
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal visible={mounted} dir="right" delay={160} className="home-hero-plate__stage">
          <HeroSpecimenStage
            colors={colors}
            selectedColor={selectedColor}
            previousColorIndex={previousColorIndex}
            slideDir={slideDir}
            colorSlideAnimated={colorSlideAnimated}
            isScanning={isScanning}
            productTitle={t.business.cardProtector.title}
            onHoverChange={setHoverPaused}
          />
        </Reveal>

        <div className="home-hero-plate__rail">
          <HeroColorFilmstrip
            layout="rail"
            colors={colors}
            selectedColor={selectedColor}
            pickColorLabel={h.instrument.pickColor}
            headerLabel={h.instrument.headerLabel}
            variantIdLabel={h.instrument.variantId}
            finishTypeLabel={h.instrument.finishType}
            finishSolidLabel={finishes.single}
            finishGradientLabel={finishes.gradient}
            cycleDurationMs={AUTOPLAY_MS}
            isAutoplayActive={isAutoplayActive}
            onSelectColor={selectColor}
            onUserInteract={pauseForUser}
          />
        </div>

        <Reveal visible={mounted} dir="up" delay={240} className="home-hero-plate__foot">
          <p className="home-hero-plate__finish font-mono">
            <span className="home-hero-plate__finish-id">{protectorVariantId(selectedColor)}</span>
            <span className="home-hero-plate__finish-name">{active.name}</span>
          </p>
          <p className="home-hero-exhibit__subtitle text-text-secondary leading-relaxed text-pretty">
            {h.subtitle}
          </p>
          <div className="home-hero-cta-row">
            <ShopNowButton
              label={h.cta}
              shopOptions={t.shopOptions}
              whatsappMessage={t.business.cardProtector.whatsappOrder}
              buttonClassName="btn btn-primary w-full sm:w-auto"
              onClick={onShopClick}
            />
            <LocalLink href="/products/psa-protectors" className="btn btn-secondary w-full sm:w-auto">
              {h.instrument.viewProduct}
            </LocalLink>
          </div>
        </Reveal>
      </div>

      <div className="container-custom relative z-[1] pb-10">
        <MotionStagger visible={mounted} className="home-hero-specs" as="div">
          {specGroups.map((group) => (
            <div key={group.index} className="home-hero-spec motion-stagger-item">
              <span className="home-hero-spec__index">{group.index}</span>
              <p className="home-hero-spec__title">{group.title}</p>
              <p className="home-hero-spec__body">{group.body}</p>
            </div>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
