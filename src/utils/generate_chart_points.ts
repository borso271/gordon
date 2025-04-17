/* -----------------------------------------------------------
 * 1‑D Perlin noise (Ken Perlin, 1983) – tiny ES module version
 * --------------------------------------------------------- */
const PERM = new Uint8Array(512);
const grad1 = [1, -1];
(function buildPerm() {
  for (let i = 0; i < 256; i++) PERM[i] = i;
  // Fisher‑Yates shuffle
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [PERM[i], PERM[j]] = [PERM[j], PERM[i]];
  }
  for (let i = 0; i < 256; i++) PERM[i + 256] = PERM[i];
})();

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}
function grad(hash: number, x: number) {
  return grad1[hash & 1] * x;
}
/** 1‑D Perlin noise for x in ℝ */
function perlin(x: number) {
  const xi = Math.floor(x) & 255;
  const xf = x - Math.floor(x);
  const u = fade(xf);
  const a = PERM[xi];
  const b = PERM[xi + 1];
  return lerp(grad(a, xf), grad(b, xf - 1), u);
}

/* -----------------------------------------------------------
 * generatePriceSeriesPerlin
 * --------------------------------------------------------- */
export interface PricePoint {
  price: number;
  time: number;
}

/**
 * Smooth price curve using linear trend + Perlin noise.
 *
 * @param startPrice    first price
 * @param endPrice      last price
 * @param maxFluc       max ± deviation from trend (price units)
 * @param startTimeMs   epoch ms start
 * @param endTimeMs     epoch ms end
 * @param points        sample count (≥2)
 */
export function generatePriceSeriesPerlin(
  startPrice: number,
  endPrice: number,
  maxFluc: number,
  startTimeMs: number,
  endTimeMs: number,
  points = 240 // e.g. 1 point / minute in a 4‑h chart
): PricePoint[] {
  if (points < 2) throw new Error("points must be ≥2");

  const stepMs = (endTimeMs - startTimeMs) / (points - 1);
  const slope = (endPrice - startPrice) / (points - 1);

  // choose a random Perlin frequency so each series feels unique
  const freq = 0.15 + Math.random() * 0.15; // 0.15‑0.30 waves per sample
  const amp = maxFluc;

  const series: PricePoint[] = [];

  for (let i = 0; i < points; i++) {
    const base = startPrice + slope * i;         // linear trend
    const noise = perlin(i * freq) * amp;        // smooth jitter
    const price = +(base + noise).toFixed(2);    // 2 decimals
    const time = startTimeMs + i * stepMs;
    series.push({ price, time });
  }

  // pin exact endpoints
  series[0].price = +startPrice.toFixed(2);
  series[series.length - 1].price = +endPrice.toFixed(2);

  return series;
}
