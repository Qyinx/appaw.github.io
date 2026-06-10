# Cloudflare Markdown for Agents (content negotiation)

[isitagentready](https://isitagentready.com/appaw.store) checks that `GET /` with `Accept: text/markdown` returns **`Content-Type: text/markdown`** (and ideally `x-markdown-tokens`). Browsers without that header still get HTML.

Static export to **GitHub Pages** cannot vary response by `Accept`. Repo ships `public/index.md` as a direct markdown URL fallback; **full negotiation on HTML URLs** requires Cloudflare **Markdown for Agents**.

## Enable (dashboard)

1. [Cloudflare dashboard](https://dash.cloudflare.com/) → account → zone **appaw.store**
2. **AI Crawl Control** (or Quick Actions) → enable **Markdown for Agents**

Requires **Pro, Business, or Enterprise** (beta, no extra charge per Cloudflare docs). Free plan: use static `https://appaw.store/index.md` only, or upgrade.

### Optional — limit to appaw.store paths

**Rules** → **Overview** → **Create rule** → **Configuration Rules**:

| Field | Value |
|-------|--------|
| **Name** | `Appaw Markdown for Agents` |
| **When** | `(http.host eq "appaw.store")` |
| **Then** | **Markdown for Agents** → **On** |

## Enable (API)

```bash
curl --request PATCH \
  --url "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/content_converter" \
  --header "Authorization: Bearer {api_token}" \
  --header "Content-Type: application/json" \
  --data '{"value":"on"}'
```

## How it works

Client sends:

```http
GET / HTTP/1.1
Host: appaw.store
Accept: text/markdown, text/html
```

Cloudflare fetches HTML from GitHub Pages origin, converts to Markdown, responds with:

```http
HTTP/2 200
content-type: text/markdown; charset=utf-8
vary: accept
x-markdown-tokens: 725
```

No origin code changes. Works for `/`, `/guides/...`, product pages, etc. (origin HTML ≤ 2 MB).

## Verify

```powershell
curl.exe -sI "https://appaw.store/" -H "Accept: text/markdown" | findstr /i "content-type vary x-markdown"
npm run verify:markdown-negotiation
```

**Before enable (current):** `Content-Type: text/html` on `/` even with `Accept: text/markdown`.  
**After enable:** `Content-Type: text/markdown` on `/` with that header.

Static twin (works today without negotiation):

```powershell
curl.exe -sI https://appaw.store/index.md | findstr /i content-type
# Content-Type: text/markdown; charset=utf-8
```

## Repo fallbacks (already shipped)

| Asset | Purpose |
|-------|---------|
| `public/index.md` | Homepage markdown twin; linked from `llms.txt` |
| `public/_headers` | `Content-Type: text/markdown` for `/index.md` (CDN that honours `_headers`) |

## Resources

- [Cloudflare — Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- [isitagentready — markdown negotiation skill](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md)
