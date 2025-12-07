'use client';

import React from 'react';
import { Store, Check, ArrowRight, Package, Camera, Wallet, Grid3X3 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui';

export default function GridStorePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Dark Theme */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(30deg,_transparent_40%,_rgba(251,191,36,0.03)_40%,_rgba(251,191,36,0.03)_60%,_transparent_60%)] bg-[size:60px_100px]" />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            <Store className="w-4 h-4" />
            <span>{t.gridStorePage.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6">
            {t.business.consignment.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
            {t.business.consignment.description}
          </p>
          <Button 
            href="https://wa.me/85292851189"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0 shadow-xl shadow-amber-500/25"
            size="lg"
          >
            {t.business.consignment.cta}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Grid Display Section */}
      <section className="py-20 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Grid Display */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-xl" />
                
                {/* Main grid container */}
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-amber-500/20">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Grid3X3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{t.gridStorePage.gridHeader}</p>
                        <p className="text-amber-400/80 text-xs">{t.gridStorePage.gridSubheader}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-green-400 text-xs font-medium">● {t.gridStorePage.spacesAvailable}</span>
                    </div>
                  </div>
                  
                  {/* Interactive Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[
                      { emoji: '🎴', status: 'rented' },
                      { emoji: '🧸', status: 'rented' },
                      { emoji: '🎮', status: 'available' },
                      { emoji: '📦', status: 'rented' },
                      { emoji: '⌚', status: 'available' },
                      { emoji: '💎', status: 'rented' },
                      { emoji: '👟', status: 'available' },
                      { emoji: '📱', status: 'rented' },
                      { emoji: '🎨', status: 'available' },
                      { emoji: '📚', status: 'rented' },
                      { emoji: '🎸', status: 'rented' },
                      { emoji: '🏀', status: 'available' },
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
                          {item.status === 'available' ? t.gridStorePage.available : t.gridStorePage.rented}
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
                      <p className="text-xs text-slate-400">{t.gridStorePage.stats.totalGrids}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">12</p>
                      <p className="text-xs text-slate-400">{t.gridStorePage.stats.available}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">HK$</p>
                      <p className="text-xs text-slate-400">{t.gridStorePage.stats.affordable}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
                {t.gridStorePage.whyRentTitle}
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                {t.gridStorePage.whyRentSubtitle}
              </p>
              
              {/* Features */}
              <div className="space-y-3">
                {t.business.consignment.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-200 group-hover:text-white transition-colors font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              <span>{t.gridStorePage.processBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              {t.business.process.title}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t.business.process.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.business.process.steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:border-amber-500/30 hover:bg-slate-900/80 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {step.icon === 'package' && <Package className="w-8 h-8 text-amber-400" />}
                    {step.icon === 'camera' && <Camera className="w-8 h-8 text-amber-400" />}
                    {step.icon === 'store' && <Store className="w-8 h-8 text-amber-400" />}
                    {step.icon === 'wallet' && <Wallet className="w-8 h-8 text-amber-400" />}
                  </div>
                  
                  {/* Step number */}
                  <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/30">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector */}
                {index < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-amber-500/50">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                {t.business.cta.title}
              </h2>
              <p className="text-lg text-white/90 mb-8">
                {t.business.cta.description}
              </p>
              <Button 
                href="https://wa.me/85292851189" 
                className="bg-white !text-amber-600 hover:bg-neutral-100 shadow-xl font-semibold"
                size="lg"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-5 h-5" />
                {t.business.cta.whatsapp}
              </Button>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-36 h-36 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-6xl">🏪</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
