import supabase_client from "../../lib/supabaseClient.js";

/**
 * Suggests a list of tickers based on asset_type and sector (if applicable).
 * - If `asset_type` is "crypto", sector filtering is ignored.
 * - If `sector` is "all", it does not filter by sector.
 * - Limits the result set to 6 tickers.
 *
 * @param {Object} parameters - Object containing `language`, `sector`, and `asset_type`.
 * @param {string} parameters.language - (Currently unused, reserved for future localization).
 * @param {string} parameters.sector - Sector filter (e.g., "Technology", "Finance", or "all").
 * @param {string} parameters.asset_type - "crypto", "stock", or "all".
 * @returns {Promise<Array>} - Array of objects in the form `{ id, ticker, name }`.
 */
export async function suggest_tickers(parameters) {
  const { language, sector, asset_type } = parameters; // Language is unused for now

  try {
    let query = supabase_client
      .from("symbols")
      .select("id, ticker, name")
      .limit(6); // ✅ Limit results to 6 tickers

    // If asset_type is not "all", filter by asset_type
    if (asset_type !== "all") {
      query = query.eq("asset_type", asset_type);
    }

    // If asset_type is "stock" and sector is not "all", apply sector filter
    if (asset_type === "stock" && sector !== "all") {
      query = query.eq("sector", sector);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Error fetching suggested tickers:", error.message);
      throw error;
    }

    // Return the array of tickers or an empty array if no data
    return data || [];
  } catch (error) {
    console.error("❌ Error in suggest_tickers:", error);
    // Rethrow or return an empty array
    throw error;
  }
}
