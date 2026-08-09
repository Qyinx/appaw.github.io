SEO Draft — Pillar Pages

Last updated: 2026-08-09 — Mobile layout ops note (safe-area / tap / type) beside GSC device split; see `docs/style.md` §2.4.1.

Prior batch (2026-08-08) — GSC 28-day search performance integration, intent clusters (psa 換殼, 138 arena, psa 殼損), CTR retargeting for high-impression pages, mobile SERP snippet rules.

Prior batch (2026-07-20) — PSA track page SEO hygiene + humanized EN/ZH copy (duplicate H1 fix, speakable AEO, meta keywords).

Prior batch (2026-07-13) — HK TCG grading keyword cluster; zh-HK full-phrase copy pass (guides-content.md).

Prior batch (2026-07-12) — PSA submission hub + track SEO: indexable metadata, JSON-LD, sitemap, llms.txt, AEO blocks, homepage/business internal links.

Prior batch (2026-07-02) — Protector recommended prices centralized in `src/lib/products/protector-pricing.ts` (HKD 82 single / 92 gradient).

Prior batch (2026-07-02) — **PSA magnetic case** keyword cluster: `SEO_KEYWORD_MAP`, metadata keywords, JSON-LD `alternateName`, product overview + FAQ (EN+ZH), `llms.txt` / `index.md`. Meta description retargeted for magnetic+PSA+case proximity. Official product name unchanged; aluminum still retired.

Prior batch (2026-06-17) — `identify-fake-psa-slabs` content + SEO refresh: cert-era meta (#43 UV, #27/#5xxxxxxx label), slug keywords, guide hero OG images, `llms.txt` / Agent Skills citation hints.

Prior batch (2026-06-13) — Regrade/reholder cluster: centering tool slab mode + verdict UI, `regrade-or-reholder` guide (EN+ZH), expanded `SEO_KEYWORD_MAP`, `WebApplication.featureList`, AEO blocks on centering pillar, Explore internal links, `llms.txt` / `index.md` GEO refresh.

Prior batch (2026-06-09): Keyword retargeting for slab-case cluster: product/home titles, H1s, JSON-LD `alternateName`, and EN↔ZH search-term map (`SEO_KEYWORD_MAP` in `src/lib/product-names.ts`).

Prior batch (2026-06-08): Agent Readiness / AI Search pass ([isitagentready.com](https://isitagentready.com/appaw.store)): Content-Signal in `robots.txt`, RFC 8288 `Link` headers + HTML `llms.txt` discovery, Agent Skills index, guides pillar (`/guides/` + 5 articles incl. fake PSA slab guide), `llms.txt` guide table refresh.

Prior batch (2026-06-05): Full-site i18n routing (`/zh/...` mirrors), homepage H1 restructure, `llms.txt` for GEO, sitemap refresh with hreflang alternates, product rename to Graded Slab Aluminum Protector / 鑑定卡保護殼, Quarry Bay showroom + partner purchase channels, and metadata centralisation (`HOME_SEO`, `PRODUCT_NAME`, `locale-metadata.ts`).

**Changelog summary**

| Date | Area | Changes |
|------|------|---------|
| 2026-08-09 | Mobile layout ops | Device-split note expanded: safe-area sticky CTAs, ≥44px taps, ≥12px type on hub/guides/tools; cross-link `docs/style.md` §2.4.1. |
| 2026-08-08 | GSC Search Intent & CTR | 28-day GSC search data integration: search intent clusters (`psa 換殼`, `138 arena`, `psa 殼損`, `psa 鑑定 香港 流程`), mobile CTR optimization (73% mobile clicks), low-CTR high-impression retargeting (`psa-grading-standards`). |
| 2026-07-20 | PSA track SEO | `/business/psa-grading/track/` hygiene: single H1, visible subtitle + AEO helpers, form `h2`, humanized EN/ZH meta + UI copy, track keywords/OG alt, `WebPage.speakable` → `.psa-grading-track-aeo-answer`, `llms.txt`/`index.md` soft pass. |
| 2026-07-13 | HK TCG grading SEO | `SEO_KEYWORD_MAP` + `HK_SEO_KEYWORDS` cluster (香港 TCG 鑑定, TCG 提交鑑定). `PSA_GRADING_SEO` title/description retarget. `knowsAbout`, `llms.txt`, `guides-content.md` full-phrase zh-HK copy rules. |
| 2026-07-12 | PSA submission SEO | `/business/psa-grading/` + `/track/` indexable (EN+ZH). `PSA_GRADING_SEO`, JSON-LD (Service/HowTo/FAQ/WebApplication), sitemap, llms.txt/index.md, AEO classes, live-service banner, internal links from `/`, `/business/`. |
| 2026-07-02 | Protector pricing | Recommended retail prices centralized in `src/lib/products/protector-pricing.ts`: HKD 82 (single color), HKD 92 (gradient). UI + Product/Service JSON-LD read from single module; price strings removed from i18n. |
| 2026-07-02 | PSA magnetic case SEO | Added **PSA magnetic case** / **magnetic PSA slab case** (EN) ↔ **磁吸PSA卡殼** (ZH) to `SEO_KEYWORD_MAP`, product metadata keywords, JSON-LD `alternateName`, overview copy + FAQ (EN+ZH), `llms.txt` / `index.md`. Meta description retargeted for magnetic+PSA+case proximity. Official product name unchanged; aluminum still retired. |
| 2026-06-27 | UV glass product rename | EN: **Graded Slab UV Glass Protector** (H1: UV Tempered Glass). ZH: **磁吸防UV鑑定卡保護殼** (H1: 防UV強化玻璃). Keyword cluster: tempered glass / UV glass slab case (EN), 防UV玻璃 / 強化玻璃卡殼 (ZH). Retired aluminum/CNC from marketing copy; ZH frame **金屬邊框** (not 金屬框架 / 鋁合金). URL unchanged `/products/psa-protectors/`. `PRODUCT_NAME`, i18n, JSON-LD `material`, guides, `llms.txt`, `index.md`, Agent Skills. |
| 2026-06-17 | Fake PSA guide SEO | `identify-fake-psa-slabs` meta descriptions + leads + heroSpecs (cert #43/#27/#5xxxxxxx). `GUIDE_KEYWORDS` + per-guide `og:image` from `heroImage` in `guides/metadata.ts`. `llms.txt` + Agent Skills topic/citation refresh. Guide media: UV/label video + old-label photo refs. |
| 2026-06-13 | Regrade cluster | Centering tool: Graded slab photo mode, regrade/reholder verdict strip, slab workflow H2, PAA H2 + `.centering-aeo-answer`, +3 FAQs (8 total). Guide `regrade-or-reholder` (EN+ZH). `SEO_KEYWORD_MAP` + `CENTERING_SEO` + `centeringMetadata` keywords. `WebApplication.featureList`. Card trading Explore → centering link. `storeJsonLd.knowsAbout` expanded. |
| 2026-06-09 | AEO pass | Guide `Article` + `speakable` (`.guide-lead`, `.guide-aeo-answer`). PAA question H2s on `psa-10-centering-requirements`, `display-graded-cards`. `storeJsonLd.sameAs` + Google Maps. See `FULL-AUDIT-REPORT.md` AEO section. |
| 2026-06-09 | Guides batch 2 | `display-graded-cards` (EN + ZH) — desk/shelf/wall display, graded card display case intent. |
| 2026-06-09 | Keyword retargeting | Product + home titles/H1s retargeted to **PSA slab case / graded card case / PSA card protector** cluster (EN) and **PSA卡殼 / 鑑定卡殼 / PSA卡保護殼** (ZH). `SEO_KEYWORD_MAP` in `product-names.ts`. JSON-LD `alternateName` expanded. Guide `choose-35pt-slab-protector` titles updated. |
| 2026-06-08 | Agent Readiness | `Content-Signal` in `robots.txt`. RFC 8288 `Link` header (`api-catalog`, `describedby`, `sitemap`) in `_headers` + `next.config.js`. `/.well-known/api-catalog` (RFC 9727). Agent Skills index v0.2.0 + digest script. `public/index.md` markdown twin. HTML `llms.txt` link in layout. |
| 2026-06-08 | Guides pillar | `/guides/` index + 5 evergreen articles (35PT fit, UV, PSA 10 centering, grade vs protect, fake PSA slabs). Auto sitemap via `GUIDE_SLUGS`. `Article` + `ItemList` JSON-LD. Inline product links in prose (`[label](href)`). Hero backgrounds per guide. |
| 2026-06-08 | llms.txt | Added `identify-fake-psa-slabs` row; citation hint for fake PSA / cert verification. |
| 2026-06-05 | i18n URLs | All public routes mirrored under `/zh/...` via thin re-exports (`scripts/generate-zh-routes.mjs`). `alternates.languages` on EN + ZH metadata. Toggle navigates `/path` ↔ `/zh/path`. `DocumentMeta` + `LocalLink` for client title/lang. |
| 2026-06-05 | Homepage `/` | Single `<h1>` = `home.hero.h1Keyword`; brand tagline demoted to `<p>`. Spec `<table>` for 35PT / UV / N52. Purchase channels (`RetailPartners`) with showroom, 咭之島 partner, Etsy/Carousell/WhatsApp. |
| 2026-06-05 | Product naming | EN: **Graded Slab Aluminum Protector**. ZH: **鑑定卡保護殼** / 磁吸鋁合金鑑定卡保護殼. `src/lib/product-names.ts` canonical source. |
| 2026-06-05 | Terminology | Site-wide ZH: 鑑定卡 (not 評級卡) for graded cards/slabs. |
| 2026-06-05 | GEO | `public/llms.txt` — brand summary, pillar URLs (EN + ZH), purchase channels, crawl rules. Linked from `robots.txt`. |
| 2026-06-05 | Sitemap | `src/lib/seo/sitemap-config.ts` + `sitemap.ts` — EN + zh-HK URL pairs with `alternates.languages`. Removed dead `/products/` URL. |
| 2026-06-05 | `/collection/` | Landing page made **indexable** (`robots: index, follow`). Added keywords, OG/Twitter, sr-only copy, `HowTo` JSON-LD, sitemap entry (priority 0.75). App routes (`/list/`, `/auth/`, `/card/`) stay `noindex` + `robots.txt` Disallow. |
| 2026-06-02 | Homepage SEO | Spec table, keyword-rich hero, services bento i18n. |
| Earlier | Product pillar | `/products/psa-protectors/` overview, specs, FAQ, JSON-LD. Centering tool repositioned. |

Goal: Provide SEO-ready title/meta, JSON-LD, sitemap, and GEO context for pillar pages to improve Google reach, SERP CTR, and LLM citation accuracy.

Site OG image (used across the site): `/images/og-image.png` — recommended size 1200x630, used for homepage and default social previews.

---

### GSC 28-Day Search Performance & Intent Benchmark (28-Day Data Baseline — 2026-08-08)

**Site Performance Metrics (28 Days):**
- **Total Clicks**: 291 | **Total Impressions**: ~7,500+ (Daily impressions surged from ~150 to ~700/day)
- **Top Countries**: Hong Kong (152 clicks / 5.62% CTR) and Taiwan (95 clicks / 8.38% CTR) account for >85% of organic traffic.
- **Top Device Split**: Mobile devices account for **73.2% of total clicks** (213 mobile / 75 desktop / 3 tablet). Mobile SERP titles and meta descriptions must be optimized for compact screens. **Layout ops (same traffic split):** hub/guides/tools sticky CTAs must use safe-area padding, interactive targets ≥44px, and body type ≥12px — see `docs/style.md` §2.4.1 Responsive / Mobile.

**Top High-Performing Pages:**
1. `/zh/tools/card-centering/`: 84 clicks, 516 impressions, **16.28% CTR** (Top conversion engine for raw card & slab pre-grading).
2. `/zh/guides/regrade-or-reholder/`: 70 clicks, 1,255 impressions, **5.58% CTR** (High intent for slab damage & regrade decision).
3. `/zh/products/psa-protectors/`: 24 clicks, 331 impressions, **7.25% CTR**.
4. `/zh/business/psa-grading/`: 21 clicks, 460 impressions, **4.57% CTR**.

**High-Opportunity (Low CTR / High Impression) Pages:**
- `/guides/psa-grading-standards/`: **2,040 impressions but only 0.20% CTR** (4 clicks). Retargeting Meta Title and adding `FAQPage` rich snippets will capture high-volume "psa 10 standards" intent.
- `/guides/uv-protection-graded-cards/`: 267 impressions, 0 clicks. Needs HK climate (70-80% RH) and UV fading hook.
- `/tools/card-centering/` (EN): 563 impressions, 2.84% CTR (vs 16.28% on ZH mirror). Needs English SERP snippet alignment with high-converting Chinese patterns.

**Core Search Intent Clusters & Conversion Strategy:**

1. **Slab Damage & Regrade Decision (`psa 換殼`, `psa 換 殼 費用`, `psa 殼損`, `reholder`)**:
   - *User Need*: Broken/scratched slab or candidate for PSA score upgrade. Needs cost ($25-35 reholder vs $80+ regrade), risk, and turnaround comparison.
   - *Target URL*: `/guides/regrade-or-reholder/` & `/tools/card-centering/` (slab mode).
2. **HK Local Submission & Trust (`138 arena`, `香港psa鑑定`, `psa 鑑定 香港 流程`, `psa 收費`)**:
   - *User Need*: Local HK drop-off (138 Arena), clear HKD tiers, on-site preliminary condition assessment, and BAT reference tracking.
   - *Target URL*: `/business/psa-grading/` & `/business/psa-grading/track/`.
3. **Pre-Grading Evaluation (`卡牌鑑定工具`, `psa 10 standards`, `card centering tool`)**:
   - *User Need*: Self-evaluates raw/slab centering (55/45 front) before paying submission fees.
   - *Target URL*: `/tools/card-centering/` & `/guides/psa-10-centering-requirements/`.
4. **Slab Protection & Climate (`psa保護殼`, `psa卡殼`, `psa 鑑定 卡 防潮`)**:
   - *User Need*: Protects high-value slabs against HK humidity (70-80% RH), UV fading, and scratch damage.
   - *Target URL*: `/products/psa-protectors/` & `/guides/uv-protection-graded-cards/`.

---

0) Homepage (`/` and `/zh/`) — IMPLEMENTED

- **URLs:** `https://appaw.store/` (EN), `https://appaw.store/zh/` (zh-HK UI + metadata)
- **Metadata:** `HOME_SEO` in `src/lib/product-names.ts` → `homeMetadata` / `zhHomeMetadata` in `src/lib/seo/metadata.ts`
- **EN title:** PSA Slab Cases & Graded Card Protectors, Hong Kong – Appaw Store
- **ZH title:** Appaw Store 香港｜PSA卡殼・鑑定卡殼・PSA卡保護殼
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
- Metadata (`psaProtectorsMetadata` in `src/lib/seo/metadata.ts`): page-owned title/description/canonical, OG + Twitter tags, keyword cluster around "PSA card protector / UV glass slab case / tempered glass card protector" plus Chinese keywords in `keywords` meta.
- Primary Keywords (EN): "PSA slab case", "graded card case", "PSA card protector"
- Supporting long-tails (EN): "35PT PSA slab case", "magnetic graded card case", "PSA magnetic case", "magnetic PSA slab case", "graded card display case", "tempered glass slab case", "PSA UV glass case", "N52 magnetic card holder"
- Primary Keywords (ZH): "PSA卡殼", "鑑定卡殼", "PSA卡保護殼"
- Supporting long-tails (ZH): "35PT 鑑定卡磚", "磁吸鑑定卡殼", "防UV 鑑定卡殼", "防UV玻璃", "強化玻璃卡殼", "香港 PSA卡殼", "寶可夢鑑定卡", "CGC 鑑定卡磚"
- Product display name (EN): **Graded Slab UV Glass Protector** (nav short: Graded Slab Protector) — broader than PSA-only, matches CGC compatibility; use **case/protector** terms in titles and H1; lead **tempered UV glass** in meta/H1
- Product display name (ZH): **鑑定卡保護殼** (full: 磁吸防UV鑑定卡保護殼); search-facing titles use **PSA卡殼 / 鑑定卡殼 / PSA卡保護殼**; frame spec **金屬邊框** (avoid 鋁合金 / 金屬框架 in marketing copy)

**Keyword mapping (EN search query ↔ ZH equivalent)**

Canonical source: `SEO_KEYWORD_MAP` in `src/lib/product-names.ts`. Use these pairs in titles, meta descriptions, H1s, JSON-LD `alternateName`, and guide copy — do not literal-translate EN product names into ZH metadata.

| EN (Google Ads / SERP query) | ZH (use in `/zh/` metadata & copy) | Notes |
|------------------------------|-------------------------------------|-------|
| PSA slab case | PSA卡殼 | Primary product keyword; use in ZH title/H1 |
| graded card case | 鑑定卡殼 | Broader case intent; pair with 35PT in body |
| PSA card protector | PSA卡保護殼 | Protector intent; secondary in ZH title |
| slab case | 卡殼 | Short form; body copy only unless space allows |
| graded card display case | 鑑定卡展示殼 | Display guide (`display-graded-cards`) |
| PSA regrade | PSA重新評級 | Guide `regrade-or-reholder` + centering slab mode |
| PSA reholder | PSA換殼 | Top GSC query (23.8% CTR); guide `regrade-or-reholder` |
| PSA slab damage | PSA殼損 | GSC query; slab damage decision guide |
| regrade downgrade risk | 重新評級降級風險 | Centering FAQ + guide H2 |
| graded slab centering | 鑑定卡置中 | Centering slab workflow H2 |
| check centering before regrading | 重新評級前置中檢查 | Tool + guide CTA |
| UV glass slab case | 防UV玻璃鑑定卡殼 | Product meta + body |
| tempered glass card protector | 強化玻璃卡殼 | Product meta + body |
| PSA magnetic case | 磁吸PSA卡殼 | Product meta, FAQ, JSON-LD `alternateName`; compatibility copy only — not official product name |
| magnetic PSA slab case | 磁吸PSA卡殼 | Long-tail variant of above |
| HK TCG grading | 香港 TCG 鑑定 | PSA grading hub |
| Hong Kong TCG card grading | 香港卡牌鑑定 | PSA grading hub |
| TCG grading submission HK | TCG 提交鑑定 | PSA grading hub |
| 138 Arena PSA submission | 138 Arena PSA 代送 | Top GSC query (31.2% CTR); local drop-off venue |
| PSA submission process HK | PSA 鑑定香港流程 | GSC query; submission step-by-step guide |
| PSA grading fees HK | PSA 鑑定費用 / PSA 收費 | GSC query; pricing & tier selection |
| PSA grading standards | PSA 10 評級標準 | GSC query (2,000+ imp); guide `psa-grading-standards` |
| Pokémon TCG grading HK | 寶可夢 TCG 提交鑑定 | PSA grading + centering |

**Translation rules**

- EN titles lead with **case** vocabulary (`PSA slab case`, `graded card case`); EN body uses brand name **Graded Slab UV Glass Protector**; lead tempered UV glass in H1/meta — avoid aluminum/CNC in marketing copy.
- ZH titles/H1s use **PSA卡殼 / 鑑定卡殼 / PSA卡保護殼** — not literal renderings like 「PSA 板案例」 or 「評級卡案例」.
- Keep **鑑定卡** for graded cards/slabs (never 評級卡 in marketing copy).
- Brand product name (`PRODUCT_NAME.zh.full` = 磁吸防UV鑑定卡保護殼) stays in nav and body; search metadata uses the mapping table above.
- Frame material (ZH specs only): **金屬邊框** — not 金屬框架 or 鋁合金 in customer-facing copy.
- Do **not** mix Simplified Chinese variants (保护壳, 鉴定卡) in zh-HK metadata.

**Terminology policy (ZH)**

| Context | Preferred term | Avoid |
|---------|----------------|-------|
| Graded card / slab | 鑑定卡、鑑定卡牌、鑑定卡磚 | 評級卡、評級卡牌、評級卡磚 |
| Submit to PSA (general) | 提交鑑定 | 送評、評級（動詞）、送鑑（正文缩略） |
| Appaw HK proxy service | 代送鑑定、PSA 收藏卡代送鑑定 | 送評服務、收件查詢（作標題） |
| Protector product | 鑑定卡保護殼、磁吸防UV鑑定卡保護殼、磁吸卡殼、PSA 保護殼 | 評級卡保護殼、保護卡磚、鋁合金、金屬框架 |
| Frame (specs) | 金屬邊框 | 金屬框架、鋁合金框架 |
| Grade score UI (PSA 10 etc.) | Keep 評級 for numeric grade labels only | — |

- Implemented changes:
  - Text-rich product description: a new "Product Overview" section (`overview` i18n block, en + zh) renders a ~180-word, keyword-dense paragraph pair below the hero — covering 35PT PSA compatibility, >95% UV/anti-fade protection, N52 neodymium closure, 74g tempered UV glass / metal frame build, and Pokémon/sports/MTG use cases. Gives Google substantial indexable on-page copy beyond image alt text.
  - Expanded "Technical Specifications" grid (`specs` array in `page.tsx`): now 6 cards — Size, Weight, Materials, UV Protection, plus new **Compatibility** (Standard 35PT PSA Slabs) and **Closure System** (N52 Neodymium Magnets) rows, each with bilingual labels/values/descriptions.
  - Crawler-visible Chinese: expanded `sr-only` block in `layout.tsx` mirrors `zh.psaProtectorPage.overview.body` plus spec summary (site SSRs English by default; this block is the primary zh indexable surface for crawlers).
  - Internal linking: homepage buy buttons (`HomeClient.tsx`), `Footer.tsx`, `BusinessClient.tsx`, and `CardTradingClient.tsx` point to `/products/psa-protectors`; reciprocal link from PSA page to `/tools/card-centering/` added before FAQ.
  - Image SEO: hero and feature carousel alts wired to i18n (`heroImageAlt`, `business.cardProtector.features`).
  - Terminology: all marketing zh copy in `src/i18n/zh.ts` uses 鑑定卡/鑑定卡牌; card-trading typos fixed (`鯨合金`→`鋁合金`, `礴鐵`→`釹磁鐵`).

- JSON-LD (in `src/app/products/psa-protectors/layout.tsx`): full `Product` with brand, SKU `APPAW-PSA-ALU-001`, `alternateName` includes 鑑定卡保護殼 / UV Glass Slab Protector, `material`: Tempered UV-Blocking Glass + Metal Frame, weight/width/height/depth `QuantitativeValue`s, two `Offer`s (HKD), `additionalProperty` (UV Protection >95%, Magnet Grade N52 Neodymium, Compatibility Standard 35PT PSA Slabs, Closure Type Magnetic), plus `BreadcrumbList` and `FAQPage`. `aggregateRating` removed — no on-page review source.

- Manual follow-up (cannot be automated): submit `https://appaw.store/products/psa-protectors/` via Google Search Console "URL Inspection → Request Indexing" to accelerate re-crawl of the new copy.

Open Graph / Twitter: handled by `psaProtectorsMetadata` (summary_large_image). OG alt text includes bilingual product name.

**Open improvements (tracked)**

- Replace placeholder `og:centering.png` with real analyzer screenshot (centering pillar).
- ~~Consider separate `/zh/` routes or dynamic `html lang` for full bilingual indexing.~~ **Done (2026-06-05):** `/zh/...` mirrors + `DocumentMeta` sets `html lang` on client.
- Add visible review section before restoring `aggregateRating` in JSON-LD.
- Optional: sr-only Chinese block on `/business/`.
- ~~Content marketing / blog pillar~~ **Partially done (2026-06-08):** `/guides/` evergreen articles cover 35PT fit, UV/humidity, PSA 10 centering, grade vs protect, fake PSA slabs. `hkGuide` on product page remains supplementary.
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

2) My Collection (/collection/) — **indexable** (landing only; `/collection/list/`, `/collection/auth/`, `/collection/card/*` remain `noindex`)
- Implemented Title: "My Collection — Manage & Track Your Trading Cards | Appaw Store"
- Implemented Meta Description: "Add, organize and value your graded card collection. Track buy prices, PSA/BGC grades, cert numbers, and listing prices in portfolios — free private dashboard."
- Implemented H1: "Your Graded Collection Hub" (client) + sr-only "Manage Your Graded Card Collection" (server)
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

3) Card Centering Tool / PSA 10 Analyzer (/tools/card-centering/)

> Updated 2026-06-13 — **Post-grade cluster:** Graded slab photo mode, regrade/reholder verdict strip, slab workflow H2, PAA block "Should you regrade or reholder?", guide `/guides/regrade-or-reholder/`. Head term **"card centering tool"** unchanged in title/H1.

> Updated 2026-06-09 — Title/H1 retargeted to lead with **"card centering tool"** (5K/mo). Canonical strings in `CENTERING_SEO` (`src/lib/product-names.ts`).

> Updated 2026-06-01 — Repositioned from commercial brand page to utility-first tool page (strongest organic-traffic pillar).

- **Title / H1:** `Free Card Centering Tool & PSA 10 Analyzer` (EN); `免費卡牌置中工具 & PSA 10 分析器` (ZH) — do not retitle away from head term; regrade intent lives in description, H2s, FAQ, and guide.
- **Meta description:** `CENTERING_SEO.*.description` — mentions raw + slab photos and regrade screening (≤160 chars EN).
- **Voice (2026-07):** PG-style contrarian hooks aligned with `/guides/` (short sentences, numbers as proof, honest limits; no em dash in EN). ZH mirror uses 書面語 + glossary (置中、鑑定卡、送鑑). **AEO speakable:** `.centering-aeo-answer` on page lead, PSA requirements intro, and regrade block; FAQ accordion via shared `GuideFaq` (first item gets `.guide-aeo-answer`).
- **Keywords:** `centeringMetadata` — adds `PSA regrade`, `PSA reholder`, `regrade downgrade risk`, `graded slab centering`, ZH equivalents.

**Keyword clusters**

| Cluster | Terms | On-page surface |
|---------|-------|-----------------|
| Pre-grade (primary) | card centering tool, PSA 10 centering, pokemon card centering tool | H1, HowTo, PSA table |
| Post-grade (2026-06-13) | PSA regrade, PSA reholder, regrade downgrade, graded slab centering | Slab mode UI, verdict strip, H2, FAQ, guide |
| Technical | tilt correction, slab photo, corner loupe | Slab workflow H2, tool controls |

**On-page content (implemented)**

- 4-step HowTo (raw card) — mirrors `HowTo` JSON-LD.
- **Slab photo workflow** (5 steps) — H2 `How to measure centering on a graded slab photo`; covers tilt, corner loupe, guide layers, verdict.
- **PAA block** — H2 `Should you regrade or reholder your PSA slab?` + `.centering-aeo-answer` speakable paragraph; link to `/guides/regrade-or-reholder/`.
- PSA / BGS / SGC / CGC tolerance table (55/45 front for PSA 10).
- Why centering matters + product/trading internal links.
- **FAQ (8)** — includes regrade vs reholder, downgrade risk, slab photo measurement; `FAQPage` JSON-LD.

**Tool UX (SEO-relevant)**

- **Photo type:** Raw card | Graded slab — ZH UI label **鑑定卡** (`photoMode` toggle).
- **Verdict strip** (slab mode only): Regrade candidate / Borderline / Hold grade / Downgrade risk — derived from centering zone; disclaimer in copy (not corners/surface/holder).
- **Adjust image:** zoom, rotate, H/V tilt — supports slab glare / perspective correction (marketed in slab workflow).

**Open Graph / Twitter:** `og:image` = `/images-optimized/og/og-centering.png` (`CENTERING_OG_IMAGE` in `product-names.ts` → `centeringMetadata`). Source PNG: `public/images/og/og-centering.png` (gitignored) → run `npm run optimize-images` → commit `public/images-optimized/og/og-centering.png`.

**JSON-LD** (`CenteringPageContent.tsx`):

- `WebApplication` + `featureList` from `CENTERING_SEO.*.featureList`
- `BreadcrumbList`, `HowTo` (4 steps), `FAQPage` (8 Q&As)

**Internal linking**

- Header nav `nav.centeringTool`
- Homepage services bento → centering card
- `/products/psa-protectors/` cross-link before FAQ
- Card trading hero **Explore** → `linkCentering` (2026-06-13)
- Guide hub: `regrade-or-reholder` ↔ `psa-10-centering-requirements`, `identify-fake-psa-slabs`

**Terminology (regrade cluster)**

| Context | EN | ZH (zh-HK) | Avoid |
|---------|----|----|-------|
| Same grade, new case | reholder | 換殼 | 重新鑑定 (for reholder) |
| Full re-score | regrade | 重新評級 | 換殼 (for regrade) |
| Grade label on slab | PSA 10, numeric grade | PSA 10、數字評級 | 評級卡 (use 鑑定卡) |
| Graded slab (tool / guide UI) | Graded slab | 鑑定卡 | 鑑定卡磚 |
| Tool disclaimer | screening aid, not a grader | 篩選參考，非評級機構 | guaranteed upgrade |

**Open improvements**

- ~~Replace placeholder `og-centering.png`~~ **Done (2026-06-13):** `public/images/og/og-centering.png` → `images-optimized/og/og-centering.png` via `npm run optimize-images`; wired in `CENTERING_OG_IMAGE` + `centeringMetadata`.
- Worked examples (well-centred vs off-centre) on pillar page.
- GSC: request indexing for `/guides/regrade-or-reholder/` + `/zh/...` after deploy.

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
- `/collection/`: `WebApplication` + `BreadcrumbList` + `HowTo` are injected in `src/app/collection/page.tsx`. `robots: { index: true, follow: true }`; included in `sitemap-config.ts`. Private app routes (`/collection/list/`, etc.) remain `noindex`.
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
- **Public:** `/collection/` landing (collection manager marketing page)
- **Do not index:** `/admin/`, `/collection/list/`, `/collection/auth/`, `/collection/card/`, `/business/card-trading/`
- ZH terminology policy (鑑定卡 not 評級卡)

**robots.txt:** AI crawlers explicitly allowed on public pages; `llms.txt` URL noted in header comment.

**Maintenance:** Update `llms.txt` whenever product name, showroom address, pillar URLs, or crawl policy changes. Keep in sync with `sitemap-config.ts` and `product-names.ts`.

**HTML discovery (implemented 2026-06-08):** `<link rel="alternate" type="text/plain" href="/llms.txt">` in `src/app/layout.tsx`.

**HTTP Link header (implemented 2026-06-08, RFC 8288):** `public/_headers` + `next.config.js` on `/`:

```http
Link: <https://appaw.store/.well-known/api-catalog>; rel="api-catalog",
      <https://appaw.store/llms.txt>; rel="describedby"; type="text/plain",
      <https://appaw.store/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json",
      </sitemap.xml>; rel="sitemap"
```

> **Deploy note:** `_headers` applies on Cloudflare Pages / Netlify. If [isitagentready](https://isitagentready.com/appaw.store) still reports missing Link header after deploy, add the same value in Cloudflare **Rules → Transform Rules → Modify Response Header** for hostname `appaw.store` path `/`.

---

Agent Readiness / AI Search ([isitagentready.com](https://isitagentready.com))
================================================================================

**Tool:** Cloudflare [Is It Agent Ready?](https://isitagentready.com) — scores Discoverability, Content, Bot Access Control, and Capabilities (MCP, Agent Skills, API catalog, OAuth, commerce).

**isitagentready.com scan map (2026-06-08)** — full result list from production scan:

| # | Check | Verdict | Action |
|---|--------|---------|--------|
| 1 | **Link response header** (RFC 8288) | ✅ Fixed (deploy) | `rel="api-catalog"` + `rel="describedby"` on `/` — `public/_headers`, `next.config.js` |
| 2 | **DNS-AID** (SVCB/HTTPS + DNSSEC) | ⏭ Skip | DNS panel only; marketing site — document if enterprise agents need it |
| 3 | **Markdown negotiation** (`Accept: text/markdown`) | ⚠️ Partial | Static `public/index.md` + `_headers`; **full pass** needs Cloudflare **Markdown for Agents** ([docs/cloudflare-markdown-negotiation.md](cloudflare-markdown-negotiation.md)) |
| 4 | **API catalog** (RFC 9727) | ✅ Fixed (deploy) | `public/.well-known/api-catalog` — linkset for centering tool + `llms.txt` service-desc |
| 5 | **OAuth/OIDC discovery** | ⏭ Skip | No agent-facing API; Auth0 is user login for `/collection/app` only |
| 6 | **OAuth protected resource** (RFC 9728) | ⏭ Skip | Same — do not publish fake OAuth metadata |
| 7 | **auth.md** (agent registration) | ⏭ Skip | WorkOS pattern for SaaS APIs; not applicable to slab retail |
| 8 | **MCP server card** | ⏭ Skip | No MCP server; content site not tool host |
| 9 | **Agent Skills index** (RFC v0.2.0) | ✅ Fixed (deploy) | `$schema`, `type`, `url`, `digest: sha256:…` — run `node scripts/update-agent-skills-digest.mjs` after SKILL edits |
| 10 | **WebMCP** (`navigator.modelContext`) | ⏭ Backlog | Optional client tool on centering page; Chrome experimental |
| 11 | **x402** HTTP payments | ⏭ Skip | Sales via showroom / Etsy / Carousell / WhatsApp |
| 12 | **MPP** machine payments | ⏭ Skip | No paid API routes |
| 13 | **UCP** universal commerce | ⏭ Skip | No agent checkout |
| 14 | **ACP** agentic commerce | ⏭ Skip | No agent checkout |

**Implemented files (batch 3b):**

| File | Purpose |
|------|---------|
| `public/.well-known/api-catalog` | `application/linkset+json` — centering tool anchor |
| `public/.well-known/agent-skills/index.json` | Discovery v0.2.0 with `digest` |
| `public/index.md` | Homepage markdown twin (linked from `llms.txt`) |
| `scripts/update-agent-skills-digest.mjs` | Re-hash SKILL.md → `index.json` |

**Markdown negotiation — Cloudflare Markdown for Agents (required for scan #3 pass):**

Static export cannot vary `Content-Type` on `GET /` by `Accept` header. Enable in Cloudflare **AI Crawl Control** → **Markdown for Agents** (Pro+). Cloudflare converts origin HTML to Markdown when `Accept: text/markdown` is present; response includes `Content-Type: text/markdown` and `x-markdown-tokens`. See [docs/cloudflare-markdown-negotiation.md](cloudflare-markdown-negotiation.md). Verify: `npm run verify:markdown-negotiation`.

Fallback without negotiation: `https://appaw.store/index.md` (`Content-Type: text/markdown` via `_headers`).

**Post-deploy checklist:**

1. Deploy static export + `_headers`
2. Verify: `curl -sI https://appaw.store/ | grep -i link`
3. Verify: `curl -sI https://appaw.store/.well-known/api-catalog`
4. Verify: `curl -s https://appaw.store/.well-known/agent-skills/index.json`
5. Re-scan [isitagentready.com/appaw.store](https://isitagentready.com/appaw.store)

**Maintenance:** After editing `appaw-site-overview/SKILL.md`, run `node scripts/update-agent-skills-digest.mjs`. Keep `llms.txt`, api-catalog, and Link header URLs in sync when guides or tools change.

---

4) Collector Guides (`/guides/`) — **IMPLEMENTED (2026-06-08)**

- **URLs:** `https://appaw.store/guides/` (index) + `/guides/{slug}/` (EN); `/zh/guides/...` mirrors
- **Registry:** `src/lib/guides/registry.ts` — `GUIDE_SLUGS` drives sitemap, static params, `ItemList` on index
- **Current slugs:** see `GUIDE_SLUGS` in registry (auto-synced to sitemap). Authoring playbook: [`docs/guides-content.md`](guides-content.md)
- **Metadata:** `guideMetadata()` / `guideMetadataForSlug()` — per-article title, description, canonical, OG `article`, hreflang
- **JSON-LD:** `Article` + `BreadcrumbList` on each slug page; `FAQPage` when `faq[]` set; `HowTo` on identify-fake + psa-10-centering; `ItemList` on `/guides/`
- **GEO:** Run `node scripts/sync-llms-guides.mjs` after adding slugs — updates `llms.txt` guide table from registry
- **Internal links:** Guide prose supports `[label](href)` → `LocalLink` (locale-aware). Product CTA + related guides footer on every article
- **Hero art:** `heroImage: '/images/background/{slug}.png'` → `images-optimized/` via `getImagePath()`; run `npm run optimize-images` after adding source PNG

**SEO keywords (`identify-fake-psa-slabs`):** fake PSA slab, PSA cert verification, UV blacklight PSA authentication, PSA label hologram, PSA microtext CLCT, counterfeit graded card, 假 PSA 鑑定殼, PSA 證書查詢, UV 黑光燈 鑑定卡

**Open improvements:**

- Static `/guides/{slug}/index.md` for agent markdown negotiation
- Cross-link guides from product `hkGuide` block and centering tool FAQ
- `BlogPosting` vs `Article` — keep `Article` unless author bylines added

---

5) PSA Grading Submission (`/business/psa-grading/`) — **IMPLEMENTED (2026-07-12)**; track hygiene **2026-07-20**

- **URLs:** `https://appaw.store/business/psa-grading/` (hub), `https://appaw.store/business/psa-grading/track/` (lookup); `/zh/...` mirrors
- **Metadata:** `PSA_GRADING_SEO` in `src/lib/product-names.ts` → `psaGradingMetadata` / `zhPsaGradingMetadata` / track variants in `src/lib/seo/metadata.ts`
- **EN title:** Hong Kong TCG Grading Submission | PSA – Appaw Store
- **ZH title:** 香港 TCG 卡牌 PSA 代送鑑定 | 138 Arena – Appaw Store
- **Track EN title:** Track PSA Submission | Appaw Store
- **Track description:** Look up PSA batch with phone + BAT on 138 Arena receipt (both required)
- **Indexing:** `robots: { index: true, follow: true }` on hub + track (EN + ZH)
- **JSON-LD:** Hub — `Service`, `Offer`×N (from `psa-pricing.ts`), `HowTo`, `FAQPage`, `BreadcrumbList`, `WebPage` with `speakable` → `.psa-grading-aeo-answer`. Track — `WebApplication`, `BreadcrumbList`, `WebPage` with `speakable` → `.psa-grading-track-aeo-answer`
- **AEO:** Hub `.psa-grading-aeo-answer` on hero definition + PAA; track subtitle + form helpers use `.psa-grading-track-aeo-answer`
- **Track semantics (2026-07-20):** single visible H1 (no sr-only duplicate); Lookup panel `h2`; humanized EN/ZH `psaGradingTrack` + `PSA_GRADING_SEO` track fields
- **Sitemap:** hub priority 0.85, track 0.70 (`sitemap-config.ts`)
- **GEO:** `llms.txt` + `index.md` pillar rows; HKD tier snippet for agents
- **Internal links:** Header nav, 4 guides (inbound), hub reciprocal links, `/business/` ItemList #3, BusinessClient section, homepage services panel
- **Keyword map:** `PSA submission Hong Kong` ↔ `PSA代送鑑定`; `PSA card submission` ↔ `收藏卡送鑑` (see `SEO_KEYWORD_MAP`)

**Post-deploy:** Request indexing for hub + track EN/ZH in GSC.

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
| `/business/psa-grading/` | 0.85 | weekly |
| `/business/psa-grading/track/` | 0.70 | weekly |
| `/collection/` | 0.75 | monthly |
| `/about/` | 0.8 | monthly |
| `/tools/card-centering/` | 0.8 | weekly |
| `/guides/` | 0.7 | monthly |
| `/guides/{slug}/` (registry-driven) | 0.7 | monthly |
| `/privacy/` | 0.2 | yearly |

**Excluded (by design):**
- `/business/card-trading/` and `/business/card-trading/[id]/` — `robots.txt` Disallow + `robots: noindex` on metadata
- `/collection/list/`, `/collection/auth/`, `/collection/card/*` — private app (noindex)
- `/admin/`, `/style-guide/` — admin or dev
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
6. Re-run [isitagentready.com/appaw.store](https://isitagentready.com/appaw.store) after deploy; verify `Link` header and `/.well-known/agent-skills/index.json` return 200
