# SVR Packers & Movers

Static one-page marketing site for SVR Packers & Movers, Kadapa, Andhra Pradesh.

## Structure

- `index.html` — the whole site (inline CSS and JS)
- `gallery_images/` — gallery and hero photos
- `Logo-New-White.avif`, `truck.svg` — branding assets
- `robots.txt`

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
- `stock_images/` — free stock photos from [Pexels](https://www.pexels.com/license/) (free for commercial use, attribution not required). Pexels photo IDs: 29057947, 29057946, 15733306, 15877640, 5667923, 4441983, 9345679, 8750031, 4456656, 4391486, 7415035, 6169669, 4483610, 5156696. These are illustrative and do not show SVR staff or vehicles.

## Map and icons

- `india-map.svg` — India states map from [Simplemaps](https://simplemaps.com/resources/svg-license) (free for commercial use, attribution appreciated), recoloured for the Service Areas section.
- `whatsapp-logo.svg` and the WhatsApp glyph in the icon sprite are used for the floating button, mobile call bar and WhatsApp buttons.
