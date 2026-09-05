// Generates the app icons as real PNGs, with no dependencies.
// A warm-ink rounded square with a soft checkmark — the same mark the app uses.
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // truecolour with alpha
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Signed distance helpers, so the edges come out smooth instead of jagged.
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function sdRoundRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r);
  const qy = Math.abs(py - cy) - (hh - r);
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
}
function sdSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay;
  const wx = px - ax, wy = py - ay;
  const t = clamp((wx * vx + wy * vy) / (vx * vx + vy * vy), 0, 1);
  return Math.hypot(wx - vx * t, wy - vy * t);
}

function draw(size, { bleed = false } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const s = size / 512;
  const ink = [26, 25, 23];
  const pad = bleed ? 0 : 44 * s;             // maskable icons need a safe margin
  const radius = bleed ? 0 : 112 * s;
  const cx = size / 2, cy = size / 2;
  const hw = size / 2 - pad, hh = size / 2 - pad;

  // Checkmark geometry, centred in the tile.
  const w = 22 * s;
  const a = [cx - 108 * s, cy + 4 * s];
  const b = [cx - 30 * s, cy + 78 * s];
  const c = [cx + 112 * s, cy - 76 * s];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5;
      const tile = bleed ? -1 : sdRoundRect(px, py, cx, cy, hw, hh, radius);
      const tileA = clamp(0.5 - tile, 0, 1);

      const d = Math.min(
        sdSegment(px, py, a[0], a[1], b[0], b[1]),
        sdSegment(px, py, b[0], b[1], c[0], c[1])
      ) - w / 2;
      const checkA = clamp(0.5 - d, 0, 1);

      // White check knocked out of the ink tile.
      const r = ink[0] + (255 - ink[0]) * checkA;
      const g = ink[1] + (255 - ink[1]) * checkA;
      const bl = ink[2] + (255 - ink[2]) * checkA;
      const i = (y * size + x) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = bl;
      buf[i + 3] = Math.round(tileA * 255);
    }
  }
  return png(size, size, buf);
}

const out = path.join(__dirname, '..', 'icons');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icon-192.png'), draw(192));
fs.writeFileSync(path.join(out, 'icon-512.png'), draw(512));
fs.writeFileSync(path.join(out, 'maskable-512.png'), draw(512, { bleed: true }));
fs.writeFileSync(path.join(out, 'apple-touch-icon.png'), draw(180, { bleed: true }));
console.log('icons written to', out);
