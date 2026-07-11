'use client';

import React, { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface QuoteItem {
  body: string;
  attribution: string;
}

export interface QuoteCarouselProps {
  items: QuoteItem[];
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

function padIndex(n: number): string {
  return String(n + 1).padStart(2, '0');
}

export default function QuoteCarousel({
  items,
  prevLabel = 'Previous quote',
  nextLabel = 'Next quote',
  className = '',
}: QuoteCarouselProps) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const count = items.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      const wrapped = ((next % count) + count) % count;
      if (wrapped === index) return;

      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        setIndex(wrapped);
        return;
      }

      setTransitioning(true);
      window.setTimeout(() => {
        setIndex(wrapped);
        setTransitioning(false);
      }, 160);
    },
    [count, index],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  if (!count) return null;

  const current = items[index];

  return (
    <div
      className={`quote-carousel panel p-6${className ? ` ${className}` : ''}`}
      role="group"
      aria-roledescription="carousel"
      aria-label="Operational trust statements"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goNext();
        }
      }}
    >
      <blockquote>
        <p
          className="quote-carousel__body"
          aria-live="polite"
          data-transitioning={transitioning ? 'true' : 'false'}
        >
          {current.body}
        </p>
        <footer>
          <cite className="quote-carousel__attribution not-italic">
            {current.attribution}
          </cite>
        </footer>
      </blockquote>

      {count > 1 && (
        <div className="quote-carousel__controls">
          <button
            type="button"
            className="quote-carousel__btn"
            onClick={goPrev}
            aria-label={prevLabel}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{prevLabel}</span>
          </button>

          <p className="quote-carousel__index" aria-hidden="true">
            <span className="quote-carousel__index-current">[ {padIndex(index)} ]</span>
            {' / '}
            <span>[ {String(count).padStart(2, '0')} ]</span>
          </p>
          <p className="sr-only">
            Quote {index + 1} of {count}
          </p>

          <button
            type="button"
            className="quote-carousel__btn"
            onClick={goNext}
            aria-label={nextLabel}
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{nextLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
