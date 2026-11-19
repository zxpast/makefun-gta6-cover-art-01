// Sunset Heat Cover Studio — a gta6-cover-art-01 entry (Node 22, stdlib).
// The app is this directory's app/ folder: plain static files a desktop
// browser loads offline (app/index.html and its ES modules, vendored fonts,
// no network request). This program hands it in: it copies app/ and
// screenshots/ from beside this file to /output and writes
// /output/dossier.json with the vendored make.fun library.
//
// The output directory itself is never removed: as uid 65534 the grader
// cannot delete /output, so a stale run would fail with EPERM. Instead
// each top-level entry inside /output is emptied one by one, which the
// grader can do, and the directories are recreated fresh.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/** Empty a directory's contents entry by entry; never remove the dir itself. */
function emptyDir(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

emptyDir(out);
emptyDir(join(out, 'app'));
emptyDir(join(out, 'screenshots'));
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files in app/ or 48 MiB
// of app files, in all, or a path under app/ over 1000 bytes).
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
const { size: dossierBytes } = (await import('node:fs')).statSync(join(out, 'dossier.json'));
const shotCount = readdirSync(join(out, 'screenshots')).length;
if (shotCount > 4) throw new Error(`too many screenshots handed in: ${shotCount}`);
console.log(`dossier written to ${join(out, 'dossier.json')} (${dossierBytes} bytes, ${shotCount} screenshots)`);
