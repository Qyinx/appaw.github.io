'use client';

import React, { useEffect, useRef } from 'react';
import { animateHeroEntrance } from '../track/grading-track-motion';

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  /** Hub = full viewport hero; track = compact header band */
  variant?: 'full' | 'compact';
  children?: React.ReactNode;
};

export default function PsaGradingHero({
  badge,
  title,
  subtitle,
  variant = 'full',
  children,
}: Props) {
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements: HTMLElement[] = [];
    if (badgeRef.current) elements.push(badgeRef.current);
    if (titleRef.current) elements.push(titleRef.current);
    if (subtitleRef.current) elements.push(subtitleRef.current);
    if (actionsRef.current) elements.push(actionsRef.current);

    const tween = animateHeroEntrance(elements);
    return () => {
      tween?.kill();
    };
  }, []);

  const isCompact = variant === 'compact';

  return (
    <section
      className={`relative overflow-hidden border-b border-border-default ${
        isCompact ? '' : 'min-h-[60dvh] flex items-center'
      }`}
    >
      <div
        className={`container-custom relative z-10 w-full ${
          isCompact ? 'py-12 md:py-16' : 'py-20 md:py-28'
        }`}
      >
        <div className="max-w-3xl">
          <p ref={badgeRef} className={`section-label invisible ${isCompact ? 'mb-4' : 'mb-6'}`}>
            {badge}
          </p>

          <h1
            ref={titleRef}
            className={`font-display font-bold text-text-primary leading-[1.08] tracking-tight invisible ${
              isCompact
                ? 'text-3xl md:text-4xl mb-4'
                : 'text-4xl sm:text-5xl md:text-6xl mb-6'
            }`}
          >
            {title}
          </h1>

          <p
            ref={subtitleRef}
            className={`text-text-secondary max-w-2xl leading-relaxed invisible ${
              isCompact ? 'text-base mb-0' : 'text-lg mb-8'
            }`}
          >
            {subtitle}
          </p>

          {children && (
            <div ref={actionsRef} className={`flex flex-wrap gap-3 invisible ${isCompact ? 'mt-6' : ''}`}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
