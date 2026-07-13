import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'hong-kong-tcg-grading-guide',
  title: 'Hong Kong TCG Grading Submission: PSA Proxy at 138 Arena',
  badge: 'Hong Kong',
  lead:
    'Hong Kong TCG collectors can submit Pokémon, One Piece, MTG, and sports cards to PSA through a face-to-face proxy at 138 Arena, Causeway Bay. Service fees start at HKD 850. Every batch gets a BAT reference code for online status lookup.',
  published: '2026-07-13',
  updated: '2026-07-13',
  readTime: '7 min',
  heroImage: '/images/background/psa-grading-standards.png',
  heroSpecs: [
    { label: 'Drop-off', value: '138 Arena, Causeway Bay' },
    { label: 'Service from', value: 'HKD 850 (REG tier)' },
    { label: 'Tracking', value: 'Phone + BAT reference' },
    { label: 'Categories', value: 'PTCG, One Piece, MTG, sports' },
  ],
  sections: [
    {
      id: 'who-this-is-for',
      title: 'Who uses Hong Kong TCG grading submission',
      paragraphs: [
        'This workflow suits Hong Kong collectors who want PSA labels on Pokémon TCG, One Piece, Magic: The Gathering, or sports cards without mailing cards overseas themselves. Appaw coordinates proxy submission after face-to-face intake at 138 Arena.',
        'Raw or sleeved cards are accepted. High-value submissions may need declared-value paperwork matching your PSA tier. Check centering before you pay grading fees — PSA 10 margins are tight on modern TCG print runs.',
      ],
    },
    {
      id: 'how-it-works',
      title: 'From drop-off to graded slab',
      paragraphs: [
        'Book a drop-off slot at 138 Arena, Causeway Bay. Bring your cards, tier choice, and contact phone number. Staff verify your list, assign a BAT batch reference per PSA service level, and forward the batch to PSA.',
        'While PSA grades and encapsulates your cards, timeline steps sync to the [PSA submission tracker](/business/psa-grading/track/). You need both the phone number and BAT code from your receipt to view batch status.',
        'When slabs return to Hong Kong, you receive pickup notice. Collect at 138 Arena within the stated window. Add an outer [graded slab protector](/products/psa-protectors/) before display or shipping.',
      ],
      bridge: 'Screen centering before you pay fees.',
    },
    {
      id: 'before-you-submit',
      title: 'Check centering before submission',
      paragraphs: [
        'PSA grades centering, corners, edges, and surface. Only centering can be screened from photos before you submit. Use the free [card centering tool](/tools/card-centering/) against PSA 10 thresholds (55/45 front, 75/25 back).',
        'For raw-card economics and outer-case protection after grading, see [grade or protect first](/guides/grade-or-protect-first/) and [PSA 10 centering requirements](/guides/psa-10-centering-requirements/).',
      ],
    },
  ],
  faq: [
    {
      q: 'Can Hong Kong TCG cards be submitted to PSA?',
      a: 'Yes. Pokémon TCG, One Piece, MTG, and sports cards in raw or sleeved form are accepted at 138 Arena through Appaw proxy submission.',
    },
    {
      q: 'How do I track my batch?',
      a: 'Use the track page with your receipt phone number and BAT reference code. Both are required.',
    },
    {
      q: 'Do you accept mailed submissions?',
      a: 'No. Drop-off and pickup are face-to-face at 138 Arena only.',
    },
  ],
  cta: {
    title: 'Book PSA submission in Hong Kong',
    body: 'Face-to-face intake at 138 Arena. Track every batch with phone and BAT reference.',
    primary: { label: 'PSA submission hub', href: '/business/psa-grading/' },
    secondary: { label: 'Free centering tool', href: '/tools/card-centering/' },
  },
  relatedSlugs: ['psa-grading-standards', 'psa-10-centering-requirements', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA submission services',
      href: 'https://www.psacard.com/services',
    },
    {
      label: 'Appaw PSA submission hub',
      href: 'https://appaw.store/business/psa-grading/',
    },
  ],
};

export default guide;
