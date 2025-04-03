
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

export async function show_financial_data(parameters) {
  // You have two options here: overview and in depth...
  // return the data to GPT, and the TWO DIFFERENT PROMPS
  console.log("show_financial_data started with parameters:", parameters);
  
  const { ticker, asset_type,data_type, language } = parameters;
  
  try {

    // 1️⃣ Fetch stock data
    const { id, data_for_ai, ticker_symbol} = await fetchFormatData(ticker, asset_type);
    
    let table_data;

    switch (data_type) {
        case "technical_indicators":
          // Handle technical indicators logic here
          table_data = data_for_ai["Tehnical Indicators"]
          console.log("Selected: Technical Indicators");
          break;
      
        case "cash_flow":
          // Handle cash flow logic here
          table_data = data_for_ai["Financials"]["cash_flow"]
          console.log("Selected: Cash Flow Statement");
          break;
      
        case "income_statement":
          // Handle income statement logic here
          table_data = data_for_ai["Financials"]["income_statement"]
          console.log("Selected: Income Statement");
          break;
      
        case "balance_sheet":
          // Handle balance sheet logic here
          table_data = data_for_ai["Financials"]["balance_sheet"]
          console.log("Selected: Balance Sheet");
          break;
      
        default:
          console.warn("Unknown data type:", data_type);
          break;
      }
      
    const output = { message: "success", response: {title: data_type, data: table_data}};

    return output;

  } catch (error) {
    console.error("❌ Error in process_analysis:", error);
    return { message: "Analysis failed", error: error.message || "Unknown error" };
  } finally {
    console.log("process_analysis completed.");
  }
}
