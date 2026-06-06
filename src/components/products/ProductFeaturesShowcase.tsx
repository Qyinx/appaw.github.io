'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

const CAROUSEL_INTERVAL = 4000;

interface ProductFeaturesShowcaseProps {
  features: string[];
  images: string[];
  pausedLabel: string;
  autoPlayingLabel: string;
}

function padSlot(n: number, total: number) {
  return `${String(n + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
}

function featureId(index: number) {
  return `FEAT-${String(index + 1).padStart(2, '0')}`;
}

export default function ProductFeaturesShowcase({
  features,
  images,
  pausedLabel,
  autoPlayingLabel,
}: ProductFeaturesShowcaseProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [slideAnimated, setSlideAnimated] = useState(false);
  const prevIndex = useRef(0);

  const navigate = useCallback(
    (next: number) => {
      if (next === active) return;
      const dir = next > active ? 'right' : 'left';
      setSlideDir(dir);
      prevIndex.current = active;
      setSlideAnimated(true);
      setActive(next);
    },
    [active],
  );

  const goTo = useCallback(
    (i: number) => {
      navigate(i);
      setIsPaused(false);
    },
    [navigate],
  );

  const next = useCallback(() => {
    navigate((active + 1) % features.length);
  }, [active, features.length, navigate]);

  const prev = useCallback(() => {
    navigate((active - 1 + features.length) % features.length);
  }, [active, features.length, navigate]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActive((current) => {
        const nextIdx = (current + 1) % features.length;
        setSlideDir('right');
        prevIndex.current = current;
        setSlideAnimated(true);
        return nextIdx;
      });
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, features.length]);

  const slotLabel = padSlot(active, features.length);
  const statusLabel = isPaused ? pausedLabel : autoPlayingLabel;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Feature index — spec rows */}
      <div className="panel p-0 overflow-hidden border-l-[3px] border-l-accent-primary">
        <div className="border-b border-border-default px-4 py-2.5 flex items-center justify-between gap-3 bg-surface-raised">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Feature Index</span>
          <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">{slotLabel}</span>
        </div>

        <div className="divide-y divide-border-default" role="tablist" aria-label="Product features">
          {features.map((feature, i) => {
            const isActive = active === i;
            return (
              <button
                key={feature}
                type="button"
                role="tab"
                id={`feature-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`feature-panel-${active}`}
                onClick={() => goTo(i)}
                className={`feature-spec-item w-full grid grid-cols-[2.75rem_1fr_auto] gap-3 items-center px-4 py-4 text-left transition-colors duration-200 min-h-[44px] ${
                  isActive ? 'bg-surface-raised' : 'hover:bg-surface-raised/60'
                }`}
              >
                <span
                  className="feature-index-badge font-mono text-xs font-bold border border-border-default w-11 h-11 flex items-center justify-center bg-surface-panel text-text-secondary"
                  data-active={isActive ? 'true' : 'false'}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-sm leading-relaxed ${isActive ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                  {feature}
                </span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-accent-structural flex-shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        <div className="color-terminal-readout terminal-block mx-4 mt-4 py-3 px-4 text-xs" aria-live="polite">
          <p>
            <span className="prompt">&gt;</span> load_feature{' '}
            <span className="text-text-primary font-tabular">{featureId(active)}</span>
          </p>
          <p className="mt-1 text-text-secondary">
            <span className="prompt">&gt;</span> mode {isPaused ? 'manual' : 'auto'}
            {!isPaused && <span className="cursor" aria-hidden="true" />}
          </p>
        </div>

        <div className="border-t border-border-default px-4 py-3 mt-4 flex flex-wrap items-center justify-between gap-3 bg-surface-raised">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="btn btn-secondary btn-icon"
            aria-pressed={isPaused}
            aria-label={statusLabel}
          >
            {isPaused ? <Play className="w-4 h-4" aria-hidden="true" /> : <Pause className="w-4 h-4" aria-hidden="true" />}
          </button>
          <span
            className="feature-status-pill font-mono uppercase tracking-wider px-2.5 py-1 border border-border-default bg-surface-panel"
            data-paused={isPaused ? 'true' : 'false'}
          >
            {statusLabel}
          </span>
          <div className="flex items-center gap-2" role="group" aria-label="Feature navigation">
            <button type="button" onClick={prev} className="btn btn-secondary btn-icon" aria-label="Previous feature">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={next} className="btn btn-secondary btn-icon" aria-label="Next feature">
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Instrument viewport */}
      <div className="color-instrument panel p-0 overflow-hidden" aria-live="polite" aria-atomic="true">
        <div className="color-instrument__header border-b border-border-default px-4 py-2.5 flex items-center justify-between gap-3 bg-surface-raised">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Feature Spec</span>
          <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">{slotLabel}</span>
          <span
            className="feature-status-pill font-mono uppercase tracking-wider px-2 py-0.5 border border-border-default bg-surface-panel"
            data-paused={isPaused ? 'true' : 'false'}
          >
            {statusLabel}
          </span>
        </div>

        <div className="p-5">
          <div
            className="color-instrument__viewport relative border border-border-strong bg-surface-bg border-l-[3px] border-l-accent-primary"
            role="tabpanel"
            id={`feature-panel-${active}`}
            aria-labelledby={`feature-tab-${active}`}
          >
            <div
              className="color-variant-stage relative w-full aspect-square"
              data-animated={slideAnimated ? 'true' : 'false'}
              data-dir={slideDir}
            >
              {images.map((img, i) => {
                let slideState: 'active' | 'exit' | 'idle' = 'idle';
                if (i === active) slideState = 'active';
                else if (slideAnimated && i === prevIndex.current) slideState = 'exit';

                return (
                  <div
                    key={img}
                    className="color-variant-slide"
                    data-state={slideState}
                    aria-hidden={slideState !== 'active'}
                  >
                    <Image
                      src={getImagePath(img)}
                      alt={features[i]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 480px"
                      priority={i === 0}
                    />
                  </div>
                );
              })}
              <div className="color-grid-overlay pointer-events-none absolute inset-0 z-[3]" aria-hidden="true" />
              <div className="color-scanlines pointer-events-none absolute inset-0 z-[4]" aria-hidden="true" />
              <div className="color-viewport-corners pointer-events-none absolute inset-0 z-[6]" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-4 divide-y divide-border-default border border-border-default bg-surface-panel">
            <div className="spec-row px-4">
              <span className="spec-row__label">Feature ID</span>
              <span className="spec-row__value font-tabular">{featureId(active)}</span>
            </div>
            <div className="px-4 py-3">
              <span className="spec-row__label block mb-1.5">Caption</span>
              <p className="text-sm text-text-primary leading-relaxed">{features[active]}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Select feature">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-current={active === i ? 'true' : undefined}
                className="feature-slot-btn font-mono font-tabular border border-border-default bg-surface-panel text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors duration-200"
                aria-label={`Feature ${i + 1}: ${features[i]}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
