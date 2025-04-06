import supabase_client from "../../lib/supabaseClient";

type PortfolioItem = {
  symbol_id: number | null;
  ticker: string | null;
  name: string | null;
  currency: string | null;
  quantity: number;
  avg_price: number;
  last_price: number | null;
  first_acquired: string | null;
  last_updated: string;
  created_at: string;
  pnl: number | null; // Optional: profit/loss
};

export async function getUserPortfolio(userId: string): Promise<PortfolioItem[]> {
  const { data, error } = await supabase_client
    .from("portfolio")
    .select(`
      symbol_id,
      quantity,
      avg_price,
      first_acquired,
      last_updated,
      created_at,
      symbols (
        id,
        ticker,
        name,
        currency,
        symbols_snapshot (
          last_close
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching portfolio:", error.message);
    throw new Error("Could not fetch portfolio");
  }

  return data.map((item) => {
    const last_price = item.symbols?.symbols_snapshot?.last_close ?? null;
    const pnl = last_price !== null
      ? Number((last_price - item.avg_price) * item.quantity).toFixed(2)
      : null;

    return {
      symbol_id: item.symbols?.id ?? null,
      ticker: item.symbols?.ticker ?? null,
      name: item.symbols?.name ?? null,
      currency: item.symbols?.currency ?? null,
      quantity: Number(item.quantity),
      avg_price: Number(item.avg_price),
      last_price: last_price !== null ? Number(last_price) : null,
      first_acquired: item.first_acquired ?? null,
      last_updated: item.last_updated,
      created_at: item.created_at,
      pnl: pnl !== null ? Number(pnl) : null,
    };
  });
}
