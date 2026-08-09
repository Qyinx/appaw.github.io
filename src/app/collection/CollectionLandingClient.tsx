'use client';

import React from 'react';
import Image from 'next/image';
import {
  Package, LogIn, TrendingUp, Shield, ScanLine,
  ArrowRight, Loader2, LayoutGrid, Database, Layers,
  Lock, BarChart3, Plus, Sparkles,
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import LocalLink from '@/components/LocalLink';
import { authAuthorizationParams } from '@/app/collection/lib/authSession';
import { getImagePath } from '@/lib/utils';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

const FEATURE_ICONS = [LayoutGrid, Database, Layers, ScanLine];
const STEP_ICONS = [LogIn, Plus, BarChart3];
const PREVIEW_CARDS = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
];

function SectionLabel({ text }: { text: string }) {
  return <p className="section-label mb-5 text-accent-link before:bg-accent-link">{text}</p>;
}

function HowItWorksSteps({
  steps,
  stepLabel,
  visible,
}: {
  steps: ReturnType<typeof useLanguage>['t']['collection']['landing']['howItWorks']['steps'];
  stepLabel: string;
  visible: boolean;
}) {
  return (
    <div className="space-y-5 md:space-y-0">
      {/* Step progress rail — desktop */}
      <div className="hidden md:flex items-center mb-8 px-2">
        {steps.map((_, i) => (
          <React.Fragment key={i}>
            <div
              className="flex-shrink-0 w-9 h-9 border flex items-center justify-center text-xs font-black transition-[border-color,background-color,color] duration-500"
              style={{
                borderColor: visible ? 'color-mix(in srgb, var(--accent-secondary) 45%, transparent)' : 'var(--border-default)',
                background: visible ? 'color-mix(in srgb, var(--accent-secondary) 12%, transparent)' : 'var(--surface-raised)',
                color: visible ? 'var(--accent-secondary)' : 'var(--text-muted)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-3 bg-border-default transition-opacity duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * 120 + 80}ms`,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? Package;
          const n = String(i + 1).padStart(2, '0');

          return (
            <Reveal key={step.title} visible={visible} delay={i * 40} className="h-full">
              <article className="group relative flex flex-col h-full panel p-6 md:p-7 transition-[border-color,background-color] duration-300 hover:bg-surface-raised">
                <span className="absolute top-4 right-5 font-display text-5xl font-black text-surface-raised select-none leading-none pointer-events-none group-hover:text-accent-link/10 transition-colors duration-300">
                  {n}
                </span>

                <div className="relative z-10 flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-11 h-11 border border-accent-link/30 bg-accent-link/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-5 h-5 text-accent-link" />
                  </div>
                  <span className="md:hidden font-mono text-xs uppercase tracking-[0.22em] text-accent-link/70 font-semibold">
                    {stepLabel.replace('{n}', String(i + 1))}
                  </span>
                </div>

                <h3 className="relative z-10 text-text-primary font-semibold text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="relative z-10 text-text-secondary text-sm leading-relaxed flex-1">{step.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function DashboardPreview({ labels }: { labels: ReturnType<typeof useLanguage>['t']['collection']['landing']['preview'] }) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="panel p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-raised">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-link/80" />
            <div className="w-2 h-2 bg-border-strong" />
            <div className="w-2 h-2 bg-border-strong" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted">{labels.label}</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1">{labels.portfolio}</p>
              <p className="text-text-primary font-semibold text-sm">{labels.cardCount.replace('{n}', '12')}</p>
            </div>
            <div className="flex gap-2">
              <div className="px-2.5 py-1 border border-accent-success/20 bg-accent-success/10">
                <span className="text-accent-success text-xs font-bold">8 {labels.statActive}</span>
              </div>
              <div className="px-2.5 py-1 border border-accent-danger/20 bg-accent-danger/10">
                <span className="text-accent-danger/80 text-xs font-bold">4 {labels.statSold}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-hidden py-1">
            {PREVIEW_CARDS.map((src, i) => (
              <div
                key={src}
                className="relative flex-shrink-0 w-[72px] h-[96px] overflow-hidden border border-border-default bg-surface-raised"
                style={{ transform: `rotate(${i === 0 ? -4 : i === 2 ? 4 : 0}deg) translateY(${i === 1 ? -4 : 0}px)` }}
              >
                <Image src={getImagePath(src)} alt="" fill className="object-contain p-1" sizes="72px" />
              </div>
            ))}
            <div className="flex-shrink-0 w-[72px] h-[96px] border border-dashed border-accent-link/30 bg-accent-link/5 flex items-center justify-center">
              <Plus className="w-4 h-4 text-accent-link/60" />
            </div>
          </div>

          <div className="panel-raised p-3">
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-16 overflow-hidden border border-border-default flex-shrink-0">
                <Image src={getImagePath(PREVIEW_CARDS[0])} alt="" fill className="object-contain p-0.5" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-xs font-semibold truncate">{labels.sampleCard}</p>
                <p className="text-text-muted text-xs truncate mb-2">{labels.sampleSet}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-accent-danger/90 text-text-primary">{labels.sampleGrade.split(' ')[0]}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-accent-link/20 text-accent-link border border-accent-link/30">10</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted mb-0.5">{labels.sampleBuyLabel}</p>
                <p className="text-accent-link text-xs font-bold font-tabular">{labels.sampleBuy}</p>
                <p className="text-accent-success/70 text-[9px] mt-1">{labels.sampleStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionLandingClient() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { t } = useLanguage();
  const localize = useLocalizedPath();
  const L = t.collection.landing;

  const heroMounted = useHeroMount();
  const heroRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const statsRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const featuresRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const stepsRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const privacyRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const ctaRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });

  function goToAuth() {
    if (isAuthenticated) {
      window.location.href = localize('/collection/list');
    } else {
      loginWithRedirect({
        appState: { returnTo: localize('/collection/list') },
        authorizationParams: authAuthorizationParams(),
      });
    }
  }

  const primaryCta = isAuthenticated ? t.collection.openCollection : t.collection.signIn;
  const PrimaryIcon = isAuthenticated ? Package : LogIn;

  return (
    <div className="flex flex-col bg-surface-bg">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef.ref} className="relative min-h-[88dvh] flex items-center overflow-hidden border-b border-border-default page-blueprint">

        <div className="container-custom py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <MotionStagger visible={heroMounted}>
              <p className="section-label mb-8 text-accent-link before:bg-accent-link motion-stagger-item">{L.badge}</p>

              <h1 className="motion-stagger-item font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.4rem] font-bold text-text-primary leading-[1.05] tracking-tight mb-6">
                {L.titleLine1}
                <br />
                <span className="text-accent-link">{L.titleAccent}</span>
              </h1>

              <p className="motion-stagger-item text-text-secondary text-base md:text-lg leading-relaxed max-w-lg mb-10">
                {L.subtitle}
              </p>

              <div className="motion-stagger-item flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={goToAuth}
                  disabled={isLoading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <PrimaryIcon className="w-4 h-4" />
                      {primaryCta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                {!isAuthenticated && !isLoading && (
                  <LocalLink
                    href="/collection/auth"
                    className="text-text-muted hover:text-accent-link text-sm transition-colors duration-150 underline-offset-4 hover:underline"
                  >
                    {t.collection.learnAboutSignIn}
                  </LocalLink>
                )}
              </div>
            </MotionStagger>

            <Reveal visible={heroRef.visible} dir="right" delay={120}>
              <DashboardPreview labels={L.preview} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS RIBBON ═══ */}
      <section ref={statsRef.ref} className="border-y border-border-default bg-surface-panel">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-default border border-border-default overflow-hidden">
            {L.stats.map(({ value, label }, i) => (
              <Reveal
                key={label}
                visible={statsRef.visible}
                dir="up"
                delay={i * 40}
                className="bg-surface-panel px-6 py-6 text-center hover:bg-surface-raised transition-colors duration-300"
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-accent-link mb-1 font-tabular">{value}</p>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO ═══ */}
      <section ref={featuresRef.ref} className="py-20 md:py-28 relative overflow-hidden border-b border-border-default">
        <div className="container-custom relative">
          <Reveal visible={featuresRef.visible} dir="up">
            <SectionLabel text={L.featuresSection.badge} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-3">
              {L.featuresSection.title}
            </h2>
            <p className="text-text-secondary text-base max-w-xl mb-12 leading-relaxed">
              {L.featuresSection.subtitle}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.collection.features.map(({ title, body }, idx) => {
              const Icon = FEATURE_ICONS[idx] ?? Package;
              const isHero = idx === 0;
              const isWide = idx === 3;
              const span = isHero || isWide ? 'md:col-span-2' : '';

              return (
                <Reveal
                  key={title}
                  visible={featuresRef.visible}
                  dir="up"
                  delay={idx * 40}
                  className={`group relative overflow-hidden panel hover:bg-surface-raised transition-[background-color] duration-300 ${span} ${isHero ? 'p-8 md:p-10 md:min-h-[220px]' : isWide ? 'p-6 md:p-8' : 'p-7'}`}
                >
                  {isHero && (
                    <span className="absolute -bottom-6 -right-4 text-[8rem] font-black text-surface-raised select-none leading-none pointer-events-none">
                      01
                    </span>
                  )}

                  <div className={isWide ? 'md:flex md:items-start md:gap-6' : ''}>
                    <div
                      className={`border border-accent-link/25 bg-accent-link/10 flex items-center justify-center mb-5 md:mb-0 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${isHero ? 'w-12 h-12' : 'w-10 h-10'}`}
                    >
                      <Icon className={`text-accent-link ${isHero ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </div>

                    <div className={isWide ? 'flex-1 min-w-0' : ''}>
                      <h3 className={`text-text-primary font-bold mb-2 ${isHero ? 'text-xl' : 'text-base'}`}>{title}</h3>
                      <p className={`text-text-secondary leading-relaxed ${isHero ? 'text-sm max-w-md' : 'text-sm'}`}>{body}</p>

                      {isWide && (
                        <div className="mt-4 inline-flex items-center gap-2 text-accent-link/70 font-mono text-xs uppercase tracking-[0.2em]">
                          <Sparkles className="w-3 h-3" />
                          {L.aiBadge}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsRef.ref} className="relative py-20 md:py-28 border-t border-border-default overflow-hidden bg-surface-panel">
        <div className="container-custom relative">
          <div className="max-w-2xl mb-12 md:mb-16">
            <Reveal visible={stepsRef.visible} dir="up">
              <SectionLabel text={L.howItWorks.badge} />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                {L.howItWorks.title}
              </h2>
            </Reveal>
          </div>

          <HowItWorksSteps steps={L.howItWorks.steps} stepLabel={L.howItWorks.stepLabel} visible={stepsRef.visible} />
        </div>
      </section>

      {/* ═══ PRIVACY ═══ */}
      <section ref={privacyRef.ref} className="py-16 md:py-20 border-t border-border-default">
        <div className="container-custom">
          <Reveal visible={privacyRef.visible} dir="up" className="panel p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <SectionLabel text={L.privacy.badge} />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">{L.privacy.title}</h2>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">{L.privacy.body}</p>
              </div>
              <ul className="space-y-3">
                {L.privacy.points.map((point, pi) => {
                  const PointIcon = [Lock, Shield, TrendingUp][pi] ?? Shield;
                  return (
                    <li key={point} className="spec-row !grid-cols-[auto_1fr] !gap-3 !py-3 !px-4 bg-surface-raised border border-border-default">
                      <div className="w-8 h-8 border border-accent-link/20 bg-accent-link/10 flex items-center justify-center flex-shrink-0">
                        <PointIcon className="w-3.5 h-3.5 text-accent-link" />
                      </div>
                      <span className="text-text-secondary text-sm self-center">{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={ctaRef.ref} className="border-t border-border-default overflow-hidden">
        <Reveal visible={ctaRef.visible} dir="up" className="relative py-20 md:py-28 text-center bg-surface-panel">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="container-custom relative">
            <p className="section-label mb-5 justify-center text-accent-link before:bg-accent-link">{L.finalCta.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4">
              {L.finalCta.title}
            </h2>
            <p className="text-text-secondary text-base max-w-md mx-auto mb-10 leading-relaxed">
              {L.finalCta.subtitle}
            </p>
            <button
              onClick={goToAuth}
              disabled={isLoading}
              className="btn btn-secondary disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isAuthenticated ? t.collection.openCollection : t.collection.cta.buttonSignIn}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
