import supabase_client from "../../../lib/supabaseClient";

type SellInput = {
  user_id: string;
  symbol_id: number;
  price: number;
  quantity: number;
};

export async function sell({ user_id, symbol_id, price, quantity }: SellInput): Promise<void> {
  const { data: existingEntry, error: fetchError } = await supabase_client
    .from("portfolio")
    .select("id, quantity, avg_price")
    .eq("user_id", user_id)
    .eq("symbol_id", symbol_id)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Error fetching portfolio entry:", fetchError.message);
    throw new Error("Could not fetch portfolio entry.");
  }

  if (!existingEntry) {
    throw new Error("Stock not found in portfolio.");
  }

  const currentQuantity = Number(existingEntry.quantity);
  const now = new Date().toISOString();

  if (quantity > currentQuantity) {
    throw new Error("Cannot sell more shares than owned.");
  }

  if (quantity === currentQuantity) {
    // Selling all → delete the record
    const { error: deleteError } = await supabase_client
      .from("portfolio")
      .delete()
      .eq("id", existingEntry.id);

    if (deleteError) {
      console.error("❌ Error deleting portfolio entry:", deleteError.message);
      throw new Error("Could not remove stock from portfolio.");
    }
  } else {
    // Partial sell → update quantity
    const newQuantity = currentQuantity - quantity;

    const { error: updateError } = await supabase_client
      .from("portfolio")
      .update({
        quantity: newQuantity,
        last_updated: now,
      })
      .eq("id", existingEntry.id);

    if (updateError) {
      console.error("❌ Error updating portfolio entry:", updateError.message);
      throw new Error("Could not update portfolio after sale.");
    }
  }
}
