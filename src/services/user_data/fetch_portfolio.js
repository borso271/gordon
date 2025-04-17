import supabase_client from "../../lib/supabaseClient";
import fetchLatestPrice from "../database/fetch_latest_price";

// Assuming your generated types are in './database.types.ts'
// import { Database } from './database.types'; // Uncomment if using generated types

export async function getUserPortfolio(userId) {
  const { data, error } = await supabase_client
    .from("portfolio")
    .select(`
      symbol_id,
      quantity,
      avg_price,
      first_acquired,
      last_updated,
      created_at,
      symbols (
        id,
        ticker,
        name,
        currency,
        asset_type,
        symbols_snapshot (
          last_close
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching portfolio:", error.message);
    throw new Error("Could not fetch portfolio");
  }

  // Step 1: Normalize base portfolio
  const basePortfolio = data.map((item) => {
    const last_close = item.symbols?.symbols_snapshot?.last_close ?? null;

    return {
      symbol_id: item.symbols?.id ?? null,
      ticker: item.symbols?.ticker ?? null,
      name: item.symbols?.name ?? null,
      currency: item.symbols?.currency ?? null,
      asset_type: item.symbols?.asset_type ?? null,
      quantity: Number(item.quantity),
      avg_price: Number(item.avg_price),
      last_close: last_close !== null ? Number(last_close) : null,
      first_acquired: item.first_acquired ?? null,
      last_updated: item.last_updated,
      created_at: item.created_at,
      pnl: null // to be filled below
    };
  });

  // Step 2: Enrich with latest price and PnL
  const enrichedPortfolio = await Promise.all(
    basePortfolio.map(async (item) => {
      const latestPriceData = item.symbol_id
        ? await fetchLatestPrice(item.symbol_id)
        : null;

      const last_price = latestPriceData?.value ?? null;
      const pnl =
        last_price !== null
          ? Number(((last_price - item.avg_price) * item.quantity).toFixed(2))
          : null;

      return {
        ...item,
        last_price,
        last_price_timestamp: latestPriceData?.timestamp ?? null,
        pnl,
      };
    })
  );

  return enrichedPortfolio;
}
