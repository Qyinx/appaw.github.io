'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Star, HeadphonesIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
        
        {/* Floating product images */}
        <div className="absolute top-1/4 right-[10%] hidden lg:block">
          <div className="w-40 h-52 transform rotate-6 animate-float relative drop-shadow-2xl">
            <Image
              src={getImagePath('/images/cards/069.SM-P.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-[20%] hidden lg:block">
          <div className="w-36 h-48 transform -rotate-6 animate-float relative drop-shadow-xl" style={{ animationDelay: '1s' }}>
            <Image
              src={getImagePath('/images/cards/105.SV-9.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="144px"
            />
          </div>
        </div>
        <div className="absolute top-1/2 right-[5%] hidden xl:block">
          <div className="w-32 h-44 transform rotate-12 animate-float relative drop-shadow-lg" style={{ animationDelay: '2s' }}>
            <Image
              src={getImagePath('/images/cards/192.SV-P.refine.png')}
              alt="PSA Card Protector"
              fill
              className="object-contain"
              sizes="128px"
            />
          </div>
        </div>

        <div className="relative container-custom py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Card Protection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-neutral-900 leading-tight mb-6">
              {t.home.hero.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-4">
              {t.home.hero.subtitle}
            </p>
            
            <p className="text-lg text-neutral-500 mb-8 max-w-2xl">
              {t.home.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={t.home.hero.shopUrl} size="lg">
                {t.home.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button href="/about" variant="outline" size="lg">
                {t.home.hero.learnMore}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.home.features.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {t.home.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Quality */}
            <Card className="text-center">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                  {t.home.features.quality.title}
                </h3>
                <p className="text-neutral-600">
                  {t.home.features.quality.description}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Trust */}
            <Card className="text-center">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-secondary-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                  {t.home.features.trust.title}
                </h3>
                <p className="text-neutral-600">
                  {t.home.features.trust.description}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Support */}
            <Card className="text-center">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 bg-accent-100 rounded-2xl flex items-center justify-center">
                  <HeadphonesIcon className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                  {t.home.features.support.title}
                </h3>
                <p className="text-neutral-600">
                  {t.home.features.support.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-6">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                {t.business.cardProtector.description}
              </p>
              <ul className="space-y-3 mb-8">
                {t.business.cardProtector.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-sm">✓</span>
                    </div>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button href="/business">
                {t.business.cardProtector.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center">
                <div className="w-48 h-64 bg-white rounded-xl shadow-2xl flex items-center justify-center transform rotate-3">
                  <div className="w-44 h-60 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">🛡️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consignment Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-28 h-36 bg-white rounded-lg shadow-xl flex items-center justify-center transform -rotate-6">
                    <span className="text-4xl">🏪</span>
                  </div>
                  <div className="w-28 h-36 bg-white rounded-lg shadow-xl flex items-center justify-center transform rotate-6 mt-8">
                    <span className="text-4xl">💎</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-6">
                {t.business.consignment.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                {t.business.consignment.description}
              </p>
              <ul className="space-y-3 mb-8">
                {t.business.consignment.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-secondary-600 text-sm">✓</span>
                    </div>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button href="/business" variant="secondary">
                {t.business.consignment.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {t.home.cta.title}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>
          <Button 
            href={t.home.cta.shopUrl}
            variant="ghost"
            className="bg-white !text-primary-600 hover:bg-neutral-100 shadow-xl font-semibold"
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
