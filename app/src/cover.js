// Sunset Heat Cover Studio — the cover engine.
// Draws a six-panel GTA-style poster on a 2D canvas: distinct photo crops
// (never the same crop twice in one cover), a sunset grade composited onto
// the photo pixels, a chrome 3D title overlapping the panels, per-panel
// location/time/story chips, and poster furniture (seal, press quote, VOL
// tag, footer credits, barcode). All type is Anton / Pacifico, SIL OFL,
// vendored under app/fonts/. No Rockstar logo, artwork or font anywhere.

export const COVER_SIZES = [
  { id: 'square', label: 'Square post · 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait post · 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide banner · 1920 x 1080', w: 1920, h: 1080 },
];

export const COVER_LAYOUTS = [
  { id: 'sunset-six', label: 'Sunset Six — hero + five panels', panels: 6 },
  { id: 'hero-trio', label: 'Hero + Trio — one big face, three scenes', panels: 4 },
  { id: 'four-grid', label: 'Four Grid — two by two', panels: 4 },
  { id: 'tilted-snaps', label: 'Tilted Snaps — three overlapping prints', panels: 3 },
];

export const COVER_GRADES = [
  { id: 'sunset', label: 'Sunset', warm: 'rgba(255,122,26,0.34)', cool: 'rgba(214,48,140,0.22)', glow: '#ff9a3d', ink: '#2b0f3d' },
  { id: 'neon', label: 'Neon Nights', warm: 'rgba(255,45,149,0.30)', cool: 'rgba(0,229,255,0.26)', glow: '#ff2d95', ink: '#0d1030' },
  { id: 'vice-pink', label: 'Vice Pink', warm: 'rgba(255,92,168,0.32)', cool: 'rgba(255,183,77,0.20)', glow: '#ff5ca8', ink: '#33102b' },
  { id: 'golden', label: 'Golden Hour', warm: 'rgba(255,176,32,0.36)', cool: 'rgba(255,94,31,0.18)', glow: '#ffb020', ink: '#33200a' },
];

// Crop windows are fractions of the source photo. The two sample photos:
//   0 boulevard — woman, face centre-right (x .42-.72, y .08-.30), sun far
//     left, red convertible along the bottom, lifeguard tower mid-left.
//   1 pier — man, face left-centre (x .25-.62, y .10-.42), rod + reel right,
//     turquoise sea right half, pier boards bottom-left.
// Every window below keeps a whole face in frame, or is a detail shot with
// no face at all — never a half face.
const CROPS = {
  womanFace: { x: 0.2, y: 0.0, w: 0.68, h: 0.38 },
  womanThreeQuarter: { x: 0.06, y: 0.0, w: 0.88, h: 0.52 },
  womanCar: { x: 0.0, y: 0.52, w: 0.58, h: 0.48 },
  womanSunset: { x: 0.0, y: 0.02, w: 0.4, h: 0.44 },
  womanTower: { x: 0.0, y: 0.14, w: 0.34, h: 0.4 },
  womanWide: { x: 0.0, y: 0.0, w: 1.0, h: 0.78 },
  manWide: { x: 0.0, y: 0.0, w: 1.0, h: 1.0 },
  manFace: { x: 0.16, y: 0.0, w: 0.58, h: 0.56 },
  manTorso: { x: 0.02, y: 0.28, w: 0.66, h: 0.72 },
  manRod: { x: 0.55, y: 0.42, w: 0.45, h: 0.58 },
  manSea: { x: 0.44, y: 0.32, w: 0.56, h: 0.68 },
  manPier: { x: 0.0, y: 0.4, w: 0.5, h: 0.6 },
};

export const COVER_PRESETS = {
  'sunset-heat': {
    layout: 'sunset-six', grade: 'sunset',
    title: 'SUNSET HEAT', subtitle: 'six nights in paradise',
    quote: 'A SUN-DRENCHED KNOCKOUT.',
    quoteBy: 'COASTLINE WEEKLY', vol: 'VOL. 06',
    tagline: 'ONE COAST · NO RULES · COMING SOON',
    panels: [
      { photo: 0, crop: 'womanThreeQuarter', place: 'OCEAN DRIVE', time: '6:42 PM', story: 'LOOKING FOR TROUBLE', who: 'THE DRIVER' },
      { photo: 1, crop: 'manFace', place: 'PIER 26', time: '5:30 AM', story: 'GONE FISHING', who: 'THE ANGLER' },
      { photo: 1, crop: 'manRod', place: 'PIER 26', time: '5:31 AM', story: 'ONE LAST CAST', who: '' },
      { photo: 0, crop: 'womanCar', place: 'OCEAN DRIVE', time: '6:44 PM', story: 'REDLINE AT DUSK', who: '' },
      { photo: 0, crop: 'womanTower', place: 'SUNSET STRIP', time: '6:15 PM', story: 'TOWER WATCH', who: '' },
      { photo: 0, crop: 'womanSunset', place: 'PALM ROW', time: '6:10 PM', story: 'LAST SWIM', who: '' },
    ],
  },
  'neon-nights': {
    layout: 'hero-trio', grade: 'neon',
    title: 'NEON NIGHTS', subtitle: 'the city never sleeps',
    quote: 'AFTER DARK, IT GLOWS.',
    quoteBy: 'THE COAST HERALD', vol: 'VOL. 07',
    tagline: 'EVERY LIGHT HAS A PRICE · COMING SOON',
    panels: [
      { photo: 1, crop: 'manFace', place: 'PIER 26', time: '11:58 PM', story: 'NIGHT SHIFT', who: 'THE ANGLER' },
      { photo: 0, crop: 'womanFace', place: 'OCEAN DRIVE', time: '9:15 PM', story: 'NEON IN HER SHADES', who: 'THE DRIVER' },
      { photo: 1, crop: 'manRod', place: 'VICE BAY', time: '12:04 AM', story: 'MIDNIGHT CAST', who: '' },
      { photo: 0, crop: 'womanSunset', place: 'PALM ROW', time: '8:40 PM', story: 'LAST LIGHT', who: '' },
    ],
  },
  'golden-coast': {
    layout: 'tilted-snaps', grade: 'golden',
    title: 'GOLDEN COAST', subtitle: 'every sunset has a price',
    quote: 'PURE GOLDEN HOUR.',
    quoteBy: 'SUNSET MAGAZINE', vol: 'VOL. 05',
    tagline: 'ONE COAST · NO RULES · COMING SOON',
    panels: [
      { photo: 0, crop: 'womanWide', place: 'OCEAN DRIVE', time: '6:42 PM', story: 'GOLDEN HOUR', who: 'THE DRIVER' },
      { photo: 1, crop: 'manWide', place: 'PIER 26', time: '5:30 AM', story: 'FIRST LIGHT', who: 'THE ANGLER' },
      { photo: 0, crop: 'womanCar', place: 'PALM ROW', time: '6:44 PM', story: 'REDLINE AT DUSK', who: '' },
    ],
  },
};

function gradeById(id) {
  return COVER_GRADES.find((g) => g.id === id) ?? COVER_GRADES[0];
}

function layoutPanels(layout, w, h) {
  // Panel rects are fractions of the canvas. The panel area ends at 0.74 of
  // the height, so the caption chips (bottom of each panel) always clear
  // the top of the chrome title; the title band owns 0.74–0.94, the footer
  // strip the last 0.06.
  const P = (x, y, pw, ph) => ({ x: x * w, y: y * h, w: pw * w, h: ph * h });
  if (layout === 'sunset-six') {
    return [
      P(0, 0, 0.62, 0.48), P(0.62, 0, 0.38, 0.24), P(0.62, 0.24, 0.38, 0.24),
      P(0, 0.48, 0.34, 0.26), P(0.34, 0.48, 0.33, 0.26), P(0.67, 0.48, 0.33, 0.26),
    ];
  }
  if (layout === 'hero-trio') {
    return [
      P(0, 0, 0.58, 0.74), P(0.58, 0, 0.42, 0.247),
      P(0.58, 0.247, 0.42, 0.247), P(0.58, 0.493, 0.42, 0.247),
    ];
  }
  if (layout === 'four-grid') {
    return [P(0, 0, 0.5, 0.37), P(0.5, 0, 0.5, 0.37), P(0, 0.37, 0.5, 0.37), P(0.5, 0.37, 0.5, 0.37)];
  }
  return [P(0.04, 0.02, 0.44, 0.46), P(0.52, 0.04, 0.44, 0.46), P(0.28, 0.3, 0.44, 0.44)];
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPhotoPanel(ctx, img, crop, rect, grade, zoom, panX, panY) {
  const cw = crop.w * img.naturalWidth;
  const ch = crop.h * img.naturalHeight;
  let sx = crop.x * img.naturalWidth;
  let sy = crop.y * img.naturalHeight;
  let sw = cw;
  let sh = ch;
  if (zoom && zoom !== 1) {
    sw = cw / zoom;
    sh = ch / zoom;
    sx += (cw - sw) / 2 + (panX ?? 0) * cw * 0.2;
    sy += (ch - sh) / 2 + (panY ?? 0) * ch * 0.2;
    sx = Math.max(0, Math.min(img.naturalWidth - sw, sx));
    sy = Math.max(0, Math.min(img.naturalHeight - sh, sy));
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  const scale = Math.max(rect.w / sw, rect.h / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(img, sx, sy, sw, sh, rect.x + (rect.w - dw) / 2, rect.y + (rect.h - dh) / 2, dw, dh);
  // Sunset grade ON the photo pixels: warm wash, cool shadow wash, vignette.
  ctx.globalCompositeOperation = 'source-atop';
  const wash = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  wash.addColorStop(0, 'rgba(255,190,90,0.10)');
  wash.addColorStop(0.55, grade.warm);
  wash.addColorStop(1, grade.cool);
  ctx.fillStyle = wash;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.globalCompositeOperation = 'source-over';
  const vig = ctx.createRadialGradient(
    rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) * 0.35,
    rect.x + rect.w / 2, rect.y + rect.h / 2, Math.max(rect.w, rect.h) * 0.75,
  );
  vig.addColorStop(0, 'rgba(20,4,32,0)');
  vig.addColorStop(1, 'rgba(20,4,32,0.42)');
  ctx.fillStyle = vig;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  // Halftone grain: tiny dots, denser toward the bottom of the panel.
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  const step = Math.max(9, rect.w / 64);
  for (let gy = rect.y + step / 2; gy < rect.y + rect.h; gy += step) {
    for (let gx = rect.x + step / 2; gx < rect.x + rect.w; gx += step) {
      const depth = (gy - rect.y) / rect.h;
      const r = step * 0.09 * (0.5 + depth);
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = Math.max(2, rect.w * 0.004);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}

function drawChip(ctx, panel, rect, u) {
  const pad = 10 * u;
  const lines = [`${panel.place} · ${panel.time}`, panel.story];
  ctx.font = `700 ${Math.round(15 * u)}px Anton, sans-serif`;
  const w1 = ctx.measureText(lines[0]).width;
  ctx.font = `${Math.round(13 * u)}px system-ui, sans-serif`;
  const w2 = ctx.measureText(lines[1]).width;
  const bw = Math.max(w1, w2) + pad * 2;
  const bh = 52 * u + pad;
  const bx = rect.x + 10 * u;
  const by = rect.y + rect.h - bh - 10 * u;
  ctx.save();
  ctx.fillStyle = 'rgba(12,4,24,0.82)';
  roundRect(ctx, bx, by, bw, bh, 6 * u);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.font = `700 ${Math.round(15 * u)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(lines[0], bx + pad, by + 24 * u);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(13 * u)}px system-ui, sans-serif`;
  ctx.fillText(lines[1], bx + pad, by + 44 * u);
  ctx.restore();
  if (panel.who) {
    ctx.save();
    ctx.font = `700 ${Math.round(14 * u)}px Anton, sans-serif`;
    const ww = ctx.measureText(panel.who).width + pad * 2;
    // A panel tucked into the top-left corner shares that corner with the
    // VOL tag, so its character label goes top-right instead.
    const wx = (rect.x < 70 * u && rect.y < 70 * u) ? rect.x + rect.w - ww - 10 * u : rect.x + 10 * u;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, wx, rect.y + 10 * u, ww, 26 * u, 4 * u);
    ctx.fill();
    ctx.fillStyle = '#1d0b2e';
    ctx.fillText(panel.who, wx + pad, rect.y + 10 * u + 19 * u);
    ctx.restore();
  }
}

function drawSeal(ctx, cx, cy, r, u) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const spikes = 14;
  for (let i = 0; i < spikes * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.82;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd166';
  ctx.fill();
  ctx.lineWidth = 2.5 * u;
  ctx.strokeStyle = '#7a1e3c';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
  ctx.strokeStyle = '#7a1e3c';
  ctx.lineWidth = 1.5 * u;
  ctx.stroke();
  ctx.fillStyle = '#7a1e3c';
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(11 * u)}px Anton, sans-serif`;
  ctx.fillText('ORIGINAL', 0, -2 * u);
  ctx.fillText('COVER ART', 0, 12 * u);
  ctx.font = `${Math.round(9 * u)}px system-ui, sans-serif`;
  ctx.fillText('★ ★ ★ ★ ★', 0, 24 * u);
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  ctx.fillStyle = '#14061f';
  let bx = x;
  let seed = 20261120;
  while (bx < x + w - 3) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const bw = 2 + (seed % 4);
    if (seed % 3 !== 0) ctx.fillRect(bx, y, bw, h);
    bx += bw + 2;
  }
  ctx.restore();
}

function drawChromeTitle(ctx, text, cx, y, maxW, u, h, grade) {
  // The title is capped by height as well as width, so on a wide canvas it
  // never grows tall enough to swallow the caption chips above it.
  let size = Math.min(150 * u, h * 0.13);
  ctx.font = `${size}px Anton, sans-serif`;
  while (ctx.measureText(text).width > maxW && size > 30) {
    size -= 4;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const depth = Math.max(3, size * 0.055);
  ctx.fillStyle = '#3d0a4e';
  for (let d = Math.round(depth); d >= 1; d--) {
    ctx.fillText(text, cx + d * 0.7, y + d);
  }
  const grad = ctx.createLinearGradient(0, y - size, 0, y);
  grad.addColorStop(0, '#fff7d6');
  grad.addColorStop(0.45, '#ffd166');
  grad.addColorStop(0.7, grade.glow);
  grad.addColorStop(1, '#ff2d95');
  ctx.fillStyle = grad;
  ctx.fillText(text, cx, y);
  ctx.lineWidth = Math.max(1.5, size * 0.02);
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.strokeText(text, cx, y);
  return size;
}

/** Draws one full cover. `state`: {photos, layout, grade, title, subtitle,
 *  quote, quoteBy, vol, tagline, panels:[{photo, crop, place, time, story, who, zoom, panX, panY}]} */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const u = w / 1080;
  const grade = gradeById(state.grade);
  ctx.fillStyle = grade.ink;
  ctx.fillRect(0, 0, w, h);

  const rects = layoutPanels(state.layout, w, h);
  const tilt = state.layout === 'tilted-snaps';
  state.panels.forEach((panel, i) => {
    const img = state.photos[panel.photo];
    if (!img) return;
    const crop = typeof panel.crop === 'string' ? CROPS[panel.crop] : panel.crop;
    if (!crop) return;
    const rect = rects[i] ?? rects[rects.length - 1];
    if (tilt) {
      ctx.save();
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      ctx.translate(cx, cy);
      ctx.rotate(((i - 1) * 5 * Math.PI) / 180);
      ctx.translate(-cx, -cy);
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 22 * u;
      ctx.shadowOffsetY = 10 * u;
      drawPhotoPanel(ctx, img, crop, rect, grade, panel.zoom, panel.panX, panel.panY);
      ctx.restore();
    } else {
      drawPhotoPanel(ctx, img, crop, rect, grade, panel.zoom, panel.panX, panel.panY);
    }
    drawChip(ctx, panel, rect, u);
  });

  // Title block: chrome title, script subtitle, VOL tag and seal. The
  // press quote lives in the footer strip, never over the caption chips.
  const titleY = h * 0.87;
  const titleSize = drawChromeTitle(ctx, state.title.toUpperCase(), w / 2, titleY, w * 0.86, u, h, grade);
  ctx.save();
  ctx.font = `${Math.round(34 * u)}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = grade.glow;
  ctx.shadowBlur = 18 * u;
  ctx.fillText(state.subtitle, w / 2, titleY + Math.min(44 * u, h * 0.045));
  ctx.restore();
  ctx.save();
  ctx.font = `700 ${Math.round(15 * u)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  const volW = ctx.measureText(state.vol).width + 20 * u;
  ctx.fillStyle = grade.glow;
  roundRect(ctx, 14 * u, 20 * u, volW, 30 * u, 4 * u);
  ctx.fill();
  ctx.fillStyle = '#1d0b2e';
  ctx.fillText(state.vol, 24 * u, 41 * u);
  ctx.restore();
  drawSeal(ctx, w - 78 * u, 78 * u, 56 * u, u);

  // Footer strip: tagline + press quote on the left, credits right, barcode.
  const footerH = Math.min(62 * u, h * 0.06);
  const fy = h - footerH;
  ctx.fillStyle = 'rgba(10,3,20,0.92)';
  ctx.fillRect(0, fy, w, footerH);
  ctx.save();
  ctx.font = `700 ${Math.round(15 * u)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(state.tagline, 16 * u, fy + footerH * 0.38);
  ctx.font = `${Math.round(12 * u)}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffe9a8';
  ctx.fillText(`★★★★★  “${state.quote}” — ${state.quoteBy}`, 16 * u, fy + footerH * 0.82);
  ctx.font = `${Math.round(12 * u)}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.textAlign = 'right';
  ctx.fillText('MADE ON YOUR DEVICE · NO ROCKSTAR LOGOS, ARTWORK OR FONTS', w - 130 * u, fy + footerH * 0.38);
  ctx.restore();
  drawBarcode(ctx, w - 116 * u, fy + footerH * 0.2, 96 * u, footerH * 0.6);
}

/** A fresh default state for a preset id, with the two sample photos. */
export function presetState(presetId, photos) {
  const p = COVER_PRESETS[presetId] ?? COVER_PRESETS['sunset-heat'];
  return {
    photos,
    layout: p.layout,
    grade: p.grade,
    title: p.title,
    subtitle: p.subtitle,
    quote: p.quote,
    quoteBy: p.quoteBy,
    vol: p.vol,
    tagline: p.tagline,
    panels: p.panels.map((panel) => ({ ...panel, zoom: 1, panX: 0, panY: 0 })),
  };
}
