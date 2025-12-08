'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Star, Search, Filter, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui';
import { getImagePath } from '@/lib/utils';

export default function GradedCardsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real data later
  const cards = [
    {
      id: 1,
      name: 'Pikachu VMAX',
      set: 'Vivid Voltage',
      number: '188/185',
      grade: 'PSA 10',
      price: 'HK$ 2,500',
      image: '/images/cards/069.SM-P.refine.png',
      rarity: 'Secret Rare'
    },
    // Add more cards as needed
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        
        <div className="relative container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>{t.gradedCards?.badge || 'Premium Collection'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 mb-6">
              {t.gradedCards?.title || 'Graded Cards Collection'}
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              {t.gradedCards?.subtitle || 'Browse our curated selection of professionally graded Pokémon cards'}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white border-y border-neutral-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={t.gradedCards?.searchPlaceholder || 'Search cards...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-6 py-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="font-medium">{t.gradedCards?.filter || 'Filter'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                  <Image
                    src={getImagePath(card.image)}
                    alt={card.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Grade Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    {card.grade}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {card.set} #{card.number}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                    <span className="text-lg font-bold text-primary-600">{card.price}</span>
                    <Button href="#" size="sm" className="text-xs">
                      {t.gradedCards?.viewDetails || 'Details'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          {cards.length === 1 && (
            <div className="text-center mt-12 p-8 bg-primary-50 rounded-2xl border border-primary-200">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {t.gradedCards?.comingSoon || 'More Cards Coming Soon!'}
              </h3>
              <p className="text-neutral-600">
                {t.gradedCards?.comingSoonDesc || 'We\'re constantly updating our collection. Check back soon for new additions.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
