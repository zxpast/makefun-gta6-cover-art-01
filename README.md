# Vice Coast Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An offline browser app that turns photos into GTA-style cover art: a mosaic
of cinematic panels, a chrome title that cuts across the panels, a script
subtitle, and a thin credits footer. No flat title band, ever.

## The cast

Six faces, roles fixed on every cover (two kit photos, four original
portraits made for this entry):

| Face | Role | Light |
| --- | --- | --- |
| boulevard | THE BOSS | sunset |
| vice | THE CREW | sunset |
| fixer | THE FIXER | sunset marina |
| pier | THE CREW | day |
| insider | THE INSIDER | midnight neon |
| courier | THE COURIER | midnight neon |

Every cover uses five different faces — zero duplicates, enforced by
`validateCast` in `app/src/cover.js`.

## Presets

| Preset | Layout | Grade | Caption time |
| --- | --- | --- | --- |
| Sunset Heat | Hero mosaic | Sunset Heat | sunset |
| Neon Nights | Hero mosaic | Neon Nights | midnight |
| Golden Coast | Tilted snaps | Golden Coast | sunset |

The neon grade (magenta/cyan overlay + night darkening + vignette + glow)
is painted on top of the photo pixels, so graded panels really read as
night; `checkTimeCoherence` measures the graded panel luminance against
the caption time and fails a "midnight" panel with daylight luminance.

## Editor

Three steps in the header: **1 Add photos / 2 Caption / 3 Export PNG**.
The library shows all six cast photos plus **Surprise me**; your own
photos (up to 8) join the cast. Six layouts (Hero mosaic, Tilted snaps,
Diagonal trio, Seven mosaic, Grid six, Strip five), six grades (Sunset
Heat, Neon Nights, Golden Coast, Tropic teal, Heatwave, Vice Violet),
per-panel Face / Flip / Swap with a face smart-crop, and Paint / Grade /
Halftone / Grain / Glow sliders that all change the render. The hero
figure pops out 10% larger than its panel frame with a white outline glow.

Export: Wide 1280×720, Portrait 1024×1280, Square 1080×1080 — or
**Export all three**. The 1280 long-side clamp lives in the code
(`clampExportSize` in `app/src/cover.js`), not just in the screenshots.

## Run it

```sh
node serve.ts        # app/ on http://localhost:8080
```

Build the entry (validates screenshots, README badges and fonts first):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots live in `screenshots/` (see `shots.json` for the four scenes).
Fonts are Anton and Pacifico under the SIL Open Font License
(`app/fonts/OFL-Anton.txt`, `app/fonts/OFL-Pacifico.txt`).
