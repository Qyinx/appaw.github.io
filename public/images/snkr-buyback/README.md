# SNKR buyback card images

One file per card. The site does not generate or invent photos. A missing file shows a plain placeholder.

| | |
|---|---|
| Folder | `public/images/snkr-buyback/` |
| Preferred name | `{card_id}.webp` |
| Also accepted | `{card_id}.jpg`, `{card_id}.jpeg`, `{card_id}.png` |
| URL | `/images/snkr-buyback/{card_id}.webp` |

`card_id` is an internal filename key: `sha1(normalize(name)[|number]|grade_or_RAW)[:12]`. Normalize means NFKC, strip decorative emoji that sit in front of the name (🔥ブラッキー becomes ブラッキー), remove whitespace, and lowercase. Marks that belong to the printed name, such as ☆, stay. The page does not show this id, and it is not a PSA cert number. Do not use tweet or PriceCharting image URLs here.

If several extensions exist for the same id, `.webp` is used. `next dev` and `next build` refresh `src/lib/snkr-buyback/image-manifest.ts` from this folder before compile.

This folder is tracked. Other files under `public/images/` stay ignored.
