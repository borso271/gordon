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

export async function POST(req: NextRequest) {
  try {
    const { asset_type, exchange_mic } = await req.json();

    if (!asset_type) {
      return NextResponse.json({ error: "Missing asset_type" }, { status: 400 });
    }

    const res = await fetch(`https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`);
    if (!res.ok) {
      throw new Error("Failed to fetch market status from Polygon");
    }

    const marketStatus = await res.json();

    // ✅ Crypto/FX
    if (asset_type === "crypto" || asset_type === "fx") {
      const isOpen = marketStatus.currencies?.[asset_type] === "open";
      return NextResponse.json({ isOpen });
    }

    // ✅ Stocks
    const exchangeKey = MIC_TO_EXCHANGE[exchange_mic];
    if (!exchangeKey) {
      return NextResponse.json({ error: "Unsupported exchange_mic" }, { status: 400 });
    }

    const exchangeStatus = marketStatus.exchanges?.[exchangeKey];
    const isOpen = exchangeStatus === "open" || exchangeStatus === "extended-hours";

    return NextResponse.json({ isOpen });

  } catch (err) {
    console.error("❌ Error checking market status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
