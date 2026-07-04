# Collector guides — content playbook

Registry-driven evergreen articles at `/guides/` (EN) and `/zh/guides/` (zh-HK Traditional Chinese).

## Add a new guide

1. Create `src/lib/guides/content/en/{slug}.ts` and `content/zh/{slug}.ts`
2. Append slug to `GUIDE_SLUGS`, `GUIDE_REGISTRY`, and `CONTENT` in [`registry.ts`](../src/lib/guides/registry.ts)
3. Add a `TOPICS` row in [`scripts/sync-llms-guides.mjs`](../scripts/sync-llms-guides.mjs) and run:
   ```bash
   node scripts/sync-llms-guides.mjs
   ```
4. Optional: extend `GUIDE_KEYWORDS` in [`metadata.ts`](../src/lib/guides/metadata.ts)
5. Deploy → re-submit sitemap in GSC → request indexing for EN + `/zh/` URL

Sitemap, static params, and index `ItemList` JSON-LD pick up new slugs automatically from `GUIDE_SLUGS`. **Do not hardcode guide counts** in copy or docs.

## Locale: zh-HK Traditional Chinese

- UI/metadata language tag: `zh-HK`
- Marketing terms: **鑑定卡 / 鑑定卡磚 / 鑑定卡保護殼** — not 評級卡
- Action: **送鑑 / 送評** — not 評級 as generic verb
- Centering: **置中** — not 居中
- Avoid Simplified variants (保护壳, 鉴定卡, 视频, etc.)
- **Register:** formal written Chinese (書面語) — not Cantonese colloquial (口語). Avoid 唔、嘅、喺、俾、睇、揀、點樣、搞反、chip/dull 等口語或中英夾雜

Full glossary: [`seo-pillars.md`](seo-pillars.md) § Terminology policy (ZH).

## Content structure (`GuideContent`)

| Field | Purpose |
|-------|---------|
| `lead` | Hero hook: stakes + specificity in first 1–2 sentences (40–60 words ideal for snippets) |
| `heroSpecs` | Highest-stakes stat first |
| `sections[]` | H2 blocks; first paragraph gets `.guide-aeo-answer` |
| `sections[].bridge` | Optional one-sentence open loop to next section |
| `faq[]` | Rendered by `GuideFaq` (accordion UI) + `FAQPage` JSON-LD — single source; do not duplicate in `sections` |
| `midCta?` | Optional inline CTA after `afterSectionId` (P0 retention guides) |
| `sources[]` | Cited outbound links |
| `cta` | End-of-article primary product/tool link |

## Voice

- **Humanizer:** no em dashes in body copy; no AI filler (此外, crucial, landscape, etc.)
- **Hooks:** cost / contrarian / proof — second sentence must carry a number or concrete check
- **Avoid:** LinkedIn bait ("The brutal truth?"), fake urgency, "Complete Guide" title suffix

## SEO checklist (per guide)

- [ ] `lead` works as meta description (via `guideMetadata`)
- [ ] `faq[]` present (3–5 natural-language Qs, EN + zh-HK)
- [ ] Step guides: consider `HowTo` JSON-LD (see [`page.tsx`](../src/app/guides/[slug]/page.tsx) for identify-fake + psa-10-centering pattern)
- [ ] Internal links to product, centering tool, related guides
- [ ] `updated` date bumped when content changes materially
- [ ] Run `node scripts/sync-llms-guides.mjs` if slug list changed
- [ ] Run `npm run lint:zh-guides` after editing zh content

## Post-publish

1. Verify EN + zh pages on localhost
2. Confirm FAQ renders once (not duplicated in prose)
3. GSC: request indexing for both URLs
4. Add reciprocal internal link from at least one pillar page
