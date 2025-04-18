
import supabase_client from '../../lib/supabaseClient';

// const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const POLYGON_API_KEY="TNFcqz79eE0mHg0Br4sIgUVm8ESo1EBz"
import { TickerInput } from '../../interfaces';
// --- Helper function to generate demo data ---
function generateDemoData(tickerSymbol: string) {
  const lastClose = 100.00;
  const currentPrice = 101.00; // Represents a +1% change from lastClose

  console.warn(`⚠️ Using demo data for ticker: ${tickerSymbol}`);

  return {
    current_price: currentPrice,
    last_close: lastClose,
    day_high: 101.50, // Plausible high > current
    day_low: 99.80,   // Plausible low < last close
    open: 100.10,     // Plausible open near last close
    volume: 1000000,  // Plausible volume
    updated: Date.now(), // Use current timestamp for demo data
    ticker: tickerSymbol,
    isDemo: true, // Add a flag to easily identify demo data
  };
}

// --- Original transform function (assuming it's correct) ---
function transformPolygonData(data: any) {
  const t = data?.ticker;
  // Keep ticker check early, but allow generating demo data even if this fails
  if (!t) {
      console.warn("Transform failed: No 'ticker' object in Polygon response.");
      return null;
  };

//   const day = t.day || {};
//   const prevDay = t.prevDay || {};
//   const getValidValue = (
//     dayVal: number | null | undefined,
//     prevVal: number | null | undefined
//   ): number | null => {
//     return (dayVal && dayVal > 0) ? dayVal : (prevVal ?? null);
//   };

//   const transformed = {
//       current_price: getValidValue(day.c, prevDay.c),
//       last_close: prevDay.c ?? null,
//       day_high: getValidValue(day.h, prevDay.h),
//       day_low: getValidValue(day.l, prevDay.l),
//       open: getValidValue(day.o, prevDay.o),
//       volume: getValidValue(day.v, prevDay.v),
//       updated: t.updated ? Math.floor(t.updated / 1_000_000) : null, // Return null if missing
//       ticker: t.ticker,
//   };
const day     = t.day     ?? {};
const prevDay = t.prevDay ?? {};

/* Helper: use dayVal if > 0, otherwise prevVal (may still be null) */
const pickValid = (dayVal: number | null | undefined,
                   prevVal: number | null | undefined) =>
  dayVal && dayVal > 0 ? dayVal : prevVal ?? null;

/* ─── Current price & last‑close logic ─── */
const dayClose = day.c && day.c > 0 ? day.c : null;
const current_price =
  dayClose ?? (prevDay.c ?? null);              // fallback to prev close

const last_close =
  dayClose ? prevDay.c ?? null                  // market open → use prev close
           : prevDay.o ?? null;                 // market closed → use prev open

/* ─── Final transformed object ─── */
const transformed = {
  current_price,
  last_close,
  day_high:   pickValid(day.h, prevDay.h),
  day_low:    pickValid(day.l, prevDay.l),
  open:       pickValid(day.o, prevDay.o),
  volume:     pickValid(day.v, prevDay.v),
  updated:    t.updated ? Math.floor(t.updated / 1_000_000) : null,
  ticker:     t.ticker,
};

  // Check if essential price data is missing after transform
  if (transformed.current_price === null || transformed.last_close === null) {
      console.warn(`Transform incomplete for ${t.ticker}: Missing current or previous close.`);
      // Optionally return null here if essential data is missing,
      // forcing demo data generation later. Or return partial data.
      // Let's return partial for now, demo fallback happens later if needed.
  }

  return transformed;
}


// --- Original fetch function (assuming it's correct) ---
export async function fetchPolygonData(ticker: TickerInput): Promise<any> { // Added return type promise
  try {
    let url = '';
    const symbol = ticker.symbol.replace(/\./g, ''); // Sanitize symbol for URL if needed

    if (!symbol) {
      throw new Error(`Invalid symbol provided: ${ticker.symbol}`);
    }

    if (ticker.asset_type === 'stock' || ticker.asset_type === 'etf') {
      url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`;
    } else if (ticker.asset_type === 'crypto') {
      // Ensure crypto symbols are formatted correctly (e.g., X:BTCUSD)
      const cryptoSymbol = symbol.startsWith('X:') ? symbol : `X:${symbol}`;
      url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/${cryptoSymbol}?apiKey=${POLYGON_API_KEY}`;
    } else {
      throw new Error(`Unsupported asset_type: ${ticker.asset_type}`);
    }

    const res = await fetch(url);
    // Check for non-JSON responses (e.g., rate limits might return HTML or plain text)
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error(`❌ Polygon API non-JSON response for ${ticker.symbol}: Status ${res.status}`, text);
        throw new Error(`Polygon API returned non-JSON response: Status ${res.status}`);
    }

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ Polygon API error for ${ticker.symbol}: Status ${res.status}`, data);
      // Return an error structure instead of throwing, so savePolygonSnapshots can handle it
      return {
          error: true,
          status: res.status,
          message: `Polygon API failed: ${data?.error || data?.message || 'Unknown API error'}`,
          tickerSymbol: ticker.symbol // Include symbol for context
      };
    }

    // Add basic validation: check if 'ticker' object exists in successful response
    if (!data?.ticker) {
       console.warn(`⚠️ Polygon API success for ${ticker.symbol}, but response missing 'ticker' object.`);
       // Return structure indicating success but missing data
       return { warning: true, message: "Response missing 'ticker' data", tickerSymbol: ticker.symbol, rawData: data };
    }

    return data;
  } catch (err) {
    console.error(`❌ Network/fetch error for ${ticker.symbol}:`, err);
    // Return an error structure for network errors too
    return {
        error: true,
        message: err instanceof Error ? err.message : 'Unknown fetch error',
        tickerSymbol: ticker.symbol
    };
  }
}

// --- Updated savePolygonSnapshots ---
export async function savePolygonSnapshots(tickers: TickerInput[]) {
    const resultMap: Record<string, any> = {};

    for (const ticker of tickers) {
      let finalData: any = null; // Will hold the data to be returned/saved
      let polygon_data: any = null;

      try {
        polygon_data = await fetchPolygonData(ticker);


        // Check if fetchPolygonData returned an error structure
        if (polygon_data?.error) {
          console.warn(`Fetch error for ${ticker.symbol}: ${polygon_data.message}. Falling back to demo data.`);
          finalData = generateDemoData(ticker.symbol);
        } else {
          // Attempt to transform if fetch was okay (or had warnings but returned data)
          const transformed = transformPolygonData(polygon_data);

          if (transformed) {
            // Check if essential data is present after transformation
            if (transformed.current_price !== null && transformed.last_close !== null) {
               finalData = { ...transformed, updated: transformed.updated ?? Date.now() }; // Use real data, ensure timestamp
            } else {
               console.warn(`Incomplete transformed data for ${ticker.symbol}. Falling back to demo data.`);
               finalData = generateDemoData(ticker.symbol);
            }
          } else {
            // Transformation failed entirely
            console.warn(`Transformation failed for ${ticker.symbol}. Falling back to demo data.`);
            finalData = generateDemoData(ticker.symbol);
          }
        }
      } catch (err) {
        // Catch any unexpected errors during the process for this ticker
        console.error(`❌ Unexpected error processing ${ticker.symbol}:`, err);
        finalData = generateDemoData(ticker.symbol);
      }

      // --- Add to Result Map ---
      // Ensure ticker symbol matches the input, even for demo data
      finalData.ticker = ticker.symbol;
      resultMap[ticker.symbol] = finalData;

      // --- Optional: Database Upsert ---
      // Decide if you want to upsert demo data or just real data
      // Let's upsert EITHER real data OR only essential fields for demo data

      const dataToUpsert: any = {
        symbol_id: ticker.ticker_id,
        symbol: ticker.symbol,
        asset_type: ticker.asset_type,
        polygon_update: finalData.updated, // Always update the timestamp
      };

      if (!finalData.isDemo) {
          // If it's real data, include all transformed fields
          Object.assign(dataToUpsert, {
            latest_price: finalData.current_price,
             last_close: finalData.last_close,
             day_high: finalData.day_high,
             day_low: finalData.day_low,
             open: finalData.open,
             volume: finalData.volume,
             // Add any other fields from 'transformed' you want to save
          });
      } else {
           // If it's demo data, maybe only save price? Or nothing extra?
           // Example: Saving demo prices
           Object.assign(dataToUpsert, {
            latest_price: finalData.current_price,
               last_close: finalData.last_close,
               // Explicitly null out others if desired, or omit them
               // day_high: null, day_low: null, open: null, volume: null,
           });
           console.log(`Upserting minimal demo data for ${ticker.symbol}`);
      }

      // Perform the upsert
      const { error: upsertError } = await supabase_client
        .from('symbols_snapshot')
        .upsert(dataToUpsert, { onConflict: 'symbol_id' });

      if (upsertError) {
        console.error(`Supabase upsert error for ${ticker.symbol}:`, upsertError);
        // Optionally add upsert error info to the resultMap
        resultMap[ticker.symbol].upsertError = upsertError.message;
      }
      // --- End Upsert Logic ---
    }

    return resultMap;
  }


export async function fetchAndSavePolygonSnapshots(tickers: TickerInput[]) {
  return await savePolygonSnapshots(tickers);
}




// import { TickerInput } from '../../interfaces';

// function transformPolygonData(data: any) {
//     const t = data?.ticker;
//     if (!t) return null;
  
//     const day = t.day || {};
//     const prevDay = t.prevDay || {};
  
//     // Use day value if valid (> 0 or not null), otherwise fallback to prevDay
//     const getValidValue = (dayVal: number | null | undefined, prevVal: number | null | undefined) =>
//       dayVal != null && dayVal !== 0 ? dayVal : prevVal ?? null;
  
//     return {
//       current_price: getValidValue(day.c, prevDay.c),
//       last_close: prevDay.c ?? null, // Use prevDay close only
//       day_high: getValidValue(day.h, prevDay.h),
//       day_low: getValidValue(day.l, prevDay.l),
//       open: getValidValue(day.o, prevDay.o),
//       volume: getValidValue(day.v, prevDay.v),
//       updated: t.updated ? Math.floor(t.updated / 1_000_000) : Date.now(),
//       ticker: t.ticker,
//     };
//   }
  

// export async function fetchPolygonData(ticker: TickerInput) {
//   try {
//     let url = '';

//     if (ticker.asset_type === 'stock' || ticker.asset_type === 'etf') {
//       url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.symbol}?apiKey=${POLYGON_API_KEY}`;
//     } else if (ticker.asset_type === 'crypto') {
//       url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${ticker.symbol}?apiKey=${POLYGON_API_KEY}`;
//     } else {
//       throw new Error(`Unsupported asset_type: ${ticker.asset_type}`);
//     }

//     const res = await fetch(url);
//     const data = await res.json();

//     if (!res.ok) {
//       console.error(`❌ Polygon API error for ${ticker.symbol}:`, data);
//       throw new Error(
//         `Polygon API failed for ${ticker.symbol}: ${data?.error || data?.message || 'Unknown error'}`
//       );
//     }

//     return data;
//   } catch (err) {
//     console.error(`❌ Error fetching Polygon data for ${ticker.symbol}:`, err);
//     return { error: true, message: err instanceof Error ? err.message : 'Unknown error' };
//   }
// }

// export async function savePolygonSnapshots(tickers: TickerInput[]) {
//     const resultMap: Record<string, any> = {};
  
//     for (const ticker of tickers) {
//       const polygon_data = await fetchPolygonData(ticker);
//       const transformed = transformPolygonData(polygon_data);
  
//       // Always set a timestamp — fallback to now if missing
//       const updated = transformed?.updated ?? Date.now();
  
//       // Always try to upsert a minimal snapshot
//       const { error: upsertError } = await supabase_client
//         .from('symbols_snapshot')
//         .upsert(
//           {
//             symbol_id: ticker.ticker_id,
//             symbol: ticker.symbol,
//             asset_type: ticker.asset_type,
//             polygon_update: updated,
//             ...(transformed ?? {}) // includes valid fields only if available
//           },
//           { onConflict: 'symbol_id' }
//         );
  
//       if (!transformed || upsertError) {
//         resultMap[ticker.symbol] = {
//           error: true,
//           message: upsertError?.message || 'Failed to fetch or transform',
//           updated,
//         };
//       } else {
//         resultMap[ticker.symbol] = transformed;
//       }
//     }
  
//     return resultMap;
//   }
  
// export async function fetchAndSavePolygonSnapshots(tickers: TickerInput[]) {
//   return await savePolygonSnapshots(tickers);
// }

