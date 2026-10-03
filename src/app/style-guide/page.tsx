'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import { MemberBadge, MEMBER_LEVELS, type MemberLevel } from '@/app/collection/components/shared';
import { ArrowRight, Sun, Moon } from 'lucide-react';

const semanticTokens = [
  { name: 'surface-frame', var: '--surface-frame', use: 'Coral viewport frame' },
  { name: 'surface-bg', var: '--surface-bg', use: 'Sheet canvas' },
  { name: 'surface-panel', var: '--surface-panel', use: 'Cards, panels' },
  { name: 'surface-raised', var: '--surface-raised', use: 'Nested panels, inputs' },
  { name: 'border-strong', var: '--border-strong', use: '2px ink edges' },
  { name: 'text-primary', var: '--text-primary', use: 'Body text' },
  { name: 'text-secondary', var: '--text-secondary', use: 'Labels, hints' },
  { name: 'accent-primary', var: '--accent-primary', use: 'Coral action' },
  { name: 'accent-cta', var: '--accent-cta', use: 'Solid primary buttons' },
  { name: 'accent-mark', var: '--accent-mark', use: 'Display circles only' },
  { name: 'accent-success', var: '--accent-success', use: 'Pass states' },
  { name: 'accent-danger', var: '--accent-danger', use: 'Errors' },
];

export default function StyleGuidePage() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#121212' : '#F3EBDA');
    }
    return () => {
      document.documentElement.classList.remove('dark');
      if (meta) meta.setAttribute('content', '#F3EBDA');
    };
  }, [theme]);

  return (
    <div className="bg-surface-bg">
      <section className="section-padding border-b-2 border-border-strong">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
            <div>
              <p className="home-hero-kicker">Design system</p>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mb-3">
                {t.styleGuide?.title ?? 'Style Guide'}
              </h1>
              <p className="text-text-secondary max-w-[65ch] text-[17px] leading-relaxed">
                Soft neubrutalism: cream sheet, coral frame, 2px ink, calm Inter body, Syne display.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary shrink-0"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" aria-hidden="true" /> : <Sun className="w-4 h-4" aria-hidden="true" />}
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-8">{t.styleGuide?.sections?.colors ?? 'Colors'}</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {semanticTokens.map((token) => (
              <div key={token.name} className="panel p-4">
                <div
                  className="h-12 border-2 border-border-strong mb-3"
                  style={{ background: `var(${token.var})` }}
                />
                <p className="font-mono text-sm text-text-muted">{token.var}</p>
                <p className="text-[15px] font-semibold text-text-primary mt-1">{token.name}</p>
                <p className="text-sm text-text-secondary mt-0.5">{token.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong bg-surface-panel">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-8">{t.styleGuide?.sections?.typography ?? 'Typography'}</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="panel p-6">
              <p className="text-sm text-text-muted mb-2">Display · Syne 800</p>
              <p className="font-display text-3xl font-extrabold text-text-primary tracking-tight">Precision hardware</p>
            </div>
            <div className="panel p-6">
              <p className="text-sm text-text-muted mb-2">Kicker · Newsreader italic</p>
              <p className="font-serif italic text-xl text-text-primary">One kicker per view</p>
            </div>
            <div className="panel p-6">
              <p className="text-sm text-text-muted mb-2">Body · Inter 17px</p>
              <p className="font-sans text-[17px] leading-relaxed text-text-secondary">
                Graded slab protectors and centering tools. Sentence case. Max 65ch.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-sm text-text-muted mb-2">Mono · measurements</p>
              <p className="font-mono text-base text-text-primary font-tabular">L/R 52.3% · T/B 48.1% · PSA 10</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-4xl font-display font-extrabold">Heading one</p>
            <p className="text-2xl font-display font-bold">Heading two</p>
            <p className="text-xl font-display font-bold">Heading three</p>
            <p className="text-[17px] leading-relaxed text-text-secondary max-w-[65ch]">
              Body copy at 17px with 1.65 line-height. Use … not three dots.
            </p>
            <p className="text-sm text-text-muted">Type floor 14px for anything a person must read or tap.</p>
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-2">{t.styleGuide?.sections?.buttons ?? 'Buttons'}</h2>
          <p className="text-text-secondary text-[15px] mb-8 max-w-[65ch]">
            Sentence case, 15px, 44px min height, 2px ink. Primary gets a press shadow. Secondary is outline only.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary">Shop now</Button>
            <Button variant="secondary">View specs</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete collection</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button>
              With icon
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong bg-surface-panel">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-2">{t.styleGuide?.sections?.membership ?? 'Membership Badges'}</h2>
          <p className="text-text-secondary text-[15px] mb-8 max-w-[65ch]">
            {t.styleGuide?.membership?.subtitle ?? 'Tier labels for collector workspace chrome.'}
          </p>

          <div className="grid lg:grid-cols-3 gap-4">
            {MEMBER_LEVELS.map((level) => (
              <div key={level} className="panel p-5 flex flex-col gap-4">
                <MemberBadge level={level} />
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {t.styleGuide?.membership?.tiers?.[level as MemberLevel] ?? level}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-8">Panels and spec rows</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="panel p-6">
              <p className="text-[15px] font-semibold mb-4">Panel</p>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                2px ink border, radius 0, no blur shadow.
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-[15px] font-semibold mb-4">Spec sheet</p>
              <div className="spec-row">
                <span className="spec-row__label">35PT compatibility</span>
                <span className="spec-row__value">PSA</span>
              </div>
              <div className="spec-row">
                <span className="spec-row__label">UV protection</span>
                <span className="spec-row__value">&gt;95%</span>
              </div>
              <div className="spec-row">
                <span className="spec-row__label">Closure</span>
                <span className="spec-row__value">Magnetic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-b-2 border-border-strong">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-8">Forms</h2>
          <form className="panel p-6 max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="sg-email" className="block text-[15px] font-semibold text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="sg-email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@example.com…"
                className="w-full px-3 py-2 min-h-11 bg-surface-raised border-2 border-border-strong text-text-primary text-base"
              />
            </div>
            <div>
              <label htmlFor="sg-sku" className="block text-[15px] font-semibold text-text-primary mb-1.5">
                SKU
              </label>
              <input
                id="sg-sku"
                name="sku"
                type="text"
                spellCheck={false}
                placeholder="PSA-MAG-35…"
                className="w-full px-3 py-2 min-h-11 bg-surface-raised border-2 border-border-strong text-text-primary font-mono text-base"
              />
            </div>
            <Button type="submit">Save settings</Button>
          </form>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-extrabold mb-4">Layout</h2>
          <p className="text-[15px] text-text-secondary max-w-[65ch] mb-6 leading-relaxed">
            Store sheet: type about 60% / specimen 40% from md up, stack under md. Tools: charcoal instrument cards.
            Mobile: one column, 12px coral frame, 44px targets.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="panel p-6 space-y-2 text-[15px] text-text-secondary">
              <p className="text-text-primary font-semibold">Page gutters</p>
              <p>--site-frame: 12px / 20px / 28px</p>
              <p>--space-page-x: clamp(16px, 4vw, 24px)</p>
              <p>--radius-panel: 0 · --border-width: 2px</p>
            </div>
            <div className="panel p-6 space-y-2 text-[15px] text-text-secondary">
              <p className="text-text-primary font-semibold">Retired</p>
              <p>Chapters, Fibonacci tokens, HeroStamp marketing hero, scramble nav, indigo chrome.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
