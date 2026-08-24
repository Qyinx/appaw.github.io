'use client';

import React from 'react';
import { normalizeBatchNotesHtml } from '@/lib/grading/batch-notes';

type Props = {
  title: string;
  html: string | null | undefined;
};

const proseClassName =
  'text-sm text-text-secondary leading-relaxed [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-text-primary';

export default function SubmissionNotesMessage({ title, html }: Props) {
  const normalized = normalizeBatchNotesHtml(html);
  if (!normalized) return null;

  return (
    <section className="panel border border-accent-warn/30 panel-raised px-4 py-3 min-w-0">
      <h2 className="text-sm font-display font-semibold text-accent-warn uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className={proseClassName} dangerouslySetInnerHTML={{ __html: normalized }} />
    </section>
  );
}
