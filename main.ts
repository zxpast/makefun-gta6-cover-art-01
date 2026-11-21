// Vice Coast Cover Studio — build entrypoint (Node 22, standard library
// only). It validates the entry the way the gate will, then hands it in:
// app/ and screenshots/ are copied from beside this file to /output and
// /output/dossier.json is written with the vendored make.fun library.
//
// The checks run BEFORE anything is written, so a bad build fails loudly
// here instead of failing the sealed scorer:
//   - screenshots: 3-4 files, each a whole PNG or JPEG, at most 256 KiB,
//     long side at most 1280 px and short side at least 480 px (the R4
//     killer was a 1080x1350 cover; the export clamp in cover.js and the
//     shot clamp in shots.js are the first line, this is the second).
//   - README.md carries the three live make.fun badges (the plain
//     make.fun badge, plus the rank and reward badges for this owner and
//     repo); a post-recording README fix fails transcripts_witnessed, so
//     the badges are checked while the recording is still open.
//   - the Anton + Pacifico fonts and their OFL texts are present in
//     app/fonts/ (the canvas title and subtitle need them).
//   - app/ stays inside the gate caps (993 entries, 48 MiB).
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const OWNER = 'zxpast';
const REPO = 'makefun-gta6-cover-art-01';
const MAX_SHOT_BYTES = 262144;
const MAX_LONG_SIDE = 1280;
const MIN_SHORT_SIDE = 480;

// Read a PNG or JPEG's pixel size straight from its header, no decoder.
export function imageSize(buf: Buffer): { w: number; h: number; kind: string } {
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), kind: 'png' };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), kind: 'jpeg' };
      }
      i += 2 + len;
    }
  }
  throw new Error('not a whole PNG or JPEG');
}

function fail(message: string): never {
  throw new Error(`build refused: ${message}`);
}

function checkScreenshots(dir: string): void {
  if (!existsSync(dir)) fail('screenshots/ is missing');
  const names = readdirSync(dir).filter((n) => !n.startsWith('.')).sort();
  if (names.length < 3 || names.length > 4) fail(`need 3-4 screenshots, found ${names.length}`);
  for (const name of names) {
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(name) || name.startsWith('-')) fail(`bad screenshot name: ${name}`);
    const file = join(dir, name);
    const size = statSync(file).size;
    if (size > MAX_SHOT_BYTES) fail(`${name} is ${size} bytes, over the 256 KiB cap`);
    const { w, h, kind } = imageSize(readFileSync(file));
    const longSide = Math.max(w, h);
    const shortSide = Math.min(w, h);
    if (longSide > MAX_LONG_SIDE) fail(`${name} is ${w}x${h}, long side over 1280`);
    if (shortSide < MIN_SHORT_SIDE) fail(`${name} is ${w}x${h}, short side under 480`);
    console.log(`shot ok: ${name} ${kind} ${w}x${h} ${size} bytes`);
  }
}

function checkReadme(dir: string): void {
  const readme = readFileSync(join(dir, 'README.md'), 'utf8');
  const need = [
    'make.fun/badge/gta6-cover-art-01.svg',
    `${OWNER}/${REPO}/rank.svg`,
    `${OWNER}/${REPO}/reward.svg`,
  ];
  for (const needle of need) {
    if (!readme.includes(needle)) fail(`README.md is missing the live badge: ${needle}`);
  }
  console.log('readme ok: three live make.fun badges present');
}

function checkFonts(dir: string): void {
  for (const font of ['Anton-Regular.ttf', 'Pacifico-Regular.ttf', 'OFL-Anton.txt', 'OFL-Pacifico.txt']) {
    if (!existsSync(join(dir, 'app', 'fonts', font))) fail(`app/fonts/${font} is missing`);
  }
  console.log('fonts ok: Anton + Pacifico + OFL texts present');
}

function checkApp(dir: string): void {
  let entries = 0;
  let bytes = 0;
  const walk = (d: string): void => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      entries++;
      if (st.isDirectory()) { walk(p); continue; }
      bytes += st.size;
    }
  };
  walk(join(dir, 'app'));
  if (entries > 993) fail(`app/ has ${entries} entries, over the 993 cap`);
  if (bytes > 48 * 1024 * 1024) fail(`app/ is ${bytes} bytes, over the 48 MiB cap`);
  if (!existsSync(join(dir, 'app', 'index.html'))) fail('app/index.html is missing');
  console.log(`app ok: ${entries} entries, ${bytes} bytes`);
}

// Validate first, then hand in. A refused build writes nothing.
checkScreenshots(join(here, 'screenshots'));
checkReadme(here);
checkFonts(here);
checkApp(here);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (competition.yaml "## The gate"): only
// text_max_bytes shapes the bytes; the others refuse an entry the scorer
// would refuse (more than 4 screenshots or one over 256 KiB; more than 993
// files in app/ or 48 MiB of app files, in all, or a path under app/ over
// 1000 bytes: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);
console.log(`built ${out} — dossier written`);
