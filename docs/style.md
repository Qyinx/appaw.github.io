# Appaw Store — Design System & Style Guide

**Status:** Soft neubrutalism, light-first store  
**Last updated:** 2026-10-03

Site ships light semantic tokens on `:root`. Dark tokens apply inside tools and opt-in `.dark`. Components use semantic aliases (`text-text-primary`, `bg-surface-panel`) — not raw hex.

**Grammar:** [Neubrutalism](https://neubrutalism.com/) — stroke, flat fill, square corners, zero blur.  
**Intensity:** Soft. Loud poster. Quiet task. Hard offset shadow only on the marketing primary button.  
**Engineering baseline:** [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

---

## 1. Design Intent

Appaw Store sells precision hardware (graded slab protectors) and ships engineering-grade tools (card centering). UI feels **built**, not decorated.

Two shells. Never invert theme mid-page.

| Shell | Surface | When |
|-------|---------|------|
| **Store sheet** | Coral frame, cream sheet, ink 2px edges | Marketing, product, guides, collection chrome |
| **Instrument card** | Charcoal, hairline, flat | Card centering and other tools |

### Aesthetic blend

| Layer | Borrow | Avoid |
|-------|--------|-------|
| **Soft neubrutalism** | 2px ink borders, radius 0, flat color, visible structure | 1px ghost borders, meme-yellow kits, offset shadow on every card, glass blur |
| **Retro-tech (tools only)** | Dark instrument cards, mono for measurements | CRT, scanlines, green-on-black, ASCII art, terminal cursor on nav |
| **Minimalist engineering** | One idea per section, calm body type, WCAG-AA, `prefers-reduced-motion` | Blueprint grids, grain overlays, three brand accents, chapter chrome |

Enterprise rule from neubrutalism.com: start with a standard UX skeleton, then wrap tokens. Loud on hero and CTAs. Forms, tables, settings stay mechanically aligned.

### 1.1 What this system is not

Do not require Hermes dark canvas, HeroStamp as the marketing hero, AngelList scroll chapters, Fibonacci splits, sitewide noise, or Title Case on every control.

---

## 2. Brand Tokens

Source of truth: `src/styles/globals.css` `@theme` plus `:root` / `.dark`.

### 2.1 Color — semantic

One structural ink. One coral for action. Yellow is a **graphic mark** only (circles behind display type). Yellow never carries text on cream. Indigo is not a brand color. Green/red are semantic status only.

| Token | Light | Dark / tools | Use |
|-------|-------|--------------|-----|
| `--surface-frame` | `#D85A45` | `#D85A45` | Viewport frame around the sheet |
| `--surface-bg` | `#F3EBDA` | `#121212` | Page / sheet canvas |
| `--surface-panel` | `#FBF7EE` | `#262626` | Cards, panels |
| `--surface-raised` | `#EFE6D4` | `#303030` | Nested panels, inputs |
| `--border-default` | `rgba(26,20,14,0.18)` | `rgba(255,255,255,0.22)` | Hairline / default edge |
| `--border-strong` | `#1A140E` | `rgba(255,255,255,0.38)` | Neo-brutalist 2px ink |
| `--text-primary` | `#1A140E` | `#F4F1EA` | Body |
| `--text-secondary` | `#4A4036` | `#C8C2B8` | Labels, hints (~7:1 on sheet) |
| `--text-muted` | `#6B5F52` | `#A39C92` | Spec labels |
| `--accent-primary` | `#C44536` | `#C44536` | Brand coral — rails, tints |
| `--accent-cta` | `#C44536` | `#C44536` | Solid primary buttons |
| `--accent-cta-ink` | `#ffffff` | `#ffffff` | Label on solid CTAs |
| `--accent-secondary` | `#1A140E` | `#F4F1EA` | Links and focus (ink, not indigo) |
| `--accent-structural` | `#1A140E` | `#F4F1EA` | Chrome fills / strong borders |
| `--accent-mark` | `#E7C63A` | `#E7C63A` | Display circles only — never text |
| `--accent-warn` | `#C9A227` | `#E7C63A` | Tool metrics, not chrome |
| `--accent-success` | `#1F7A45` | `#4ade80` | Pass states |
| `--accent-danger` | `#C44536` | `#f87171` | Errors, destructive |

Links: ink color plus underline. Focus: `2px solid` ink, `2px` offset. No colored glow.

Keep Tailwind `primary-*` mapped to coral. Leave `secondary-*` in CSS unused for chrome.

### 2.2 Color — scales

Map semantic tokens to scale steps in CSS, not in components.

### 2.3 Typography

| Role | Family | Weight | Case | Notes |
|------|--------|--------|------|-------|
| **Display** | Syne 800 | 800 | As written | Latin only. `clamp(2.5rem, 12vw, 6.5rem)`, tracking ≥ `-0.04em`, line-height ≥ 1.05 |
| **Kicker** | Newsreader italic | 400–500 | Sentence | Max **one** per view. ≥ 18px. Not body, not buttons |
| **Body** | Inter | 400–500 | Sentence | 17px, line-height 1.65, max 65ch |
| **UI / buttons** | Inter | 600 | Sentence | 15px. Not 12px uppercase mono |
| **Mono / data** | IBM Plex Mono | 400–500 | As-is | Spec values, measurements, code |
| **Chinese display** | Existing CJK stack | 600–700 | As written | Do **not** apply Syne to `zh` |

Rules:

- Headings: `text-wrap: balance` or `text-pretty`
- Numbers in tables: `font-variant-numeric: tabular-nums`
- Floor: **14px** for anything a person must read or tap. Legal footer may use 13px
- Ellipsis `…` not `...`
- Curly quotes in marketing copy

### 2.4 Spacing & layout

| Token | Value | Use |
|-------|-------|-----|
| `--site-frame` | `12px` phone, `20px` / `28px` up | Coral margin around the sheet. Never 0 |
| `--space-page-x` | `clamp(16px, 4vw, 24px)` | Horizontal gutter inside the sheet |
| `--space-section-y` | `clamp(48px, 8vw, 96px)` | Section rhythm |
| `--radius-panel` | `0` | All panels |
| `--radius-control` | `0` | Buttons, inputs |
| `--border-width` | `2px` | Default stroke. Hairlines 1px for row dividers only |
| `--shadow-panel` | `none` | No blur shadows |
| `--shadow-press` | `3px 3px 0 0 var(--text-primary)` | Marketing `.btn-primary` only |

Marketing split: type ~60% / specimen ~40% from `md` up. Stack under `md`. No Fibonacci tokens in new work.

Max content width: **1080px** tools/docs; **1280px** marketing.

Grid/Flex only — no JS layout measurement for columns.

### 2.4.1 Mobile (required on every UI)

GSC: majority of organic clicks are mobile. Operable at ~390px.

| Rule | Detail |
|------|--------|
| Columns | Under `md` (768): **one column**. No side-by-side hero, no wrapping desktop nav |
| Frame | `--site-frame` stays ≥ 12px |
| Type | Body 17px. Display `clamp(2.5rem, 12vw, 6.5rem)`. Interactive copy ≥ 14px |
| Tap | Controls ≥ **44×44px** |
| Sticky CTA | Only `.sticky-bottom-bar` + spacer (safe-area). Do not invent `fixed bottom-0` bars |
| Header | Wordmark + one action + menu below `lg`. Scrollable panel, body scroll lock, Escape / route close |
| Tables | Wrap in `overflow-x-auto`. Page itself does not scroll sideways |
| Height | `min-h-[100dvh]` if needed. Never `h-screen` |
| Motion | No pin, no autoplay, no scramble |

Breakpoints: `sm` 640 · `md` 768 · `lg` 1024.

### 2.5 Motion

- Animate `transform` and `opacity` only
- Never `transition: all`
- Decorative motion gated behind `@media (prefers-reduced-motion: no-preference)`
- Primary button: hover lifts `translate(-2px, -2px)` and grows press shadow; active sits on the shadow (`translate(3px, 3px)`, shadow none)

---

## 3. Component Patterns

### 3.1 Panels

```css
.panel {
  background: var(--surface-panel);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-panel);
  box-shadow: none;
}
```

- Visible ink border. No elevation.
- Nested content uses `--surface-raised`, not nested `.panel` inside `.panel`.

### 3.2 Spec row

Two-column row: label left (muted, ≥ 14px), value right (primary, 16px, tabular-nums). `1px` divider. Product specs, tool readouts.

### 3.3 Buttons

| Variant | Style | Label |
|---------|-------|-------|
| **Primary** | Coral fill, 2px ink, `--shadow-press` on marketing | Specific verb: "Shop now" |
| **Secondary** | Sheet fill, 2px ink, no shadow | Same specificity |
| **Ghost** | Borderless, hover raised | Tertiary |
| **Destructive** | Danger fill, confirm modal | "Delete collection" |

- 15px, weight 600, sentence case, min-height 44px
- Focus: `outline: 2px solid var(--text-primary); outline-offset: 2px`
- Submit stays enabled until request starts; spinner + "Saving…" during request

### 3.4 Terminal block (tools / demos)

- Background: `--tool-panel`
- Mono 14px, line-height 1.5
- Prompt `$` or `>` in muted
- No emoji in monospace lines
- Copy: `<pre><code>` with horizontal scroll

### 3.5 Forms

- Visible `<label>` or `aria-label`. Label **above** field
- Input text 16px
- Errors under the field; focus first error on submit
- Placeholders end with `…`
- `spellCheck={false}` on email, codes, usernames
- Never block paste

### 3.6 Navigation

- `<a>` / `<Link>` for navigation
- URL reflects filters, tabs, pagination
- Skip link to main
- One `h1` per page
- Desktop: one line, height ≤ 80px. Filled action + outline action. No scramble, no cursor glyph
- Active link: ink weight, not a second color family

### 3.7 Store sheet layout

```
┌ coral frame ─────────────────────────────────┐
│  ┌ cream sheet ────────────────────────────┐ │
│  │  wordmark   links        [Shop] [More]  │ │
│  │  italic kicker                          │ │
│  │  DISPLAY WORD           [specimen]      │ │
│  │  One short sentence                     │ │
│  │  [Primary]  [Secondary]                 │ │
│  │  01 spec group     02 spec group        │ │
│  │  one factual footer line                │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

Kicker + one display line + one sentence + two buttons. Specimen right from `md`. Spec groups are numbered because they are a pair of facts, not section decoration.

### 3.8 Instrument card (tools)

- Flat charcoal, 2px hairline, no blur, no card-in-card
- Short caps title, then ≥ 14px body
- Metrics: 2-column grid, small label, large number
- Dark engineering theme is canonical for tools (`card-centering.module.css` plus `--tool-*` tokens)

---

## 4. Theming

- `color-scheme: dark` on `<html>` when `.dark` or inside a tool island
- `<meta name="theme-color">` matches `--surface-bg` of the active shell
- Native `<select>`: explicit background and color
- Light/dark via CSS variables — not duplicated hex in components
- Grain, blueprint grid, and vignette: **off** by default

---

## 5. Content & Copy

- Active voice
- Sentence case for UI labels and buttons
- Numerals for counts: "8 deployments"
- Second person; avoid first person in UI
- Errors include a next step
- Loading: "Loading…", "Saving…", "Uploading…"
- Brand names and SKUs: `translate="no"`
- ZH: `docs/seo-pillars.md` (鑑定卡 not 評級卡 for product context)

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
- No layout reads in render
- Critical fonts: `font-display: swap`

### i18n

- Dates/numbers via `Intl`
- Language from `Accept-Language` / `navigator.languages`, not IP

### Anti-patterns

- `transition: all`
- `outline-none` without focus replacement
- `<div>` / `<span>` click navigation
- Inputs without labels
- Hardcoded date/number formats
- `autoFocus` without desktop-only justification
- Indigo / second accent as chrome
- Sub-14px interactive type
- Offset shadow on panels

---

## 7. Review Checklist

```text
## src/path/Component.tsx

src/path/Component.tsx:42 - icon button missing aria-label
src/path/Component.tsx:55 - transition: all → list properties
```

### Design pass

- [ ] Semantic tokens, not raw hex
- [ ] 2px ink (or documented hairline); no blur shadow on panels
- [ ] Spec rows for dense data
- [ ] Mono only for metrics/code
- [ ] One kicker per view max; Syne not on `zh` display
- [ ] Tool surfaces match instrument tokens
- [ ] Motion respects `prefers-reduced-motion`

### Mobile pass

- [ ] Single column under `md`
- [ ] Frame margin visible
- [ ] 44px targets, 14px type floor, 17px body
- [ ] No horizontal page scroll

### Engineering pass (WIG)

- [ ] WIG §6
- [ ] Destructive actions confirm or undo
- [ ] Stateful UI deep-linkable where practical
- [ ] Hydration-safe inputs and dates

---

## 8. Migration Notes

| Area | Was | Now |
|------|-----|-----|
| Canvas | Dark `#0A0E1A` vs cream conflict | Coral frame + cream sheet |
| Borders | 1px 8% ink | 2px ink |
| Buttons | 12px uppercase mono | 15px sentence Inter + press shadow on primary |
| Accents | Blush + indigo + gold | Coral + ink + yellow marks |
| Hero | HeroStamp / ASCII / filmstrip | Kicker + display + specimen + two specs |
| Type | Inter intent vs IBM Plex | Inter body, Syne 800 display, Newsreader kicker |
| Atmosphere | Noise, grid, vignette | Off |
| Radius | Mixed 0 / 6 / 11–18 | 0 |

Implement: **tokens → shared primitives → homepage / header / footer → tools → style-guide page**.

---

## 9. Retired (do not require)

Moved here so old PRs do not resurrect them:

- AngelList chapters: `ScrollChapter`, `ChapterNav`, quote carousel, GSAP pin, `Part [01]`
- Fibonacci `--ratio-fib-*` and `--space-align-*`
- HeroStamp as marketing hero; ASCII `<pre>` heroes
- Three.js / sitewide `page-noise` as brand
- Header scramble / terminal cursor on nav
- Title Case as a global rule
- Blur `--shadow-panel`
- Theme-color `#0A0E1A`
- Poppins, Playfair as intended faces
- Indigo `--accent-secondary` for links and focus

Existing components may remain until unimported. New UI must not add them.

---

## 10. References

- [Neubrutalism](https://neubrutalism.com/) — stroke, radius, flat fill, a11y warnings
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- `src/styles/globals.css` — tokens
- `src/app/tools/card-centering/card-centering.module.css` — instrument shell
- `docs/seo-pillars.md` — copy constraints
