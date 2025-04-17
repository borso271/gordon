// app/api/tickers/insights/route.ts (Next.js 13+ with app router)
import { NextResponse } from "next/server";
import { fetchTickerDataWithInsightAndPolygon } from "../../../services/ticker_insight";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tickerIds } = body;

    if (!Array.isArray(tickerIds)) {
      return NextResponse.json({ error: "tickerIds must be an array" }, { status: 400 });
    }

    const results = await fetchTickerDataWithInsightAndPolygon(tickerIds);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
