'use client';

import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import Reveal from './Reveal';

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}

interface StatsGridProps {
  stats: Stat[];
  isVisible: boolean;
  /** 'light' = raised panels; 'dark' = surface panel grid */
  theme?: 'light' | 'dark';
}

export default function StatsGrid({ stats, isVisible, theme = 'light' }: StatsGridProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={
        isDark
          ? 'grid grid-cols-2 md:grid-cols-4 gap-px bg-border-default border border-border-default max-w-5xl mx-auto overflow-hidden'
          : 'grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border-default'
      }
    >
      {stats.map((stat, i) => (
        <Reveal
          key={i}
          visible={isVisible}
          dir="up"
          delay={i * 40}
          className={`text-center ${isDark ? 'bg-surface-panel px-6 sm:px-12 py-8 sm:py-10' : 'px-4 sm:px-8'}`}
        >
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-accent-brand mb-1 tabular-nums">
            <AnimatedCounter target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
          </div>
          <div className="text-sm font-semibold mb-0.5 text-text-primary">
            {stat.label}
          </div>
          <div className="text-xs uppercase tracking-wider text-text-muted">
            {stat.sub}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
