'use client';

import React, { useCallback, useRef } from 'react';
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
  /** Optional override for active image alt (SEO). Defaults to title + color name. */
  imageAlt?: string;
  onHoverChange?: (hovered: boolean) => void;
}

export default function HeroSpecimenStage({
  colors,
  selectedColor,
  previousColorIndex,
  slideDir,
  colorSlideAnimated,
  isScanning,
  productTitle,
  imageAlt,
  onHoverChange,
}: HeroSpecimenStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const active = colors[selectedColor];

  const mountedIndexes = new Set<number>([selectedColor]);
  if (colorSlideAnimated && previousColorIndex !== selectedColor) {
    mountedIndexes.add(previousColorIndex);
  }

  const resetParallax = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--px', '0');
    el.style.setProperty('--py', '0');
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty('--px', String(Math.max(-1, Math.min(1, x))));
    el.style.setProperty('--py', String(Math.max(-1, Math.min(1, y))));
  }, []);

  return (
    <div
      ref={stageRef}
      className="home-hero-stage"
      aria-live="polite"
      aria-atomic="true"
      data-scanning={isScanning ? 'true' : 'false'}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        resetParallax();
        onHoverChange?.(false);
      }}
      onPointerEnter={() => onHoverChange?.(true)}
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

      <div className="home-hero-stage__parallax">
        <div className="home-hero-stage__viewport home-hero-stage__viewport--float">
          <div
            className="color-variant-stage relative w-full h-full"
            data-animated={colorSlideAnimated ? 'true' : 'false'}
            data-dir={slideDir}
            data-scanning={isScanning ? 'true' : 'false'}
          >
            {colors.map((color, i) => {
              if (!mountedIndexes.has(i)) return null;

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
                    alt={
                      slideState === 'active' && imageAlt
                        ? imageAlt
                        : `${productTitle} - ${color.name}`
                    }
                    fill
                    className="object-contain p-3 sm:p-5"
                    sizes="(max-width: 768px) 70vw, 360px"
                    priority={i === 0}
                    fetchPriority={i === 0 || i === selectedColor ? 'high' : 'auto'}
                  />
                </div>
              );
            })}
            <div className="color-grid-overlay pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
            <div className="color-scan-beam pointer-events-none absolute inset-x-0 z-[5]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
