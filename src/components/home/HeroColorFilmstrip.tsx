'use client';

import React, { useEffect, useRef } from 'react';
import type { ProtectorColorVariant } from '@/lib/products/protector-colors';
import {
  protectorSlotLabel,
  protectorVariantId,
} from '@/lib/products/protector-colors';

interface HeroColorFilmstripProps {
  colors: ProtectorColorVariant[];
  selectedColor: number;
  pickColorLabel: string;
  headerLabel: string;
  variantIdLabel: string;
  finishTypeLabel: string;
  finishSolidLabel: string;
  finishGradientLabel: string;
  cycleDurationMs?: number;
  isAutoplayActive?: boolean;
  onSelectColor: (index: number) => void;
  onUserInteract?: () => void;
}

function scrollTrackToIndex(track: HTMLElement, index: number, smooth: boolean) {
  if (track.scrollWidth <= track.clientWidth + 1) return;

  const active = track.querySelector<HTMLElement>(`[data-color-index="${index}"]`);
  if (!active) return;

  const targetLeft =
    active.offsetLeft - track.clientWidth / 2 + active.offsetWidth / 2;

  track.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: smooth ? 'smooth' : 'instant',
  });
}

export default function HeroColorFilmstrip({
  colors,
  selectedColor,
  pickColorLabel,
  headerLabel,
  variantIdLabel,
  finishTypeLabel,
  finishSolidLabel,
  finishGradientLabel,
  cycleDurationMs = 4200,
  isAutoplayActive = true,
  onSelectColor,
  onUserInteract,
}: HeroColorFilmstripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isFirstScroll = useRef(true);
  const slotLabel = protectorSlotLabel(selectedColor, colors.length);
  const variantId = protectorVariantId(selectedColor);
  const active = colors[selectedColor];
  const finishLabel = active.hex2 ? finishGradientLabel : finishSolidLabel;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    scrollTrackToIndex(track, selectedColor, !isFirstScroll.current);
    isFirstScroll.current = false;
  }, [selectedColor]);

  const handleSelect = (index: number) => {
    onUserInteract?.();
    onSelectColor(index);
  };

  return (
    <div className="home-hero-filmstrip" aria-live="polite">
      <div className="home-hero-filmstrip__header">
        <div className="home-hero-filmstrip__identity">
          <p className="section-label !mb-0">{pickColorLabel}</p>
          <p className="home-hero-filmstrip__header-label font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            {headerLabel}
          </p>
          <p
            key={selectedColor}
            className="home-hero-filmstrip__active-name font-display text-xl sm:text-2xl font-semibold text-text-primary leading-tight"
          >
            {active.name}
          </p>
          <p className="home-hero-filmstrip__terminal font-mono text-[11px] text-text-secondary" aria-hidden="true">
            <span className="text-text-muted">&gt;</span>{' '}
            load_finish{' '}
            <span className="text-accent-warn font-tabular">{variantId}</span>
          </p>
        </div>

        <div className="home-hero-filmstrip__specs" aria-label={headerLabel}>
          <div className="hero-stamp__stat">
            <span className="hero-stamp__stat-label">{variantIdLabel}</span>
            <span className="hero-stamp__stat-value font-tabular">{variantId}</span>
          </div>
          <div className="hero-stamp__stat">
            <span className="hero-stamp__stat-label">{pickColorLabel}</span>
            <span className="hero-stamp__stat-value font-tabular">{slotLabel}</span>
          </div>
          <div className="hero-stamp__stat">
            <span className="hero-stamp__stat-label">{finishTypeLabel}</span>
            <span className="hero-stamp__stat-value">{finishLabel}</span>
          </div>
        </div>
      </div>

      <div
        key={selectedColor}
        className="home-hero-filmstrip__progress-rail"
        aria-hidden="true"
        data-autoplay={isAutoplayActive ? 'true' : 'false'}
        style={{ '--cycle-duration': `${cycleDurationMs}ms` } as React.CSSProperties}
      >
        <span className="home-hero-filmstrip__progress-fill" />
      </div>

      <div
        ref={trackRef}
        className="home-hero-filmstrip__track"
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
              data-color-index={i}
              aria-checked={isActive}
              aria-label={color.name}
              onClick={() => handleSelect(i)}
              onFocus={() => onUserInteract?.()}
              className="home-hero-filmstrip__slot color-swatch-btn"
              data-active={isActive ? 'true' : 'false'}
            >
              <span className="home-hero-filmstrip__slot-corners" aria-hidden="true" />
              <span
                className="home-hero-filmstrip__chip color-swatch-chip"
                style={{
                  background: color.hex2
                    ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex2} 100%)`
                    : color.hex,
                  outline: isActive ? `2px solid ${color.ring}` : '2px solid transparent',
                  outlineOffset: '1px',
                  boxShadow: isActive
                    ? `0 4px 12px ${color.glow}, inset 0 0 0 1px rgba(255,255,255,0.1)`
                    : undefined,
                }}
              />
              <span
                className={`home-hero-filmstrip__slot-index font-mono font-tabular text-[10px] ${
                  isActive ? 'text-accent-warn' : 'text-text-muted'
                }`}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`home-hero-filmstrip__slot-name spec-row__label !text-[9px] !tracking-[0.1em] line-clamp-1 w-full text-center ${
                  isActive ? 'text-text-primary' : ''
                }`}
              >
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
