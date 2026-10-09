import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-market-buyback-snkr',
  title: 'SNKRDUNK Akihabara Buyback Reference Prices',
  badge: 'Market reference',
  lead:
    'Buyback prices below are taken from SNKRDUNK Akihabara’s daily posts for market reference only. They are not Appaw Store or 138 Arena purchase offers. Availability and final amounts follow that shop’s notice for the day.',
  metaDescription:
    'SNKRDUNK Akihabara daily buyback prices for market reference only. Not Appaw Store or 138 Arena purchase offers. Rows from 1–9 October 2026.',
  published: '2026-10-09',
  updated: '2026-10-09',
  readTime: 'Reference table',
  notice:
    'This table is mainly human-approved text prices. Image prices and dense POP grids are incomplete and will be added later.',
  heroSpecs: [
    { label: 'Dates', value: '2026-10-01 through 2026-10-09' },
    { label: 'Source', value: 'SNKRDUNK Akihabara daily posts' },
    { label: 'Currency', value: 'Japanese yen (¥)' },
    {
      label: 'What this is',
      value: 'A Japan market reference. Not an Appaw Store or 138 Arena purchase offer',
    },
  ],
  sections: [
    {
      id: 'buyback-prices',
      title: 'Buyback reference prices',
      paragraphs: [
        'Filter by date or search by card name and number. A blank PSA grade is shown as a dash. Each source link opens the SNKRDUNK Akihabara post that row came from.',
      ],
      embed: 'snkr-buyback-prices',
    },
    {
      id: 'image-boards',
      title: 'Image boards and POP',
      paragraphs: [
        'These posts are image boards, dense POP grids, and other daily notices from the same dates. The cells are not verified, so this list has no prices. Each line is only the date and a link to the original post.',
      ],
      embed: 'snkr-buyback-announcements',
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
