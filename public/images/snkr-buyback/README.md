# SNKR buyback card images

One file per card. The site does not generate or invent photos. A missing file shows a plain placeholder.

| | |
|---|---|
| Folder | `public/images/snkr-buyback/` |
| Preferred name | `{card_id}.webp` |
| Also accepted | `{card_id}.jpg`, `{card_id}.jpeg`, `{card_id}.png` |
| URL | `/images/snkr-buyback/{card_id}.webp` |

`card_id` is the internal id labeled 內部編號 / Internal id on the detail page. It is not a PSA cert number.

If several extensions exist for the same id, `.webp` is used. `next dev` and `next build` refresh `src/lib/snkr-buyback/image-manifest.ts` from this folder before compile.

This folder is tracked. Other files under `public/images/` stay ignored.
