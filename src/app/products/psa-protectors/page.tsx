'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Shield, Check, ArrowRight, CheckCircle, XCircle, AlertCircle, Square, Magnet, Sparkles, Hand, ChevronLeft, ChevronRight, Pause, Play, Ruler, Layers, Sun, Weight, Box } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui';
import { getImagePath } from '@/lib/utils';
import RetailPartners from '@/components/RetailPartners';

// Feature icons for the interactive section
const featureIcons = [
  <Square key="frame" className="w-5 h-5" />,      // Frame Material
  <Sparkles key="lens" className="w-5 h-5" />,     // Lens Material
  <Magnet key="closure" className="w-5 h-5" />,    // Closure
  <Shield key="interior" className="w-5 h-5" />,   // Interior
  <Hand key="build" className="w-5 h-5" />,        // Build
];

const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

const CAROUSEL_INTERVAL = 4000;

export default function PSAProtectorPage() {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureImages.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, activeFeature]); // Reset timer when activeFeature changes

  const goToFeature = useCallback((index: number) => {
    setActiveFeature(index);
    setIsPaused(false); // Resume auto-advance after manual selection
  }, []);

  const nextFeature = useCallback(() => {
    setActiveFeature((prev) => (prev + 1) % featureImages.length);
  }, []);

  const prevFeature = useCallback(() => {
    setActiveFeature((prev) => (prev - 1 + featureImages.length) % featureImages.length);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        
        <div className="relative container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>{t.psaProtectorPage.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 mb-6">
                {t.business.cardProtector.title}
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                {t.business.cardProtector.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href={t.business.cardProtector.shopUrl} size="lg" className="shadow-xl shadow-primary-500/30">
                  {t.business.cardProtector.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-[2rem] blur-xl" />
              <div className="relative aspect-square bg-gradient-to-br from-white to-neutral-100 rounded-3xl shadow-2xl p-6 border border-neutral-200/50">
                <Image
                  src={getImagePath('/images/cards/069.SM-P.refine.png')}
                  alt="PSA Card Aluminum Protector"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Carousel Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.psaProtectorPage.featuresTitle}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.psaProtectorPage.featuresSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div>
              <div className="space-y-2">
                {t.business.cardProtector.features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => goToFeature(index)}
                    className={`
                      flex items-start gap-3 p-4 rounded-xl cursor-pointer
                      transition-all duration-300 ease-out
                      ${activeFeature === index 
                        ? 'bg-primary-100 border-l-4 border-primary-500 shadow-sm' 
                        : 'bg-neutral-50 hover:bg-neutral-100 border-l-4 border-transparent'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${activeFeature === index 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-primary-100 text-primary-600'
                      }
                    `}>
                      {featureIcons[index]}
                    </div>
                    <span className={`
                      font-medium transition-colors duration-300 flex-1
                      ${activeFeature === index ? 'text-primary-800' : 'text-neutral-700'}
                    `}>
                      {feature}
                    </span>
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${activeFeature === index 
                        ? 'bg-primary-500' 
                        : 'bg-neutral-200'
                      }
                    `}>
                      <Check className={`w-4 h-4 transition-colors duration-300 ${activeFeature === index ? 'text-white' : 'text-neutral-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Image Carousel */}
            <div className="relative">
              <div className="relative aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">
                {/* Spotlight effect that follows mouse */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float" />
                  <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                </div>
                
                {/* Feature Images with smooth zoom and fade */}
                <div className="relative w-full h-full">
                  {featureImages.map((img, index) => (
                    <div
                      key={`feature-${index}`}
                      className={`
                        absolute inset-0 transition-all duration-[1200ms] ease-out
                        ${activeFeature === index 
                          ? 'opacity-100 scale-100 blur-0 z-10' 
                          : 'opacity-0 scale-110 blur-sm z-0'
                        }
                      `}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={getImagePath(img)}
                          alt={`Feature detail ${index + 1}`}
                          fill
                          className="object-contain drop-shadow-2xl"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Soft glassmorphism overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20 pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-blue-500/10 pointer-events-none z-10" />
                </div>

                {/* Modern Navigation Arrows */}
                <button
                  onClick={prevFeature}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-110 hover:-translate-x-1 z-20 group/btn"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover/btn:text-primary-300 transition-colors" />
                </button>
                <button
                  onClick={nextFeature}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-110 hover:translate-x-1 z-20 group/btn"
                  aria-label="Next feature"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover/btn:text-primary-300 transition-colors" />
                </button>

                {/* Sleek Bottom Controls */}
                <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-20 px-6">
                  {featureImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToFeature(index)}
                      className="group/dot relative flex-1 max-w-16"
                      aria-label={`Go to feature ${index + 1}`}
                    >
                      <div className="relative h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className={`
                          absolute inset-0 bg-gradient-to-r from-primary-400 via-blue-400 to-primary-500 rounded-full transition-all duration-500 origin-left
                          ${activeFeature === index 
                            ? 'scale-x-100 opacity-100' 
                            : 'scale-x-0 opacity-0 group-hover/dot:scale-x-50 group-hover/dot:opacity-50'
                          }
                        `}>
                          {activeFeature === index && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="ml-2 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
                    aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
                  >
                    {isPaused ? (
                      <Play className="w-3.5 h-3.5" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Modern Feature Counter with Progress Ring */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="relative">
                    {/* Progress ring */}
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - (activeFeature + 1) / featureImages.length)}`}
                        className="transition-all duration-500"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Counter */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white text-lg font-bold">{activeFeature + 1}</span>
                      <span className="text-white/50 text-[10px] font-medium">of {featureImages.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
                {t.psaProtectorPage.compatibilityTitle}
              </h2>
              <p className="text-lg text-neutral-600">
                {t.psaProtectorPage.compatibilitySubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.compatible}</h3>
                <p className="text-neutral-600 text-sm">{t.business.cardProtector.compatibility.fits}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.notCompatible}</h3>
                <p className="text-neutral-600 text-sm">{t.business.cardProtector.compatibility.notFits}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.note}</h3>
                <p className="text-neutral-600 text-sm">{t.business.cardProtector.compatibility.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section - Placeholder for future content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
              <Ruler className="w-4 h-4" />
              <span>{t.psaProtectorPage.techBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.psaProtectorPage.techTitle}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t.psaProtectorPage.techSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Size */}
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.specs.size}</h3>
              <p className="text-neutral-700 text-sm font-medium">8.7 × 14.2 × 0.98 cm</p>
              <p className="text-neutral-500 text-xs mt-1">{t.psaProtectorPage.specs.sizeDesc}</p>
            </div>

            {/* Weight */}
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Weight className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.specs.weight}</h3>
              <p className="text-neutral-700 text-sm font-medium">74g</p>
              <p className="text-neutral-500 text-xs mt-1">{t.psaProtectorPage.specs.weightDesc}</p>
            </div>

            {/* Materials */}
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.specs.materials}</h3>
              <p className="text-neutral-700 text-sm font-medium">{t.psaProtectorPage.specs.materialsValue}</p>
              <p className="text-neutral-500 text-xs mt-1">{t.psaProtectorPage.specs.materialsDesc}</p>
            </div>

            {/* UV Protection */}
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{t.psaProtectorPage.specs.uvProtection}</h3>
              <p className="text-neutral-700 text-sm font-medium">&gt;95%</p>
              <p className="text-neutral-500 text-xs mt-1">{t.psaProtectorPage.specs.uvProtectionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Retail Partners Section */}
      <RetailPartners />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container-custom text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {t.psaProtectorPage.ctaTitle}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {t.psaProtectorPage.ctaSubtitle}
          </p>
          <Button 
            href={t.business.cardProtector.shopUrl}
            variant="ghost"
            className="bg-white !text-primary-700 hover:bg-neutral-100 shadow-xl font-semibold"
            size="lg"
          >
            {t.business.cardProtector.cta}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
