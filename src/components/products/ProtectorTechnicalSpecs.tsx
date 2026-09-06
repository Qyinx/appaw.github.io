'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getProtectorSpecItems } from '@/lib/protector-specs';

function useSectionReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

interface ProtectorTechnicalSpecsProps {
  /** embedded = compact grid inside another section; section = full-width block with header */
  variant?: 'embedded' | 'section';
  /** Pass when parent already controls reveal (e.g. BusinessClient) */
  visible?: boolean;
  animationDelay?: number;
  className?: string;
}

function SpecCard({
  item,
  index,
  visible,
  compact,
}: {
  item: ReturnType<typeof getProtectorSpecItems>[number];
  index: number;
  visible: boolean;
  compact: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`panel group ${compact ? 'p-4' : 'p-6 md:p-7'}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(18px)',
        transition: `opacity 0.65s ease ${index * 70}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms`,
      }}
    >
      <div className={`relative flex items-start ${compact ? 'gap-3' : 'gap-4'}`}>
        <div
          className={`flex-shrink-0 flex items-center justify-center border border-border-default bg-surface-raised text-accent-brand ${compact ? 'w-9 h-9' : 'w-11 h-11'}`}
        >
          <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`spec-row__label mb-1 ${compact ? 'text-xs' : ''}`}>
            {item.label}
          </p>
          <p
            className={`font-display font-bold text-text-primary leading-snug mb-0.5 font-tabular ${compact ? 'text-sm' : 'text-lg'}`}
          >
            {item.value}
          </p>
          <p className={`text-text-muted leading-relaxed ${compact ? 'text-xs line-clamp-2' : 'text-xs'}`}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProtectorTechnicalSpecs({
  variant = 'section',
  visible: visibleProp,
  animationDelay = 0,
  className = '',
}: ProtectorTechnicalSpecsProps) {
  const { t } = useLanguage();
  const items = getProtectorSpecItems(t);
  const sectionReveal = useSectionReveal();
  const isEmbedded = variant === 'embedded';
  const visible = visibleProp ?? sectionReveal.visible;

  const grid = (
    <div
      className={`relative ${isEmbedded ? 'panel p-3 sm:p-4' : ''}`}
    >
      {isEmbedded && (
        <p className="section-label mb-3 px-1">{t.psaProtectorPage.techBadge}</p>
      )}

      <div
        className={
          isEmbedded
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
            : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'
        }
      >
        {items.map((item, i) => (
          <SpecCard key={item.id} item={item} index={i} visible={visible} compact={isEmbedded} />
        ))}
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(-12px)',
          transition: `opacity 0.8s ease ${animationDelay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${animationDelay}ms`,
        }}
      >
        {grid}
      </div>
    );
  }

  return (
    <section
      ref={sectionReveal.ref}
      className={`section-padding border-t border-border-default bg-surface-bg overflow-hidden ${className}`}
    >
      <div className="container-custom relative">
        <div
          className="max-w-xl mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="section-label mb-5">{t.psaProtectorPage.techBadge}</p>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-4">
            {t.psaProtectorPage.techTitle}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed">{t.psaProtectorPage.techSubtitle}</p>
        </div>

        {grid}
      </div>
    </section>
  );
}
