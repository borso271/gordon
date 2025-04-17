import { fetchUserPortfolioFlat } from './fetch_portfolio_flat';
import { getOrUpdateSnapshot } from '../price_snapshot';
import { TickerInput } from '../../interfaces'; // Now actually used

type EnrichedPortfolioEntry = Awaited<ReturnType<typeof fetchUserPortfolioFlat>>[number] & {
  current_price: number;
  last_close: number;
  day_high: number;
  day_low: number;
  updated: number;
};

export async function fetchUserPortfolioWithPrices(userId: string): Promise<EnrichedPortfolioEntry[]> {
  const portfolio = await fetchUserPortfolioFlat(userId);

  const enriched = await Promise.all(
    portfolio.map(async (entry) => {
      const snapshot = await getOrUpdateSnapshot({
        symbol: entry.ticker,
        asset_type: entry.asset_type as TickerInput['asset_type'], // 🔥 ensures correct type
        ticker_id: entry.symbol_id,
      });

      const change = (
        snapshot.current_price != null &&
        entry.avg_price != null &&
        entry.avg_price !== 0
      )
        ? ((snapshot.current_price / entry.avg_price) - 1) * 100
        : null;
      
      return {
        ...entry,
        current_price: snapshot.current_price,
        last_close: snapshot.last_close,
        day_high: snapshot.day_high,
        day_low: snapshot.day_low,
        change:change,
        updated: snapshot.updated,
      };
    })
  );

  return enriched;
}


// list = [{
// symbol_id: entry.symbol_id,
// quantity: parseFloat(entry.quantity.toString()),
// avg_price: parseFloat(entry.avg_price.toString()),
// first_acquired: entry.first_acquired,
// last_updated: entry.last_updated,
// created_at: entry.created_at,
// ticker: entry.symbols?.ticker ?? "",
// name: entry.symbols?.name ?? "",
// asset_type: entry.symbols?.asset_type ?? "",
// sector: entry.symbols?.sector ?? "",
// exchange_mic: entry.symbols?.exchange_mic ?? "",
// current_price: snapshot.current_price,
// change:change,
// last_close: snapshot.last_close,
// day_high: snapshot.day_high,
// day_low: snapshot.day_low,

// updated: snapshot.updated }, etc.]
