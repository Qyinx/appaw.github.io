'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield, ArrowRight, ArrowUpRight, CheckCircle, XCircle,
  Eye, Lock, Zap, MapPin, CreditCard, MessageCircle,
  Star, ChevronDown, Package, TrendingUp, Users,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import ShopNowButton from '@/components/ui/ShopNowButton';

/* ─── Reveal hook ─── */
function useReveal(threshold = 0.06) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Fade-in wrapper ─── */
function Reveal({
  children,
  delay = 0,
  dir = 'up',
  visible,
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: 'up' | 'left' | 'right' | 'none';
  visible: boolean;
}) {
  const translateMap = { up: 'translateY(36px)', left: 'translateX(-36px)', right: 'translateX(36px)', none: 'none' };
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translateMap[dir],
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ text, color = '#D4899A' }: { text: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-px" style={{ background: color }} />
      <span className="text-[11px] uppercase tracking-[0.35em] font-medium" style={{ color }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Spec chip ─── */
function Chip({ label, color = '#D4899A' }: { label: string; color?: string }) {
  return (
    <span
      className="px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] border"
      style={{ borderColor: `${color}28`, color: `${color}88` }}
    >
      {label}
    </span>
  );
}

/* ─── Step ─── */
function Step({
  n, title, body, accent, visible, delay = 0, last = false,
}: {
  n: string; title: string; body: string; accent: string;
  visible: boolean; delay?: number; last?: boolean;
}) {
  return (
    <Reveal visible={visible} delay={delay} dir="up">
      <div className="flex gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border"
            style={{ borderColor: `${accent}50`, background: `${accent}12`, color: accent }}
          >
            {n}
          </div>
          {!last && <div className="w-px flex-1 min-h-10 mt-1" style={{ background: `${accent}20` }} />}
        </div>
        <div className={last ? '' : 'pb-10'}>
          <h4 className="text-white font-semibold text-[15px] mb-2">{title}</h4>
          <p className="text-[#9ca3af] text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function BusinessClient() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef    = useReveal();
  const psaRef     = useReveal();
  const featRef    = useReveal();
  const compatRef  = useReveal();
  const statsRef   = useReveal();
  const tradingRef = useReveal();
  const buyRef     = useReveal();
  const sellRef    = useReveal();
  const faqRef     = useReveal();
  const ctaRef     = useReveal();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const GOLD   = '#D4899A';
  const VIOLET = '#818cf8';

  /* ── PSA specs ── */
  const psaSpecs = [
    { label: 'Frame',    value: 'Precision-cut Aluminum Alloy' },
    { label: 'Lens',     value: 'UV-Blocking Glass (>95% UV blocked)' },
    { label: 'Closure',  value: 'N52 Neodymium Magnets — no screws' },
    { label: 'Interior', value: 'Precision fit · soft buffer zone' },
    { label: 'Size',     value: '8.7 × 14.2 × 0.98 cm' },
    { label: 'Weight',   value: '74 g' },
  ];

  /* ── Trading features ── */
  const tradingFeatures = [
    { icon: Package,    title: 'Buy & Sell',          accent: VIOLET },
    { icon: TrendingUp, title: 'Price Appraisal',     accent: VIOLET },
    { icon: Users,      title: 'Consignment',         accent: VIOLET },
    { icon: Shield,     title: 'Authenticity Check',  accent: VIOLET },
  ];

  const CARD_IMAGES = [
    '/images/cards/192.SV-P.refine.png',
    '/images/cards/105.SV-9.refine.png',
    '/images/cards/069.SM-P.refine.png',
  ];

  return (
    <div className="flex flex-col bg-[#1e1e2e]">

      {/* ══════════════════════════════════════════════════════
           HERO
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef.ref}
        className="relative min-h-[70dvh] flex items-center overflow-hidden"
      >
        {/* background layers */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.013)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.013)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,137,154,0.09),transparent)]" />
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/40 to-transparent" />
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-[15%] w-[480px] h-[480px] rounded-full bg-[rgba(212,137,154,0.06)] blur-[100px] pointer-events-none animate-[orb-drift-a_14s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[15%] w-[360px] h-[360px] rounded-full bg-[rgba(129,140,248,0.04)] blur-[80px] pointer-events-none animate-[orb-drift-b_18s_ease-in-out_2s_infinite]" />
        {/* Scanning light */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent animate-[scan-line_7s_linear_3s_infinite]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1e1e2e] to-transparent" />

        <div className="container-custom relative z-10 py-24 md:py-32">
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(28px)',
              transition: 'opacity 1s ease 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 border border-[#D4899A]/35 rounded-full px-5 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4899A] animate-pulse" />
              <span className="text-[#D4899A] text-[11px] uppercase tracking-[0.3em]">{t.business.subtitle}</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.06] tracking-tight mb-6 max-w-3xl">
              Protect.<br />
              <span className="text-[#D4899A]">Collect.</span>{' '}
              <span className="text-[#818cf8]">Trade.</span>
            </h1>

            <p className="text-[#6b7280] text-lg max-w-xl leading-relaxed mb-10">
              {t.home.hero.description}
            </p>

            {/* Service pills */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#psa-protector"
                className="group inline-flex items-center gap-3 border border-[#D4899A]/40 hover:border-[#D4899A] bg-[#D4899A]/5 hover:bg-[#D4899A]/10 px-6 py-3 transition-all duration-300"
              >
                <Shield className="w-4 h-4 text-[#D4899A]" />
                <span className="text-[#D4899A] text-sm font-semibold uppercase tracking-[0.15em]">PSA Protector</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4899A] group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#card-trading"
                className="group inline-flex items-center gap-3 border border-[#818cf8]/40 hover:border-[#818cf8] bg-[#818cf8]/5 hover:bg-[#818cf8]/10 px-6 py-3 transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4 text-[#818cf8]" />
                <span className="text-[#818cf8] text-sm font-semibold uppercase tracking-[0.15em]">Card Trading</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#818cf8] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           ① PSA CARD ALUMINUM PROTECTOR
      ══════════════════════════════════════════════════════ */}
      <section
        id="psa-protector"
        ref={psaRef.ref}
        className="scroll-mt-20 py-24 md:py-32 relative overflow-hidden border-t border-white/[0.05]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,rgba(212,137,154,0.04),transparent)]" />
        <div className="container-custom relative">

          {/* Overline */}
          <Reveal visible={psaRef.visible} dir="up">
            <SectionLabel text="Service 01 — Protection" color={GOLD} />
          </Reveal>

          {/* Two-column: text + visual */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── LEFT: copy ── */}
            <div>
              <Reveal visible={psaRef.visible} dir="left">
                <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.06] mb-6">
                  PSA Card<br />
                  <em className="not-italic text-[#D4899A]">Aluminum</em><br />
                  Protector
                </h2>
                <p className="text-[#6b7280] text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  {t.business.cardProtector.description}
                </p>
              </Reveal>

              {/* Spec table */}
              <Reveal visible={psaRef.visible} dir="left" delay={100}>
                <div className="border border-white/[0.06] mb-8 overflow-hidden">
                  {psaSpecs.map((s, i) => (
                    <div
                      key={s.label}
                      className={`grid grid-cols-[100px_1fr] gap-4 px-5 py-3.5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''} border-b border-white/[0.04] last:border-b-0`}
                    >
                      <span className="text-[#9ca3af] text-xs uppercase tracking-[0.2em]">{s.label}</span>
                      <span className="text-white/70 text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Chips */}
              <Reveal visible={psaRef.visible} dir="left" delay={150}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {['Aluminum Alloy', '>95% UV Glass', 'N52 Magnets', '35PT PSA Fit'].map(s => (
                    <Chip key={s} label={s} color={GOLD} />
                  ))}
                </div>
              </Reveal>

              {/* CTAs */}
              <Reveal visible={psaRef.visible} dir="left" delay={200}>
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/products/psa-protectors"
                    className="inline-flex items-center gap-3 bg-[#D4899A] hover:bg-[#E8A3B2] text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,137,154,0.3)] active:scale-95"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {t.home.services.protector.cta}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT: visual + compat ── */}
            <div className="flex flex-col gap-6">

              {/* ── Product photo — no overlays ── */}
              <Reveal visible={psaRef.visible} dir="right" delay={80}>
                <div className="relative overflow-hidden rounded-sm">
                  {/* Subtle gold glow behind image */}
                  <div className="absolute -inset-8 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(212,137,154,0.12),transparent)] pointer-events-none z-0" />
                  <Image
                    src={getImagePath('/images-optimized/describe/sell 3.png')}
                    alt="PSA Card Aluminum Protector — aluminum frame holding a PSA graded card slab"
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
                <div className="border border-[#D4899A]/20 bg-[#D4899A]/[0.04] p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-[#D4899A]/50 text-[10px] uppercase tracking-[0.3em] mb-1">{t.business.cardProtector.startingPrice}</p>
                    <p className="text-white font-display text-3xl font-bold leading-none">USD 12.99</p>
                    <p className="text-white/50 text-xs mt-1">{t.business.cardProtector.shippingInfo}</p>
                  </div>
                  <ShopNowButton
                    label={t.business.cardProtector.cta}
                    shopOptions={t.shopOptions}
                    whatsappMessage="Hi! I'm interested in ordering a PSA Card Aluminum Protector."
                    buttonClassName="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm uppercase tracking-[0.15em] px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap shadow-sm flex-shrink-0 active:scale-95"
                  />
                </div>
              </Reveal>

              {/* Compatibility */}
              <Reveal visible={psaRef.visible} dir="right" delay={220}>
                <div className="border border-white/[0.06] overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
                    <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Compatibility</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">Fits</p>
                        <p className="text-white/50 text-sm leading-relaxed">{t.business.cardProtector.compatibility.fits}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.05]" />
                    <div className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-rose-400/70 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-rose-400/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">Does Not Fit</p>
                        <p className="text-white/50 text-sm leading-relaxed">{t.business.cardProtector.compatibility.notFits}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.05]" />
                    <p className="text-[#D4899A]/40 text-xs italic">{t.business.cardProtector.compatibility.note}</p>
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
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.05] border border-white/[0.05]">
            {[
              { icon: Shield, title: t.home.features.quality.title, body: t.home.features.quality.description },
              { icon: Eye,    title: t.home.features.trust.title,   body: t.home.features.trust.description },
              { icon: Lock,   title: t.home.features.support.title, body: t.home.features.support.description },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="p-8 md:p-10 bg-[#1e1e2e] hover:bg-[#161626] transition-colors duration-300"
                style={{
                  opacity: featRef.visible ? 1 : 0,
                  transform: featRef.visible ? 'none' : 'translateY(24px)',
                  transition: `opacity 0.8s ease ${i * 120}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                }}
              >
                <div className="w-10 h-10 rounded-xl border border-[#D4899A]/30 bg-[#D4899A]/10 flex items-center justify-center mb-5">
                  <Icon className="w-4 h-4 text-[#D4899A]" />
                </div>
                <h3 className="font-display text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{body}</p>
              </div>
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
        className="scroll-mt-20 py-24 md:py-32 relative overflow-hidden border-t border-white/[0.05]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_50%,rgba(129,140,248,0.04),transparent)]" />
        <div className="container-custom relative">

          <Reveal visible={tradingRef.visible} dir="up">
            <SectionLabel text={t.business.cardTrading.badge} color={VIOLET} />
          </Reveal>

          {/* Two-column: visual + copy */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── LEFT: card fan (stacked visually) ── */}
            <div className="order-2 lg:order-1">
              <Reveal visible={tradingRef.visible} dir="left" delay={80}>
                <div className="relative h-72 md:h-96 mb-8">
                  {/* Glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-[rgba(129,140,248,0.08)] blur-[80px]" />
                  </div>
                  {/* Cards */}
                  {[
                    { src: CARD_IMAGES[0], r: -16, x: -80, y: 16, sc: 0.82, z: 1 },
                    { src: CARD_IMAGES[1], r: 0,   x: 0,   y: 0,  sc: 1,    z: 3 },
                    { src: CARD_IMAGES[2], r: 16,  x: 80,  y: 16, sc: 0.82, z: 2 },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-32 md:w-40 h-44 md:h-56 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                      style={{
                        transform: `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px)) rotate(${c.r}deg) scale(${c.sc})`,
                        zIndex: c.z,
                        transition: 'transform 0.6s ease',
                      }}
                    >
                      <Image src={getImagePath(c.src)} alt="Graded trading card" fill className="object-cover" sizes="160px" />
                    </div>
                  ))}

                  {/* Floating badges */}
                  <div className="absolute top-2 right-4 md:right-12 border border-[#818cf8]/25 bg-[#0e0e14] px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="text-[#818cf8] text-2xl font-bold font-display leading-none">0%</div>
                    <div className="text-white/45 text-[9px] uppercase tracking-wider mt-1">Listing Fee</div>
                  </div>
                  <div className="absolute bottom-4 left-4 md:left-10 border border-[#D4899A]/20 bg-[#0e0e14] px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-0.5 text-[#D4899A] justify-center">
                      {[0,1,2,3,4].map(n => <Star key={n} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                    <div className="text-white/45 text-[9px] uppercase tracking-wider mt-1 text-center">5.0 Rating</div>
                  </div>
                </div>
              </Reveal>

              {/* Feature grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {tradingFeatures.map(({ icon: Icon, title, accent }, i) => (
                  <div
                    key={title}
                    className="p-5 border border-white/[0.06] hover:border-[#818cf8]/20 hover:bg-[#818cf8]/[0.03] transition-all duration-300"
                    style={{
                      opacity: tradingRef.visible ? 1 : 0,
                      transform: tradingRef.visible ? 'none' : 'translateY(20px)',
                      transition: `opacity 0.8s ease ${200 + i * 100}ms, transform 0.8s ease ${200 + i * 100}ms`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg border border-[#818cf8]/25 bg-[#818cf8]/10 flex items-center justify-center mb-3">
                      <Icon className="w-3.5 h-3.5 text-[#818cf8]" />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5">{title}</h4>
                    <p className="text-[#9ca3af] text-sm leading-relaxed">{t.business.cardTrading.features[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: headline + CTAs ── */}
            <div className="order-1 lg:order-2">
              <Reveal visible={tradingRef.visible} dir="right">
                <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.06] mb-6">
                  {t.business.cardTrading.title}
                </h2>
                <p className="text-[#6b7280] text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  {t.business.cardTrading.description}
                </p>
              </Reveal>

              <Reveal visible={tradingRef.visible} dir="right" delay={100}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {['No Listing Fee', 'PSA & CGC', 'HK Face-to-Face', 'Commission on Sale Only'].map(c => (
                    <Chip key={c} label={c} color={VIOLET} />
                  ))}
                </div>
              </Reveal>

              <Reveal visible={tradingRef.visible} dir="right" delay={160}>
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/business/card-trading"
                    className="inline-flex items-center gap-3 bg-[#818cf8] hover:bg-[#a5b4fc] text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(129,140,248,0.3)] active:scale-95"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t.business.cardTrading.cta}
                  </Link>
                  <a
                    href="https://wa.me/85292851189"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm uppercase tracking-[0.15em] transition-colors"
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
           HOW BUYING WORKS
      ══════════════════════════════════════════════════════ */}
      <section ref={buyRef.ref} className="py-20 border-t border-white/[0.05] bg-[#161626]">
        <div className="container-custom">

          <Reveal visible={buyRef.visible} dir="up">
            <SectionLabel text={t.tradingGuide.badge} color={GOLD} />
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-12 leading-tight">
              {t.tradingGuide.buy.title}
            </h3>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {t.tradingGuide.buy.rules.map((rule, i) => {
              const icons = [MessageCircle, MapPin, CreditCard];
              const Icon = icons[i] ?? MessageCircle;
              const n = String(i + 1).padStart(2, '0');
              return (
                <div
                  key={i}
                  className="relative p-8 border border-white/[0.06] hover:border-[#D4899A]/20 transition-colors duration-300"
                  style={{
                    opacity: buyRef.visible ? 1 : 0,
                    transform: buyRef.visible ? 'none' : 'translateY(28px)',
                    transition: `opacity 0.8s ease ${i * 120}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                  }}
                >
                  <span className="absolute top-5 right-6 font-serif font-black text-5xl text-[#D4899A]/[0.07] select-none">{n}</span>
                  <div className="w-10 h-10 rounded-xl border border-[#D4899A]/30 bg-[#D4899A]/10 flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-[#D4899A]" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{rule.heading}</h4>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{rule.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           HOW SELLING / CONSIGNING WORKS
      ══════════════════════════════════════════════════════ */}
      <section ref={sellRef.ref} className="py-20 border-t border-white/[0.05] bg-[#1e1e2e]">
        <div className="container-custom">

          <Reveal visible={sellRef.visible} dir="up">
            <SectionLabel text={t.tradingGuide.badge} color={VIOLET} />
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {t.tradingGuide.sell.title}
            </h3>
            <p className="text-[#9ca3af] text-base leading-relaxed mb-12 max-w-xl">
              {t.tradingGuide.sell.rules[1].body}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16">

            {/* Steps */}
            <div>
              {t.tradingGuide.sell.rules.map((rule, i) => (
                <Step
                  key={i}
                  n={String(i + 1).padStart(2, '0')}
                  title={rule.heading}
                  body={rule.body}
                  accent={VIOLET}
                  visible={sellRef.visible}
                  delay={i * 80}
                  last={i === t.tradingGuide.sell.rules.length - 1}
                />
              ))}
            </div>

            {/* Rules */}
            <div
              style={{
                opacity: sellRef.visible ? 1 : 0,
                transform: sellRef.visible ? 'none' : 'translateX(32px)',
                transition: 'opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}
            >
              <div className="border border-[#818cf8]/20 bg-[#818cf8]/[0.04] p-7 mb-6">
                <h4 className="text-[#818cf8] text-xs uppercase tracking-[0.25em] font-semibold mb-5">What We Accept</h4>
                <ul className="space-y-3">
                  {t.business.cardTrading.features.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#818cf8]/60 flex-shrink-0 mt-0.5" />
                      <span className="text-white/65 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-white/[0.06] p-7">
                <h4 className="text-white/50 text-xs uppercase tracking-[0.25em] font-semibold mb-5">Payment Rules</h4>
                <ul className="space-y-3">
                  {t.tradingGuide.buy.rules.map(rule => (
                    <li key={rule.heading} className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-[#D4899A]/50 flex-shrink-0 mt-0.5" />
                      <span className="text-white/60 text-sm">{rule.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           FAQ ACCORDION
      ══════════════════════════════════════════════════════ */}
      <section ref={faqRef.ref} className="py-20 border-t border-white/[0.05] bg-[#161626]">
        <div className="container-custom max-w-3xl">
          <Reveal visible={faqRef.visible} dir="up">
            <SectionLabel text={t.psaProtectorPage.faq.badge} color={GOLD} />
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">{t.psaProtectorPage.faq.title}</h3>
          </Reveal>

          <div className="space-y-1">
            {[
              ...t.psaProtectorPage.faq.items.slice(0, 3).map(f => ({ ...f, accent: GOLD })),
              ...t.tradingGuide.buy.faq.items.slice(0, 2).map(f => ({ ...f, accent: VIOLET })),
              ...t.tradingGuide.sell.faq.items.slice(0, 2).map(f => ({ ...f, accent: VIOLET })),
            ].map(({ q, a, accent }, i) => (
              <div
                key={i}
                className="border border-white/[0.05] overflow-hidden"
                style={{
                  opacity: faqRef.visible ? 1 : 0,
                  transform: faqRef.visible ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.7s ease ${i * 60}ms, transform 0.7s ease ${i * 60}ms`,
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white/80 text-sm font-medium leading-snug">{q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{ color: accent, transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[#9ca3af] text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section ref={ctaRef.ref} className="border-t border-white/[0.05] overflow-hidden">
        <div className="grid md:grid-cols-2">

          <div
            className="relative group p-12 md:p-16 lg:p-20 border-b md:border-b-0 md:border-r border-white/[0.05] bg-[#1e1e2e] overflow-hidden"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transform: ctaRef.visible ? 'none' : 'translateY(28px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_10%_90%,rgba(212,137,154,0.06),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-5 left-5 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-[#D4899A]/35" />
            <div className="relative">
              <span className="text-[#D4899A]/30 text-[10px] uppercase tracking-[0.4em] block mb-4">PSA Protector</span>
              <h3 className="font-display text-4xl font-bold text-white leading-[1.1] mb-4">Protect Your<br />Collection</h3>
              <p className="text-white/45 text-base leading-relaxed mb-10 max-w-xs">{t.home.services.protector.subtitle}</p>
              <Link
                href="/products/psa-protectors"
                className="group/btn inline-flex items-center gap-3 border border-[#D4899A]/35 hover:border-[#D4899A] hover:bg-[#D4899A]/5 text-[#D4899A] text-sm uppercase tracking-[0.15em] font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                {t.home.services.protector.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div
            className="relative group p-12 md:p-16 lg:p-20 bg-[#1e1e2e] overflow-hidden"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transform: ctaRef.visible ? 'none' : 'translateY(28px)',
              transition: 'opacity 0.9s ease 0.12s, transform 0.9s ease 0.12s',
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_90%_90%,rgba(129,140,248,0.06),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-5 right-5 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-[#818cf8]/35" />
            <div className="relative">
              <span className="text-[#818cf8]/30 text-[10px] uppercase tracking-[0.4em] block mb-4">Card Trading</span>
              <h3 className="font-display text-4xl font-bold text-white leading-[1.1] mb-4">Start Your<br />Trade Today</h3>
              <p className="text-white/45 text-base leading-relaxed mb-10 max-w-xs">{t.home.services.trading.subtitle}</p>
              <a
                href="https://wa.me/85292851189"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 border border-[#818cf8]/35 hover:border-[#818cf8] hover:bg-[#818cf8]/5 text-[#818cf8] text-sm uppercase tracking-[0.15em] font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
                {t.business.cta.whatsapp}
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4899A]/20 to-transparent" />
      </section>

    </div>
  );
}
