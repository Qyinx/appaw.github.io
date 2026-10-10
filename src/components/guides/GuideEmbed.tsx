'use client';

import dynamic from 'next/dynamic';
import type { GuideEmbed } from '@/lib/guides/types';

const SnkrBuybackBrowse = dynamic(() => import('./SnkrBuybackBrowse'));

type GuideEmbedBlockProps = {
  embed: GuideEmbed;
};

export default function GuideEmbedBlock({ embed }: GuideEmbedBlockProps) {
  switch (embed) {
    case 'snkr-buyback-browse':
      return <SnkrBuybackBrowse />;
    default: {
      const exhaustive: never = embed;
      throw new Error(`Unknown guide embed: ${String(exhaustive)}`);
    }
  }
}
