// Sunset Heat Cover Studio — cover renderer.
// Draws multi-panel GTA-style poster covers on a canvas: distinct photo
// crops per panel, a sunset/neon grade composited over the photo pixels,
// chrome 3D lettering and poster furniture (seal, quote, VOL tag, footer).

export const COVER_SIZES = {
  square: { w: 1080, h: 1080 },
  portrait: { w: 1080, h: 1350 },
  wide: { w: 1920, h: 1080 },
};

export const COVER_LAYOUTS = {
  'sunset-six': {
    label: 'Six panels',
    rects: [
      [0, 0, 0.62, 0.48], [0.62, 0, 0.38, 0.24], [0.62, 0.24, 0.38, 0.24],
      [0, 0.48, 0.34, 0.26], [0.34, 0.48, 0.33, 0.26], [0.67, 0.48, 0.33, 0.26],
    ],
  },
  'hero-trio': {
    label: 'Hero + three',
    rects: [
      [0, 0, 0.58, 0.74], [0.58, 0, 0.42, 0.247],
      [0.58, 0.247, 0.42, 0.247], [0.58, 0.493, 0.42, 0.247],
    ],
  },
  'four-grid': {
    label: 'Four grid',
    rects: [
      [0, 0, 0.5, 0.37], [0.5, 0, 0.5, 0.37],
      [0, 0.37, 0.5, 0.37], [0.5, 0.37, 0.5, 0.37],
    ],
  },
  'tilted-snaps': {
    label: 'Tilted snaps',
    rects: [
      [0.04, 0.02, 0.44, 0.46], [0.52, 0.04, 0.44, 0.46], [0.28, 0.3, 0.44, 0.44],
    ],
    rotations: [-5, 0, 5],
  },
};

export const COVER_GRADES = {
  sunset: {
    label: 'Sunset',
    warm: 'rgba(255,122,26,0.34)', cool: 'rgba(214,48,140,0.22)',
    glow: '#ff9a3d', ink: '#2b0f3d',
  },
  neon: {
    label: 'Neon nights',
    warm: 'rgba(255,45,149,0.30)', cool: 'rgba(0,229,255,0.26)',
    glow: '#ff2d95', ink: '#0d1030',
  },
  'vice-pink': {
    label: 'Vice pink',
    warm: 'rgba(255,92,168,0.32)', cool: 'rgba(255,183,77,0.20)',
    glow: '#ff5ca8', ink: '#33102b',
  },
  golden: {
    label: 'Golden hour',
    warm: 'rgba(255,176,32,0.36)', cool: 'rgba(255,94,31,0.18)',
    glow: '#ffb020', ink: '#33200a',
  },
};

// Photo crops as fractions of each sample photo. Photo 0 (boulevard) is the
// woman: face x .42-.72, y .08-.30, red convertible low, tower left-centre.
// Photo 1 (pier) is the man: face x .25-.62, y .10-.42, rod right, turquoise
// sea right, pier board left-bottom. Every crop keeps a face whole or is a
// faceless detail shot — never a half face.
export const CROPS = {
  womanFace: { x: 0.2, y: 0, w: 0.68, h: 0.38 },
  womanThreeQuarter: { x: 0.06, y: 0, w: 0.88, h: 0.52 },
  womanCar: { x: 0, y: 0.52, w: 0.58, h: 0.48 },
  womanSunset: { x: 0, y: 0.02, w: 0.4, h: 0.44 },
  womanTower: { x: 0, y: 0.14, w: 0.34, h: 0.4 },
  womanWide: { x: 0, y: 0, w: 1, h: 0.78 },
  manWide: { x: 0, y: 0, w: 1, h: 1 },
  manFace: { x: 0.16, y: 0, w: 0.58, h: 0.56 },
  manTorso: { x: 0.02, y: 0.28, w: 0.66, h: 0.72 },
  manRod: { x: 0.55, y: 0.42, w: 0.45, h: 0.58 },
  manSea: { x: 0.44, y: 0.32, w: 0.56, h: 0.68 },
  manPier: { x: 0, y: 0.4, w: 0.5, h: 0.6 },
};

function panel(photo, crop, place, time, story, label) {
  return { photo, crop, place, time, story, label: label ?? '', zoom: 1, panX: 0, panY: 0 };
}

export const PRESETS = {
  'sunset-heat': {
    label: 'Sunset Heat', layout: 'sunset-six', grade: 'sunset', size: 'square',
    title: 'SUNSET HEAT', subtitle: 'six nights in paradise',
    quote: 'A SUN-DRENCHED KNOCKOUT.', byline: 'COASTLINE WEEKLY',
    vol: 'VOL. 06', tagline: 'ONE COAST · NO RULES · COMING SOON',
    panels: [
      panel(0, 'womanThreeQuarter', 'OCEAN DRIVE', '6:42 PM', 'LOOKING FOR TROUBLE', 'THE DRIVER'),
      panel(1, 'manFace', 'PIER 26', '5:30 AM', 'GONE FISHING', 'THE ANGLER'),
      panel(1, 'manRod', 'PIER 26', '5:31 AM', 'ONE LAST CAST', ''),
      panel(0, 'womanCar', 'OCEAN DRIVE', '6:44 PM', 'REDLINE AT DUSK', ''),
      panel(0, 'womanTower', 'SUNSET STRIP', '6:15 PM', 'TOWER WATCH', ''),
      panel(0, 'womanSunset', 'PALM ROW', '6:10 PM', 'LAST SWIM', ''),
    ],
  },
  'neon-nights': {
    label: 'Neon Nights', layout: 'hero-trio', grade: 'neon', size: 'portrait',
    title: 'NEON NIGHTS', subtitle: 'the city never sleeps',
    quote: 'AFTER DARK, IT GLOWS.', byline: 'THE COAST HERALD',
    vol: 'VOL. 07', tagline: 'EVERY LIGHT HAS A PRICE · COMING SOON',
    panels: [
      panel(1, 'manFace', 'PIER 26', '11:58 PM', 'NIGHT SHIFT', 'THE ANGLER'),
      panel(0, 'womanFace', 'OCEAN DRIVE', '9:15 PM', 'NEON IN HER SHADES', 'THE DRIVER'),
      panel(1, 'manRod', 'VICE BAY', '12:04 AM', 'MIDNIGHT CAST', ''),
      panel(0, 'womanSunset', 'PALM ROW', '8:40 PM', 'LAST LIGHT', ''),
    ],
  },
  'golden-coast': {
    label: 'Golden Coast', layout: 'tilted-snaps', grade: 'golden', size: 'square',
    title: 'GOLDEN COAST', subtitle: 'every sunset has a price',
    quote: 'PURE GOLDEN HOUR.', byline: 'SUNSET MAGAZINE',
    vol: 'VOL. 05', tagline: 'ONE COAST · NO RULES · COMING SOON',
    panels: [
      panel(0, 'womanWide', 'OCEAN DRIVE', '6:42 PM', 'GOLDEN HOUR', 'THE DRIVER'),
      panel(1, 'manWide', 'PIER 26', '5:30 AM', 'FIRST LIGHT', 'THE ANGLER'),
      panel(0, 'womanCar', 'PALM ROW', '6:44 PM', 'REDLINE AT DUSK', ''),
    ],
  },
};

// Panels end at 0.74 of the height; the title band runs 0.74-0.94; the
// footer takes the last 0.06.
const PANEL_END = 0.74;
const TITLE_TOP = 0.74;
const TITLE_BOTTOM = 0.94;

function drawPhotoInto(ctx, img, crop, dx, dy, dw, dh, zoom, panX, panY) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const cw = iw * crop.w;
  const ch = ih * crop.h;
  const sw = cw / zoom;
  const sh = ch / zoom;
  const slackX = Math.max(0, cw - sw);
  const slackY = Math.max(0, ch - sh);
  const sx = Math.min(Math.max(0, iw * crop.x + slackX / 2 + (panX * slackX) / 2), iw - sw);
  const sy = Math.min(Math.max(0, ih * crop.y + slackY / 2 + (panY * slackY) / 2), ih - sh);
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function gradePanel(ctx, grade, x, y, w, h) {
  const wash = ctx.createLinearGradient(0, y, 0, y + h);
  wash.addColorStop(0, grade.warm);
  wash.addColorStop(1, grade.cool);
  ctx.fillStyle = wash;
  ctx.fillRect(x, y, w, h);
  const vig = ctx.createRadialGradient(
    x + w / 2, y + h / 2, Math.min(w, h) * 0.35,
    x + w / 2, y + h / 2, Math.max(w, h) * 0.75,
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(10,0,20,0.38)');
  ctx.fillStyle = vig;
  ctx.fillRect(x, y, w, h);
  // Halftone dots, white, growing toward the bottom of the panel.
  const step = Math.max(6, w / 64);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  for (let yy = y + step / 2; yy < y + h; yy += step) {
    const t = (yy - y) / h;
    const r = 0.5 + t * 1.9;
    for (let xx = x + step / 2; xx < x + w; xx += step) {
      ctx.beginPath();
      ctx.arc(xx, yy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function fitFont(ctx, text, fontFor, maxWidth, startSize) {
  let size = startSize;
  ctx.font = fontFor(size);
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = fontFor(size);
  }
  return size;
}

function drawPanel(ctx, img, p, rect, grade, u, rotation) {
  const [fx, fy, fw, fh] = rect;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const x = fx * w;
  const y = fy * h;
  const pw = fw * w;
  const ph = fh * h;
  ctx.save();
  if (rotation) {
    // Shadow pass: a filled rect casts the drop shadow around the tilted
    // panel; the photo pass below covers the rect itself.
    ctx.save();
    ctx.translate(x + pw / 2, y + ph / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pw / 2, -ph / 2);
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 18 * u;
    ctx.shadowOffsetY = 8 * u;
    ctx.fillStyle = grade.ink;
    ctx.fillRect(0, 0, pw, ph);
    ctx.restore();
    ctx.translate(x + pw / 2, y + ph / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pw / 2, -ph / 2);
  } else {
    ctx.translate(x, y);
  }
  ctx.beginPath();
  ctx.rect(0, 0, pw, ph);
  ctx.clip();
  if (img) {
    drawPhotoInto(ctx, img, CROPS[p.crop], 0, 0, pw, ph, p.zoom, p.panX, p.panY);
  } else {
    ctx.fillStyle = grade.ink;
    ctx.fillRect(0, 0, pw, ph);
  }
  gradePanel(ctx, grade, 0, 0, pw, ph);
  ctx.restore();
  // Border in panel space (rotated with the panel when tilted).
  ctx.save();
  if (rotation) {
    ctx.translate(x + pw / 2, y + ph / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pw / 2, -ph / 2);
  } else {
    ctx.translate(x, y);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = Math.max(2, 2.5 * u);
  ctx.strokeRect(0, 0, pw, ph);
  ctx.restore();
}

// Caption chips and character labels, drawn in a second pass after every
// panel so a later overlapping (tilted) panel can never hide them.
function drawPanelChips(ctx, p, rect, grade, u, rotation) {
  const [fx, fy, fw, fh] = rect;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const x = fx * w;
  const y = fy * h;
  const pw = fw * w;
  const ph = fh * h;
  ctx.save();
  if (rotation) {
    ctx.translate(x + pw / 2, y + ph / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-pw / 2, -ph / 2);
  } else {
    ctx.translate(x, y);
  }
  if (p.label) {
    // The VOL tag sits at the canvas top-left: push the label down when the
    // panel starts under it instead of painting over it.
    const labelY = (x < 110 * u && y < 50 * u) ? 46 * u : 10 * u;
    const ls = fitFont(ctx, p.label, (s) => `${s}px Anton, sans-serif`, pw * 0.5, 17 * u);
    const lw = ctx.measureText(p.label).width + 16 * u;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10 * u, labelY, lw, ls + 10 * u);
    ctx.fillStyle = grade.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `${ls}px Anton, sans-serif`;
    ctx.fillText(p.label, 18 * u, labelY + (ls + 10 * u) / 2);
  }
  const chipH = 44 * u;
  const chipY = ph - chipH - 10 * u;
  ctx.fillStyle = 'rgba(12,4,24,0.82)';
  ctx.fillRect(10 * u, chipY, pw - 20 * u, chipH);
  const head = `${p.place} · ${p.time}`;
  const hs = fitFont(ctx, head, (s) => `${s}px Anton, sans-serif`, pw - 36 * u, 15 * u);
  ctx.fillStyle = '#ffd94d';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${hs}px Anton, sans-serif`;
  ctx.fillText(head, 18 * u, chipY + hs + 6 * u);
  const ss = fitFont(ctx, p.story, (s) => `${s}px Anton, sans-serif`, pw - 36 * u, 13 * u);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${ss}px Anton, sans-serif`;
  ctx.fillText(p.story, 18 * u, chipY + hs + ss + 12 * u);
  ctx.restore();
}

function drawStarburst(ctx, cx, cy, r, grade, u) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const spikes = 14;
  for (let i = 0; i < spikes * 2; i++) {
    const ang = (i * Math.PI) / spikes - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.72;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd94d';
  ctx.fill();
  ctx.strokeStyle = grade.ink;
  ctx.lineWidth = 2 * u;
  ctx.stroke();
  ctx.fillStyle = grade.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${11 * u}px Anton, sans-serif`;
  ctx.fillText('ORIGINAL', 0, -12 * u);
  ctx.fillText('COVER ART', 0, 2 * u);
  ctx.font = `${12 * u}px sans-serif`;
  ctx.fillText('★★★★★', 0, 17 * u);
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h, u) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 4 * u, y - 4 * u, w + 8 * u, h + 8 * u);
  ctx.fillStyle = '#111111';
  let bx = x;
  let i = 0;
  while (bx < x + w) {
    const bw = [2, 1, 3, 1, 2, 4, 1, 2][i % 8] * u;
    if (i % 2 === 0) ctx.fillRect(bx, y, bw, h);
    bx += bw + 1.5 * u;
    i++;
  }
}

function drawChromeTitle(ctx, cover, w, h, u) {
  const grade = COVER_GRADES[cover.grade];
  const bandH = (TITLE_BOTTOM - TITLE_TOP) * h;
  const bandY = TITLE_TOP * h;
  const title = cover.title.trim().toUpperCase();
  const titleScale = cover.titleScale ?? 1;
  let size = Math.min(150 * u, bandH * 0.62) * titleScale;
  ctx.font = `${size}px Anton, sans-serif`;
  while (size > 20 && ctx.measureText(title).width > w * 0.86) {
    size -= 3;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  const cx = w / 2;
  const baseline = bandY + bandH * 0.52;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // Layered dark extrusion for the 3D chrome.
  ctx.fillStyle = grade.ink;
  for (let d = 9; d >= 1; d--) {
    ctx.fillText(title, cx, baseline + d * 1.6 * u);
  }
  const grad = ctx.createLinearGradient(0, baseline - size, 0, baseline + 10 * u);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.45, '#ffd94d');
  grad.addColorStop(0.75, grade.glow);
  grad.addColorStop(1, '#ff5ca8');
  ctx.fillStyle = grad;
  ctx.fillText(title, cx, baseline);
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = Math.max(1.5, 2 * u);
  ctx.strokeText(title, cx, baseline);
  // Script subtitle with glow, overlapping the title's foot.
  const subSize = fitFont(ctx, cover.subtitle, (s) => `${s}px Pacifico, cursive`, w * 0.7, 36 * u);
  ctx.shadowColor = grade.glow;
  ctx.shadowBlur = 16 * u;
  ctx.fillStyle = '#ffffff';
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.fillText(cover.subtitle, cx, bandY + bandH * 0.88);
  ctx.shadowBlur = 0;
}

function drawPosterFurniture(ctx, cover, w, h, u) {
  const grade = COVER_GRADES[cover.grade];
  // VOL tag, top-left over the panels.
  const volSize = 15 * u;
  ctx.font = `${volSize}px Anton, sans-serif`;
  const vw = ctx.measureText(cover.vol).width + 18 * u;
  ctx.fillStyle = 'rgba(12,4,24,0.85)';
  ctx.fillRect(12 * u, 12 * u, vw, volSize + 12 * u);
  ctx.fillStyle = '#ffd94d';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(cover.vol, 21 * u, 12 * u + (volSize + 12 * u) / 2);
  // Starburst seal, top-right.
  drawStarburst(ctx, w - 78 * u, 78 * u, 66 * u, grade, u);
  // Footer: tagline + press quote left, credits right, barcode bottom-right.
  const fy = TITLE_BOTTOM * h;
  const fh = h - fy;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const tagSize = fitFont(ctx, cover.tagline, (s) => `${s}px Anton, sans-serif`, w * 0.55, 16 * u);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${tagSize}px Anton, sans-serif`;
  ctx.fillText(cover.tagline, 14 * u, fy + fh * 0.38);
  const quote = `★★★★★ "${cover.quote}" — ${cover.byline}`;
  const qSize = fitFont(ctx, quote, (s) => `${s}px Anton, sans-serif`, w * 0.55, 12.5 * u);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `${qSize}px Anton, sans-serif`;
  ctx.fillText(quote, 14 * u, fy + fh * 0.82);
  const credits = 'MADE ON YOUR DEVICE · NO ROCKSTAR LOGOS, ARTWORK OR FONTS';
  const cSize = fitFont(ctx, credits, (s) => `${s}px Anton, sans-serif`, w * 0.32, 11 * u);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.textAlign = 'right';
  ctx.font = `${cSize}px Anton, sans-serif`;
  ctx.fillText(credits, w - 150 * u, fy + fh * 0.38);
  drawBarcode(ctx, w - 138 * u, fy + fh * 0.52, 124 * u, fh * 0.34, u);
}

/** Draws a full cover. `photos` is an array of images (index 0 boulevard,
    1 pier, then uploads). `cover` holds layout, grade, title, subtitle,
    quote, byline, vol, tagline and panels. */
export function drawCover(canvas, photos, cover) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const u = w / 1080;
  const grade = COVER_GRADES[cover.grade];
  const layout = COVER_LAYOUTS[cover.layout];
  ctx.fillStyle = grade.ink;
  ctx.fillRect(0, 0, w, h);
  const rects = layout.rects;
  for (let i = 0; i < rects.length && i < cover.panels.length; i++) {
    const p = cover.panels[i];
    const img = photos[p.photo] ?? null;
    const rot = layout.rotations ? layout.rotations[i] ?? 0 : 0;
    drawPanel(ctx, img, p, rects[i], grade, u, rot);
  }
  for (let i = 0; i < rects.length && i < cover.panels.length; i++) {
    const p = cover.panels[i];
    const rot = layout.rotations ? layout.rotations[i] ?? 0 : 0;
    drawPanelChips(ctx, p, rects[i], grade, u, rot);
  }
  drawChromeTitle(ctx, cover, w, h, u);
  drawPosterFurniture(ctx, cover, w, h, u);
}

/** Deep-copies a preset into a fresh editable cover state. */
export function coverFromPreset(name) {
  const p = PRESETS[name] ?? PRESETS['sunset-heat'];
  return {
    preset: name,
    layout: p.layout,
    grade: p.grade,
    size: p.size,
    title: p.title,
    subtitle: p.subtitle,
    quote: p.quote,
    byline: p.byline,
    vol: p.vol,
    tagline: p.tagline,
    titleScale: 1,
    panels: p.panels.map((q) => ({ ...q })),
  };
}
