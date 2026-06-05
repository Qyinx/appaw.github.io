SEO Draft — Pillar Pages

Last updated: 2026-06-05 (batch 2) — Full-site i18n routing (`/zh/...` mirrors), homepage H1 restructure, `llms.txt` for GEO, sitemap refresh with hreflang alternates, product rename to Graded Slab Aluminum Protector / 鑑定卡保護殼, Quarry Bay showroom + partner purchase channels, and metadata centralisation (`HOME_SEO`, `PRODUCT_NAME`, `locale-metadata.ts`).

**Changelog summary**

| Date | Area | Changes |
|------|------|---------|
| 2026-06-05 | i18n URLs | All public routes mirrored under `/zh/...` via thin re-exports (`scripts/generate-zh-routes.mjs`). `alternates.languages` on EN + ZH metadata. Toggle navigates `/path` ↔ `/zh/path`. `DocumentMeta` + `LocalLink` for client title/lang. |
| 2026-06-05 | Homepage `/` | Single `<h1>` = `home.hero.h1Keyword`; brand tagline demoted to `<p>`. Spec `<table>` for 35PT / UV / N52. Purchase channels (`RetailPartners`) with showroom, 咭之島 partner, Etsy/Carousell/WhatsApp. |
| 2026-06-05 | Product naming | EN: **Graded Slab Aluminum Protector**. ZH: **鑑定卡保護殼** / 磁吸鋁合金鑑定卡保護殼. `src/lib/product-names.ts` canonical source. |
| 2026-06-05 | Terminology | Site-wide ZH: 鑑定卡 (not 評級卡) for graded cards/slabs. |
| 2026-06-05 | GEO | `public/llms.txt` — brand summary, pillar URLs (EN + ZH), purchase channels, crawl rules. Linked from `robots.txt`. |
| 2026-06-05 | Sitemap | `src/lib/seo/sitemap-config.ts` + `sitemap.ts` — EN + zh-HK URL pairs with `alternates.languages`. Removed dead `/products/` URL. |
| 2026-06-02 | Homepage SEO | Spec table, keyword-rich hero, services bento i18n. |
| Earlier | Product pillar | `/products/psa-protectors/` overview, specs, FAQ, JSON-LD. Centering tool repositioned. |

Goal: Provide SEO-ready title/meta, JSON-LD, sitemap, and GEO context for pillar pages to improve Google reach, SERP CTR, and LLM citation accuracy.

Site OG image (used across the site): `/images/og-image.png` — recommended size 1200x630, used for homepage and default social previews.

0) Homepage (`/` and `/zh/`) — IMPLEMENTED

- **URLs:** `https://appaw.store/` (EN), `https://appaw.store/zh/` (zh-HK UI + metadata)
- **Metadata:** `HOME_SEO` in `src/lib/product-names.ts` → `homeMetadata` / `zhHomeMetadata` in `src/lib/seo/metadata.ts`
- **EN title:** Graded Slab Aluminum Protector & Trading Card Supplies HK – Appaw Store
- **ZH title:** 鑑定卡鋁合金保護殼｜35PT 磁吸 Slab 防褪色 - Appaw Store 香港
- **H1 structure (Gemini-corrected):**
  - One `<h1>`: `home.hero.h1Keyword` (product-intent keywords)
  - Brand tagline (`headlineLines`) in `<p>` — visual only
  - Section headings: `home.services.title`, `retailPartners.title`, `home.cta.title` as `<h2>`
- **Crawlable product specs:** `<table>` under services bento (35PT, UV >95%, N52, 74g, dimensions, HK origin)
- **Purchase channels:** `RetailPartners.tsx` — Quarry Bay showroom (Manly Plaza), 咭之島 partner, online (Etsy / Carousell / WhatsApp)
- **Internal links:** Primary CTA → `/products/psa-protectors/`; secondary → `/business/card-trading/`, `/tools/card-centering/`
- **hreflang:** `alternates.languages: { en: '/', 'zh-HK': '/zh/' }` on both homepage metadata exports

**Post-deploy:** Request indexing for `/` and `/zh/` in Google Search Console.

---

1) PSA Protectors (/products/psa-protectors/) — IMPLEMENTED
- URL decision: KEEP `/products/psa-protectors/`. It is already clean, indexed, and contains the primary keyword "psa". Changing an established/indexed URL (e.g. to `/products/psa-card-aluminum-protector`) risks losing accumulated ranking equity for marginal slug gains, so no slug change and no redirect were applied. The legacy `/business/psa-protector` already 301-redirects here.
- Metadata (`psaProtectorsMetadata` in `src/lib/seo/metadata.ts`): page-owned title/description/canonical, OG + Twitter tags, keyword cluster around "PSA card protector / PSA aluminum case / magnetic PSA slab case" plus Chinese keywords in `keywords` meta.
- Primary Keywords (EN): "PSA card protector", "PSA protectors", "PSA aluminum case"
- Supporting long-tails (EN): "best PSA card protector", "magnetic PSA card case", "UV-protection card protector", "35PT PSA slab case", "N52 magnetic card holder"
- Primary Keywords (ZH): "鑑定卡保護殼", "磁吸鋁合金鑑定卡保護殼", "磁吸卡磚", "鋁合金保護殼"
- Supporting long-tails (ZH): "35PT 鑑定卡磚保護殼", "N52 磁吸鑑定卡殼", "防UV 鑑定卡保護殼", "香港鑑定卡保護殼", "寶可夢鑑定卡", "CGC 鑑定卡磚"
- Product display name (EN): **Graded Slab Aluminum Protector** (nav short: Graded Slab Protector) — broader than PSA-only, matches CGC compatibility
- Product display name (ZH): **鑑定卡保護殼** (full: 磁吸鋁合金鑑定卡保護殼)

**Terminology policy (ZH)**

| Context | Preferred term | Avoid |
|---------|----------------|-------|
| Graded card / slab | 鑑定卡、鑑定卡牌、鑑定卡磚 | 評級卡、評級卡牌、評級卡磚 |
| Protector product | 鑑定卡保護殼、磁吸鋁合金鑑定卡保護殼、磁吸卡磚 | 評級卡保護殼、PSA 保護殼（舊稱） |
| Grade score UI (PSA 10 etc.) | Keep 評級 for numeric grade labels only | — |

- Implemented changes:
  - Text-rich product description: a new "Product Overview" section (`overview` i18n block, en + zh) renders a ~180-word, keyword-dense paragraph pair below the hero — covering 35PT PSA compatibility, >95% UV/anti-fade protection, N52 neodymium closure, 74g aluminum/glass build, and Pokémon/sports/MTG use cases. Gives Google substantial indexable on-page copy beyond image alt text.
  - Expanded "Technical Specifications" grid (`specs` array in `page.tsx`): now 6 cards — Size, Weight, Materials, UV Protection, plus new **Compatibility** (Standard 35PT PSA Slabs) and **Closure System** (N52 Neodymium Magnets) rows, each with bilingual labels/values/descriptions.
  - Crawler-visible Chinese: expanded `sr-only` block in `layout.tsx` mirrors `zh.psaProtectorPage.overview.body` plus spec summary (site SSRs English by default; this block is the primary zh indexable surface for crawlers).
  - Internal linking: homepage buy buttons (`HomeClient.tsx`), `Footer.tsx`, `BusinessClient.tsx`, and `CardTradingClient.tsx` point to `/products/psa-protectors`; reciprocal link from PSA page to `/tools/card-centering/` added before FAQ.
  - Image SEO: hero and feature carousel alts wired to i18n (`heroImageAlt`, `business.cardProtector.features`).
  - Terminology: all marketing zh copy in `src/i18n/zh.ts` uses 鑑定卡/鑑定卡牌; card-trading typos fixed (`鯨合金`→`鋁合金`, `礴鐵`→`釹磁鐵`).

- JSON-LD (in `src/app/products/psa-protectors/layout.tsx`): full `Product` with brand, SKU `APPAW-PSA-ALU-001`, `alternateName` includes 鑑定卡保護殼 / 磁吸鑑定卡磚, material, weight/width/height/depth `QuantitativeValue`s, two `Offer`s (HKD), `additionalProperty` (UV Protection >95%, Magnet Grade N52 Neodymium, Compatibility Standard 35PT PSA Slabs, Closure Type Magnetic), plus `BreadcrumbList` and `FAQPage`. `aggregateRating` removed — no on-page review source.

- Manual follow-up (cannot be automated): submit `https://appaw.store/products/psa-protectors/` via Google Search Console "URL Inspection → Request Indexing" to accelerate re-crawl of the new copy.

Open Graph / Twitter: handled by `psaProtectorsMetadata` (summary_large_image). OG alt text includes bilingual product name.

**Open improvements (tracked)**

- Replace placeholder `og:centering.png` with real analyzer screenshot (centering pillar).
- ~~Consider separate `/zh/` routes or dynamic `html lang` for full bilingual indexing.~~ **Done (2026-06-05):** `/zh/...` mirrors + `DocumentMeta` sets `html lang` on client.
- Add visible review section before restoring `aggregateRating` in JSON-LD.
- Optional: sr-only Chinese block on `/business/`.
- Content marketing / blog pillar (e.g. 「如何選擇 35PT 卡磚？」、「鑑定卡防潮防 UV」) — not yet built; `hkGuide` section on product page is interim depth content.
- Backlinks from HK TCG creators and local card communities — outreach, not code.
- Physical showroom (primary): Shop No. 9, Basement, Manly Plaza, 995-997 King's Road, Quarry Bay (鰂魚涌英皇道995-997號萬利廣場地庫9號舖) — listed first in `RetailPartners`.
- Cooperative retail partners (e.g. 咭之島 Card The Land, Hung Hom) — retained alongside own showroom in `RetailPartners` + i18n.

**External SEO audit notes (2026-06-05, Gemini review) — response**

| Gemini finding | Status | Our response |
|----------------|--------|--------------|
| Mixed zh-HK / zh-CN / English on same view | **Partially fixed** | Homepage hero, services bento, footer, and nav CTAs now use i18n (`headlineLines`, `home.services.*`). SSR still defaults to `en` until user toggles zh — sr-only zh block on product layout compensates for crawlers. |
| Missing HK TCG keywords (PTCG, Slab, etc.) | **Fixed** | Woven into `zh.ts` copy, `HK_SEO_KEYWORDS`, product `hkGuide` section, and meta keywords. We use **鑑定卡** (not 評級卡) per brand terminology. |
| Weak Meta Title / Description | **Fixed** | `PRODUCT_NAME.*.metaTitle/metaDescription` in `product-names.ts` → `psaProtectorsMetadata`. |
| H1 not product-focused | **Fixed** | Homepage: single `<h1>` = `home.hero.h1Keyword`; brand tagline demoted to `<p>`. Section titles (`services`, `retailPartners`, `cta`) = `<h2>`. Product page `<h1>` = `psaProtectorPage.seoH1`. |
| Multiple H1s on homepage | **Fixed** | Only one `<h1>` per homepage; former duplicate H1 sections are `<h2>`. |
| Missing hreflang / zh route | **Fixed** | All public routes mirrored under `/zh/...` (thin re-exports, same components). `alternates.languages` on EN + ZH metadata + sitemap alternates. Language toggle navigates `/path` ↔ `/zh/path`. `DocumentMeta` syncs `<title>` + description client-side. |
| Thin content | **Improved** | Added `hkGuide` (~3 paragraphs) on product page + existing overview, specs, FAQ. Blog remains future work. |
| Image alt gaps | **Improved** | Hero/feature alts via i18n; zh alt includes product + PTCG context per Gemini example. |
| Centering tool traffic opportunity | **Already implemented** | `/tools/card-centering/` pillar + reciprocal link from product page; zh nav = 「卡牌置中量度工具」. |


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
- ~~Add internal links to this tool from the homepage and the `/products/psa-protectors/` page body.~~ Done (2026-06-05): homepage secondary CTA + PSA page centering cross-link section before FAQ.

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

GEO — LLM discoverability (`llms.txt`)
======================================

**File:** `public/llms.txt` → served at `https://appaw.store/llms.txt`

Purpose: Give LLM crawlers (GPTBot, Claude-Web, PerplexityBot, etc.) a concise, citation-friendly summary of what Appaw Store is, which URLs to prefer, purchase channels, and crawl boundaries. Complements JSON-LD for generative search / AI answers.

Contents:
- Brand one-liner + product definition (35PT PSA/CGC slab protector)
- EN + ZH pillar URL table with hreflang note
- Purchase channels (Quarry Bay showroom, 咭之島, Etsy/Carousell/WhatsApp)
- Free centering tool pointer
- JSON-LD types per route
- Contact / social
- **Do not index** list (`/admin/`, `/collection/`, `/business/card-trading/`)
- ZH terminology policy (鑑定卡 not 評級卡)

**robots.txt:** AI crawlers explicitly allowed on public pages; `llms.txt` URL noted in header comment.

**Maintenance:** Update `llms.txt` whenever product name, showroom address, pillar URLs, or crawl policy changes. Keep in sync with `sitemap-config.ts` and `product-names.ts`.

**Optional follow-up:** Add `<link rel="alternate" type="text/plain" href="/llms.txt">` in root layout if LLM discovery standards formalise.

---

Sitemap Strategy (implemented)
==============================

**Generator:** `src/app/sitemap.ts` (Next.js `MetadataRoute.Sitemap`, static export)
**Config:** `src/lib/seo/sitemap-config.ts` — single list of public EN paths; ZH URLs derived automatically.

**Included URLs (EN + zh-HK pairs, each with `alternates.languages`):**

| Path | Priority | changefreq |
|------|----------|------------|
| `/` | 1.0 | weekly |
| `/products/psa-protectors/` | 0.95 | weekly |
| `/business/` | 0.9 | weekly |
| `/about/` | 0.8 | monthly |
| `/tools/card-centering/` | 0.8 | weekly |
| `/products/graded-cards/` | 0.6 | monthly |
| `/privacy/` | 0.2 | yearly |

**Excluded (by design):**
- `/business/card-trading/` and `/business/card-trading/[id]/` — `robots.txt` Disallow + `robots: noindex` on metadata
- `/collection/`, `/admin/`, `/style-guide/` — private or dev
- `/products/` — no index page exists (removed from sitemap 2026-06-05)

**Submission:** `Sitemap: https://appaw.store/sitemap.xml` in `public/robots.txt`. Re-submit in GSC after deploy.

**Future (optional):** Shard into `sitemap_index.xml` + per-type sitemaps if URL count exceeds 50k or product catalog grows.

---

Sitemap Strategy (reference notes)
================================

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

**i18n routing (reference)**

| Module | Role |
|--------|------|
| `src/lib/i18n-routing.ts` | `localizedHref`, `toggleLocalePath`, `routeLanguage` |
| `src/lib/seo/locale-metadata.ts` | `withLocaleAlternates`, `zhRouteMetadata` |
| `src/lib/seo/page-meta.ts` | Client-side title/description per route |
| `src/app/zh/**` | Thin re-exports; regenerate via `node scripts/generate-zh-routes.mjs` |
| `src/components/LocalLink.tsx` | Locale-aware nav links (Header/Footer) |

**Post large-change checklist (GSC / Bing)**

1. Deploy to production
2. Submit `https://appaw.store/sitemap.xml` in Search Console (ping if needed)
3. Request indexing: `/`, `/zh/`, `/products/psa-protectors/`, `/zh/products/psa-protectors/`
4. Validate hreflang report (EN ↔ zh-HK pairs)
5. Confirm `https://appaw.store/llms.txt` is fetchable for GEO crawlers
