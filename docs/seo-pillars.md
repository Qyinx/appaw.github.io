SEO Draft — Pillar Pages

Last updated: 2026-06-02 — Optimised the homepage (`/`) for search intent: added a keyword-rich sub-line inside the H1 ("Premium Aluminum PSA Card Protectors & Trading Card Supplies in Hong Kong" / bilingual), injected a clean crawlable Product Specifications `<table>` (Compatibility: 35PT PSA slabs, Material, Closure: N52, UV >95%, Weight 74g, Dimensions, HK origin) directly under the Services bento, rewrote the hero subtitle to weave in primary keywords ("magnetic aluminum PSA card protectors / 35PT graded slabs" and zh "PSA 保護殼 / 評級卡保護殼 / 磁吸卡夾"), and confirmed the hero "Shop Now" CTA is the dominant path straight to `/products/psa-protectors`. Previous: strengthened `/products/psa-protectors/` (kept indexed URL, added ~180-word bilingual Product Overview, expanded spec grid with Compatibility + Closure rows) and repositioned `/tools/card-centering/` as a utility-first "Free Card Centering Calculator & PSA 10 Analyzer" pillar.

Goal: Provide SEO-ready title/meta and JSON-LD examples for the three pillars to improve Google reach and SERP CTR.

Site OG image (used across the site): `/images/og-image.png` — recommended size 1200x630, used for homepage and default social previews.

1) PSA Protectors (/products/psa-protectors/) — IMPLEMENTED
- URL decision: KEEP `/products/psa-protectors/`. It is already clean, indexed, and contains the primary keyword "psa". Changing an established/indexed URL (e.g. to `/products/psa-card-aluminum-protector`) risks losing accumulated ranking equity for marginal slug gains, so no slug change and no redirect were applied. The legacy `/business/psa-protector` already 301-redirects here.
- Metadata (`psaProtectorsMetadata` in `src/lib/seo/metadata.ts`): page-owned title/description/canonical, OG + Twitter tags, keyword cluster around "PSA card protector / PSA aluminum case / magnetic PSA slab case".
- Primary Keywords: "PSA card protector", "PSA protectors", "PSA aluminum case"
- Supporting long-tails: "best PSA card protector", "magnetic PSA card case", "UV-protection card protector", "35PT PSA slab case", "N52 magnetic card holder"

- Implemented changes:
  - Text-rich product description: a new "Product Overview" section (`overview` i18n block, en + zh) renders a ~180-word, keyword-dense paragraph pair below the hero — covering 35PT PSA compatibility, >95% UV/anti-fade protection, N52 neodymium closure, 74g aluminum/glass build, and Pokémon/sports/MTG use cases. Gives Google substantial indexable on-page copy beyond image alt text.
  - Expanded "Technical Specifications" grid (`specs` array in `page.tsx`): now 6 cards — Size, Weight, Materials, UV Protection, plus new **Compatibility** (Standard 35PT PSA Slabs) and **Closure System** (N52 Neodymium Magnets) rows, each with bilingual labels/values/descriptions.
  - Internal linking (already satisfied): homepage buy buttons (`HomeClient.tsx`), `Footer.tsx`, `BusinessClient.tsx`, and `CardTradingClient.tsx` all point to `/products/psa-protectors` — dominant internal link authority confirmed, no change needed.

- JSON-LD (already comprehensive, in `src/app/products/psa-protectors/layout.tsx`): full `Product` with brand, SKU `APPAW-PSA-ALU-001`, material, weight/width/height/depth `QuantitativeValue`s, two `Offer`s (HKD), `additionalProperty` (UV Protection >95%, Magnet Grade N52 Neodymium, Compatibility Standard 35PT PSA Slabs, Closure Type Magnetic), `aggregateRating` (4.9 / 127), plus `BreadcrumbList` and `FAQPage`.

- Manual follow-up (cannot be automated): submit `https://appaw.store/products/psa-protectors/` via Google Search Console "URL Inspection → Request Indexing" to accelerate re-crawl of the new copy.

Open Graph / Twitter: handled by `psaProtectorsMetadata` (summary_large_image).


---

2) My Collection (/collection/)
- Suggested Title: "My Collection — Manage & Track Your Trading Cards | Appaw Store"
- Suggested Meta Description: "Add, organize and value your card collection. Track provenance, condition and share lists. Secure, private collection dashboard."
- Suggested H1: "Manage Your Collection"
- Primary Keywords: "card collection manager", "manage trading card collection", "card collection app"
- Supporting long-tails: "track card values", "organize PSA cards", "collection provenance tracker"

- Open Graph / Twitter: choose a dashboard screenshot for `og:image`.

- JSON-LD (Service / WebApplication):
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Appaw Collection Manager",
  "description": "Secure dashboard to add, organize and value trading card collections.",
  "url": "https://appaw.store/collection/",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "All",
  "author": { "@type": "Organization", "name": "Appaw Store" }
}
```

Notes: Include clear CTAs and screenshots; add structured data for `BreadcrumbList` and `Sitelinks Searchbox` if relevant.

---

3) Card Centering Calculator / PSA 10 Analyzer (/tools/card-centering/)

> Updated 2026-06-01 — Repositioned this page from a commercial brand page to a utility-first
> tool page after keyword research. This is the strongest organic-traffic opportunity on the site:
> searchers looking for a "card centering calculator" have high intent and low commercial
> competition compared to the protector/store keywords the homepage targets.

- Implemented Title: "Free Card Centering Calculator & PSA 10 Analyzer | Appaw Store"
  - Rationale: leads with "Free" + the two highest-volume head terms ("card centering calculator"
    and "PSA 10"). The previous inherited title ("Appaw Store - PSA Card Aluminum Protector & TCG
    Trading") was purely commercial and lost the click for tool-intent searches.
- Implemented Meta Description: "Quickly check if your Pokémon, sports, or TCG cards meet PSA 10
  centering standards. Upload your card, adjust the alignment lines, and get instant margin
  percentages — free."
- Implemented H1: "Free Card Centering Calculator & PSA 10 Analyzer" (single H1 on the page, rendered
  in `CenteringContent.tsx` below the tool canvas).

Keyword research (target cluster)
- Primary head terms: "card centering calculator", "card centering tool", "PSA 10 centering",
  "PSA centering calculator".
- High-intent long-tails (now covered by on-page H2s/FAQ): "how to check card centering",
  "what centering for a PSA 10", "Pokémon card centering tool", "sports card centering calculator",
  "BGS centering requirements", "card centering percentage".
- Comparison/authority terms to expand into later: "PSA vs BGS centering", "55/45 centering",
  "off-center card value", "centering before grading".

On-page content (implemented)
- "How to use the Appaw Centering Analyzer" — numbered step-by-step instructions (upload on a dark
  background → align outer/blue guides to the card edge → align inner/pink guides to the art border →
  read percentages). Mirrors `HowTo` JSON-LD.
- "What are the centering requirements for a PSA 10?" — a markdown/HTML table of front & back
  tolerances for PSA, BGS and SGC (incl. PSA's tightened 55/45 front standard for a 10).
- "Why card centering matters" — explains how off-centre borders cap a card's grade and tank value,
  with internal links to `/products/psa-protectors/` and `/business/card-trading/`.
- FAQ block (accordion) wired to `FAQPage` JSON-LD: PSA 10 requirement, accuracy, best-photo tips,
  card-type support, and "is it free".

- Open Graph / Twitter: `og:image` = `/images/og-centering.png` (TODO: replace placeholder with a real
  analyzer result-overlay screenshot, 1200×630).

- JSON-LD (implemented in `src/app/tools/card-centering/page.tsx` via `src/lib/seo` factories):
  - `WebApplication` (applicationCategory `UtilitiesApplication`)
  - `BreadcrumbList` (Home → Card Centering Calculator)
  - `HowTo` (the 4 measurement steps)
  - `FAQPage` (the 5 Q&As above)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Card Centering Calculator & PSA 10 Analyzer",
  "description": "Free browser tool that measures trading card centering against PSA, BGS and SGC standards.",
  "url": "https://appaw.store/tools/card-centering/",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "author": { "@type": "Organization", "name": "Appaw Store" }
}
```

Internal linking / IA (implemented)
- Added a highlighted "Centering Tool" link to the primary header navigation (`Header.tsx`,
  i18n key `nav.centeringTool`, en/zh) so crawlers and users see it as a top-level, important page.
- Page metadata is now page-owned (`centeringMetadata` exported from `src/app/tools/card-centering/page.tsx`)
  and the canonical was corrected from the broken `/tools/centering/` to `/tools/card-centering/`.

Notes / next steps
- Replace the placeholder `og:image` with a real screenshot of the analyzer result overlay.
- Consider a short "measurement method" explainer and a couple of worked examples (well-centred vs
  off-centre card) to deepen topical authority versus competitors (e.g. Edge Grading's centering tool).
- Add internal links to this tool from the homepage and the `/products/psa-protectors/` page body.

---

General implementation checklist
- Ensure unique `title` and `meta description` per pillar page.
- Add breadcrumbs and JSON-LD `BreadcrumbList` where applicable.
- Add `og:image` and `twitter:image` sized for social previews (1200x630 recommended).
- Ensure each pillar page links to related blog/support content (internal links build theme authority).
- Add schema `Product`/`Service`/`WebApplication` JSON-LD to page head (`dangerouslySetInnerHTML` in Next layout/page).
- Submit/update sitemap.xml after changes and monitor Search Console for indexing.

Recommended next step
- I can implement these meta tags and JSON-LD snippets directly into the page components (`src/app/products/psa-protectors/page.tsx`, `src/app/collection/page.tsx`, `src/app/tools/card-centering/page.tsx`). Would you like me to implement those now?

Validation (source-level check)

I performed a source-level inspection of JSON-LD injection points across the app (no full Next build). Results:

- Root site schema: `WebSite` + `Store` are injected in `src/app/layout.tsx` (site-level JSON-LD and GA script). These are intentionally global and present on all pages.
- `/products/psa-protectors/`: `Product`, `BreadcrumbList`, and `FAQPage` are injected in `src/app/products/psa-protectors/layout.tsx` (single source for product data).
- `/collection/`: `WebApplication` + `BreadcrumbList` are injected in `src/app/collection/page.tsx` (page-owned WebApplication schema). Note: this page is currently `robots: { index: false }`.
- `/tools/card-centering/`: `WebApplication` + `BreadcrumbList` are injected in `src/app/tools/card-centering/layout.tsx` (page-owned metadata + JSON-LD).

Conclusion

- The app uses a single site-level JSON-LD (`WebSite`/`Store`) in `src/app/layout.tsx` and page-owned JSON-LD where appropriate. I did not find duplicated `Product` or `Store` objects across unrelated pages in the source. This source-level check confirms the intended structured-data separation.

Notes about headless rendering

- I did not run a full headless Next.js render because that requires installing dependencies and building the app in this environment. The source-level validation above is reliable for locating server-injected JSON-LD. If you want a runtime verification (actual rendered HTML), I can run a headless check once you permit installing dependencies here, or I can run it against a deployed staging URL you provide.

Next step options

- I can run a headless render locally (will `npm install` and `npm run build` then use `puppeteer` or `playwright` to fetch the rendered HTML and confirm the JSON-LD output). Tell me to proceed and I will run it.
- Or provide a staging URL and I'll fetch the page HTML and validate the JSON-LD there.

Centralized JSON-LD (new)

Implementation note: JSON-LD has been centralized into `src/lib/seo` and rendered via the server component `src/components/StructuredData.tsx`.

- `src/lib/seo/index.ts`: factory helpers — `webSiteJsonLd()`, `storeJsonLd()`, `webApplicationJsonLd(opts)`, `breadcrumbJsonLd(items)`, `faqJsonLd(items)`.
- `src/components/StructuredData.tsx`: server component that takes a single object or an array and outputs `<script type="application/ld+json">` tags.

Migration status

- Root layout (`src/app/layout.tsx`) now imports `webSiteJsonLd()` and `storeJsonLd()` and renders them with `<StructuredData />`.
- `src/app/products/psa-protectors/layout.tsx`, `src/app/business/card-trading/page.tsx`, `src/app/collection/page.tsx`, and `src/app/tools/card-centering/layout.tsx` still own per-page schemas but can be migrated to use the centralized factories to keep wording consistent.

Recommended follow-ups

- Migrate `psa-protectors` and `business/card-trading` to use the factories for `Product`/`FAQ` creation (these pages sometimes construct dynamic objects — factories can accept data and return a normalized `Product` object).
- Run a headless render (build + puppeteer/playwright) to validate runtime HTML and confirm only intended JSON-LD appears on each route.

Sitemap Strategy
===============

1. Sitemap Structure:
   - Hierarchy (3 levels recommended):
     1) Homepage -> 2) Section (Products, Tools, Collection, About, Blog, Business) -> 3) Resource (Category, Tool page, Product detail, Article).
        - Examples:
          - Homepage -> Products -> PSA Protectors -> Product detail (/products/psa-protectors/ or /products/[slug]/)
          - Homepage -> Tools -> Card Centering Analyzer -> Tool result (/tools/card-centering/)
          - Homepage -> Collection -> My Collection (private — exclude unless explicitly made public)
   - Depth rationale: limit to ~3 levels for crawl efficiency and clear user navigation; use internal links and bread-crumbs to surface important pages.
   - Canonicalization & faceting: include only canonical URLs in sitemaps. Exclude session, cart, auth, filter query permutations unless they are canonical and indexable.

2. Sitemap Types:
   - XML Sitemap (primary):
     - Purpose: serve machine-readable list of canonical pages to crawlers, include `loc`, `lastmod`, optional `changefreq`, `priority` and `xhtml:link` alternates for locales.
     - Structure: create a `sitemap_index.xml` that references smaller sitemaps by content type:
       - sitemap_products.xml (all product detail pages)
       - sitemap_categories.xml (category pages)
       - sitemap_pages.xml (about, policies, support, blog index)
       - sitemap_tools.xml (tools pages and canonical result endpoints)
       - sitemap_images.xml (optional if you prefer separate image sitemaps; images can also be embedded in product sitemaps)
     - Inclusion rules: include canonical product, category, tool, and public static pages. Exclude `/admin/`, `/api/`, `/cart/`, `/checkout/`, auth endpoints, and private user dashboards like `/collection/` (unless explicitly public).
     - Extensions: use `image` namespace for product images; include `xhtml:link rel="alternate" hreflang` entries if you serve multi-locale content (en/zh).
     - Size limits: obey 50,000 URLs / 50MB uncompressed — shard sitemaps and reference them from `sitemap_index.xml` if needed.

   - HTML Sitemap (human-facing):
     - Purpose: aid users and assist crawlers discovering site hierarchy. Place at `/sitemap/` or `/sitemap.html` and link from the footer.
     - Structure: grouped lists: Shop (categories) -> Featured products, Tools -> Utility pages, Support -> Policies & contact, Blog -> Topics. Use pagination or collapse sections for very large catalogs.

   - Image Sitemap:
     - Purpose: ensure important product and gallery images are discovered and associated with the canonical page.
     - Implementation: embed `<image:image>` entries in product sitemaps or generate `sitemap_images.xml` with `<image:loc>`, `<image:caption>`, `<image:title>`, and (where applicable) `<image:license>`.
     - Optimization: use optimized formats (WebP/AVIF), include meaningful `alt` and `caption` text in page markup, and reference final CDN URLs (HTTPS, absolute).

   - Video Sitemap (only if applicable):
     - If you publish product demos, how-to videos, or tool walkthroughs, include a `sitemap_videos.xml` with required fields: `thumbnail_loc`, `title`, `description`, `content_loc` or `player_loc`, `duration`, `publication_date`.

3. Sitemap Submission:
   - Google Search Console:
     1) Add and verify the `https://appaw.store` property (prefer Domain property if possible).
     2) Go to Sitemaps > Add a new sitemap > submit `sitemap_index.xml` (enter only the filename or full path).
     3) Monitor the Sitemaps report and Coverage for indexed URLs and errors; re-submit after major structural updates.
   - Bing Webmaster Tools:
     1) Add and verify site.
     2) Submit `sitemap_index.xml` in the Sitemaps section.
     3) Monitor index and crawl errors.
   - Ping endpoints (for automated notifications):
     - Google: `https://www.google.com/ping?sitemap=https://appaw.store/sitemap_index.xml`
     - Bing: `https://www.bing.com/ping?sitemap=https://appaw.store/sitemap_index.xml`
   - robots.txt:
     - Place at `/public/robots.txt`. Example minimal config:
       User-agent: *
       Allow: /
       Disallow: /admin/
       Disallow: /api/
       Disallow: /cart/
       Disallow: /checkout/
       Disallow: /auth/
       # If collection remains private:
       Disallow: /collection/
       Sitemap: https://appaw.store/sitemap_index.xml
     - Ensure robots.txt is reachable and lists the sitemap URL(s).

4. Ongoing Maintenance:
   - Generation cadence:
     - Regenerate or update product sitemaps on publish/update events (webhook-backed). For small sites a nightly full regeneration is sufficient; large catalogs should use incremental updates.
     - Touch `lastmod` with the resource's authoritative `updatedAt` timestamp.
   - Automation & triggers:
     - On product create/update/delete: update product sitemap shard and ping search engines.
     - On deploy: run a sitemap generation job to catch static page changes.
     - Cache generated sitemaps in memory or filesystem and serve gzipped versions (`sitemap.xml.gz`) to reduce bandwidth.
   - Monitoring:
     - Monitor Search Console / Bing reports for sitemap errors, 404s, or blocked resources.
     - Run weekly link checks to detect broken internal links and orphan pages.
     - Alert on sitemap generation failures and HTTP 5xx responses when serving sitemaps.
   - Policy for removed pages:
     - Prefer 301 redirects for moved pages; use 410 for intentionally removed content.
     - Remove permanently deleted pages from sitemaps and allow search engines to deindex naturally; optionally submit removal requests in Search Console for urgent cases.
   - Periodic review:
     - Quarterly taxonomy review (categories, tags) to ensure sitemaps reflect business priorities.
     - Validate sitemaps with an XML validator after structural changes.

5. Technical Considerations & Implementation Options:
   - Preferred generation method for this Next.js app:
     - Automated server-side generation: build a server route (e.g., `/api/sitemap` or `/sitemap.xml`) that composes a `sitemap_index.xml` and shards using current DB / product feed. Cache results and regenerate on content webhooks.
     - Use `next-sitemap` (npm) for a quick, supported setup; it supports robots, sitemap indexes, and alternate hreflang entries.
     - For very large catalogs, generate per-shard sitemaps (by date range, by ID blocks, or by content-type) and publish a sitemap index.
   - Platform constraints:
     - Next.js (custom): full control; implement dynamic sitemap endpoints or build-time generation with ISR.
     - WordPress: use Yoast/RankMath; they handle sharding and image/video sitemaps.
     - Shopify: built-in sitemap generation — supplement if you host additional dynamic tools or pages off-platform.
   - Security & privacy:
     - Never expose private user dashboards or tokenized URLs in sitemaps.
   - Performance:
     - Serve gzipped sitemaps; use short cache TTLs for dynamic sitemaps but respect freshness for search engines when content changes.
   - Validation & testing:
     - Use Search Console’s sitemap tester and an XML validator.
     - Run a headless render to confirm server-produced routes include correct canonical links and that sitemaps match rendered pages.

Quick next steps I can take for you:
 - Implement a Next.js `/sitemap_index.xml` generator (automated, incremental) and add `Sitemap:` to [public/robots.txt](public/robots.txt).
 - Run a headless validation of key routes and the final sitemap (requires `npm install` / build in this environment or a staging URL).

I've appended this strategy to [docs/seo-pillars.md](docs/seo-pillars.md).
