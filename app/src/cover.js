// Vice Coast Cover Studio — poster-cover renderer.
//
// A cover is a set of photo panels (each a distinct crop of one of the two
// sample photos, never the same crop twice), a sunset grade baked onto the
// photo pixels, a chrome 3D title overlapping the panels, a caption chip on
// every panel, and poster furniture (seal, press quote, VOL tag, tagline
// strip, footer credits, barcode). All geometry is in fractions of the
// canvas so every export size (1080x1080, 1080x1350, 1920x1080) works.

export const COVER_SIZES = {
  square: { w: 1080, h: 1080, label: '1080 x 1080' },
  portrait: { w: 1080, h: 1350, label: '1080 x 1350' },
  wide: { w: 1920, h: 1080, label: '1920 x 1080' },
};

export const COVER_GRADES = {
  sunset: {
    label: 'Sunset',
    washTop: 'rgba(255, 150, 60, 0.16)',
    washBottom: 'rgba(205, 35, 125, 0.30)',
    vignette: 'rgba(24, 4, 48, 0.38)',
    band: ['#3a0a4e', '#a3135f'],
  },
  neon: {
    label: 'Neon nights',
    washTop: 'rgba(255, 0, 170, 0.20)',
    washBottom: 'rgba(0, 190, 255, 0.24)',
    vignette: 'rgba(8, 2, 40, 0.40)',
    band: ['#160b38', '#7a0f7e'],
  },
  'vice-pink': {
    label: 'Vice pink',
    washTop: 'rgba(255, 70, 160, 0.24)',
    washBottom: 'rgba(140, 20, 130, 0.28)',
    vignette: 'rgba(30, 2, 44, 0.36)',
    band: ['#3d0a3d', '#c2277e'],
  },
  golden: {
    label: 'Golden hour',
    washTop: 'rgba(255, 185, 45, 0.22)',
    washBottom: 'rgba(255, 110, 0, 0.16)',
    vignette: 'rgba(40, 14, 0, 0.34)',
    band: ['#4a1c05', '#b3541e'],
  },
};

export const COVER_LAYOUTS = {
  'sunset-heat': {
    label: 'Sunset Heat — six-panel hero',
    size: 'square',
    title: 'SUNSET HEAT',
    subtitle: 'six nights in paradise',
    quote: "A SUN-DRENCHED KNOCKOUT.",
    quoteSource: 'COASTLINE WEEKLY',
    vol: 'VOL. 06',
    panels: [
      { photo: 'boulevard', crop: { x: 0.02, y: 0.02, w: 0.96, h: 0.96 }, rect: { x: 0, y: 0, w: 0.44, h: 0.62 }, chip: 'OCEAN DRIVE · 6:42 PM', tag: 'THE DRIVER', tagPos: 'bl' },
      { photo: 'pier', crop: { x: 0.16, y: 0.02, w: 0.60, h: 0.46 }, rect: { x: 0.45, y: 0, w: 0.55, h: 0.30 }, chip: 'PIER 26 · 5:30 AM', tag: 'THE ANGLER' },
      { photo: 'pier', crop: { x: 0.52, y: 0.28, w: 0.48, h: 0.72 }, rect: { x: 0.45, y: 0.31, w: 0.27, h: 0.31 }, chip: 'GONE FISHING' },
      { photo: 'boulevard', crop: { x: 0, y: 0, w: 0.34, h: 0.42 }, rect: { x: 0.73, y: 0.31, w: 0.27, h: 0.31 }, chip: 'SUNSET STRIP · 7:40 PM' },
      { photo: 'boulevard', crop: { x: 0, y: 0.52, w: 0.58, h: 0.48 }, rect: { x: 0, y: 0.63, w: 0.49, h: 0.19 }, chip: 'REDLINE MOTORS · 8:15 PM' },
      { photo: 'pier', crop: { x: 0.42, y: 0.32, w: 0.58, h: 0.42 }, rect: { x: 0.50, y: 0.63, w: 0.50, h: 0.19 }, chip: 'TURQUOISE BAY · 5:30 AM' },
    ],
    titleY: 0.52,
    quoteY: 0.42,
    bandY: 0.82,
    tilt: false,
  },
  'neon-nights': {
    label: 'Neon Nights — portrait strip',
    size: 'portrait',
    title: 'NEON NIGHTS',
    subtitle: 'neon tide',
    quote: 'A FEVER DREAM IN NEON.',
    quoteSource: 'THE COAST HERALD',
    vol: 'VOL. 07',
    panels: [
      { photo: 'boulevard', crop: { x: 0.02, y: 0.02, w: 0.96, h: 0.96 }, rect: { x: 0, y: 0, w: 1, h: 0.48 }, chip: 'OCEAN DRIVE · 6:42 PM', tag: 'THE DRIVER', focusY: 0.12 },
      { photo: 'pier', crop: { x: 0.16, y: 0.02, w: 0.60, h: 0.46 }, rect: { x: 0, y: 0.50, w: 0.49, h: 0.185 }, chip: 'PIER 26 · 5:30 AM', tag: 'THE ANGLER' },
      { photo: 'pier', crop: { x: 0.52, y: 0.28, w: 0.48, h: 0.72 }, rect: { x: 0.51, y: 0.50, w: 0.49, h: 0.185 }, chip: 'GONE FISHING' },
      { photo: 'boulevard', crop: { x: 0, y: 0.52, w: 0.58, h: 0.48 }, rect: { x: 0, y: 0.695, w: 0.49, h: 0.165 }, chip: 'REDLINE MOTORS · 8:15 PM' },
      { photo: 'pier', crop: { x: 0.42, y: 0.32, w: 0.58, h: 0.42 }, rect: { x: 0.51, y: 0.695, w: 0.49, h: 0.165 }, chip: 'TURQUOISE BAY · 5:30 AM' },
    ],
    titleY: 0.40,
    quoteY: 0.30,
    bandY: 0.86,
    tilt: false,
  },
  'golden-coast': {
    label: 'Golden Coast — tilted snaps',
    size: 'square',
    title: 'GOLDEN COAST',
    subtitle: 'boardwalk nights',
    quote: 'EVERY SUMMER HAS A STORY.',
    quoteSource: 'VICE COAST',
    vol: 'VOL. 01',
    panels: [
      { photo: 'boulevard', crop: { x: 0.28, y: 0.02, w: 0.48, h: 0.40 }, rect: { x: 0.06, y: 0.05, w: 0.44, h: 0.44 }, chip: 'OCEAN DRIVE · 6:42 PM', tag: 'THE DRIVER', rotate: -6 },
      { photo: 'pier', crop: { x: 0.16, y: 0.02, w: 0.60, h: 0.46 }, rect: { x: 0.50, y: 0.09, w: 0.44, h: 0.44 }, chip: 'PIER 26 · 5:30 AM', tag: 'THE ANGLER', rotate: 5 },
      { photo: 'boulevard', crop: { x: 0.72, y: 0, w: 0.28, h: 0.52 }, rect: { x: 0.28, y: 0.40, w: 0.44, h: 0.34 }, chip: 'BOARDWALK · 7:10 PM', rotate: -2 },
    ],
    titleY: 0.72,
    quoteY: 0.62,
    bandY: 0.84,
    tilt: true,
  },
};

/** A seeded pseudo-random number in [0, 1): the same cover always draws the same grain and barcode. */
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Draws `img` cropped to `crop` (fractions of the image) covering (dx, dy, dw, dh).
 * `focusX`/`focusY` (0..1) pick which end of the crop survives when the crop
 * is trimmed to the destination's aspect: 0 keeps the top/left (heads),
 * 0.5 centres, 1 keeps the bottom/right. */
function drawCroppedPhoto(ctx, img, crop, dx, dy, dw, dh, zoom = 1, panX = 0, panY = 0, focusX = 0.5, focusY = 0.5) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  let cw = crop.w * iw;
  let ch = crop.h * ih;
  let cx = crop.x * iw;
  let cy = crop.y * ih;
  const destAspect = dw / dh;
  const cropAspect = cw / ch;
  if (cropAspect > destAspect) {
    const nw = ch * destAspect;
    cx += (cw - nw) * focusX;
    cw = nw;
  } else {
    const nh = cw / destAspect;
    cy += (ch - nh) * focusY;
    ch = nh;
  }
  cw /= zoom;
  ch /= zoom;
  cx += panX * cw;
  cy += panY * ch;
  cx = Math.max(0, Math.min(iw - cw, cx));
  cy = Math.max(0, Math.min(ih - ch, cy));
  ctx.drawImage(img, cx, cy, cw, ch, dx, dy, dw, dh);
}

/** Warm wash + vignette + halftone dots over a panel rect: the grade lives on the photo pixels. */
function gradePanel(ctx, x, y, w, h, grade) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const wash = ctx.createLinearGradient(x, y, x, y + h);
  wash.addColorStop(0, grade.washTop);
  wash.addColorStop(1, grade.washBottom);
  ctx.fillStyle = wash;
  ctx.fillRect(x, y, w, h);
  const vig = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * 0.28, x + w / 2, y + h / 2, Math.max(w, h) * 0.72);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, grade.vignette);
  ctx.fillStyle = vig;
  ctx.fillRect(x, y, w, h);
  // Halftone dots: dark on one diagonal, light on the other.
  const step = Math.max(6, w * 0.008);
  ctx.fillStyle = 'rgba(20, 0, 30, 0.10)';
  for (let yy = y + step / 2; yy < y + h; yy += step) {
    for (let xx = x + step / 2; xx < x + w; xx += step) {
      ctx.fillRect(xx, yy, 1.6, 1.6);
    }
  }
  ctx.fillStyle = 'rgba(255, 240, 210, 0.07)';
  for (let yy = y + step; yy < y + h; yy += step) {
    for (let xx = x + step; xx < x + w; xx += step) {
      ctx.fillRect(xx, yy, 1.4, 1.4);
    }
  }
  ctx.restore();
}

/** A caption chip: dark pill with white capitals, shrunk to fit the panel. */
function drawChip(ctx, text, x, y, maxW, baseSize) {
  let size = baseSize;
  ctx.font = `${size}px Anton, sans-serif`;
  while (ctx.measureText(text).width > maxW - 16 && size > 8) {
    size -= 1;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  const tw = ctx.measureText(text).width;
  const padX = 8;
  const padY = 5;
  const bw = tw + padX * 2;
  const bh = size + padY * 2;
  ctx.fillStyle = 'rgba(12, 2, 24, 0.78)';
  ctx.beginPath();
  ctx.roundRect(x, y, bw, bh, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX, y + bh / 2 + 1);
  return bh;
}

/** A character label chip ("THE DRIVER") at a panel's bottom-right (or bottom-left when `left` is set). */
function drawTag(ctx, text, x, y, baseSize, left = false) {
  let size = baseSize;
  ctx.font = `${size}px Anton, sans-serif`;
  const tw = ctx.measureText(text).width;
  const padX = 7;
  const padY = 4;
  const bw = tw + padX * 2;
  const bh = size + padY * 2;
  const bx = left ? x : x - bw;
  ctx.fillStyle = '#ffd21f';
  ctx.beginPath();
  ctx.roundRect(bx, y - bh, bw, bh, 3);
  ctx.fill();
  ctx.fillStyle = '#2a0a1e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + padX, y - bh / 2 + 1);
}

/** Chrome 3D title: purple extrude layers, warm gradient face, dark outline. */
function drawChromeTitle(ctx, text, cx, cy, w, maxSize) {
  let size = maxSize;
  ctx.font = `${size}px Anton, sans-serif`;
  while (ctx.measureText(text).width > w * 0.92 && size > 20) {
    size -= 2;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const grad = ctx.createLinearGradient(0, cy - size / 2, 0, cy + size / 2);
  grad.addColorStop(0, '#fffbe8');
  grad.addColorStop(0.35, '#ffd76a');
  grad.addColorStop(0.65, '#ff7a2f');
  grad.addColorStop(1, '#e0137c');
  for (let i = 7; i >= 1; i--) {
    ctx.fillStyle = i % 2 ? '#3d0a5e' : '#2a053f';
    ctx.fillText(text, cx + i * 1.4, cy + i * 1.8);
  }
  ctx.fillStyle = grad;
  ctx.fillText(text, cx, cy);
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.strokeStyle = 'rgba(30, 2, 40, 0.85)';
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = `${size * 0.5}px Anton, sans-serif`;
  return size;
}

/** Starburst seal: "ORIGINAL COVER ART" with five stars. */
function drawSeal(ctx, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const points = 18;
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.82;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd21f';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#7a1e00';
  ctx.stroke();
  ctx.fillStyle = '#2a0a1e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${r * 0.24}px Anton, sans-serif`;
  ctx.fillText('ORIGINAL', 0, -r * 0.28);
  ctx.fillText('COVER ART', 0, r * 0.02);
  ctx.font = `${r * 0.26}px sans-serif`;
  ctx.fillText('★★★★★', 0, r * 0.36);
  ctx.restore();
}

/** A striped setting sun: circle with horizontal cuts, for the bottom band. */
function drawStripedSun(ctx, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const grad = ctx.createLinearGradient(0, cy - r, 0, cy + r);
  grad.addColorStop(0, '#ffe259');
  grad.addColorStop(1, '#ff6a00');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.fillStyle = 'rgba(58, 10, 78, 0.9)';
  for (let i = 0; i < 4; i++) {
    const y = cy + r * (0.05 + i * 0.22);
    ctx.fillRect(cx - r, y, r * 2, r * 0.07);
  }
  ctx.restore();
}

/** A palm silhouette: curved trunk + six drooping fronds, drawn dark. */
function drawPalm(ctx, x, y, h, lean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#1c0330';
  ctx.fillStyle = '#1c0330';
  ctx.lineWidth = Math.max(3, h * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lean * h * 0.25, -h * 0.55, lean * h * 0.45, -h);
  ctx.stroke();
  const tx = lean * h * 0.45;
  const ty = -h;
  ctx.lineWidth = Math.max(2, h * 0.035);
  for (let i = 0; i < 6; i++) {
    // Fronds fan across the top and droop down at the ends.
    const spread = -0.95 + i * 0.38;
    const reach = h * (0.42 + (i % 2) * 0.08);
    const endX = tx + spread * reach;
    const endY = ty + h * 0.22;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + spread * reach * 0.55, ty - h * 0.16, endX, endY);
    ctx.stroke();
  }
  ctx.restore();
}

/** A barcode mark with its number line. */
function drawBarcode(ctx, x, y, w, h) {
  const rand = seededRandom(20261120);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#111111';
  let bx = x + 4;
  while (bx < x + w - 6) {
    const bw = 1 + Math.floor(rand() * 4);
    if (rand() > 0.42) ctx.fillRect(bx, y + 3, bw, h - 16);
    bx += bw + 1 + Math.floor(rand() * 3);
  }
  ctx.fillStyle = '#111111';
  let numSize = Math.max(9, h * 0.16);
  ctx.font = `${numSize}px monospace`;
  while (ctx.measureText('0 12345 67890 1').width > w - 8 && numSize > 7) {
    numSize -= 1;
    ctx.font = `${numSize}px monospace`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0 12345 67890 1', x + w / 2, y + h - 7);
}

/**
 * Draws a full poster cover onto `canvas`.
 * `images` maps photo names ('boulevard', 'pier') to loaded images (or null).
 * `opts`: { preset, grade, title, subtitle, stars, seal, tweaks }.
 * `tweaks` maps panel index to { zoom, panX, panY } (editor crop controls).
 */
export function drawCover(canvas, images, opts = {}) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const layout = COVER_LAYOUTS[opts.preset ?? 'sunset-heat'] ?? COVER_LAYOUTS['sunset-heat'];
  const grade = COVER_GRADES[opts.grade ?? 'sunset'] ?? COVER_GRADES.sunset;
  const title = (opts.title ?? layout.title).trim().toUpperCase() || layout.title;
  const subtitle = (opts.subtitle ?? layout.subtitle).trim() || layout.subtitle;
  const tweaks = opts.tweaks ?? {};
  const gap = Math.max(2, w * 0.008);

  // Backdrop: deep violet so panel gaps read as poster gutters.
  ctx.fillStyle = '#1c0330';
  ctx.fillRect(0, 0, w, h);

  // Panels.
  for (let i = 0; i < layout.panels.length; i++) {
    const p = layout.panels[i];
    const img = images[p.photo];
    const px = p.rect.x * w;
    const py = p.rect.y * h;
    const pw = p.rect.w * w;
    const ph = p.rect.h * h;
    const tw = tweaks[i] ?? {};
    ctx.save();
    if (layout.tilt) {
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate(((p.rotate ?? 0) * Math.PI) / 180);
      ctx.translate(-pw / 2, -ph / 2);
      // White print border + drop shadow for tilted snaps.
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = w * 0.02;
      ctx.shadowOffsetY = h * 0.008;
      ctx.fillStyle = '#fdf6ec';
      ctx.fillRect(-w * 0.012, -h * 0.012, pw + w * 0.024, ph + h * 0.024);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.translate(px, py);
    }
    if (img) {
      drawCroppedPhoto(ctx, img, p.crop, 0, 0, pw, ph, tw.zoom ?? 1, tw.panX ?? 0, tw.panY ?? 0, p.focusX ?? 0.5, p.focusY ?? 0.5);
    } else {
      const g = ctx.createLinearGradient(0, 0, pw, ph);
      g.addColorStop(0, '#5b2a6e');
      g.addColorStop(1, '#2a0a4a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, pw, ph);
    }
    gradePanel(ctx, 0, 0, pw, ph, grade);
    // Panel frame.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = Math.max(1.5, w * 0.002);
    ctx.strokeRect(0, 0, pw, ph);
    // Caption chip top-left, character tag bottom-right.
    const chipSize = Math.max(11, w * 0.0135);
    if (p.chip) drawChip(ctx, p.chip, 8, 8, pw - 16, chipSize);
    if (p.tag) drawTag(ctx, p.tag, p.tagPos === 'bl' ? 8 : pw - 8, ph - 8, Math.max(10, w * 0.012), p.tagPos === 'bl');
    ctx.restore();
    void gap;
  }

  // Soft dark band behind the title zone so the lettering reads over photos.
  const titleCy = layout.titleY * h;
  const bandGrad = ctx.createLinearGradient(0, titleCy - h * 0.115, 0, titleCy + h * 0.115);
  bandGrad.addColorStop(0, 'rgba(20, 0, 34, 0)');
  bandGrad.addColorStop(0.5, 'rgba(20, 0, 34, 0.55)');
  bandGrad.addColorStop(1, 'rgba(20, 0, 34, 0)');
  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, titleCy - h * 0.115, w, h * 0.23);

  // Press quote + stars above the title.
  if (opts.stars !== false) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffe9a8';
    ctx.font = `${Math.max(12, w * 0.016)}px Anton, sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText(`★★★★★  “${layout.quote}” — ${layout.quoteSource}`, w / 2, layout.quoteY * h);
    ctx.shadowBlur = 0;
  }

  // Chrome title + script subtitle overlapping the panels.
  const titleSize = drawChromeTitle(ctx, title, w / 2, titleCy, w, h * 0.145);
  ctx.save();
  ctx.translate(w / 2, titleCy + titleSize * 0.62);
  ctx.rotate(-0.035);
  ctx.font = `${Math.max(18, h * 0.042)}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff2e9a';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ff8fd0';
  ctx.fillText(subtitle, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(subtitle, 0, -1.5);
  ctx.restore();

  // Seal, top-right, overlapping the panels.
  if (opts.seal !== false) {
    drawSeal(ctx, w * 0.925, h * 0.075, Math.max(34, w * 0.052));
  }

  // Bottom band: tagline strip, footer credits, sun, palms, barcode.
  const bandY = layout.bandY * h;
  const bandGrad2 = ctx.createLinearGradient(0, bandY, 0, h);
  bandGrad2.addColorStop(0, grade.band[0]);
  bandGrad2.addColorStop(1, grade.band[1]);
  ctx.fillStyle = bandGrad2;
  ctx.fillRect(0, bandY, w, h - bandY);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(0, bandY, w, 2);
  const bandH = h - bandY;
  drawStripedSun(ctx, w * 0.10, bandY + bandH * 0.52, bandH * 0.34);
  drawPalm(ctx, w * 0.20, bandY + bandH * 0.92, bandH * 0.72, 0.5);
  drawPalm(ctx, w * 0.235, bandY + bandH * 0.92, bandH * 0.55, -0.4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffe9a8';
  ctx.font = `${Math.max(13, w * 0.02)}px Anton, sans-serif`;
  ctx.fillText('ONE COAST · NO RULES · COMING SOON', w * 0.52, bandY + bandH * 0.30);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = `${Math.max(9, w * 0.011)}px sans-serif`;
  ctx.fillText('VICE COAST STUDIO — A LEONIDA SESSION · SHOT ON LOCATION — PIER 26 · OCEAN DRIVE', w * 0.52, bandY + bandH * 0.62);
  ctx.fillStyle = '#ffd21f';
  ctx.font = `${Math.max(10, w * 0.013)}px Anton, sans-serif`;
  ctx.fillText(`${layout.vol} · COLLECTOR'S EDITION`, w * 0.52, bandY + bandH * 0.86);
  drawBarcode(ctx, w * 0.885, bandY + bandH * 0.22, w * 0.095, bandH * 0.56);

  // Deterministic grain over the whole cover.
  const rand = seededRandom(7);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 900; i++) {
    ctx.fillRect(rand() * w, rand() * h, 1.4, 1.4);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 900; i++) {
    ctx.fillRect(rand() * w, rand() * h, 1.4, 1.4);
  }
}
