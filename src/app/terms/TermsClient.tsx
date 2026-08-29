'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY } from '@/lib/company';

function SectionDivider({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-accent-brand text-xs font-mono uppercase tracking-widest">{num}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

function ParagraphWithContacts({ text, className }: { text: string; className: string }) {
  const parts = text.split(/(\+852-9285-1189|support@appaw\.store|https:\/\/appaw\.store|appaw\.store)/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part === '+852-9285-1189') {
          return (
            <a
              key={i}
              href="https://wa.me/85292851189"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-link hover:underline"
            >
              {part}
            </a>
          );
        }
        if (part === 'support@appaw.store') {
          return (
            <a key={i} href="mailto:support@appaw.store" className="text-accent-link hover:underline">
              {part}
            </a>
          );
        }
        if (part === 'https://appaw.store' || part === 'appaw.store') {
          return (
            <a
              key={i}
              href="https://appaw.store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-link hover:underline"
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}

export default function TermsClient() {
  const { t } = useLanguage();
  const page = t.termsPage;
  const lastIndex = page.sections.length - 1;

  return (
    <>
      <section className="relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default">
        <div className="container-custom">
          <p className="section-label mb-8">{page.label}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4">
            {page.title}
          </h1>
          <p className="text-text-secondary text-sm">
            {page.lastUpdatedPrefix}: {page.lastUpdated}
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface-bg overflow-x-clip">
        <div className="container-custom max-w-3xl min-w-0">
          <ParagraphWithContacts
            text={page.intro}
            className="text-text-secondary text-lg leading-relaxed mb-10"
          />

          {page.sections.map((section, index) => (
            <div key={section.num} className={index === lastIndex ? 'mb-2' : 'mb-10'}>
              <SectionDivider num={section.num} />
              <h2 className="text-2xl font-bold font-display text-text-primary mb-4">{section.heading}</h2>
              {section.num === '01' ? (
                <div className="panel p-6 text-sm text-text-secondary space-y-1 mb-4">
                  <p className="font-semibold text-text-primary">{COMPANY.legalName}</p>
                  <p>
                    {page.brLabel} {COMPANY.brNumber}
                  </p>
                  <p>{page.hongKong}</p>
                </div>
              ) : null}
              {section.body.map((para, paraIndex) => (
                <ParagraphWithContacts
                  key={`${section.num}-${paraIndex}`}
                  text={para}
                  className={
                    paraIndex < section.body.length - 1
                      ? 'text-text-secondary text-sm leading-relaxed mb-4'
                      : 'text-text-secondary text-sm leading-relaxed'
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
