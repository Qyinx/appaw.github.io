# Cloudflare 301 — legacy `/business/psa-protector/` → `/products/psa-protectors/`

GitHub Pages does **not** honor Netlify-style `public/_redirects`. Static export also does not emit HTTP `Location` from Next `redirect()`. Production 301s must live in **Cloudflare**.

Same dashboard flow as [cloudflare-redirects-regrade.md](cloudflare-redirects-regrade.md). Create **two new** Redirect Rules (do not overwrite the regrade rule). DNS for `appaw.store` must be **Proxied**.

---

## Rule 1 — English

| Field | Value |
|-------|--------|
| **Rule name** | `psa-protector → psa-protectors (EN)` |
| **Field** | URI Path |
| **Operator** | is in |
| **Value** | `/business/psa-protector` and `/business/psa-protector/` |
| **Status code** | 301 Permanent |
| **Destination** | `https://appaw.store/products/psa-protectors/` |
| **Preserve query string** | On |

## Rule 2 — Chinese

| Field | Value |
|-------|--------|
| **Rule name** | `psa-protector → psa-protectors (ZH)` |
| **Field** | URI Path |
| **Operator** | is in |
| **Value** | `/zh/business/psa-protector` and `/zh/business/psa-protector/` |
| **Status code** | 301 Permanent |
| **Destination** | `https://appaw.store/zh/products/psa-protectors/` |
| **Preserve query string** | On |

`robots.txt` **allows** these paths so Google can crawl the 301. Next pages keep `noindex, follow` if the CDN rule is missing.
