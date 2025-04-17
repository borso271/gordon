import { NextRequest, NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      symbol_id,
      price,
      quantity,
      operation,
      user_id = "abc", // Default user
    } = body;

    if (!symbol_id || !price || !quantity || !operation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const signedQty = parseFloat(quantity);
    const signedPrice = parseFloat(price);
    const totalCost = signedQty * signedPrice;

    const { data: user, error: userError } = await supabase_client
      .from("users")
      .select("cash")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let newCash = user.cash;

    if (operation === "buy") {
      if (newCash < totalCost) {
        return NextResponse.json({ error: "Not enough cash" }, { status: 400 });
      }

      newCash -= totalCost;

      const { data: existing } = await supabase_client
        .from("portfolio")
        .select("*")
        .eq("user_id", user_id)
        .eq("symbol_id", symbol_id)
        .single();

      if (existing) {
        const newQuantity = parseFloat(existing.quantity) + signedQty;
        const newAvgPrice =
          ((parseFloat(existing.avg_price) * parseFloat(existing.quantity)) + totalCost) /
          newQuantity;

        await supabase_client.from("portfolio").update({
          quantity: newQuantity,
          avg_price: newAvgPrice,
          last_updated: new Date().toISOString()
        }).eq("user_id", user_id).eq("symbol_id", symbol_id);
      } else {
        await supabase_client.from("portfolio").insert({
          user_id,
          symbol_id,
          quantity: signedQty,
          avg_price: signedPrice,
          first_acquired: new Date().toISOString(),
        });
      }
    } else if (operation === "sell") {
      const { data: existing } = await supabase_client
        .from("portfolio")
        .select("*")
        .eq("user_id", user_id)
        .eq("symbol_id", symbol_id)
        .single();

      if (!existing || parseFloat(existing.quantity) < signedQty) {
        return NextResponse.json({ error: "Not enough shares to sell" }, { status: 400 });
      }

      const newQuantity = parseFloat(existing.quantity) - signedQty;

      if (newQuantity <= 0) {
        await supabase_client
          .from("portfolio")
          .delete()
          .eq("user_id", user_id)
          .eq("symbol_id", symbol_id);
      } else {
        await supabase_client.from("portfolio").update({
          quantity: newQuantity,
          last_updated: new Date().toISOString()
        }).eq("user_id", user_id).eq("symbol_id", symbol_id);
      }

      newCash += totalCost;
    } else {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    // ✅ Insert into transactions table
    const { error: insertTxError } = await supabase_client
      .from("transactions")
      .insert({
        user_id,
        symbol_id,
        transaction_type: operation,
        quantity: signedQty,
        price_per_unit: signedPrice,
        transaction_date: new Date().toISOString()
      });

    if (insertTxError) {
      console.error("❌ Failed to log transaction:", insertTxError);
      return NextResponse.json({ error: "Failed to log transaction" }, { status: 500 });
    }

    // ✅ Update user cash
    const { error: updateCashError } = await supabase_client
      .from("users")
      .update({ cash: newCash })
      .eq("id", user_id);

    if (updateCashError) {
      return NextResponse.json({ error: "Failed to update cash" }, { status: 500 });
    }

    return NextResponse.json({ message: "Order placed successfully", cash: newCash });

  } catch (err) {
    console.error("❌ Error placing order:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
