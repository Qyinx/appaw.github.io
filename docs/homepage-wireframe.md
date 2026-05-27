Homepage Wireframe Draft

Goal: Make homepage a clear hub for three pillars:
- PSA Protectors (/products/psa-protectors/)
- My Collection (/collection/)
- Card Centering Analyzer (/tools/card-centering/)

Layout (Desktop)

1) Top nav (sticky)
- Left: Logo
- Center: Primary nav — Shop | My Collection | Tools
- Right: Search icon, Cart, Account
- Tools menu dropdown: Centering, Other tools

2) Hero (full-width, simple)
- Headline: "Protect, Manage, and Analyze Your Cards — All in One Place"
- Subhead: "Shop PSA-grade protectors, manage your collection, or check card centering in seconds."
- Primary CTA (solid): "Shop PSA Protectors" -> /products/psa-protectors/
- Secondary CTAs (outline): "View My Collection" -> /collection/  |  "Analyze Centering" -> /tools/card-centering/
- Visual: clean product photo or montage (light), subtle partner logos bar under hero

3) Three Feature Tiles (immediately under hero, 3 columns)
Tile 1 — PSA Protectors
- Mini-headline: "PSA-grade Protection"
- 2 bullets: "Clear, archive-safe sleeves"; "Bulk and single orders"
- CTA: "Shop Protectors" -> /products/psa-protectors/

Tile 2 — My Collection
- Mini-headline: "Your Collection, Organized"
- 2 bullets: "Add & value cards"; "Track provenance & condition"
- CTA: "Open My Collection" -> /collection/

Tile 3 — Centering Analyzer
- Mini-headline: "Centering Analyzer"
- 2 bullets: "Upload photo or use camera"; "Instant center grade (%)"
- CTA: "Analyze Now" -> /tools/card-centering/

4) How it works (3-step horizontal)
- For shop: Order -> Receive -> Protect
- For collection: Import -> Organize -> Share
- For analyzer: Upload -> Analyze -> Save result

5) Social proof / partners (logo row)

6) Quick FAQ / trust (shipping, returns, PSA-friendly)

7) Footer with secondary links and newsletter signup

Mobile notes
- Hero stacks: Headline + primary CTA then two small CTAs below (horizontal buttons or icon row)
- Feature tiles: vertical stacked cards with concise text and a large CTA
- Sticky bottom bar with primary CTA "Shop Protectors" or a contextual CTA based on scroll

Content & Copy Guidelines
- Keep hero copy concise (1 line headline, 1 line subhead)
- CTAs use action verbs and map directly to the three pillars
- Tile copy uses benefits-first phrasing (what user gets)

Analytics & KPIs to track
- CTA clicks from hero and tiles (three event categories)
- Time to first interaction
- Conversion funnel: CTA → landing page → (shop add-to-cart | collection signup | analyzer use)
- A/B test metric: CTA CTR and downstream conversion rate

Accessibility
- Ensure accessible color contrast on hero CTAs
- Keyboard focus order: nav → hero CTAs → tiles
- Provide alt text for images and partner logos

Notes for implementation
- Start with purely structural HTML/CSS (no heavy animations)
- Lazy-load product images and partner logos
- Use existing UI components in `src/components/ui/` and hero in `src/app/page.tsx`

Deliverables for next step
- Prototype React/Next hero + 3 tiles in `src/app/page.tsx` (small patch)
- Add analytics hooks for CTA events

