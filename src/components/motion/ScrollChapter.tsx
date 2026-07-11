'use client';

import React from 'react';

export interface ScrollChapterProps {
  id: string;
  part?: string;
  title?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  /** Skip min-height for intro sections */
  compact?: boolean;
}

export default function ScrollChapter({
  id,
  part,
  title,
  badge,
  children,
  className = '',
  compact = false,
}: ScrollChapterProps) {
  return (
    <section
      id={id}
      className={`scroll-chapter${compact ? ' !min-h-0' : ''}${className ? ` ${className}` : ''}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="container-custom">
        {(part || badge || title) && (
          <header className="scroll-chapter__header">
            {part && (
              <p className="chapter-label mb-3" data-part={part}>
                <span className="sr-only">Part {part}</span>
              </p>
            )}
            {!part && badge && <p className="section-label mb-3">{badge}</p>}
            {title && (
              <h2 id={`${id}-title`} className="chapter-title">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
