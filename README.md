# Sunset Heat Cover Studio

[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

Turn your photos into GTA-style poster cover art: multi-panel collages with
distinct photo crops, a sunset or neon grade over the photo pixels, chrome 3D
lettering, per-panel caption chips, and poster furniture — seal, press quote,
VOL tag, footer credits and barcode. Original art made on your device; no
Rockstar logos, artwork or fonts.

## How it works — four steps

1. **Photos** — load up to 4 of your own photos (two samples are included),
   Fill all panels with one photo, Spread them across the panels, or roll
   Surprise me.
2. **Layout & Grade** — pick one of 4 layouts (six panels, hero + three,
   four grid, tilted snaps) and one of 4 grades (Sunset, Neon nights,
   Vice pink, Golden hour), or start from a preset cover.
3. **Caption** — edit the chrome title, the script subtitle and the title size.
4. **Selected Panel** — click a panel (or pick it from the list) and edit its
   place, time and story, then zoom and pan the photo inside it.

Every change redraws the live preview at once. Export writes a PNG in the
common post sizes — 1080 × 1080, 1080 × 1350 or 1920 × 1080.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

Entered on [make.fun](https://make.fun/?ref=6hmpy1rq&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01).
