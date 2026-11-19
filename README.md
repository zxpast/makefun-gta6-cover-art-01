[![Make GTA 6 Cover Art](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/c/gta6-cover-art-01)
[![Rank](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/c/gta6-cover-art-01)
[![Reward](https://make.fun/badge/gta6-cover-art-01/zxpast/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/c/gta6-cover-art-01)

# Vice Coast Cover Studio — Make GTA 6 Cover Art

Turn any photo and a caption into a multi-panel, Vice City sunset cover — offline,
in your browser, with nothing uploaded. Built for the
[Make GTA 6 Cover Art](https://make.fun/c/gta6-cover-art-01) competition on make.fun.

## What it does

| Step | How |
| --- | --- |
| 1 · Photos | Add your own photos (or try the samples). Photos never leave your machine. |
| 2 · Layout & grade | Pick 1 of 4 layouts — Hero + 3, Four grid, Big + strip, Tilted snaps — and 1 of 4 grades — Sunset, Neon nights, Vice pink, Golden hour. |
| 3 · Caption | Type the title and subtitle; a star badge and coast tag are optional. |
| 4 · Panels | Click a panel to select it, click a photo to place it there; drag to move, scroll to zoom, or use the sliders. Fill all panels with one photo or spread photos across them. |
| 5 · Export | One click exports a PNG at 1080 × 1080, 1080 × 1350, or 1920 × 1080. |

## The art

Everything on the cover is drawn procedurally on canvas by `app/src/cover.js` —
a gradient sunset sky with a striped retro sun, palm and skyline silhouettes,
white-bordered photo panels with a gradient-map grade, Anton title lettering with
a Pacifico script subtitle, plus grain and a vignette. No Rockstar Games logo,
artwork, or font is used anywhere: the lettering is
[Anton](https://github.com/googlefonts/AntonFont) and
[Pacifico](https://github.com/googlefonts/Pacifico), both shipped under the
SIL Open Font License (see `app/fonts/`).

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open the page in desktop Chrome. No build step, no network request: every file
the app loads lives under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to
the output directory and writes `dossier.json` with the vendored
`vendor/makefun-app.ts`. Run it twice and the bytes are identical.

## Screenshots

`shots.json` lists the four scenes, all rendered live from the running app:

| File | Shows |
| --- | --- |
| `screenshots/1-cover.jpg` | Exported wide cover (1920 × 1080), Hero + 3, Sunset |
| `screenshots/2-editor.jpg` | The editor with sample photos loaded |
| `screenshots/3-cover.jpg` | Exported portrait cover (1080 × 1350), Big + strip, Neon nights |
| `screenshots/4-cover.jpg` | Exported square cover (1080 × 1080), Tilted snaps, Golden hour |

The sample photos under `app/samples/` were made for make.fun with an image
model and are free to use.

## License

MIT — see [LICENSE](LICENSE).
