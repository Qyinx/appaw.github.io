'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { GuideSection } from '@/lib/guides/types';

type GuideTocProps = {
  sections: GuideSection[];
  label: string;
  faqTitle?: string;
};

type TocEntry = { id: string; title: string };

export default function GuideToc({ sections, label, faqTitle }: GuideTocProps) {
  const faqEntry = faqTitle ? { id: 'guide-faq', title: faqTitle } : null;
  const entries: TocEntry[] = useMemo(
    () => (faqEntry ? [...sections, faqEntry] : sections),
    [sections, faqEntry],
  );

  const [activeId, setActiveId] = useState(entries[0]?.id ?? '');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!entries.length) return;

    const sectionEls = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-24% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  useEffect(() => {
    if (!entries.length) return;

    const updateProgress = () => {
      const first = document.getElementById(entries[0].id);
      const last = document.getElementById(entries[entries.length - 1].id);
      if (!first || !last) return;

      const viewportAnchor = window.scrollY + window.innerHeight * 0.3;
      const start = first.getBoundingClientRect().top + window.scrollY;
      const end = last.getBoundingClientRect().top + window.scrollY + last.offsetHeight;
      const range = end - start;

      if (range <= 0) {
        setProgress(0);
        return;
      }

      setProgress(Math.min(100, Math.max(0, ((viewportAnchor - start) / range) * 100)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [entries]);

  return (
    <nav className="guide-toc panel p-5" aria-label={label}>
      <div className="guide-toc__progress-track" aria-hidden="true">
        <div className="guide-toc__progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <p className="section-label mb-4">{label}</p>
      <ol className="space-y-1">
        {entries.map((section, i) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`guide-toc__link flex items-start gap-2 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? 'text-accent-link font-medium'
                    : 'text-text-secondary hover:text-accent-link'
                }`}
                aria-current={isActive ? 'location' : undefined}
              >
                <span className={`font-mono text-xs mt-0.5 shrink-0 ${isActive ? 'text-accent-brand' : 'text-text-muted'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug">{section.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
