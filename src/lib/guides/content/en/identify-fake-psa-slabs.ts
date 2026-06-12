import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'How to Spot Fake PSA Slabs',
  description:
    'Holder, label, and cert checks before you buy graded. What genuine PSA slabs look like, quick physical tests, and red flags on Carousell or at card meets.',
  badge: 'Authentication',
  lead:
    'A PSA label can add thousands to a card. Counterfeit holders follow that premium. Before you wire money or trade at a meet, run holder inspection, cert lookup on psacard.com, and a side-by-side check against a slab you trust.',
  published: '2026-06-08',
  updated: '2026-06-08',
  readTime: '9 min',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: 'Cert check', value: 'psacard.com/cert only' },
    { label: 'Label hologram', value: 'Rainbow shift under tilt' },
    { label: 'Holder seam', value: 'Smooth ultrasonic weld' },
    { label: 'Stolen cert risk', value: 'Registry must match card' },
  ],
  sections: [
    {
      id: 'why-fakes-exist',
      title: 'Why Fake Slabs Show Up',
      paragraphs: [
        'PSA commands the highest slab premiums in most TCG and sports markets. A $50 raw copy can trade near $5,000 in a PSA 10 holder. That gap funds fake labels, fake cases, and even spoof verification pages that mimic PSA\'s cert lookup.',
        'The 2020–2022 collecting surge brought many first-time buyers who had never handled a genuine holder. Scammers adapted: some fakes are obvious, others have fooled shop staff. Treat every high-value slab as unverified until you complete the checks below.',
      ],
    },
    {
      id: 'genuine-baseline',
      title: 'Genuine PSA Slab: Baseline Reference',
      paragraphs: [
        'You cannot spot a fake without knowing the real thing. PSA holders use rigid, high-clarity plastic with tight ultrasonic seams. Edges feel uniform — no gaps, glue lines, or ripples. Cloudy plastic, bubbles, or wavy thickness are immediate flags.',
        'Labels use sharp print with consistent fonts and spacing. The holographic PSA logo shifts through rainbow tones when you tilt the slab under a desk lamp. Flat, pixelated, or single-colour holograms usually mean counterfeit print.',
        'Newer slabs include crisp QR codes and barcodes that scan to PSA\'s cert system. Blurry codes or codes that fail to resolve are suspect. Colour on standard red labels, gold vintage labels, and other service tiers should match other slabs from the same era — not slightly orange or washed out.',
        'Every slab carries a unique cert number. Lookup on www.psacard.com must return the same player or Pokémon name, year, card number, grade, and description as the card in your hand. A match on number alone is not enough: thieves reuse real cert numbers on fake holders.',
      ],
      specs: [
        { label: 'Plastic', value: 'Clear, rigid, uniform thickness' },
        { label: 'Seam', value: 'Tight weld, no adhesive' },
        { label: 'Hologram label', value: 'Multi-tone shift when tilted' },
        { label: 'Cert URL', value: 'www.psacard.com only' },
      ],
    },
    {
      id: 'physical-checks',
      title: 'Physical Checks You Can Do in Minutes',
      paragraphs: [
        'Weight: genuine holders sit in a narrow gram range for a given size. If you grade often, weigh three confirmed authentic slabs on a 0.1 g scale and note the band. Fakes often run light (cheap plastic) or heavy (different resin).',
        'Light pass: hold the slab to a bright LED or window. Authentic plastic stays evenly clear edge to edge. Patchy haze, internal bubbles, or thickness waves distort the card image.',
        'Seam trace: run a fingernail along the weld line. It should feel continuous with no ridge you could pry. Visible glue, gaps, or a seam that looks hand-closed points to a repack.',
        'Tap test: a light fingernail tap gives a short, solid tone on rigid PSA plastic. Thin fakes sound hollow. Use this only with other signals — it is not decisive alone.',
      ],
      specs: [
        { label: 'Scale precision', value: '0.1 g digital' },
        { label: 'Loupe', value: '10× minimum for label print' },
        { label: 'UV torch', value: 'Optional — label era varies' },
      ],
    },
    {
      id: 'cert-and-advanced',
      title: 'Cert Verification and Closer Inspection',
      paragraphs: [
        'Step one is always cert lookup on PSA\'s official site. Screenshot the result. If the site returns "certification number not found," stop. If the listing shows a 1986 Fleer Jordan but you hold a 2023 Pokémon chase, the number was stolen.',
        'Watch for fake verification URLs in seller screenshots. Type psacard.com yourself — do not trust QR codes or links in chat.',
        'Under 10× magnification, label text should have clean ink edges. Fakes often show pixel stair-steps or uneven density on small print. Compare cert number fonts to a known slab from the same label generation — forgers rarely match stroke width exactly.',
        'UV light can expose label security features on some eras, but patterns changed over PSA holder revisions. Build your reference set from slabs you opened yourself or bought from authorised dealers before relying on UV alone.',
        'Side-by-side comparison beats any single test. Place the suspect slab next to a trusted holder of the same label type and year. Differences in red shade, hologram depth, or label position become obvious when viewed together.',
      ],
    },
    {
      id: 'era-holders',
      title: 'Holder Era Matters',
      paragraphs: [
        'PSA has revised holders several times. Pre-2000 slabs use thicker plastic and simpler labels with no QR codes. Modern slabs add stronger holograms and digital codes. A genuine old holder should still show quality seams and period-correct print — not "low security" as an excuse for blurry labels.',
        'Transitional periods exist when old stock mixed with new designs. When a slab claims to be from a specific year, compare photos of legitimate holders from that year before you reject or accept.',
        'Card era must match holder logic: a vintage cardboard card in a brand-new style holder is possible after a reholder, but a "1952 Topps" that fluoresces bright under UV on modern stock is a card problem inside a possibly fake case.',
      ],
    },
    {
      id: 'buying-red-flags',
      title: 'Red Flags Before You Pay',
      paragraphs: [
        'Price far below market with no explained damage or urgency from a trusted estate — ask why. Deep discounts on PSA 10 chase cards are the most common lure on Carousell, Facebook groups, and overseas Discord flips.',
        'Seller refuses close-up photos of the label, cert number, seams, or hologram angle. Legitimate sellers expect these requests.',
        'Bulk listings of identical ultra-scarce PSA 10s. Real gem copies of key vintage cards are thin on the ground; five Mantle 10s from a new account is a pattern, not luck.',
        'Pressure to pay today via wire, crypto, or FPS with no buyer protection. Use platforms with dispute windows for first-time counterparties.',
        'Cert number withheld until after payment. Request the number and verify before you commit.',
      ],
    },
    {
      id: 'if-suspect',
      title: 'If You Think It Is Fake',
      paragraphs: [
        'Photograph every angle — label, cert, seams, defects — plus chat logs. Check the cert on psacard.com and save the mismatch screen.',
        'Contact PSA with documentation. They track counterfeits and can confirm when a holder is not theirs.',
        'If you used eBay, COMC, or another marketplace with buyer protection, open a case immediately with your evidence. Window length varies — act within hours for high-value items.',
        'After resolution, post a factual warning with photos in collector channels if policy allows. Omit accusations you cannot prove; stick to cert mismatch and holder photos.',
        'Once you own a verified slab, install a [protective case](/products/psa-protectors/) before daily carry. Authentication and protection are separate jobs: one confirms the label is real, the other keeps that label readable for resale.',
      ],
    },
  ],
  cta: {
    title: 'Verify first, then protect',
    body: 'Run cert lookup before you buy. Once the slab is yours, a rigid outer case shields the grader label from scratches and UV during display or travel.',
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
