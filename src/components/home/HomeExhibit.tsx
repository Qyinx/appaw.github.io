'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import ShopNowButton from '@/components/ui/ShopNowButton';
import { useProtectorColorState } from '@/hooks/useProtectorColorState';
import { buildProtectorColors } from '@/lib/products/protector-colors';
import HeroSpecimenStage from './HeroSpecimenStage';

interface HomeHeroProps {
  onShopClick?: () => void;
  onCollectionClick?: () => void;
  onCenteringClick?: () => void;
}

function DisplayLine({ text, isZh }: { text: string; isZh: boolean }) {
  if (isZh) {
    return <span className="home-hero-poster__line">{text}</span>;
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
  const colors = buildProtectorColors(t);
  const {
    selectedColor,
    previousColorIndex,
    slideDir,
    colorSlideAnimated,
    isScanning,
  } = useProtectorColorState();

  const h = t.home.hero;
  const display = h.headlineLines[0]?.text ?? h.title;
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
    <section className="home-hero-exhibit relative flex flex-col border-b-2 border-border-strong bg-surface-bg">
      <div className="container-custom relative z-[1] flex-1 flex flex-col pt-8 sm:pt-10 pb-10">
        <div className="home-hero-exhibit__body flex-1">
          <div className="home-hero-exhibit__masthead">
            <p className="home-hero-kicker">{h.badge}</p>
            <h1
              className={`home-hero-poster${isZh ? ' home-hero-poster--zh' : ''}`}
              lang={isZh ? 'zh-HK' : 'en'}
            >
              <span className="sr-only">{h.h1Keyword}. </span>
              <DisplayLine text={display} isZh={isZh} />
            </h1>

            <p className="home-hero-exhibit__subtitle text-text-secondary leading-relaxed text-pretty max-w-[65ch]">
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
          </div>

          <div className="home-hero-exhibit__specimen">
            <HeroSpecimenStage
              colors={colors}
              selectedColor={selectedColor}
              previousColorIndex={previousColorIndex}
              slideDir={slideDir}
              colorSlideAnimated={colorSlideAnimated}
              isScanning={isScanning}
              productTitle={t.business.cardProtector.title}
            />
          </div>
        </div>

        <div className="home-hero-specs">
          {specGroups.map((group) => (
            <div key={group.index} className="home-hero-spec">
              <span className="home-hero-spec__index">{group.index}</span>
              <p className="home-hero-spec__title">{group.title}</p>
              <p className="home-hero-spec__body">{group.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
