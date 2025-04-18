type AssetType = string;

interface TickerSnapshot {
  Ticker: string;
  currentPrice: number;
  low: number;
  high: number;
  open: number;
  volume: number;
  prevClose: number;
}

const POLYGON_API_KEY = "TNFcqz79eE0mHg0Br4sIgUVm8ESo1EBz";

export async function fetchTickerSnapshot(
  ticker: string,
  asset_type: AssetType
): Promise<TickerSnapshot> {
  try {
    let url = "";

    if (asset_type === "stock" || asset_type === "etf") {
      url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`;
    } else if (asset_type === "crypto") {
      url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${ticker}?apiKey=${POLYGON_API_KEY}`;
    } else {
      throw new Error(`Unsupported asset type: ${asset_type}`);
    }

    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok || !json?.ticker) {
      throw new Error("Invalid response from Polygon");
    }

    const t = json.ticker;
    const day = t.day ?? {};
    const prevDay = t.prevDay ?? {};

    const isDayDataUsable = day.c && day.c > 0;

    const currentPrice = isDayDataUsable ? day.c : prevDay.c ?? 0;
    const high = isDayDataUsable ? day.h : prevDay.h ?? 0;
    const low = isDayDataUsable ? day.l : prevDay.l ?? 0;
    const open = isDayDataUsable ? day.o : prevDay.o ?? 0;
    const volume = isDayDataUsable ? day.v : prevDay.v ?? 0;
    const prevClose = prevDay.c ?? 0;

    return {
      Ticker: t.ticker,
      currentPrice,
      low,
      high,
      open,
      volume,
      prevClose,
    };
  } catch (error) {
    console.warn(`⚠️ Snapshot fetch failed for ${ticker}:`, error);

    // Return fallback object with all zero values
    return {
      Ticker: ticker,
      currentPrice: 0,
      low: 0,
      high: 0,
      open: 0,
      volume: 0,
      prevClose: 0,
    };
  }
}

// type AssetType = string;

// interface TickerSnapshot {
//   Ticker: string;
//   currentPrice: number | null;
//   low: number | null;
//   high: number | null;
//   open: number | null;
//   volume: number | null;
//   prevClose: number | null;
// }

// const POLYGON_API_KEY = "TNFcqz79eE0mHg0Br4sIgUVm8ESo1EBz";

// export async function fetchTickerSnapshot(ticker: string, asset_type: AssetType): Promise<TickerSnapshot | null> {
//   try {
//     let url = "";

//     if (asset_type === "stock" || asset_type === "etf") {
//       url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`;
//     } else if (asset_type === "crypto") {
//       url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${ticker}?apiKey=${POLYGON_API_KEY}`;
//     } else {
//       throw new Error(`Unsupported asset type: ${asset_type}`);
//     }

//     const res = await fetch(url);
//     const json = await res.json();

//     if (!res.ok || !json?.ticker) {
//       console.error("❌ Invalid response from Polygon:", json);
//       return null;
//     }

//     const t = json.ticker;
//     const day = t.day ?? {};
//     const prevDay = t.prevDay ?? {};

//     const isDayDataUsable = day.c && day.c > 0;

//     const currentPrice = isDayDataUsable ? day.c : prevDay.c ?? null;
//     const high = isDayDataUsable ? day.h : prevDay.h ?? null;
//     const low = isDayDataUsable ? day.l : prevDay.l ?? null;
//     const open = isDayDataUsable ? day.o : prevDay.o ?? null;
//     const volume = isDayDataUsable ? day.v : prevDay.v ?? null;
//     const prevClose = prevDay.c ?? null;

//     return {
//       Ticker: t.ticker,
//       currentPrice,
//       low,
//       high,
//       open,
//       volume,
//       prevClose,
//     };
//   } catch (error) {
//     console.error("❌ Failed to fetch ticker snapshot:", error);
//     return null;
//   }
// }
