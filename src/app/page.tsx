'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Sparkles, Sun, Magnet, ChevronRight, Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Modern & Clean */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Floating product images */}
        <div className="absolute top-1/4 right-[8%] hidden lg:block z-10">
          <div className="w-44 h-56 relative drop-shadow-2xl hover:scale-105 transition-transform duration-300 will-change-transform [transform:rotate(3deg)_translate3d(0,0,0)] animate-float">
            <Image
              src={getImagePath('/images/cards/069.SM-P.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 176px, 220px"
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>
        <div className="absolute bottom-1/4 right-[18%] hidden lg:block z-10">
          <div className="w-40 h-52 relative drop-shadow-xl hover:scale-105 transition-transform duration-300 will-change-transform [transform:rotate(-6deg)_translate3d(0,0,0)] animate-float [animation-delay:1s]">
            <Image
              src={getImagePath('/images/cards/105.SV-9.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 160px, 200px"
              quality={100}
              unoptimized
            />
          </div>
        </div>
        <div className="absolute top-[55%] right-[3%] hidden xl:block z-10">
          <div className="w-36 h-48 relative drop-shadow-lg hover:scale-105 transition-transform duration-300 will-change-transform [transform:rotate(12deg)_translate3d(0,0,0)] animate-float [animation-delay:2s]">
            <Image
              src={getImagePath('/images/cards/192.SV-P.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 144px, 180px"
              quality={100}
              unoptimized
            />
          </div>
        </div>

        <div className="relative container-custom py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-200 rounded-full text-primary-700 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Premium Card Protection</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-6 tracking-tight bg-gradient-to-r from-primary-600 via-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {t.home.hero.title}
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
              <Button href={t.home.hero.shopUrl} size="lg" className="shadow-lg shadow-primary-500/25">
                {t.home.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button href="/business" variant="outline" size="lg">
                {t.home.hero.learnMore}
                <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-neutral-600">UV Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Magnet className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-neutral-600">N52 Magnets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm text-neutral-600">Anti-Fade Glass</span>
              </div>
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
      <section className="py-24 bg-neutral-50">
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
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-100 rounded-2xl -z-10" />
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
