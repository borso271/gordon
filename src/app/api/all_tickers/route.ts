import { NextResponse } from "next/server";
import supabase_client from "../../../lib/supabaseClient";
import fetchLatestPrice from "../../../services/database/fetch_latest_price";


export async function GET() {
  try {
    // Step 1: Fetch symbols, filtering non-crypto by index values
   

      const { data, error } = await supabase_client
  .from('symbols')
  .select(`
    id,
    ticker,
    name,
    sector,
    industry,
    currency,
    asset_type,
    indexes,
    symbols_snapshot (
      last_close,
      last_close_unix
    )
  `)
  .or('asset_type.eq.crypto,indexes.cs.{SP500},indexes.cs.{vanguard_etf},indexes.cs.{top_cryptos}')
  .limit(1000);

    if (error) {
      console.error('❌ Error fetching symbols:', error.message);
      return NextResponse.json(
        { message: 'Error fetching symbols' },
        { status: 500 }
      );
    }

    // Step 2: Transform and return relevant fields
    const enriched = data.map((item) => ({
      symbol_id: item.id,
      ticker: item.ticker,
      name: item.name,
      sector: item.sector,
      industry: item.industry,
      currency: item.currency,
      asset_type: item.asset_type,
      // last_close: item.symbols_snapshot?.last_close ?? null,
      // last_close_unix: item.symbols_snapshot?.last_close_unix ?? null,
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
