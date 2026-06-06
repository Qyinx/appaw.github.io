'use client';

import React from 'react';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import {
  Shield, ArrowRight, CheckCircle, XCircle,
  Eye, Lock,
  Star, Package, TrendingUp, Users,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import ShopNowButton from '@/components/ui/ShopNowButton';
import ProtectorTechnicalSpecs from '@/components/products/ProtectorTechnicalSpecs';
import Reveal from '@/components/ui/Reveal';
import { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

/* ─── Section label — use globals .section-label ─── */
function SectionLabel({ text, variant = 'brand' }: { text: string; variant?: 'brand' | 'link' }) {
  return (
    <p className={`section-label mb-6 ${variant === 'link' ? 'text-accent-link before:bg-accent-link' : ''}`}>
      {text}
    </p>
  );
}

/* ─── Spec chip ─── */
function Chip({ label, variant = 'brand' }: { label: string; variant?: 'brand' | 'link' }) {
  const cls = variant === 'link'
    ? 'border-accent-link/30 text-accent-link'
    : 'border-accent-brand/30 text-accent-brand';
  return (
    <span className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] border font-mono ${cls}`}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function BusinessClient() {
  const { t } = useLanguage();
  const heroMounted = useHeroMount();
  const heroRef    = useRevealOnScroll<HTMLElement>({ threshold: 0.06 });
  const psaRef     = useRevealOnScroll<HTMLElement>({ threshold: 0.06 });
  const featRef    = useRevealOnScroll<HTMLElement>({ threshold: 0.06 });
  const tradingRef = useRevealOnScroll<HTMLElement>({ threshold: 0.06 });
  const ctaRef     = useRevealOnScroll<HTMLElement>({ threshold: 0.06 });


  /* ── Trading features ── */
  const tradingFeatureIcons = [Package, TrendingUp, Users, Shield];

  const CARD_IMAGES = [
    '/images/cards/192.SV-P.refine.png',
    '/images/cards/105.SV-9.refine.png',
    '/images/cards/069.SM-P.refine.png',
  ];

  return (
    <div className="flex flex-col bg-surface-bg">

      {/* ══════════════════════════════════════════════════════
           HERO
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef.ref}
        className="relative min-h-[70dvh] flex items-center overflow-hidden border-b border-border-default page-blueprint"
      >

        <div className="container-custom relative z-10 py-24 md:py-32">
          <MotionStagger visible={heroMounted} className="max-w-3xl">
            <p className="section-label mb-8 motion-stagger-item">{t.business.subtitle}</p>

            <h1 className="motion-stagger-item font-display text-5xl sm:text-6xl md:text-7xl font-bold text-text-primary leading-[1.06] tracking-tight mb-6 max-w-3xl">
              {t.business.hero.line1}<br />
              <span className="text-accent-brand">{t.business.hero.line2Collect}</span>{' '}
              <span className="text-accent-link">{t.business.hero.line2Trade}</span>
            </h1>

            <p className="motion-stagger-item text-text-muted text-lg max-w-xl leading-relaxed mb-10">
              {t.home.hero.description}
            </p>

            <div className="motion-stagger-item flex flex-wrap gap-3">
              <a href="#psa-protector" className="btn btn-secondary group">
                <Shield className="w-4 h-4 text-accent-brand" />
                <span className="text-accent-brand text-sm uppercase tracking-[0.15em]">{t.business.hero.psaProtectorPill}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-brand group-hover:translate-x-0.5 transition-transform duration-150" />
              </a>
              <a href="#card-trading" className="btn btn-secondary group">
                <TrendingUp className="w-4 h-4 text-accent-link" />
                <span className="text-accent-link text-sm uppercase tracking-[0.15em]">{t.business.hero.cardTradingPill}</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-link group-hover:translate-x-0.5 transition-transform duration-150" />
              </a>
            </div>
          </MotionStagger>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           ① PSA CARD ALUMINUM PROTECTOR
      ══════════════════════════════════════════════════════ */}
      <section
        id="psa-protector"
        ref={psaRef.ref}
        className="scroll-mt-20 py-24 md:py-32 relative overflow-hidden border-t border-border-default"
      >
        <div className="container-custom relative">

          {/* Overline */}
          <Reveal visible={psaRef.visible} dir="up">
            <SectionLabel text={t.business.service01Label} />
          </Reveal>

          {/* Two-column: text + visual */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── LEFT: copy ── */}
            <div>
              <Reveal visible={psaRef.visible} dir="left">
                <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary leading-[1.06] mb-6">
                  {t.business.cardProtector.title}
                </h2>
                <p className="text-text-muted text-base md:text-lg leading-relaxed mb-4 max-w-md">
                  {t.business.cardProtector.description}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-md">
                  {t.business.cardProtector.teaserLine}
                </p>
              </Reveal>

              {/* Technical specifications */}
              <ProtectorTechnicalSpecs
                variant="embedded"
                visible={psaRef.visible}
                animationDelay={100}
                className="mb-8"
              />

              {/* Chips */}
              <Reveal visible={psaRef.visible} dir="left" delay={150}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {t.business.cardProtector.chips.map(s => (
                    <Chip key={s} label={s} />
                  ))}
                </div>
              </Reveal>

              {/* CTAs */}
              <Reveal visible={psaRef.visible} dir="left" delay={200}>
                <div className="flex flex-wrap items-center gap-5">
                  <LocalLink
                    href="/products/psa-protectors"
                    className="btn btn-primary"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {t.home.services.protector.cta}
                  </LocalLink>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT: visual + compat ── */}
            <div className="flex flex-col gap-6">

              {/* ── Product photo — no overlays ── */}
              <Reveal visible={psaRef.visible} dir="right" delay={80}>
                <div className="relative overflow-hidden border border-border-default">
                  <Image
                    src={getImagePath('/images-optimized/describe/sell 3.png')}
                    alt={t.psaProtectorPage.heroImageAlt}
                    width={640}
                    height={640}
                    className="relative z-10 w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </Reveal>

              {/* ── Pricing card ── */}
              <Reveal visible={psaRef.visible} dir="right" delay={160}>
                <div className="panel p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted mb-1">{t.business.cardProtector.startingPrice}</p>
                    <p className="text-text-primary font-display text-2xl font-bold leading-none">
                      {t.business.cardProtector.pricing.single}
                      <span className="text-text-muted text-lg font-normal mx-2">/</span>
                      {t.business.cardProtector.pricing.gradient}
                    </p>
                    <p className="text-text-muted text-[10px] mt-1">
                      {t.business.cardProtector.pricing.singleNote} · {t.business.cardProtector.pricing.gradientNote}
                    </p>
                    <p className="text-text-secondary text-xs mt-1">{t.business.cardProtector.shippingInfo}</p>
                  </div>
                  <ShopNowButton
                    label={t.business.cardProtector.cta}
                    shopOptions={t.shopOptions}
                    whatsappMessage={t.business.cardProtector.whatsappOrder}
                    buttonClassName="btn btn-primary whitespace-nowrap flex-shrink-0"
                  />
                </div>
              </Reveal>

              {/* Compatibility */}
              <Reveal visible={psaRef.visible} dir="right" delay={220}>
                <div className="panel p-0 overflow-hidden">
                  <div className="px-5 py-3 border-b border-border-default bg-surface-raised">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">{t.business.cardProtector.compatibilityHeading}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-accent-success text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">{t.business.cardProtector.fitsLabel}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{t.business.cardProtector.compatibility.fits}</p>
                      </div>
                    </div>
                    <div className="h-px bg-border-default" />
                    <div className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-accent-danger/70 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-accent-danger/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">{t.business.cardProtector.notFitsLabel}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{t.business.cardProtector.compatibility.notFits}</p>
                      </div>
                    </div>
                    <div className="h-px bg-border-default" />
                    <p className="text-accent-brand/60 text-xs italic">{t.business.cardProtector.compatibility.note}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── §1b Product feature pillars ── */}
      <section ref={featRef.ref} className="pb-24 overflow-hidden">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-default border border-border-default">
            {[
              { icon: Shield, ...t.business.cardProtector.pillars[0] },
              { icon: Eye,    ...t.business.cardProtector.pillars[1] },
              { icon: Lock,   ...t.business.cardProtector.pillars[2] },
            ].map(({ icon: Icon, title, description: body }, i) => (
              <Reveal
                key={title}
                visible={featRef.visible}
                dir="up"
                delay={i * 40}
                className="p-8 md:p-10 bg-surface-panel hover:bg-surface-raised transition-colors duration-300"
              >
                <div className="w-10 h-10 border border-accent-brand/30 bg-accent-brand/10 flex items-center justify-center mb-5">
                  <Icon className="w-4 h-4 text-accent-brand" />
                </div>
                <h3 className="font-display text-text-primary font-bold text-lg mb-3">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      {/* <section ref={statsRef.ref} className="border-y border-white/[0.05] bg-[#0b0b10] py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
            {[
              { n: '500+', label: t.business.cardTrading.stats.cardsTraded,  accent: GOLD   },
              { n: '4.9★', label: t.business.cardTrading.stats.avgRating,    accent: GOLD   },
              { n: '127',  label: t.business.cardTrading.stats.repeatClients, accent: VIOLET },
              { n: '5',    label: 'Markets',                                   accent: VIOLET },
            ].map(({ n, label, accent }, i) => (
              <div
                key={label}
                className="text-center py-6 px-4"
                style={{
                  opacity: statsRef.visible ? 1 : 0,
                  transform: statsRef.visible ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s ease ${i * 80}ms`,
                }}
              >
                <div className="font-display text-4xl font-bold leading-none mb-2" style={{ color: accent }}>{n}</div>
                <div className="text-white/40 text-[10px] uppercase tracking-[0.28em]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════
           ② TCG CARD TRADING & BROKERAGE
      ══════════════════════════════════════════════════════ */}
      <section
        id="card-trading"
        ref={tradingRef.ref}
        className="scroll-mt-20 py-24 md:py-32 relative overflow-hidden border-t border-border-default"
      >
        <div className="container-custom relative">

          <Reveal visible={tradingRef.visible} dir="up">
            <SectionLabel text={t.business.cardTrading.badge} variant="link" />
          </Reveal>

          {/* Two-column: visual + copy */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── LEFT: card fan (stacked visually) ── */}
            <div className="order-2 lg:order-1">
              <Reveal visible={tradingRef.visible} dir="left" delay={80}>
                <div className="relative h-72 md:h-96 mb-8">
                  {[
                    { src: CARD_IMAGES[0], r: -16, x: -80, y: 16, sc: 0.82, z: 1 },
                    { src: CARD_IMAGES[1], r: 0,   x: 0,   y: 0,  sc: 1,    z: 3 },
                    { src: CARD_IMAGES[2], r: 16,  x: 80,  y: 16, sc: 0.82, z: 2 },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-32 md:w-40 h-44 md:h-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-border-default bg-surface-panel"
                      style={{
                        transform: `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px)) rotate(${c.r}deg) scale(${c.sc})`,
                        zIndex: c.z,
                        transition: 'transform 0.6s ease',
                      }}
                    >
                      <Image src={getImagePath(c.src)} alt="Graded trading card" fill className="object-cover" sizes="160px" />
                    </div>
                  ))}

                  <div className="absolute top-2 right-4 md:right-12 panel px-4 py-3 text-center">
                    <div className="text-accent-link text-2xl font-bold font-display leading-none font-tabular">0%</div>
                    <div className="text-text-muted text-[9px] uppercase tracking-wider mt-1">Listing Fee</div>
                  </div>
                  <div className="absolute bottom-4 left-4 md:left-10 panel px-4 py-3">
                    <div className="flex items-center gap-0.5 text-accent-brand justify-center">
                      {[0,1,2,3,4].map(n => <Star key={n} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                    <div className="text-text-muted text-[9px] uppercase tracking-wider mt-1 text-center">5.0 Rating</div>
                  </div>
                </div>
              </Reveal>

              {/* Feature grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {t.business.cardTrading.featureTitles.map((title, i) => {
                  const Icon = tradingFeatureIcons[i] ?? Package;
                  return (
                  <Reveal
                    key={title}
                    visible={tradingRef.visible}
                    dir="up"
                    delay={200 + i * 40}
                    className="panel p-5 hover:bg-surface-raised transition-[background-color,border-color] duration-300"
                  >
                    <div className="w-8 h-8 border border-accent-link/25 bg-accent-link/10 flex items-center justify-center mb-3">
                      <Icon className="w-3.5 h-3.5 text-accent-link" />
                    </div>
                    <h4 className="text-text-primary font-semibold text-sm mb-1.5">{title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{t.business.cardTrading.features[i]}</p>
                  </Reveal>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: headline + CTAs ── */}
            <div className="order-1 lg:order-2">
              <Reveal visible={tradingRef.visible} dir="right">
                <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary leading-[1.06] mb-6">
                  {t.business.cardTrading.title}
                </h2>
                <p className="text-text-muted text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  {t.business.cardTrading.description}
                </p>
              </Reveal>

              <Reveal visible={tradingRef.visible} dir="right" delay={100}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {t.business.cardTrading.chips.map(c => (
                    <Chip key={c} label={c} variant="link" />
                  ))}
                </div>
              </Reveal>

              <Reveal visible={tradingRef.visible} dir="right" delay={160}>
                <div className="flex flex-wrap items-center gap-5">
                  <LocalLink
                    href="/business/card-trading"
                    className="btn btn-primary"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t.business.cardTrading.cta}
                  </LocalLink>
                  <a
                    href="https://wa.me/85292851189"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                    {t.business.cta.whatsapp}
                  </a>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section ref={ctaRef.ref} className="border-t border-border-default overflow-hidden">
        <div className="grid md:grid-cols-2">

          <Reveal visible={ctaRef.visible} dir="up" className="p-12 md:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-border-default bg-surface-panel">
            <span className="section-label mb-4">{t.business.finalCta.protectorLabel}</span>
              <h3 className="font-display text-4xl font-bold text-text-primary leading-[1.1] mb-4">{t.psaProtectorPage.ctaTitle}</h3>
              <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-xs">{t.psaProtectorPage.ctaSubtitle}</p>
              <LocalLink
                href="/products/psa-protectors"
                className="btn btn-secondary group/btn"
              >
                {t.home.services.protector.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-150" />
              </LocalLink>
          </Reveal>

          <Reveal visible={ctaRef.visible} dir="up" delay={40} className="p-12 md:p-16 lg:p-20 bg-surface-panel">
            <span className="section-label mb-4 text-accent-link before:bg-accent-link">{t.business.finalCta.tradingLabel}</span>
              <h3 className="font-display text-4xl font-bold text-text-primary leading-[1.1] mb-4">{t.business.finalCta.tradingHeading}</h3>
              <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-xs">{t.home.services.trading.subtitle}</p>
              <a
                href="https://wa.me/85292851189"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary group/btn"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                {t.business.cta.whatsapp}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-150" />
              </a>
          </Reveal>

        </div>
      </section>

    </div>
  );
}
