import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'display-graded-cards',
  title: 'How to Display Graded Cards',
  description:
    'Desk, shelf, and wall options for graded card display cases. UV-safe PSA slab display, spacing, and what to skip before you buy a display case.',
  badge: 'Display',
  lead:
    'Graded slabs are built to be seen — but open shelves, window light, and stacked acrylic stacks still scratch labels and fade holos. A proper graded card display case keeps the cert readable and the card face out of direct UV.',
  published: '2026-06-09',
  updated: '2026-06-09',
  readTime: '6 min',
  heroImage: '/images/background/display-graded-cards.png',
  heroSpecs: [
    { label: 'Standard slab profile', value: '35PT PSA / CGC' },
    { label: 'Display glass target', value: '>95% below 400 nm' },
    { label: 'Shelf spacing', value: '≥ 5 mm between cases' },
    { label: 'Light preference', value: 'Indirect / LED, no direct sun' },
  ],
  sections: [
    {
      id: 'why-display-case',
      title: 'Why a Graded Card Display Case Beats Bare Slabs',
      paragraphs: [
        'The inner PSA or CGC holder is tough but not scratch-proof. Desk dust, ring keys, and show-bag zippers mark the outer plastic fast. A rigid outer graded card display case adds a second shell so the grader label stays legible and corners do not take point pressure.',
        'Display intent is different from long-term vault storage. You want the face and cert number visible at a glance, stable on a shelf, and safe to pick up for photos. That means flat back, clear front, and sidewalls stiff enough that the slab does not rattle when you rotate the case.',
        'Magnetic aluminum cases (like the [Graded Slab Protector](/products/psa-protectors/)) sit between cheap acrylic shells and full wall frames: gallery-level presentation without mounting screws through the inner slab.',
      ],
    },
    {
      id: 'desk-shelf-wall',
      title: 'Desk, Shelf, and Wall Display',
      paragraphs: [
        'Desk display: one chase card angled toward you. Use a case with a flat base so the slab stands without a separate stand. Keep the front panel back from monitor glare — reflected light washes out holo depth in photos.',
        'Shelf display: line up slabs vertically with small gaps. Never stack bare slabs ten deep; weight plus vibration can stress the inner case seam. A row of outer display cases upright on a padded shelf is the usual home setup.',
        'Wall display: only use frames or ledges rated for 74–150 g per unit. PSA slabs in aluminum outer cases are heavier than raw cards in toploaders. Anchor into studs; adhesive strips fail after a humid summer.',
      ],
      specs: [
        { label: 'Desk', value: 'Single spotlight, indirect light' },
        { label: 'Shelf', value: 'Upright, padded, spaced' },
        { label: 'Wall', value: 'Mechanical fixings, no direct sun' },
      ],
    },
    {
      id: 'psa-slab-display',
      title: 'PSA Slab Display: Light and UV',
      paragraphs: [
        'PSA slab display looks best when the label and card face are evenly lit. Side lighting shows holo texture; front-only lighting flattens it. Either way, keep slabs out of continuous window sun — even behind glass, UVA adds up season after season.',
        'If the outer panel blocks >95% of UV below 400 nm, you can display on an interior shelf without the fade risk of bare acrylic. Pair display with the habits in our [UV protection guide](/guides/uv-protection-graded-cards/): stable humidity, microfiber wipes, no paper towels on plastic.',
        'At card shows, rotate which slabs sit under booth LEDs. Heat and light still age foils; a display case slows UV but does not remove heat.',
      ],
    },
    {
      id: 'pick-display-case',
      title: 'Choosing a Graded Card Display Case',
      paragraphs: [
        'Fit first: standard 35PT PSA and CGC slabs share one outer profile. Measure outer width and height before you buy a "universal" display case marketed for raw cards.',
        'Clarity second: glass or high-clarity acrylic with a UV filter beats cloudy bargain bins that hide print lines.',
        'Rigidity third: thin flex shells transfer shock to the inner case. Aluminum framing spreads impact when a case gets bumped off a shelf.',
        'Skip display setups that require you to unscrew the inner slab, heat the holder, or squeeze the case into a frame with corner clips — those add wear every time you swap cards.',
      ],
    },
    {
      id: 'showroom-hk',
      title: 'Showroom and Home Setup in Hong Kong',
      paragraphs: [
        'Hong Kong apartments often mix display with limited shelf space. A single premium display case on a interior wall beats a window ledge with afternoon sun. If you visit a local shop to compare fit, bring one slab to test seat and label clearance.',
        'For travel between home and a show table, display the same slab in the same outer case — do not swap between bare slab and case mid-trip. Consistent outer protection keeps display photos and inventory labels aligned.',
      ],
    },
  ],
  cta: {
    title: 'Display-ready slab protection',
    body: 'Our magnetic PSA slab case uses >95% UV-blocking glass, fits standard 35PT PSA and CGC slabs, and is sized for desk or shelf display.',
    primary: { label: 'PSA Slab Case & Graded Card Display', href: '/products/psa-protectors/' },
    secondary: { label: 'UV protection for slabs', href: '/guides/uv-protection-graded-cards/' },
  },
  relatedSlugs: ['uv-protection-graded-cards', 'choose-35pt-slab-protector', 'grade-or-protect-first'],
  sources: [
    {
      label: 'PSA — holder sizes and slab dimensions',
      href: 'https://www.psacard.com/info/cardspsagrades',
    },
    {
      label: 'Tru Vue FAQ — UV filtering for displayed collectibles',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
  ],
};

export default guide;
