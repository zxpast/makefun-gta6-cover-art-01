# Sunset Heat Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An offline web app that turns your photos and a caption into GTA 6-style
cover art — the multi-panel poster look with a Vice City neon-sunset grade —
exported as a PNG to share. Built for make.fun's
[Make GTA 6 Cover Art](https://make.fun/bounty/gta6-cover-art-01) bounty ($250).

## How it works

1. **Photos** — add your own photos (or keep the two samples). Fill all
   panels with one photo, or spread several across the panels.
2. **Layout & Grade** — four layouts (Sunset Six, Hero + Trio, Four Grid,
   Tilted Snaps) and four grades (Sunset, Neon Nights, Vice Pink, Golden
   Hour). The grade is composited onto the photo pixels: warm wash,
   vignette, halftone grain.
3. **Caption** — title, subtitle, and export size (1080×1080, 1080×1350,
   1920×1080). The title is chrome 3D lettering overlapping the panels.
4. **Selected Panel** — edit each panel's location + time + micro-story
   chip, and zoom / pan the crop. Faces stay whole; no crop is ever
   repeated in one cover.

Every cover carries poster furniture: an "ORIGINAL COVER ART" seal, a press
quote, a VOL tag, a tagline strip, footer credits and a barcode. Everything
runs on your device — no upload, no network request.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Build the dossier

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Lettering is Anton & Pacifico (SIL Open Font License), vendored under
`app/fonts/`. Original art only — no Rockstar logos, artwork or fonts.

<sub>Entered on [make.fun](https://make.fun/?ref=6hmpy1rq&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
