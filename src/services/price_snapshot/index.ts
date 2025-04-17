// services/getOrUpdateSnapshot.ts
import supabase_client from "../../lib/supabaseClient";
import { fetchAndSavePolygonSnapshots } from "../polygon_snapshot";

import { TickerInput } from "../../interfaces";

const TEN_MINUTES = 1 * 60 * 1000;

export async function getOrUpdateSnapshot({
    symbol,
    asset_type,
    ticker_id
  }: TickerInput): Promise<{
    current_price: number | null;
    last_close: number | null;
    day_high: number | null;
    day_low: number | null;
    updated: number;
    ticker_id?: number;
  }> {
    const { data: snapshot } = await supabase_client
      .from("symbols_snapshot")
      .select("*")
      .eq("symbol_id", ticker_id)
      .single();
  
    const now = Date.now();
    const isFresh = snapshot?.polygon_update && now - snapshot.polygon_update < TEN_MINUTES;
  
    if (isFresh) {
      return {
        current_price: snapshot.latest_price ?? null,
        last_close: snapshot.last_close ?? null,
        day_high: snapshot.day_high ?? null,
        day_low: snapshot.day_low ?? null,
        updated: snapshot.polygon_update,
        ticker_id:ticker_id
      };
    }
  
    try {
      const updatedMap = await fetchAndSavePolygonSnapshots([{ symbol, asset_type, ticker_id }]);
      const freshData = updatedMap[symbol];
  
      if (!freshData || freshData.error) {
        console.warn(`⚠️ Polygon snapshot fallback for ${symbol}: ${freshData?.message}`);
        return {
          current_price: null,
          last_close: null,
          day_high: null,
          day_low: null,
          updated: Date.now(), // Still mark as updated,
          ticker_id:ticker_id
        };
      }
  
      return {
        current_price: freshData.current_price,
        last_close: freshData.last_close,
        day_high: freshData.day_high,
        day_low: freshData.day_low,
        updated: Date.now(),
        ticker_id:ticker_id
      };
    } catch (err) {
      console.error(`❌ getOrUpdateSnapshot failed for ${symbol}:`, err);
      return {
        current_price: null,
        last_close: null,
        day_high: null,
        day_low: null,
        updated: Date.now(),
        ticker_id:ticker_id
      };
    }
  }
  



// export async function getOrUpdateSnapshot({
//   symbol,
//   asset_type,
//   ticker_id
// }: TickerInput): Promise<any> {
//   const { data: snapshot, error } = await supabase_client
//     .from("symbols_snapshot")
//     .select("*")
//     .eq("symbol_id", ticker_id)
//     .single();

//   const now = Date.now();
//   const isFresh = snapshot?.polygon_update && now - snapshot.polygon_update < TEN_MINUTES;

//   if (isFresh) {
//     return {
//       ticker: snapshot.symbol,
//       current_price: snapshot.latest_price,
//       last_close: snapshot.last_close,
//       day_high: snapshot.day_high,
//       day_low: snapshot.day_low,
//       updated: snapshot.polygon_update
//     };
//   }

//   // Fetch new data and update DB
//   const updatedMap = await fetchAndSavePolygonSnapshots([{ symbol, asset_type, ticker_id }]);
//   const freshData = updatedMap[symbol];

//   if (!freshData || freshData.error) {
//     throw new Error(freshData?.message || "Polygon fetch failed");
//   }

//   return {
//     ...freshData,
//     updated: Date.now()
//   };
// }
