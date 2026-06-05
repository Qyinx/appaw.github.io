'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getProtectorSpecItems } from '@/lib/protector-specs';

const ACCENT = '#D4899A';

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
      className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)] transition-all duration-500 hover:border-[#D4899A]/25 hover:-translate-y-0.5 ${compact ? 'p-4' : 'p-6 md:p-7'}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(18px)',
        transition: `opacity 0.65s ease ${index * 70}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms, border-color 0.3s, translate 0.3s`,
      }}
    >
      {/* Blueprint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: compact ? '16px 16px' : '20px 20px',
        }}
      />

      {/* Hover accent rail */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300"
        style={{ backgroundColor: ACCENT }}
      />

      {/* Corner tick — blueprint mark */}
      <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-white/10 group-hover:border-[#D4899A]/40 transition-colors duration-300" />

      <div className={`relative flex items-start ${compact ? 'gap-3' : 'gap-4'}`}>
        <div
          className={`flex-shrink-0 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,137,154,0.12)] ${compact ? 'w-9 h-9' : 'w-11 h-11'}`}
          style={{
            backgroundColor: `${ACCENT}12`,
            borderColor: `${ACCENT}25`,
            color: ACCENT,
          }}
        >
          <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`uppercase tracking-[0.18em] font-medium text-white/45 mb-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {item.label}
          </p>
          <p
            className={`font-display font-bold text-white leading-snug mb-0.5 group-hover:text-[#D4899A] transition-colors duration-300 ${compact ? 'text-sm' : 'text-lg'}`}
          >
            {item.value}
          </p>
          <p className={`text-white/30 leading-relaxed ${compact ? 'text-[11px] line-clamp-2' : 'text-xs'}`}>
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
      className={`relative ${
        isEmbedded
          ? 'rounded-xl border border-white/[0.06] p-3 sm:p-4 bg-[#161626]/60'
          : ''
      }`}
    >
      {/* Blueprint frame corners — section only */}
      {!isEmbedded && (
        <>
          <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[#D4899A]/30 pointer-events-none" />
          <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[#D4899A]/30 pointer-events-none" />
          <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-[#D4899A]/30 pointer-events-none" />
          <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[#D4899A]/30 pointer-events-none" />
        </>
      )}

      {isEmbedded && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-4 h-px" style={{ backgroundColor: ACCENT }} />
          <span className="text-[10px] uppercase tracking-[0.28em] font-medium" style={{ color: `${ACCENT}99` }}>
            {t.psaProtectorPage.techBadge}
          </span>
        </div>
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
      className={`py-28 bg-[#0d0d14] relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,137,154,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_20%,rgba(129,140,248,0.025),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />

      <div className="container-custom relative">
        <div
          className="max-w-xl mb-12 md:mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#D4899A]" />
            <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">
              {t.psaProtectorPage.techBadge}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white leading-[1.1] mb-4">
            {t.psaProtectorPage.techTitle}
          </h2>
          <p className="text-white/40 text-base leading-relaxed">{t.psaProtectorPage.techSubtitle}</p>
        </div>

        {grid}
      </div>
    </section>
  );
}
