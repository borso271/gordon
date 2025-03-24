import supabase_client from "../../lib/supabaseClient.js";

async function fetchLatestPrice(symbol_id) {
  try {
    // Step 1: Check the most recent entry in intraday_data
    let { data: intradayData, error: intradayError } = await supabase_client
      .from("intraday_data")
      .select("price, timestamp")
      .eq("symbol_id", symbol_id)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (intradayError) {
      //console.error("❌ Error fetching intraday_data:", intradayError.message);
      return null;
    }

    // If intraday_data has data, return it
    if (intradayData.length > 0) {
      return {
        value: intradayData[0].price,
        timestamp: intradayData[0].timestamp,
      };
    }

    // Step 2: If no intraday data, check the most recent entry in historical_week
    let { data: historicalData, error: historicalError } = await supabase_client
      .from("historical_week")
      .select("close, timestamp")
      .eq("symbol_id", symbol_id)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (historicalError) {
      console.error("❌ Error fetching historical_week:", historicalError.message);
      return null;
    }

    // If historical_week has data, return it
    if (historicalData.length > 0) {
      return {
        value: historicalData[0].close,
        timestamp: historicalData[0].timestamp,
      };
    }

    // Step 3: If no data is found in both tables, return null
    console.warn(`⚠️ No price data found for symbol_id: ${symbol_id}`);
    return null;

  } catch (error) {
    console.error("❌ Unexpected error in fetchLatestPrice:", error.message);
    return null;
  }
}

export default fetchLatestPrice;
