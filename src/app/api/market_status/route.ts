/*

make a route here:

check last time it was checked, if not passed the 30 minutes, use that, else
refetch


use this endpoint:
https://polygon.io/docs/rest/stocks/market-operations/market-status

*/


import { NextRequest, NextResponse } from "next/server";

const POLYGON_API_KEY = process.env.POLYGON_API_KEY!;

const MIC_TO_EXCHANGE: Record<string, string> = {
  XNAS: "nasdaq",
  XNYS: "nyse",
  OTCM: "otc",
};

// In-memory cache { key: { data, fetchedAt } }
const marketStatusCache: Record<string, { isOpen: boolean; fetchedAt: string }> = {};

function isPastHalfOrFullHour(lastFetched: string): boolean {
  const now = new Date();
  const last = new Date(lastFetched);

  // Return true if the last fetch was before the most recent half-hour mark
  const roundedNow = new Date(now);
  const minutes = now.getMinutes();
  if (minutes >= 30) {
    roundedNow.setMinutes(30, 0, 0);
  } else {
    roundedNow.setMinutes(0, 0, 0);
  }

  return last < roundedNow;
}

export async function POST(req: NextRequest) {
  try {
    const { asset_type, exchange_mic } = await req.json();

    if (!asset_type) {
      return NextResponse.json({ error: "Missing asset_type" }, { status: 400 });
    }

    const cacheKey = `${asset_type}:${exchange_mic || "none"}`;
    const cached = marketStatusCache[cacheKey];

    if (cached && !isPastHalfOrFullHour(cached.fetchedAt)) {
      console.log("⚡ Using cached market status for", cacheKey);
      return NextResponse.json({ isOpen: cached.isOpen });
    }

    // 🔄 Fetch new data
    console.log("🌐 Fetching fresh market status from Polygon");
    const res = await fetch(`https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch market status from Polygon");

    const marketStatus = await res.json();

    let isOpen: boolean;

    if (asset_type === "crypto" || asset_type === "fx") {
      isOpen = marketStatus.currencies?.[asset_type] === "open";
    } else {
      const exchangeKey = MIC_TO_EXCHANGE[exchange_mic];
      if (!exchangeKey) {
        return NextResponse.json({ error: "Unsupported exchange_mic" }, { status: 400 });
      }

      const exchangeStatus = marketStatus.exchanges?.[exchangeKey];
      isOpen = exchangeStatus === "open" && !marketStatus.afterHours;
    }

    // 🧠 Save to in-memory cache
    marketStatusCache[cacheKey] = {
      isOpen,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json({ isOpen });

  } catch (err) {
    console.error("❌ Error checking market status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";

// const POLYGON_API_KEY = process.env.POLYGON_API_KEY!;

// const MIC_TO_EXCHANGE: Record<string, string> = {
//   XNAS: "nasdaq",
//   XNYS: "nyse",
//   OTCM: "otc",
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { asset_type, exchange_mic } = await req.json();

//     if (!asset_type) {
//       return NextResponse.json({ error: "Missing asset_type" }, { status: 400 });
//     }

//     const res = await fetch(`https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`);
//     if (!res.ok) {
//       throw new Error("Failed to fetch market status from Polygon");
//     }

//     const marketStatus = await res.json();

//     console.log(marketStatus)

//     // ✅ Crypto/FX
//     if (asset_type === "crypto" || asset_type === "fx") {
//       const isOpen = marketStatus.currencies?.[asset_type] === "open";
//       return NextResponse.json({ isOpen });
//     }

//     // ✅ Stocks
//     const exchangeKey = MIC_TO_EXCHANGE[exchange_mic];
//     if (!exchangeKey) {
//       return NextResponse.json({ error: "Unsupported exchange_mic" }, { status: 400 });
//     }

//     const exchangeStatus = marketStatus.exchanges?.[exchangeKey];
//     const isOpen = exchangeStatus === "open"; //|| exchangeStatus === "extended-hours"

//     return NextResponse.json({ isOpen });

//   } catch (err) {
//     console.error("❌ Error checking market status:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
