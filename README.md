# MillerBilt Cabinetry

Static marketing site for MillerBilt Cabinetry. Custom Amish-made cabinets, with showrooms in Landrum and Charleston, South Carolina.

The site is a single page at the repository root: `index.html`, with `css/`, `js/`, and `images/`.

## GitHub Pages

Published from `main`, folder `/ (root)`, with custom domain `millerbilt.com`. The `CNAME` file at the repository root is `millerbilt.com`.

Live site: https://millerbilt.com/

The former preview URL, https://koffeekinggamer.github.io/millerbilt/, will redirect to the custom domain once GitHub Pages has that domain set.

Schedule buttons on the visit cards open that showroom’s booking page in a new tab. Landrum uses Michael Holladay’s Foothills appointment page. Charleston uses Lauren Manzin’s Google Calendar link. This page does not collect its own form submissions.

The only place to set those links is the `BOOKING_URLS` object at the top of `js/main.js`:

- `LANDRUM_BOOKING_URL` — Michael Holladay’s cabinetry calendar: `https://foothillsamishfurniture.com/products/appointment?faf_staff=michael-holladay&faf_cabinetry=1`
- `CHARLESTON_BOOKING_URL` — Lauren Manzin’s appointment schedule (lauren@millerbilt.com): `https://calendar.app.google/rnWxmnkiUnAPbouN6`

A `calendar.google.com` schedules link is embedded. A `calendar.app.google` link and the Foothills appointment page open in a new tab. Until a value is a real booking link, the page asks the visitor to call that showroom.

Also at the root: `robots.txt` (allows search and AI crawlers and points at the sitemap), `sitemap.xml`, `llms.txt`, and `llms-full.txt`. Canonical, Open Graph, JSON-LD, and sitemap URLs use https://millerbilt.com/.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/
