'use client';

import dynamic from 'next/dynamic';
import type { GuideEmbed } from '@/lib/guides/types';

const SnkrBuybackPrices = dynamic(() => import('./SnkrBuybackPrices'));
const SnkrBuybackAnnouncements = dynamic(() => import('./SnkrBuybackAnnouncements'));

type GuideEmbedBlockProps = {
  embed: GuideEmbed;
};

export default function GuideEmbedBlock({ embed }: GuideEmbedBlockProps) {
  switch (embed) {
    case 'snkr-buyback-prices':
      return <SnkrBuybackPrices />;
    case 'snkr-buyback-announcements':
      return <SnkrBuybackAnnouncements />;
    default: {
      const exhaustive: never = embed;
      throw new Error(`Unknown guide embed: ${String(exhaustive)}`);
    }
  }
}
