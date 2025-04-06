import { NextRequest, NextResponse } from "next/server";
import { getUserWatchlist } from "../../../services/user_data/fetch_watchlist";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const watchlist = await getUserWatchlist(user_id);

    return NextResponse.json({ watchlist });
  } catch (error) {
    console.error("Error in /api/watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}
