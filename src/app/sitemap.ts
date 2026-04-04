import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://appaw.store';

  // Read card data to generate per-card URLs
  let cardEntries: MetadataRoute.Sitemap = [];
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const cards: { id: string }[] = JSON.parse(raw);
    cardEntries = cards.map(card => ({
      url: `${baseUrl}/business/card-trading/${card.id}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
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
      url: `${baseUrl}/products/psa-protectors/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/business/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/business/card-trading/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...cardEntries,
  ];
}
