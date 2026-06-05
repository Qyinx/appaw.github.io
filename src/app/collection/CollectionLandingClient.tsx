'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package, LogIn, TrendingUp, Shield, ScanLine,
  ArrowRight, Loader2, LayoutGrid, Database, Layers,
  Lock, BarChart3, Plus, Sparkles,
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '@/context/LanguageContext';
import LocalLink from '@/components/LocalLink';
import { getImagePath } from '@/lib/utils';

const VIOLET = '#9B7EBF';
const FEATURE_ICONS = [LayoutGrid, Database, Layers, ScanLine];
const STEP_ICONS = [LogIn, Plus, BarChart3];
const PREVIEW_CARDS = [
  '/images/cards/192.SV-P.refine.png',
  '/images/cards/105.SV-9.refine.png',
  '/images/cards/069.SM-P.refine.png',
];

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children, delay = 0, dir = 'up', visible, className = '',
}: {
  children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right'; visible: boolean; className?: string;
}) {
  const translateMap = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)' };
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translateMap[dir],
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-px" style={{ background: VIOLET }} />
      <span className="text-[11px] uppercase tracking-[0.35em] font-medium" style={{ color: VIOLET }}>
        {text}
      </span>
    </div>
  );
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
              className="flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xs font-black transition-all duration-500"
              style={{
                borderColor: visible ? 'rgba(155,126,191,0.45)' : 'rgba(255,255,255,0.08)',
                background: visible ? 'rgba(155,126,191,0.12)' : 'rgba(255,255,255,0.03)',
                color: visible ? VIOLET : 'rgba(255,255,255,0.25)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-3 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, rgba(155,126,191,0.45), rgba(155,126,191,0.12))',
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
            <Reveal key={step.title} visible={visible} delay={i * 100} className="h-full">
              <article className="group relative flex flex-col h-full rounded-2xl border border-white/[0.06] bg-[#1a1a2a] p-6 md:p-7 transition-all duration-300 hover:border-[#9B7EBF]/25 hover:bg-[#1e1e30] hover:shadow-[0_12px_40px_rgba(155,126,191,0.08)]">
                <span className="absolute top-4 right-5 font-display text-5xl font-black text-white/[0.03] select-none leading-none pointer-events-none group-hover:text-[#9B7EBF]/10 transition-colors duration-300">
                  {n}
                </span>

                <div className="relative z-10 flex items-center gap-3 mb-5 md:mb-6">
                  <div className="w-11 h-11 rounded-xl border border-[#9B7EBF]/30 bg-[#9B7EBF]/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-5 h-5 text-[#9B7EBF]" />
                  </div>
                  <span className="md:hidden text-[10px] uppercase tracking-[0.22em] text-[#9B7EBF]/70 font-semibold">
                    {stepLabel.replace('{n}', String(i + 1))}
                  </span>
                </div>

                <h3 className="relative z-10 text-white font-semibold text-lg mb-2 leading-snug">{step.title}</h3>
                <p className="relative z-10 text-[#9ca3af] text-sm leading-relaxed flex-1">{step.body}</p>
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
      <div
        className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${VIOLET}22, transparent)` }}
      />
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#161626]/90 backdrop-blur-sm shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#9B7EBF]/80" />
            <div className="w-2 h-2 rounded-full bg-white/15" />
            <div className="w-2 h-2 rounded-full bg-white/15" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">{labels.label}</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-1">{labels.portfolio}</p>
              <p className="text-white font-semibold text-sm">{labels.cardCount.replace('{n}', '12')}</p>
            </div>
            <div className="flex gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-[10px] font-bold">8 {labels.statActive}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400/80 text-[10px] font-bold">4 {labels.statSold}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-hidden py-1">
            {PREVIEW_CARDS.map((src, i) => (
              <div
                key={src}
                className="relative flex-shrink-0 w-[72px] h-[96px] rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.03]"
                style={{ transform: `rotate(${i === 0 ? -4 : i === 2 ? 4 : 0}deg) translateY(${i === 1 ? -4 : 0}px)` }}
              >
                <Image src={getImagePath(src)} alt="" fill className="object-contain p-1" sizes="72px" />
              </div>
            ))}
            <div className="flex-shrink-0 w-[72px] h-[96px] rounded-lg border border-dashed border-[#9B7EBF]/30 bg-[#9B7EBF]/5 flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#9B7EBF]/60" />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-16 rounded-md overflow-hidden border border-white/[0.08] flex-shrink-0">
                <Image src={getImagePath(PREVIEW_CARDS[0])} alt="" fill className="object-contain p-0.5" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{labels.sampleCard}</p>
                <p className="text-white/30 text-[10px] truncate mb-2">{labels.sampleSet}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600/90 text-white">{labels.sampleGrade.split(' ')[0]}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#9B7EBF]/20 text-[#9B7EBF] border border-[#9B7EBF]/30">10</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white/25 text-[9px] uppercase tracking-wider mb-0.5">{labels.sampleBuyLabel}</p>
                <p className="text-[#9B7EBF] text-xs font-bold">{labels.sampleBuy}</p>
                <p className="text-emerald-400/70 text-[9px] mt-1">{labels.sampleStatus}</p>
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
  const L = t.collection.landing;

  const [mounted, setMounted] = useState(false);
  const heroRef = useReveal();
  const statsRef = useReveal();
  const featuresRef = useReveal();
  const stepsRef = useReveal();
  const privacyRef = useReveal();
  const ctaRef = useReveal();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  function goToAuth() {
    if (isAuthenticated) {
      window.location.href = '/collection/list';
    } else {
      loginWithRedirect({ appState: { returnTo: '/collection/list' } });
    }
  }

  const primaryCta = isAuthenticated ? t.collection.openCollection : t.collection.signIn;
  const PrimaryIcon = isAuthenticated ? Package : LogIn;

  return (
    <div className="flex flex-col bg-[#1e1e2e]">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef.ref} className="relative min-h-[88dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(155,126,191,0.12),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B7EBF]/45 to-transparent" />
        <div className="absolute top-1/3 left-[8%] w-[420px] h-[420px] rounded-full bg-[rgba(155,126,191,0.07)] blur-[90px] pointer-events-none animate-[orb-drift-a_16s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[10%] w-[320px] h-[320px] rounded-full bg-[rgba(129,140,248,0.05)] blur-[70px] pointer-events-none animate-[orb-drift-b_20s_ease-in-out_2s_infinite]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1e1e2e] to-transparent" />

        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(28px)',
                transition: 'opacity 1s ease 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s',
              }}
            >
              <div className="inline-flex items-center gap-2.5 border border-[#9B7EBF]/35 rounded-full px-5 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B7EBF] animate-pulse" />
                <span className="text-[#9B7EBF] text-[11px] uppercase tracking-[0.3em]">{L.badge}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.4rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
                {L.titleLine1}
                <br />
                <span className="text-[#9B7EBF]">{L.titleAccent}</span>
              </h1>

              <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed max-w-lg mb-10">
                {L.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={goToAuth}
                  disabled={isLoading}
                  className="group inline-flex items-center gap-3 bg-[#9B7EBF] hover:bg-[#AF97D3] disabled:opacity-50 text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.14em] px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(155,126,191,0.35)] active:scale-[0.98]"
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
                    className="text-white/40 hover:text-[#9B7EBF] text-sm transition-colors underline-offset-4 hover:underline"
                  >
                    {t.collection.learnAboutSignIn}
                  </LocalLink>
                )}
              </div>
            </div>

            <Reveal visible={heroRef.visible} dir="right" delay={120}>
              <DashboardPreview labels={L.preview} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS RIBBON ═══ */}
      <section ref={statsRef.ref} className="border-y border-white/[0.05] bg-[#161626]/60">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] border border-white/[0.04] rounded-2xl overflow-hidden">
            {L.stats.map(({ value, label }, i) => (
              <div
                key={label}
                className="relative bg-[#1a1a2a] px-6 py-6 text-center group hover:bg-[#1e1e30] transition-colors"
                style={{
                  opacity: statsRef.visible ? 1 : 0,
                  transform: statsRef.visible ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s ease ${i * 80}ms, background 0.3s`,
                }}
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-[#9B7EBF] mb-1">{value}</p>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.22em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO ═══ */}
      <section ref={featuresRef.ref} className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_50%,rgba(155,126,191,0.05),transparent)]" />
        <div className="container-custom relative">
          <Reveal visible={featuresRef.visible} dir="up">
            <SectionLabel text={L.featuresSection.badge} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {L.featuresSection.title}
            </h2>
            <p className="text-[#9ca3af] text-base max-w-xl mb-12 leading-relaxed">
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
                <div
                  key={title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] hover:border-[#9B7EBF]/25 transition-all duration-300 ${span} ${isHero ? 'p-8 md:p-10 md:min-h-[220px]' : isWide ? 'p-6 md:p-8' : 'p-7'}`}
                  style={{
                    background: isHero
                      ? 'linear-gradient(135deg, rgba(155,126,191,0.08) 0%, rgba(22,22,38,0.9) 55%)'
                      : 'rgba(22,22,38,0.6)',
                    opacity: featuresRef.visible ? 1 : 0,
                    transform: featuresRef.visible ? 'none' : 'translateY(24px)',
                    transition: `opacity 0.8s ease ${idx * 100}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${idx * 100}ms, border-color 0.3s`,
                  }}
                >
                  {isHero && (
                    <span className="absolute -bottom-6 -right-4 text-[8rem] font-black text-white/[0.02] select-none leading-none pointer-events-none">
                      01
                    </span>
                  )}
                  {isWide && (
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(155,126,191,0.12),transparent_70%)] pointer-events-none" />
                  )}

                  <div className={isWide ? 'md:flex md:items-start md:gap-6' : ''}>
                    <div
                      className={`rounded-xl border border-[#9B7EBF]/25 bg-[#9B7EBF]/10 flex items-center justify-center mb-5 md:mb-0 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${isHero ? 'w-12 h-12' : 'w-10 h-10'}`}
                    >
                      <Icon className={`text-[#9B7EBF] ${isHero ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </div>

                    <div className={isWide ? 'flex-1 min-w-0' : ''}>
                      <h3 className={`text-white font-bold mb-2 ${isHero ? 'text-xl' : 'text-base'}`}>{title}</h3>
                      <p className={`text-[#9ca3af] leading-relaxed ${isHero ? 'text-sm max-w-md' : 'text-sm'}`}>{body}</p>

                      {isWide && (
                        <div className="mt-4 inline-flex items-center gap-2 text-[#9B7EBF]/70 text-[10px] uppercase tracking-[0.2em]">
                          <Sparkles className="w-3 h-3" />
                          {L.aiBadge}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsRef.ref} className="relative py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[#161626]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(155,126,191,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B7EBF]/30 to-transparent" />

        <div className="container-custom relative">
          <div className="max-w-2xl mb-12 md:mb-16">
            <Reveal visible={stepsRef.visible} dir="up">
              <SectionLabel text={L.howItWorks.badge} />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                {L.howItWorks.title}
              </h2>
            </Reveal>
          </div>

          <HowItWorksSteps steps={L.howItWorks.steps} stepLabel={L.howItWorks.stepLabel} visible={stepsRef.visible} />
        </div>
      </section>

      {/* ═══ PRIVACY ═══ */}
      <section ref={privacyRef.ref} className="py-16 md:py-20 border-t border-white/[0.05]">
        <div className="container-custom">
          <div
            className="relative rounded-2xl border border-white/[0.06] overflow-hidden p-8 md:p-12"
            style={{
              background: 'linear-gradient(120deg, rgba(155,126,191,0.06) 0%, rgba(30,30,46,0.95) 50%)',
              opacity: privacyRef.visible ? 1 : 0,
              transform: privacyRef.visible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <SectionLabel text={L.privacy.badge} />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">{L.privacy.title}</h2>
                <p className="text-[#9ca3af] text-sm md:text-base leading-relaxed">{L.privacy.body}</p>
              </div>
              <ul className="space-y-3">
                {L.privacy.points.map((point, pi) => {
                  const PointIcon = [Lock, Shield, TrendingUp][pi] ?? Shield;
                  return (
                    <li key={point} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="w-8 h-8 rounded-lg bg-[#9B7EBF]/10 border border-[#9B7EBF]/20 flex items-center justify-center flex-shrink-0">
                        <PointIcon className="w-3.5 h-3.5 text-[#9B7EBF]" />
                      </div>
                      <span className="text-white/70 text-sm">{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={ctaRef.ref} className="border-t border-white/[0.05] overflow-hidden">
        <div
          className="relative py-20 md:py-28 text-center"
          style={{
            opacity: ctaRef.visible ? 1 : 0,
            transform: ctaRef.visible ? 'none' : 'translateY(28px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(155,126,191,0.1),transparent)]" />
          <div className="container-custom relative">
            <p className="text-[#9B7EBF]/50 text-[10px] uppercase tracking-[0.4em] mb-5">{L.finalCta.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {L.finalCta.title}
            </h2>
            <p className="text-[#9ca3af] text-base max-w-md mx-auto mb-10 leading-relaxed">
              {L.finalCta.subtitle}
            </p>
            <button
              onClick={goToAuth}
              disabled={isLoading}
              className="group inline-flex items-center gap-3 border border-[#9B7EBF]/40 hover:border-[#9B7EBF] hover:bg-[#9B7EBF]/8 text-[#9B7EBF] text-sm uppercase tracking-[0.14em] font-bold px-10 py-4 rounded-xl transition-all duration-300 disabled:opacity-40 hover:shadow-[0_0_32px_rgba(155,126,191,0.2)]"
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
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#9B7EBF]/25 to-transparent" />
      </section>
    </div>
  );
}
