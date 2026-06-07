import React from 'react';
import { getImagePath } from '@/lib/utils';

type GuideHeroBackgroundProps = {
  src: string;
};

export default function GuideHeroBackground({ src }: GuideHeroBackgroundProps) {
  return (
    <div className="hero-bg-slab-art" aria-hidden="true">
      <img
        src={getImagePath(src)}
        alt=""
        width={1920}
        height={1080}
        className="hero-bg-slab-art__img"
        decoding="async"
      />
    </div>
  );
}
