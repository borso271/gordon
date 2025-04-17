import supabase_client from "../../lib/supabaseClient";

export async function getUserTransactionHistory(userId, startDate, endDate) {
  let query = supabase_client
    .from("transactions")
    .select(
      `
      id,
      symbol_id,
      transaction_type,
      quantity,
      price_per_unit,
      transaction_date,
      comment,
      created_at,
      symbols (
        id,
        ticker,
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  if (startDate) {
    query = query.gte("transaction_date", startDate);
  }

  if (endDate) {
    query = query.lte("transaction_date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error.message);
    throw new Error("Could not fetch transaction history");
  }

  return data.map((item) => ({
    id: item.id,
    symbol_id: item.symbols?.id ?? null,
    ticker: item.symbols?.ticker ?? null,
    name: item.symbols?.name ?? null,
    transaction_type: item.transaction_type,
    quantity: Number(item.quantity),
    price_per_unit: Number(item.price_per_unit),
    total_value: Number(item.quantity) * Number(item.price_per_unit),
    transaction_date: item.transaction_date,
    comment: item.comment ?? null,
    created_at: item.created_at,
  }));
}
