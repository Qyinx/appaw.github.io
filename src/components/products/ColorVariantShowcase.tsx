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
}: ColorVariantShowcaseProps) {
  const active = colors[selectedColor];
  const slotLabel = padSlot(selectedColor, colors.length);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Instrument viewport — neo-brutalist + retro-tech */}
      <div
        className="color-instrument panel p-0 overflow-hidden"
        style={{ boxShadow: `0 0 0 1px var(--border-default), 0 16px 40px ${active.glow}` }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="color-instrument__header border-b border-border-default px-4 py-2.5 flex items-center justify-between gap-3 bg-surface-raised">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Color Spec</span>
          <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">{slotLabel}</span>
          <span
            className={`font-mono text-xs uppercase tracking-wider ${isScanning ? 'color-sync-status' : 'text-accent-warn'}`}
          >
            {isScanning ? 'Sync…' : 'Locked'}
          </span>
        </div>

        <div className="p-5">
          <div
            className="color-instrument__viewport relative border border-border-strong bg-surface-bg"
            style={{ borderLeftColor: active.accent, borderLeftWidth: '3px' }}
          >
            <div
              className="color-variant-stage relative w-full aspect-square"
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
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 80vw, 480px"
                      priority={i === 0}
                    />
                  </div>
                );
              })}
              <div className="color-grid-overlay pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
              <div className="color-scanlines pointer-events-none absolute inset-0 z-[4]" aria-hidden="true" />
              <div className="color-scan-beam pointer-events-none absolute inset-x-0 z-[5]" aria-hidden="true" />
              <div className="color-viewport-corners pointer-events-none absolute inset-0 z-[6]" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 divide-y divide-border-default border border-border-default bg-surface-panel">
            <div className="spec-row px-4">
              <span className="spec-row__label">Variant ID</span>
              <span className="spec-row__value font-tabular">{variantId(selectedColor)}</span>
            </div>
            <div className="spec-row px-4">
              <span className="spec-row__label">Hex Primary</span>
              <span className="spec-row__value font-tabular">{active.hex.toUpperCase()}</span>
            </div>
            {active.hex2 && (
              <div className="spec-row px-4">
                <span className="spec-row__label">Hex Secondary</span>
                <span className="spec-row__value font-tabular">{active.hex2.toUpperCase()}</span>
              </div>
            )}
            <div className="spec-row px-4">
              <span className="spec-row__label">Finish</span>
              <span className="spec-row__value">{active.hex2 ? gradientBadge : 'Solid'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls + terminal readout */}
      <div>
        <div className="mb-8">
          <p className="section-label mb-3">{pickColorLabel}</p>
          <div className="flex items-center gap-3 flex-wrap min-h-[44px]">
            <span
              key={selectedColor}
              className="color-variant-name font-display text-4xl md:text-5xl font-bold text-text-primary leading-none tracking-tight"
              data-animated={colorSlideAnimated ? 'true' : 'false'}
            >
              {active.name}
            </span>
            {active.hex2 && (
              <span className="px-2.5 py-1 text-xs uppercase tracking-[0.18em] font-bold border border-border-strong text-text-secondary bg-surface-raised font-mono">
                {gradientBadge}
              </span>
            )}
          </div>

          <div className="color-terminal-readout terminal-block mt-5 py-3 px-4 text-xs" aria-live="polite">
            <p>
              <span className="prompt">&gt;</span>{' '}
              load_finish{' '}
              <span className="text-accent-warn font-tabular">{variantId(selectedColor)}</span>
            </p>
            <p className="mt-1 text-text-secondary font-tabular">
              <span className="prompt">&gt;</span>{' '}
              buffer {active.hex.replace('#', '')}
              {active.hex2 ? `..${active.hex2.replace('#', '')}` : ''}
            </p>
            <p className="mt-1">
              <span className="prompt">&gt;</span>{' '}
              status {isScanning ? 'sync…' : 'locked'}
              {!isScanning && <span className="cursor" aria-hidden="true" />}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" role="radiogroup" aria-label={pickColorLabel}>
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
                className="color-swatch-btn group flex flex-col items-center gap-2 w-full"
              >
                <div className="relative w-full">
                  {isActive && (
                    <span className="color-swatch-index font-mono text-[10px] text-accent-warn absolute -top-1 left-0 z-10 font-tabular">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                  <div
                    className="color-swatch-chip w-full h-9 border border-border-default"
                    style={{
                      background: color.hex2
                        ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex2} 100%)`
                        : color.hex,
                      outline: isActive ? `2px solid ${color.ring}` : '2px solid transparent',
                      outlineOffset: '2px',
                      boxShadow: isActive ? `0 4px 14px ${color.glow}, inset 0 0 0 1px rgba(255,255,255,0.12)` : undefined,
                    }}
                  />
                </div>
                <span
                  className={`color-swatch-label text-xs uppercase tracking-[0.12em] leading-tight text-center line-clamp-1 w-full ${
                    isActive ? 'text-text-primary font-medium' : 'text-text-muted'
                  }`}
                >
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="panel p-5 flex items-center justify-between gap-4 flex-wrap border-l-[3px] border-l-accent-primary">
          <div className="flex-1 min-w-0">
            <p className="spec-row__label mb-1">{startingPriceLabel}</p>
            <div
              aria-live="polite"
              className={`color-variant-price text-2xl md:text-3xl font-display font-bold leading-tight text-text-primary font-tabular${priceAnimating ? ' is-swapping' : ''}`}
            >
              {active.hex2 ? gradientPrice : singlePrice}
            </div>
            <p className="text-text-muted text-xs mt-2">{shippingInfo}</p>
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
