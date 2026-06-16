'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';
import HeroStamp from '@/components/ui/HeroStamp';
import { ArrowRight, Sun, Moon } from 'lucide-react';

const semanticTokens = [
  { name: 'surface-bg', var: '--surface-bg', use: 'Page canvas' },
  { name: 'surface-panel', var: '--surface-panel', use: 'Cards, panels' },
  { name: 'surface-raised', var: '--surface-raised', use: 'Nested panels, inputs' },
  { name: 'border-default', var: '--border-default', use: 'Panel edges' },
  { name: 'border-strong', var: '--border-strong', use: 'Emphasis borders' },
  { name: 'text-primary', var: '--text-primary', use: 'Body text' },
  { name: 'text-secondary', var: '--text-secondary', use: 'Labels, hints' },
  { name: 'accent-primary', var: '--accent-primary', use: 'CTAs, active' },
  { name: 'accent-secondary', var: '--accent-secondary', use: 'Links, focus' },
  { name: 'accent-structural', var: '--accent-structural', use: 'Brutalist chrome, CTA ink' },
  { name: 'accent-warn', var: '--accent-warn', use: 'Tool highlights' },
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
      meta.setAttribute('content', theme === 'dark' ? '#0B0C0D' : '#FAFAF8');
    }
    return () => {
      document.documentElement.classList.remove('dark');
      if (meta) meta.setAttribute('content', '#FAFAF8');
    };
  }, [theme]);

  return (
    <div className="bg-surface-bg">
      <section className="section-padding border-b border-border-default">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
            <div>
              <p className="section-label mb-4">Design System</p>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
                {t.styleGuide?.title ?? 'Style Guide'}
              </h1>
              <p className="text-text-secondary max-w-xl">
                {t.styleGuide?.subtitle ?? 'Neo-brutalist engineering UI for Appaw Store — Hermes-inspired structure with blush, indigo, and gold brand tokens.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary shrink-0"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" aria-hidden="true" /> : <Sun className="w-4 h-4" aria-hidden="true" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          <HeroStamp className="mb-8" />

          <div className="terminal-block max-w-2xl">
            <div><span className="prompt">&gt; </span>appaw design-system --version 2026.06</div>
            <div><span className="prompt">&gt; </span>tokens loaded: semantic + brand scales</div>
            <div>
              <span className="prompt">&gt; </span>theme: {theme}
              <span className="cursor" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border-default">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">{t.styleGuide?.sections?.colors ?? 'Colors'}</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {semanticTokens.map((token) => (
              <div key={token.name} className="panel p-4">
                <div
                  className="h-12 border border-border-default mb-3"
                  style={{ background: `var(${token.var})` }}
                />
                <p className="font-mono text-xs text-text-muted">{token.var}</p>
                <p className="text-sm font-medium text-text-primary mt-1">{token.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{token.use}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-display font-semibold mb-4">Brand Scales</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(['primary', 'secondary', 'accent'] as const).map((scale) => (
              <div key={scale} className="panel p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-text-muted mb-3">{scale}</p>
                <div className="flex flex-col gap-1">
                  {[50, 200, 400, 500, 600, 800].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-6 bg-${scale}-${step} border border-border-default`} style={{ background: `var(--color-${scale}-${step})` }} />
                      <span className="font-mono text-xs text-text-muted">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border-default bg-surface-panel">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">{t.styleGuide?.sections?.typography ?? 'Typography'}</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="panel p-6">
              <p className="font-mono text-xs text-text-muted mb-2">font-display · Syne</p>
              <p className="font-display text-3xl font-bold text-text-primary">Precision Hardware</p>
            </div>
            <div className="panel p-6">
              <p className="font-mono text-xs text-text-muted mb-2">font-sans · IBM Plex Sans</p>
              <p className="font-sans text-lg text-text-secondary">Graded slab protectors and engineering-grade centering tools.</p>
            </div>
            <div className="panel p-6">
              <p className="font-mono text-xs text-text-muted mb-2">font-mono · IBM Plex Mono</p>
              <p className="font-mono text-sm text-accent-warn font-tabular">L/R 52.3% · T/B 48.1% · PSA 10</p>
            </div>
            <div className="panel p-6 lg:col-span-2">
              <p className="font-mono text-xs text-text-muted mb-4">Hero stamp (responsive)</p>
              <p className="text-sm text-text-secondary mb-4 max-w-xl">
                Replaces fixed-width ASCII box art. Scales 320px–1440px without overflow or ch-based clipping.
                Use <code className="font-mono text-xs">HeroStamp</code> with decorative English lines or pass custom lines for i18n.
              </p>
              <HeroStamp />
            </div>
            <div className="panel p-6">
              <p className="font-mono text-xs text-text-muted mb-2">font-serif · Playfair Display</p>
              <p className="font-serif text-xl text-text-primary">Product storytelling — sparse use only.</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h1 className="text-4xl font-display font-bold">Heading One</h1>
            <h2 className="text-2xl font-display font-semibold">Heading Two</h2>
            <h3 className="text-xl font-display font-semibold">Heading Three</h3>
            <p className="text-base text-text-secondary">Body copy at 16px with 1.6 line-height. Use … not three dots.</p>
            <p className="text-xs text-text-muted">Minimum size — text-xs (12px)</p>
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border-default">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-2">{t.styleGuide?.sections?.buttons ?? 'Buttons'}</h2>
          <p className="text-text-secondary text-sm mb-8 max-w-2xl">
            Neo-brutalist pill controls — monospace uppercase, 44px min height, square corners. Segmented groups use <code className="font-mono text-xs">collection-filter-pills</code>; standalone actions use <code className="font-mono text-xs">btn</code> or <code className="font-mono text-xs">collection-action-pill</code>.
          </p>

          <p className="section-label mb-3">Segmented filter group</p>
          <div className="collection-filter-pills w-fit mb-8" role="group" aria-label="Filter demo">
            <button type="button" className="collection-filter-pill" aria-pressed="true">All</button>
            <button type="button" className="collection-filter-pill" aria-pressed="false">Active</button>
            <button type="button" className="collection-filter-pill" aria-pressed="false">Sold</button>
          </div>

          <p className="section-label mb-3">Standalone variants</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary">Shop Protectors</Button>
            <Button variant="secondary">View Specs</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete Collection</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button>
              With Icon
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-border-default bg-surface-panel">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">Panels &amp; Spec Rows</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="panel p-6">
              <p className="section-label mb-4">Panel</p>
              <p className="text-sm text-text-secondary">Neo-brutalist panel with 1px border. Shadow on dark surfaces only.</p>
            </div>
            <div className="panel p-6">
              <p className="section-label mb-4">Spec Sheet</p>
              <div className="spec-row">
                <span className="spec-row__label">35PT Compatibility</span>
                <span className="spec-row__value">PSA ✓</span>
              </div>
              <div className="spec-row">
                <span className="spec-row__label">UV Protection</span>
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

      <section className="section-padding border-b border-border-default">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">Forms</h2>
          <form className="panel p-6 max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="sg-email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="sg-email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@example.com…"
                className="w-full px-3 py-2 bg-surface-raised border border-border-default text-text-primary text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-link"
              />
            </div>
            <div>
              <label htmlFor="sg-sku" className="block text-sm font-medium text-text-primary mb-1.5">
                SKU
              </label>
              <input
                id="sg-sku"
                name="sku"
                type="text"
                spellCheck={false}
                placeholder="PSA-MAG-35…"
                className="w-full px-3 py-2 bg-surface-raised border border-border-default text-text-primary font-mono text-sm focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg"
              />
            </div>
            <div>
              <label htmlFor="sg-grade" className="block text-sm font-medium text-text-primary mb-1.5">
                Grade
              </label>
              <select
                id="sg-grade"
                name="grade"
                autoComplete="off"
                className="w-full px-3 py-2 border border-border-default text-sm focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg"
                defaultValue=""
              >
                <option value="" disabled>Select grade…</option>
                <option value="10">PSA 10</option>
                <option value="9">PSA 9</option>
              </select>
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </div>
      </section>

      <section className="section-padding border-b border-border-default bg-surface-panel page-blueprint">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">Layout Patterns</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="panel p-0 overflow-hidden">
              <div className="border-b border-border-default px-4 py-2 bg-surface-raised flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Hero · 2-col</span>
                <span className="font-mono text-[10px] text-accent-warn">Available</span>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="section-label mb-2">Copy</p>
                  <p className="font-display font-bold text-lg">Asymmetric headline</p>
                  <p className="text-sm text-text-secondary mt-2">Hero stamp + CTA row</p>
                </div>
                <div className="panel-raised p-3">
                  <div className="spec-row py-2">
                    <span className="spec-row__label">Spec</span>
                    <span className="spec-row__value">Value</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel p-0 overflow-hidden">
              <div className="border-b border-border-default px-4 py-2 bg-surface-raised">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Section · alternating bands</span>
              </div>
              <div className="divide-y divide-border-default">
                <div className="px-4 py-3 bg-surface-bg text-xs text-text-muted font-mono">surface-bg</div>
                <div className="px-4 py-3 bg-surface-panel text-xs text-text-muted font-mono">surface-panel</div>
                <div className="px-4 py-3 bg-surface-bg text-xs text-text-muted font-mono">surface-bg</div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-text-secondary max-w-2xl">
            Marketing pages use <code className="font-mono text-xs">page-blueprint</code> for Hermes-style atmosphere: dual-scale engineering grid (24px minor + 72px major), radial center lift and edge vignette via <code className="font-mono text-xs">::after</code>, plus body-wide film grain from <code className="font-mono text-xs">page-noise</code> on <code className="font-mono text-xs">body</code> (~2% light, stronger in dark). Decorative layers use fixed attachment for parallax depth; <code className="font-mono text-xs">prefers-reduced-motion</code> falls back to scroll and disables grain.
            Tools use full-width workspace + spec-row control strip. Mobile: single column, 44px touch targets, <code className="font-mono text-xs">min-w-0</code>.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-bold mb-8">{t.styleGuide?.sections?.spacing ?? 'Spacing'}</h2>
          <div className="panel p-6 space-y-3 font-mono text-xs text-text-muted">
            <p>--space-page-x: clamp(16px, 4vw, 24px)</p>
            <p>--space-section-y: clamp(48px, 8vw, 96px)</p>
            <p>--radius-panel: 0 · --radius-control: 6px</p>
            <p>Max width: 1280px marketing · 1080px tools</p>
          </div>
        </div>
      </section>
    </div>
  );
}
