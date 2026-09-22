# OPT Explorer

Mobile-first PWA prototype for pest/disease/weed, host, IRAC/FRAC/HRAC and photo identification workflows.

## Run locally
Use a local static server (service workers do not work from `file://`).

Example with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages
Upload the repository contents and enable GitHub Pages from the `main` branch/root.

## Current status
- Mobile-first responsive UI
- PWA manifest + service worker
- Install prompt when browser supports it
- Offline cache for prototype assets
- Search demo
- OPT / disease / weed / host / MoA views
- Detail pages
- Photo upload preview
- Prototype analysis result UI
- Demo JSON data

The photo analyzer is intentionally a frontend prototype. A real vision model/API and the normalized IRAC/FRAC/HRAC + OPT/host master data should be connected next.
