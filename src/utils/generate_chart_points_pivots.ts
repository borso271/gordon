export interface PricePoint { price: number; time: number }

/**
 * Generate a “stock‑like” path that may reverse trend several times
 * but still hits the exact start & end prices.
 */
export function generatePriceSeriesPivots(
  startPrice: number,
  endPrice: number,
  maxFluctuation: number,
  startTimeMs: number,
  endTimeMs: number,
  points = 240               // total samples to return
): PricePoint[] {
  if (points < 2) throw new Error("points must be ≥ 2");

  // 1️⃣  Pick 3‑6 interior pivot points (random times)
  const pivotCount = 2 + Math.floor(Math.random() * 4); // 2,3,4,5
  const pivots: { t: number; p: number }[] = [];

  for (let i = 0; i < pivotCount; i++) {
    // random timestamp strictly inside (0,1)
    const ratio = Math.random();
    // linear trend price at that point
    const trend = startPrice + (endPrice - startPrice) * ratio;
    // random deviation ± maxFluc
    const dev = (Math.random() * 2 - 1) * maxFluctuation;
    pivots.push({
      t: startTimeMs + ratio * (endTimeMs - startTimeMs),
      p: +(trend + dev).toFixed(2),
    });
  }

  // 2️⃣  Add endpoints and sort pivots by time
  pivots.push({ t: startTimeMs, p: +startPrice.toFixed(2) });
  pivots.push({ t: endTimeMs,   p: +endPrice.toFixed(2) });
  pivots.sort((a, b) => a.t - b.t);

  // 3️⃣  Produce evenly spaced points using linear interpolation between pivots
  const stepMs = (endTimeMs - startTimeMs) / (points - 1);
  const output: PricePoint[] = [];

  let pivotIdx = 0;
  for (let i = 0; i < points; i++) {
    const currentTime = startTimeMs + i * stepMs;

    // advance pivot segment if needed
    while (
      pivotIdx < pivots.length - 2 &&
      currentTime > pivots[pivotIdx + 1].t
    ) {
      pivotIdx++;
    }

    const p0 = pivots[pivotIdx];
    const p1 = pivots[pivotIdx + 1];

    const ratio =
      (currentTime - p0.t) / (p1.t - p0.t || 1); // avoid /0 for identical times
    const price = +(p0.p + ratio * (p1.p - p0.p)).toFixed(2);

    output.push({ price, time: currentTime });
  }

  // 4️⃣  Guarantee exact endpoints
  output[0].price = +startPrice.toFixed(2);
  output[output.length - 1].price = +endPrice.toFixed(2);

  return output;
}
