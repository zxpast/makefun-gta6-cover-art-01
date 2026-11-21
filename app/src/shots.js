// Fixed scenes for screenshots: ?shot=cover shows one exported cover alone,
// ?shot=editor shows the editor with a cast photo loaded. `preset` picks the
// preset, `layout` overrides its layout, `w`/`h` size the cover canvas
// (clamped to the 1280 long-side export cap, so a shot can never exceed it).
// window.__shotReady is set once painted; window.__artChecks carries the
// art-gate measurements for that render (faces, flat fraction, title
// overlap, per-panel luminance vs caption time).

import { PRESETS, drawCover, clampExportSize } from './cover.js';

export async function runShot(shot, query, app) {
  const { images, canvas, applyPreset } = app;
  const presetId = query.get('preset') ?? 'sunset-heat';
  const preset = PRESETS[presetId] ?? PRESETS['sunset-heat'];
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const wantW = Number(query.get('w') ?? 1280);
    const wantH = Number(query.get('h') ?? 720);
    const size = clampExportSize(wantW, wantH);
    canvas.width = size.w;
    canvas.height = size.h;
    const layout = query.get('layout') ?? preset.layout;
    const checks = drawCover(canvas, images, {
      preset: presetId, layout,
      title: query.get('caption') ?? preset.title,
    });
    window.__artChecks = { ...checks, shot, preset: presetId, size };
  } else {
    document.body.classList.add('shot-editor');
    applyPreset(presetId);
    window.__artChecks = { shot, preset: presetId, editor: true };
  }
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
