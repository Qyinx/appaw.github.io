'use client';

import React from 'react';
import { Shield, Store, Check, ArrowRight, Package, Camera, Wallet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Card, CardContent } from '@/components/ui';

const stepIcons: Record<string, React.ReactNode> = {
  package: <Package className="w-10 h-10 text-primary-500" />,
  camera: <Camera className="w-10 h-10 text-secondary-500" />,
  store: <Store className="w-10 h-10 text-accent-500" />,
  wallet: <Wallet className="w-10 h-10 text-green-500" />,
};

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 mb-6">
            {t.business.title}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto">
            {t.business.subtitle}
          </p>
        </div>
      </section>

      {/* PSA Card Protector Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Premium Protection</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
                {t.business.cardProtector.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                {t.business.cardProtector.description}
              </p>
              <ul className="space-y-3 mb-6">
                {t.business.cardProtector.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 bg-neutral-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Compatibility Info */}
              <div className="bg-neutral-100 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-neutral-800 mb-3">Compatibility</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">{t.business.cardProtector.compatibility.fits}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">{t.business.cardProtector.compatibility.notFits}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">{t.business.cardProtector.compatibility.note}</span>
                  </div>
                </div>
              </div>
              
              <Button href={t.business.cardProtector.shopUrl}>
                {t.business.cardProtector.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl flex items-center justify-center overflow-hidden p-8">
                {/* Premium aluminum protector illustration */}
                <div className="relative">
                  <div className="w-52 h-72 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg shadow-2xl flex items-center justify-center border-4 border-neutral-500 relative">
                    {/* Glass effect */}
                    <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded" />
                    <div className="w-44 h-60 bg-gradient-to-br from-neutral-900 to-black rounded flex flex-col items-center justify-center p-4 relative">
                      <div className="w-28 h-36 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mb-2 flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🏆</span>
                      </div>
                      <div className="text-white text-sm font-bold tracking-wider">PSA 10</div>
                      <div className="text-white/60 text-xs">GEM MINT</div>
                    </div>
                  </div>
                  {/* Magnetic seal indicator */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    N52 Magnets
                  </div>
                  {/* Shield badge */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-200 rounded-2xl -z-10 transform rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Consignment Store Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center overflow-hidden p-6">
                {/* Grid Store illustration */}
                <div className="relative">
                  <div className="w-64 h-48 bg-white rounded-2xl shadow-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Store className="w-6 h-6 text-secondary-600" />
                      <span className="font-bold text-neutral-800">Grid Store</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['🎴', '🧸', '🎮', '📦', '🃏', '⌚'].map((emoji, i) => (
                        <div key={i} className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded flex items-center justify-center border-2 border-dashed border-neutral-300">
                          <span className="text-xl">{emoji}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Rent a Grid
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                <span>Grid Store</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
                {t.business.consignment.title}
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                {t.business.consignment.description}
              </p>
              <ul className="space-y-3 mb-8">
                {t.business.consignment.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" href="https://wa.me/85292851189">
                {t.business.consignment.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Consignment Works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-neutral-900 mb-4">
              {t.business.process.title}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simple steps to sell your cards through our consignment service
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.business.process.steps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    {stepIcons[step.icon] || <Package className="w-10 h-10 text-neutral-500" />}
                  </div>
                  <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-neutral-300" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Whether you want to protect your collection with our premium aluminum cases or sell your cards through our consignment service, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  href="https://wa.me/85292851189" 
                  variant="ghost"
                  className="bg-white !text-primary-600 hover:bg-neutral-100"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-5 h-5" />
                  WhatsApp Us
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-36 h-36 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-6xl">🤝</span>
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
