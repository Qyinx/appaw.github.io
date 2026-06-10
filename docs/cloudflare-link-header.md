# Cloudflare Link Response Header (RFC 8288)

[isitagentready](https://isitagentready.com/appaw.store) checks for an HTTP **`Link`** response header on the homepage. Static export to **GitHub Pages** cannot set response headers — `public/_headers` and `next.config.js` `headers()` are ignored at runtime.

**Fix:** Cloudflare **Transform Rules** (same place as security headers).

## Transform rule

Dashboard → **Rules** → **Transform Rules** → **Modify Response Header** → Create rule:

| Field | Value |
|-------|--------|
| **Name** | `Appaw agent Link header` |
| **When** | `(http.host eq "appaw.store" and http.request.uri.path eq "/")` or `(http.host eq "appaw.store" and starts_with(http.request.uri.path, "/zh/"))` |

Create **two rules** (or one custom expression covering `/` and `/zh/`) with:

| Action | Header | Value |
|--------|--------|--------|
| Set static | `Link` | Copy the single line from `public/_headers` under `/` (starts with `<https://appaw.store/.well-known/api-catalog>`) |

Canonical value (keep in sync with `src/lib/agent-discovery.ts`):

```
<https://appaw.store/.well-known/api-catalog>; rel="api-catalog", <https://appaw.store/llms.txt>; rel="describedby"; type="text/plain", <https://appaw.store/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json", </sitemap.xml>; rel="sitemap"
```

## Verify

```powershell
curl.exe -sI https://appaw.store/ | findstr /i link
node scripts/verify-link-header.mjs
```

Re-scan: [isitagentready.com](https://isitagentready.com/appaw.store) → `checks.discoverability.linkHeaders` should be `pass`.

## HTML fallback (already in repo)

`AgentDiscoveryLinks` in `src/app/layout.tsx` emits `<link rel="api-catalog">` etc. in HTML. Some agents read this; **isitagentready requires the HTTP header**.

## Related

- [Markdown for Agents](cloudflare-markdown-negotiation.md) — `Accept: text/markdown` on HTML URLs

## Resources

- [RFC 8288 — Web Linking](https://www.rfc-editor.org/rfc/rfc8288)
- [RFC 9727 §3 — API catalog Link relation](https://www.rfc-editor.org/rfc/rfc9727#section-3)
- [isitagentready Link headers skill](https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md)
