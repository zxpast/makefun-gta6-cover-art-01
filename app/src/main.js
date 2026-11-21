// Vice Coast Cover Studio — editor wiring.
//
// Steps in the header: 1 Add photos / 2 Caption / 3 Export PNG. The library
// shows all six cast photos; "Surprise me" picks a random preset; your own
// photos (up to 8) join the cast as extra faces. Every control re-renders
// the same drawCover canvas the screenshots use, so the editor and the
// exported covers can never drift apart.

import { CAST, GRADES, LAYOUTS, PRESETS, drawCover, clampExportSize, EXPORT_SIZES } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');
const library = document.getElementById('library');
const captionInput = document.getElementById('caption');
const subtitleInput = document.getElementById('subtitle');
const taglineInput = document.getElementById('tagline');
const layoutSelect = document.getElementById('layout');
const gradeSelect = document.getElementById('grade');
const panelSelect = document.getElementById('panel');
const cropSelect = document.getElementById('crop');

const images = {};       // cast id -> HTMLImageElement
const userPhotos = [];   // { id, img, name } — up to 8
let state = {
  preset: 'sunset-heat',
  photos: [...PRESETS['sunset-heat'].photos],
  layout: 'hero-mosaic',
  grade: 'sunset-heat',
  title: 'VICE COAST',
  subtitle: PRESETS['sunset-heat'].subtitle,
  tagline: PRESETS['sunset-heat'].tagline,
  look: { paint: 0.5, grade: 0.7, halftone: 0.25, grain: 0.3, glow: 0.6 },
  faceCrop: true,
  selectedPanel: 0,
  flipped: {},
};

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load('100px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.ready,
    ]);
  } catch { /* fall back to system fonts; the render still works */ }
}

function currentChecks() {
  return drawCover(canvas, images, {
    layout: state.layout, grade: state.grade, photos: state.photos,
    title: state.title, subtitle: state.subtitle, tagline: state.tagline,
    look: state.look, faceCrop: state.faceCrop, flipped: state.flipped,
  });
}

function redraw() {
  try {
    const checks = currentChecks();
    status.textContent = checks.timeOk && checks.titleOverlaps && checks.flatFraction < 0.12
      ? `Ready — ${checks.uniqueFaces} faces, flat ${(checks.flatFraction * 100).toFixed(1)}%, title overlaps panels.`
      : `Check: faces ${checks.uniqueFaces}, flat ${(checks.flatFraction * 100).toFixed(1)}%, title overlap ${checks.titleOverlaps}, time OK ${checks.timeOk}.`;
  } catch (err) {
    status.textContent = err.message;
  }
}

function buildLibrary() {
  library.innerHTML = '';
  for (const member of CAST) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb';
    btn.dataset.id = member.id;
    btn.innerHTML = `<img src="samples/${member.file}" alt="${member.role}"><span>${member.role}</span>`;
    btn.addEventListener('click', () => {
      const i = state.photos.indexOf(member.id);
      if (i >= 0 && state.photos.length > 5) state.photos.splice(i, 1);
      else if (i < 0) state.photos[state.selectedPanel % state.photos.length] = member.id;
      syncPanelSelect();
      redraw();
    });
    library.appendChild(btn);
  }
}

function syncPanelSelect() {
  panelSelect.innerHTML = '';
  state.photos.forEach((id, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `Panel ${i + 1} — ${(CAST.find((c) => c.id === id) || { role: id }).role}`;
    panelSelect.appendChild(opt);
  });
  panelSelect.value = String(state.selectedPanel);
}

function applyPreset(id) {
  const p = PRESETS[id];
  state = { ...state, preset: id, photos: [...p.photos], layout: p.layout, grade: p.grade,
    title: p.title, subtitle: p.subtitle, tagline: p.tagline, selectedPanel: 0 };
  captionInput.value = p.title;
  subtitleInput.value = p.subtitle;
  taglineInput.value = p.tagline;
  layoutSelect.value = p.layout;
  gradeSelect.value = p.grade;
  syncPanelSelect();
  redraw();
}

function fillSelects() {
  for (const [id, def] of Object.entries(LAYOUTS)) {
    const opt = document.createElement('option');
    opt.value = id; opt.textContent = def.label;
    layoutSelect.appendChild(opt);
  }
  for (const [id, def] of Object.entries(GRADES)) {
    const opt = document.createElement('option');
    opt.value = id; opt.textContent = def.label;
    gradeSelect.appendChild(opt);
  }
  const presets = document.getElementById('presets');
  for (const [id, p] of Object.entries(PRESETS)) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = p.label;
    btn.addEventListener('click', () => applyPreset(id));
    presets.appendChild(btn);
  }
}

function bindSlider(id, key) {
  const el = document.getElementById(id);
  el.addEventListener('input', () => { state.look[key] = el.value / 100; redraw(); });
}

function exportOne(size) {
  const { w, h } = clampExportSize(size.w, size.h);
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  drawCover(off, images, {
    layout: state.layout, grade: state.grade, photos: state.photos,
    title: state.title, subtitle: state.subtitle, tagline: state.tagline,
    look: state.look, faceCrop: state.faceCrop, flipped: state.flipped,
  });
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-coast-${w}x${h}.png`;
    a.click();
    status.textContent = `Saved vice-coast-${w}x${h}.png`;
  }, 'image/png');
}

document.getElementById('surprise').addEventListener('click', () => {
  const ids = Object.keys(PRESETS);
  applyPreset(ids[Math.floor(Math.random() * ids.length)]);
});
document.getElementById('addPhotos').addEventListener('change', async (e) => {
  for (const file of [...e.target.files].slice(0, 8 - userPhotos.length)) {
    const img = await loadImage(URL.createObjectURL(file));
    const id = `user-${userPhotos.length}`;
    images[id] = img;
    userPhotos.push({ id, name: file.name });
    if (state.photos.length < 6) state.photos.push(id);
  }
  status.textContent = `${userPhotos.length} of 8 of your photos added.`;
  syncPanelSelect();
  redraw();
});
captionInput.addEventListener('input', () => { state.title = captionInput.value.toUpperCase(); redraw(); });
subtitleInput.addEventListener('input', () => { state.subtitle = subtitleInput.value; redraw(); });
taglineInput.addEventListener('input', () => { state.tagline = taglineInput.value; redraw(); });
layoutSelect.addEventListener('change', () => { state.layout = layoutSelect.value; redraw(); });
gradeSelect.addEventListener('change', () => { state.grade = gradeSelect.value; redraw(); });
panelSelect.addEventListener('change', () => { state.selectedPanel = Number(panelSelect.value); });
cropSelect.addEventListener('change', () => {
  state.faceCrop = cropSelect.value !== 'full';
  redraw();
});
document.getElementById('faceBtn').addEventListener('click', () => { state.faceCrop = true; cropSelect.value = 'face'; redraw(); });
document.getElementById('flipBtn').addEventListener('click', () => {
  const id = state.photos[state.selectedPanel];
  state.flipped[id] = !state.flipped[id];
  redraw();
});
document.getElementById('swapBtn').addEventListener('click', () => {
  const i = state.selectedPanel;
  const j = (i + 1) % state.photos.length;
  [state.photos[i], state.photos[j]] = [state.photos[j], state.photos[i]];
  state.selectedPanel = j;
  syncPanelSelect();
  redraw();
});
document.getElementById('exportAll').addEventListener('click', async () => {
  for (const size of EXPORT_SIZES) exportOne(size);
});
for (const size of EXPORT_SIZES) {
  document.getElementById(`export-${size.id}`).addEventListener('click', () => exportOne(size));
}
bindSlider('paint', 'paint');
bindSlider('gradeSlider', 'grade');
bindSlider('halftone', 'halftone');
bindSlider('grain', 'grain');
bindSlider('glow', 'glow');

const shot = new URLSearchParams(location.search).get('shot');
async function boot() {
  fillSelects();
  buildLibrary();
  syncPanelSelect();
  await loadFonts();
  for (const member of CAST) images[member.id] = await loadImage(`samples/${member.file}`);
  const params = new URLSearchParams(location.search);
  if (shot) {
    await runShot(shot, params, { images, applyPreset, redraw, canvas, status });
  } else {
    redraw();
  }
}
boot();
