'use client';

import React from 'react';
import Image from 'next/image';
import { getImagePath } from '@/lib/utils';
import { type ProtectorColorVariant, protectorVariantId } from '@/lib/products/protector-colors';

interface HeroSpecimenStageProps {
  colors: ProtectorColorVariant[];
  selectedColor: number;
  previousColorIndex: number;
  slideDir: 'left' | 'right';
  colorSlideAnimated: boolean;
  isScanning: boolean;
  productTitle: string;
}

export default function HeroSpecimenStage({
  colors,
  selectedColor,
  previousColorIndex,
  slideDir,
  colorSlideAnimated,
  isScanning,
  productTitle,
}: HeroSpecimenStageProps) {
  const active = colors[selectedColor];

  return (
    <div
      className="home-hero-stage"
      aria-live="polite"
      aria-atomic="true"
      data-scanning={isScanning ? 'true' : 'false'}
      style={{ '--stage-glow': active.glow, '--stage-accent': active.accent } as React.CSSProperties}
    >
      <div className="home-hero-stage__halo" aria-hidden="true" />
      <div className="home-hero-stage__ring" aria-hidden="true" />
      <div className="home-hero-stage__crosshair" aria-hidden="true" />

      <div className="home-hero-stage__pins">
        <div
          key={selectedColor}
          className="home-hero-pin home-hero-pin--id font-mono font-tabular"
        >
          {protectorVariantId(selectedColor)}
        </div>
      </div>

      <div className="home-hero-stage__viewport home-hero-stage__viewport--float">
        <div
          className="color-variant-stage relative w-full h-full"
          data-animated={colorSlideAnimated ? 'true' : 'false'}
          data-dir={slideDir}
          data-scanning={isScanning ? 'true' : 'false'}
        >
          {colors.map((color, i) => {
            let slideState: 'active' | 'exit' | 'idle' = 'idle';
            if (i === selectedColor) slideState = 'active';
            else if (colorSlideAnimated && i === previousColorIndex) slideState = 'exit';

            return (
              <div
                key={color.image}
                className="color-variant-slide"
                data-state={slideState}
                aria-hidden={slideState !== 'active'}
              >
                <Image
                  src={getImagePath(color.image)}
                  alt={`${productTitle} – ${color.name}`}
                  fill
                  className="object-contain p-3 sm:p-5"
                  sizes="(max-width: 768px) 70vw, 360px"
                  priority={i === 0}
                />
              </div>
            );
          })}
          <div className="color-grid-overlay pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
          <div className="color-scan-beam pointer-events-none absolute inset-x-0 z-[5]" aria-hidden="true" />
        </div>
      </div>

    </div>
  );
}
