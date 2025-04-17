import supabase_client from "../../../lib/supabaseClient";
type BuyStockInput = {
  user_id: string;
  symbol_id: number;
  price: number;
  quantity: number;
};

export async function buy({ user_id, symbol_id, price, quantity }: BuyStockInput): Promise<void> {
  // Fetch current portfolio entry for this stock
  const { data: existingEntry, error: fetchError } = await supabase_client
    .from("portfolio")
    .select("id, quantity, avg_price, first_acquired")
    .eq("user_id", user_id)
    .eq("symbol_id", symbol_id)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Error fetching portfolio entry:", fetchError.message);
    throw new Error("Could not fetch current portfolio entry.");
  }

  const now = new Date().toISOString();

  if (!existingEntry) {
    // No entry — insert a new one
    const { error: insertError } = await supabase_client
      .from("portfolio")
      .insert([
        {
          user_id,
          symbol_id,
          quantity,
          avg_price: price,
          first_acquired: now,
          last_updated: now,
          created_at: now,
        },
      ]);

    if (insertError) {
      console.error("❌ Error inserting new portfolio entry:", insertError.message);
      throw new Error("Could not add stock to portfolio.");
    }
  } else {
    // Entry exists — update it
    const newTotalQuantity = Number(existingEntry.quantity) + quantity;
    const newTotalCost =
      Number(existingEntry.quantity) * Number(existingEntry.avg_price) + price * quantity;
    const newAvgPrice = newTotalCost / newTotalQuantity;

    const { error: updateError } = await supabase_client
      .from("portfolio")
      .update({
        quantity: newTotalQuantity,
        avg_price: newAvgPrice.toFixed(4),
        last_updated: now,
      })
      .eq("id", existingEntry.id);

    if (updateError) {
      console.error("❌ Error updating portfolio entry:", updateError.message);
      throw new Error("Could not update stock in portfolio.");
    }
  }
}
