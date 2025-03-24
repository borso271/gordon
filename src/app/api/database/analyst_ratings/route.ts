// src/app/api/database/analyst_ratings/route.ts
import { NextResponse } from "next/server";
import { getAnalystRatings } from "../../../../services/database/fetch_analyst_ratings";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symbol } = body;

    if (!symbol) {
      return NextResponse.json({ error: "Missing symbol in request body" }, { status: 400 });
    }

    const ratings = await getAnalystRatings(symbol);
    return NextResponse.json(ratings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
