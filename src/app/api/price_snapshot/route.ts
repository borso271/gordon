// app/api/price_snapshot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrUpdateSnapshot } from '../../../services/price_snapshot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, asset_type, symbol_id } = body;

    console.log("data arriving to this api is: ", symbol, asset_type, symbol_id)

    if (!symbol || !asset_type || !symbol_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await getOrUpdateSnapshot({
      symbol,
      asset_type,
      ticker_id: symbol_id
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Error in price_snapshot route:", err);
    return NextResponse.json(
      { error: "Internal Server Error", detail: err?.message },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from 'next/server';
// import supabase_client from '../../../lib/supabaseClient';
// import { fetchAndSavePolygonSnapshots } from '../../../services/polygon_snapshot';

// type TickerInput = {
//   symbol: string;
//   asset_type: "stock" | "crypto" | "etf";
//   ticker_id: number;
// };

// const TEN_MINUTES = 20 * 60 * 1000;

// export async function POST(req: NextRequest) {
//   try {
//     const { symbol_id, symbol, asset_type }: TickerInput & { symbol_id: number } = await req.json();

//     if (!symbol_id || !symbol || !asset_type) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // 1. Try to get from local DB
//     const { data: snapshot, error } = await supabase_client
//       .from('symbols_snapshot')
//       .select('*')
//       .eq('symbol_id', symbol_id)
//       .single();

//     const now = Date.now();

//     const isFresh = snapshot?.polygon_update && now - snapshot.polygon_update < TEN_MINUTES;

//     if (isFresh) {
//       return NextResponse.json({
//         ticker: snapshot.symbol,
//         current_price: snapshot.latest_price,
//         last_close: snapshot.last_close,
//         day_high: snapshot.day_high,
//         day_low: snapshot.day_low,
//         updated: snapshot.polygon_update,
//       });
//     }

//     // 2. Else fetch and save fresh data using the service
//     const updatedMap = await fetchAndSavePolygonSnapshots([
//       { symbol, asset_type, ticker_id: symbol_id }
//     ]);

//     const freshData = updatedMap[symbol];

//     if (!freshData || freshData.error) {
//       return NextResponse.json({
//         error: 'Polygon fetch failed',
//         detail: freshData?.message || ''
//       }, { status: 500 });
//     }

//     return NextResponse.json(freshData);

//   } catch (err) {
//     console.error('❌ Error in symbol_snapshot route:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
