import React from 'react';
import { SITE_BACKGROUNDS } from '@/lib/site-backgrounds';
import { getImagePath } from '@/lib/utils';

type SectionHeroBackgroundProps = {
  src?: string;
  /** Illustration anchor — guides use left; marketing heroes use right. */
  anchor?: 'left' | 'right';
};

export default function SectionHeroBackground({
  src = SITE_BACKGROUNDS.secondary,
  anchor = 'right',
}: SectionHeroBackgroundProps) {
  return (
    <div
      className={`hero-bg-slab-art${anchor === 'right' ? ' hero-bg-slab-art--anchor-right' : ''}`}
      aria-hidden="true"
    >
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
