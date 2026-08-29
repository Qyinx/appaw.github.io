import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'uv-protection-graded-cards',
  title: 'UV Protection for Graded Cards',
  badge: 'Preservation',
  lead:
    'A factory slab seals the card, but the clear acrylic does not stop ultraviolet. In Hong Kong, indoor relative humidity often sits at 70–80%. Two summers of window sun on that mix can dull a holo, a chrome layer, or a label enough for the eye to notice.',
  published: '2026-06-07',
  updated: '2026-08-30',
  readTime: '7 min',
  heroImage: '/images/background/uv-protection-graded-cards.png',
  heroSpecs: [
    { label: 'HK indoor RH (avg.)', value: 'Often 70–80% indoors across much of the year' },
    { label: 'UV-filter protector', value: 'More than 95% blockage below 400 nm' },
    { label: 'Ideal storage RH', value: 'Hold a dry cabinet near 45–55% relative humidity' },
    { label: 'Grader inner case', value: 'Little useful blockage of ultraviolet above about 345 nm' },
  ],
  sections: [
    {
      id: 'why-uv-matters',
      title: 'Your slab is sealed. UV still gets in.',
      paragraphs: [
        'PSA and CGC cases use clear plastic that passes most visible light. That is good for display but it does not stop ultraviolet. UV in the 300–400 nm band breaks down inks and foil layers on Pokémon holos, sports chrome, and vintage borders inside the slab.',
        'Damage is cumulative. A slab on a shelf near a south-facing window can show colour shift before you notice edge wear on the outer case. Display-grade acrylic or glass rated above 95% below 400 nm cuts exposure sharply compared with off-the-shelf clear acrylic.',
        'Picture framing standards often cite 97% UV blockage between 300 and 380 nm (Tru Vue / PPFA). That is the museum framing benchmark. Appaw display glass targets >95% below 400 nm, which covers the same fading band for holos and chrome without overclaiming.',
      ],
      specs: [
        { label: 'Risk band', value: '300–400 nm (UVA / near-UV)' },
        { label: 'Museum-grade target', value: '>95% below 400 nm' },
        { label: 'Plain acrylic UVA', value: 'Blocks little above ~345 nm' },
      ],
      bridge: 'Blocking UV helps. Hong Kong humidity is the other silent killer.',
    },
    {
      id: 'case-vs-room',
      title: 'Case glass vs room lighting',
      paragraphs: [
        'Putting a slab inside a UV-rated outer case adds a second filter. The outer panel takes the hit so the inner grader label and card face see less radiation. That matters when you rotate slabs on a desk or at a show table under mixed LED and daylight.',
        'LED room lights emit less UV than direct sun, but they still push heat. Keep slabs out of continuous direct sun even inside a rated case. No plastic blocks 100% forever if you bake the same spot daily.',
      ],
    },
    {
      id: 'humidity-hk',
      title: 'Humidity in Hong Kong and Coastal Climates',
      paragraphs: [
        'A grader case seals the card but is not a humidity vault. Over years, moisture still migrates through the holder. Hong Kong averages roughly 70–80% relative humidity indoors for much of the year. Above 60% RH, slabs stored on open shelves can show label fog or inner surface ripple on holos.',
        'Collectors in humid cities often run electronic dry cabinets at 45–55% RH for their slab stacks. That range keeps paper stable without drying it so much that corners curl the other way. Stability beats chasing a perfect number: swings from 40% to 75% in a week hurt more than holding 52% steady.',
        'Silica gel in a closed box helps for a few slabs, but it needs recharging. For a growing stack of PSA bricks, a small dry cabinet (20–40 L for dozens of slabs) is the usual upgrade path.',
      ],
      specs: [
        { label: 'Ideal RH', value: '45–55%' },
        { label: 'Risk threshold', value: '> 60% sustained' },
        { label: 'Temp. comfort band', value: '16–25 °C' },
      ],
    },
    {
      id: 'daily-habits',
      title: 'Daily Habits That Actually Help',
      paragraphs: [
        'Store slabs upright on a padded shelf, not stacked flat ten high. Weight plus humidity creep stresses lower cases.',
        'Wipe outer cases with a microfiber cloth, not paper towels that micro-scratch acrylic.',
        'If you ship slabs, wrap the outer protector in bubble plus a rigid mailer. UV and humidity control do not matter if the package arrives with a cracked inner case.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a PSA slab block UV from fading the card inside?',
      a: 'No. Grader cases pass most visible light and little UV protection above ~345 nm. Cumulative sun exposure still dulls holos and chrome.',
    },
    {
      q: 'What UV rating should a display case target?',
      a: 'Above 95% blockage below 400 nm. Museum framing often cites 97% between 300–380 nm as a reference benchmark.',
    },
    {
      q: 'What humidity should HK collectors target for slabs?',
      a: '45–55% RH in a dry cabinet is common. Hong Kong indoor RH often runs 70–80%, which risks label fog over time.',
    },
  ],
  midCta: {
    afterSectionId: 'why-uv-matters',
    title: 'Displaying by a window? Add >95% UV glass',
    body: 'The outer case filters ultraviolet first, so the inner label and holo receive less radiation. Hong Kong collectors who still hold raw cards can book online and complete intake at [138 Arena](/business/psa-grading/). 138 Arena handles the floor and collects payment; Appaw Store runs PSA grading submission and follow-up.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'Display graded cards', href: '/guides/display-graded-cards/' },
  },
  cta: {
    title: 'Display without sun damage',
    body: 'The graded slab UV glass protector uses glass that blocks more than 95% of ultraviolet below 400 nm, and is sized for standard 35PT PSA and CGC holders. Once a slab is collected at 138 Arena after PSA returns it, fit the outer case before display. Hong Kong collectors who still hold raw cards book online, then complete intake face to face at 138 Arena. 138 Arena handles the floor and collects payment. Appaw Store runs PSA grading submission and follow-up, and may adjust the final amount. If any problem arises within fourteen days after the customer receives the protector, the customer may return it. The buyer pays the shipping cost of the return.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['choose-35pt-slab-protector', 'grade-or-protect-first', 'display-graded-cards'],
  sources: [
    {
      label: 'Tru Vue FAQ, PPFA 97% UV standard (300–380 nm)',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
    {
      label: 'ACRYLITE Gallery UV filtering (OP3)',
      href: 'https://www.acrylite.co/products/brands/acrylite-gallery/uv-filtering',
    },
    {
      label: 'ACRYLITE extruded light transmission, plain vs OP3',
      href: 'https://www.acrylite.co/files/content/acrylite.co/00-global/documents/technical-product-briefs/ACRYLITE-Extruded-Light-Transmission-Reflectance-Information.pdf',
    },
  ],
};

export default guide;
