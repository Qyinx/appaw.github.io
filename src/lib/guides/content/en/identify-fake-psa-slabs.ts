import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'How to Spot Fake PSA Slabs',
  description:
    'Five-step cross-check for PSA holders: cert lookup, UV blacklight, shell feel, label magnification, and seller red flags before you buy.',
  badge: 'Authentication',
  lead:
    'PSA slabs signal grade and resale value — and that premium draws fake labels, fake cases, and stolen cert numbers. After the 2020–2022 boom, many first-time buyers got burned. Rule one: treat every high-value slab as unverified until you finish a multi-step cross-check.',
  published: '2026-06-08',
  updated: '2026-06-17',
  readTime: '10 min',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: 'Step 1', value: '[psacard.com/cert](https://www.psacard.com/cert) lookup' },
    { label: 'Fastest tool', value: 'UV blacklight' },
    { label: 'Shell marks', value: 'Raised PSA logo + "21"' },
    { label: 'Core rule', value: 'Cross-check — never one test alone' },
  ],
  sections: [
    {
      id: 'why-cross-check',
      title: 'Why One Check Is Never Enough',
      paragraphs: [
        'In graded card markets, PSA holders stand for condition and resale trust. Counterfeits range from fake labels and cases to reused real cert numbers and spoof verification pages — and the work keeps improving. High-end fakes still hit the market in 2025–2026.',
        'No single test is 100% reliable. A clean cert lookup only clears the first gate — forgers often steal legitimate numbers. The five steps below stack from quick digital checks to close physical inspection. Use them together.',
      ],
    },
    {
      id: 'cert-lookup',
      title: 'Step 1: Online Cert Lookup',
      paragraphs: [
        'Every PSA slab label prints a Certification Number. Start here — it is mandatory, not optional.',
        'Go to PSA\'s official lookup: [psacard.com/cert](https://www.psacard.com/cert). Type the URL yourself. Do not trust QR codes or links in seller screenshots or chat.',
        'After entering the number, confirm the registry matches the slab in your hand: card photo (including corner wear and flaw placement), year, player or character name, grade, and special marks (1st Edition, Rookie, etc.).',
        'If the site returns "certification number not found," stop. If the registry shows a 1986 Fleer Jordan but you hold a 2023 Pokémon chase, the number was stolen. Screenshot the result before you pay.',
      ],
      specs: [
        { label: 'Lookup URL', value: '[www.psacard.com/cert](https://www.psacard.com/cert) only' },
        { label: 'Must match', value: 'Photo, year, subject, grade, marks' },
        { label: 'Pass means', value: 'Gate one cleared — keep checking' },
      ],
    },
    {
      id: 'uv-blacklight',
      title: 'Step 2: UV Blacklight Test',
      paragraphs: [
        'A UV blacklight is the fastest practical tool most collectors can buy cheap and keep on a desk. If you handle graded cards regularly, own one.',
        'Label front: genuine slabs show hidden "PSA" text or patterns in specific zones — even, sharp glow under UV. This feature was added starting at cert #43.',
        'Label back: six small PSA logos should appear around the main PSA logo.',
        'Fake tells: glow in the wrong place, uneven brightness, blurry patterns, or no reaction at all. Holder designs shifted over the years, but the security layout stays consistent within an era. A seller who refuses UV footage or multi-angle video is a major flag.',
      ],
      specs: [
        { label: 'Front', value: 'Hidden PSA mark, even glow (added after cert #43)' },
        { label: 'Back', value: '6 small logos around main logo' },
        { label: 'Fake tells', value: 'Wrong zone, too bright/dim, blur, none' },
      ],
    },
    {
      id: 'holder-physical',
      title: 'Step 3: Shell Feel and Build',
      paragraphs: [
        'Authentic PSA plastic follows tight manufacturing specs. You can run these tactile checks in minutes.',
        'Raised PSA logo: bottom-right on the holder (or back on some eras) — you should feel a raised logo under your finger. Fakes often use flat print or stiff, wrong texture.',
        '"21" stamp: most modern slabs carry a clear "21" imprint on the bottom-left.',
        'Plastic quality: rigid, clear, moderate weight. Welded edges stay flat — no wide haze bands, gaps, or glue lines. The inner card well should show sharp 90° corners, not rounded pockets.',
        'Profile and seal: genuine edges run thinner with a solid, settled feel. Holders that flex easily or show repack/open marks need serious doubt.',
      ],
      specs: [
        { label: 'Logo', value: 'Raised, bottom-right (era varies)' },
        { label: '"21"', value: 'Modern slabs, bottom-left' },
        { label: 'Inner corners', value: '90° square, not rounded' },
        { label: 'Seam', value: 'Flat weld, no adhesive' },
      ],
    },
    {
      id: 'label-magnification',
      title: 'Step 4: Label Under Magnification',
      paragraphs: [
        'Labels expose fakes fastest. Use a loupe or phone macro mode.',
        'Type details: on "GEM MINT 10," the G tail should end clean — no extra spur. Year digits like "2" should match genuine stroke shape. Fakes often show pixel steps or uneven ink density.',
        'Tilt and security print: under angled light, authentic labels show a lighthouse-like shift plus micro PSA logo patterns. Flat, single-tone, or pixelated holograms point to counterfeit print.',
        'Colour, alignment, and translucency: ink should sit even. Backlit, a real label faintly shows reverse text; thick, opaque fakes block it.',
        'Side-by-side beats solo inspection: place the suspect slab next to a trusted holder from the same label generation. Red shade, hologram depth, and label position differences jump out when viewed together.',
      ],
      specs: [
        { label: 'Magnification', value: '10× minimum' },
        { label: 'Key type', value: 'GEM MINT 10, year digits' },
        { label: 'Tilt test', value: 'Multi-tone "lighthouse" shift' },
      ],
    },
    {
      id: 'advanced-buying',
      title: 'Step 5: Card, Seller, and Purchase Checks',
      paragraphs: [
        'Card condition inside: even when the holder looks fine, check print sharpness, colour accuracy, and whether a claimed PSA 10 actually looks gem-worthy.',
        'Seller red flags: no multi-angle video, refuses UV testing, won\'t accept PSA re-authentication, price far below market with no story, cert number withheld until after payment, pressure to wire or pay crypto today with zero buyer protection.',
        'Safer buying: prefer platforms with PSA-backed authentication, established dealers, or pay for a fresh PSA submission on high-value cards. First-time counterparties deserve marketplaces with dispute windows.',
        'If you already suspect a fake: photograph label, cert, seams, and defects; save chat logs; screenshot cert mismatches on psacard.com; open a marketplace case immediately on eBay, COMC, or similar; contact PSA with documentation when needed.',
      ],
    },
    {
      id: 'practice-habit',
      title: 'Verification Beats Regret',
      paragraphs: [
        'Fake slab craft keeps moving. Stack cert lookup, UV, physical inspection, and seller diligence — that is how you cut risk.',
        'New collectors should practice on lower-value slabs before chasing grail prices. Protect your budget and your hobby: a safe collection starts with verification.',
        'Once a slab checks out, add a [protective case](/products/psa-protectors/) before daily carry or display. Authentication confirms the label; a rigid outer case keeps that label scratch-free and UV-safe for resale.',
      ],
    },
  ],
  cta: {
    title: 'Verify first, then protect',
    body: 'After your five-step cross-check, a rigid outer case shields the grader label from scratches and UV during display or travel.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'Grade vs protect workflow', href: '/guides/grade-or-protect-first/' },
  },
  relatedSlugs: ['regrade-or-reholder', 'grade-or-protect-first', 'psa-10-centering-requirements', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA — Cert Verification',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'PSA — Grading Standards',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Card Codex — How to Identify Fake PSA Slabs (reference)',
      href: 'https://cardcodex.com/blog/how-to-identify-fake-psa-slabs/',
    },
  ],
};

export default guide;
