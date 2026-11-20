// Vice Coast Cover Studio — editor wiring.
// Steps: 1 Add photos / 2 Caption / 3 Export PNG. The live preview is
// the same drawCover the screenshots use, so what you see is the export.
import { drawCover, drawCoverTracked, COVER_SIZES, COVER_LAYOUTS, COVER_GRADES, SAMPLE_PHOTOS, PRESETS, validateCast } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const status = document.getElementById('status');
const libraryEl = document.getElementById('library');
const layoutEl = document.getElementById('layout');
const gradeEl = document.getElementById('grade');
const panelListEl = document.getElementById('panels');
const sizeEl = document.getElementById('size');

export function loadImage(url, photoId) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { img.dataset.photoId = photoId; resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

const state = {
  preset: 'sunset-heat',
  layout: 'six-panels',
  grade: 'sunset',
  title: 'SUNSET HEAT',
  subtitle: 'one coast · no rules',
  look: { paint: 1, grade: 1, halftone: 0.7, grain: 0.6, glow: 0.7 },
  photos: {},       // photoId -> Image
  userPhotos: [],   // {id, name, img}
  panels: null,     // working copy of the preset panels
  selected: 0,
};

function presetPanels() {
  return PRESETS[state.preset].panels.map((p) => ({ ...p }));
}

function currentPanels() {
  return state.panels || presetPanels();
}

function redraw() {
  const size = COVER_SIZES.find((s) => s.id === sizeEl.value) || COVER_SIZES[0];
  canvas.width = size.w;
  canvas.height = size.h;
  drawCoverTracked(canvas, state.photos, state.preset, {
    layout: state.layout, grade: state.grade,
    title: state.title, subtitle: state.subtitle,
    panels: currentPanels(), look: state.look,
  });
  renderPanelList();
}

function renderPanelList() {
  const panels = currentPanels();
  panelListEl.innerHTML = '';
  panels.forEach((p, i) => {
    const meta = SAMPLE_PHOTOS.find((s) => s.id === p.photo);
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === state.selected ? ' selected' : '');
    row.innerHTML = `
      <span class="panel-role">${meta ? meta.role : p.photo}</span>
      <span class="panel-cap">${p.caption} · ${p.hour}:00</span>
      <button type="button" data-act="face" title="Crop to face">Face</button>
      <button type="button" data-act="flip" title="Flip panel">Flip</button>
      <button type="button" data-act="swap" title="Swap with next panel">Swap</button>
      <select data-act="crop" title="Smart crop">
        <option value="face"${p.mode === 'face' ? ' selected' : ''}>Face crop</option>
        <option value="wide"${p.mode === 'wide' ? ' selected' : ''}>Wide crop</option>
        <option value="detail"${p.mode === 'detail' ? ' selected' : ''}>Detail crop</option>
      </select>`;
    row.addEventListener('click', (e) => {
      state.selected = i;
      const act = e.target.dataset?.act;
      if (!act) { redraw(); return; }
      if (act === 'face') { state.panels = currentPanels(); state.panels[i].mode = 'face'; }
      if (act === 'flip') { state.panels = currentPanels(); state.panels[i].flip = !state.panels[i].flip; }
      if (act === 'swap') {
        state.panels = currentPanels();
        const j = (i + 1) % state.panels.length;
        [state.panels[i], state.panels[j]] = [state.panels[j], state.panels[i]];
      }
      redraw();
    });
    row.querySelector('select').addEventListener('change', (e) => {
      state.panels = currentPanels();
      state.panels[i].mode = e.target.value;
      redraw();
    });
    panelListEl.appendChild(row);
  });
  const cast = validateCast(state.preset);
  const castEl = document.getElementById('cast-note');
  if (castEl) castEl.textContent = `Cast: ${cast.unique} different faces · ${cast.duplicates.length ? 'DUPLICATE FACES — fix before export' : 'no repeats'}`;
}

function buildLibrary() {
  libraryEl.innerHTML = '';
  SAMPLE_PHOTOS.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.innerHTML = `<img src="./samples/${s.file}" alt="${s.role}"><span>${s.role}</span>`;
    b.addEventListener('click', () => {
      // Tapping a library photo swaps it into the selected panel.
      state.panels = currentPanels();
      state.panels[state.selected].photo = s.id;
      redraw();
    });
    libraryEl.appendChild(b);
  });
  state.userPhotos.forEach((u) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.innerHTML = `<img src="${u.url}" alt="${u.name}"><span>${u.name}</span>`;
    libraryEl.appendChild(b);
  });
}

function buildSelects() {
  COVER_LAYOUTS.forEach((l) => {
    const o = document.createElement('option');
    o.value = l.id; o.textContent = l.label;
    layoutEl.appendChild(o);
  });
  COVER_GRADES.forEach((g) => {
    const o = document.createElement('option');
    o.value = g.id; o.textContent = g.label;
    gradeEl.appendChild(o);
  });
  COVER_SIZES.forEach((s) => {
    const o = document.createElement('option');
    o.value = s.id; o.textContent = s.label;
    sizeEl.appendChild(o);
  });
  layoutEl.value = state.layout;
  gradeEl.value = state.grade;
}

function applyPreset(id) {
  state.preset = id;
  const p = PRESETS[id];
  state.layout = p.layout;
  state.grade = p.grade;
  state.title = p.title;
  state.subtitle = p.subtitle;
  state.panels = null;
  state.selected = 0;
  titleInput.value = p.title;
  subtitleInput.value = p.subtitle;
  layoutEl.value = p.layout;
  gradeEl.value = p.grade;
  redraw();
}

function exportPNG(w, h, name) {
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  drawCover(off, state.photos, state.preset, {
    layout: state.layout, grade: state.grade,
    title: state.title, subtitle: state.subtitle,
    panels: currentPanels(), look: state.look,
  });
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    status.textContent = `Saved ${name}`;
  }, 'image/png');
}

async function init() {
  buildSelects();
  buildLibrary();
  // Load the six sample photos (two kit photos + four new faces).
  await Promise.all(SAMPLE_PHOTOS.map(async (s) => {
    state.photos[s.id] = await loadImage(`./samples/${s.file}`, s.id);
  }));
  buildLibrary();

  document.getElementById('preset-sunset').addEventListener('click', () => applyPreset('sunset-heat'));
  document.getElementById('preset-neon').addEventListener('click', () => applyPreset('neon-nights'));
  document.getElementById('preset-golden').addEventListener('click', () => applyPreset('golden-coast'));
  layoutEl.addEventListener('change', () => { state.layout = layoutEl.value; redraw(); });
  gradeEl.addEventListener('change', () => { state.grade = gradeEl.value; redraw(); });
  sizeEl.addEventListener('change', redraw);
  titleInput.addEventListener('input', () => { state.title = titleInput.value; redraw(); });
  subtitleInput.addEventListener('input', () => { state.subtitle = subtitleInput.value; redraw(); });

  // LOOK & TITLE sliders — every one changes the render for real.
  ['paint', 'grade', 'halftone', 'grain', 'glow'].forEach((key) => {
    const el = document.getElementById(`look-${key}`);
    if (!el) return;
    el.addEventListener('input', () => {
      state.look[key] = Number(el.value) / 100;
      document.getElementById(`look-${key}-val`).textContent = `${el.value}%`;
      redraw();
    });
  });

  document.getElementById('surprise').addEventListener('click', () => {
    const ids = Object.keys(PRESETS);
    applyPreset(ids[Math.floor(Math.random() * ids.length)]);
    status.textContent = 'Surprise me: shuffled to a new preset';
  });

  document.getElementById('add-photos').addEventListener('change', async (e) => {
    const files = [...e.target.files].slice(0, 8);
    for (const f of files) {
      const url = URL.createObjectURL(f);
      const img = await loadImage(url, `user-${state.userPhotos.length}`);
      state.userPhotos.push({ id: img.dataset.photoId, name: f.name.slice(0, 14), url, img });
      state.photos[img.dataset.photoId] = img;
    }
    buildLibrary();
    status.textContent = `${state.userPhotos.length} of your photos loaded (up to 8)`;
  });

  document.getElementById('export').addEventListener('click', () => {
    const size = COVER_SIZES.find((s) => s.id === sizeEl.value) || COVER_SIZES[0];
    exportPNG(size.w, size.h, `cover-${size.w}x${size.h}.png`);
  });
  document.getElementById('export-all').addEventListener('click', () => {
    exportPNG(1080, 1080, 'cover-1080x1080.png');
    exportPNG(1080, 1350, 'cover-1080x1350.png');
    exportPNG(1920, 1080, 'cover-1920x1080.png');
    status.textContent = 'Exported all three sizes';
  });

  const shot = new URLSearchParams(location.search).get('shot');
  if (shot) {
    await runShot(shot, new URLSearchParams(location.search), state, redraw);
  } else {
    redraw();
  }
}

init();
