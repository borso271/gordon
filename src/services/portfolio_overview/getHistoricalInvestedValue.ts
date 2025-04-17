import supabase_client from "../../lib/supabaseClient";

export async function getHistoricalInvestedValue(user_id: string, start_date: string) {
  const startTimestamp = new Date(start_date).getTime();

  // 1. Fetch all transactions up to the start date
  const { data: transactions, error } = await supabase_client
    .from("transactions")
    .select("symbol_id, transaction_type, quantity, price_per_unit, transaction_date")
    .eq("user_id", user_id)
    .lte("transaction_date", start_date);

  if (error || !transactions) {
    console.error("❌ Error fetching transactions:", error);
    return null;
  }

  const holdings: Record<number, number> = {};

  for (const tx of transactions) {
    const qty = parseFloat(tx.quantity);
    if (tx.transaction_type === 'buy') {
      holdings[tx.symbol_id] = (holdings[tx.symbol_id] || 0) + qty;
    } else if (tx.transaction_type === 'sell') {
      holdings[tx.symbol_id] = (holdings[tx.symbol_id] || 0) - qty;
    }
  }

  let total = 0;

  for (const [symbol_id, quantity] of Object.entries(holdings)) {
    if (quantity <= 0) continue;

    // 2. Try to get historical price for that symbol at the date
    const { data: historical, error: histErr } = await supabase_client
      .from("historical_year")
      .select("close")
      .eq("symbol_id", symbol_id)
      .eq("timestamp", startTimestamp)
      .single();

    let price: number | null = null;

    if (historical?.close) {
      price = parseFloat(historical.close);
    } else {
      // fallback: use last buy price for that symbol
      const lastBuy = transactions
        .filter(tx => tx.symbol_id == symbol_id && tx.transaction_type === 'buy')
        .slice(-1)[0];

      price = parseFloat(lastBuy?.price_per_unit ?? "0");
    }

    total += quantity * price;
  }

  return total;
}


/*

How to get the cash of the user in that date?

*/