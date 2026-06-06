'use client';

import React from 'react';
import type { GuideSection } from '@/lib/guides/types';

type GuideTocProps = {
  sections: GuideSection[];
  label: string;
};

export default function GuideToc({ sections, label }: GuideTocProps) {
  return (
    <nav className="panel p-5" aria-label={label}>
      <p className="section-label mb-4">{label}</p>
      <ol className="space-y-2">
        {sections.map((section, i) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-text-secondary hover:text-accent-link transition-colors duration-150"
            >
              <span className="font-mono text-text-muted mr-2">{String(i + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
