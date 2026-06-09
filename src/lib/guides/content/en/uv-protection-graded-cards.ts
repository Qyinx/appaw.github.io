import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'uv-protection-graded-cards',
  title: 'UV Protection for Graded Cards',
  description:
    'How UV fades holo and chrome on graded slabs, what >95% blocking means, and humidity targets for Hong Kong TCG storage.',
  badge: 'Preservation',
  lead:
    'A graded slab already sealed the card. Your job is to control light and moisture around it. Sun through a window or a humid HK summer can still dull a chase holo over a few seasons.',
  published: '2026-06-07',
  updated: '2026-06-07',
  readTime: '7 min',
  heroImage: '/images/background/uv-protection-graded-cards.png',
  heroSpecs: [
    { label: 'UV-filter Slab Protector', value: '>95% below 400 nm' },
    { label: 'Grader inner case', value: 'Little above ~345 nm' },
    { label: 'Optimal Storage Humidity', value: '45–55%' },
    { label: 'HK Indoor Relative Humidity (avg.)', value: '70–80%' },
  ],
  sections: [
    {
      id: 'why-uv-matters',
      title: 'Why UV Still Reaches Your Slab',
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
    },
    {
      id: 'case-vs-room',
      title: 'Case Glass vs Room Lighting',
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
  cta: {
    title: 'Display without sun damage',
    body: 'Our graded slab aluminum case uses >95% UV-blocking glass and seals standard 35PT PSA / CGC slabs for home or showroom display.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'When to grade vs protect', href: '/guides/grade-or-protect-first/' },
  },
  relatedSlugs: ['choose-35pt-slab-protector', 'grade-or-protect-first', 'display-graded-cards'],
  sources: [
    {
      label: 'Tru Vue FAQ — PPFA 97% UV standard (300–380 nm)',
      href: 'https://tru-vue.com/frequently-asked-questions/',
    },
    {
      label: 'ACRYLITE Gallery UV filtering (OP3)',
      href: 'https://www.acrylite.co/products/brands/acrylite-gallery/uv-filtering',
    },
    {
      label: 'ACRYLITE extruded light transmission — plain vs OP3',
      href: 'https://www.acrylite.co/files/content/acrylite.co/00-global/documents/technical-product-briefs/ACRYLITE-Extruded-Light-Transmission-Reflectance-Information.pdf',
    },
  ],
};

export default guide;
