import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-reholder-guide',
  title: 'PSA Reholder Service and Cost',
  badge: 'Grading Workflow',
  lead:
    'PSA Standard Reholder costs $12.99 per card (as of 2026-10-05, per the PSA official site; higher insured-value tiers cost more) and swaps a scuffed slab for a fresh case and label while keeping the grade and cert number intact. It is not risk-free: if PSA spots new damage or fading during the transfer, the card can come back with a lower grade.',
  metaDescription:
    'PSA Reholder costs $12.99 and keeps your grade and cert number. Compare reholder vs regrade fees, timelines, downgrade risk, and free CRC label corrections.',
  published: '2026-08-09',
  updated: '2026-10-20',
  readTime: '7 min',
  heroImage: '/images/background/psa-10-centering-requirements.png',
  heroSpecs: [
    { label: 'Standard Cost', value: '$12.99 per card, excluding shipping (as of 2026-10-05)' },
    { label: 'Grade & Cert Number', value: 'Original grade and cert number preserved in most cases' },
    { label: 'Downgrade Risk', value: 'New damage or fading found on transfer can lower the grade' },
    { label: 'Label Errors', value: 'Official clerical errors corrected free via a CRC request' },
  ],
  sections: [
    {
      id: 'what-is-reholder',
      title: 'What does the Reholder service cover?',
      paragraphs: [
        'The PSA Reholder service covers cosmetic maintenance of the slab itself. Graders remove your card from its old case and seal it in the latest acrylic holder with fresh label stock, while the grade, certification number, and population history are preserved.',
        'Reholder fits straightforward physical wear: superficial scuffs, clouded plastic, minor edge dulling, or a fading label on an otherwise sound card. If you are satisfied with the grade and simply want a cleaner presentation, or want to unify older slab styles across a collection, Reholder is the sensible option.',
        'The $12.99 Standard fee excludes shipping and declared shipping insurance, so the real cost per card rises with logistics, especially for international collectors. Consolidating several scuffed slabs into one batch dilutes those fixed costs. Hong Kong collectors can instead drop off at [138 Arena](/business/psa-grading/) in Causeway Bay: 138 Arena handles the venue and payment, while Appaw Store folds Reholder cards into shared PSA grading submission batches, removing the need to self-ship overseas.',
      ],
      bridge: 'Reholder sounds like a simple cosmetic fix, but the transfer step carries boundaries and risks worth knowing before you pay.',
    },
    {
      id: 'hidden-risks',
      title: 'Hidden risks: Why it is not 100% safe',
      paragraphs: [
        'PSA does not formally regrade your card during a Reholder, but it does inspect it. Graders must confirm the integrity of the holder, ensure the label matches the item, and verify that the card condition has not deteriorated since it was originally graded. This inspection is where the risk lies.',
        'Under PSA terms, if graders spot new damage, such as a chipped corner caused by the card moving inside the case over time, or fading from UV exposure, they can refuse a simple Reholder. In those scenarios PSA may issue a lower numerical grade or return the card raw.',
        'Severely fractured slabs carry a similar risk, particularly when the crack runs over the card itself. PSA is unlikely to process these as a Standard Reholder and often flags them for a full regrading process. Buyers picking up heavily cracked slabs on the secondary market should be cautious about unseen surface damage.',
      ],
      bridge: 'Physical wear aside, sometimes a Reholder is needed simply because the text on the label is wrong.',
    },
    {
      id: 'label-corrections',
      title: 'Fixing typos: Free CRC label corrections',
      paragraphs: [
        'If your slab contains a clerical error made by PSA, such as an incorrect year, a misspelled player name, or a missing variation callout like "Japanese" or "Tiffany", you do not have to pay the standard fee.',
        'You can submit a Label Correction inquiry through the PSA Customer Request Center (CRC). If approved, PSA covers the reholder fee and provides a shipping label for transit both ways.',
        'One caveat: if the correction reveals that the card is a different, less valuable version than originally labeled, such as a Base card mistakenly labeled as Tiffany, PSA will correct the label downward. This type of correction is often excluded from PSA\'s Financial Guarantee payouts, which are PSA\'s own terms rather than insurance or compensation from Appaw.',
      ],
      bridge: 'Once the limits of Reholder are clear, the real decision is whether you are fixing plastic or chasing a higher grade.',
    },
    {
      id: 'regrade-teaser',
      title: 'Fixing the case vs chasing the grade',
      paragraphs: [
        'If you are satisfied with the grade and want a clean presentation, stick to Reholder. Paying full grading fees to regrade a card just because the case is scratched adds downgrade risk with no financial upside.',
        'If your goal is a higher grade because you believe the card was underscored, a Reholder will not help. You will need to weigh an in-slab Review against cracking the card out for a new submission, which is the decision covered in our [Review vs crack and resubmit guide](/guides/psa-review-vs-crack/).',
        'The table and formula below summarise the trade-off. The rule of thumb: only chase a higher grade when the expected value reaches at least 1.5 to 2 times the current slab value. Otherwise, Reholder or simply keeping the slab is the rational choice.',
        'For high-value PSA 9s, measure margins with the [free centering tool](/tools/card-centering/) before running this math. Hong Kong collectors can also visit 138 Arena, where Appaw checks centering, surface dents, and corners on site and advises whether Reholder, Review, or crack-and-resubmit is the rational path.',
      ],
      table: {
        headers: ['Factor', 'Reholder', 'Regrade (New Submission)'],
        rows: [
          ['Fee', '$12.99 (Standard)', 'Grading fee by declared value tier'],
          ['Timeline', 'Weeks, batched with grading', 'Weeks to months by service level'],
          ['Outcome', 'Grade preserved (100% same)', 'Can upgrade, downgrade, or stay'],
          ['Cert number', 'Original number kept', 'New cert number issued'],
          ['Best for', 'Scuffed or cracked case, happy with grade', 'Suspected undergraded high-value card'],
        ],
      },
      formula: {
        eyebrow: 'Chase the grade or not',
        result: 'Expected Value (EV)',
        terms: [
          { text: 'PSA 10 value × upgrade probability', hint: 'Check recent sold prices' },
          { op: '+', text: 'Current value × (1 − probability)', hint: 'Includes downgrade risk' },
          { op: '−', text: 'Submission fees + shipping', hint: 'Paid either way' },
        ],
      },
    },
  ],
  faq: [
    {
      q: 'How much does it cost to Reholder a PSA card?',
      a: 'The Standard Reholder service costs $12.99 per card as of 2026-10-05, per the PSA official site. Higher insured-value tiers cost more, and the base fee excludes return shipping and declared shipping insurance, so the total cost per card will be higher.',
    },
    {
      q: 'Will a Reholder change my PSA grade?',
      a: 'In the vast majority of cases, the grade and cert number stay exactly the same. However, if PSA discovers that the card has faded or sustained new damage inside the old holder, they reserve the right to downgrade it.',
    },
    {
      q: 'Can I Reholder a cracked PSA slab?',
      a: 'Minor chipping or hairline fractures away from the card are usually fine. If the crack extends over the card body or the case is structurally compromised, PSA may force the card into a full regrading process.',
    },
    {
      q: 'Do I have to pay if PSA made a mistake on the label?',
      a: 'No. If the error is a clear clerical mistake by PSA, such as a typo or a missing variation, you can submit a CRC Label Correction request to have it reholdered for free, including shipping.',
    },
    {
      q: 'Can I submit PSA Reholder through Appaw PSA grading submission in Hong Kong?',
      a: 'Yes. Hong Kong collectors book online, then complete intake at 138 Arena in Causeway Bay. 138 Arena handles the venue and collects payment, while Appaw Store folds Reholder cards into the PSA grading submission batch and assesses whether the holder damage still fits a simple Reholder.',
    },
  ],
  cta: {
    title: 'A sound slab does not need a reholder',
    body: 'If the slab is still sound and you are hoping for a higher grade, a reholder is the wrong tool. Hand the card in at 138 Arena in Causeway Bay for a new submission: Appaw Store will assess the card condition and explain the suitable path first, and PSA still decides the final grade.',
    primary: { label: 'Hand in the card', href: '/business/psa-grading/' },
    secondary: { label: 'Shop PSA Protectors', href: '/products/psa-protectors/' },
  },
  relatedSlugs: ['psa-review-vs-crack', 'hong-kong-tcg-grading-guide', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA Trading Card Reholder',
      href: 'https://www.psacard.com/services/tradingcardgrading/reholder',
    },
    {
      label: 'PSA Terms and Conditions',
      href: 'https://www.psacard.com/termsandconditions',
    },
  ],
};

export default guide;
