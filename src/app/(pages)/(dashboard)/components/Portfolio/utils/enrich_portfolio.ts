import { PortfolioItem } from "../../../../../../interfaces";
export type PortfolioMetrics = PortfolioItem & {
  allocation: number | null; // % of total MV
  change: number | null;     // 1‑day % change
};

/**
 * Enrich each holding with:
 *  • allocation – share of portfolio market value (0‑100)
 *  • change     – daily % change based on last_close vs last_price
 */
export function enrichPortfolioWithMetrics(
  portfolio: PortfolioItem[]
): PortfolioMetrics[] {
  // 1️⃣ filter out rows with missing price or quantity
  const valid = portfolio.filter(
    (i) => i.quantity && i.last_price != null
  );

  // 2️⃣ total market value
  const totalMV = valid.reduce(
    (sum, i) => sum + i.quantity * (i.last_price ?? 0),
    0
  );

  // 3️⃣ map + compute metrics
  return portfolio.map((i) => {
    const mv     = i.quantity * (i.last_price ?? 0);
    const alloc  = totalMV > 0 ? +( (mv / totalMV) * 100 ).toFixed(2) : null;

    const change =
      i.last_close && i.last_price != null && i.last_close > 0
        ? +(
            ((i.last_price - i.last_close) / i.last_close) *
            100
          ).toFixed(2)
        : null;

    return { ...i, allocation: alloc, change };
  });
}
