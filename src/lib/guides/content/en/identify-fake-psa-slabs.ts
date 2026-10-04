import type { GuideContent } from '../../types';

const guide: GuideContent = {
  slug: 'identify-fake-psa-slabs',
  title: 'PSA Slab Authentication Guide',
  badge: 'Authentication',
  lead:
    'A cert lookup only means that number is in the database. It does not mean the slab in your hand is that card. Open the official lookup page yourself, then use a blacklight, feel the shell, and magnify the label. If any step misses, do not pay.',
  published: '2026-06-08',
  updated: '2026-10-05',
  readTime: '12 min',
  heroImage: '/images/background/identify-fake-psa-slabs.png',
  heroSpecs: [
    { label: 'Core rule', value: 'Cross-check: never one test alone' },
    { label: 'Stolen certs', value: 'Pass lookup, fail physical checks' },
    { label: 'UV milestone', value: 'Hidden front text after cert #43' },
    { label: 'Step 1', value: '[psacard.com/cert](https://www.psacard.com/cert) lookup' },
  ],
  sections: [
    {
      id: 'why-cross-check',
      title: 'Why one check is never enough',
      paragraphs: [
        'PSA slabs carry grade and resale value. That premium draws fake labels, stolen cert numbers, and spoof lookup pages. High-end fakes still hit the market in 2025–2026.',
        'No single test is 100% reliable. A clean cert lookup only clears the first gate. Forgers often steal legitimate numbers. The five steps below stack from quick digital checks to close physical inspection. Use them together.',
      ],
    },
    {
      id: 'cert-lookup',
      title: 'Step 1: Online cert lookup',
      paragraphs: [
        'Every PSA slab label prints a Certification Number. Start here, it is mandatory, not optional.',
        'Go to PSA\'s official lookup: [psacard.com/cert](https://www.psacard.com/cert). Type the URL yourself. Do not trust QR codes or links in seller screenshots or chat.',
        'After entering the number, confirm the registry matches the slab in your hand: card photo (including corner wear and flaw placement), year, player or character name, grade, and special marks (1st Edition, Rookie, etc.).',
        'If the site returns "certification number not found," stop. If the registry shows a 1986 Fleer Jordan but you hold a 2023 Pokémon chase, the number was stolen. Screenshot the result before you pay.',
      ],
      specs: [
        { label: 'Lookup URL', value: '[www.psacard.com/cert](https://www.psacard.com/cert) only' },
        { label: 'Must match', value: 'Photo, year, subject, grade, marks' },
        { label: 'Pass means', value: 'Gate one cleared. Keep checking.' },
      ],
      bridge: 'Lookup can lie. Step 2 is the $12 blacklight test most sellers skip.',
    },
    {
      id: 'uv-blacklight',
      title: 'Step 2: UV blacklight test',
      paragraphs: [
        'A UV blacklight is one of the most practical quick tools for spotting fake PSA slabs, cheap to buy, easy to keep on a desk. If you handle graded cards regularly, own one.',
        'Every card in the videos below is genuine. The side with no reaction is a real slab from an earlier generation, not a fake.',
      ],
      subsections: [
        {
          title: 'Label front',
          bulletGroups: [
            {
              label: '',
              items: [
                {
                  label: 'Before cert #43:',
                  text: 'No visible hidden text under UV.',
                },
                {
                  label: 'After cert #43:',
                  text: 'Hidden "PSA" text or patterns appear in specific zones, even, sharp glow.',
                },
              ],
            },
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-front.mp4',
              caption:
                'Every card in this video is genuine. Front label UV comparison (left: post-#43xxxxxx, hidden text visible / right: pre-#43xxxxxx, no reaction)',
            },
          ],
        },
        {
          title: 'Label back',
          bulletGroups: [
            {
              label: '',
              items: [
                {
                  label: 'All eras:',
                  text: 'Six small glowing PSA logos should appear evenly around the main PSA logo (same before and after cert #43).',
                },
              ],
            },
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-uv-reflection-back.mp4',
              caption: 'Every card in this video is genuine. Back label UV comparison (both sides show 6 micro logos)',
            },
          ],
        },
      ],
      callout:
        'Fake tells: glow in the wrong place, uneven brightness, blurry patterns, or no reaction at all.',
      specs: [
        { label: 'Front (pre-#43)', value: 'No hidden text under UV' },
        { label: 'Front (post-#43)', value: 'Hidden PSA mark, even glow' },
        { label: 'Back (all eras)', value: '6 small logos around main logo' },
        { label: 'Fake tells', value: 'Wrong zone, too bright/dim, blur, none' },
      ],
    },
    {
      id: 'holder-physical',
      title: 'Step 3: Shell Feel and Build',
      paragraphs: [
        'Authentic PSA plastic follows tight manufacturing specs. You can run these tactile checks in minutes.',
        'The PSA logo should be raised. It sits on the bottom right, or on the back, depending on the generation. A logo on the back is normal. Flat print, or a logo that feels flat, is the problem.',
        '"21" stamp: most modern slabs carry a clear "21" imprint on the bottom-left.',
        'Plastic quality: rigid, clear, moderate weight. Welded edges stay flat, no wide haze bands, gaps, or glue lines. The inner card well should show sharp 90° corners, not rounded pockets.',
        'Profile and seal: genuine edges run thinner with a solid, settled feel. Holders that flex easily or show repack/open marks need serious doubt.',
      ],
      specs: [
        { label: 'Logo', value: 'Raised. Bottom right or the back, by generation. Flat is the fail' },
        { label: '"21"', value: 'Modern slabs, bottom-left' },
        { label: 'Inner corners', value: '90° square, not rounded' },
        { label: 'Seam', value: 'Flat weld, no adhesive' },
      ],
    },
    {
      id: 'label-magnification',
      title: 'Step 4: Label Under Magnification',
      paragraphs: [
        'Labels expose fakes fastest. PSA has revised label design and security features several times across its history. Use a loupe (10× minimum) or phone macro mode to study these era-specific traits, you can filter out low-grade counterfeits quickly.',
        'Every card in the videos below is genuine. CLCT and PSA are both real label stock, not a real-versus-fake pair.',
      ],
      subsections: [
        {
          title: 'Milestone 1: Cert #27xxxxxx (current label style)',
          paragraphs: [
            'Before cert #27xxxxxx (roughly pre-2017), PSA used an early plain label with minimal security. From #27xxxxxx onward, PSA locked in the label architecture collectors recognize today:',
          ],
          bulletGroups: [
            {
              label: '',
              items: [
                {
                  label: 'Pre-#27xxxxxx (legacy style):',
                  text: 'No rectangular hologram sticker on the lower-right front; the back carries no security features. Traditional type and layout.',
                  images: [
                    {
                      src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-front-old-label.jpg',
                      caption: 'The card in this photo is genuine. Pre-#27xxxxxx front label (no rectangular hologram sticker along the bottom)',
                    },
                    {
                      src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
                      caption: 'The card in this photo is genuine. Pre-#27xxxxxx back label appearance',
                    },
                  ],
                },
                {
                  label: 'Post-#27xxxxxx (modern base):',
                  text: 'First appearance of the rectangular PSA hologram logo (Hologram Logo) along the lower front. Redesigned type with sharper, finer strokes.',
                },
              ],
            },
          ],
        },
        {
          title: 'Milestone 2: Cert #4xxxxxxx–5xxxxxxx (NASDAQ : CLCT → PSA microtext transition)',
          paragraphs: [
            'From #27xxxxxx onward, labels share LightHouse™ two-tone shift under tilted light. After PSA\'s parent company went private and delisted from NASDAQ in early 2021, hologram microtext gradually switched from "NASDAQ : CLCT" to "PSA" across cert #4xxxxxxx through #5xxxxxxx, the #4xxxxxxx–5xxxxxxx transition window. Both microtext variants have been confirmed in each band. Magnify and tilt the label; do not infer microtext from the cert number alone.',
          ],
        },
        {
          title: 'Hologram pattern and hidden microtext (tilt under normal light)',
          level: 4,
        },
        {
          title: 'Before cert #4xxxxxxx (#27xxxxxx – #39xxxxxxx)',
          level: 4,
          paragraphs: [
            'LightHouse™ two-tone shift under tilt. Hidden microtext inside the security pattern consistently reads "NASDAQ : CLCT", the parent company\'s ticker before delisting.',
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-front-old-version.mp4',
              caption: 'Every card in this video is genuine. Pre-#4xxxxxxx front label tilt (microtext reads NASDAQ : CLCT)',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-old-version.mp4',
              caption: 'Every card in this video is genuine. Pre-#4xxxxxxx back label tilt (microtext reads NASDAQ : CLCT)',
            },
          ],
        },
        {
          title: 'Cert #4xxxxxxx–5xxxxxxx (transition window)',
          level: 4,
          paragraphs: [
            'During the delisting reorg, PSA phased in new label stock. Both CLCT and PSA microtext have been confirmed in the #4xxxxxxx and #5xxxxxxx bands, earlier numbers are more likely CLCT, later ones more likely PSA, but there is no fixed cutoff. Always tilt and magnify before buying slabs in this range.',
          ],
        },
        {
          title: 'After cert #6xxxxxxx (post-transition)',
          level: 4,
          paragraphs: [
            'Once the transition ended, hologram microtext reads "PSA" across the board. Late #5xxxxxxx copies may still show CLCT — always verify under magnification.',
          ],
          videos: [
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-front-new-version.mp4',
              caption: 'Every card in this video is genuine. Post-#5xxxxxxx front label tilt (microtext reads PSA)',
            },
            {
              src: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-label-reflection-back-new-version.mp4',
              caption: 'Every card in this video is genuine. Post-#5xxxxxxx back label tilt (microtext reads PSA)',
            },
          ],
        },
      ],
      specs: [
        { label: 'Magnification', value: '10× minimum' },
        { label: 'Tilt test', value: 'Two-tone LightHouse™ shift under tilt' },
        { label: '#27 milestone', value: 'Hologram sticker added after' },
        { label: '#4xxxxxxx–5xxxxxxx transition', value: 'CLCT and PSA in both bands, verify' },
        { label: 'Fake tells', value: 'Cert band vs measured microtext mismatch' },
      ],
    },
    {
      id: 'advanced-buying',
      title: 'Step 5: Card, Seller, and Purchase Checks',
      paragraphs: [
        'Card condition inside: even when the holder looks fine, check print sharpness, colour accuracy, and whether a claimed PSA 10 actually looks gem-worthy.',
        'Seller red flags: no multi-angle video, refuses UV testing, won\'t accept PSA re-authentication, price far below market with no story, cert number withheld until after payment, pressure to wire or pay crypto today with zero buyer protection.',
        'Safer buying: prefer platforms with PSA-backed authentication, established dealers, or submit high-value raw cards for fresh grading. Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). On arrival, Appaw completes a preliminary inspection and may apply basic surface cleaning. That check is a reference only; PSA sets the final grade. 138 Arena handles the floor and collects payment. Appaw Store may adjust the final amount. First-time counterparties deserve marketplaces with dispute windows.',
        'If you already suspect a fake: photograph label, cert, seams, and defects; save chat logs; screenshot cert mismatches on psacard.com; open a marketplace case immediately on eBay, COMC, or similar; contact PSA with documentation when needed.',
      ],
    },
    {
      id: 'practice-habit',
      title: 'Check this before you pay',
      paragraphs: [
        'Every item below has to match. If one misses, do not pay.',
        'Practice these five steps on an ordinary slab before you touch an expensive one.',
      ],
      bulletGroups: [
        {
          label: '',
          items: [
            {
              label: 'Cert:',
              text: 'Open psacard.com/cert yourself. The photo, year, name, and grade have to match. A seller link or QR code does not count.',
            },
            {
              label: 'Blacklight:',
              text: 'Hidden PSA on the front only after certs starting with 43. The back, in every era, shows 6 small logos around the main logo. Wrong place, too bright, blurry, or no reaction: do not pay.',
            },
            {
              label: 'Shell:',
              text: 'The logo has to be raised. Bottom right or the back are both normal, depending on the generation. Flat is a fail. Inner corners are square. A wide frosted seam is a fail.',
            },
            {
              label: 'Label:',
              text: 'Tilt and magnify the microtext. Certs starting with 4 or 5 have no fixed cutoff. Both CLCT and PSA show up. Read the slab in your hand. Do not guess from the number.',
            },
            {
              label: 'After it matches:',
              text: 'Then add a [protective case](/products/psa-protectors/). Check first, case second.',
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Does a passing PSA cert lookup prove a slab is real?',
      a: 'No. Forgers reuse stolen cert numbers that pass psacard.com/cert. You still need UV, label-era, and shell checks.',
    },
    {
      q: 'What UV reaction should a real PSA slab show after cert #43?',
      a: 'Hidden PSA text or patterns on the label front under blacklight, plus six small glowing logos on the back.',
    },
    {
      q: 'Can I trust a QR code on a seller listing?',
      a: 'No. Type psacard.com/cert yourself. QR codes and screenshot links can route to spoof pages.',
    },
    {
      q: 'What magnification do I need for label microtext?',
      a: '10× loupe minimum. Tilt the label under normal light to read CLCT or PSA microtext by cert era.',
    },
  ],
  midCta: {
    afterSectionId: 'advanced-buying',
    title: 'All five steps match? Then add a case',
    body: 'Only after all five steps match should you list it or carry it. The acrylic still scratches. A rigid case cuts that down.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'UV storage guide', href: '/guides/uv-protection-graded-cards/' },
  },
  cta: {
    title: 'Verify first, then protect',
    body: 'After the five-step cross-check, a rigid outer case shields the grader label from scratches and ultraviolet during display or travel. If you are buying raw instead, Hong Kong collectors book online, then complete intake face to face at 138 Arena. 138 Arena handles the floor and collects payment. Appaw Store runs PSA grading submission and follow-up, and may adjust the final amount.',
    primary: { label: 'Graded Slab Protector', href: '/products/psa-protectors/' },
    secondary: { label: 'PSA grading submission', href: '/business/psa-grading/' },
  },
  relatedSlugs: ['psa-reholder-guide', 'grade-or-protect-first', 'psa-10-centering-requirements', 'choose-35pt-slab-protector'],
  sources: [
    {
      label: 'PSA, Cert Verification',
      href: 'https://www.psacard.com/cert',
    },
    {
      label: 'PSA, Grading Standards',
      href: 'https://www.psacard.com/gradingstandards',
    },
    {
      label: 'Card Codex, How to Identify Fake PSA Slabs (reference)',
      href: 'https://cardcodex.com/blog/how-to-identify-fake-psa-slabs/',
    },
  ],
};

export default guide;
