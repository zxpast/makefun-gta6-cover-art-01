// Vice Coast Cover Studio — make.fun entry program (Node 22, standard library only).
//
// The app itself lives in app/ as plain static files: index.html plus its ES modules,
// styles, OFL fonts and sample photos. Nothing is built and nothing is fetched at
// run time. This program hands the entry in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes /output/dossier.json with
// the vendored make.fun library (vendor/makefun-app.ts, the kit's copy, unchanged).
//
// Run it locally the same way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Without MAKEFUN_OUTPUT_DIR it writes to /output, as the grader provides.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

// Start from a clean output directory so a second run writes byte-identical bytes.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));

// The gate's own caps (kit reference/gate.json): text_max_bytes is the only one
// that shapes the dossier's bytes; the rest refuse an entry the scorer would
// refuse anyway (over 4 screenshots, one over 256 KiB, app/ over 993 files or
// 48 MiB, or a path under app/ over 1000 bytes).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
