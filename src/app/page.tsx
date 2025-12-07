'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Sparkles, Sun, Magnet, ChevronRight, ChevronLeft, Grid3X3, Star, Square, Hand, Pause, Play, Store } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

// Feature icons for the product showcase
const featureIcons = [
  <Square key="frame" className="w-5 h-5" />,
  <Sparkles key="lens" className="w-5 h-5" />,
  <Magnet key="closure" className="w-5 h-5" />,
  <Shield key="interior" className="w-5 h-5" />,
  <Hand key="build" className="w-5 h-5" />,
];

const featureImages = [
  '/images/describe/sell 1.png',
  '/images/describe/sell 2.png',
  '/images/describe/sell 3.png',
  '/images/describe/sell 4.png',
  '/images/describe/sell 5.png',
];

const CAROUSEL_INTERVAL = 4000;

export default function HomePage() {
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
  }, [isPaused]);

  const goToFeature = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  const nextFeature = useCallback(() => {
    setActiveFeature((prev) => (prev + 1) % featureImages.length);
  }, []);

  const prevFeature = useCallback(() => {
    setActiveFeature((prev) => (prev - 1 + featureImages.length) % featureImages.length);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Eye-catching Design */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-transparent to-blue-100/30 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
        
        {/* Animated background orbs with more movement */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary-300/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-float [animation-delay:1s]" />
        <div className="absolute top-1/3 right-[20%] w-48 h-48 bg-amber-200/30 rounded-full blur-2xl animate-float [animation-delay:2s]" />
        <div className="absolute bottom-1/3 left-[15%] w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-float [animation-delay:1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-100/50 to-transparent rounded-full animate-pulse" />
        
        {/* Particle dots */}
        <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-primary-400 rounded-full animate-ping" />
        <div className="absolute top-[40%] right-[25%] w-3 h-3 bg-amber-400 rounded-full animate-ping [animation-delay:0.5s]" />
        <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-blue-400 rounded-full animate-ping [animation-delay:1s]" />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-green-400 rounded-full animate-ping [animation-delay:1.5s]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

        <div className="relative container-custom py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Badge with shine effect */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-primary-500/10 border border-primary-200/50 rounded-full text-primary-700 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{t.home.hero.badge}</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 animate-spin [animation-duration:3s]" />
              </div>
              
              {/* Main heading with animated gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05] mb-6 tracking-tight animate-scale-in">
                <span className="bg-gradient-to-r from-primary-700 via-primary-500 via-blue-500 to-primary-700 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shine">
                  {t.home.hero.title}
                </span>
              </h1>
              
              {/* Subtitle with fade in */}
              <p className="text-xl md:text-2xl text-neutral-600 mb-4 leading-relaxed animate-fade-in [animation-delay:0.2s]">
                {t.home.hero.subtitle}
              </p>
              
              {/* Description */}
              <p className="text-lg text-neutral-500 mb-10 leading-relaxed animate-fade-in [animation-delay:0.4s]">
                {t.home.hero.description}
              </p>
              
              {/* CTA Buttons with ripple effect */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:0.6s]">
                <Button href={t.home.hero.shopUrl} size="lg" className="shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300 ripple group">
                  <span className="relative z-10 flex items-center">
                    {t.home.hero.cta}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button href="/business/psa-protector" variant="outline" size="lg" className="hover:bg-primary-50 hover:scale-105 transition-all duration-300 group">
                  {t.home.hero.learnMore}
                  <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Trust indicators with hover effects */}
              <div className="flex items-center gap-4 sm:gap-6 mt-12 pt-8 border-t border-neutral-200/60 flex-wrap animate-fade-in [animation-delay:0.8s]">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-200/50 transition-all duration-300">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium group-hover:text-green-600 transition-colors">{t.home.hero.trustIndicators.uvProtection}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
                    <Magnet className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium group-hover:text-blue-600 transition-colors">{t.home.hero.trustIndicators.n52Magnets}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50 transition-all duration-300">
                    <Sun className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium group-hover:text-amber-600 transition-colors">{t.home.hero.trustIndicators.antiFadeGlass}</span>
                </div>
              </div>
            </div>

            {/* Right - Product Showcase with 3D effect */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center perspective-1000">
              {/* Main product display container */}
              <div className="relative w-full max-w-md mx-auto animate-float-3d">
                {/* Glow effect behind product - pulsating */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-primary-400/40 to-blue-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-primary-300/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                
                {/* 3D-like product frame with animation */}
                <div className="relative group">
                  {/* Background layers for depth - animated */}
                  <div className="absolute inset-4 bg-gradient-to-br from-primary-200 to-blue-200 rounded-3xl transform rotate-6 opacity-60 group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute inset-2 bg-gradient-to-br from-white to-primary-50 rounded-3xl transform rotate-3 shadow-lg opacity-80 group-hover:rotate-6 transition-transform duration-500" />
                  
                  {/* Main product card with border animation */}
                  <div className="relative bg-gradient-to-br from-white via-white to-neutral-50 rounded-3xl shadow-2xl p-6 border-2 border-primary-100 group-hover:border-primary-300 transition-all duration-500 group-hover:shadow-primary-200/50">
                    {/* Animated border gradient on hover */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
                    
                    {/* Product image with glow effect */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
                      <Image
                        src={getImagePath('/images/cards/069.SM-P.refine.png')}
                        alt="PSA Card Aluminum Protector"
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out animate-glow"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority
                        quality={100}
                        unoptimized
                      />
                      
                      {/* Animated shine effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>
                    
                    {/* Product info bar with animation */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">Premium Protection</p>
                        <p className="text-sm font-bold text-neutral-800">PSA Card Protector</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map((star, i) => (
                          <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating feature badges with enhanced animations */}
                <div className="absolute -top-2 -right-2 sm:top-4 sm:-right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-green-500/30 animate-bounce-slow flex items-center gap-1.5 hover:scale-110 transition-transform cursor-pointer">
                  <Shield className="w-3.5 h-3.5" />
                  <span>&gt;95% UV</span>
                </div>
                
                <div className="absolute top-1/3 -left-2 sm:-left-6 bg-gradient-to-r from-blue-500 to-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/30 animate-float flex items-center gap-1.5 hover:scale-110 transition-transform cursor-pointer">
                  <Magnet className="w-3.5 h-3.5" />
                  <span>N52 Magnets</span>
                </div>
                
                <div className="absolute -bottom-2 right-4 sm:bottom-8 sm:-right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-amber-500/30 animate-bounce-slow [animation-delay:0.5s] flex items-center gap-1.5 hover:scale-110 transition-transform cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Anti-Fade</span>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-60" />
                <div className="absolute bottom-1/4 right-0 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-60 [animation-delay:0.7s]" />
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
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-primary-300 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {t.home.features.quality.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t.home.features.quality.description}
                </p>
              </div>
            </div>

            {/* Feature 2 - UV Defense */}
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-accent-300 hover:shadow-2xl hover:shadow-accent-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden md:-translate-y-4">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Sun className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-accent-700 transition-colors">
                  {t.home.features.trust.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t.home.features.trust.description}
                </p>
              </div>
            </div>

            {/* Feature 3 - Magnetic Closure */}
            <div className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-secondary-300 hover:shadow-2xl hover:shadow-secondary-100/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 mb-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-secondary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Magnet className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-secondary-700 transition-colors">
                  {t.home.features.support.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t.home.features.support.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section - Eye-catching Carousel */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container-custom relative">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Our Product</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-neutral-900 mb-4">
              {t.business.cardProtector.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.business.cardProtector.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Feature Carousel */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square bg-gradient-to-br from-white to-neutral-100 rounded-3xl shadow-2xl shadow-neutral-200/50 overflow-hidden border border-neutral-200/50">
                {/* Feature Images with crossfade */}
                {featureImages.map((img, index) => (
                  <div
                    key={`feature-${index}`}
                    className={`
                      absolute inset-0 p-6 transition-all duration-700 ease-in-out
                      ${activeFeature === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}
                    `}
                  >
                    <Image
                      src={getImagePath(img)}
                      alt={`Feature detail ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevFeature}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20 group"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-600 group-hover:text-primary-600 transition-colors" />
                </button>
                <button
                  onClick={nextFeature}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20 group"
                  aria-label="Next feature"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-600 group-hover:text-primary-600 transition-colors" />
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 z-20">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                    style={{ width: `${((activeFeature + 1) / featureImages.length) * 100}%` }}
                  />
                </div>

                {/* Feature counter badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20 flex items-center gap-2">
                  <span>{activeFeature + 1}</span>
                  <span className="text-white/60">/</span>
                  <span className="text-white/60">{featureImages.length}</span>
                </div>

                {/* Play/Pause button */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 transition-all hover:scale-110"
                  aria-label={isPaused ? 'Play' : 'Pause'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-primary-600" /> : <Pause className="w-4 h-4 text-primary-600" />}
                </button>
              </div>
            </div>

            {/* Right - Feature List */}
            <div className="order-1 lg:order-2">
              <div className="space-y-3">
                {t.business.cardProtector.features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => goToFeature(index)}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl cursor-pointer
                      transition-all duration-300 ease-out group
                      ${activeFeature === index 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 scale-[1.02]' 
                        : 'bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-primary-200 hover:shadow-md'
                      }
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${activeFeature === index 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
                      }
                    `}>
                      {featureIcons[index]}
                    </div>
                    <span className={`
                      font-medium transition-colors duration-300 flex-1 text-sm leading-snug
                      ${activeFeature === index ? 'text-white' : 'text-neutral-700'}
                    `}>
                      {feature}
                    </span>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${activeFeature === index 
                        ? 'bg-white/20' 
                        : 'bg-neutral-100 group-hover:bg-primary-100'
                      }
                    `}>
                      <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                        activeFeature === index 
                          ? 'text-white translate-x-0.5' 
                          : 'text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {featureImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeature(index)}
                    className={`
                      h-2 rounded-full transition-all duration-300
                      ${activeFeature === index 
                        ? 'w-8 bg-primary-500' 
                        : 'w-2 bg-neutral-300 hover:bg-primary-300'
                      }
                    `}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-10 text-center lg:text-left">
                <Button href={t.home.hero.shopUrl} size="lg" className="shadow-xl shadow-primary-500/30">
                  {t.business.cardProtector.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Store Section - Distinct Warm/Dark Theme */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern - hexagon style */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(30deg,_transparent_40%,_rgba(251,191,36,0.03)_40%,_rgba(251,191,36,0.03)_60%,_transparent_60%)] bg-[size:60px_100px]" />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Interactive Grid Display */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-xl" />
                
                {/* Main grid container */}
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-500/20">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Grid3X3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Grid Store</p>
                        <p className="text-amber-400/80 text-xs">格仔鋪</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-green-400 text-xs font-medium">● Spaces Available</span>
                    </div>
                  </div>
                  
                  {/* Interactive Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[
                      { emoji: '🎴', status: 'rented', label: 'Cards' },
                      { emoji: '🧸', status: 'rented', label: 'Toys' },
                      { emoji: '🎮', status: 'available', label: 'Games' },
                      { emoji: '📦', status: 'rented', label: 'Misc' },
                      { emoji: '⌚', status: 'available', label: 'Watch' },
                      { emoji: '💎', status: 'rented', label: 'Jewelry' },
                      { emoji: '👟', status: 'available', label: 'Shoes' },
                      { emoji: '📱', status: 'rented', label: 'Tech' },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className={`
                          aspect-square rounded-xl flex flex-col items-center justify-center gap-1 
                          transition-all duration-300 cursor-pointer group relative overflow-hidden
                          ${item.status === 'available' 
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-dashed border-amber-500/50 hover:border-amber-400 hover:scale-105' 
                            : 'bg-slate-700/50 border border-slate-600/50'
                          }
                        `}
                      >
                        <span className={`text-2xl transition-transform duration-300 ${item.status === 'available' ? 'group-hover:scale-125' : 'opacity-60'}`}>
                          {item.emoji}
                        </span>
                        <span className={`text-[10px] ${item.status === 'available' ? 'text-amber-400' : 'text-slate-500'}`}>
                          {item.status === 'available' ? 'Available' : 'Rented'}
                        </span>
                        {item.status === 'available' && (
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats bar */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-400">50+</p>
                      <p className="text-xs text-slate-400">Total Grids</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">12</p>
                      <p className="text-xs text-slate-400">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">HK$</p>
                      <p className="text-xs text-slate-400">Affordable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                <span>Rental Space</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
                {t.business.consignment.title}
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {t.business.consignment.description}
              </p>
              
              {/* Features with different style */}
              <div className="space-y-4 mb-10">
                {t.business.consignment.features.slice(0, 4).map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-200 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                href="https://wa.me/85292851189" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0 shadow-xl shadow-amber-500/25"
                size="lg"
              >
                {t.business.consignment.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
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
