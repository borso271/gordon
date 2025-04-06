import { NextRequest, NextResponse } from "next/server";
import supabase_client from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, symbol_id } = body;

  if (!user_id || !symbol_id) {
    return NextResponse.json({ error: "Missing user_id or symbol_id" }, { status: 400 });
  }

  const { error } = await supabase_client
    .from("watchlist")
    .insert([{ user_id, symbol_id }]);

  if (error) {
    console.error("Error adding to watchlist:", error.message);
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { user_id, symbol_id } = body;

  if (!user_id || !symbol_id) {
    return NextResponse.json({ error: "Missing user_id or symbol_id" }, { status: 400 });
  }

  const { error } = await supabase_client
    .from("watchlist")
    .delete()
    .match({ user_id, symbol_id });

  if (error) {
    console.error("Error removing from watchlist:", error.message);
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
