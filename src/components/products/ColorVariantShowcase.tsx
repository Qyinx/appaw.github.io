'use client';

import React from 'react';
import Image from 'next/image';
import { getImagePath } from '@/lib/utils';
import ShopNowButton from '@/components/ui/ShopNowButton';
import type { ShopOptionsLabels } from '@/components/ui/ShopNowButton';

export interface ColorVariant {
  name: string;
  hex: string;
  hex2?: string;
  accent: string;
  glow: string;
  ring: string;
  image: string;
}

interface ColorVariantShowcaseProps {
  colors: ColorVariant[];
  selectedColor: number;
  previousColorIndex: number;
  slideDir: 'left' | 'right';
  colorSlideAnimated: boolean;
  isScanning: boolean;
  priceAnimating: boolean;
  productTitle: string;
  pickColorLabel: string;
  gradientBadge: string;
  startingPriceLabel: string;
  singlePrice: string;
  gradientPrice: string;
  shippingInfo: string;
  ctaLabel: string;
  shopOptions: ShopOptionsLabels;
  whatsappMessage: string;
  onSelectColor: (index: number) => void;
  /** Optional hero copy rendered in the controls column (keeps first viewport shorter). */
  hero?: {
    badge: string;
    seoH1: string;
    title: string;
    subtitle?: string;
  };
}

function padSlot(n: number, total: number) {
  return `${String(n + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
}

function variantId(index: number) {
  return `APP-C${String(index + 1).padStart(2, '0')}`;
}

export default function ColorVariantShowcase({
  colors,
  selectedColor,
  previousColorIndex,
  slideDir,
  colorSlideAnimated,
  isScanning,
  priceAnimating,
  productTitle,
  pickColorLabel,
  gradientBadge,
  startingPriceLabel,
  singlePrice,
  gradientPrice,
  shippingInfo,
  ctaLabel,
  shopOptions,
  whatsappMessage,
  onSelectColor,
  hero,
}: ColorVariantShowcaseProps) {
  const active = colors[selectedColor];
  const slotLabel = padSlot(selectedColor, colors.length);

  return (
    <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 lg:gap-8 items-start">
      {/* Instrument viewport */}
      <div
        className="color-instrument panel p-0 overflow-hidden"
        style={{ boxShadow: `0 0 0 1px var(--border-default), 0 12px 28px ${active.glow}` }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="color-instrument__header border-b border-border-default px-3 py-2 flex items-center justify-between gap-3 bg-surface-raised">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Color Spec</span>
          <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">{slotLabel}</span>
          <span
            className={`font-mono text-xs uppercase tracking-wider ${isScanning ? 'color-sync-status' : 'text-accent-warn'}`}
          >
            {isScanning ? 'Sync…' : 'Locked'}
          </span>
        </div>

        <div className="p-3">
          <div
            className="color-instrument__viewport relative border border-border-strong bg-surface-bg"
            style={{ borderLeftColor: active.accent, borderLeftWidth: '3px' }}
          >
            <div
              className="color-variant-stage relative mx-auto h-[min(40dvh,300px)] aspect-[4/5] max-w-full"
              data-animated={colorSlideAnimated ? 'true' : 'false'}
              data-dir={slideDir}
              data-scanning={isScanning ? 'true' : 'false'}
            >
              {colors.map((color, i) => {
                const mounted =
                  i === selectedColor ||
                  (colorSlideAnimated && i === previousColorIndex);
                if (!mounted) return null;

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
                      className="object-contain p-2.5"
                      sizes="(max-width: 1024px) 70vw, 360px"
                      priority={i === 0}
                      fetchPriority={i === 0 || i === selectedColor ? 'high' : 'auto'}
                    />
                  </div>
                );
              })}
              <div className="color-grid-overlay pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
              <div className="color-scan-beam pointer-events-none absolute inset-x-0 z-[5]" aria-hidden="true" />
              <div className="color-viewport-corners pointer-events-none absolute inset-0 z-[6]" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 border border-border-default bg-surface-panel px-3 py-2 font-mono text-xs">
            <span className="text-text-muted">{variantId(selectedColor)}</span>
            <span className="text-text-secondary font-tabular">{active.hex.toUpperCase()}</span>
            {active.hex2 ? (
              <span className="text-text-secondary font-tabular">{active.hex2.toUpperCase()}</span>
            ) : null}
            <span className="ml-auto text-text-muted uppercase tracking-wider">
              {active.hex2 ? gradientBadge : 'Solid'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="min-w-0 flex flex-col">
        {hero ? (
          <div className="mb-4">
            <p className="section-label mb-2">{hero.badge}</p>
            <h1 className="text-sm md:text-base font-display font-bold text-text-secondary leading-snug mb-1.5">
              {hero.seoH1}
            </h1>
            <p className="font-display text-2xl md:text-3xl font-bold text-text-primary leading-tight">
              {hero.title}
            </p>
            {hero.subtitle ? (
              <p className="mt-1.5 text-text-secondary text-sm leading-relaxed line-clamp-2">
                {hero.subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mb-4">
          <p className="section-label mb-2">{pickColorLabel}</p>
          <div className="flex items-center gap-2.5 flex-wrap min-h-[2rem]">
            <span
              key={selectedColor}
              className="color-variant-name font-display text-2xl md:text-3xl font-bold text-text-primary leading-none tracking-tight"
              data-animated={colorSlideAnimated ? 'true' : 'false'}
            >
              {active.name}
            </span>
            {active.hex2 && (
              <span className="px-2 py-0.5 text-xs uppercase tracking-[0.14em] font-bold border border-border-strong text-text-secondary bg-surface-raised font-mono">
                {gradientBadge}
              </span>
            )}
          </div>
        </div>

        <div
          className="grid grid-cols-4 gap-2 mb-4"
          role="radiogroup"
          aria-label={pickColorLabel}
        >
          {colors.map((color, i) => {
            const isActive = selectedColor === i;
            return (
              <button
                key={color.image}
                type="button"
                role="radio"
                onClick={() => onSelectColor(i)}
                aria-label={color.name}
                aria-checked={isActive}
                className="color-swatch-btn group flex flex-col items-center gap-1 w-full"
              >
                <div className="relative w-full">
                  {isActive && (
                    <span className="color-swatch-index font-mono text-[0.6rem] text-accent-warn absolute -top-1 left-0 z-10 font-tabular">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                  <div
                    className="color-swatch-chip w-full h-7 border border-border-default"
                    style={{
                      background: color.hex2
                        ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex2} 100%)`
                        : color.hex,
                      outline: isActive ? `2px solid ${color.ring}` : '2px solid transparent',
                      outlineOffset: '2px',
                      boxShadow: isActive
                        ? `0 3px 10px ${color.glow}, inset 0 0 0 1px rgba(255,255,255,0.12)`
                        : undefined,
                    }}
                  />
                </div>
                <span
                  className={`color-swatch-label text-[0.65rem] uppercase tracking-[0.1em] leading-tight text-center line-clamp-1 w-full ${
                    isActive ? 'text-text-primary font-medium' : 'text-text-muted'
                  }`}
                >
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="panel p-3.5 flex items-center justify-between gap-3 flex-wrap border-l-[3px] border-l-accent-primary mt-auto">
          <div className="flex-1 min-w-0">
            <p className="spec-row__label mb-0.5">{startingPriceLabel}</p>
            <div
              aria-live="polite"
              className={`color-variant-price text-xl md:text-2xl font-display font-bold leading-tight text-text-primary font-tabular${priceAnimating ? ' is-swapping' : ''}`}
            >
              {active.hex2 ? gradientPrice : singlePrice}
            </div>
            <p className="text-text-muted text-xs mt-1">{shippingInfo}</p>
          </div>

          <ShopNowButton
            label={ctaLabel}
            shopOptions={shopOptions}
            whatsappMessage={whatsappMessage}
            buttonClassName="btn btn-primary whitespace-nowrap flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
