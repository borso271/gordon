import supabase_client from "../../lib/supabaseClient";

export interface SymbolDetails {
  id: number;
  ticker: string;
  name: string;
  asset_type: "stock" | "crypto" | "etf";
  sector: string;
  exchange_mic: string;
}

export interface PortfolioRow {
  symbol_id: number;
  quantity: number;
  avg_price: number;
  first_acquired: string | null;
  last_updated: string | null;
  created_at: string | null;
  symbols: SymbolDetails | null;
}

export interface FlatPortfolio {
  symbol_id: number;
  quantity: number;
  avg_price: number;
  first_acquired: string | null;
  last_updated: string | null;
  created_at: string | null;
  ticker: string;
  name: string;
  asset_type: "stock" | "crypto" |"etf";
  sector: string;
  exchange_mic: string;
}

export async function fetchUserPortfolioFlat(user_id: string): Promise<FlatPortfolio[]> {
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
        asset_type,
        sector,
        exchange_mic
      )
    `)
    .eq("user_id", user_id);

  if (error || !data) {
    console.error("❌ Error fetching user portfolio:", error?.message);
    return [];
  }

  // Type-cast the response safely
  const typedData = data as unknown as PortfolioRow[];

  // Flatten the structure
  return typedData.map((entry) => ({
    symbol_id: entry.symbol_id,
    quantity: parseFloat(entry.quantity.toString()),
    avg_price: parseFloat(entry.avg_price.toString()),
    first_acquired: entry.first_acquired,
    last_updated: entry.last_updated,
    created_at: entry.created_at,
    ticker: entry.symbols?.ticker ?? "",
    name: entry.symbols?.name ?? "",
    asset_type: entry.symbols?.asset_type ?? "stock",
    sector: entry.symbols?.sector ?? "",
    exchange_mic: entry.symbols?.exchange_mic ?? "",
  }));
}

