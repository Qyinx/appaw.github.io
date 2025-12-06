'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Sparkles, Sun, Magnet, ChevronRight, Grid3X3, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Eye-catching Design */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-100/50 to-transparent rounded-full" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />

        <div className="relative container-custom py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-blue-500/10 border border-primary-200/50 rounded-full text-primary-700 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Premium Card Protection</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
              
              {/* Main heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-primary-700 via-primary-500 to-slate-500 bg-clip-text text-transparent">
                  {t.home.hero.title}
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-neutral-600 mb-4 leading-relaxed">
                {t.home.hero.subtitle}
              </p>
              
              {/* Description */}
              <p className="text-lg text-neutral-500 mb-10 leading-relaxed">
                {t.home.hero.description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href={t.home.hero.shopUrl} size="lg" className="shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-shadow">
                  {t.home.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button href="/business" variant="outline" size="lg" className="hover:bg-primary-50">
                  {t.home.hero.learnMore}
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 sm:gap-6 mt-12 pt-8 border-t border-neutral-200/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium">UV Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Magnet className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium">N52 Magnets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Sun className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium">Anti-Fade Glass</span>
                </div>
              </div>
            </div>

            {/* Right - Floating Cards Display */}
            <div className="order-1 lg:order-2 relative h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Glow effect behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
              
              {/* Main center card - positioned slightly right */}
              <div className="absolute top-1/2 left-[55%] sm:left-[55%] lg:left-[55%] -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="relative w-40 sm:w-48 lg:w-52 aspect-[3/4] animate-float-slow group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/50 group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={getImagePath('/images/cards/069.SM-P.refine.png')}
                      alt="PSA Card Protector"
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 208px"
                      priority
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              
              {/* Left card - positioned far top-left */}
              <div className="absolute top-[2%] left-[-5%] sm:left-[0%] lg:left-[0%] z-20">
                <div className="relative w-24 sm:w-28 lg:w-32 aspect-[3/4] animate-float-reverse opacity-70 hover:opacity-100 hover:z-40 transition-all cursor-pointer group">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl ring-1 ring-white/30 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={getImagePath('/images/cards/105.SV-9.refine.png')}
                      alt="PSA Card Protector"
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              
              {/* Right card - positioned far bottom-right */}
              <div className="absolute bottom-[2%] right-[-5%] sm:right-[0%] lg:right-[0%] z-20">
                <div className="relative w-24 sm:w-28 lg:w-32 aspect-[3/4] animate-float opacity-70 hover:opacity-100 hover:z-40 transition-all cursor-pointer group" style={{ animationDelay: '1.5s' }}>
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl ring-1 ring-white/30 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={getImagePath('/images/cards/192.SV-P.refine.png')}
                      alt="PSA Card Protector"
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute top-[15%] right-[25%] w-4 h-4 bg-primary-400 rounded-full animate-ping opacity-60" />
              <div className="absolute bottom-[30%] left-[5%] w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-[70%] right-[15%] w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mt-3 mb-4">
              {t.home.features.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.home.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Drop Protection */}
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                {t.home.features.quality.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.home.features.quality.description}
              </p>
            </div>

            {/* Feature 2 - UV Defense */}
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-accent-300 hover:shadow-xl hover:shadow-accent-100/50 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:scale-110 transition-transform duration-300">
                <Sun className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                {t.home.features.trust.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.home.features.trust.description}
              </p>
            </div>

            {/* Feature 3 - Magnetic Closure */}
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-secondary-300 hover:shadow-xl hover:shadow-secondary-100/50 transition-all duration-300">
              <div className="w-14 h-14 mb-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-secondary-500/30 group-hover:scale-110 transition-transform duration-300">
                <Magnet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                {t.home.features.support.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.home.features.support.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Product</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mt-3 mb-6">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {t.business.cardProtector.description}
              </p>
              <ul className="space-y-4 mb-10">
                {t.business.cardProtector.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button href={t.home.hero.shopUrl} className="shadow-lg shadow-primary-500/25">
                {t.business.cardProtector.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-white to-neutral-100 rounded-3xl flex items-center justify-center p-8 border border-neutral-200">
                <div className="relative w-full h-full">
                  <Image
                    src={getImagePath('/images/cards/069.SM-P.refine.png')}
                    alt="PSA Card Aluminum Protector"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              {/* Decorative elements - hidden on mobile to prevent overflow */}
              <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-2xl -z-10" />
              <div className="hidden md:block absolute -bottom-4 -left-4 w-32 h-32 bg-accent-100 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Store Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-3xl flex items-center justify-center p-8 border border-secondary-200">
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {['🎴', '🧸', '🎮', '📦', '⌚', '💎'].map((emoji, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-white rounded-xl shadow-md flex items-center justify-center text-2xl border-2 border-dashed border-secondary-200 hover:border-secondary-400 hover:scale-105 transition-all duration-300"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-secondary-600 font-semibold text-sm uppercase tracking-wider">Rental Space</span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mt-3 mb-6">
                {t.business.consignment.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {t.business.consignment.description}
              </p>
              <ul className="space-y-4 mb-10">
                {t.business.consignment.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button href="https://wa.me/85292851189" variant="secondary" className="shadow-lg shadow-secondary-500/25">
                {t.business.consignment.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container-custom text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {t.home.cta.title}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>
          <Button 
            href={t.home.cta.shopUrl}
            variant="ghost"
            className="bg-white !text-primary-700 hover:bg-neutral-100 shadow-xl font-semibold"
            size="lg"
          >
            {t.home.cta.button}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
