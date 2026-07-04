'use client';

import React, { useEffect, useRef } from 'react';
import { ImageUp, SlidersHorizontal, Frame, Gauge, ExternalLink, ArrowRight } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import HeroStamp from '@/components/ui/HeroStamp';
import GuideFaq from '@/components/guides/GuideFaq';
import { useLanguage } from '@/context/LanguageContext';
import { useCenteringGuide } from './CenteringGuideContext';
import { STEP_COUNT } from './centering-guide';
import styles from './card-centering.module.css';

const STEP_ICONS = [ImageUp, SlidersHorizontal, Frame, Gauge] as const;

const STEP_THEMES = [
  { accent: 'var(--accent-warn)', glow: 'color-mix(in srgb, var(--accent-warn) 14%, transparent)', border: 'color-mix(in srgb, var(--accent-warn) 28%, transparent)', variant: 'upload' as const },
  { accent: 'var(--accent-link)', glow: 'color-mix(in srgb, var(--accent-link) 14%, transparent)', border: 'color-mix(in srgb, var(--accent-link) 32%, transparent)', variant: 'adjust' as const },
  { accent: 'var(--accent-primary)', glow: 'color-mix(in srgb, var(--accent-primary) 14%, transparent)', border: 'color-mix(in srgb, var(--accent-primary) 32%, transparent)', variant: 'align' as const },
  { accent: 'var(--accent-success)', glow: 'color-mix(in srgb, var(--accent-success) 14%, transparent)', border: 'color-mix(in srgb, var(--accent-success) 28%, transparent)', variant: 'result' as const },
];

function StepVisual({ variant }: { variant: (typeof STEP_THEMES)[number]['variant'] }) {
  return (
    <div className={styles.stepVisual} data-variant={variant} aria-hidden="true">
      <div className={styles.stepVisualCard}>
        {variant === 'upload' && <span className={styles.stepVisualUpload}>↑</span>}
        {variant === 'adjust' && (
          <>
            <span className={`${styles.stepVisualSlider} ${styles.stepVisualSliderTop}`} />
            <span className={`${styles.stepVisualSlider} ${styles.stepVisualSliderMid}`} />
            <span className={`${styles.stepVisualSlider} ${styles.stepVisualSliderBot}`} />
          </>
        )}
        {variant === 'align' && (
          <>
            <span className={`${styles.stepVisualLine} ${styles.stepVisualEdge} ${styles.stepVisualTop}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualEdge} ${styles.stepVisualBottom}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualEdge} ${styles.stepVisualLeft}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualEdge} ${styles.stepVisualRight}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualBorder} ${styles.stepVisualTop} ${styles.stepVisualInset}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualBorder} ${styles.stepVisualBottom} ${styles.stepVisualInset}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualBorder} ${styles.stepVisualLeft} ${styles.stepVisualInset}`} />
            <span className={`${styles.stepVisualLine} ${styles.stepVisualBorder} ${styles.stepVisualRight} ${styles.stepVisualInset}`} />
          </>
        )}
        {variant === 'result' && (
          <div className={styles.stepVisualMeter}>
            <span>55</span>
            <span className={styles.stepVisualMeterDot} />
            <span>45</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HowToSteps({
  steps,
  badge,
  title,
  stepLabel,
}: {
  steps: { title: string; body: string }[];
  badge: string;
  title: string;
  stepLabel: string;
}) {
  const { t } = useLanguage();
  const tool = t.centeringPage.tool;
  const howToSteps = t.centeringPage.howToSteps;
  const { activeStep, getStepState } = useCenteringGuide();
  const sectionRef = useRef<HTMLElement>(null);
  const prevStepRef = useRef(activeStep);

  useEffect(() => {
    if (prevStepRef.current === activeStep) return;
    prevStepRef.current = activeStep;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    const currentEl = section.querySelector(`#centering-step-${activeStep + 1}`);
    currentEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeStep]);

  const liveStatus = howToSteps[activeStep]
    ? tool.guideLiveStatus
        .replace('{current}', String(activeStep + 1))
        .replace('{total}', String(STEP_COUNT))
        .replace('{title}', howToSteps[activeStep].name)
    : null;

  return (
    <section
      ref={sectionRef}
      className={`panel p-0 overflow-hidden border-l-[3px] border-l-accent-primary ${styles.howToSection}`}
      aria-labelledby="how-to-use"
    >
      <div className={styles.howToInstrumentHeader}>
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">{badge}</span>
        <span className="font-mono text-xs text-text-secondary font-tabular tracking-widest">
          {String(steps.length).padStart(2, '0')} steps
        </span>
      </div>
      <div className={styles.howToHeader}>
        <h2 id="how-to-use" className={styles.howToTitle}>{title}</h2>
        {liveStatus ? (
          <p className={styles.howToLiveStatus} aria-live="polite">
            {liveStatus}
          </p>
        ) : null}
      </div>

      <div className={styles.stepRail} aria-hidden="true">
        {steps.map((_, i) => {
          const stepState = getStepState(i);
          return (
            <React.Fragment key={i}>
              <span
                className={styles.stepRailDot}
                data-step-state={stepState}
                style={{
                  ['--step-accent' as string]: STEP_THEMES[i]?.accent ?? 'var(--accent-warn)',
                  ['--step-delay' as string]: `${i * 90}ms`,
                }}
              >
                {stepState === 'completed' ? '✓' : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={styles.stepRailLine}
                  data-step-state={stepState === 'completed' ? 'completed' : 'upcoming'}
                  style={{ ['--step-delay' as string]: `${i * 90 + 60}ms` }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <ol className={styles.stepGrid}>
        {steps.map((step, i) => {
          const theme = STEP_THEMES[i] ?? STEP_THEMES[0];
          const Icon = STEP_ICONS[i] ?? ImageUp;
          const n = String(i + 1).padStart(2, '0');
          const stepState = getStepState(i);

          return (
            <li
              key={step.title}
              id={`centering-step-${i + 1}`}
              className={styles.stepCard}
              data-step-state={stepState}
              style={{
                ['--step-accent' as string]: theme.accent,
                ['--step-glow' as string]: theme.glow,
                ['--step-border' as string]: theme.border,
                ['--step-delay' as string]: `${120 + i * 80}ms`,
              }}
            >
              <span className={styles.stepGhost}>{n}</span>

              <div className={styles.stepCardTop}>
                <div className={styles.stepIconWrap}>
                  <Icon className={styles.stepIcon} strokeWidth={2} />
                </div>
                <span className={styles.stepChip}>{stepLabel.replace('{n}', String(i + 1))}</span>
              </div>

              <StepVisual variant={theme.variant} />

              <div className={styles.stepCopy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CenteringReferences({
  title,
  externalLabel,
  guidesLabel,
  guidesIndex,
  externalSources,
  guideLinks,
}: {
  title: string;
  externalLabel: string;
  guidesLabel: string;
  guidesIndex: string;
  externalSources: { label: string; href: string }[];
  guideLinks: { label: string; href: string }[];
}) {
  return (
    <section
      className={`panel p-0 overflow-hidden border-l-[3px] border-l-accent-link ${styles.contentSpecSection}`}
      aria-labelledby="centering-references"
    >
      <div className={styles.contentSectionHeader}>
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Sources</span>
        <span className="font-mono text-xs text-accent-link uppercase tracking-wider">Links</span>
      </div>
      <div className={styles.contentSectionBody}>
        <h2 id="centering-references" className={styles.contentH2}>{title}</h2>

        <h3 className={styles.referenceSubheading}>{externalLabel}</h3>
        <ul className={styles.referenceList}>
          {externalSources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.referenceLink}
              >
                <span>{source.label}</span>
                <ExternalLink className={styles.referenceExternalIcon} strokeWidth={2} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <h3 className={styles.referenceSubheading}>{guidesLabel}</h3>
        <ul className={styles.referenceList}>
          {guideLinks.map((link) => (
            <li key={link.href}>
              <LocalLink href={link.href} className={styles.referenceLink}>
                <span>{link.label}</span>
                <ArrowRight className={styles.referenceInternalIcon} strokeWidth={2} aria-hidden="true" />
              </LocalLink>
            </li>
          ))}
          <li>
            <LocalLink href="/guides/" className={styles.referenceLink}>
              <span>{guidesIndex}</span>
              <ArrowRight className={styles.referenceInternalIcon} strokeWidth={2} aria-hidden="true" />
            </LocalLink>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function CenteringContent() {
  const { t } = useLanguage();
  const c = t.centeringPage.content;

  return (
    <article className={styles.contentWrapper}>
      <div className={styles.contentInner}>
      <header className={styles.contentHeader}>
        <HeroStamp className="mb-8 max-w-md" lines={{ muted: c.howToBadge }} />
        <p className="section-label mb-5">{c.howToBadge}</p>
        <h1 className={styles.contentH1}>{c.h1}</h1>
        <p className={`${styles.contentLead} centering-aeo-answer`}>{c.lead}</p>
        <div className={`color-terminal-readout terminal-block ${styles.contentTerminal}`} aria-hidden="true">
          <p>
            <span className="prompt">&gt;</span> init_centering_analyzer
          </p>
          <p className="text-text-secondary mt-1">
            <span className="prompt">&gt;</span> standards PSA · BGS · SGC
            <span className="cursor" aria-hidden="true" />
          </p>
        </div>
      </header>

      <HowToSteps
        steps={c.steps}
        badge={c.howToBadge}
        title={c.howToTitle}
        stepLabel={c.stepLabel}
      />

      <section className={`panel p-0 overflow-hidden border-l-[3px] border-l-accent-secondary ${styles.contentSpecSection}`} aria-labelledby="psa-requirements">
        <div className={styles.contentSectionHeader}>
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">PSA Spec</span>
          <span className="font-mono text-xs text-accent-warn uppercase tracking-wider">Reference</span>
        </div>
        <div className={styles.contentSectionBody}>
        <h2 id="psa-requirements" className={styles.contentH2}>{c.psaRequirementsTitle}</h2>
        <p className={`${styles.contentP} centering-aeo-answer`}>{c.psaRequirementsIntro}</p>
        <div className={`panel-raised ${styles.tableScroll}`}>
          <table className={styles.gradeTable}>
            <thead>
              <tr>
                <th scope="col">{c.gradeTable.headers.grade}</th>
                <th scope="col">{c.gradeTable.headers.front}</th>
                <th scope="col">{c.gradeTable.headers.back}</th>
              </tr>
            </thead>
            <tbody>
              {c.gradeTable.rows.map((r) => (
                <tr key={r.grade}>
                  <th scope="row">{r.grade}</th>
                  <td>{r.front}</td>
                  <td>{r.back}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.contentNote}>{c.gradeTableNote}</p>
        {'centeringGuideLink' in c && c.centeringGuideLink ? (
          <p className={styles.contentP}>
            <LocalLink href="/guides/psa-10-centering-requirements/" className={styles.contentLink}>
              {c.centeringGuideLink}
            </LocalLink>
          </p>
        ) : null}
        </div>
      </section>

      <section className={`panel p-0 overflow-hidden border-l-[3px] border-l-accent-warn ${styles.contentSpecSection}`} aria-labelledby="slab-workflow">
        <div className={styles.contentSectionHeader}>
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Slab Photo</span>
          <span className="font-mono text-xs text-accent-warn uppercase tracking-wider">Workflow</span>
        </div>
        <div className={styles.contentSectionBody}>
          <h2 id="slab-workflow" className={styles.contentH2}>{c.slabWorkflowTitle}</h2>
          <p className={styles.contentP}>{c.slabWorkflowIntro}</p>
          <ol className={styles.slabStepList}>
            {c.slabSteps.map((step, i) => (
              <li key={step.title} className={styles.slabStepItem}>
                <span className={styles.slabStepIndex}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.slabStepTitle}>{step.title}</h3>
                  <p className={styles.contentP}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`panel ${styles.contentSection}`} aria-labelledby="regrade-reholder">
        <h2 id="regrade-reholder" className={styles.contentH2}>{c.regradeTitle}</h2>
        <p className={`${styles.contentP} centering-aeo-answer`}>{c.regradeAeoAnswer}</p>
        <p className={styles.contentP}>{c.regradeP1}</p>
        <p className={styles.contentP}>{c.regradeP2}</p>
        <p className={styles.contentP}>
          <LocalLink href="/guides/regrade-or-reholder/" className={styles.contentLink}>
            {c.regradeGuideLink}
          </LocalLink>
        </p>
      </section>

      <section className={`panel ${styles.contentSection}`} aria-labelledby="why-it-matters">
        <h2 id="why-it-matters" className={styles.contentH2}>{c.whyMattersTitle}</h2>
        <p className={styles.contentP}>{c.whyMattersP1}</p>
        <p className={styles.contentP}>
          {c.whyMattersBeforeProtector}
          <LocalLink href="/products/psa-protectors/" className={styles.contentLink}>{c.protectorLink}</LocalLink>
          {c.whyMattersBeforeTrading}
          <LocalLink href="/business/card-trading/" className={styles.contentLink}>{c.tradingLink}</LocalLink>
          {c.whyMattersAfterTrading}
        </p>
      </section>

      <GuideFaq
        id="centering-faq"
        items={t.centeringPage.faq}
        title={c.faqTitle}
        badge={c.faqBadge}
        countLabel={c.faqCountLabel}
      />

      <CenteringReferences
        title={c.referencesTitle}
        externalLabel={c.referencesExternalLabel}
        guidesLabel={c.referencesGuidesLabel}
        guidesIndex={c.referencesGuidesIndex}
        externalSources={c.externalSources}
        guideLinks={c.guideLinks}
      />
      </div>
    </article>
  );
}
