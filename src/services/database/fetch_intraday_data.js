import supabase_client from "../../lib/supabaseClient.js";

async function fetchIntradayData(symbol, symbol_id, isMarketOpen) {
  // console.log(`📈 fetchIntradayData START — symbol: ${symbol}, symbol_id: ${symbol_id}, isMarketOpen: ${isMarketOpen}`);

  try {
    let marketData = [];

    if (isMarketOpen) {
      // console.log(`🟢 Market is open — querying intraday_data for symbol_id: ${symbol_id}`);

      const { data: intradayData, error: intradayError } = await supabase_client
        .from("intraday_data")
        .select("timestamp, price, volume")
        .eq("symbol_id", symbol_id)
        .order("timestamp", { ascending: true });

      if (intradayError) {
        console.error(`❌ Supabase error fetching intraday data for ${symbol}:`, intradayError);
      } else {
        // console.log(`✅ Fetched ${intradayData.length} intraday records for ${symbol}`);

        if (intradayData.length > 0) {
          const mappedData = intradayData.map((entry) => ({
            timestamp: entry.timestamp,
            price: parseFloat(entry.price),
            volume: entry.volume ?? 0,
          }));

          console.log("🧠 Mapped intraday data sample:", mappedData[0] || "No data");

          return mappedData;
        } else {
          console.warn(`⚠️ No intraday data found for ${symbol}`);
        }
      }
    } else {
     // console.log("🔴 Market is closed — skipping intraday fetch.");
    }

    //console.log(`🔚 Returning empty intraday data array for ${symbol}`);
    return [];

  } catch (error) {
    console.error("🚨 Unexpected error fetching intraday data:", error);
    return [];
  }
}

export default fetchIntradayData;

// async function fetchIntradayData(symbol, symbol_id, isMarketOpen) {
//   try {
     
//     let marketData = [];
  
//     if (isMarketOpen) {
//       // 🟢 Fetch intraday data if market is open
//       const { data: intradayData, error: intradayError } = await supabase_client
//         .from("intraday_data")
//         .select("timestamp, price, volume")
//         .eq("symbol_id", symbol_id)
//         .order("timestamp", { ascending: true });

//       if (intradayError) {
//         console.error(`❌ Error fetching intraday data for ${symbol}:`, intradayError);
//       } else if (intradayData.length > 0) {
       
//         return intradayData.map((entry) => ({
//           timestamp: entry.timestamp,
//           price: parseFloat(entry.price),
//           volume: entry.volume ?? 0,
//         }));
//       }
//     }


// return [];

//   } catch (error) {
//     console.error("🚨 Unexpected error fetching data:", error);
//     return [];
//   }
// }

// export default fetchIntradayData;

