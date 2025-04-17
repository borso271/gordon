/*
here fetch how much a user owns of a given stock
*/

import { NextRequest, NextResponse } from "next/server";
import supabase_client from "../../../lib/supabaseClient";
export async function POST(req: NextRequest) {
  try {
    const { user_id, symbol_id } = await req.json();

    if (!user_id || !symbol_id) {
      return NextResponse.json({ error: "Missing user_id or symbol_id" }, { status: 400 });
    }

    const { data, error } = await supabase_client
      .from("portfolio")
      .select("quantity, avg_price")
      .eq("user_id", user_id)
      .eq("symbol_id", symbol_id)
      .single();

    if (error) {
      // If no row is found, assume 0 shares instead of returning an error
      if (error.code === "PGRST116") {
        return NextResponse.json({ quantity: 0, avg_price: null });
      }
      console.error("❌ Error fetching user shares:", error);
      return NextResponse.json({ error: "Failed to fetch user shares" }, { status: 500 });
    }

    return NextResponse.json({ quantity: data.quantity, avg_price: data.avg_price });
  } catch (err) {
    console.error("❌ Server error in fetch_user_shares:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
