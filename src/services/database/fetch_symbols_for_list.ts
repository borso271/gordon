import supabase_client from "../../lib/supabaseClient";


// fill the table with the data
// write the sectorsMap so that it is effective...
//

const sectorsMap = {
    technology: "Information Technology",
    finance: "Financials",
    healthcare: "Health Care",
    energy: "Energy",
    consumer: "Consumer Staples",
    utilities: "Utilities",
    real_estate: "Real Estate",
    industrials: "Industrials",
    materials: "Materials",
    communication: "Communication Services"
  };
  
  export async function fetchSymbolSnapshots(asset_type, sectors = []) {
    const INDEX_FILTER = ['SP500', 'vanguard_etf', 'top_cryptos'];
    const results = [];
  
    try {
      const dbSectors = sectors.map(s => sectorsMap[s]).filter(Boolean);
  
      // 1. Fetch all symbols matching criteria — limited to 50
      const { data: symbols, error: symbolError } = await supabase_client
        .from('symbols')
        .select('id, ticker, name, sector, asset_type, indexes')
        .eq('asset_type', asset_type)
        .in('sector', dbSectors)
        .or('indexes.cs.{SP500},indexes.cs.{vanguard_etf},indexes.cs.{top_cryptos}')
        .limit(50);
  
      if (symbolError) throw new Error(`❌ Symbol fetch error: ${symbolError.message}`);
  
      console.log(`✅ Retrieved ${symbols?.length ?? 0} symbols`);
  
      for (const symbol of symbols) {
        const { id: symbol_id, ticker, name, asset_type } = symbol;
  
        // 2. Fetch earliest and latest entries from historical_year only
        const { data: yearly, error: yearError } = await supabase_client
          .from('historical_year')
          .select('timestamp, close, volume')
          .eq('symbol_id', symbol_id)
          .order('timestamp', { ascending: true });
  
        if (yearError) {
          console.error(`❌ Year data error for ${ticker}: ${yearError.message}`);
          continue;
        }
  
        if (!yearly || yearly.length < 2) {
          console.warn(`⚠️ Not enough yearly data for ${ticker}`);
          continue;
        }
  
        const earliest = yearly[0];
        const latest = yearly[yearly.length - 1];
  
        const price = latest.close ?? null;
        const latestVolume = latest.volume ?? null;
  
        const ytd_return = (earliest.close && latest.close)
          ? ((latest.close - earliest.close) / earliest.close) * 100
          : null;
  
        results.push({
          symbol_id,
          ticker,
          name,
          asset_type,
          price,
          volume: latestVolume,
          ytd_return,
        });
      }
  
      console.log(`✅ Finished processing ${results.length} symbols.`);
      return results;
    } catch (err) {
      console.error('❌ Error in fetchSymbolSnapshots:', err.message);
      return [];
    }
  }
  
//   export async function fetchSymbolSnapshots(asset_type, sectors = []) {
//     const INDEX_FILTER = ['SP500', 'vanguard_etf', 'top_cryptos'];
//     const results = [];
  
//     try {
//       const dbSectors = sectors.map(s => sectorsMap[s]).filter(Boolean);
  
  
//       // 1. Fetch all symbols matching criteria
//       const { data: symbols, error: symbolError } = await supabase_client
//         .from('symbols')
//         .select('id, ticker, name, sector, asset_type, indexes')
//         .eq('asset_type', asset_type)
//         .in('sector', dbSectors)
//         .or('indexes.cs.{SP500},indexes.cs.{vanguard_etf},indexes.cs.{top_cryptos}');
  
//       if (symbolError) throw new Error(`❌ Symbol fetch error: ${symbolError.message}`);
  
//       console.log(`✅ Retrieved ${symbols?.length ?? 0} symbols`);
  
//       for (const symbol of symbols) {
//         const { id: symbol_id, ticker, name, asset_type } = symbol;
 
// const { data: latestWeek, error: weekError } = await supabase_client
// .from('historical_week')
// .select('close, volume, timestamp')
// .eq('symbol_id', symbol_id)
// .order('timestamp', { ascending: false })
// .limit(1)
// .maybeSingle();

// if (weekError) {
// throw new Error(`❌ Week data error for ${ticker}: ${weekError.message}`);
// }

// let price = latestWeek?.close || null;
// let latestVolume = latestWeek?.volume || null;

// if (!latestWeek || price === null) {
// console.warn(`⚠️ No valid weekly price found for ${ticker}, falling back to yearly...`);

// const { data: fallbackYear, error: fallbackYearError } = await supabase_client
//   .from('historical_year')
//   .select('close, volume, timestamp')
//   .eq('symbol_id', symbol_id)
//   .order('timestamp', { ascending: false })
//   .limit(1)
//   .maybeSingle();

// if (fallbackYearError) {
//   console.error(`❌ Fallback year data error for ${ticker}: ${fallbackYearError.message}`);
// }

// if (fallbackYear) {
//   price = fallbackYear.close || null;
//   latestVolume = fallbackYear.volume || latestVolume;
//   console.log(`📆 Fallback price: ${price}, volume: ${latestVolume}`);
// }
// }
//         // 3. Fetch earliest and latest entries from historical_year
//         const { data: yearly, error: yearError } = await supabase_client
//           .from('historical_year')
//           .select('timestamp, close, volume')
//           .eq('symbol_id', symbol_id)
//           .order('timestamp', { ascending: true });
  
//         if (yearError) throw new Error(`❌ Year data error for ${ticker}: ${yearError.message}`);
//         if (!yearly || yearly.length < 2) {
//           console.warn(`⚠️ Not enough yearly data for ${ticker}`);
//         }
  
//         const earliest = yearly?.[0];
//         const latest = yearly?.[yearly.length - 1];
  
//         const ytd_return = (earliest && latest && earliest.close)
//           ? ((latest.close - earliest.close) / earliest.close) * 100
//           : null;
  
//         if (earliest && latest) {
//           console.log(`📊 YTD range: ${earliest.close} → ${latest.close}`);
//           console.log(`📊 YTD return: ${ytd_return?.toFixed(2)}%`);
//         }
  
//         results.push({
//           symbol_id: symbol.id,
//           ticker,
//           name,
//           asset_type,
//           price,
//           volume: latestVolume,
//           ytd_return,
//         });
//       }
  
//       console.log(`✅ Finished processing all symbols.`);
//       return results;
//     } catch (err) {
//       console.error('❌ Error in fetchSymbolSnapshots:', err.message);
//       return [];
//     }
//   }
  