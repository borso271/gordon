import supabase_client from "../../lib/supabaseClient.js";
import fetchFormatData from "./fetch_and_format_data/fetch_and_format_data.js";
import fetch_openai_response_structured from "./api_calls/openai_structured/index.js";
import insertStockAnalysis from "./insert_data/insert_analysis_response.js";

/**
 * Processes stock analysis:
 * 1. Fetches stock data.
 * 2. Gets AI analysis.
 * 3. **Returns AI response immediately**.
 * 4. Saves analysis to the database **in the background**.
 *
 * @param {Object} parameters - Request parameters
 * @returns {Object} - AI response
 */

export async function process_analysis(parameters) {

  // console.log("process_analysis started with parameters:", parameters);
  const { symbol, asset_type, language } = parameters;
  
  try {
    // 1️⃣ Fetch stock data
    const { id, ticker_symbol, data_for_ai } = await fetchFormatData(symbol, asset_type, supabase_client);
    
    // console.log("✅ Symbol ID fetched:", id);
    // console.log("✅ Symbol fetched:", symbol);
    // console.log("✅ Financial data fetched:", data_for_ai);
    
    // 2️⃣ Get AI response (or cached result)
    const ai_response = await fetch_openai_response_structured(symbol, asset_type,id, language, data_for_ai);
    // console.log("✅ AI response fetched:", ai_response);

    // 3️⃣ ✅ Immediately return AI response before saving
    const response = { message: "Analysis complete", response: ai_response };

    // 4️⃣ 🚀 Only insert into DB if AI response is **newly generated**
   
    if (!ai_response.prestored && !ai_response.failed) {
      console.log(`📝 Saving AI response to DB for ${symbol}...`);
      const aiAnalysis = ai_response.analysis;
   
      insertStockAnalysis(id, symbol, aiAnalysis, "gpt4o_structured", language,supabase_client)
        .then(() => console.log(`✅ AI response saved for ${symbol}`))
        .catch((dbError) => console.error("❌ Error saving AI response:", dbError));
    } else {
      console.log(`⚠️ Skipping DB insert: Cached response already exists for ${symbol}`);
    }

    return response;

  } catch (error) {
    console.error("❌ Error in process_analysis:", error);
    return { message: "Analysis failed", error: error.message || "Unknown error" };
  } finally {
    console.log("process_analysis completed.");
  }
}

