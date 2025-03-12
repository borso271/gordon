import supabase_client from "../../lib/supabaseClient.js";

async function fetchRecentHistoricalData(table, symbol_id, daysAgo) {
  try {
    // Step 1: Find the latest timestamp in the table
    const { data: latestEntry, error: latestError } = await supabase_client
      .from(table)
      .select("timestamp")
      .eq("symbol_id", symbol_id)
      .order("timestamp", { ascending: false })
      .limit(1); // Fetch the most recent entry

    if (latestError) {
      console.error(`❌ Error fetching latest timestamp from ${table}:`, latestError);
      return [];
    }

    if (!latestEntry || latestEntry.length === 0) {
      console.warn(`⚠️ No data found in ${table} for symbol_id: ${symbol_id}`);
      return [];
    }

    const latestTimestamp = latestEntry[0].timestamp;

    // Step 2: Compute the cutoff timestamp (N days before the latest entry)
    const cutoffTimestamp = latestTimestamp - daysAgo * 24 * 60 * 60 * 1000; // Convert days to ms

    // Step 3: Fetch all entries after the cutoff timestamp
    const { data, error } = await supabase_client
      .from(table)
      .select("timestamp, open, high, low, close, volume")
      .eq("symbol_id", symbol_id)
      .gte("timestamp", cutoffTimestamp) // Fetch only data after computed cutoff
      .order("timestamp", { ascending: true });

    if (error) {
      console.error(`❌ Error fetching ${table}:`, error);
      return [];
    }

    return data;
  } catch (error) {
    console.error(`❌ Unexpected error in fetchRecentHistoricalData(${table}):`, error);
    return [];
  }
}


async function fetchAllHistoricalData(tickerSymbol, symbol_id) {
  try {
   
    // Fetch data for each timeframe
   
// Fetch the latest 7 days, 1 month, 1 year, etc.
const [day_prices, week_prices, month_prices, year_prices, all_time_prices] = await Promise.all([
  fetchRecentHistoricalData("historical_week", symbol_id, 1),    // Last 7 days
  fetchRecentHistoricalData("historical_week", symbol_id, 7),    // Last 7 days
  fetchRecentHistoricalData("historical_month", symbol_id, 30),  // Last 30 days
  fetchRecentHistoricalData("historical_year", symbol_id, 365),  // Last 365 days
  fetchRecentHistoricalData("historical_five_years", symbol_id, 1825) // Last 5 years
]);




    // Step 4: Return the combined dataset
    return {
      ticker: tickerSymbol,
      symbol_id,
      day_prices,
      week_prices,
      month_prices,
      year_prices,
      all_time_prices
    };

  } catch (error) {
    console.error("❌ Unexpected error fetching chart data:", error);
    return null;
  }
}

export default fetchAllHistoricalData;


// async function fetchAllHistoricalData(tickerSymbol, symbol_id) {
//   try {
//     // Step 1: Get current date
//     const today = new Date();

//     // Step 2: Function to get past dates (returns a UNIX timestamp instead of a date string)
//     const getPastTimestamp = (years = 0, months = 0, days = 0) => {
//       const pastDate = new Date(today);
//       pastDate.setFullYear(today.getFullYear() - years);
//       pastDate.setMonth(today.getMonth() - months);
//       pastDate.setDate(today.getDate() - days);
//       return Math.floor(pastDate.getTime() / 1000); // Convert to UNIX timestamp (BIGINT)
//     };

//     // ✅ Convert past dates to UNIX timestamps
//     const last7Days = getPastTimestamp(0, 0, 7);
//     const last1Month = getPastTimestamp(0, 1, 0);
//     const last1Year = getPastTimestamp(1, 0, 0);
//     const last5Years = getPastTimestamp(5, 0, 0);

//     // Step 3: Fetch historical price data
//     const fetchHistoricalData = async (table, fromTimestamp) => {
//       const { data, error } = await supabase_client
//         .from(table)
//         .select("timestamp, open, high, low, close, volume")
//         .eq("symbol_id", symbol_id)
//         .gte("timestamp", fromTimestamp) // ✅ Now using UNIX timestamp
//         .order("timestamp", { ascending: true });

//       if (error) {
//         console.error(`❌ Error fetching ${table}:`, error);
//         return [];
//       }

//       return data;
//     };

//     // Fetch data for each timeframe
//     const [week_prices, month_prices, year_prices, all_time_prices] = await Promise.all([
//       fetchHistoricalData("historical_week", last7Days),
//       fetchHistoricalData("historical_month", last1Month),
//       fetchHistoricalData("historical_year", last1Year),
//       fetchHistoricalData("historical_five_years", last5Years)
//     ]);

//     // Step 4: Return the combined dataset
//     return {
//       ticker: tickerSymbol,
//       symbol_id,
//       week_prices,
//       month_prices,
//       year_prices,
//       all_time_prices
//     };

//   } catch (error) {
//     console.error("❌ Unexpected error fetching chart data:", error);
//     return null;
//   }
// }

// export default fetchAllHistoricalData;
