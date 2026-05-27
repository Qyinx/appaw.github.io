import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://appaw.store';

  // Read card data to generate per-card URLs
  // Only include unsold cards — sold cards are low-value for crawlers
  let cardEntries: MetadataRoute.Sitemap = [];
  let latestCardDate: Date = new Date();
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const cards: { id: string; sold?: boolean; updatedAt?: string; createdAt?: string; image?: string; name?: string; set?: string }[] = JSON.parse(raw);

    const activeCards = cards.filter(c => !c.sold);
    const soldCards   = cards.filter(c =>  c.sold);

    // Active listings — high crawl priority
    const activeEntries: MetadataRoute.Sitemap = activeCards.map(card => {
      const entry: any = {
        url: `${baseUrl}/business/card-trading/${card.id}/`,
        lastModified: card.updatedAt
          ? new Date(card.updatedAt)
          : card.createdAt
            ? new Date(card.createdAt)
            : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
      if (card.image) {
        // Include image metadata to improve image discovery in search
        entry.images = [
          {
            url: `${baseUrl}${card.image}`,
            title: card.name,
            caption: card.set,
          },
        ];
      }
      return entry;
    });

    // Sold listings — kept for "sold price" / market value search intent
    // Lower priority & frequency since content rarely changes after sale
    const soldEntries: MetadataRoute.Sitemap = soldCards.map(card => {
      const entry: any = {
        url: `${baseUrl}/business/card-trading/${card.id}/`,
        lastModified: card.updatedAt
          ? new Date(card.updatedAt)
          : card.createdAt
            ? new Date(card.createdAt)
            : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      };
      if (card.image) {
        entry.images = [
          { url: `${baseUrl}${card.image}`, title: card.name, caption: card.set },
        ];
      }
      return entry;
    });

    cardEntries = [...activeEntries, ...soldEntries];

    // Derive the index page's lastModified from the most recently changed active card
    const dates = activeCards
      .map(c => new Date(c.updatedAt ?? c.createdAt ?? 0).getTime())
      .filter(Boolean);
    if (dates.length) latestCardDate = new Date(Math.max(...dates));
  } catch {
    // If JSON can't be read, skip card entries
  }

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/products/psa-protectors/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tools/card-centering/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/business/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // NOTE: `/business/card-trading/` and individual listings are intentionally excluded
    // from the public sitemap to keep marketplace listings hidden from indexing.
    // privacy — low crawl value, kept for completeness but de-prioritised
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
