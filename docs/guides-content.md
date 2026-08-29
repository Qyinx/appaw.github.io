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
- Action: **提交鑑定** for the general act of sending cards to PSA. Appaw's Hong Kong service name is **PSA 評級代送** (EN: **PSA grading submission**) at `/business/psa-grading/` — not 代送鑑定 (legacy). Keep 評級 off product words (not 評級卡); 評級 is fine in the service name and for numeric grades.
- Avoid legacy **送評** and abbreviated **送鑑** in new body copy (meta keywords may keep search variants)
- Centering: **置中** — not 居中
- Avoid Simplified variants (保护壳, 鉴定卡, 视频, etc.)
- **Register:** formal written Chinese (書面語) — not Cantonese colloquial (口語). Avoid 唔、嘅、喺、俾、睇、揀、點樣、搞反、chip/dull 等口語或中英夾雜
- **Full phrases:** do not shorten for brevity. Examples: 查看現有進度 (not 查進度); 面交評估卡況及提交 (not 面交交卡); 請勿等待 (not 勿等); 白白付出成本 (not 白付費用)

| Avoid (abbrev / vague) | Use (full 書面語) |
|------------------------|-------------------|
| 送評 | 提交鑑定 |
| 查進度 / 查詢進度 (body) | 查看現有進度 |
| 追溯進度 | 於網上查看批次現有進度 |
| 面交交卡 | 面交評估卡況及提交 |
| 送鑑 / 付送鑑費 (body) | 提交鑑定 / 支付鑑定費用 |
| 勿等 / 勿假設 | 請勿等待 / 請勿假設 |
| 勿用 / 勿平放 / 勿以 / 勿信任 / 勿單… | 請勿使用 / 請勿平放 / 請勿以 / 請勿信任 / 請勿單憑… |
| 雖已 / 雖進步（省略「然」） | 雖然已 / 雖然進步 |
| 定期再生（乾燥劑） | 定期再更換 |
| 追卡 | 重點收藏的卡牌 / 重點單張（依語境） |
| 白付費用 / 費用白付 | 白白付出成本 |
| 盲目送鑑 | 未完成置中評估前提交鑑定 |
| 不稀奇 | 並不罕見 |
| 一併損失 | 一併蒙受損失 |
| 置中 + 表面 + 邊角 | 置中、表面狀況與邊角完整度 |
| 展示、攜帶、交易、寄送 | 用於展示、外出攜帶、交易轉售或郵寄運送時 |
| 值得送 / 不宜送 | 值得支付鑑定費用的情況包括… / 不宜支付鑑定費用的情況包括… |

**UI short labels** (nav/buttons only): `預約交卡`, `查詢進度`, service name `PSA 評級代送` (EN: `PSA Grading Submission`).

Full glossary: [`seo-pillars.md`](seo-pillars.md) § Terminology policy (ZH).

### Length, density, and service-page scope

These rules apply to **collector guides and business/service i18n** (e.g. `/business/psa-grading/` in `src/i18n`).

- **ZH body must be complete 書面語 paragraphs.** Titles may be concise; body copy, subheads, and list explanations must be full sentences with clear cause and condition. Prefer one or two extra clauses over telegram-style slogans. Do not shorten for brevity when that makes meaning unclear.
- **EN may stay punchier** (short hooks, numbers first). **ZH is not optimized for minimal word count.**
- **Humanizer vs length:** strip AI filler (此外, 值得注意的是, crucial, landscape, 全面涵蓋, 賦能, etc.) and marketing fluff, but **never shorten ZH into fragments** to “sound more human.”
- Anti-example (forbidden): 「顯微鏡驗屍。有圖有真相。風險自負。」
- Prefer: 「我們以顯微鏡與強光檢測邊角、表面壓痕等瑕疵，並透過 WhatsApp 傳送微距照片供您判斷。若卡況不足以支持提交鑑定，我們會主動建議暫緩，以免徒增費用。」

### FAQ freeze (hub / service pages)

When evolving `/business/psa-grading/` and similar service hubs:

- **Do not rewrite existing FAQ Q&A** strings in `src/i18n` (EN or ZH).
- **Append-only** for new service questions.
- **Terminology rename exception:** customer-facing「BAT 參考編號」→「參考編號」(EN: “BAT reference code” → “reference code”) is allowed as phrase-only swap; keep code-format helpers such as “Starts with BAT-”.
- Guide `faq[]` in guide content files still follows normal edit rules when that guide itself is being revised.

### PSA hub vs advisor split

- Hub `/business/psa-grading/`: **grading-submission-first** (H1/title, how-to, batches, book, pricing). Condition advice is a mid-page teaser only.
- Advisor `/business/psa-grading/advisor/`: full advisor / trust / aftercare positioning.

### Service Value Proposition & Messaging Standard

All PSA grading submission service copy across guides and i18n should incorporate Appaw's core service value proposition:

> 我們為客戶提供現場卡況初步評估服務，協助檢測置中比例、表面壓痕與邊角狀況並評估可能的分數。同時附設基本清潔保養，有效降低鑑定過程中的扣分風險，全力為您的珍藏爭取最高評級。

- **現場卡況初步評估：** 門市現場協助評估卡況（置中比例、表面壓痕、邊角完整度）並預測可能的分數門檻。
- **基本清潔保養：** 提交前進行基本表面除塵與清潔保養，有效降低鑑定過程中的扣分風險。
- **全力爭取最高評級：** 協助客戶客觀判斷，避免不必要的鑑定成本，全力為珍藏爭取最高評級。

### Human-like Rewriting Reference Examples (zh-HK)

Use the following real rewrite pairs as references when adjusting tone or generating zh-HK content:

#### 1. Avoid Telegraphic Fragments & Machine Translations (去電報式碎句與翻譯腔)

| Anti-Pattern (AI / Fragmented) | Refined Human-like zh-HK |
|--------------------------------|--------------------------|
| 「黑光燈便宜，桌上放一支。常摸鑑定卡的話，值得備。」 | 「手持式波長 365nm 或 395nm 的 UV 黑光燈，是辨識假殼與偽造標籤成本最低且極為有效的物理檢測工具。對於經常進行二手交易或收藏高價鑑定卡的藏家而言，隨身配備一支黑光燈能即時過濾絕大多數低劣高仿。」 |
| 「塑膠質感：真品堅硬、清澈、重量適中，邊緣焊接平整...」 | 「真品採用高清澈度的硬質壓克力，邊緣焊接超音波接縫極為平整且不含膠水痕跡；內部固定卡片的內槽四角應呈完美的 90 度直角，而非圓角。」 |
| `{ label: '必對項目', value: '照片、年份、角色、等級、標記' }` | `{ label: '必須核對項目', value: '卡牌照片、年份、角色名稱、評級分數與特殊標記' }` |
| `{ label: '通過意味', value: '過第一關，仍需後續檢查' }` | `{ label: '查證結果定義', value: '數據相符僅代表完成第一關，仍需進行實物細節檢測' }` |
| `{ label: '完整流程', value: '裸卡 → 提交鑑定 → 鑑定卡磚 → 加裝鑑定卡保護殼' }` | `{ label: '完整流程', value: '由裸卡評估、提交鑑定到加裝外層保護殼的完整程序' }` |

#### 2. Avoid Template-style AI Transitions (重寫生硬 AI 銜接句 `bridge`)

| Rigid AI Transition | Natural Logical Transition |
|---------------------|----------------------------|
| `'門檻清楚了。接下來看置中如何影響市場溢價。'` | `'釐清官方的置中比例門檻後，下一步是瞭解置中表現如何直接塑造卡牌的二手市場溢價。'` |
| `'量表讀完，再看市場如何為完美品相定價。'` | `'熟悉量表等級與扣分標籤後，以下透過國際公開拍賣的指標紀錄，直觀呈現頂級品相在二次市場所引發的溢價效益。'` |
| `'查詢能過，不代表實物對。第二步：十餘元的 UV 黑光燈，多數賣家不願讓買家測試。'` | `'官方數據庫記錄相符僅代表完成第一關；要確認實物外殼與標籤未被替換，下一步需運用 UV 黑光燈檢測防偽墨水反應。'` |
| `'了解換殼的處理範圍與限制，有助於判斷您的情況是否只需更新外殼外觀。'` | `'釐清兩者的分野後，以下詳細說明換殼（Reholder）的服務範疇、作業細節與潛在限制。'` |

#### 3. Natural Context & HK Environmental Nuances (融合自然語境與香港環境語感)

- **Air & Humidity:** Instead of generic "氣候潮濕", describe concrete Hong Kong experiences: 「香港室內相對濕度長年維持於 70–80%，若鑑定卡長期開架擺放且環境濕度持續高於 60%，標籤邊緣容易出現起霧，全息閃卡表面亦可能產生微小的紙張變形。」
- **Service Value Integration:** Avoid copy-pasting identical promo templates into consecutive paragraphs. Adapt naturally according to the section focus: 「香港藏家可前往 138 Arena 門市面交，Appaw 提供專業驗卡與清潔保養服務，全力協助珍藏爭取最佳評級。」

### Decision Matrix & Math Framework Standards (決策矩陣與期望值分析規範)

For decision-based guides (such as `regrade-or-reholder`, `grade-or-protect-first`, `psa-10-centering-requirements`), articles MUST include a structured comparison table and an Expected Value (EV) calculation framework to help collectors make financially rational decisions:

#### 1. Standard Comparison Matrix (Reholder vs Regrade)

| 評估維度 (Factor) | 換殼服務 (Reholder) | 重新評級 (New Submission / Regrade) |
|------------------|-------------------|------------------------------------|
| **服務費用 (Fee)** | $25–$35 美金 | $80–$150+ 美金 |
| **作業時間 (Timeline)** | 15–20 個工作天 | 40–60 個工作天 |
| **評級結果 (Outcome)** | 保留原本分數 (100% 相同) | 可能升級、降級或維持不變 |
| **證書編號 (Cert #)** | 保留原版證書編號 | 發放全新證書編號 |
| **適用情境 (Best for)** | 卡殼刮花、裂開、標籤起霧，且滿意現有分數 | 舊編號 PSA 9（懷疑評低）且 9 分與 10 分市場差價 > $200 美金 |

#### 2. Expected Value Math Rule (期望值算式)
Guides analyzing score upgrades must state the EV rule clearly in prose:
$$\text{Expected Value (EV)} = (\text{PSA 10 Value} \times \text{Prob}) + (\text{PSA 9 Value} \times (1 - \text{Prob})) - \text{Submission Fees}$$
*Rule of thumb:* Only attempt a Regrade if expected value is at least 1.5x to 2x the current slab value. Otherwise, choose Reholder or keep the current slab.

---

### Search Intent & Mobile CTR Optimization Rules (搜尋意圖與行動端 CTR 優化)

With 73% of site traffic originating from mobile devices, guide metadata and content leads must follow strict mobile CTR rules:

1. **Lead Sentence Numbers & Proof (前 15 字結論與數據):**
   - The first 1–2 sentences of the `lead` must give a direct answer containing concrete numbers (e.g. `55/45`, `$25–35`, `70–80% RH`).
   - Example: 「PSA 10 的官方置中門檻為正面 55/45、背面 75/25。只要正面超出 60/40 比例，卡牌即會直接降至 PSA 9 以下。」
2. **CTR Retargeting for Low-CTR High-Impression Pages:**
   - High impression pages (e.g. `psa-grading-standards` with 2,000+ impressions) must include local decision value in the title: `PSA 10 評級標準拆解：置中 55/45 門市初步評估 | Appaw Store`.
3. **Structured Data Rich Snippets:**
   - Every guide must include `faq[]` with 3–5 Q&As formatted for `FAQPage` JSON-LD to trigger mobile accordion snippets on SERPs.

### Mobile guide layout (on-page UX)

CTR rules above cover SERP; these cover the article chrome once the reader lands (see also `docs/style.md` §2.4.1):

1. **In-page TOC on phone:** Long guides ship a collapsible “On this page” TOC below the spec panel on `<lg`. Desktop sticky TOC at `lg+` stays unchanged (`GuideArticle` + `GuideToc`).
2. **Wide tables:** Keep the `GuideTable` horizontal-scroll pattern (`overflow-x-auto` + `min-w-*`). Do not redesign cells into stacked cards in content docs.
3. **FAQ:** Single accordion UI + `FAQPage` JSON-LD — do not duplicate FAQ prose into `sections[]`.
4. **Tap / type:** Follow style-guide floors (≥44px taps, ≥12px type) for any new in-guide controls.

---

## Content structure (`GuideContent`)

| Field | Purpose |
|-------|---------|
| `lead` | Hero hook: stakes + specificity in first 1–2 complete sentences (40–60 words ideal for snippets); second sentence should carry a number or concrete check (e.g. 55/45, $25+, 2–4×) |
| `heroSpecs` | Highest-stakes stat first; each `value` must be a complete phrase, not a fragment or shorthand list |
| `sections[]` | H2 blocks; **first paragraph directly answers the section title** and gets `.guide-aeo-answer` |
| `sections[].bridge` | Optional one-sentence logical transition to the next section (起承轉合) |
| `faq[]` | 3–5 natural-language Qs with **full-sentence answers**; rendered by `GuideFaq` (accordion UI) + `FAQPage` JSON-LD — single source; do not duplicate in `sections` |
| `midCta?` | Optional inline CTA after `afterSectionId` (P0 retention guides) |
| `sources[]` | Cited outbound links |
| `cta` | End-of-article primary product/tool link |

### Section writing rules (zh-HK)

1. **Expand fragments into full 書面語 sentences** — do not leave outline-style shorthand (e.g. 「置中 + 表面 + 邊角」→ 「置中、表面狀況與邊角完整度」).
2. **Logical bridges between paragraphs** — each H2 block should read as起承轉合; use `bridge` to tease the next section when helpful.
3. **Do not shorten sentences for brevity** — prefer complete causal clauses over comma-separated keyword lists.
4. **Specs and table cells** — same rule: full phrases, not telegraphic shorthand.

### Service flow guides (e.g. PSA grading submission)

Guides that describe Appaw's Hong Kong PSA grading submission workflow should follow **chronological sections**, not a single mixed outline:

1. **Audience fit** — who should submit vs who should wait (economic + condition gates).
2. **Service roles** — what the partner venue (138 Arena) vs Appaw each handle.
3. **Drop-off / intake** — face-to-face process, BAT reference assignment, tier selection.
4. **Pre-submit screening** — centering, surface, corners; link to centering tool and economics guides.
5. **Tracking & pickup** — phone + BAT lookup, timeline stage meanings, pickup window.
6. **Post-grading** — cert verification, outer slab protector, related preservation guides.

Use `midCta` after the pre-submit section when the centering tool is the natural next step. Keep service fees and policy details aligned with `/business/psa-grading/` and `psa-pricing.ts`.

**Partner role attribution (138 Arena + Appaw):** split venue/payment from service operations in both zh-HK and EN copy.

| Situation | zh-HK | EN |
|-----------|-------|-----|
| Venue / hours | 138 Arena、合作面交場地 | 138 Arena, partner drop-off location |
| Service provider | Appaw Store、Appaw PSA 評級代送 | Appaw Store, Appaw PSA grading submission |
| On-site payment | 於 138 Arena 現場支付服務費（收款支援） | pay the service fee on-site at 138 Arena (payment collection support) |
| Service operations | Appaw 核對清單、分配 BAT、轉送 PSA、發出取件通知 | Appaw verifies your list, assigns BAT references, forwards batches to PSA, sends pickup notices |
| Avoid | 店員、未指明的「我們」、138 Arena 代送 | unattributed "staff", ambiguous "we", "138 Arena submits to PSA" |

Add a `service-roles` section after audience fit when the guide explains the Hong Kong PSA grading submission workflow.

**Customer burden:** customer-facing copy should emphasize Appaw on-site help. Do not list tier selection, declared value, sleeving, or written lists as mandatory customer prep — frame as optional self-checks (centering) or on-site assistance. Transport tip: sleeve cards en route to avoid scratches.

## Voice

- **Humanizer:** no em dashes (`—` / `——`) in body copy; no AI filler (此外, 值得注意的是, crucial, landscape, etc.); remove marketing fluff (展館級, 媲美, 完美結合, 市面上最強) — replace with specs; **do not shorten sentences** for brevity
- **Service hubs:** follow Locale § Length/density and FAQ freeze above when editing `psaGradingPage` / related business strings
- **Hooks:** cost / contrarian / proof — second sentence must carry a number or concrete check
- **Avoid:** LinkedIn bait ("The brutal truth?"), fake urgency, "Complete Guide" title suffix
- **Arrow chains:** replace `A → B → C` step lists in prose with full sequential sentences (tables may keep compact rows)

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
