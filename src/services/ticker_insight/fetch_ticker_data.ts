import supabase_client from "../../lib/supabaseClient";
export async function getTickerDataForTickersByIds(tickerIds: number[]) {
  if (tickerIds.length === 0) return [];

  const { data: symbols, error } = await supabase_client
    .from("symbols")
    .select(`
      id,
      ticker,
      name,
      asset_type,
      sector,
      company_profiles (
        description
      )
    `)
    .in("id", tickerIds);

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  const symbolMap: Record<number, any> = {};
  const symbolIds: number[] = [];

  for (const row of symbols) {
    const item: Record<string, any> = {};
    if (row.ticker) item.ticker = row.ticker;
    if (row.name) item.name = row.name;
    if (row.asset_type) item.asset_type = row.asset_type;
    if (row.sector) item.sector = row.sector;

    // --- FIX IS HERE ---
    // Check if company_profiles is an array and has at least one element
    if (row.company_profiles && Array.isArray(row.company_profiles) && row.company_profiles.length > 0) {
      // Access the description from the FIRST profile object in the array
      const profileDescription = row.company_profiles[0]?.description; // Use optional chaining for description too

      if (profileDescription) {
        // Use profileDescription instead of accessing the array again
        const sentences = profileDescription.match(/[^.!?]+[.!?]/g);
        if (sentences && sentences.length > 0) {
          item.description = sentences.slice(0, 2).join(" ").trim();
        }
      }
    }
    // --- END FIX ---

    symbolMap[row.id] = item;
    symbolIds.push(row.id);
  }

  const { data: indicators, error: indicatorError } = await supabase_client
    .from("external_indicators")
    .select(`symbol_id, indicator, value, timestamp`)
    .in("symbol_id", symbolIds);

  if (!indicatorError && indicators) {
    const groupedIndicators: Record<number, any[]> = {};
    for (const ind of indicators) {
      if (!groupedIndicators[ind.symbol_id]) {
        groupedIndicators[ind.symbol_id] = [];
      }
      groupedIndicators[ind.symbol_id].push(ind);
    }

    for (const [symbolIdStr, entries] of Object.entries(groupedIndicators)) {
      const symbolId = Number(symbolIdStr);
      const sorted = entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
      for (const entry of sorted) {
        if (entry.indicator && entry.value != null) {
          symbolMap[symbolId][entry.indicator] = Number(entry.value);
        }
      }
    }
  }

  return Object.entries(symbolMap).map(([id, obj]) => ({
    id: Number(id),
    ...obj,
  }));
}
