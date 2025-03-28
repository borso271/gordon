import supabase_client from "../../lib/supabaseClient";


// fill the table with the data
// write the sectorsMap so that it is effective...
//


const sectorsMap = {
    technology: "Technology",
    finance: "Finance",
    healthcare: "Healthcare",
    energy: "Energy",
    consumer: "Consumer",
    utilities: "Utilities",
    real_estate: "Real Estate",
    industrials: "Industrials",
    materials: "Materials",
    communication: "Communication"
  };
  
  export async function fetchSymbolSnapshots(asset_type, sectors = []) {
    const INDEX_FILTER = ['SP500', 'vanguard_etf', 'top_cryptos'];
    const results = [];
  
    try {
      const dbSectors = sectors.map(s => sectorsMap[s]).filter(Boolean);
  

      console.log(`🔍 Starting fetchSymbolSnapshots`);
      console.log(`📦 asset_type: ${asset_type}`);
      console.log(`📦 sectors: ${JSON.stringify(dbSectors)}`);
      console.log(`🔎 Filtering indexes by: ${INDEX_FILTER.join(', ')}`);
  
      // 1. Fetch all symbols matching criteria
      const { data: symbols, error: symbolError } = await supabase_client
        .from('symbols')
        .select('id, ticker, name, sector, asset_type, indexes')
        .eq('asset_type', asset_type)
        .in('sector', dbSectors)
        .or('indexes.cs.{SP500},indexes.cs.{vanguard_etf},indexes.cs.{top_cryptos}');
  
      if (symbolError) throw new Error(`❌ Symbol fetch error: ${symbolError.message}`);
  
      console.log(`✅ Retrieved ${symbols?.length ?? 0} symbols`);
  
      for (const symbol of symbols) {
        const { id: symbol_id, ticker, name, asset_type } = symbol;
        console.log(`\n🔄 Processing symbol: ${ticker} (id: ${symbol_id})`);
  
        // 2. Fetch latest price and volume from historical_week
        // 1. Try to fetch latest price from historical_week
const { data: latestWeek, error: weekError } = await supabase_client
.from('historical_week')
.select('close, volume, timestamp')
.eq('symbol_id', symbol_id)
.order('timestamp', { ascending: false })
.limit(1)
.maybeSingle();

if (weekError) {
throw new Error(`❌ Week data error for ${ticker}: ${weekError.message}`);
}

let price = latestWeek?.close || null;
let latestVolume = latestWeek?.volume || null;

if (!latestWeek || price === null) {
console.warn(`⚠️ No valid weekly price found for ${ticker}, falling back to yearly...`);

const { data: fallbackYear, error: fallbackYearError } = await supabase_client
  .from('historical_year')
  .select('close, volume, timestamp')
  .eq('symbol_id', symbol_id)
  .order('timestamp', { ascending: false })
  .limit(1)
  .maybeSingle();

if (fallbackYearError) {
  console.error(`❌ Fallback year data error for ${ticker}: ${fallbackYearError.message}`);
}

if (fallbackYear) {
  price = fallbackYear.close || null;
  latestVolume = fallbackYear.volume || latestVolume;
  console.log(`📆 Fallback price: ${price}, volume: ${latestVolume}`);
}
}

console.log(`📈 Final price: ${price}, volume: ${latestVolume}`);

        // const { data: latestWeek, error: weekError } = await supabase_client
        //   .from('historical_week')
        //   .select('close, volume, timestamp')
        //   .eq('symbol_id', symbol_id)
        //   .order('timestamp', { ascending: false })
        //   .limit(1)
        //   .maybeSingle();
  
        // if (weekError) throw new Error(`❌ Week data error for ${ticker}: ${weekError.message}`);
        // if (!latestWeek) {
        //   console.warn(`⚠️ No weekly data found for ${ticker}`);
        // }
  
        // const price = latestWeek?.close || null;
        // const latestVolume = latestWeek?.volume || null;
        // console.log(`📈 Latest price: ${price}, volume: ${latestVolume}`);
  
        // 3. Fetch earliest and latest entries from historical_year
        const { data: yearly, error: yearError } = await supabase_client
          .from('historical_year')
          .select('timestamp, close, volume')
          .eq('symbol_id', symbol_id)
          .order('timestamp', { ascending: true });
  
        if (yearError) throw new Error(`❌ Year data error for ${ticker}: ${yearError.message}`);
        if (!yearly || yearly.length < 2) {
          console.warn(`⚠️ Not enough yearly data for ${ticker}`);
        }
  
        const earliest = yearly?.[0];
        const latest = yearly?.[yearly.length - 1];
  
        const ytd_return = (earliest && latest && earliest.close)
          ? ((latest.close - earliest.close) / earliest.close) * 100
          : null;
  
        if (earliest && latest) {
          console.log(`📊 YTD range: ${earliest.close} → ${latest.close}`);
          console.log(`📊 YTD return: ${ytd_return?.toFixed(2)}%`);
        }
  
        results.push({
          ticker,
          name,
          asset_type,
          price,
          volume: latestVolume,
          ytd_return,
        });
      }
  
      console.log(`✅ Finished processing all symbols.`);
      return results;
    } catch (err) {
      console.error('❌ Error in fetchSymbolSnapshots:', err.message);
      return [];
    }
  }
  
// export async function fetchSymbolSnapshots(asset_type, sectors = []) {
//   const INDEX_FILTER = ['SP500', 'vanguard_etf', 'top_cryptos'];
//   const results = [];

//   try {
//     // 1. Fetch all symbols matching criteria
//     const { data: symbols, error: symbolError } = await supabase_client
//       .from('symbols')
//       .select('id, ticker, name, sector, asset_type, indexes')
//       .eq('asset_type', asset_type)
//       .in('sector', sectors)
//       .or('indexes.cs.{SP500},indexes.cs.{vanguard_etf},indexes.cs.{top_cryptos}');

//     if (symbolError) throw new Error(`Symbol fetch error: ${symbolError.message}`);

//     for (const symbol of symbols) {
//       const { id: symbol_id, ticker, name, asset_type } = symbol;

//       // 2. Fetch latest price and volume from historical_week
//       const { data: latestWeek, error: weekError } = await supabase_client
//         .from('historical_week')
//         .select('close, volume')
//         .eq('symbol_id', symbol_id)
//         .order('timestamp', { ascending: false })
//         .limit(1)
//         .maybeSingle();

//       if (weekError) throw new Error(`Week data error for ${ticker}: ${weekError.message}`);

//       const price = latestWeek?.close || null;

//       // 3. Fetch earliest and latest entries from historical_year for YTD return
//       const { data: yearly, error: yearError } = await supabase_client
//         .from('historical_year')
//         .select('timestamp, close, volume')
//         .eq('symbol_id', symbol_id)
//         .order('timestamp', { ascending: true });

//       if (yearError) throw new Error(`Year data error for ${ticker}: ${yearError.message}`);

//       const earliest = yearly?.[0];
//       const latest = yearly?.[yearly.length - 1];

//       const ytd_return = (earliest && latest && earliest.close)
//         ? ((latest.close - earliest.close) / earliest.close) * 100
//         : null;

//       const volume = latest?.volume || null;

//       results.push({
//         ticker,
//         name,
//         asset_type,
//         price,
//         volume,
//         ytd_return
//       });
//     }

//     return results;
//   } catch (err) {
//     console.error('❌ Error in fetchSymbolSnapshots:', err.message);
//     return [];
//   }
// }

