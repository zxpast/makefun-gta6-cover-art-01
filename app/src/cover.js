// Vice Coast Cover Studio — poster renderer (round 2).
// Draws a multi-panel GTA-style poster cover on a 2D canvas: six distinct
// photo crops, a sunset or neon grade baked into the photo pixels, chrome 3D
// lettering, per-panel caption chips and poster furniture (seal, press quote,
// VOL tag, footer credits, barcode). All lettering is Anton & Pacifico,
// both SIL OFL fonts shipped under app/fonts/. No Rockstar logo, artwork
// or font anywhere in this app.

export const COVER_SIZES = [
  { id: 'wide', label: '1920 x 1080', w: 1920, h: 1080 },
  { id: 'square', label: '1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: '1080 x 1350', w: 1080, h: 1350 },
];

export const COVER_GRADES = [
  { id: 'sunset', label: 'Sunset', top: 'rgba(255,122,60,0.30)', bottom: 'rgba(198,32,110,0.38)', wash: 'rgba(255,180,90,0.12)', vig: 0.40 },
  { id: 'neon', label: 'Neon nights', top: 'rgba(255,44,168,0.34)', bottom: 'rgba(0,214,196,0.28)', wash: 'rgba(255,90,220,0.10)', vig: 0.42 },
  { id: 'vicepink', label: 'Vice pink', top: 'rgba(255,80,180,0.28)', bottom: 'rgba(120,40,200,0.34)', wash: 'rgba(255,140,200,0.10)', vig: 0.38 },
  { id: 'golden', label: 'Golden hour', top: 'rgba(255,176,44,0.30)', bottom: 'rgba(214,92,20,0.32)', wash: 'rgba(255,200,110,0.14)', vig: 0.44 },
];

export const COVER_LAYOUTS = [
  { id: 'hero6', label: 'Hero + 5' },
  { id: 'strip6', label: 'Portrait strip' },
  { id: 'tilt4', label: 'Tilted snaps' },
  { id: 'grid6', label: 'Poster grid' },
];

// Crop rects as fractions [x, y, w, h] of the source photo. The two sample
// photos are boulevard.jpg (544x720, woman + red convertible at sunset) and
// pier.jpg (720x720, man with a fishing rod on a pier). Every rect keeps the
// face whole: the woman's face sits near x 0.30-0.62 / y 0.05-0.28, the man's
// near x 0.22-0.62 / y 0.10-0.42. No preset ever repeats a crop in one cover.
export const COVER_CROPS = {
  boulevardFace: [0.16, 0.0, 0.62, 0.46],
  boulevardWide: [0.0, 0.0, 1.0, 0.62],
  boulevardSunset: [0.0, 0.1, 0.5, 0.3],
  boulevardCar: [0.0, 0.52, 0.55, 0.48],
  boulevardStreet: [0.58, 0.04, 0.42, 0.56],
  pierFace: [0.12, 0.0, 0.62, 0.58],
  pierSmile: [0.18, 0.05, 0.5, 0.42],
  pierRod: [0.52, 0.18, 0.48, 0.82],
  pierSea: [0.5, 0.35, 0.5, 0.5],
  pierWater: [0.45, 0.36, 0.24, 0.28],
  pierBoards: [0.0, 0.4, 0.35, 0.6],
};

// One cover preset: layout, grade, title, subtitle, and the six panels with
// their photo, crop, caption chip and optional character label.
export const COVER_PRESETS = {
  sunsetHeist: {
    id: 'sunsetHeist', name: 'Sunset Heist', layout: 'hero6', grade: 'sunset',
    size: 'wide', title: 'SUNSET HEIST', subtitle: 'a fever dream in neon',
    quote: 'A SUN-DRENCHED KNOCKOUT.',
    quoteBy: 'COASTLINE WEEKLY',
    tagline: 'ONE COAST · NO RULES · COMING SOON',
    credits: 'VICE COAST STUDIO — A LEONIDA SESSION · SHOT ON LOCATION — PIER 26 · OCEAN DRIVE',
    vol: 'VOL. 06',
    panels: [
      { photo: 'boulevard', crop: 'boulevardFace', place: 'OCEAN DRIVE', time: '6:42 PM', story: 'LOOKING FOR TROUBLE', label: 'THE DRIVER' },
      { photo: 'pier', crop: 'pierFace', place: 'PIER 26', time: '5:30 AM', story: 'GONE FISHING', label: 'THE ANGLER' },
      { photo: 'pier', crop: 'pierRod', place: 'PIER 26', time: '7:15 AM', story: 'ONE THAT GOT AWAY', label: '' },
      { photo: 'boulevard', crop: 'boulevardSunset', place: 'BOARDWALK', time: '7:05 PM', story: 'LAST LIGHT', label: '' },
      { photo: 'pier', crop: 'pierWater', place: 'VICE BAY', time: '6:10 PM', story: 'NO WITNESSES', label: '' },
      { photo: 'boulevard', crop: 'boulevardCar', place: 'OCEAN DRIVE', time: '8:40 PM', story: 'REDLINE', label: '' },
    ],
  },
  neonNights: {
    id: 'neonNights', name: 'Neon Nights', layout: 'strip6', grade: 'neon',
    size: 'portrait', title: 'NEON NIGHTS', subtitle: 'six nights in paradise',
    quote: 'NEON SO BRIGHT IT HUMS.',
    quoteBy: 'THE COAST HERALD',
    tagline: 'EVERY SUMMER HAS A STORY',
    credits: 'VICE COAST STUDIO — A LEONIDA SESSION · SHOT ON LOCATION — OCEAN DRIVE · PIER 26',
    vol: 'VOL. 01',
    panels: [
      { photo: 'boulevard', crop: 'boulevardWide', place: 'OCEAN DRIVE', time: '6:42 PM', story: 'LOOKING FOR TROUBLE', label: 'THE DRIVER' },
      { photo: 'pier', crop: 'pierFace', place: 'PIER 26', time: '5:30 AM', story: 'GONE FISHING', label: 'THE ANGLER' },
      { photo: 'pier', crop: 'pierRod', place: 'PIER 26', time: '7:15 AM', story: 'ONE THAT GOT AWAY', label: '' },
      { photo: 'boulevard', crop: 'boulevardStreet', place: 'OCEAN DRIVE', time: '7:20 PM', story: 'LAST RIDE', label: '' },
      { photo: 'boulevard', crop: 'boulevardCar', place: 'OCEAN DRIVE', time: '8:40 PM', story: 'REDLINE', label: '' },
      { photo: 'boulevard', crop: 'boulevardSunset', place: 'BOARDWALK', time: '7:05 PM', story: 'LAST LIGHT', label: '' },
    ],
  },
  goldenCoast: {
    id: 'goldenCoast', name: 'Golden Coast', layout: 'tilt4', grade: 'golden',
    size: 'square', title: 'GOLDEN COAST', subtitle: 'every sunset has a price',
    quote: 'GOLDEN HOUR, BOTTLED.',
    quoteBy: 'SUNSET MAGAZINE',
    tagline: 'ONE COAST · NO RULES · COMING SOON',
    credits: 'VICE COAST STUDIO — A LEONIDA SESSION · SHOT ON LOCATION — PIER 26 · OCEAN DRIVE',
    vol: 'VOL. 03',
    panels: [
      { photo: 'boulevard', crop: 'boulevardFace', place: 'OCEAN DRIVE', time: '6:42 PM', story: 'LOOKING FOR TROUBLE', label: 'THE DRIVER' },
      { photo: 'pier', crop: 'pierFace', place: 'PIER 26', time: '5:30 AM', story: 'GONE FISHING', label: 'THE ANGLER' },
      { photo: 'pier', crop: 'pierSea', place: 'VICE BAY', time: '6:10 PM', story: 'NO WITNESSES', label: '' },
      { photo: 'boulevard', crop: 'boulevardCar', place: 'OCEAN DRIVE', time: '8:40 PM', story: 'REDLINE', label: '' },
    ],
  },
};

/** Deterministic PRNG (mulberry32) so a cover renders identically every run. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turns a crop rect + user zoom/pan into a source rect clamped inside the image. */
export function fitCrop(img, crop, adjust) {
  const [fx, fy, fw, fh] = crop;
  let sx = fx * img.naturalWidth;
  let sy = fy * img.naturalHeight;
  let sw = fw * img.naturalWidth;
  let sh = fh * img.naturalHeight;
  const zoom = adjust && adjust.zoom ? adjust.zoom : 1;
  const dx = adjust && adjust.dx ? adjust.dx : 0;
  const dy = adjust && adjust.dy ? adjust.dy : 0;
  if (zoom !== 1) {
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    sw /= zoom; sh /= zoom;
    sx = cx - sw / 2; sy = cy - sh / 2;
  }
  sx += dx * sw; sy += dy * sh;
  sx = Math.max(0, Math.min(img.naturalWidth - sw, sx));
  sy = Math.max(0, Math.min(img.naturalHeight - sh, sy));
  return { sx, sy, sw, sh };
}

/** Bakes the grade into the photo pixels: warm wash + vignette + halftone. */
export function applyPhotoGrade(ctx, w, h, grade) {
  ctx.save();
  const wash = ctx.createLinearGradient(0, 0, 0, h);
  wash.addColorStop(0, grade.top);
  wash.addColorStop(1, grade.bottom);
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  const vig = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.78);
  vig.addColorStop(0, 'rgba(24,4,32,0)');
  vig.addColorStop(1, `rgba(24,4,32,${grade.vig})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
  // Halftone dots over the photo, denser toward the bottom edge.
  const step = Math.max(6, Math.round(w / 130));
  ctx.fillStyle = 'rgba(10,2,20,0.10)';
  for (let y = step / 2; y < h; y += step) {
    const row = Math.round(y / step);
    for (let x = (row % 2 ? step / 2 : 0) + step / 2; x < w; x += step) {
      const depth = 0.5 + (y / h) * 0.9;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.6, step * 0.16 * depth), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Draws one photo panel (graded, bordered) at the given rect, optional tilt. */
export function drawPhotoPanel(ctx, img, panel, geom, adjust) {
  const { x, y, w, h, rot = 0 } = geom;
  const off = document.createElement('canvas');
  const scale = Math.min(1, 900 / Math.max(w, h));
  off.width = Math.max(2, Math.round(w * scale));
  off.height = Math.max(2, Math.round(h * scale));
  const octx = off.getContext('2d');
  const grade = COVER_GRADES.find((g) => g.id === panel.grade) || COVER_GRADES[0];
  if (img) {
    const crop = COVER_CROPS[panel.crop] || [0, 0, 1, 1];
    const src = fitCrop(img, crop, adjust);
    // Match the panel's aspect ratio so photos are never stretched: shrink
    // the source rect (centred) to the panel aspect instead of squashing it.
    const targetAspect = off.width / off.height;
    const srcAspect = src.sw / src.sh;
    if (srcAspect > targetAspect) {
      const nw = src.sh * targetAspect;
      src.sx += (src.sw - nw) / 2;
      src.sw = nw;
    } else if (srcAspect < targetAspect) {
      const nh = src.sw / targetAspect;
      src.sy += (src.sh - nh) / 2;
      src.sh = nh;
    }
    octx.drawImage(img, src.sx, src.sy, src.sw, src.sh, 0, 0, off.width, off.height);
  } else {
    const g = octx.createLinearGradient(0, 0, off.width, off.height);
    g.addColorStop(0, '#3a1c5c'); g.addColorStop(1, '#12081f');
    octx.fillStyle = g; octx.fillRect(0, 0, off.width, off.height);
  }
  applyPhotoGrade(octx, off.width, off.height, grade);
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  if (rot) ctx.rotate((rot * Math.PI) / 180);
  ctx.translate(-w / 2, -h / 2);
  ctx.drawImage(off, 0, 0, w, h);
  ctx.lineWidth = Math.max(2, w * 0.006);
  ctx.strokeStyle = '#fff7ec';
  ctx.strokeRect(0, 0, w, h);
  ctx.lineWidth = Math.max(1, w * 0.002);
  ctx.strokeStyle = 'rgba(16,4,28,0.85)';
  ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, w - ctx.lineWidth * 2, h - ctx.lineWidth * 2);
  ctx.restore();
  return { x, y, w, h, rot };
}

/** Rounded-rect path helper. */
export function roundRectPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** Per-panel caption chip: place + time on one line, micro-story below. */
export function drawCaptionChip(ctx, px, py, pw, panel, scale) {
  const s = scale;
  const pad = 10 * s;
  const line1 = `${panel.place} · ${panel.time}`;
  const line2 = panel.story;
  ctx.save();
  ctx.font = `${Math.round(15 * s)}px Anton, sans-serif`;
  const w1 = ctx.measureText(line1).width;
  ctx.font = `italic ${Math.round(12.5 * s)}px system-ui, sans-serif`;
  const w2 = ctx.measureText(line2).width;
  const bw = Math.max(w1, w2) + pad * 2;
  const bh = (15 + 13 + 8) * s + pad * 1.4;
  ctx.fillStyle = 'rgba(10,4,20,0.80)';
  roundRectPath(ctx, px, py, bw, bh, 6 * s);
  ctx.fill();
  ctx.fillStyle = '#ffd23e';
  ctx.font = `${Math.round(15 * s)}px Anton, sans-serif`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(line1, px + pad, py + pad + 14 * s);
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic ${Math.round(12.5 * s)}px system-ui, sans-serif`;
  ctx.fillText(line2, px + pad, py + pad + 29 * s);
  ctx.restore();
  return { w: bw, h: bh };
}

/** White character label chip ("THE DRIVER") at a panel's bottom-left. */
export function drawLabelChip(ctx, px, py, label, scale) {
  const s = scale;
  const pad = 9 * s;
  ctx.save();
  ctx.font = `${Math.round(14 * s)}px Anton, sans-serif`;
  const w = ctx.measureText(label).width + pad * 2;
  const h = 15 * s + pad * 1.5;
  ctx.fillStyle = '#fff7ec';
  roundRectPath(ctx, px, py, w, h, 4 * s);
  ctx.fill();
  ctx.fillStyle = '#16042e';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, px + pad, py + pad + 13 * s);
  ctx.restore();
  return { w, h };
}

/** Height of a caption chip at a scale (matches drawCaptionChip's layout). */
export function captionChipHeight(scale) {
  return (15 + 13 + 8) * scale + (10 * scale) * 1.4;
}

/** Width of a character label chip at a scale (matches drawLabelChip). */
export function measureLabelWidth(ctx, label, scale) {
  ctx.save();
  ctx.font = `${Math.round(14 * scale)}px Anton, sans-serif`;
  const w = ctx.measureText(label).width + (9 * scale) * 2;
  ctx.restore();
  return w;
}

/** Chrome 3D title: extruded dark layers + sunset gradient + dark outline. */
export function drawChromeTitle(ctx, text, cx, topY, size, maxW) {
  ctx.save();
  ctx.translate(cx, 0);
  ctx.transform(1, 0, -0.05, 1, 0, 0);
  ctx.translate(-cx, 0);
  let fit = size;
  ctx.font = `${fit}px Anton, sans-serif`;
  while (ctx.measureText(text).width > maxW && fit > 20) {
    fit -= 4;
    ctx.font = `${fit}px Anton, sans-serif`;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineJoin = 'round';
  const layers = 7;
  for (let i = layers; i >= 1; i--) {
    ctx.fillStyle = i % 2 ? '#2b0a4a' : '#16042e';
    ctx.fillText(text, cx, topY + i * fit * 0.045);
  }
  const grad = ctx.createLinearGradient(0, topY, 0, topY + fit);
  grad.addColorStop(0, '#fff6c0');
  grad.addColorStop(0.35, '#ffc53d');
  grad.addColorStop(0.68, '#ff6a2a');
  grad.addColorStop(1, '#d6336c');
  ctx.fillStyle = grad;
  ctx.fillText(text, cx, topY);
  ctx.lineWidth = Math.max(2, fit * 0.045);
  ctx.strokeStyle = '#16042e';
  ctx.strokeText(text, cx, topY);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `${fit}px Anton, sans-serif`;
  ctx.restore();
  return fit;
}

/** Script subtitle in Pacifico with a pink neon glow. */
export function drawScriptSubtitle(ctx, text, cx, y, size) {
  ctx.save();
  ctx.font = `${size}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor = '#ff5ec4';
  ctx.shadowBlur = size * 0.35;
  ctx.fillStyle = '#ff8ad8';
  ctx.fillText(text, cx, y);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.85;
  ctx.fillText(text, cx, y - size * 0.04);
  ctx.restore();
}

/** Starburst seal: "ORIGINAL COVER ART" on a yellow star. */
export function drawStarburstSeal(ctx, cx, cy, r, lines) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const points = 16;
  for (let i = 0; i < points * 2; i++) {
    const ang = (i * Math.PI) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.78;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffd23e';
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.05);
  ctx.strokeStyle = '#16042e';
  ctx.stroke();
  ctx.fillStyle = '#16042e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fs = r * 0.24;
  ctx.font = `${fs}px Anton, sans-serif`;
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i - (lines.length - 1) / 2) * fs * 1.25);
  });
  ctx.restore();
}

/** Fake barcode from a seeded PRNG: thin black bars on white. */
export function drawBarcode(ctx, x, y, w, h, seed) {
  const rnd = seededRandom(seed);
  ctx.save();
  ctx.fillStyle = '#fff7ec';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#12081f';
  let bx = x + 3;
  while (bx < x + w - 4) {
    const bw = 1 + Math.floor(rnd() * 4);
    if (rnd() > 0.42) ctx.fillRect(bx, y + 3, bw, h - 12);
    bx += bw + 1 + Math.floor(rnd() * 3);
  }
  ctx.font = `${Math.max(7, Math.round(h * 0.16))}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('8 90210 26119 6', x + w / 2, y + h - 2);
  ctx.restore();
}

/** Footer strip: press quote + tagline + credits + VOL + barcode. No dead band. */
export function drawPosterFurniture(ctx, W, H, preset, scale) {
  const s = scale;
  const fh = Math.round(H * 0.115);
  const fy = H - fh;
  const g = ctx.createLinearGradient(0, fy, 0, H);
  g.addColorStop(0, '#1c0a33');
  g.addColorStop(1, '#0c0318');
  ctx.fillStyle = g;
  ctx.fillRect(0, fy, W, fh);
  ctx.fillStyle = '#ff5e3a';
  ctx.fillRect(0, fy, W, Math.max(3, 4 * s));
  const cx = W / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // Press quote: five gold stars + quote on ONE centred line, so the stars
  // never sit on top of the quote's first words.
  ctx.textAlign = 'left';
  ctx.font = `${Math.round(15 * s)}px Anton, sans-serif`;
  const starsW = ctx.measureText('★★★★★').width;
  ctx.font = `italic ${Math.round(14 * s)}px system-ui, sans-serif`;
  const quoteW = ctx.measureText(`“${preset.quote}” — ${preset.quoteBy}`).width;
  const lineX = cx - (starsW + 10 * s + quoteW) / 2;
  ctx.fillStyle = '#ffd23e';
  ctx.font = `${Math.round(15 * s)}px Anton, sans-serif`;
  ctx.fillText('★★★★★', lineX, fy + fh * 0.34);
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic ${Math.round(14 * s)}px system-ui, sans-serif`;
  ctx.fillText(`“${preset.quote}” — ${preset.quoteBy}`, lineX + starsW + 10 * s, fy + fh * 0.34);
  ctx.textAlign = 'center';
  // Tagline strip.
  ctx.fillStyle = '#ffd23e';
  try { ctx.letterSpacing = `${Math.round(3 * s)}px`; } catch { /* older canvas */ }
  ctx.font = `${Math.round(16 * s)}px Anton, sans-serif`;
  ctx.fillText(preset.tagline, cx, fy + fh * 0.68);
  try { ctx.letterSpacing = '0px'; } catch { /* ignore */ }
  // Credits, bottom-left; VOL tag, top-left of the strip; barcode, right.
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.font = `${Math.round(10.5 * s)}px system-ui, sans-serif`;
  ctx.fillText(preset.credits, W * 0.02, H - 8 * s);
  ctx.fillStyle = '#fff7ec';
  ctx.font = `${Math.round(13 * s)}px Anton, sans-serif`;
  ctx.fillText(preset.vol, W * 0.02, fy + fh * 0.34);
  drawBarcode(ctx, W - W * 0.085, fy + fh * 0.14, W * 0.065, fh * 0.66, 26119);
  return fy;
}

/** Geometry for the hero6 layout: two rows of three panels, title across the middle. */
export function layoutHeroSix(W, H) {
  const m = Math.round(W * 0.019);
  const gap = Math.round(W * 0.007);
  const colW = Math.round((W - m * 2 - gap * 2) / 3);
  const rowAH = Math.round(H * 0.48);
  const top = Math.round(H * 0.033);
  // Bottom row stretches down to the footer strip: no flat dead band.
  const footerTop = H - Math.round(H * 0.115);
  const rowBH = footerTop - top - rowAH - gap;
  const panels = [];
  for (let c = 0; c < 3; c++) {
    const x = m + c * (colW + gap);
    panels.push({ x, y: top, w: colW, h: rowAH });
    panels.push({ x, y: top + rowAH + gap, w: colW, h: rowBH });
  }
  // Interleave so panel order reads top row then bottom row.
  const ordered = [panels[0], panels[2], panels[4], panels[1], panels[3], panels[5]];
  return {
    panels: ordered,
    title: { cx: W / 2, topY: top + rowAH - Math.round(H * 0.075), size: Math.round(H * 0.145), maxW: W * 0.88 },
    subtitleY: top + rowAH + Math.round(H * 0.085),
    seal: { cx: W - m - Math.round(W * 0.035), cy: top + Math.round(W * 0.042), r: Math.round(W * 0.041) },
    scrim: { y: top + rowAH - Math.round(H * 0.115), h: Math.round(H * 0.30) },
  };
}

/** Geometry for the portrait strip6 layout: big left panel + right column + bottom row. */
export function layoutPortraitStrip(W, H) {
  const m = Math.round(W * 0.033);
  const gap = Math.round(W * 0.012);
  const leftW = Math.round(W * 0.575);
  const rightX = m + leftW + gap;
  const rightW = W - rightX - m;
  const leftH = Math.round(H * 0.585);
  const smallH = Math.round((leftH - gap * 2) / 3);
  const bottomY = m + leftH + gap;
  const bottomH = Math.round(H * 0.13);
  const bottomW = Math.round((W - m * 2 - gap) / 2);
  return {
    panels: [
      { x: m, y: m, w: leftW, h: leftH },
      { x: rightX, y: m, w: rightW, h: smallH },
      { x: rightX, y: m + smallH + gap, w: rightW, h: smallH },
      { x: rightX, y: m + (smallH + gap) * 2, w: rightW, h: smallH },
      { x: m, y: bottomY, w: bottomW, h: bottomH },
      { x: m + bottomW + gap, y: bottomY, w: bottomW, h: bottomH },
    ],
    // Title sits in its own band BELOW the bottom row, so it never covers
    // the bottom-row chips; the footer strip closes the cover underneath.
    title: { cx: W / 2, topY: bottomY + bottomH + 4, size: Math.round(H * 0.067), maxW: W * 0.92 },
    subtitleY: bottomY + bottomH + Math.round(H * 0.062),
    seal: { cx: W - m - Math.round(W * 0.055), cy: m + Math.round(W * 0.062), r: Math.round(W * 0.058) },
    scrim: { y: bottomY + bottomH - Math.round(H * 0.01), h: Math.round(H * 0.14) },
  };
}

/** Geometry for the tilted-snaps layout: four rotated panels on a sunset backdrop. */
export function layoutTiltedSnaps(W, H) {
  const m = Math.round(W * 0.055);
  const gap = Math.round(W * 0.02);
  const pw = Math.round((W - m * 2 - gap) / 2);
  const ph = Math.round(H * 0.40);
  const top = Math.round(H * 0.055);
  return {
    panels: [
      { x: m, y: top, w: pw, h: ph, rot: -3 },
      { x: m + pw + gap, y: top + Math.round(H * 0.012), w: pw, h: ph, rot: 2.5 },
      { x: m + Math.round(H * 0.008), y: top + ph + gap, w: pw, h: ph, rot: 2 },
      { x: m + pw + gap, y: top + ph + gap + Math.round(H * 0.012), w: pw, h: ph, rot: -2.5 },
    ],
    title: { cx: W / 2, topY: top + ph - Math.round(H * 0.055), size: Math.round(H * 0.115), maxW: W * 0.9 },
    subtitleY: top + ph + Math.round(H * 0.075),
    seal: { cx: W - m - Math.round(W * 0.045), cy: top + Math.round(W * 0.05), r: Math.round(W * 0.05) },
    scrim: { y: top + ph - Math.round(H * 0.085), h: Math.round(H * 0.20) },
  };
}

/** Geometry for the poster-grid layout: six panels, three columns by two rows,
 *  title in its own band below the rows so it never covers a chip. */
export function layoutPosterGrid(W, H) {
  const m = Math.round(W * 0.025);
  const gap = Math.round(W * 0.01);
  const colW = Math.round((W - m * 2 - gap * 2) / 3);
  const rowH = Math.round(H * 0.333);
  const top = Math.round(H * 0.03);
  const panels = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      panels.push({ x: m + c * (colW + gap), y: top + r * (rowH + gap), w: colW, h: rowH });
    }
  }
  const titleTop = top + rowH * 2 + gap + 4;
  return {
    panels,
    title: { cx: W / 2, topY: titleTop, size: Math.round(H * 0.088), maxW: W * 0.9 },
    subtitleY: titleTop + Math.round(H * 0.12),
    seal: { cx: W - m - Math.round(W * 0.04), cy: top + Math.round(W * 0.045), r: Math.round(W * 0.045) },
    scrim: { y: titleTop - Math.round(H * 0.03), h: Math.round(H * 0.17) },
  };
}

export const COVER_GEOMETRY = {
  hero6: layoutHeroSix,
  strip6: layoutPortraitStrip,
  tilt4: layoutTiltedSnaps,
  grid6: layoutPosterGrid,
};

/** Soft dark scrim behind the title so chrome lettering reads over any photo. */
export function drawTitleScrim(ctx, W, scrim) {
  const g = ctx.createLinearGradient(0, scrim.y, 0, scrim.y + scrim.h);
  g.addColorStop(0, 'rgba(14,3,26,0)');
  g.addColorStop(0.35, 'rgba(14,3,26,0.55)');
  g.addColorStop(0.65, 'rgba(14,3,26,0.55)');
  g.addColorStop(1, 'rgba(14,3,26,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, scrim.y, W, scrim.h);
}

/** Halftone + grain wash over the whole finished cover. */
export function applyCoverFinish(ctx, W, H, seed) {
  const step = Math.max(7, Math.round(W / 160));
  ctx.save();
  ctx.fillStyle = 'rgba(12,2,24,0.05)';
  for (let y = step / 2; y < H; y += step) {
    const row = Math.round(y / step);
    for (let x = (row % 2 ? step / 2 : 0) + step / 2; x < W; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.6, step * 0.13), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const rnd = seededRandom(seed);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 900; i++) {
    ctx.fillRect(rnd() * W, rnd() * H, 1.4, 1.4);
  }
  ctx.restore();
}

/**
 * Draws a full cover. `photos` maps photo id -> HTMLImageElement (or null).
 * `opts` picks a preset and overrides: { preset, layout, grade, title,
 * subtitle, size, adjust: [per-panel {zoom,dx,dy}], captions: [per-panel
 * {place,time,story,label}] }. Returns the layout geometry used.
 */
export function drawCover(canvas, photos, opts) {
  const preset = COVER_PRESETS[opts.preset] || COVER_PRESETS.sunsetHeist;
  const size = COVER_SIZES.find((s) => s.id === (opts.size || preset.size)) || COVER_SIZES[0];
  const layoutId = opts.layout || preset.layout;
  const gradeId = opts.grade || preset.grade;
  const title = (opts.title ?? preset.title).toUpperCase();
  const subtitle = opts.subtitle ?? preset.subtitle;
  const W = size.w;
  const H = size.h;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const scale = W / 1080;
  // Sunset backdrop: deep purple sky melting into orange at the horizon.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2a0f4d');
  bg.addColorStop(0.45, '#7a2358');
  bg.addColorStop(0.75, '#e85d3d');
  bg.addColorStop(1, '#ffb347');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // Striped setting sun behind the panels.
  const sunX = W * 0.82;
  const sunY = H * 0.30;
  const sunR = Math.min(W, H) * 0.16;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sun.addColorStop(0, '#fff3b0');
  sun.addColorStop(1, '#ff5e3a');
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
  ctx.fillStyle = 'rgba(42,15,77,0.55)';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(sunX - sunR, sunY + sunR * (0.1 + i * 0.16), sunR * 2, sunR * 0.045);
  }
  ctx.restore();
  const geom = (COVER_GEOMETRY[layoutId] || layoutHeroSix)(W, H);
  const panels = preset.panels;
  geom.panels.forEach((g, i) => {
    const panel = { ...(panels[i % panels.length]), grade: gradeId };
    if (opts.captions && opts.captions[i]) Object.assign(panel, opts.captions[i]);
    const img = photos ? photos[panel.photo] || null : null;
    const adjust = opts.adjust ? opts.adjust[i] : null;
    drawPhotoPanel(ctx, img, panel, g, adjust);
    // Chips and labels dodge the chrome title: panels in the lower half
    // carry them at the bottom, upper panels at the top. The title always
    // overlaps the middle of the cover, never a chip.
    const chipScale = Math.max(0.7, Math.min(1.6, g.w / 420));
    const lowerHalf = g.y + g.h / 2 > H * 0.52;
    const chipH = captionChipHeight(chipScale);
    const chipY = lowerHalf ? g.y + g.h - chipH - 10 * scale : g.y + 10 * scale;
    drawCaptionChip(ctx, g.x + 10 * scale, chipY, g.w, panel, chipScale);
    if (panel.label) {
      // A label the starburst seal sits on top of is dropped cleanly: a
      // half-hidden label reads as a rendering bug, a missing one does not.
      const sealOverPanel = geom.seal
        && geom.seal.cx > g.x && geom.seal.cx < g.x + g.w
        && geom.seal.cy > g.y && geom.seal.cy < g.y + g.h;
      if (!sealOverPanel) {
        const labelW = measureLabelWidth(ctx, panel.label, chipScale);
        const labelH = 15 * chipScale + (9 * chipScale) * 1.5;
        const labelX = g.x + g.w - labelW - 10 * scale;
        const labelY = lowerHalf ? g.y + g.h - labelH - 10 * scale : g.y + 10 * scale;
        drawLabelChip(ctx, labelX, labelY, panel.label, chipScale);
      }
    }
  });
  drawTitleScrim(ctx, W, geom.scrim);
  const titleSize = drawChromeTitle(ctx, title, geom.title.cx, geom.title.topY, geom.title.size, geom.title.maxW);
  // Subtitle sits just under the title's extrusion, never on top of it.
  const subtitleY = geom.title.topY + titleSize * 1.38;
  drawScriptSubtitle(ctx, subtitle, geom.title.cx, subtitleY, Math.round(titleSize * 0.34));
  drawStarburstSeal(ctx, geom.seal.cx, geom.seal.cy, geom.seal.r, ['ORIGINAL', 'COVER ART']);
  const furniture = { ...preset, title, subtitle };
  drawPosterFurniture(ctx, W, H, furniture, scale);
  applyCoverFinish(ctx, W, H, 26119);
  return { size, layout: layoutId, grade: gradeId, panels: geom.panels.length };
}
