
import fetchFormatData from "../analysis/fetch_and_format_data/fetch_and_format_data.js";


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

export async function analyze_ticker(parameters) {

  // You have two options here: overview and in depth...
  // return the data to GPT, and the TWO DIFFERENT PROMPS
  console.log("analyze_ticker started with parameters:", parameters);
  
  const { ticker_symbol, asset_type, analysis_type, language } = parameters;
  
  try {

  if (1==1 || analysis_type == "depth_analysis") {

    // 1️⃣ Fetch stock data
    const { id, data_for_ai } = await fetchFormatData(ticker_symbol, asset_type);
  
    const stringified_data = JSON.stringify(data_for_ai);
    const prompt = `This is ${ticker_symbol} financial data, to use for an in depth analysis, explains the positives, negatives of the ticker, and finally provide a conclusion.
   Before this show the ticker chart to the user by calling the function show_tickers_chart. And as you illustrate the data, show it to the user by using: show_financial_data. The data is:  ${stringified_data}`;
   
    const response = { message: "success", response: prompt};
    return response;
}

  } catch (error) {
    console.error("❌ Error in process_analysis:", error);
    return { message: "Analysis failed", error: error.message || "Unknown error" };
  } finally {
    console.log("process_analysis completed.");
  }
}
