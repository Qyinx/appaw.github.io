SEO Draft — Pillar Pages

Goal: Provide SEO-ready title/meta and JSON-LD examples for the three pillars to improve Google reach and SERP CTR.

Site OG image (used across the site): `/images/og-image.png` — recommended size 1200x630, used for homepage and default social previews.

1) PSA Protectors (/products/psa-protectors/)
- Suggested Title: "PSA Card Protectors — Premium PSA-Grade Aluminum & Sleeves | Appaw Store"
- Suggested Meta Description: "Shop PSA-grade card protectors — aluminum magnetic cases and archival sleeves engineered to protect graded cards. Fast shipping worldwide."
- Suggested H1: "PSA-Grade Card Protectors"
- Primary Keywords: "PSA card protector", "PSA protectors", "PSA aluminum case"
- Supporting long-tails: "best PSA card protector", "magnetic PSA card case", "UV-protection card protector"

- Open Graph / Twitter
  - og:title: same as Title
  - og:description: same as Meta
  - og:image: /images/og-protectors.png
  - twitter:card: summary_large_image

- JSON-LD (Product):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PSA Card Protector",
  "description": "Premium PSA-grade aluminum card protector with UV-blocking glass and N52 magnets.",
  "url": "https://appaw.store/products/psa-protectors/",
  "image": ["https://appaw.store/images/og-protectors.png"],
  "brand": { "@type": "Brand", "name": "Appaw Store" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

Notes: Add product prices/offers where available and rich images. Include aggregateRating and reviews when available.

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

3) Card Centering Analyzer (/tools/centering/)
- Suggested Title: "Card Centering Analyzer — Instant Center Grade Tool | Appaw Store"
- Suggested Meta Description: "Upload a photo or use your camera to get an instant centering grade (%) and downloadable report for trading cards. Free and easy to use."
- Suggested H1: "Card Centering Analyzer"
- Primary Keywords: "card centering analyzer", "centered card grader", "PSA centering tool"
- Supporting long-tails: "how to check card centering", "centered grade percent tool", "PSA centering calculator"

- Open Graph / Twitter: screenshot of analyzer UI (result overlay) for `og:image`.

- JSON-LD (WebApplication / Tool):
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Card Centering Analyzer",
  "description": "Upload a card photo for instant centering grade and exportable report. Useful for grading preparation.",
  "url": "https://appaw.store/tools/centering/",
  "applicationCategory": "EducationApplication",
  "author": { "@type": "Organization", "name": "Appaw Store" }
}
```

Notes: Provide sample result screenshots, explain measurement method (brief), and allow crawling of demo pages. Offer an FAQ section: "How accurate is the analyzer?" and "How to take photos for best results?" — these Q&As help appear in rich results.

---

General implementation checklist
- Ensure unique `title` and `meta description` per pillar page.
- Add breadcrumbs and JSON-LD `BreadcrumbList` where applicable.
- Add `og:image` and `twitter:image` sized for social previews (1200x630 recommended).
- Ensure each pillar page links to related blog/support content (internal links build theme authority).
- Add schema `Product`/`Service`/`WebApplication` JSON-LD to page head (`dangerouslySetInnerHTML` in Next layout/page).
- Submit/update sitemap.xml after changes and monitor Search Console for indexing.

Recommended next step
- I can implement these meta tags and JSON-LD snippets directly into the page components (`src/app/products/psa-protectors/page.tsx`, `src/app/collection/page.tsx`, `src/app/tools/centering/page.tsx`). Would you like me to implement those now?

Validation (source-level check)

I performed a source-level inspection of JSON-LD injection points across the app (no full Next build). Results:

- Root site schema: `WebSite` + `Store` are injected in `src/app/layout.tsx` (site-level JSON-LD and GA script). These are intentionally global and present on all pages.
- `/products/psa-protectors/`: `Product`, `BreadcrumbList`, and `FAQPage` are injected in `src/app/products/psa-protectors/layout.tsx` (single source for product data).
- `/collection/`: `WebApplication` + `BreadcrumbList` are injected in `src/app/collection/page.tsx` (page-owned WebApplication schema). Note: this page is currently `robots: { index: false }`.
- `/tools/centering/`: `WebApplication` + `BreadcrumbList` are injected in `src/app/tools/centering/layout.tsx` (page-owned metadata + JSON-LD).

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
- `src/app/products/psa-protectors/layout.tsx`, `src/app/business/card-trading/page.tsx`, `src/app/collection/page.tsx`, and `src/app/tools/centering/layout.tsx` still own per-page schemas but can be migrated to use the centralized factories to keep wording consistent.

Recommended follow-ups

- Migrate `psa-protectors` and `business/card-trading` to use the factories for `Product`/`FAQ` creation (these pages sometimes construct dynamic objects — factories can accept data and return a normalized `Product` object).
- Run a headless render (build + puppeteer/playwright) to validate runtime HTML and confirm only intended JSON-LD appears on each route.
