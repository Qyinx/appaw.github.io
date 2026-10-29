import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'psa-2026-policy-timeline',
  title: '2026 PSA Policy Timeline: Value Pause and Reopen, Hong Kong Center, Price Changes',
  badge: 'Policy Tracker',
  lead:
    '2026 has been the most disruptive year for PSA customers in Asia-Pacific: the Hong Kong Submission Center opened, the Value tier was paused and then reopened, and prices and estimated turnaround times changed more than once. This page tracks each official change by date, with its scope, the practical impact for Hong Kong collectors, and links to official sources. It is updated whenever PSA publishes a new announcement.',
  metaDescription:
    '2026 PSA policy timeline: Hong Kong Submission Center opening, Value tier pause and October reopening, Standard/Priority price and turnaround changes: dates, impact, and official sources, continuously updated.',
  published: '2026-10-29',
  updated: '2026-10-29',
  readTime: '7 min',
  notice:
    'This is a living document: whenever PSA announces a policy change, the timeline and the "last updated" date are revised together.',
  heroImage: '/images/background/psa-grading-standards.png',
  heroSpecs: [
    {
      label: 'Scope',
      value: 'Official PSA policy: submission channels, tier availability, pricing, and estimated turnaround times',
    },
    {
      label: 'Applies to',
      value: 'Collectors in Hong Kong and Asia-Pacific (APAC); some changes apply globally',
    },
    {
      label: 'Update policy',
      value: 'Updated when PSA publishes announcements; each entry links to an official source',
    },
    {
      label: 'Current fees',
      value: 'Appaw Store service fees follow the pricing table on the PSA grading submission page',
    },
  ],
  sections: [
    {
      id: 'timeline',
      title: '2026 changes at a glance',
      paragraphs: [
        'The table below lists the major PSA policy changes of 2026 in date order, with the impact for Hong Kong collectors.',
      ],
      table: {
        headers: ['Date', 'Change', 'Impact for Hong Kong collectors'],
        rows: [
          [
            '2026-02-10',
            'PSA price update: Regular raised from US$74.99 to US$79.99',
            'Proxy submission fees follow official cost increases; old price lists become void',
          ],
          [
            '2026-02-18',
            'PSA Hong Kong Submission Center opens; APAC orders (excluding Japan and China) route through Hong Kong',
            'Submit directly via the Tsim Sha Tsui center with a Collectors account, or keep using a local proxy; grading still takes place in the US',
          ],
          [
            '2026-06-02',
            'Value tier paused for new orders (marked Currently Unavailable on psacard.com)',
            'Cheapest available tier temporarily becomes Regular; budget batches pause or move to other graders',
          ],
          [
            '2026-10-04',
            'Pricing and service-level restructure: Standard/Priority tiers updated with new estimates',
            'Standard estimated turnaround shortened; proxy price tables switch to the new schedule',
          ],
          [
            '2026-10-28/29',
            'Value tier reopens for submissions',
            'Lower-value cards (declared value up to USD 500) have a budget option again; Appaw Store service fee from HKD 390',
          ],
        ],
      },
      bridge:
        'Each change is expanded below with verification methods, starting with the most far-reaching one: the Hong Kong Submission Center.',
    },
    {
      id: 'hk-submission-center',
      title: '2026-02-18: PSA Hong Kong Submission Center opens',
      paragraphs: [
        'PSA announced the Hong Kong Submission Center on 18 February 2026. From that date, customers in Asia-Pacific (excluding Japan and China, and covering Hong Kong, Macau, Singapore, Malaysia, Taiwan, Thailand, the Philippines, Indonesia, South Korea, and Vietnam) submit through the Hong Kong center to reduce US tariff and customs-delay risk. Cards are still graded at PSA headquarters in the United States, returned to the Hong Kong center, and then passed to the customer.',
        'The direct-submission flow: first-time users request IP whitelisting (PSA states 3–5 business days) before they can create an order in the PSA Online Submission Center. The intake address is China Hong Kong City, 33 Canton Road, Tsim Sha Tsui, Kowloon, and in-person drop-off and pickup are available by appointment on weekdays. Packaging rules require each card in a sleeve inside a Card Saver semi-rigid holder, stacked in the order listed on the submission form; toploaders and screw-downs are not accepted.',
        'The Hong Kong center accepts standard-sized cards, modern cards (1980–present), vintage cards (1979 and older), soccer stickers, and Dual Service submissions. It does not accept packs, tickets, comic books, magazines, Reholder or Crossover submissions, oversized cards, or PSA Vault submissions. PSA states it does not send regular progress updates; customers check order status online themselves.',
      ],
      callout:
        'Submitting directly through the official center and using a local proxy are not mutually exclusive: the direct route means handling the account, forms, packaging, and tracking yourself, while a proxy consolidates batches and follows up for you. The grading work itself is identical; the difference is who runs the process.',
      bridge:
        'With the channel change covered, the mid-year development that hit budgets hardest was the Value pause.',
    },
    {
      id: 'value-pause',
      title: '2026-06-02: Value tier paused',
      paragraphs: [
        'The Value tier was originally PSA’s lowest entry point: declared value capped at USD 500, the longest turnaround but the lowest per-card price, suited to submitting large batches of lower-value cards at once. From 2 June 2026, PSA marked the Value tier as temporarily unavailable for new orders (Currently Unavailable), leaving Regular at US$79.99 (declared value up to USD 1,500, estimated 70–80 business days) as the cheapest open tier. For collectors running volume batches, the per-card cost jumped immediately, and many paused submissions altogether.',
        'During the pause, some shops kept advertising the old Value price list even though the tier could no longer be submitted, so the Currently Unavailable marker on psacard.com became the source of truth before placing any order. Budget demand shifted to other grading companies (such as CGC), or collectors shelved their submission plans until the tier returned.',
      ],
      bridge:
        'After more than four months of the Value pause, PSA first restructured overall pricing in early October, then reopened Value at the end of the month.',
    },
    {
      id: 'oct-fee-restructure',
      title: '2026-10-04: pricing and turnaround restructure',
      paragraphs: [
        'From 4 October 2026, PSA updated tier pricing and estimated turnaround times. The main tiers are Standard, Priority, Express, Super Express, and Premier; compared with the previous schedule, the Standard and Priority estimates were shortened. The Appaw Store pricing table switched to the new schedule on the same day and keeps the previous schedule visible for comparison.',
        'Estimated turnaround before and after the change (as published by PSA; the clock starts when PSA enters the order into its system):',
      ],
      table: {
        headers: ['Tier', 'Max declared value', 'Previous estimate', 'Current estimate'],
        rows: [
          ['Standard', 'USD 1,000', '~90–100 business days', '~70–80 business days'],
          ['Priority', 'USD 1,500', '~70–80 business days', '~50–60 business days'],
          ['Express', 'USD 2,500', '~20–30 business days', '~20–30 business days'],
          ['Super Express', 'USD 5,000', '~7–10 business days', '~7–10 business days'],
          ['Premier', 'USD 10,000', '~7 business days', '~7 business days'],
        ],
      },
      callout:
        'Estimated turnaround times are PSA estimates only. The clock starts when the order is entered into PSA’s system and excludes shipping and any wait before intake. PSA may adjust pricing, service offerings, and estimates as submission volume changes.',
      bridge:
        'Less than a month after the restructure, the long-paused Value tier returned.',
    },
    {
      id: 'value-reopen',
      title: '2026-10-28/29: Value tier reopens',
      paragraphs: [
        'Between 28 and 29 October 2026, PSA reopened the Value tier for submissions, ending a pause of nearly five months that began on 2 June. The terms are unchanged: declared value capped at USD 500, estimated turnaround around 90–100 business days, making it the lowest-priced tier on the official price list again. Appaw Store’s Value service fee starts at HKD 390; PSA’s official USD pricing is published on the psacard.com services page.',
        'The immediate effect is that budget batches are viable again: during the pause the cheapest option was Regular at US$79.99, and lower-value cards can now go back to Value. At the same time, the 4 October estimates are already in effect, so Standard and Priority are faster than they were before the pause and the budget-versus-speed trade-off needs recalculating. One thing worth watching: months of pent-up Value demand may push short-term submission volume up, and actual turnaround can drift from the official estimate.',
        'Practical advice: the Value reopening does not suit every card. If the graded value exceeds the USD 500 cap, PSA may upgrade the service level and charge the difference (an upcharge), which can push the total cost above what Standard would have cost in the first place. Check recent sold prices before submitting, and confirm the card’s post-grade market value stays well under the cap. For deciding which cards are worth grading and which should stay raw, see the cost analysis in [grade or protect first](/guides/grade-or-protect-first/).',
      ],
      bridge:
        'With changes this frequent, verifying them yourself beats relying on second-hand summaries.',
    },
    {
      id: 'how-to-verify',
      title: 'How to verify current PSA policy yourself',
      paragraphs: [
        'The psacard.com services page is the only source that reflects changes immediately: tier availability (Currently Unavailable markers), USD pricing, and estimated turnaround all follow that page. Every proxy price list, including Appaw Store’s, adds a service fee on top of the official pricing and becomes void the day the official list changes.',
        'Structural changes show up in PSA’s official announcements (Articles/News), such as the Hong Kong Submission Center opening and the APAC routing change. These announcements usually precede price-list updates, and the covered regions matter when a change involves submission channels.',
        'On the shop side, the Appaw Store [PSA grading submission](/business/psa-grading/) page shows the current and previous fee schedules side by side and updates service fees after official changes. The actual status of each batch can be verified with the registered phone number and reference code on the [tracking page](/business/psa-grading/track/).',
      ],
    },
  ],
  faq: [
    {
      q: 'How long was the PSA Value tier paused in 2026?',
      a: 'PSA marked the Value tier as unavailable for new orders from 2 June 2026 and reopened it between 28 and 29 October 2026, a pause of nearly five months. During the pause, the cheapest open tier was Regular at US$79.99 with a USD 1,500 declared-value cap.',
    },
    {
      q: 'Are cards graded in Hong Kong after the Submission Center opened?',
      a: 'No. The Hong Kong center handles intake and logistics only. Cards are still graded at PSA headquarters in the United States, returned to the Hong Kong center, and then passed to the customer.',
    },
    {
      q: 'Which tiers got faster after the October 2026 price update?',
      a: 'Per PSA’s published estimates, Standard shortened from ~90–100 to ~70–80 business days, and Priority from ~70–80 to ~50–60 business days. Express, Super Express, and Premier were unchanged. Estimates start when PSA enters the order into its system.',
    },
    {
      q: 'Which cards suit the Value tier now that it has reopened?',
      a: 'Cards with a declared value up to USD 500 that are not time-sensitive; the estimate is ~90–100 business days. If the graded value exceeds the cap, PSA may upgrade the service level and charge the difference, so check recent sold prices first.',
    },
    {
      q: 'How often is this page updated?',
      a: 'It is a living document with no fixed cadence: whenever PSA announces a change (tier availability, pricing, turnaround, submission channels), the timeline and the "last updated" date are revised, with links to official sources.',
    },
  ],
  midCta: {
    afterSectionId: 'value-reopen',
    title: 'Value is back. Deciding whether to submit?',
    body: 'Check whether the card’s post-grade value stays under the declared-value cap, and pre-screen centering with the free tool. Once you have picked a tier, book a drop-off at 138 Arena.',
    primary: { label: 'PSA grading pricing', href: '/business/psa-grading/' },
    secondary: { label: 'Free centering tool', href: '/tools/card-centering/' },
  },
  cta: {
    title: 'Book a drop-off with the latest pricing',
    body: 'The Appaw Store pricing table shows current and previous schedules and stays in sync with official PSA changes. Book online, hand cards in at 138 Arena in Causeway Bay, and track every batch with your registered phone number and reference code.',
    primary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
    secondary: { label: 'Track a batch', href: '/business/psa-grading/track/' },
  },
  relatedSlugs: [
    'hong-kong-tcg-grading-guide',
    'psa-grading-standards',
    'grade-or-protect-first',
    'psa-reholder-guide',
  ],
  sources: [
    {
      label: 'PSA grading services and pricing',
      href: 'https://www.psacard.com/services',
    },
    {
      label: 'PSA: New submission process for APAC customers (2026-02-18)',
      href: 'https://www.psacard.com/articles/articleview/15674/submitting-from-apac',
    },
    {
      label: 'PSA: Hong Kong Submission Center announcement',
      href: 'https://www.psacard.com/articles/articleview/15624/psa-expands-global-footprint-with-new-hong-kong-submission-center',
    },
    {
      label: 'Appaw Store PSA grading pricing (current and previous schedules)',
      href: 'https://appaw.store/business/psa-grading/',
    },
  ],
};

export default guide;
