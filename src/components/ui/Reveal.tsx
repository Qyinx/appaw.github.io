'use client';

import React from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps {
  children: React.ReactNode;
  visible: boolean;
  dir?: RevealDirection;
  /** Stagger delay in ms — maps to `--motion-delay`. */
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  visible,
  dir = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const dirClass = dir === 'none' ? 'motion-reveal-none' : `motion-reveal-${dir}`;

  return (
    <Tag
      className={`motion-reveal min-w-0 ${dirClass}${className ? ` ${className}` : ''}`}
      data-visible={visible ? 'true' : 'false'}
      style={{ '--motion-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Stagger container — children use `.motion-stagger-item`. */
export function MotionStagger({
  children,
  visible,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  visible: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag
      className={`motion-stagger${className ? ` ${className}` : ''}`}
      data-visible={visible ? 'true' : 'false'}
    >
      {children}
    </Tag>
  );
}
