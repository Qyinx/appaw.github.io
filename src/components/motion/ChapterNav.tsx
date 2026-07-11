'use client';

import React, { useEffect, useState } from 'react';

export interface ChapterNavItem {
  id: string;
  label: string;
}

export interface ChapterNavProps {
  items: ChapterNavItem[];
  /** Accessible name for the nav landmark */
  ariaLabel?: string;
  className?: string;
}

export default function ChapterNav({
  items,
  ariaLabel = 'Page sections',
  className = '',
}: ChapterNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;

    const sectionEls = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sectionEls.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId: string | null = null;
        let bestRatio = 0;
        items.forEach(({ id }) => {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      className={`chapter-nav${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      <ul className="chapter-nav__list">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`chapter-nav__link${isActive ? ' chapter-nav__link--active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
