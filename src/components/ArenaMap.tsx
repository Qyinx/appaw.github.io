'use client';

import React from 'react';
import { arenaMapsEmbedSrc } from '@/lib/grading/psa-booking';

type ArenaMapProps = {
  language: 'en' | 'zh';
  title: string;
  className?: string;
};

export default function ArenaMap({ language, title, className }: ArenaMapProps) {
  const iframeTitle = title || '138 Arena map';
  const src = arenaMapsEmbedSrc(language);

  return (
    <figure className={`arena-map${className ? ` ${className}` : ''}`}>
      <div className="arena-map__frame" style={{ minHeight: '18rem' }}>
        <iframe
          src={src}
          title={iframeTitle}
          aria-label={iframeTitle}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block w-full border-0"
          style={{ minHeight: '18rem', height: '18rem' }}
        />
      </div>
    </figure>
  );
}
