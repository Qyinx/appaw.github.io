'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Store, ArrowRight, Sparkles } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function BusinessPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
        
        <div className="relative container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-amber-100 rounded-full text-neutral-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Two Ways to Work With Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 mb-6">
            {t.business.title}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
            {t.business.subtitle}
          </p>
        </div>
      </section>

      {/* Business Cards Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* PSA Card Protector Card */}
            <Link href="/business/psa-protector" className="group">
              <div className="relative h-full bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-8 border border-primary-200/50 hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-300/40 transition-colors" />
                
                <div className="relative">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full text-primary-700 text-xs font-medium mb-6">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Premium Protection</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 mb-4 group-hover:text-primary-700 transition-colors">
                    {t.business.cardProtector.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    {t.business.cardProtector.description}
                  </p>
                  
                  {/* Features preview */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-neutral-600">Aluminum Alloy</span>
                    <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-neutral-600">UV-Blocking Glass</span>
                    <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-neutral-600">N52 Magnets</span>
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative h-48 mb-6 flex items-center justify-center">
                    <div className="relative w-40 h-full">
                      <Image
                        src={getImagePath('/images/cards/069.SM-P.refine.png')}
                        alt="PSA Card Protector"
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        sizes="160px"
                      />
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Grid Store Card */}
            <Link href="/business/grid-store" className="group">
              <div className="relative h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium mb-6">
                    <Store className="w-3.5 h-3.5" />
                    <span>Rental Space</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-4 group-hover:text-amber-400 transition-colors">
                    {t.business.consignment.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {t.business.consignment.description}
                  </p>
                  
                  {/* Features preview */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">Prime Location</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">Flexible Rental</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">We Handle Sales</span>
                  </div>
                  
                  {/* Grid Preview */}
                  <div className="relative h-48 mb-6">
                    <div className="grid grid-cols-4 gap-2 h-full">
                      {[
                        { emoji: '🎴', available: false },
                        { emoji: '🧸', available: true },
                        { emoji: '🎮', available: false },
                        { emoji: '💎', available: true },
                        { emoji: '⌚', available: false },
                        { emoji: '📦', available: true },
                        { emoji: '👟', available: false },
                        { emoji: '📱', available: true },
                      ].map((item, i) => (
                        <div 
                          key={i}
                          className={`
                            rounded-lg flex items-center justify-center text-xl
                            ${item.available 
                              ? 'bg-amber-500/20 border border-dashed border-amber-500/50' 
                              : 'bg-slate-700/50'
                            }
                          `}
                        >
                          <span className={item.available ? '' : 'opacity-50'}>{item.emoji}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center text-amber-400 font-semibold group-hover:text-amber-300">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.business.cta.title}
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              {t.business.cta.description}
            </p>
            <Button 
              href="https://wa.me/85292851189"
              size="lg"
              className="shadow-lg"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-5 h-5" />
              {t.business.cta.whatsapp}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
