# MillerBilt Cabinetry

Static marketing site for MillerBilt Cabinetry. Custom Amish-made cabinets, with showrooms in Landrum and Charleston, South Carolina.

The site is a single page at the repository root: `index.html`, with `css/`, `js/`, and `images/`.

## GitHub Pages

Publish from a branch, folder **`/ (root)`**. There is no custom domain and no `CNAME` file. Do not point `millerbilt.com` at this preview.

In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**.

- Branch: `cursor/millerbilt-site-28f0` while this branch holds the site, or `main` after it is merged
- Folder: `/ (root)`

Once that is saved, the preview is:

https://koffeekinggamer.github.io/millerbilt/

Schedule buttons stay on this page and scroll to the embedded booking calendar at `#book`. Both locations use that same calendar for now, the Landrum schedule. This page does not collect its own form submissions.

Also at the root: `robots.txt` (allows search and AI crawlers and points at the sitemap), `sitemap.xml`, `llms.txt`, and `llms-full.txt`. Canonical and social URLs use the GitHub Pages preview, not millerbilt.com.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/
