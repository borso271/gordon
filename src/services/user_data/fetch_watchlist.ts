import supabase_client from "../../lib/supabaseClient";

type WatchlistItem = {
  id: number;
  created_at: string;
  notes: string | null;
  group_name: string | null;
  alert_price: number | null;
  priority: number | null;

  symbol_id: number | null;
    ticker: string | null;
    name: string | null;
    sector: string | null;
    currency: string | null;
    asset_type: string | null;
    last_price: number | null;
 
};

export async function getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
  const { data, error } = await supabase_client
    .from("watchlist")
    .select(`
      id,
      created_at,
      notes,
      group_name,
      alert_price,
      priority,
      symbols (
        id,
        ticker,
        name,
        sector,
        currency,
        asset_type,
        symbols_snapshot (
          last_close
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching watchlist:", error.message);
    throw new Error("Could not fetch watchlist");
  }

  // Transform and normalize the response
  return data.map((item) => ({
    id: item.id,
    created_at: item.created_at,
    notes: item.notes ?? null,
    group_name: item.group_name ?? null,
    alert_price: item.alert_price ?? null,
    priority: item.priority ?? null,

    // Flattened symbol fields
    symbol_id: item.symbols?.id ?? null,
    ticker: item.symbols?.ticker ?? null,
    name: item.symbols?.name ?? null,
    sector: item.symbols?.sector ?? null,
    currency: item.symbols?.currency ?? null,
    asset_type: item.symbols?.asset_type ?? null,
    last_price: item.symbols?.symbols_snapshot?.last_close ?? null,
  }));


}
