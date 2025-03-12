import supabase_client from "../../lib/supabaseClient";
/**
 * Fetch a list of tickers based on asset_type.
 * Can return "crypto", "stock", or "all".
 *
 * @param {Object} parameters - Object containing `language` and `asset_type`.
 * @param {string} parameters.language - (Currently unused, reserved for future enhancements).
 * @param {string} parameters.asset_type - "crypto", "stock", or "all".
 * @returns {Promise<Array>} Array of objects in the form { id, ticker, name }.
 */

async function return_all_tickers(parameters) {
  const { language, asset_type } = parameters; // language is unused for now

  try {
    let query = supabase_client
      .from("symbols")
      .select("id, ticker, name");

    // If asset_type is not "all", filter by asset_type
    if (asset_type !== "all") {
      query = query.eq("asset_type", asset_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Error fetching symbols:", error.message);
      throw error;
    }

    // Return the array of symbol objects or an empty array if data is null
    return data || [];
  } catch (error) {
    console.error("❌ Error in return_all_tickers:", error);
    // Rethrow or return an empty array
    throw error;
  }
}

export default return_all_tickers