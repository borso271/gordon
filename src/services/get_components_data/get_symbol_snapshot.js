import supabase_client from "../../lib/supabaseClient.js";
async function getSymbolSnapshot(symbol, asset_type, symbol_id) {

    try {
  
      // 2. Fetch symbol snapshot using symbol_id
      const { data: snapshotData, error: snapshotError } = await supabase_client
        .from("symbols_snapshot")
        .select("*")
        .eq("symbol_id", symbol_id)
        .eq("asset_type", asset_type)
        .single(); // Again, assuming there's only one snapshot per symbol_id
  
      if (snapshotError) {
        throw new Error(`Error fetching symbol snapshot: ${snapshotError.message}`);
      }
  
      if (!snapshotData) {
        throw new Error(`No snapshot found for symbol ID: ${symbol_id}`);
      }
     
  //console.log("snapshotData is: ", snapshotData)
      return snapshotData; // Return snapshot row
  
    } catch (error) {
      console.error("getsymbolSnapshot error:", error.message);
      return null;
    }
  }

export default getSymbolSnapshot

  

  