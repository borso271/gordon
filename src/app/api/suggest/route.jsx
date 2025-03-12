import { NextResponse } from "next/server";

export async function POST(request) {
    
  try {
    const body = await request.json(); // ✅ Read asset_type from the request body
    // console.log("body is: ", body)
    const assetType = body.asset_type; // ✅ Extract asset_type

    let suggestions = [];

    if (assetType === "stock") {
        // console.log("asset type is stock")
      suggestions = [
        { symbol: "AAPL", asset_type: "stock", exchange_mic: "XNAS" },
        { symbol: "GOOG", asset_type: "stock", exchange_mic: "XNAS" },
        { symbol: "TSLA", asset_type: "stock", exchange_mic: "XNAS" },
        { symbol: "NVDA", asset_type: "stock", exchange_mic: "XNAS" },
        { symbol: "MSFT", asset_type: "stock", exchange_mic: "XNAS" },
        { symbol: "PLTR", asset_type: "stock", exchange_mic: "XNYS" },
      ];
    } else if (assetType === "crypto") {
      suggestions = [
        { symbol: "BTC", asset_type: "crypto", exchange_mic: "BINANCE" },
        { symbol: "ETH", asset_type: "crypto", exchange_mic: "BINANCE" },
        { symbol: "USDT", asset_type: "crypto", exchange_mic: "BINANCE" },
        { symbol: "BNB", asset_type: "crypto", exchange_mic: "BINANCE" },
        { symbol: "XRP", asset_type: "crypto", exchange_mic: "BINANCE" },
        { symbol: "SOL", asset_type: "crypto", exchange_mic: "BINANCE" },
      ];
    } else {
      return NextResponse.json(
        { error: "Invalid asset type. Must be 'stock' or 'crypto'." },
        { status: 400 }
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error in /api/suggest:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
