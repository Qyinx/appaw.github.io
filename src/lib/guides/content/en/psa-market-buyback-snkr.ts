import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-market-buyback-snkr',
  title: 'SNKRDUNK Akihabara Buyback Reference Prices',
  badge: 'SNKR buyback reference',
  lead:
    'Buyback prices below are taken from SNKRDUNK Akihabara’s daily posts for market reference only. They are not Appaw Store or 138 Arena purchase offers. Availability and final amounts follow that shop’s notice for the day.',
  metaDescription:
    'SNKRDUNK Akihabara daily buyback prices for market reference only. Not Appaw Store or 138 Arena purchase offers. Rows from 1 to 10 October 2026.',
  published: '2026-10-09',
  updated: '2026-10-10',
  readTime: 'Reference',
  heroSpecs: [
    { label: 'Dates', value: '2026-10-01 through 2026-10-10' },
    { label: 'Source', value: 'SNKRDUNK Akihabara daily posts' },
    { label: 'Currency', value: 'Japanese yen (¥)' },
    {
      label: 'What this is',
      value: 'A Japan market reference. Not an Appaw Store or 138 Arena purchase offer',
    },
  ],
  sections: [
    {
      id: 'browse-cards',
      title: 'Browse the cards',
      paragraphs: [
        'Each card on the browse page shows its latest posted buyback price. That amount is not an Appaw Store or 138 Arena purchase offer. [Browse the cards](/guides/psa-market-buyback-snkr/browse/).',
      ],
    },
    {
      id: 'grading-next',
      title: 'If you want a card graded',
      paragraphs: [
        'Nothing on this page is an offer by Appaw Store or 138 Arena to buy cards at these prices.',
        'Hong Kong collectors can book [PSA grading submission](/business/psa-grading/). After intake, [check grading progress](/business/psa-grading/track/).',
        'For the slab after it comes back, see [UV protection for graded cards](/guides/uv-protection-graded-cards/) and the [PSA reholder guide](/guides/psa-reholder-guide/).',
      ],
    },
  ],
  cta: {
    title: 'Submit a card for PSA grading',
    body: 'Appaw Store does not buy cards at the SNKRDUNK prices on this page. To send a card to PSA, start a grading submission. PSA decides the grade.',
    primary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'psa-reholder-guide'],
  sources: [
    {
      label: 'SNKRDUNK Akihabara on X',
      href: 'https://x.com/snkrdunk_akiba',
    },
  ],
};

export default guide;
