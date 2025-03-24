import supabase_client from "../../lib/supabaseClient";
import fetch_symbol_info from "./fetch_symbol_info";

export async function getAnalystRatings(symbol: string) {
  const { id: symbol_id } = await fetch_symbol_info(symbol) || {};

  if (!symbol_id) throw new Error(`Symbol ID not found for ${symbol}`);

  const { data, error } = await supabase_client
    .from("analyst_ratings")
    .select("*")
    .eq("symbol_id", symbol_id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
