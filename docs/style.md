# Appaw Store — Design System & Style Guide

**Status:** Draft foundation for design-system revamp — **light-first default** (June 2026)  
**Last updated:** 2026-08-09 — Responsive / Mobile layout rules for majority-mobile traffic

> **Light-first default (2026-06-06):** Site ships with light semantic tokens on `:root` (`--surface-bg: #FAFAF8`, flat panels, visible 1px borders). Dark theme is opt-in via `.dark` on `<html>` (style-guide preview toggle only for now). Noise overlay and panel drop-shadows apply in dark mode only. Components should use semantic Tailwind aliases (`text-text-primary`, `bg-surface-panel`, etc.) — not hardcoded `text-white` or dark hex backgrounds.

**Reference:** [Hermes Agent](https://hermes-agent.nousresearch.com/) (Nous Research) — neo-brutalist structure, terminal/retro-tech atmosphere, minimalist engineering discipline  
**Engineering baseline:** [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

---

## 1. Design Intent

Appaw Store sells precision hardware (graded slab protectors) and ships engineering-grade tools (card centering). The UI should feel **built**, not decorated — like a spec sheet you can operate.

### Aesthetic blend (Hermes-inspired)

| Layer | What to borrow | What to avoid |
|-------|----------------|---------------|
| **Neo-Brutalism** | Hard 1px borders, flat panels, label/value spec rows, visible grid structure, no soft glass blur as default | Random offset shadows, meme-yellow brutalism, decorative clutter |
| **Terminal / Retro-Tech** | Dark canvas (`#0A0E1A`–`#111214`), monospace for data/code/metrics, **HeroStamp** panel for brand moments (not fixed-width ASCII), subtle noise/grain overlay, inline terminal demos for tools | Full skeuomorphic CRT, excessive scanlines, unreadable green-on-black, `<pre>` box-drawing art |
| **Minimalist Engineering** | One idea per section, compact copy, semantic tokens, WCAG-AA contrast, `prefers-reduced-motion` on all motion | Long marketing paragraphs, gradient soup, icon-only meaning |

Hermes landing patterns worth adopting ([PR #974](https://github.com/NousResearch/hermes-agent/pull/974)):

- Spec-sheet sections: **label → value** rows instead of accordion/card sprawl
- Hero as **pure text** — responsive **HeroStamp** (`.hero-stamp` / `HeroStamp` component): mono uppercase lines, blush left accent, neo-brutalist corner marks — no hero PNG, no fixed-width ASCII `<pre>`
- **Three.js or CSS noise** overlay at low opacity for depth on dark backgrounds
- Terminal demo: cursor inline with content, no emoji in monospace lines
- Footer reduced to a single factual line
- Theme color meta aligned to page background (`#0A0E1A`)

Adapt for Appaw: keep **blush + indigo + gold** brand identity; borrow Hermes **structure and tone**, not Nous blue.

### 1.1 Editorial scroll tier (AngelList-inspired, marketing-only)

**When:** long marketing pages (PSA hub, future milestones/about). **Never:** admin, collection workspace, card-centering tool.

**Reference:** [AngelList 2023 Year in Review](https://www.angellist.com/2023) — chapter structure and scroll rhythm only; not dark canvas or gradient soup.

| AngelList pattern | Appaw adaptation | Keep from this guide |
|---|---|---|
| Scroll chapters (`Part [01]`) | Bracket labels on mono `chapter-label`; min-height chapters on `page-blueprint` | 1px borders, light-first tokens, spec rows |
| Sticky chapter nav | `ChapterNav` — anchor links, blush active state | `<Link>` / `<a>` navigation, skip link, focus-visible |
| Scroll-scrubbed progress | GSAP `ScrollTrigger` pin + scrub on **one** section (How it works) | `transform`/`opacity` only; `prefers-reduced-motion` → static |
| Quote carousel `[01][02]` | Operational trust quotes (facts, not fake testimonials) | Curly quotes, sentence-case body |
| Large editorial hero | Split headline + spec-sheet panel | HeroStamp / spec rows over decorative atmosphere |

**Chapter anatomy:**

- `chapter-label` — mono bracket syntax: `Part [01]`
- `chapter-title` — display heading
- Optional sticky `ChapterNav` — `#pricing`, `#how-to`, `#faq`
- `min-h-[70vh]` section rhythm using `--space-section-y`

**Two motion tiers:**

- **Tier A — Reveal** (default): existing `.motion-reveal` / `useRevealOnScroll` / `<Reveal>`
- **Tier B — Scrub** (opt-in, max **1** pinned section per page): GSAP `ScrollTrigger`; scrub step index or progress rail; static all-steps-visible when reduced motion or mobile

**Quote carousel rules:**

- `[01]` / `[02]` mono pagination via `.quote-carousel__index`
- `aria-live="polite"` on quote body
- Prev/next buttons with visible labels — no icon-only controls
- No auto-advance

**Anti-patterns:** multiple simultaneous pins, parallax on `top`/`height`, counters without real data, fake testimonials, layout reads in scroll handlers (WIG §6).

---

## 2. Brand Tokens

Implement in `src/styles/globals.css` `@theme` block. Semantic names first; scale numbers for Tailwind compatibility.

### 2.1 Color — semantic

**Light palette rationale (June 2026):** Warm paper canvas `#FAFAF8` keeps hardware/product photography neutral without sterile cool-gray. Brand blush `#E85D6F` is for rails, active chrome, and tinted surfaces — not solid button fills. Solid CTAs use deepened `--accent-cta` `#C23D52` with white `--accent-cta-ink` (~5.1:1 AA) so primary controls stay readable; mid blush + dark ink looked muddy and failed on hover. Soft dark blush `#ff9aa6` stays accent-only. Slate-indigo `#5B6FD6` replaces pastel `#818cf8` for links and focus rings: ~5.2:1 on white (AA). Gold warn unchanged — tool metrics anchor. Structural flips with theme for filled chrome (selected filter pills), not for CTA label ink.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--surface-bg` | `#FAFAF8` | `#0B0C0D` | Page canvas (warm paper) |
| `--surface-panel` | `#ffffff` | `#111214` | Cards, panels, workspace |
| `--surface-raised` | `#F3F2F0` | `#181A1E` | Nested panels, inputs |
| `--border-default` | `rgba(15,20,25,0.08)` | `rgba(255,255,255,0.06)` | Panel edges |
| `--border-strong` | `rgba(15,20,25,0.14)` | `rgba(255,255,255,0.12)` | Neo-brutalist emphasis |
| `--text-primary` | `#0F1419` | `#e5e7eb` | Body |
| `--text-secondary` | `#4A5568` | `#9ca3af` | Labels, hints |
| `--text-muted` | `#6B7280` | `#6b7280` | Spec labels, disabled |
| `--accent-primary` | `#E85D6F` | `#ff9aa6` | Brand blush — rails, active, tints |
| `--accent-cta` | `#C23D52` | `#C23D52` | Solid primary buttons (`.btn-primary`) |
| `--accent-cta-ink` | `#ffffff` | `#ffffff` | Label ink on solid CTAs |
| `--accent-secondary` | `#5B6FD6` | `#8b98fb` | Links, focus ring |
| `--accent-structural` | `#0F1419` | `#e5e7eb` | Brutalist chrome fills / borders |
| `--accent-warn` | `#f59e0b` | `#fbbf24` | Tool highlights, metrics |
| `--accent-success` | `#22c55e` | `#4ade80` | Pass states |
| `--accent-danger` | `#ef4444` | `#f87171` | Errors, destructive |

### 2.2 Color — scales (existing)

Keep current Tailwind scales in `@theme`: `primary-*` (blush), `secondary-*` (indigo), `accent-*` (gold), `neutral-*`. Map semantic tokens to scale steps in CSS, not in components.

### 2.3 Typography

| Role | Family | Weight | Case | Notes |
|------|--------|--------|------|-------|
| **Display / brand chrome** | Distinctive sans (replace Poppins over time) | 600–700 | Title Case headings; optional `text-display` uppercase on nav/badges only | Opt-in per element — never global `uppercase` |
| **Body** | System stack or `Inter` until revamp font chosen | 400–500 | Sentence case | 16px base, 1.5–1.6 line-height |
| **Mono / data** | `ui-monospace`, `SF Mono`, `Consolas` | 400–500 | As-is | Spec values, CLI copy, measurements, tool readouts |
| **Serif accent** | `Playfair Display` | 400–600 | Sentence case | Product storytelling only — sparse use |

Rules:

- Headings: `text-wrap: balance` or `text-pretty`
- Numbers in tables/comparisons: `font-variant-numeric: tabular-nums`
- Minimum text size: `text-xs` (12px) — nothing smaller
- Ellipsis character `…` not three dots `...`
- Curly quotes `"` `"` in marketing copy

### 2.4 Spacing & layout

| Token | Value | Use |
|-------|-------|-----|
| `--space-page-x` | `clamp(16px, 4vw, 24px)` | Horizontal page gutter |
| `--space-section-y` | `clamp(48px, 8vw, 96px)` | Section vertical rhythm |
| `--radius-panel` | `0` or `4px` | Neo-brutalist default — square or barely rounded |
| `--radius-control` | `6px` | Buttons, inputs (tools may use 11–18px where already established) |
| `--border-width` | `1px` | Default panel border |
| `--shadow-panel` | `0 12px 40px rgba(2,6,23,0.55)` | Dark panels only — no shadow on light brutalist cards |

**Fibonacci retracement (layout ratios):** use for column/width splits of a parent band (container, column, viewport). Prefer φ asymmetry over 50/50 on marketing heroes and bentos.

| Token | Value | Use |
|-------|-------|-----|
| `--ratio-fib-236` | `0.236` | Tight secondary band |
| `--ratio-fib-382` | `0.382` | Secondary column / image band / filmstrip identity |
| `--ratio-fib-500` | `0.5` | Equal split — avoid in hero |
| `--ratio-fib-618` | `0.618` | Dominant column / lead bento / specimen |
| `--ratio-fib-786` | `0.786` | Near-full content band / tall stage |
| `--ratio-phi` | `1.618` | Grid fr partner (`1fr` + `1.618fr`) |

**Derived alignment gaps** (retracement of `--space-section-y` — intra-section stacks, not page gutters):

| Token | Formula | Use |
|-------|---------|-----|
| `--space-align-xs` | `section-y × 0.236` | Within-group stack |
| `--space-align-sm` | `section-y × 0.382` | Section header → content; between panel groups |
| `--space-align-md` | `section-y × 0.5` | Mid block separation |
| `--space-align-lg` | `section-y × 0.618` | Major intra-section beat |

Rule: ratios for **width/column** splits; `--space-align-*` for **vertical** component alignment inside a section.

Max content width: **1080px** for tools/docs; **1280px** for marketing grids.

Grid: CSS Grid/Flex only — no JS layout measurement for column placement. Exception: measure sticky chrome height (`ChapterNav` → `--chapter-nav-height`) so scroll-margin stays correct when chips wrap.

### 2.4.1 Responsive / Mobile

GSC baseline: majority of organic clicks are mobile (~73%). Layout must stay operable on ~390px viewports.

| Rule | Detail |
|------|--------|
| Gutters | `--space-page-x` (`clamp(16px, 4vw, 24px)`) via `container-custom` / `container-tool` |
| Sticky bottom CTAs | Use `.sticky-bottom-bar` + `.sticky-bottom-bar-spacer` (includes `safe-area-inset-bottom`) — do not invent local `fixed bottom-0 p-3` bars |
| Header mobile nav | Scrollable panel (`max-h` ≤ viewport minus header), body scroll lock while open, close on Escape / route change |
| Tables | Wrap in `overflow-x-auto`; wide tables may use `min-w-*` — never clip without scroll |
| Type floor | Minimum **12px** (`text-xs` / `0.75rem`) — no `text-[10px]` / sub-12px instrument labels |
| Tap targets | Interactive controls ≥ **44×44px** (`.btn`, hamburger, footer links, filter pills) |
| Chapter nav | Keep `--chapter-nav-height` in sync when wrapped; sticky shell under `--site-header-height` |
| Motion | No ScrollTrigger **pin** below `md` (see §1.1 Tier B) |

Breakpoints (Tailwind defaults): `sm` 640 · `md` 768 (primary phone/desktop split) · `lg` 1024 (guide TOC sidebar).

### 2.5 Motion

- Animate `transform` and `opacity` only
- Never `transition: all` — list properties explicitly
- All decorative motion gated behind `@media (prefers-reduced-motion: no-preference)`
- Noise overlay, stagger reveals, terminal cursor blink: disable or static fallback when reduced motion

**Editorial scroll tokens** (marketing chapter tier — mirror `--motion-reveal-*`):

| Token | Default | Use |
|-------|---------|-----|
| `--motion-chapter-scrub-dur` | `1` | ScrollTrigger scrub multiplier |
| `--motion-chapter-pin-spacing` | `0` | Pin spacing in vh units |
| `--motion-quote-crossfade` | `320ms` | Quote carousel body swap |

---

## 3. Component Patterns

### 3.1 Panels (neo-brutalist)

```css
/* Pattern — adapt to Tailwind @apply or component class */
.panel {
  background: var(--surface-panel);
  border: var(--border-width) solid var(--border-default);
  border-radius: var(--radius-panel);
  /* dark mode only: */
  box-shadow: var(--shadow-panel);
}
```

- Prefer **visible border** over soft elevation on light theme
- Nested content uses `--surface-raised`, not nested shadows

### 3.2 Spec row (Hermes spec-sheet)

```
┌─────────────────────────────────────┐
│ 35PT COMPATIBILITY          PSA ✓   │  ← label (muted, mono or small caps)
│ UV PROTECTION               >95%    │  ← value (primary text, tabular-nums)
└─────────────────────────────────────┘
```

- Two-column row: label left, value right
- Dividers: `1px solid var(--border-default)`
- Use on product specs, tool readouts, feature summaries

### 3.3 Buttons

| Variant | Style | Label |
|---------|-------|-------|
| **Primary** | Blush fill, 1px border same hue darkened | Specific verb: "Save API Key", "Upload Scan" |
| **Secondary** | Transparent, strong border | Same specificity |
| **Ghost** | Borderless, hover bg | Tertiary actions |
| **Destructive** | Danger token, confirm modal required | "Delete Collection" |

- Hover/active/focus increase contrast vs rest state
- Focus: `focus-visible:ring-2` — never bare `outline-none`
- Submit stays enabled until request starts; show spinner + "Saving…" during request

### 3.4 Terminal block (tools / demos)

- Background: `--surface-panel` or darker `#0A0E1A`
- Font: mono, 13–14px, line-height 1.5
- Prompt prefix: `$` or `>` in `--text-muted`
- Cursor: inline with last line, not orphaned sibling
- No emoji in monospace output lines
- Copy blocks: `<pre><code>` with horizontal scroll, not reflow break

### 3.5 Forms

- Every control has visible `<label>` or `aria-label`
- `autocomplete`, meaningful `name`, correct `type` / `inputmode`
- Placeholders end with `…` and show example pattern
- Errors inline beside field; focus first error on submit
- `spellCheck={false}` on email, codes, usernames
- Never block paste

### 3.6 Navigation

- `<a>` / `<Link>` for navigation — not `<div onClick>`
- URL reflects filters, tabs, pagination (query params)
- Skip link to main content
- Headings hierarchical `h1`–`h6`; one `h1` per page

### 3.7 Scroll chapter

```
┌──────────────────────────────────────────────────────────┐
│  [sticky ChapterNav]  Pricing · How it works · FAQ       │
├──────────────────────────────────────────────────────────┤
│  Part [01]                                               │  ← .chapter-label
│  PSA service tiers                                       │  ← .chapter-title
│  ┌────────────────────────────────────────────────────┐  │
│  │ spec rows / content                                │  │  ← .scroll-chapter
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- Wrapper: `<ScrollChapter id="pricing" part="01" title="…">`
- Section: `.scroll-chapter` + `scroll-mt-*` for sticky header offset
- Min height: `min-h-[70vh]`; top border as chapter divider
- Nav: `.chapter-nav` / `.chapter-nav__link--active` — structural ink + blush accent

### 3.8 Quote carousel

```
┌──────────────────────────────────────────────────────────┐
│  "Face-to-face only at 138 Arena."                       │  ← aria-live="polite"
│  — 138 Arena team                                        │
│                                                          │
│  [ ← ]  [ 01 ] / [ 02 ]  [ → ]                           │  ← .quote-carousel__index
└──────────────────────────────────────────────────────────┘
```

- Controlled index — no auto-play
- Keyboard: ArrowLeft / ArrowRight on focus container
- Reduced motion: instant text swap (no crossfade)
- Quotes must be factual operational statements, not fabricated testimonials

---

## 4. Theming

- `color-scheme: dark` on `<html>` when dark theme active (fixes scrollbars, native inputs)
- `<meta name="theme-color">` matches `--surface-bg`
- Native `<select>`: explicit `background-color` and `color` (Windows dark mode)
- Light/dark via CSS variables — not duplicated hex in components
- Card centering tool: dark engineering theme is canonical reference for tools (`card-centering.module.css`)

---

## 5. Content & Copy

- Active voice: "Install the protector" not "The protector will be installed"
- Title Case for headings and buttons (Chicago style)
- Numerals for counts: "8 deployments" not "eight"
- Second person; avoid first person in UI
- Error messages include fix/next step
- Loading states: "Loading…", "Saving…", "Uploading…"
- Brand names and SKUs: `translate="no"`
- ZH copy: follow terminology in `docs/seo-pillars.md` (鑑定卡 not 評級卡 for product context)

---

## 6. Accessibility & Interaction (WIG baseline)

Non-negotiable rules from [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md):

### Accessibility
- Icon-only buttons → `aria-label`
- Decorative icons → `aria-hidden="true"`
- Images → `alt` (or `alt=""` if decorative)
- Async updates → `aria-live="polite"`
- Semantic HTML before ARIA

### Focus
- Visible focus on all interactives (`:focus-visible`)
- Compound controls → `:focus-within`

### Touch
- `touch-action: manipulation`
- `overscroll-behavior: contain` in modals/drawers
- No `user-scalable=no` / `maximum-scale=1`

### Performance
- Images: explicit `width` + `height`; lazy below fold
- Lists >50 items: virtualize or `content-visibility: auto`
- No layout reads in render (`getBoundingClientRect`, etc.)
- Critical fonts: `font-display: swap`

### i18n
- Dates/numbers via `Intl.DateTimeFormat` / `Intl.NumberFormat`
- Language from `Accept-Language` / `navigator.languages`, not IP

### Anti-patterns (flag in review)

- `transition: all`
- `outline-none` without focus replacement
- `<div>` / `<span>` with click navigation
- Form inputs without labels
- Hardcoded date/number formats
- `autoFocus` without clear desktop-only justification

---

## 7. Review Checklist

Run before merging UI PRs. Output format for automated reviews:

```text
## src/path/Component.tsx

src/path/Component.tsx:42 - icon button missing aria-label
src/path/Component.tsx:55 - transition: all → list properties
src/path/Component.tsx:67 - "..." → "…"
```

### Design pass
- [ ] Uses semantic tokens, not raw hex in component
- [ ] Panel borders visible; shadows only where spec allows
- [ ] Spec rows for dense data; prose for storytelling only
- [ ] Mono font for metrics/measurements
- [ ] Brand chrome uppercase opt-in only (`text-display`), not global
- [ ] Dark tool surfaces match card-centering reference
- [ ] Noise/animation respects `prefers-reduced-motion`

### Editorial scroll pass (marketing pages only)
- [ ] At most **one** ScrollTrigger pin per page
- [ ] Scrub section: full step text always in DOM; highlight is decorative
- [ ] `prefers-reduced-motion`: no pin/scrub; all steps visible
- [ ] Mobile (`< md`): no pin; steps stack normally
- [ ] `ChapterNav` uses `<a href="#…">`; active state via IntersectionObserver (no scroll jank)
- [ ] Quote carousel: manual controls, `aria-live="polite"`, labeled prev/next
- [ ] Quote copy is factual — no fake testimonials

### Engineering pass (WIG)
- [ ] All WIG §6 rules satisfied
- [ ] Destructive actions confirm or offer undo
- [ ] Stateful UI deep-linkable where practical
- [ ] Hydration-safe inputs and dates

---

## 8. Migration Notes (current → target)

| Area | Current | Target |
|------|---------|--------|
| Fonts | Inter + Poppins + Playfair | Keep scales; swap display font when chosen; add mono stack to `@theme` |
| Marketing | Soft gradients, rounded cards | Spec-sheet rows, harder borders, shorter copy |
| Tools | Card centering dark panel (good) | Align tokens to §2 semantic names |
| Components | Mixed Tailwind + module CSS | Shared `--surface-*` / `--border-*` variables |
| Hero | Image-heavy | HeroStamp + product spec table (see homepage SEO table) |

Implement incrementally: **tokens → shared primitives → page templates → full site**.

---

## 9. References

- [AngelList 2023 Year in Review](https://www.angellist.com/2023) — editorial scroll chapters, sticky nav, quote pagination (structure only)
- [Hermes Agent](https://hermes-agent.nousresearch.com/) — live reference UI
- [Hermes landing redesign PR #974](https://github.com/NousResearch/hermes-agent/pull/974) — palette, spec layout, ASCII hero, noise overlay
- [Hermes dashboard typography pass](https://github.com/NousResearch/hermes-agent/commit/487c398) — `text-display`, semantic contrast tokens
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) — implementation rules
- `src/styles/globals.css` — Tailwind v4 `@theme` source of truth
- `src/app/tools/card-centering/card-centering.module.css` — dark engineering tool reference
- `docs/seo-pillars.md` — copy/terminology constraints
