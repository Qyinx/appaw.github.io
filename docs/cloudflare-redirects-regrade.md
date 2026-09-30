# Cloudflare 301 — obsolete `regrade-or-reholder` → `psa-reholder-guide`

GitHub Pages does **not** honor Netlify-style `public/_redirects`. Static export also does not emit HTTP `Location` from Next `redirect()`. Production 301s must live in **Cloudflare**.

Apply these **before or in the same window as** the deploy that deletes the soft “Redirecting…” HTML under `/guides/regrade-or-reholder/`.

---

## Where to click

1. Open [https://dash.cloudflare.com](https://dash.cloudflare.com) and sign in.
2. Select the account that owns **appaw.store**.
3. Select the zone **appaw.store** (not a Workers subdomain).
4. In the left sidebar:
   - **Rules** → **Redirect Rules**  
   - or **Rules** → **Overview**, then open **Redirect Rules**
5. Click **Create rule** (or **Create a Redirect Rule**).

You should land on a screen titled something like **Create a Redirect Rule** / **Edit Single Redirect**.

Confirm DNS for `appaw.store` (and `www` if used) is **Proxied** (orange cloud). Grey-cloud / DNS-only traffic never hits Redirect Rules.

---

## Screen layout (what each block means)

The Single Redirect editor is usually three blocks:

1. **Rule name** (required)
2. **When incoming requests match…** (Field / Operator / Value — when the rule fires)
3. **Then…** / **URL redirect** (where to send them + status code)

Optional at the bottom:

- **Place at** / rule order (First / Last / Custom)
- **Deploy** / **Save**

---

## Step A — Rule name

| Field | What to enter |
|-------|----------------|
| **Rule name** | `regrade-or-reholder → psa-reholder-guide (EN+ZH)` |

Name is only for you in the dashboard. It does not affect SEO.

---

## Step B — When incoming requests match…

This block answers: **which URLs trigger the redirect?**

Do **not** choose **All incoming requests** — that would redirect the whole site.

You usually see either:

- a **visual builder** with **Field**, **Operator**, **Value**, or  
- an **Edit expression** box (raw text).

Both do the same job. Visual builder is clearer if you have not used expressions before.

---

### What Field / Operator / Value mean

Each match row is: **look at (Field) → compare with (Operator) → this text (Value)**.

#### Field — *what part of the request?*

| Field (UI name) | What it is | Example |
|-----------------|------------|---------|
| **URI Path** | Path only. No `https://`, no domain, no `?query` | `/guides/regrade-or-reholder/` |
| **Hostname** | Domain name only | `appaw.store` |
| **Full URI** / **Request URL** | Full URL (host + path) | `https://appaw.store/guides/...` |

**Use URI Path** for this rename.

#### Operator — *how to compare?*

| Operator | Meaning | Good for this task? |
|----------|---------|---------------------|
| **equals** | Exact one path | Yes (with Or rows) |
| **is in** | Path is one of a list | **Best** (one row, four paths) |
| **contains** | Path has this substring | Avoid (too broad) |
| **starts with** | Path begins with… | Avoid unless careful |
| **does not equal** | Opposite of equals | No |

#### Value — *the path(s) to match*

Type or paste the path string(s), including the leading `/`.

---

### Option B1 — Visual builder (recommended)

1. Under **When incoming requests match…**, stay on the visual builder (Field / Operator / Value).
2. Set:

| Control | Choose |
|---------|--------|
| **Field** | **URI Path** |
| **Operator** | **is in** |
| **Value** | Add all four paths below |

**Values (all four):**

```text
/guides/regrade-or-reholder
/guides/regrade-or-reholder/
/zh/guides/regrade-or-reholder
/zh/guides/regrade-or-reholder/
```

How to add values depends on the UI:

- list / tag box → add each path as its own item, or  
- one text area → one path per line.

This matches EN + ZH, with and without trailing slash.

#### Alternate visual builder (no “is in”)

If **is in** is missing, use **Or** between four rows:

| # | Field | Operator | Value |
|---|--------|----------|--------|
| 1 | URI Path | equals | `/guides/regrade-or-reholder` |
| 2 | URI Path | equals | `/guides/regrade-or-reholder/` |
| 3 | URI Path | equals | `/zh/guides/regrade-or-reholder` |
| 4 | URI Path | equals | `/zh/guides/regrade-or-reholder/` |

Join rows with **Or** (not And).

Optional: add **And** Hostname **equals** `appaw.store` if you want to limit the rule to that host only.

---

### Option B2 — Edit expression (same rule as text)

1. Click **Edit expression** (or switch to expression editor).
2. Paste **exactly**:

```text
(http.request.uri.path in {"/guides/regrade-or-reholder" "/guides/regrade-or-reholder/" "/zh/guides/regrade-or-reholder" "/zh/guides/regrade-or-reholder/"})
```

That is the same as Field **URI Path** + Operator **is in** + the four Values.

---

### Option B3 — Wildcard (avoid if possible)

Some UIs offer **Wildcard** on a full URL:

| Setting | Value |
|---------|--------|
| Request URL | `https://appaw.store/guides/regrade-or-reholder*` |
| Second rule | `https://appaw.store/zh/guides/regrade-or-reholder*` |

Wildcards can match extra paths (`…-foo`). Prefer **B1** or **B2**.

---

### Option B4 — Two separate rules (preferred for Then / Static)

Same match as Rule 1 / Rule 2 under Step C. Use with **Static** destinations — no Dynamic URL needed.

---

## Step C — Then… / URL redirect

Under **Then**, choose **URL redirect** (not “Rewrite”, not “Block”, not “Worker”).

**Recommended: two Static rules** (EN + ZH). Cloudflare Redirect Rule expressions do **not** support `if(...)` — a Dynamic URL with `if` will error (`unknown identifier`).

### C1 — Type: Static vs Dynamic

| Type | Use when | Destination |
|------|----------|-------------|
| **Static** | One fixed target URL | Type the full URL once — **use this (2 rules)** |
| **Dynamic** | Expression builds the URL | Only if you must use one rule; see optional `regex_replace` below |

### Recommended setup — two Static rules

Create **two** rules. Each: Type **Static**, Status **301**, Preserve query string **Off**.

#### Rule 1 — English

**When** (visual builder):

| Field | Operator | Value |
|-------|----------|--------|
| URI Path | equals | `/guides/regrade-or-reholder` |
| **Or** URI Path | equals | `/guides/regrade-or-reholder/` |

**Then:**

| Control | Value |
|---------|--------|
| Type | **Static** |
| URL | `https://appaw.store/guides/psa-reholder-guide/` |
| Status code | **301** |
| Preserve query string | Off |

#### Rule 2 — Chinese

**When:**

| Field | Operator | Value |
|-------|----------|--------|
| URI Path | equals | `/zh/guides/regrade-or-reholder` |
| **Or** URI Path | equals | `/zh/guides/regrade-or-reholder/` |

**Then:**

| Control | Value |
|---------|--------|
| Type | **Static** |
| URL | `https://appaw.store/zh/guides/psa-reholder-guide/` |
| Status code | **301** |
| Preserve query string | Off |

Always include `https://` and the trailing `/` on the target.

### Optional — one Dynamic rule (no `if`)

Only if you insist on a single rule. Do **not** use `if(...)`.

**When** — URI Path **is in** the four paths (same as Step B Option B1).

**Then** — Type **Dynamic**, expression:

```text
concat("https://appaw.store", regex_replace(http.request.uri.path, "^(/zh)?/guides/regrade-or-reholder/?$", "${1}/guides/psa-reholder-guide/"))
```

If that also fails in the editor, stick to the **two Static rules** above.

### C2 — Status code

| Code | Meaning | Use? |
|------|---------|------|
| **301** | Permanent | **Yes — use this** (SEO equity moves to the new URL) |
| **302** | Temporary | No for this rename |
| **307** | Temporary, keep method | No |
| **308** | Permanent, keep method | OK alternative to 301; prefer **301** for classic SEO docs |

Set **Status code** = **301**.

### C3 — Preserve query string

| Setting | Effect |
|---------|--------|
| **Off** (recommended) | `/guides/regrade-or-reholder/?utm=x` → clean `/guides/psa-reholder-guide/` |
| **On** | Query string is appended to the target |

For this guide rename, **Off** is fine.

### C4 — Other toggles you might see

| Control | What to do |
|---------|------------|
| **Place at** / Order | **First** or high priority so nothing else overrides |
| **Enabled** | On |
| **Describe** / notes | Optional |
| **Also include subdomains** | Not needed unless you also serve the path on `www` via the same zone (usually covered if `www` is a CNAME to apex and proxied) |

If both `www.appaw.store` and `appaw.store` are live, either:

- Redirect `www` → apex with an existing rule, **or**
- Duplicate path matches for host `www.appaw.store` (rare if you already force apex).

---

## Step D — Save

Click **Deploy** / **Save** / **Save and deploy rule**.

Changes usually apply in seconds to a few minutes.

---

## Recommended finished config (copy checklist)

**Two Static rules** (preferred — no Dynamic / no `if`)

| Rule | When (URI Path equals, Or) | Then (Static URL) | Status |
|------|----------------------------|-------------------|--------|
| EN | `/guides/regrade-or-reholder` **or** `/guides/regrade-or-reholder/` | `https://appaw.store/guides/psa-reholder-guide/` | 301 |
| ZH | `/zh/guides/regrade-or-reholder` **or** `/zh/guides/regrade-or-reholder/` | `https://appaw.store/zh/guides/psa-reholder-guide/` | 301 |

Preserve query string: **Off** on both.

Do **not** use `if(...)` in Dynamic URL — Cloudflare rejects it (`unknown identifier`).

---

## Verify

PowerShell:

```powershell
curl.exe -sI https://appaw.store/guides/regrade-or-reholder/
curl.exe -sI https://appaw.store/guides/regrade-or-reholder
curl.exe -sI https://appaw.store/zh/guides/regrade-or-reholder/
curl.exe -sI https://appaw.store/zh/guides/regrade-or-reholder
```

Expect:

- `HTTP/2 301` or `HTTP/1.1 301`
- `Location: https://appaw.store/guides/psa-reholder-guide/` (EN)
- `Location: https://appaw.store/zh/guides/psa-reholder-guide/` (ZH)

Browser: open the old URL in a private window — address bar should end on `psa-reholder-guide/`.

If you still see **200** and title **Redirecting…**, either:

1. The rule did not match / is not deployed, or  
2. Soft HTML has not been removed from GitHub Pages yet (deploy the commit that deletes those routes), or  
3. DNS is grey-cloud (not proxied).

After deploy: Google Search Console → URL Inspection on old + new EN/ZH reholder URLs; request indexing for the new pages.

---

## Related in-repo files

- `public/_redirects` — Netlify-style mirror (not applied by GitHub Pages)
- `next.config.js` — `permanent: true` for local `next dev` only
