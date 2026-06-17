import React from 'react';
import LocalLink from '@/components/LocalLink';

const INLINE_RE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

const linkClassName =
  'text-accent-link font-medium underline-offset-2 hover:underline transition-colors duration-150';

const boldClassName = 'font-semibold text-text-primary';

/** Renders guide text with optional `[label](href)` links and `**bold**` emphasis. */
export function renderGuideParagraph(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(INLINE_RE.source, 'g');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, linkLabel, href, boldText] = match;
    const key = `${match.index}-${linkLabel ?? boldText}`;

    if (boldText) {
      parts.push(
        <strong key={key} className={boldClassName}>
          {boldText}
        </strong>,
      );
    } else if (linkLabel && href) {
      if (href.startsWith('http://') || href.startsWith('https://')) {
        parts.push(
          <a key={key} href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
            {linkLabel}
          </a>,
        );
      } else {
        parts.push(
          <LocalLink key={key} href={href} className={linkClassName}>
            {linkLabel}
          </LocalLink>,
        );
      }
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? text : parts;
}
