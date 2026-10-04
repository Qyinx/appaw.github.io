'use client';

import React, { useId, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type GuideFaqItemProps = {
  itemId: string;
  indexLabel: string;
  question: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
};

export default function GuideFaqItem({
  itemId,
  indexLabel,
  question,
  open,
  onToggle,
  children,
}: GuideFaqItemProps) {
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const triggerId = `${reactId}-trigger`;

  return (
    <div className="guide-faq__item group bg-surface-panel" data-open={open ? 'true' : 'false'}>
      <h3 className="guide-faq__heading">
        <button
          type="button"
          id={triggerId}
          className="guide-faq__summary"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(itemId)}
        >
          <span className="guide-faq__index">{indexLabel}</span>
          <span className="guide-faq__question">{question}</span>
          <span className="guide-faq__chevron-wrap" aria-hidden="true">
            <ChevronDown className="guide-faq__chevron" strokeWidth={2.5} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="guide-faq__answer-wrap"
        inert={open ? undefined : true}
      >
        <div className="guide-faq__answer-clip">
          <div className="guide-faq__answer-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function toggleExclusiveId(current: string | null, next: string): string | null {
  return current === next ? null : next;
}
