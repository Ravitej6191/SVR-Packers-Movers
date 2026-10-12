# SVR Packers & Movers

Static one-page marketing site for SVR Packers & Movers, Kadapa, Andhra Pradesh.

## Structure

- `index.html` — the whole home page (inline CSS and JS)
- `privacy.html` — privacy policy (served at `/privacy`); `404.html` — not-found page
- `gallery_images/` — SVR's own photos; `stock_images/` — stock photos (`-md` = 900px version for phones, `-sm` = photo strip)
- `fonts/` — self-hosted Space Grotesk (OFL licence)
- `vercel.json` — security headers (CSP, HSTS, etc.) and cache rules
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, favicons

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Hosted on Vercel at https://www.svrpackersandmovers.info — static site, no build step. Pushing to `main` redeploys.

If the domain changes (e.g. a custom domain), update the URL in `index.html` (canonical, `og:*`, `twitter:image`, JSON-LD), `robots.txt` and `sitemap.xml`.

## Images

- `gallery_images/` — SVR's own photos (gallery and "How It Works").
- `stock_images/` — free stock photos from [Pexels](https://www.pexels.com/license/) (free for commercial use, attribution not required). Pexels photo IDs: 29057947, 29057946, 15733306, 15877640, 5667923, 4441983, 19510801, 35289099, 32031452, 4456656, 4391486, 7415035, 6169669, 4483610, 5156696. Two photos (`family-new-home`, `box-taping`) were supplied by the site owner. The rest are illustrative and do not show SVR staff or vehicles.

## Map and icons

- `india-map.svg` — India states map from [Simplemaps](https://simplemaps.com/resources/svg-license) (free for commercial use, attribution appreciated), recoloured for the Service Areas section.
- `whatsapp-logo.svg` and the WhatsApp glyph in the icon sprite are used for the floating button, mobile call bar and WhatsApp buttons.

## Notes

- Buttons and small text on light backgrounds use `--orange-ink` (#c0450c) for WCAG AA contrast; the brighter brand orange is used for graphics and on dark backgrounds.
- If you replace a photo, give the new file a new name: images are cached for 7 days (`vercel.json`).
- `privacy.html` is a standard plain-language policy; have it reviewed before relying on it.
