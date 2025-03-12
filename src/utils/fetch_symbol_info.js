/*
given a ticker symbol returns the security id for that symbol
*/

import supabase_client from "../lib/supabaseClient";
async function fetch_symbol_info(ticker_symbol) {
    try {
      const { data, error } = await supabase_client
        .from('symbols')
        .select('id, name, exchange_mic, asset_type, currency')
        .eq('ticker', ticker_symbol)
        .single(); // Ensures only one result is returned
  
      if (error) {
        throw error;
      }
  
      return data ?? null;
    } catch (error) {
      console.error("Error fetching symbol info:", error.message);
      return null;
    }
  }
  
export default fetch_symbol_info
