import { NextRequest, NextResponse } from "next/server";

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

import supabase_client from "../../../lib/supabaseClient";
import { TickerInput } from "../../../interfaces";

// type PolygonSnapshotData = {
//   symbol: string;
//   asset_type: "stock" | "crypto" | "etf";
//   polygon_data: {
//     ticker: {
//       ticker: string;
//       todaysChangePerc: number;
//       todaysChange: number;
//       updated: number;
//       day: {
//         o: number;
//         h: number;
//         l: number;
//         c: number;
//         v: number;
//         vw: number;
//       };
//       prevDay: {
//         o: number;
//         h: number;
//         l: number;
//         c: number;
//         v: number;
//         vw: number;
//       };
//     };
//     status: string;
//     request_id: string;
//   };
// };

// type TransformedData = {
//   current_price: number;
//   percentage_change: number;
//   last_close: number;
//   day_high: number;
//   day_low: number;
//   updated: number;
//   ticker: string;
// };

function transformPolygonData(data: any) {
  const t = data?.ticker;
  if (!t || !t.day || !t.prevDay) return null;

  return {
    current_price: t.day.c,
    last_close: t.prevDay.c,
    day_high: t.day.h,
    day_low: t.day.l,
    updated: t.updated,
    ticker: t.ticker,
  };
}


async function fetchPolygonData(ticker: TickerInput) {
  try {
    let url = "";

    if (ticker.asset_type === "stock" || ticker.asset_type === "etf") {
      url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.symbol}?apiKey=${POLYGON_API_KEY}`;
    } else if (ticker.asset_type === "crypto") {
      url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${ticker.symbol}?apiKey=${POLYGON_API_KEY}`;
    } else {
      throw new Error(`Unsupported asset_type: ${ticker.asset_type}`);
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ Polygon API error for ${ticker.symbol}:`, data);
      throw new Error(
        `Polygon API failed for ${ticker.symbol}: ${data?.error || data?.message || "Unknown error"}`
      );
    }

    return data;
  } catch (err) {
    console.error(`❌ Error fetching Polygon data for ${ticker.symbol}:`, err);
    return { error: true, message: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: TickerInput[] = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid input format." }, { status: 400 });
    }

    const resultMap: Record<string, any> = {};

    for (const ticker of body) {
      const polygon_data = await fetchPolygonData(ticker);
      const transformed = transformPolygonData(polygon_data);

      if (!transformed) {
        resultMap[ticker.symbol] = { error: true, message: "Failed to fetch or transform" };
        continue;
      }

      const { current_price, last_close, day_high, day_low, updated } = transformed;

      const { error: upsertError } = await supabase_client
        .from("symbols_snapshot")
        .upsert(
          {
            symbol_id: ticker.ticker_id,
            symbol: ticker.symbol,
            asset_type: ticker.asset_type,
            last_close:last_close,
            latest_price: current_price,
            polygon_update: updated,
            day_low: day_low,
            day_high: day_high,
          },
          { onConflict: "symbol_id" }
        );

      if (upsertError) {
        console.error(`❌ Error upserting symbol snapshot for ${ticker.symbol}:`, upsertError);
        resultMap[ticker.symbol] = { error: true, message: upsertError.message };
      } else {
        resultMap[ticker.symbol] = transformed;
      }
    }

    return NextResponse.json(resultMap);
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


/*

https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD?apiKey=TNFcqz79eE0mHg0Br4sIgUVm8ESo1EBz
https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD?apiKey=YOUR_API_KEY


sample response for this endpoint is:
{
  "request_id": "ad92e92ce183112c593717f00dfebd2c",
  "status": "OK",
  "ticker": {
    "day": {
      "c": 16260.85,
      "h": 16428.4,
      "l": 15830.4,
      "o": 16418.07,
      "v": 105008.84231068,
      "vw": 0
    },
    "lastTrade": {
      "c": [
        2
      ],
      "i": "464569520",
      "p": 16242.31,
      "s": 0.001933,
      "t": 1605294230780,
      "x": 4
    },
    "min": {
      "c": 16235.1,
      "h": 16264.29,
      "l": 16129.3,
      "n": 558,
      "o": 16257.51,
      "t": 1684428960000,
      "v": 19.30791925,
      "vw": 0
    },
    "prevDay": {
      "c": 16399.24,
      "h": 16418.07,
      "l": 16399.24,
      "o": 16418.07,
      "v": 0.99167108,
      "vw": 16402.6893
    },
    "ticker": "X:BTCUSD",
    "todaysChange": -156.93,
    "todaysChangePerc": -0.956935,
    "updated": 1605330008999
  }
}
  */