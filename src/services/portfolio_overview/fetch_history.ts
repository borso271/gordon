// create table public.transactions (
//     id serial not null,
//     user_id text not null,
//     symbol_id integer not null,
//     transaction_type public.transaction_type_enum not null,
//     quantity numeric(12, 4) not null,
//     price_per_unit numeric(12, 4) not null,
//     transaction_date timestamp without time zone not null default now(),
//     comment text null,
//     created_at timestamp without time zone not null default now(),
//     constraint transactions_pkey primary key (id),
//     constraint transactions_symbol_id_fkey foreign KEY (symbol_id) references symbols (id) on delete CASCADE,
//     constraint transactions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
//   ) TABLESPACE pg_default;

import supabase_client from "../../lib/supabaseClient";

interface UserTransaction {
  id: number;
  user_id: string;
  symbol_id: number;
  transaction_type: "buy" | "sell";
  quantity: number;
  price_per_unit: number;
  transaction_date: string;
  created_at: string;
  comment: string | null;
  name: string;
  ticker: string;
  asset_type: string;
}

export async function fetchUserTransactionsSince(
  userId: string,
  startDate: string // ISO format: '2024-01-01'
): Promise<UserTransaction[]> {
  const { data, error } = await supabase_client
    .from("transactions")
    .select(
      `
      id,
      user_id,
      symbol_id,
      transaction_type,
      quantity,
      price_per_unit,
      transaction_date,
      created_at,
      comment,
      symbols (
        name,
        ticker,
        asset_type
      )
    `
    )
    .eq("user_id", userId)
    .gte("transaction_date", startDate)
    .order("transaction_date", { ascending: false });

  if (error) {
    console.error("❌ Error fetching transactions:", error);
    return [];
  }

  return (data ?? []).map((tx: any) => ({
    id: tx.id,
    user_id: tx.user_id,
    symbol_id: tx.symbol_id,
    transaction_type: tx.transaction_type,
    quantity: parseFloat(tx.quantity),
    price_per_unit: parseFloat(tx.price_per_unit),
    transaction_date: tx.transaction_date,
    created_at: tx.created_at,
    comment: tx.comment,
    name: tx.symbols?.name ?? "",
    ticker: tx.symbols?.ticker ?? "",
    asset_type: tx.symbols?.asset_type ?? "",
  }));
}
