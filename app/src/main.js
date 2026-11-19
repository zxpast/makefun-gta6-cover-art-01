// Vice Coast Cover Studio — editor wiring: photo slots, layout + grade picks,
// caption fields, per-panel crop controls, export sizes, PNG export, and the
// ?shot= scenes the screenshots are taken from (see shots.js).
import { COVER_GRADES, COVER_LAYOUTS, COVER_SIZES, drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const layoutSelect = document.getElementById('layout');
const gradeSelect = document.getElementById('grade');
const sizeSelect = document.getElementById('size');
const panelSelect = document.getElementById('panel');
const zoomInput = document.getElementById('zoom');
const panXInput = document.getElementById('panx');
const panYInput = document.getElementById('pany');
const starsToggle = document.getElementById('stars');
const status = document.getElementById('status');
const previewNote = document.getElementById('preview-note');

const images = { boulevard: null, pier: null };
const tweaks = {};

function currentLayout() {
  return COVER_LAYOUTS[layoutSelect.value] ?? COVER_LAYOUTS['sunset-heat'];
}

function refreshPanelList() {
  const layout = currentLayout();
  const keep = panelSelect.value;
  panelSelect.innerHTML = '';
  layout.panels.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `Panel ${i + 1} — ${p.chip ?? p.photo}`;
    panelSelect.appendChild(opt);
  });
  panelSelect.value = [...panelSelect.options].some((o) => o.value === keep) ? keep : '0';
  syncCropInputs();
}

function syncCropInputs() {
  const t = tweaks[panelSelect.value] ?? { zoom: 1, panX: 0, panY: 0 };
  zoomInput.value = String(t.zoom);
  panXInput.value = String(t.panX);
  panYInput.value = String(t.panY);
  document.getElementById('zoom-val').textContent = `${Math.round(t.zoom * 100)}%`;
  document.getElementById('panx-val').textContent = `${Math.round(t.panX * 100)}`;
  document.getElementById('pany-val').textContent = `${Math.round(t.panY * 100)}`;
}

function redraw() {
  const layout = currentLayout();
  const size = COVER_SIZES[layout.size];
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas, images, {
    preset: layoutSelect.value,
    grade: gradeSelect.value,
    title: titleInput.value,
    subtitle: subtitleInput.value,
    stars: starsToggle.checked,
    tweaks,
  });
  previewNote.textContent = `Live preview — ${layout.label} · ${size.label} · ${COVER_GRADES[gradeSelect.value]?.label ?? ''} grade`;
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Loads the two sample photos (and the bundled fonts) before the first draw. */
async function loadSamples() {
  try {
    await document.fonts.load('400 100px Anton');
    await document.fonts.load('400 100px Pacifico');
  } catch {
    // Fallback fonts still draw; the bundled faces just arrive late.
  }
  images.boulevard = await loadImage('samples/boulevard.jpg');
  images.pier = await loadImage('samples/pier.jpg');
  redraw();
}

function bindPhotoInput(id, key) {
  document.getElementById(id).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    images[key] = await loadImage(URL.createObjectURL(file));
    status.textContent = `Loaded your photo into the ${key} slot.`;
    redraw();
  });
}

bindPhotoInput('photo-boulevard', 'boulevard');
bindPhotoInput('photo-pier', 'pier');
titleInput.addEventListener('input', redraw);
subtitleInput.addEventListener('input', redraw);
layoutSelect.addEventListener('change', () => {
  const layout = currentLayout();
  titleInput.value = layout.title;
  subtitleInput.value = layout.subtitle;
  refreshPanelList();
  redraw();
});
gradeSelect.addEventListener('change', redraw);
starsToggle.addEventListener('change', redraw);
panelSelect.addEventListener('change', syncCropInputs);
for (const [input, key] of [[zoomInput, 'zoom'], [panXInput, 'panX'], [panYInput, 'panY']]) {
  input.addEventListener('input', () => {
    const idx = panelSelect.value;
    tweaks[idx] = tweaks[idx] ?? { zoom: 1, panX: 0, panY: 0 };
    tweaks[idx][key] = Number(input.value);
    syncCropInputs();
    redraw();
  });
}

document.getElementById('fill-all').addEventListener('click', () => {
  status.textContent = 'Both sample photos fill every panel — each panel uses a different crop.';
  redraw();
});
document.getElementById('surprise').addEventListener('click', () => {
  const names = Object.keys(COVER_LAYOUTS);
  layoutSelect.value = names[Math.floor(Math.random() * names.length)];
  const grades = Object.keys(COVER_GRADES);
  gradeSelect.value = grades[Math.floor(Math.random() * grades.length)];
  const layout = currentLayout();
  titleInput.value = layout.title;
  subtitleInput.value = layout.subtitle;
  refreshPanelList();
  status.textContent = `Surprise me: ${layout.label} + ${COVER_GRADES[gradeSelect.value].label} grade.`;
  redraw();
});
document.getElementById('export').addEventListener('click', () => {
  const size = COVER_SIZES[sizeSelect.value] ?? COVER_SIZES.square;
  const out = document.createElement('canvas');
  out.width = size.w;
  out.height = size.h;
  drawCover(out, images, {
    preset: layoutSelect.value,
    grade: gradeSelect.value,
    title: titleInput.value,
    subtitle: subtitleInput.value,
    stars: starsToggle.checked,
    tweaks,
  });
  out.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-coast-cover-${size.w}x${size.h}.png`;
    a.click();
    status.textContent = `Saved vice-coast-cover-${size.w}x${size.h}.png`;
  }, 'image/png');
});

const query = new URLSearchParams(location.search);
const shot = query.get('shot');
if (shot) {
  runShot(shot, query, async (preset, title, subtitle, grade) => {
    layoutSelect.value = preset;
    gradeSelect.value = grade ?? 'sunset';
    titleInput.value = title;
    subtitleInput.value = subtitle;
    await loadSamples();
    document.body.classList.add('shot-ready');
    window.__shotReady = true;
  });
} else {
  refreshPanelList();
  loadSamples();
}
