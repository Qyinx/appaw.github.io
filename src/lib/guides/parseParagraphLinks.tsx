import React from 'react';
import LocalLink from '@/components/LocalLink';

const INLINE_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

const linkClassName =
  'text-accent-link font-medium underline-offset-2 hover:underline transition-colors duration-150';

/** Renders guide paragraph text with optional `[label](href)` inline links. */
export function renderGuideParagraph(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const re = new RegExp(INLINE_LINK_RE.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, label, href] = match;
    const key = `${match.index}-${label}`;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      parts.push(
        <a key={key} href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else {
      parts.push(
        <LocalLink key={key} href={href} className={linkClassName}>
          {label}
        </LocalLink>,
      );
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? text : parts;
}
