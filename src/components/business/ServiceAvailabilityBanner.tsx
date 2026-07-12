'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export type AvailabilityBannerCopy = {
  badge: string;
  title: string;
  body: string;
  ctaContact: string;
};

type Props = {
  copy: AvailabilityBannerCopy;
  ctaHref?: string;
  ctaIcon?: 'whatsapp' | 'calendar';
};

export default function ServiceAvailabilityBanner({
  copy,
  ctaHref = 'https://wa.me/85292851189',
  ctaIcon = 'whatsapp',
}: Props) {
  return (
    <aside
      className="service-availability-banner border-b border-border-default bg-surface-raised/90"
      aria-label={copy.title}
    >
      <div className="container-custom py-4 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 border border-accent-brand/30 px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-brand animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-brand">
                {copy.badge}
              </span>
            </div>
            <p className="font-display font-bold text-text-primary text-base md:text-lg leading-snug">
              {copy.title}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
              {copy.body}
            </p>
          </div>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary shrink-0 min-h-[44px] self-start md:self-center"
          >
            {ctaIcon === 'calendar' ? (
              <CalendarDays className="w-4 h-4 text-accent-secondary" aria-hidden="true" />
            ) : (
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-accent-success" />
            )}
            <span>{copy.ctaContact}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
