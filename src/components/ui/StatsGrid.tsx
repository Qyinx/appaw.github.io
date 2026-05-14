'use client';

import React from 'react';
import AnimatedCounter from './AnimatedCounter';

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}

interface StatsGridProps {
  stats: Stat[];
  isVisible: boolean;
  /** 'light' = white bg with neutral dividers (default); 'dark' = dark bg with white/5 borders */
  theme?: 'light' | 'dark';
}

export default function StatsGrid({ stats, isVisible, theme = 'light' }: StatsGridProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={
        isDark
          ? 'grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-5xl mx-auto'
          : 'grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-neutral-100'
      }
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`text-center transition-all duration-700 ${isDark ? 'bg-[#1e1e2e] px-12 py-10' : 'px-8'}`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: `${i * 150}ms`,
          }}
        >
          <div className="text-5xl md:text-6xl font-bold font-display text-[#D4899A] mb-1 tabular-nums">
            <AnimatedCounter target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
          </div>
          <div className={`text-sm font-semibold mb-0.5 ${isDark ? 'text-white/80' : 'text-neutral-800'}`}>
            {stat.label}
          </div>
          <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>
            {stat.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
