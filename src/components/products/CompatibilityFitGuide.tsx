'use client';

import React from 'react';

export interface FitGuideRow {
  id: string;
  label: string;
}

export interface CompatibilityFitGuideLabels {
  fitGuideBadge: string;
  compatibilityTitle: string;
  compatibilitySubtitle: string;
  compatible: string;
  notCompatible: string;
  note: string;
  fitsSummary: string;
  notFitsSummary: string;
  noteSummary: string;
  fitGuide: {
    panelTitle: string;
    thicknessLabel: string;
    thicknessValue: string;
    thicknessDesc: string;
    cavityLabel: string;
    cavityValue: string;
    verifyLabel: string;
    verdictPass: string;
    verdictFail: string;
    verdictNote: string;
    passRows: FitGuideRow[];
    failRows: FitGuideRow[];
  };
}

interface CompatibilityFitGuideProps {
  labels: CompatibilityFitGuideLabels;
  visible?: boolean;
}

function VerdictBadge({ kind, children }: { kind: 'pass' | 'fail' | 'note'; children: React.ReactNode }) {
  const styles = {
    pass: 'fit-verdict-badge fit-verdict-badge--pass',
    fail: 'fit-verdict-badge fit-verdict-badge--fail',
    note: 'fit-verdict-badge fit-verdict-badge--note',
  };
  return <span className={styles[kind]}>{children}</span>;
}

export default function CompatibilityFitGuide({ labels, visible = true }: CompatibilityFitGuideProps) {
  const fg = labels.fitGuide;
  const passCount = fg.passRows.length;
  const failCount = fg.failRows.length;

  return (
    <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 lg:gap-12 items-start">
      {/* Slab profile instrument */}
      <div
        className="fit-guide-instrument panel p-0 overflow-hidden motion-reveal motion-reveal-up"
        data-visible={visible ? 'true' : 'false'}
      >
        <div className="border-b border-border-default px-4 py-2.5 flex items-center justify-between gap-3 bg-surface-raised">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">{fg.panelTitle}</span>
          <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">{fg.thicknessValue}</span>
          <span className="font-mono text-xs text-accent-success uppercase tracking-wider">{fg.verdictPass}</span>
        </div>

        <div className="p-5">
          <div className="fit-guide-profile border border-border-strong bg-surface-bg border-l-[3px] border-l-accent-secondary relative overflow-hidden">
            <div className="fit-guide-grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="fit-guide-corners pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="relative z-[1] px-6 py-10 md:py-12 flex flex-col items-center text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted mb-3">{fg.thicknessLabel}</p>
              <p className="font-display text-6xl md:text-7xl font-bold text-text-primary leading-none font-tabular tracking-tight">
                {fg.thicknessValue}
              </p>
              <p className="mt-3 text-sm text-text-secondary max-w-xs">{fg.thicknessDesc}</p>

              <div className="fit-guide-slab-outline mt-10 w-full max-w-[11rem] aspect-[5/8] border-2 border-accent-structural/25 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-text-muted uppercase tracking-wider whitespace-nowrap">
                  {fg.cavityLabel}
                </span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-text-primary font-tabular whitespace-nowrap">
                  {fg.cavityValue}
                </span>
                <span className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-accent-primary opacity-70" aria-hidden="true" />
                <span className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-accent-primary opacity-70" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mt-4 divide-y divide-border-default border border-border-default bg-surface-panel">
            <div className="spec-row px-4">
              <span className="spec-row__label">{fg.thicknessLabel}</span>
              <span className="spec-row__value font-tabular">{fg.thicknessValue}</span>
            </div>
            <div className="spec-row px-4">
              <span className="spec-row__label">{fg.cavityLabel}</span>
              <span className="spec-row__value font-tabular">{fg.cavityValue}</span>
            </div>
          </div>

          <div className="color-terminal-readout terminal-block mt-4 py-3 px-4 text-xs" aria-live="polite">
            <p>
              <span className="prompt">&gt;</span> {fg.verifyLabel.toLowerCase().replace(/\s+/g, '_')}
            </p>
            <p className="mt-1 text-text-secondary font-tabular">
              <span className="prompt">&gt;</span> pass {passCount} · fail {failCount}
            </p>
            <p className="mt-1 text-text-primary">
              <span className="prompt">&gt;</span> status ready
              <span className="cursor" aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>

      {/* Verdict matrix */}
      <div className="space-y-4">
        <div
          className="fit-verdict-panel fit-verdict-panel--pass panel p-0 overflow-hidden motion-reveal motion-reveal-up"
          data-visible={visible ? 'true' : 'false'}
          style={{ '--motion-delay': '60ms' } as React.CSSProperties}
        >
          <div className="fit-verdict-panel__header px-4 py-3 flex items-center justify-between gap-3 bg-surface-raised border-b border-border-default">
            <div className="flex items-center gap-3 min-w-0">
              <VerdictBadge kind="pass">{fg.verdictPass}</VerdictBadge>
              <h3 className="font-display font-bold text-text-primary truncate">{labels.compatible}</h3>
            </div>
            <span className="font-mono text-xs text-text-muted font-tabular flex-shrink-0">{passCount} rows</span>
          </div>
          <div className="divide-y divide-border-default">
            {fg.passRows.map((row) => (
              <div key={row.id} className="fit-matrix-row px-4 py-3.5 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                <span className="font-mono text-xs text-text-muted font-tabular">{row.id}</span>
                <span className="text-sm text-text-primary leading-snug">{row.label}</span>
                <VerdictBadge kind="pass">{fg.verdictPass}</VerdictBadge>
              </div>
            ))}
          </div>
          <p className="px-4 py-3 text-xs text-text-secondary leading-relaxed border-t border-border-default bg-surface-bg">
            {labels.fitsSummary}
          </p>
        </div>

        <div
          className="fit-verdict-panel fit-verdict-panel--fail panel p-0 overflow-hidden motion-reveal motion-reveal-up"
          data-visible={visible ? 'true' : 'false'}
          style={{ '--motion-delay': '120ms' } as React.CSSProperties}
        >
          <div className="fit-verdict-panel__header px-4 py-3 flex items-center justify-between gap-3 bg-surface-raised border-b border-border-default">
            <div className="flex items-center gap-3 min-w-0">
              <VerdictBadge kind="fail">{fg.verdictFail}</VerdictBadge>
              <h3 className="font-display font-bold text-text-primary truncate">{labels.notCompatible}</h3>
            </div>
            <span className="font-mono text-xs text-text-muted font-tabular flex-shrink-0">{failCount} rows</span>
          </div>
          <div className="divide-y divide-border-default">
            {fg.failRows.map((row) => (
              <div key={row.id} className="fit-matrix-row px-4 py-3.5 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                <span className="font-mono text-xs text-text-muted font-tabular">{row.id}</span>
                <span className="text-sm text-text-primary leading-snug">{row.label}</span>
                <VerdictBadge kind="fail">{fg.verdictFail}</VerdictBadge>
              </div>
            ))}
          </div>
          <p className="px-4 py-3 text-xs text-text-secondary leading-relaxed border-t border-border-default bg-surface-bg">
            {labels.notFitsSummary}
          </p>
        </div>

        <div
          className="fit-verdict-panel fit-verdict-panel--note panel p-0 overflow-hidden motion-reveal motion-reveal-up"
          data-visible={visible ? 'true' : 'false'}
          style={{ '--motion-delay': '180ms' } as React.CSSProperties}
        >
          <div className="fit-verdict-panel__header px-4 py-3 flex items-center gap-3 bg-surface-raised border-b border-border-default">
            <VerdictBadge kind="note">{fg.verdictNote}</VerdictBadge>
            <h3 className="font-display font-bold text-text-primary">{labels.note}</h3>
          </div>
          <p className="px-4 py-4 text-sm text-text-secondary leading-relaxed">{labels.noteSummary}</p>
        </div>
      </div>
    </div>
  );
}
