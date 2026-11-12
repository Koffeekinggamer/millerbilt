# MillerBilt Cabinetry

Static marketing site for MillerBilt Cabinetry. Custom Amish-made cabinets, with showrooms in Landrum and Charleston, South Carolina.

The site is a single page at the repository root: `index.html`, with `css/`, `js/`, and `images/`.

## GitHub Pages

Published from `main`, folder `/ (root)`, with custom domain `millerbilt.com`. The `CNAME` file at the repository root is `millerbilt.com`.

Live site: https://millerbilt.com/

The former preview URL, https://koffeekinggamer.github.io/millerbilt/, will redirect to the custom domain once GitHub Pages has that domain set.

Schedule buttons stay on this page and scroll to the embedded booking calendar at `#book`. Both locations use that same calendar for now, the Landrum schedule. This page does not collect its own form submissions.

Also at the root: `robots.txt` (allows search and AI crawlers and points at the sitemap), `sitemap.xml`, `llms.txt`, and `llms-full.txt`. Canonical, Open Graph, JSON-LD, and sitemap URLs use https://millerbilt.com/.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/
