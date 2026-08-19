import React from 'react';
import SectionHeroBackground from '@/components/atmosphere/SectionHeroBackground';

type GuideHeroBackgroundProps = {
  src: string;
};

export default function GuideHeroBackground({ src }: GuideHeroBackgroundProps) {
  return <SectionHeroBackground src={src} anchor="left" />;
}
