import { NextRequest, NextResponse } from "next/server";
import { fetchBuyingPower } from "../../../services/get_buying_power";

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();
    const result = await fetchBuyingPower(user_id);

    if (result.status === "failure") {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ cash: result.cash });
  } catch (err) {
    console.error("❌ Server error in fetch_buying_power:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
