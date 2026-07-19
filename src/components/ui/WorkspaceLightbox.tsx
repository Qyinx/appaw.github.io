'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type WorkspaceLightboxImage = {
  src: string;
  alt?: string;
  label?: string;
};

export type WorkspaceLightboxProps = {
  /** Single-image mode (legacy). Prefer `images` for multi-side cards. */
  src?: string;
  alt?: string;
  images?: WorkspaceLightboxImage[];
  onClose: () => void;
  closeLabel: string;
};

export default function WorkspaceLightbox({
  src,
  alt = '',
  images,
  onClose,
  closeLabel,
}: WorkspaceLightboxProps) {
  const slides = useMemo<WorkspaceLightboxImage[]>(() => {
    if (images && images.length > 0) return images;
    if (src) return [{ src, alt }];
    return [];
  }, [alt, images, src]);

  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const active = slides[Math.min(activeIndex, Math.max(0, slides.length - 1))] ?? null;
  const multi = slides.length > 1;

  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (!multi) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % slides.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [multi, onClose, slides.length]);

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length < 2) {
        e.preventDefault();
        items[0]?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    root.addEventListener('keydown', onTab);
    return () => root.removeEventListener('keydown', onTab);
  }, [mounted]);

  if (!mounted || !active) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="workspace-lightbox workspace-lightbox--portal fixed inset-0 flex flex-col items-center justify-center p-4 overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-accent-structural/90 cursor-pointer"
        aria-label={closeLabel}
        onClick={onClose}
      />

      <p id={titleId} className="sr-only">
        {active.alt || alt}
      </p>

      <div className="relative z-[1] flex max-h-full max-w-full flex-col items-center gap-4">
        {multi ? (
          <div className="grid w-full max-w-[min(100%,960px)] gap-3 sm:grid-cols-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex flex-col gap-2 border bg-surface-panel p-2 text-left cursor-pointer transition-[border-color,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/50 ${
                  index === activeIndex ? 'border-accent-primary' : 'border-border-strong'
                }`}
                aria-pressed={index === activeIndex}
                aria-label={slide.label || slide.alt || `Image ${index + 1}`}
              >
                {slide.label ? (
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-text-muted px-1">
                    {slide.label}
                  </span>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt || alt}
                  className="workspace-lightbox__image max-h-[min(56dvh,520px)] w-full object-contain"
                />
              </button>
            ))}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.src}
            alt={active.alt || alt}
            className="workspace-lightbox__image max-h-[min(80dvh,720px)] max-w-[min(100%,560px)] object-contain border border-border-strong bg-surface-panel"
          />
        )}

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="btn btn-secondary min-h-[44px] inline-flex items-center justify-center gap-2 px-4 text-sm"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          {closeLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
