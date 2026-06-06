import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { GuideSourceLink } from '@/lib/guides/types';

type GuideSourcesProps = {
  sources: GuideSourceLink[];
  label: string;
};

export default function GuideSources({ sources, label }: GuideSourcesProps) {
  if (!sources?.length) return null;

  return (
    <aside className="panel overflow-hidden" aria-label={label}>
      <p className="section-label px-5 pt-5 mb-0">{label}</p>
      <ul className="divide-y divide-border-default">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 px-5 py-3 transition-colors duration-150 hover:bg-surface-raised"
            >
              <span className="text-xs font-mono leading-snug text-text-secondary group-hover:text-accent-secondary">
                {source.label}
              </span>
              <ExternalLink
                className="w-3.5 h-3.5 shrink-0 text-text-muted group-hover:text-accent-secondary"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
