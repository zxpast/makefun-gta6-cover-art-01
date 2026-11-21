# Vice Coast Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An offline browser app that turns your photos into GTA-style multi-panel
poster cover art — a Vice City neon-sunset grade, chrome striped titles,
caption chips and poster furniture — exported as a PNG in the common post
sizes (1080 × 1080, 1080 × 1350, 1920 × 1080).

## What it does

- **Six original characters** in the cast library: THE BOSS, THE INSIDER,
  THE FIXER, THE COURIER, plus the kit's THE DRIVER and THE ANGLER. Every
  cover uses at least five different faces and never repeats one inside a
  cover.
- **Three presets**: Sunset Heat (six-panel wide hero, pop-out hero
  cut-out), Neon Nights (five night faces, magenta/cyan grade), Golden
  Coast (tilted snaps).
- **Grade on the photo pixels**: sunset / neon / golden-hour washes,
  vignette, halftone and grain composited over every panel — never only
  over a band. Caption times never contradict the photo: midnight panels
  are genuinely dark.
- **Chrome title overlapping the panels** in the middle of the cover
  (yellow → orange → pink gradient, stripes, dark outline, drop shadow)
  with a pink neon script subtitle. No flat title band — the only flat
  strip is the ~7% footer with tagline, credits, barcode and studio logo.
- **Editor**: 6 layouts, 6 grades, per-panel Face / Flip / Swap and smart
  crops, Look & Title sliders (Paint, Grade, Halftone, Grain, Glow),
  "Surprise me", up to 8 of your own photos, and Export all three sizes.
- **Offline**: no network requests, photos stay on your device.

## Run it

```sh
node serve.ts        # app on http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the [make.fun bounty gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01)
($250 prize pool). Lettering is Anton & Pacifico (SIL Open Font License).
All sample photos are original AI portraits made for this studio — no
Rockstar Games logos, artwork or fonts anywhere.

---
Referral: `6hmpy1rq`
