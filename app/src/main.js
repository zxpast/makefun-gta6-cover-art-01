// Vice Coast Cover Studio — editor wiring (round 2).
// Loads the sample photos, wires every control to the poster renderer, and
// exports the finished cover as a PNG in the three common post sizes.
// A `?shot=` query stages a fixed scene for screenshots instead (shots.js).
import { drawCover, COVER_PRESETS, COVER_SIZES, COVER_GRADES, COVER_LAYOUTS } from './cover.js';
import { runShot } from './shots.js';

const preview = document.getElementById('coverCanvas');
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const sizeSelect = document.getElementById('sizeSelect');
const presetSelect = document.getElementById('presetSelect');
const statusLine = document.getElementById('statusLine');
const panelList = document.getElementById('panelList');
const exportButton = document.getElementById('exportButton');
const surpriseButton = document.getElementById('surpriseButton');
const uploadInput = document.getElementById('uploadInput');
const sampleButtons = document.querySelectorAll('[data-sample]');

const photos = { boulevard: null, pier: null };
const uploads = [];
let activePreset = 'sunsetHeist';
let activeLayout = null;
let activeGrade = null;
let activeSize = null;
let adjust = {};
let captions = null;
let selectedPanel = 0;

function currentPreset() {
  return COVER_PRESETS[activePreset] || COVER_PRESETS.sunsetHeist;
}

function currentState() {
  const preset = currentPreset();
  return {
    preset: activePreset,
    layout: activeLayout || preset.layout,
    grade: activeGrade || preset.grade,
    title: titleInput.value || preset.title,
    subtitle: subtitleInput.value || preset.subtitle,
    size: activeSize || preset.size,
    adjust,
    captions,
  };
}

/** Loads an image from a URL, resolving once it can be drawn on a canvas. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

/** Redraws the live preview from the current editor state. */
export function redrawPreview() {
  const state = currentState();
  const allPhotos = { ...photos };
  uploads.forEach((img, i) => { allPhotos[`upload${i}`] = img; });
  drawCover(preview, allPhotos, state);
  syncPanelList();
}

function syncPanelList() {
  const preset = currentPreset();
  const count = preset.panels.length;
  if (panelList.children.length !== count) buildPanelList();
  [...panelList.children].forEach((row, i) => {
    row.classList.toggle('selected', i === selectedPanel);
    const zoom = row.querySelector('.panel-zoom');
    const panX = row.querySelector('.panel-panx');
    const panY = row.querySelector('.panel-pany');
    const adj = adjust[i] || { zoom: 1, dx: 0, dy: 0 };
    if (zoom && document.activeElement !== zoom) zoom.value = adj.zoom;
    if (panX && document.activeElement !== panX) panX.value = adj.dx;
    if (panY && document.activeElement !== panY) panY.value = adj.dy;
  });
}

function buildPanelList() {
  const preset = currentPreset();
  panelList.innerHTML = '';
  preset.panels.forEach((panel, i) => {
    const row = document.createElement('div');
    row.className = 'panel-row';
    row.dataset.index = String(i);
    const place = captions && captions[i] ? captions[i].place : panel.place;
    const time = captions && captions[i] ? captions[i].time : panel.time;
    const story = captions && captions[i] ? captions[i].story : panel.story;
    row.innerHTML =
      `<button type="button" class="panel-pick">${i + 1} · ${place} — ${panel.photo}</button>` +
      `<label>Caption <input type="text" class="panel-story" value="${story}" maxlength="40"></label>` +
      `<label>Place <input type="text" class="panel-place" value="${place}" maxlength="24"></label>` +
      `<label>Time <input type="text" class="panel-time" value="${time}" maxlength="12"></label>` +
      `<label>Zoom <input type="range" class="panel-zoom" min="1" max="2.5" step="0.05" value="1"></label>` +
      `<label>Pan X <input type="range" class="panel-panx" min="-0.4" max="0.4" step="0.02" value="0"></label>` +
      `<label>Pan Y <input type="range" class="panel-pany" min="-0.4" max="0.4" step="0.02" value="0"></label>`;
    row.querySelector('.panel-pick').addEventListener('click', () => {
      selectedPanel = i;
      syncPanelList();
    });
    row.querySelector('.panel-story').addEventListener('input', (e) => {
      setCaption(i, 'story', e.target.value);
    });
    row.querySelector('.panel-place').addEventListener('input', (e) => {
      setCaption(i, 'place', e.target.value.toUpperCase());
    });
    row.querySelector('.panel-time').addEventListener('input', (e) => {
      setCaption(i, 'time', e.target.value.toUpperCase());
    });
    row.querySelector('.panel-zoom').addEventListener('input', (e) => {
      setAdjust(i, 'zoom', Number(e.target.value));
    });
    row.querySelector('.panel-panx').addEventListener('input', (e) => {
      setAdjust(i, 'dx', Number(e.target.value));
    });
    row.querySelector('.panel-pany').addEventListener('input', (e) => {
      setAdjust(i, 'dy', Number(e.target.value));
    });
    panelList.appendChild(row);
  });
}

function setCaption(i, key, value) {
  if (!captions) captions = currentPreset().panels.map((p) => ({ ...p }));
  captions[i] = { ...captions[i], [key]: value };
  redrawPreview();
}

function setAdjust(i, key, value) {
  adjust[i] = { zoom: 1, dx: 0, dy: 0, ...(adjust[i] || {}), [key]: value };
  redrawPreview();
}

function buildPickers() {
  const layoutBox = document.getElementById('layoutBox');
  const gradeBox = document.getElementById('gradeBox');
  layoutBox.innerHTML = '';
  COVER_LAYOUTS.forEach((layout) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = layout.label;
    b.dataset.layout = layout.id;
    b.addEventListener('click', () => {
      activeLayout = layout.id;
      [...layoutBox.children].forEach((c) => c.classList.toggle('on', c === b));
      redrawPreview();
    });
    layoutBox.appendChild(b);
  });
  gradeBox.innerHTML = '';
  COVER_GRADES.forEach((grade) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = grade.label;
    b.dataset.grade = grade.id;
    b.addEventListener('click', () => {
      activeGrade = grade.id;
      [...gradeBox.children].forEach((c) => c.classList.toggle('on', c === b));
      redrawPreview();
    });
    gradeBox.appendChild(b);
  });
  sizeSelect.innerHTML = '';
  COVER_SIZES.forEach((size) => {
    const o = document.createElement('option');
    o.value = size.id;
    o.textContent = size.label;
    sizeSelect.appendChild(o);
  });
  presetSelect.innerHTML = '';
  Object.values(COVER_PRESETS).forEach((preset) => {
    const o = document.createElement('option');
    o.value = preset.id;
    o.textContent = preset.name;
    presetSelect.appendChild(o);
  });
}

function markActivePickers() {
  const state = currentState();
  document.querySelectorAll('#layoutBox .pick').forEach((b) => {
    b.classList.toggle('on', b.dataset.layout === state.layout);
  });
  document.querySelectorAll('#gradeBox .pick').forEach((b) => {
    b.classList.toggle('on', b.dataset.grade === state.grade);
  });
  sizeSelect.value = state.size;
  presetSelect.value = activePreset;
}

/** Applies a whole preset: layout, grade, size, title and captions reset. */
export function applyPreset(id) {
  const preset = COVER_PRESETS[id];
  if (!preset) return;
  activePreset = id;
  activeLayout = preset.layout;
  activeGrade = preset.grade;
  activeSize = preset.size;
  titleInput.value = preset.title;
  subtitleInput.value = preset.subtitle;
  adjust = {};
  captions = null;
  selectedPanel = 0;
  markActivePickers();
  redrawPreview();
}

async function exportCover() {
  const state = currentState();
  const off = document.createElement('canvas');
  const allPhotos = { ...photos };
  uploads.forEach((img, i) => { allPhotos[`upload${i}`] = img; });
  drawCover(off, allPhotos, state);
  const size = COVER_SIZES.find((s) => s.id === state.size) || COVER_SIZES[0];
  const name = `cover-${size.w}x${size.h}.png`;
  off.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    statusLine.textContent = `Saved ${name} — ${size.label}, original art made on your device.`;
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

exportButton.addEventListener('click', exportCover);
surpriseButton.addEventListener('click', () => {
  const ids = Object.keys(COVER_PRESETS);
  const next = ids[(ids.indexOf(activePreset) + 1) % ids.length];
  applyPreset(next);
  statusLine.textContent = `Surprise: now showing ${COVER_PRESETS[next].name}.`;
});
titleInput.addEventListener('input', redrawPreview);
subtitleInput.addEventListener('input', redrawPreview);
sizeSelect.addEventListener('change', () => {
  activeSize = sizeSelect.value;
  redrawPreview();
});
presetSelect.addEventListener('change', () => applyPreset(presetSelect.value));
uploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = await loadImage(URL.createObjectURL(file));
  uploads.push(img);
  const preset = currentPreset();
  const panel = preset.panels[selectedPanel];
  if (panel) panel.photo = `upload${uploads.length - 1}`;
  statusLine.textContent = `Loaded ${file.name} into panel ${selectedPanel + 1}.`;
  redrawPreview();
});
sampleButtons.forEach((b) => {
  b.addEventListener('click', () => {
    const preset = currentPreset();
    const panel = preset.panels[selectedPanel];
    if (panel) panel.photo = b.dataset.sample;
    statusLine.textContent = `Panel ${selectedPanel + 1} now uses the ${b.dataset.sample} photo.`;
    redrawPreview();
  });
});

/** Boots the editor: fonts first (so canvas lettering is real), then samples. */
export async function bootEditor() {
  buildPickers();
  try {
    await Promise.all([
      document.fonts.load('80px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.ready,
    ]);
  } catch { /* fall back to system fonts */ }
  try {
    photos.boulevard = await loadImage('samples/boulevard.jpg');
    photos.pier = await loadImage('samples/pier.jpg');
  } catch (e) {
    statusLine.textContent = 'Sample photos could not load — add your own photos below.';
  }
  const shot = new URLSearchParams(location.search).get('shot');
  if (shot) {
    await runShot(shot, new URLSearchParams(location.search), {
      photos, applyPreset, redrawPreview, loadImage,
    });
  } else {
    applyPreset('sunsetHeist');
  }
}

bootEditor();
