'use client';

import React from 'react';
import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { Award, Heart, Users, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';
import StatsGrid from '@/components/ui/StatsGrid';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

export default function AboutPage() {
  const { t } = useLanguage();
  const heroMounted = useHeroMount();

  const storyReveal = useRevealOnScroll<HTMLElement>();
  const missionReveal = useRevealOnScroll<HTMLElement>();
  const valuesReveal = useRevealOnScroll<HTMLElement>();
  const trustReveal = useRevealOnScroll<HTMLElement>();

  const values = [
    { icon: Award, number: '01', title: t.about.values.quality.title,   description: t.about.values.quality.description,   accent: 'text-accent-link border-accent-link/30 bg-accent-link/10' },
    { icon: Heart, number: '02', title: t.about.values.integrity.title,  description: t.about.values.integrity.description,  accent: 'text-accent-brand border-accent-brand/30 bg-accent-brand/10' },
    { icon: Zap,   number: '03', title: t.about.values.passion.title,    description: t.about.values.passion.description,    accent: 'text-accent-link border-accent-link/30 bg-accent-link/10' },
    { icon: Users, number: '04', title: t.about.values.service.title,    description: t.about.values.service.description,    accent: 'text-accent-link border-accent-link/30 bg-accent-link/10' },
  ];

  return (
    <div className="flex flex-col bg-surface-bg">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-surface-bg pt-20 border-b border-border-default page-blueprint">
        <div className="container-custom py-24">
          <MotionStagger visible={heroMounted} className="max-w-3xl">
            <p className="section-label mb-8 motion-stagger-item">Our Story</p>
            <h1 className="motion-stagger-item text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-text-primary mb-6">
              {t.about.title}
            </h1>
            <div className="motion-stagger-item w-12 h-px bg-accent-brand mb-7" aria-hidden="true" />
            <p className="motion-stagger-item text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl">
              {t.about.subtitle}
            </p>
          </MotionStagger>
        </div>
      </section>

      {/* STORY */}
      <section ref={storyReveal.ref} className="section-padding border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal visible={storyReveal.visible} dir="left">
              <p className="section-label mb-5">Who We Are</p>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-6">
                {t.about.story.title}
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                {t.about.story.content}
              </p>

              <div className="flex items-center gap-3 mb-10 pt-5 border-t border-border-default">
                <div className="w-9 h-9 border border-accent-brand/30 bg-accent-brand/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-brand text-sm font-black">{t.about.story.founderName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t.about.story.founderName}</p>
                  <p className="text-text-muted text-xs">{t.about.story.founderRole}</p>
                </div>
              </div>

              <LocalLink
                href="/business"
                className="inline-flex items-center gap-2 text-accent-brand font-semibold text-sm group"
              >
                <span>See Our Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
              </LocalLink>
            </Reveal>

            <Reveal visible={storyReveal.visible} dir="right" delay={80}>
              <div className="panel p-8 max-w-sm mx-auto">
                <div className="relative aspect-square border border-border-default bg-surface-raised mb-5 flex items-center justify-center">
                  <Image
                    src={getImagePath('/images/logo.png')}
                    alt="Appaw Store"
                    width={160}
                    height={160}
                    className="mx-auto"
                  />
                </div>
                <div className="text-center border-t border-border-default pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Established</p>
                  <p className="text-text-primary text-sm font-semibold mt-1">Appaw Store · Hong Kong</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section ref={missionReveal.ref} className="section-padding bg-surface-panel border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <Reveal visible={missionReveal.visible} dir="up" className="max-w-3xl mx-auto text-center">
            <p className="section-label mb-10 justify-center">Our Mission</p>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-8">
              {t.about.mission.title}
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t.about.mission.content}
            </p>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section ref={valuesReveal.ref} className="section-padding border-b border-border-default overflow-hidden">
        <div className="container-custom">
          <Reveal visible={valuesReveal.visible} dir="up" className="max-w-xl mb-16">
            <p className="section-label mb-5">What Drives Us</p>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1]">
              {t.about.values.title}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-default border border-border-default">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal
                  key={value.number}
                  visible={valuesReveal.visible}
                  dir="up"
                  delay={(i + 1) * 40}
                  className="group bg-surface-panel p-10 relative overflow-hidden hover:border-accent-brand border border-transparent"
                >
                  <span className="absolute -top-6 -right-2 text-[7rem] font-bold text-surface-raised select-none leading-none group-hover:text-accent-brand/5 transition-colors duration-500">
                    {value.number}
                  </span>

                  <div className={`w-14 h-14 border flex items-center justify-center mb-8 relative ${value.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-3 relative">
                    {value.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed relative">
                    {value.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section ref={trustReveal.ref} className="section-padding bg-surface-panel overflow-hidden">
        <div className="container-custom">
          <Reveal visible={trustReveal.visible} dir="up" className="max-w-2xl mx-auto text-center mb-20">
            <p className="section-label mb-10 justify-center">By The Numbers</p>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-[1.1] mb-6">
              {t.about.trust.title}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              {t.about.trust.description}
            </p>
          </Reveal>

          <StatsGrid
            isVisible={trustReveal.visible}
            theme="dark"
            stats={[
              { value: 1200, suffix: '+', label: t.about.trust.stats.cardsProtected, sub: t.about.trust.stats.andCounting      },
              { value: 100, suffix: '+', label: t.about.trust.stats.happyCustomers,  sub: t.about.trust.stats.worldwide         },
              { value: 99,  suffix: '%', label: t.about.trust.stats.satisfaction,    sub: t.about.trust.stats.customerVerified  },
              { value: 1,   suffix: '+', label: t.about.trust.stats.yearsOfCraft,    sub: t.about.trust.stats.ofExcellence      },
            ]}
          />
        </div>
      </section>

    </div>
  );
}
