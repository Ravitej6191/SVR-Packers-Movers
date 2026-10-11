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
