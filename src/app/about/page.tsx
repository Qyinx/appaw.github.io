'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Heart, Users, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Award,
      title: t.about.values.quality.title,
      description: t.about.values.quality.description,
      color: 'primary',
    },
    {
      icon: Heart,
      title: t.about.values.integrity.title,
      description: t.about.values.integrity.description,
      color: 'secondary',
    },
    {
      icon: Zap,
      title: t.about.values.passion.title,
      description: t.about.values.passion.description,
      color: 'accent',
    },
    {
      icon: Users,
      title: t.about.values.service.title,
      description: t.about.values.service.description,
      color: 'primary',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      primary: { bg: 'bg-primary-100', text: 'text-primary-600' },
      secondary: { bg: 'bg-secondary-100', text: 'text-secondary-600' },
      accent: { bg: 'bg-accent-100', text: 'text-accent-600' },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-white to-primary-50" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        
        <div className="relative container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 mb-6">
            {t.about.title}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-6">
                {t.about.story.title}
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {t.about.story.content}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Image
                    src={getImagePath('/images/logo.png')}
                    alt="Appaw Store Logo"
                    width={160}
                    height={160}
                    className="mx-auto mb-4"
                  />
                  <span className="text-2xl font-display font-bold gradient-text">Appaw Store</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-2xl -z-10 transform rotate-12" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-200 rounded-2xl -z-10 transform -rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-8">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-6">
              {t.about.mission.title}
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t.about.mission.content}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.about.values.title}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colors = getColorClasses(value.color);
              
              return (
                <Card key={index} className="text-center">
                  <CardContent>
                    <div className={`w-16 h-16 mx-auto mb-4 ${colors.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team/Trust Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            {t.about.trust.title}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            {t.about.trust.description}
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/70">{t.about.trust.stats.cardsProtected}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/70">{t.about.trust.stats.happyCustomers}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/70">{t.about.trust.stats.satisfaction}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
