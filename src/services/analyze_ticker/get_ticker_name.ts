import supabase_client from "../../lib/supabaseClient";

export async function getTickerName(ticker_symbol: string, asset_type: string): Promise<string | null> {
  const { data, error } = await supabase_client
    .from("symbols")
    .select("name")
    .eq("ticker", ticker_symbol)
    .eq("asset_type", asset_type)
    .limit(1)
    .single();

  if (error) {
    console.error(`❌ Error fetching name for ${ticker_symbol} (${asset_type}):`, error);
    return null;
  }

  return data?.name ?? null;
}
