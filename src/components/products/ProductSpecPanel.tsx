'use client';

import Image from 'next/image';
import { getImagePath } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';

export interface ProductSpecPanelProps {
  visible: boolean;
  delay?: number;
  imageAlt: string;
  specs: [string, string][];
  headerLabel?: string;
}

/** Hero product spec panel — shared by homepage and PSA protectors page. */
export default function ProductSpecPanel({
  visible,
  delay = 120,
  imageAlt,
  specs,
  headerLabel = 'Product Spec',
}: ProductSpecPanelProps) {
  return (
    <Reveal visible={visible} dir="right" delay={delay} className="panel p-0 overflow-hidden w-full min-w-0">
      <div className="border-b border-border-default px-5 py-3 flex items-center justify-between bg-surface-raised">
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">{headerLabel}</span>
        <span className="font-mono text-xs text-accent-warn">Available</span>
      </div>
      <div className="p-5">
        <div className="relative w-full aspect-[4/5] max-h-64 mb-5 border border-border-default bg-surface-raised">
          <Image
            src={getImagePath('/images/describe/color/color-gold.png')}
            alt={imageAlt}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            quality={90}
          />
        </div>
        {specs.map(([label, value]) => (
          <div key={label} className="spec-row">
            <span className="spec-row__label">{label}</span>
            <span className="spec-row__value">{value}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
