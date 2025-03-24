
export async function fetchRelatedSymbols(symbolId) {
    if (!symbolId) {
      return [];
    }
  
    const { data: relData, error: relError } = await supabase_client
      .from("related_symbols")
      .select("related_symbol_id")
      .eq("symbol_id", symbolId)
      .limit(6);
  
    if (relError) {
      console.error("Error fetching related_symbol_id from related_symbols:", relError);
      throw relError;
    }
  
    if (!relData || relData.length === 0) {
      return [];
    }
  
    const relatedIds = relData.map((row) => row.related_symbol_id);
  
    const { data: symData, error: symError } = await supabase_client
      .from("symbols")
      .select("id, ticker")
      .in("id", relatedIds); // .in() filters by an array of IDs
  
    if (symError) {
      console.error("Error fetching ticker from symbols:", symError);
      throw symError;
    }
  
    const tickers = symData.map((row) => row.ticker);
    return tickers;
  }
  