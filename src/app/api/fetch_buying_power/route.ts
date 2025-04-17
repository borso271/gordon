import { NextRequest, NextResponse } from "next/server";
import supabase_client from "../../../lib/supabaseClient";
export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data, error } = await supabase_client
      .from("users")
      .select("cash")
      .eq("id", user_id)
      .single();

    if (error) {
      console.error("❌ Error fetching cash for user:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ cash: data.cash });
  } catch (err) {
    console.error("❌ Server error in fetch_buying_power:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
