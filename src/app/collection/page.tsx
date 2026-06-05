import CollectionLandingClient from './CollectionLandingClient';
import StructuredData from '@/components/StructuredData';
import { webApplicationJsonLd, breadcrumbJsonLd, howToJsonLd } from '@/lib/seo';
import { collectionMetadata } from '@/lib/seo/metadata';
import { en } from '@/i18n';

export const metadata = collectionMetadata;

const COLLECTION_URL = 'https://appaw.store/collection/';

const collectionHowTo = howToJsonLd({
  name: 'How to catalogue your graded card collection with Appaw Store',
  description:
    'Sign in, add PSA/BGC/CGC slabs, and organise your inventory in portfolios using the free Appaw Collection Manager.',
  step: en.collection.landing.howItWorks.steps.map((step, i) => ({
    position: i + 1,
    '@type': 'HowToStep',
    name: step.title,
    text: step.body,
  })),
});

export default function CollectionPage() {
  const webApp = webApplicationJsonLd({
    name: 'Appaw Collection Manager',
    description: 'Secure dashboard to add, organize and value trading card collections.',
    url: COLLECTION_URL,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'All',
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'My Collection', item: COLLECTION_URL },
  ]);

  return (
    <>
      <StructuredData data={[webApp, breadcrumb, collectionHowTo]} />
      <div className="sr-only">
        <h1>Manage Your Graded Card Collection</h1>
        <p>
          Appaw Collection Manager is a free tool to catalogue PSA, BGS, and CGC graded trading cards.
          Log buy prices, cert numbers, grades, listing prices, and sold status. Group cards into public
          or private portfolios and use AI slab scanning to auto-fill card details from a photo.
        </p>
        <p>
          Keywords: card collection manager, manage trading card collection, organize PSA cards, track
          card values, graded card inventory, Pokémon TCG collection tracker, sports card portfolio.
        </p>
        <ol>
          {en.collection.landing.howItWorks.steps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong> — {step.body}
            </li>
          ))}
        </ol>
      </div>
      <CollectionLandingClient />
    </>
  );
}
