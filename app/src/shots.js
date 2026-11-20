// Fixed scenes for screenshots: ?shot=cover renders one preset cover
// alone; ?shot=editor shows the editor with a cover in its live preview.
// Every cover shot runs the two art gates before it reports ready:
//   1. cast gate — >=5 different faces, zero duplicates in the cover.
//   2. flat-space gate — flat-pixel fraction must stay under 12%.
//   3. luminance gate — a panel captioned midnight must render dark.
// A failed gate throws (the shooter logs it as a page error) instead of
// silently shipping a bad screenshot. window.__shotReady is set once the
// paint is done and the gates pass.
import { drawCoverTracked, flatFraction, luminanceGate, validateCast, PRESETS } from './cover.js';

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load('100px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.load('bold 16px system-ui'),
    ]);
    await document.fonts.ready;
  } catch { /* fall back to system fonts if a font file is missing */ }
}

function report(name, value) {
  // Visible in the shooter's console log and in window.__coverChecks.
  console.log(`[cover-check] ${name}: ${value}`);
  window.__coverChecks = window.__coverChecks || {};
  window.__coverChecks[name] = value;
}

export async function runShot(shot, query, state, redraw) {
  await loadFonts();
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const presetId = query.get('preset') || 'sunset-heat';
    const preset = PRESETS[presetId];
    if (!preset) throw new Error(`unknown preset ${presetId}`);
    const cast = validateCast(presetId);
    report(`${presetId} faces`, `${cast.unique} unique / ${cast.faces.length} panels`);
    if (!cast.ok) throw new Error(`cast gate failed for ${presetId}: ${cast.unique} unique faces, duplicates: ${cast.duplicates.join(',')}`);
    const w = Number(query.get('w') || 1280);
    const h = Number(query.get('h') || 720);
    const canvas = document.getElementById('cover');
    canvas.width = w;
    canvas.height = h;
    drawCoverTracked(canvas, state.photos, presetId, {
      layout: preset.layout, grade: preset.grade,
      title: preset.title, subtitle: preset.subtitle,
      panels: preset.panels.map((p) => ({ ...p })),
      look: state.look,
    });
    const flat = flatFraction(canvas);
    report(`${presetId} flat fraction`, flat.toFixed(3));
    if (flat > 0.12) throw new Error(`flat-space gate failed for ${presetId}: ${(flat * 100).toFixed(1)}% > 12%`);
    const lumFailures = luminanceGate(canvas, presetId);
    report(`${presetId} luminance failures`, lumFailures.length ? lumFailures.join(' | ') : 'none');
    if (lumFailures.length) throw new Error(`luminance gate failed for ${presetId}: ${lumFailures.join(' | ')}`);
    report(`${presetId} gate`, 'PASS');
  } else if (shot === 'editor') {
    document.body.classList.add('shot-editor');
    // The editor shot shows the sunset-heat cover live in the preview.
    state.preset = 'sunset-heat';
    state.layout = PRESETS['sunset-heat'].layout;
    state.grade = PRESETS['sunset-heat'].grade;
    state.title = PRESETS['sunset-heat'].title;
    state.subtitle = PRESETS['sunset-heat'].subtitle;
    state.panels = null;
    redraw();
    const flat = flatFraction(document.getElementById('cover'));
    report('editor preview flat fraction', flat.toFixed(3));
  }
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
