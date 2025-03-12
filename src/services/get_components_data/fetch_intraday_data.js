import supabase_client from "../../lib/supabaseClient.js";
import isMarketOpenNow from "../../utils/is_market_open_now.js";

async function fetchIntradayData(symbol, symbol_id, isMarketOpen) {
  try {
     
    let marketData = [];

    if (isMarketOpen) {
      // 🟢 Fetch intraday data if market is open
      const { data: intradayData, error: intradayError } = await supabase_client
        .from("intraday_data")
        .select("timestamp, price, volume")
        .eq("symbol_id", symbol_id)
        .order("timestamp", { ascending: true });

      if (intradayError) {
        console.error(`❌ Error fetching intraday data for ${symbol}:`, intradayError);
      } else if (intradayData.length > 0) {
       
        return intradayData.map((entry) => ({
          timestamp: entry.timestamp,
          price: parseFloat(entry.price),
          volume: entry.volume ?? 0,
        }));
      }
    }


return [];

  } catch (error) {
    console.error("🚨 Unexpected error fetching data:", error);
    return [];
  }
}

export default fetchIntradayData;

