import React from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import type { GuideSpecRow } from '@/lib/guides/types';

type GuideSpecPanelProps = {
  rows: GuideSpecRow[];
  title?: string;
};

export default function GuideSpecPanel({ rows, title }: GuideSpecPanelProps) {
  return (
    <aside className="panel overflow-hidden" aria-label={title ?? 'Key specifications'}>
      {title ? <p className="section-label px-5 pt-5 mb-0">{title}</p> : null}
      <dl className="divide-y divide-border-default">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 px-5 py-3">
            <dt className="text-xs font-mono uppercase tracking-wide text-text-muted">{row.label}</dt>
            <dd className="font-mono text-sm tabular-nums text-text-primary text-right">
              {renderGuideParagraph(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
